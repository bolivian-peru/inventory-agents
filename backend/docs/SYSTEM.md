# IFA Etsy Plugin - Complete System Documentation

> **Last Updated:** 2026-02-01
> **Status:** MVP Implementation (Phase 1-3 Complete, Phase 4-5 Partial)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Component Status](#component-status)
4. [Implementation Details](#implementation-details)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Security Model](#security-model)
8. [Deployment Guide](#deployment-guide)
9. [Known Gaps & TODOs](#known-gaps--todos)
10. [Troubleshooting](#troubleshooting)

---

## Executive Summary

The IFA Etsy Plugin Backend enables Etsy sellers to create AI-powered agents that:
- Manage their Etsy store inventory
- Communicate with customers via WhatsApp/Telegram
- Provide 24/7 automated customer service

### Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Runtime | Node.js | 22+ |
| Framework | Hono.js | 4.6.x |
| Database | PostgreSQL | 16 |
| Cache/Queue | Redis | 7 |
| ORM | Drizzle | 0.38.x |
| Agent Runtime | Claude Code CLI | Latest |
| Auth | JWT (jose) | 5.x |
| Encryption | AES-256-GCM | Node crypto |

### Recommended Server Specs

| Property | Recommended |
|----------|-------------|
| Provider | Any VPS (Hetzner, DigitalOcean, AWS) |
| CPU | 2+ vCPU |
| RAM | 4-8 GB |
| Storage | 40+ GB SSD |
| OS | Ubuntu 24.04 LTS |

---

## System Architecture

```
                                   INTERNET
                                      │
                    ┌─────────────────┴─────────────────┐
                    │         HETZNER VPS               │
                    │         YOUR_SERVER_IP               │
                    ├───────────────────────────────────┤
                    │                                   │
                    │  ┌─────────────────────────────┐  │
                    │  │        NGINX :443/:80       │  │
                    │  │     (SSL Termination)       │  │
                    │  └─────────────┬───────────────┘  │
                    │                │                  │
                    │  ┌─────────────▼───────────────┐  │
                    │  │      IFA API (Hono)         │  │
                    │  │         :8080               │  │
                    │  │                             │  │
                    │  │  ┌─────────┐ ┌───────────┐  │  │
                    │  │  │  Auth   │ │   Etsy    │  │  │
                    │  │  │  JWT    │ │  OAuth    │  │  │
                    │  │  └─────────┘ └───────────┘  │  │
                    │  │                             │  │
                    │  │  ┌─────────┐ ┌───────────┐  │  │
                    │  │  │ Agents  │ │ Products  │  │  │
                    │  │  │  CRUD   │ │   Sync    │  │  │
                    │  │  └─────────┘ └───────────┘  │  │
                    │  │                             │  │
                    │  └─────────────┬───────────────┘  │
                    │                │                  │
                    │  ┌─────────────▼───────────────┐  │
                    │  │      QUEUE WORKER           │  │
                    │  │    (PM2 Managed)            │  │
                    │  │                             │  │
                    │  │  ┌─────────────────────┐    │  │
                    │  │  │  Poll agent_inbox   │    │  │
                    │  │  │  FOR UPDATE SKIP    │    │  │
                    │  │  │       LOCKED        │    │  │
                    │  │  └──────────┬──────────┘    │  │
                    │  │             │               │  │
                    │  │  ┌──────────▼──────────┐    │  │
                    │  │  │  Spawn claude CLI   │    │  │
                    │  │  │  --resume session   │    │  │
                    │  │  └──────────┬──────────┘    │  │
                    │  │             │               │  │
                    │  └─────────────┼───────────────┘  │
                    │                │                  │
                    │  ┌─────────────▼───────────────┐  │
                    │  │     AGENT WORKSPACES        │  │
                    │  │  ~/.openclaw/workspaces/    │  │
                    │  │                             │  │
                    │  │  seller_sel_xxx/            │  │
                    │  │  ├── CLAUDE.md              │  │
                    │  │  ├── SOUL.md                │  │
                    │  │  ├── .mcp.json              │  │
                    │  │  └── products/              │  │
                    │  └─────────────────────────────┘  │
                    │                                   │
                    │  ┌──────────┐    ┌──────────┐     │
                    │  │PostgreSQL│    │  Redis   │     │
                    │  │  :5432   │    │  :6379   │     │
                    │  └──────────┘    └──────────┘     │
                    │                                   │
                    └───────────────────────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
          ▼                           ▼                           ▼
   ┌────────────┐             ┌────────────┐             ┌────────────┐
   │  Etsy API  │             │  WhatsApp  │             │  Telegram  │
   │  (v3 REST) │             │ (Baileys)  │             │  (grammY)  │
   └────────────┘             └────────────┘             └────────────┘
```

---

## Component Status

### ✅ Complete (Production Ready)

| Component | Status | Notes |
|-----------|--------|-------|
| **Project Setup** | ✅ | Hono, Drizzle, TypeScript configured |
| **Database Schema** | ✅ | 8 tables with migrations |
| **Seller Auth** | ✅ | Register, login, JWT with 7d expiry |
| **Etsy OAuth 2.0** | ✅ | PKCE flow, token encryption |
| **Product Sync** | ✅ | Fetch & upsert from Etsy API |
| **Agent Provisioning** | ✅ | Workspace creation, templates |
| **Queue Worker** | ✅ | Atomic job claiming, retry logic |
| **Rate Limiting** | ✅ | Redis sliding window |
| **Error Handling** | ✅ | Global handler, Zod validation |
| **Health Endpoints** | ✅ | /health, /health/ready, /health/live |

### ⚠️ Partial (Needs Work)

| Component | Status | Missing |
|-----------|--------|---------|
| **OpenClaw Gateway** | ⚠️ | WebSocket client created, not integrated into worker |
| **WhatsApp** | ⚠️ | Endpoint exists, QR code generation TODO |
| **Telegram** | ⚠️ | Endpoint exists, webhook not configured |
| **SSE Streaming** | ⚠️ | Works but no cleanup on disconnect |
| **Product Sync Worker** | ⚠️ | Manual sync only, no background job |

### ❌ Not Implemented

| Component | Status | Notes |
|-----------|--------|-------|
| **Tests** | ❌ | No unit or integration tests |
| **Monitoring** | ❌ | No Prometheus/Grafana |
| **Log Aggregation** | ❌ | Logs to console only |
| **Backups** | ❌ | No automated backup script |
| **CI/CD** | ❌ | No GitHub Actions |

---

## Implementation Details

### 1. Authentication Flow

```
User                   API                    Database
 │                      │                        │
 │ POST /auth/register  │                        │
 │ {email, password}    │                        │
 │─────────────────────>│                        │
 │                      │ Check email unique     │
 │                      │───────────────────────>│
 │                      │                        │
 │                      │ bcrypt.hash(password)  │
 │                      │ INSERT seller          │
 │                      │───────────────────────>│
 │                      │                        │
 │                      │ jose.SignJWT()         │
 │                      │ 7 day expiry           │
 │                      │                        │
 │      {token, seller} │                        │
 │<─────────────────────│                        │
```

**JWT Payload:**
```json
{
  "sellerId": "sel_abc123",
  "email": "user@example.com",
  "iat": 1706745600,
  "exp": 1707350400
}
```

### 2. Etsy OAuth Flow (PKCE)

```
User              API              Redis           Etsy
 │                 │                 │               │
 │ GET /etsy/oauth/authorize        │               │
 │────────────────>│                 │               │
 │                 │                 │               │
 │                 │ Generate:       │               │
 │                 │ - state         │               │
 │                 │ - code_verifier │               │
 │                 │ - code_challenge│               │
 │                 │                 │               │
 │                 │ SETEX oauth:{state}            │
 │                 │────────────────>│               │
 │                 │                 │               │
 │  {redirectUrl}  │                 │               │
 │<────────────────│                 │               │
 │                 │                 │               │
 │ Redirect to Etsy OAuth page      │               │
 │─────────────────────────────────────────────────>│
 │                 │                 │               │
 │<─────────────────────────────────────────────────│
 │  Callback with ?code=xxx&state=xxx              │
 │                 │                 │               │
 │ GET /etsy/oauth/callback         │               │
 │────────────────>│                 │               │
 │                 │                 │               │
 │                 │ GET oauth:{state}              │
 │                 │────────────────>│               │
 │                 │                 │               │
 │                 │ POST /oauth/token              │
 │                 │ {code, code_verifier}          │
 │                 │───────────────────────────────>│
 │                 │                 │               │
 │                 │ {access_token, refresh_token}  │
 │                 │<───────────────────────────────│
 │                 │                 │               │
 │                 │ AES-256-GCM encrypt tokens     │
 │                 │ INSERT etsy_connections        │
 │                 │                 │               │
 │ Redirect to /dashboard?etsy_connected=true      │
 │<────────────────│                 │               │
```

**Token Encryption Format:**
```
{iv}:{authTag}:{encryptedData}  (all hex encoded)
```

### 3. Agent Provisioning

```
API                     FileSystem              Database
 │                          │                      │
 │ POST /agents/provision   │                      │
 │                          │                      │
 │ Check: Etsy connected?   │                      │
 │──────────────────────────────────────────────-->│
 │                          │                      │
 │ mkdir ~/.openclaw/workspaces/seller_{id}/       │
 │─────────────────────────>│                      │
 │                          │                      │
 │ Write CLAUDE.md (from template)                 │
 │ Write SOUL.md (from template)                   │
 │ Write .mcp.json (with Etsy creds)               │
 │ Write products/inventory.json                   │
 │─────────────────────────>│                      │
 │                          │                      │
 │ INSERT agents            │                      │
 │ INSERT agent_sessions    │                      │
 │──────────────────────────────────────────────-->│
 │                          │                      │
 │ {agent}                  │                      │
```

**Workspace Structure:**
```
~/.openclaw/workspaces/seller_sel_abc123/
├── CLAUDE.md           # System prompt (auto-generated)
├── SOUL.md             # Seller instructions (customizable)
├── .mcp.json           # MCP server config
└── products/
    └── inventory.json  # Cached product data
```

### 4. Message Queue Processing

```
Queue Worker            Database           Claude CLI
     │                     │                   │
     │ Poll every 1s       │                   │
     │                     │                   │
     │ SELECT FROM agent_inbox                 │
     │ WHERE status='queued'                   │
     │ FOR UPDATE SKIP LOCKED                  │
     │────────────────────>│                   │
     │                     │                   │
     │ {job}               │                   │
     │<────────────────────│                   │
     │                     │                   │
     │ UPDATE status='processing'              │
     │────────────────────>│                   │
     │                     │                   │
     │ INSERT agent_runs   │                   │
     │────────────────────>│                   │
     │                     │                   │
     │ spawn claude --cwd {workspace}          │
     │        --resume {session_id}            │
     │        -p "{message}"                   │
     │─────────────────────────────────────────>│
     │                     │                   │
     │       stream-json events                │
     │<─────────────────────────────────────────│
     │                     │                   │
     │ INSERT agent_events (per event)         │
     │────────────────────>│                   │
     │                     │                   │
     │       exit code 0   │                   │
     │<─────────────────────────────────────────│
     │                     │                   │
     │ UPDATE agent_inbox status='done'        │
     │ UPDATE agent_runs status='completed'    │
     │────────────────────>│                   │
```

**Retry Logic:**
- Max 3 attempts
- Exponential backoff: 2^attempt seconds
- Failed jobs marked with status='failed'

---

## Database Schema

### Entity Relationship Diagram

```
┌──────────────────┐
│     sellers      │
├──────────────────┤
│ PK id            │───────────────────────────────────┐
│    email         │                                   │
│    password_hash │                                   │
│    name          │                                   │
│    status        │  "active" | "suspended"           │
│    plan          │  "free" | "pro"                   │
│    created_at    │                                   │
│    updated_at    │                                   │
└──────────────────┘                                   │
         │                                             │
         │ 1:1                                         │
         ▼                                             │
┌──────────────────┐          ┌──────────────────┐     │
│     agents       │          │ etsy_connections │     │
├──────────────────┤          ├──────────────────┤     │
│ PK id            │          │ PK id            │     │
│ FK seller_id (U) │          │ FK seller_id     │◄────┤
│    name          │          │    shop_id       │     │
│    status        │          │    shop_name     │     │
│    workspace_path│          │    access_token* │     │
│    config (JSON) │          │    refresh_token*│     │
│    soul_instruct.│          │    token_expires │     │
│    created_at    │          │    scopes[]      │     │
│    updated_at    │          │    status        │     │
└──────────────────┘          │    last_sync_at  │     │
         │                    │    created_at    │     │
         │                    └──────────────────┘     │
         │ 1:1                                         │
         ▼                                             │
┌──────────────────┐          ┌──────────────────┐     │
│  agent_sessions  │          │    products      │     │
├──────────────────┤          ├──────────────────┤     │
│ PK/FK agent_id   │          │ PK id            │     │
│    session_id    │          │ FK seller_id     │◄────┤
│    last_run_at   │          │    etsy_id       │     │
│    created_at    │          │    title         │     │
└──────────────────┘          │    description   │     │
         │                    │    price         │     │
         │ 1:N                │    quantity      │     │
         ▼                    │    state         │     │
┌──────────────────┐          │    tags[]        │     │
│   agent_inbox    │          │    images (JSON) │     │
├──────────────────┤          │    raw_data      │     │
│ PK id            │          │    synced_at     │     │
│ FK agent_id      │          │    created_at    │     │
│    kind          │          └──────────────────┘     │
│    payload (JSON)│                                   │
│    status        │          ┌──────────────────┐     │
│    priority      │          │messaging_channels│     │
│    source        │          ├──────────────────┤     │
│    attempt_count │          │ PK id            │     │
│    available_at  │          │ FK seller_id     │◄────┘
│    created_at    │          │    platform      │
│    processed_at  │          │    platform_id   │
└──────────────────┘          │    status        │
         │                    │    created_at    │
         │ 1:N                └──────────────────┘
         ▼
┌──────────────────┐          ┌──────────────────┐
│  agent_events    │          │   agent_runs     │
├──────────────────┤          ├──────────────────┤
│ PK id            │          │ PK id            │
│ FK agent_id      │          │ FK agent_id      │
│    event_type    │          │    session_id    │
│    content       │          │ FK inbox_id      │
│    metadata(JSON)│          │    status        │
│    created_at    │          │    pid           │
└──────────────────┘          │    started_at    │
                              │    finished_at   │
                              │    exit_code     │
                              │    signal        │
                              │    error         │
                              │    created_at    │
                              └──────────────────┘

* = AES-256-GCM encrypted
```

### Table Details

| Table | Rows (Est.) | Purpose |
|-------|-------------|---------|
| sellers | 100s | User accounts |
| etsy_connections | 1 per seller | OAuth tokens (encrypted) |
| products | 1000s per seller | Synced Etsy listings |
| agents | 1 per seller | Agent config & status |
| agent_sessions | 1 per agent | Claude session ID for --resume |
| agent_inbox | 100s per agent | Message queue |
| agent_events | 1000s per agent | Activity log |
| agent_runs | 10s per agent | Run history |
| messaging_channels | 0-2 per seller | WhatsApp/Telegram links |

---

## API Reference

### Authentication

#### POST /auth/register
Create a new seller account.

**Request:**
```json
{
  "email": "seller@example.com",
  "password": "minimum8chars",
  "name": "Shop Owner"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "seller": {
    "id": "sel_abc123",
    "email": "seller@example.com",
    "name": "Shop Owner",
    "plan": "free",
    "createdAt": "2026-02-01T12:00:00Z"
  }
}
```

**Errors:**
- `400` - Email already registered
- `400` - Validation failed (password too short)

---

#### POST /auth/login
Authenticate and receive JWT.

**Request:**
```json
{
  "email": "seller@example.com",
  "password": "minimum8chars"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "seller": { ... }
}
```

**Errors:**
- `401` - Invalid email or password
- `403` - Account suspended

---

#### GET /auth/me
Get current seller info.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "seller": {
    "id": "sel_abc123",
    "email": "seller@example.com",
    "name": "Shop Owner",
    "plan": "free",
    "status": "active",
    "createdAt": "2026-02-01T12:00:00Z"
  }
}
```

---

### Etsy OAuth

#### GET /etsy/oauth/authorize
Start OAuth flow. Returns URL to redirect user to.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "redirectUrl": "https://www.etsy.com/oauth/connect?..."
}
```

---

#### GET /etsy/oauth/callback
OAuth callback (called by Etsy). Redirects to frontend.

**Query Params:**
- `code` - Authorization code
- `state` - State parameter

**Redirects to:**
- Success: `{CORS_ORIGIN}/dashboard?etsy_connected=true&shop=ShopName`
- Error: `{CORS_ORIGIN}/dashboard?etsy_error={error}`

---

#### GET /etsy/oauth/connection
Get Etsy connection status.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "connected": true,
  "connection": {
    "id": "etsy_xyz789",
    "shopId": "12345678",
    "shopName": "MyEtsyShop",
    "status": "active",
    "lastSyncAt": "2026-02-01T12:00:00Z",
    "createdAt": "2026-02-01T10:00:00Z"
  }
}
```

---

#### DELETE /etsy/oauth/connection
Disconnect Etsy account.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true
}
```

---

### Products

#### GET /products
List synced products.

**Headers:** `Authorization: Bearer {token}`

**Query Params:**
- `search` - Search in title/description
- `state` - Filter by state (active, draft, sold_out)
- `limit` - Results per page (default: 50, max: 100)
- `offset` - Pagination offset

**Response:** `200 OK`
```json
{
  "products": [
    {
      "id": "prod_abc123",
      "etsyListingId": "1234567890",
      "title": "Handmade Candle",
      "description": "...",
      "price": "24.99",
      "quantity": 10,
      "state": "active",
      "tags": ["candle", "handmade"],
      "images": [...],
      "syncedAt": "2026-02-01T12:00:00Z"
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

---

#### POST /products/sync
Force sync products from Etsy.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "synced": 150
}
```

---

### Agents

#### POST /agents/provision
Create agent for seller.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "agent": {
    "id": "agt_xyz789",
    "name": "MyEtsyShop Agent",
    "status": "active",
    "workspacePath": "/root/.openclaw/workspaces/seller_sel_abc123"
  }
}
```

**Errors:**
- `400` - Agent already exists
- `400` - No Etsy connection

---

#### GET /agents/me
Get seller's agent.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "agent": {
    "id": "agt_xyz789",
    "name": "MyEtsyShop Agent",
    "status": "active",
    "workspacePath": "...",
    "soulInstructions": "...",
    "createdAt": "...",
    "updatedAt": "...",
    "session": {
      "sessionId": "abc123xyz",
      "lastRunAt": "2026-02-01T12:00:00Z"
    }
  }
}
```

---

#### POST /agents/me/send
Send message to agent.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "message": "What products do I have in stock?",
  "source": "dashboard"
}
```

**Response:** `200 OK`
```json
{
  "queued": true,
  "inboxId": "inb_abc123"
}
```

---

#### GET /agents/me/events
Get agent activity log.

**Headers:** `Authorization: Bearer {token}`

**Query Params:**
- `limit` - Number of events (default: 50)
- `before` - Pagination cursor (event ID)

**Response:** `200 OK`
```json
{
  "events": [
    {
      "id": "evt_xyz789",
      "eventType": "response",
      "content": "You have 10 products in stock...",
      "metadata": {},
      "createdAt": "2026-02-01T12:00:00Z"
    }
  ]
}
```

---

#### GET /agents/me/events/stream
SSE stream for real-time events.

**Headers:** `Authorization: Bearer {token}`

**Response:** `text/event-stream`
```
id: evt_xyz789
event: response
data: {"id":"evt_xyz789","type":"response","content":"..."}

id: evt_xyz790
event: tool_use
data: {"id":"evt_xyz790","type":"tool_use","content":"etsy_get_listings"}
```

---

#### POST /agents/me/pause
Pause agent (stops processing queue).

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "status": "paused"
}
```

---

#### POST /agents/me/resume
Resume agent.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "status": "active"
}
```

---

#### PATCH /agents/me/soul
Update soul instructions.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "soulInstructions": "Be extra friendly. Always recommend our best sellers."
}
```

