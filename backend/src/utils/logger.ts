import { env } from "../config/env.js";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const CURRENT_LEVEL = env.NODE_ENV === "production" ? "info" : "debug";

function formatLog(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const base = { timestamp, level, message, ...context };

  if (env.NODE_ENV === "production") {
    return JSON.stringify(base);
  }

  // Pretty print for development
  const prefix = `[${timestamp}] ${level.toUpperCase().padEnd(5)}`;
  if (context && Object.keys(context).length > 0) {
    return `${prefix} ${message} ${JSON.stringify(context)}`;
  }
  return `${prefix} ${message}`;
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[CURRENT_LEVEL];
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (shouldLog("debug")) {
      console.debug(formatLog("debug", message, context));
    }
  },

  info(message: string, context?: LogContext) {
    if (shouldLog("info")) {
      console.info(formatLog("info", message, context));
    }
  },

  warn(message: string, context?: LogContext) {
    if (shouldLog("warn")) {
      console.warn(formatLog("warn", message, context));
    }
  },

  error(message: string, context?: LogContext) {
    if (shouldLog("error")) {
      console.error(formatLog("error", message, context));
    }
  },
};
