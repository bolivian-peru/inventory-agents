import { EventEmitter } from "events";
import WebSocket from "ws";
import { env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

/**
 * OpenClaw Gateway Client
 *
 * Manages WebSocket connections to the OpenClaw Gateway for agent communication.
 * Currently a placeholder - OpenClaw Gateway must be running for this to work.
 *
 * Fallback: If OpenClaw Gateway is not available, use the CLI subprocess method
 * in queue-worker.ts (runClaudeCode function).
 */

export interface GatewayMessage {
  type: "message" | "command" | "ping";
  sessionId: string;
  workspacePath: string;
  content: string;
}

export interface GatewayEvent {
  type: "response" | "tool_use" | "error" | "done";
  sessionId: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export class OpenClawGateway extends EventEmitter {
  private ws: WebSocket | null = null;
  private connected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private pingInterval: NodeJS.Timeout | null = null;
  private pendingMessages: Map<string, (event: GatewayEvent) => void> = new Map();

  constructor(private gatewayUrl: string = env.OPENCLAW_GATEWAY_URL) {
    super();
  }

  /**
   * Check if OpenClaw Gateway is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Try HTTP endpoint first (if gateway has one)
      const httpUrl = this.gatewayUrl.replace("ws://", "http://").replace("wss://", "https://");
      const response = await fetch(`${httpUrl}/health`, {
        method: "GET",
        signal: AbortSignal.timeout(2000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Connect to the OpenClaw Gateway
   */
  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        logger.info("Connecting to OpenClaw Gateway", { url: this.gatewayUrl });

        this.ws = new WebSocket(this.gatewayUrl);

        this.ws.on("open", () => {
          this.connected = true;
          this.reconnectAttempts = 0;
          logger.info("Connected to OpenClaw Gateway");
          this.startPingInterval();
          resolve();
        });

        this.ws.on("close", (code: number) => {
          this.connected = false;
          this.stopPingInterval();
          logger.warn("OpenClaw Gateway connection closed", { code });
          this.handleReconnect();
        });

        this.ws.on("error", (error: Error) => {
          logger.error("OpenClaw Gateway error", { error: error.message });
          if (!this.connected) {
            reject(new Error("Failed to connect to OpenClaw Gateway"));
          }
        });

        this.ws.on("message", (data: WebSocket.Data) => {
          this.handleMessage(data.toString());
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from the gateway
   */
  disconnect(): void {
    this.stopPingInterval();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
    this.pendingMessages.clear();
  }

  /**
   * Send a message to an agent
   */
  async sendMessage(
    sessionId: string,
    workspacePath: string,
    message: string
  ): Promise<GatewayEvent> {
    if (!this.connected || !this.ws) {
      throw new Error("Not connected to OpenClaw Gateway");
    }

    return new Promise((resolve, reject) => {
      const payload: GatewayMessage = {
        type: "message",
        sessionId,
        workspacePath,
        content: message,
      };

      // Store callback for response
      this.pendingMessages.set(sessionId, (event) => {
        if (event.type === "error") {
          reject(new Error(event.content));
        } else if (event.type === "done") {
          resolve(event);
        }
      });

      // Set timeout
      const timeout = setTimeout(() => {
        this.pendingMessages.delete(sessionId);
        reject(new Error("Gateway message timeout"));
      }, 30 * 60 * 1000); // 30 minute timeout

      // Clean up on response
      const originalCallback = this.pendingMessages.get(sessionId)!;
      this.pendingMessages.set(sessionId, (event) => {
        clearTimeout(timeout);
        originalCallback(event);
      });

      // Send message
      this.ws!.send(JSON.stringify(payload));
    });
  }

  /**
   * Register a workspace with the gateway
   */
  async registerWorkspace(sessionId: string, workspacePath: string): Promise<void> {
    if (!this.connected || !this.ws) {
      throw new Error("Not connected to OpenClaw Gateway");
    }

    const payload = {
      type: "register",
      sessionId,
      workspacePath,
    };

    this.ws.send(JSON.stringify(payload));
  }

  private handleMessage(data: string): void {
    try {
      const event = JSON.parse(data) as GatewayEvent;

      // Emit event for listeners
      this.emit("event", event);

      // Handle pending message callback
      const callback = this.pendingMessages.get(event.sessionId);
      if (callback) {
        callback(event);
        if (event.type === "done" || event.type === "error") {
          this.pendingMessages.delete(event.sessionId);
        }
      }
    } catch (error) {
      logger.error("Failed to parse gateway message", { error: (error as Error).message });
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error("Max reconnect attempts reached for OpenClaw Gateway");
      this.emit("disconnected");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    logger.info(`Reconnecting to OpenClaw Gateway in ${delay}ms`, {
      attempt: this.reconnectAttempts,
    });

    setTimeout(() => {
      this.connect().catch((error) => {
        logger.error("Reconnect failed", { error: (error as Error).message });
      });
    }, delay);
  }

  private startPingInterval(): void {
    this.pingInterval = setInterval(() => {
      if (this.connected && this.ws) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000); // Ping every 30 seconds
  }

  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
}

// Singleton instance
let gatewayInstance: OpenClawGateway | null = null;

export function getGateway(): OpenClawGateway {
  if (!gatewayInstance) {
    gatewayInstance = new OpenClawGateway();
  }
  return gatewayInstance;
}

/**
 * Initialize gateway connection (optional)
 * Falls back to CLI subprocess if gateway is not available
 */
export async function initGateway(): Promise<boolean> {
  const gateway = getGateway();

  const available = await gateway.isAvailable();
  if (!available) {
    logger.warn("OpenClaw Gateway not available, using CLI subprocess fallback");
    return false;
  }

  try {
    await gateway.connect();
    return true;
  } catch (error) {
    logger.warn("Failed to connect to OpenClaw Gateway, using CLI subprocess fallback", {
      error: (error as Error).message,
    });
    return false;
  }
}