**Response:** `200 OK`
```json
{
  "success": true
}
```

---

### Messaging

#### GET /messaging/channels
List connected messaging channels.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "channels": [
    {
      "id": "chn_abc123",
      "platform": "whatsapp",
      "platformId": "wa_sel_abc123",
      "status": "connected",
      "createdAt": "..."
    }
  ]
}
```

---

#### POST /messaging/whatsapp/connect
Start WhatsApp pairing. ⚠️ **QR Code not implemented**

**Response:** `200 OK`
```json
{
  "channelId": "chn_abc123",
  "status": "pending",
  "message": "WhatsApp connection initiated. QR code will be available shortly."
}
```

---

#### POST /messaging/telegram/connect
Link Telegram chat.

**Request:**
```json
{
  "chatId": "123456789"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "status": "connected"
}
```

---

#### POST /messaging/webhook
Webhook for incoming messages (called by messaging platforms).

**Request:**
```json
{
  "platform": "whatsapp",
  "platformId": "wa_sel_abc123",
  "message": "Do you have this in blue?",
  "sender": {
    "id": "customer123",
    "name": "John Doe"
  }
}
```

**Response:** `200 OK`
```json
{
  "queued": true,
  "inboxId": "inb_xyz789"
}
```

---

### Dashboard

#### GET /dashboard/overview
Get dashboard statistics.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "products": {
    "total": 150
  },
  "agent": {
    "id": "agt_xyz789",
    "name": "MyEtsyShop Agent",
    "status": "active",
    "createdAt": "..."
  },
  "etsyConnection": {
    "shopName": "MyEtsyShop",
    "status": "active",
    "lastSyncAt": "..."
  },
  "channels": {
    "whatsapp": "connected",
    "telegram": "disconnected"
  },
  "recentActivity": [...],
  "messages24h": {
    "total": 45,
    "processed": 42,
    "pending": 3
  }
}
```

---

### Health

#### GET /health
Full health check with dependencies.

**Response:** `200 OK` or `503 Service Unavailable`
```json
{
  "status": "healthy",
  "checks": {
    "api": "ok",
    "database": "ok",
    "redis": "ok"
  },
  "timestamp": "2026-02-01T12:00:00Z"
}
```

---

#### GET /health/ready
Kubernetes readiness probe.

**Response:** `200 OK`
```json
{
  "status": "ready"
}
```

---

#### GET /health/live
Kubernetes liveness probe.

**Response:** `200 OK`
```json
{
  "status": "alive"
}
```

---

## Security Model

### Authentication

| Layer | Mechanism |
|-------|-----------|
| Transport | TLS 1.3 (via Nginx) |
| Identity | JWT (HS256, 7-day expiry) |
| Password | bcrypt (12 rounds) |
| Rate Limit | 100 req/min per seller, 10 req/min for auth |

### Token Encryption

Etsy OAuth tokens are encrypted at rest:

```
Algorithm: AES-256-GCM
Key: TOKEN_ENCRYPTION_KEY (32 bytes, from env)
Format: {iv}:{authTag}:{ciphertext} (hex encoded)
```

### Secrets Management

| Secret | Location | Rotation |
|--------|----------|----------|
| JWT_SECRET | .env | Manual |
| TOKEN_ENCRYPTION_KEY | .env | Manual |
| DATABASE_URL | .env | Manual |
| ANTHROPIC_API_KEY | .env | Manual |
| ETSY_* | .env | Manual |

### Workspace Isolation

Each seller gets isolated workspace:
- Separate directory: `~/.openclaw/workspaces/seller_{id}/`
- Separate MCP config with their Etsy credentials
- Separate Claude session ID

---

## Deployment Guide

### Prerequisites

- Hetzner account with server created
- SSH key added (`~/.ssh/your_key`)
- Domain pointed to YOUR_SERVER_IP (optional)

### Quick Deploy

```bash
# SSH into server
ssh -i ~/.ssh/your_key root@YOUR_SERVER_IP

# Run install script
curl -fsSL https://raw.githubusercontent.com/YOUR_REPO/main/backend/scripts/deploy.sh | bash
```

### Manual Deploy

```bash
# 1. Copy backend to server
scp -i ~/.ssh/your_key -r ./backend root@YOUR_SERVER_IP:/opt/ifa/

# 2. SSH in
ssh -i ~/.ssh/your_key root@YOUR_SERVER_IP

# 3. Install dependencies
cd /opt/ifa/backend
npm install

# 4. Create .env
cp .env.example .env
nano .env  # Edit with real values

# 5. Run migrations
npm run migrate

# 6. Build
npm run build

# 7. Start with PM2
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

### Environment Variables

```bash
# Required
DATABASE_URL=postgres://ifa:PASSWORD@localhost:5432/ifa
REDIS_URL=redis://localhost:6379
JWT_SECRET=64-char-random-string
TOKEN_ENCRYPTION_KEY=64-char-hex-string
ETSY_API_KEY=your-etsy-api-key
ETSY_SHARED_SECRET=your-etsy-secret
ETSY_REDIRECT_URI=https://api.yourdomain.com/etsy/oauth/callback
ANTHROPIC_API_KEY=your-anthropic-api-key
CORS_ORIGIN=https://yourdomain.com

# Optional
PORT=8080
NODE_ENV=production
OPENCLAW_GATEWAY_URL=ws://127.0.0.1:18789
OPENCLAW_WORKSPACES_DIR=/root/.openclaw/workspaces
```

### SSL Setup

```bash
# Install certbot
apt install certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d api.yourdomain.com

# Auto-renewal (already configured)
systemctl status certbot.timer
```

### PM2 Commands

```bash
# Status
pm2 status

# Logs
pm2 logs ifa-api

# Restart
pm2 restart ifa-api

# Reload (zero-downtime)
pm2 reload ifa-api

# Stop
pm2 stop ifa-api
```

---

## Known Gaps & TODOs

### Critical (Must Fix Before Production)

| Issue | Location | Priority |
|-------|----------|----------|
| **WhatsApp QR code** | `routes/messaging.ts:70` | P0 |
| **No tests** | Entire codebase | P0 |
| **Token refresh race** | `services/etsy/client.ts` | P1 |
| **SSE cleanup** | `routes/agents.ts:175` | P1 |

### High Priority

| Issue | Description |
|-------|-------------|
| **Background sync** | Products only sync on demand, not periodically |
| **Deleted products** | Etsy deletions not reflected in local DB |
| **Memory limits** | Large inventories load all into memory |
| **Logging** | No log files, only console |

### Medium Priority

| Issue | Description |
|-------|-------------|
| **Telegram webhook** | Not configured, uses polling only |
| **Gateway integration** | WebSocket client created but not used |
| **Config hardcoded** | Many values in constants.ts should be env vars |
| **No monitoring** | No Prometheus metrics |

### Low Priority

| Issue | Description |
|-------|-------------|
| **No backups** | Manual backup only |
| **No CI/CD** | Deploy is manual |
| **No admin panel** | Can't manage sellers without SQL |

---

## Troubleshooting

### API Not Responding

```bash
# Check if process is running
pm2 status

# Check logs for errors
pm2 logs ifa-api --lines 100

# Restart
pm2 restart ifa-api
```

### Database Connection Failed

```bash
# Check PostgreSQL status
systemctl status postgresql

# Check connection
sudo -u postgres psql -c "SELECT 1;"

# Restart
systemctl restart postgresql
```

### Redis Connection Failed

```bash
# Check Redis status
systemctl status redis

# Test connection
redis-cli ping

# Restart
systemctl restart redis
```

### Agent Not Responding

```bash
# Check if Claude CLI is installed
which claude

# Check workspace exists
ls -la /root/.openclaw/workspaces/seller_*/

# Check queue for stuck jobs
sudo -u postgres psql -d ifa -c "SELECT * FROM agent_inbox WHERE status = 'processing';"

# Reset stuck jobs
sudo -u postgres psql -d ifa -c "UPDATE agent_inbox SET status = 'queued' WHERE status = 'processing';"
```

### Etsy Token Expired

```bash
# Check token status
sudo -u postgres psql -d ifa -c "SELECT status, token_expires_at FROM etsy_connections;"

# If expired, user must re-authenticate via /etsy/oauth/authorize
```

---

## Appendix

### File Locations

| Path | Description |
|------|-------------|
| `/opt/ifa/backend` | Application code |
| `/opt/ifa/backend/.env` | Environment variables |
| `/opt/ifa/backend/logs/` | PM2 log files |
| `/root/.openclaw/workspaces/` | Agent workspaces |
| `/var/lib/postgresql/16/main/` | PostgreSQL data |
| `/var/lib/redis/` | Redis data |
| `/etc/nginx/sites-available/ifa` | Nginx config |

### Useful Commands

```bash
# View real-time logs
pm2 logs ifa-api --lines 0

# Database shell
sudo -u postgres psql -d ifa

# Redis shell
redis-cli

# Check disk usage
df -h

# Check memory
free -h

# Check active connections
ss -tlnp
```

### Support

- GitHub Issues: https://github.com/YOUR_REPO/issues
- Etsy API Docs: https://developers.etsy.com/documentation
- Hono Docs: https://hono.dev
- Drizzle Docs: https://orm.drizzle.team
