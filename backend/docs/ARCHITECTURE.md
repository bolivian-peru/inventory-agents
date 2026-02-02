# IFA Etsy Plugin - Architecture & UML Diagrams

## Table of Contents
1. [System Overview](#system-overview)
2. [Component Diagram](#component-diagram)
3. [Sequence Diagrams](#sequence-diagrams)
4. [State Diagrams](#state-diagrams)
5. [Entity Relationship Diagram](#entity-relationship-diagram)
6. [Data Flow Diagrams](#data-flow-diagrams)

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    HETZNER VPS                                           │
│                           IP: YOUR_SERVER_IP | CCX13 | 8GB RAM                             │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐       │
│   │    Nginx     │     │   IFA API    │     │  OpenClaw    │     │   Next.js    │       │
│   │   :80/:443   │────▶│  Hono :8080  │────▶│   Gateway    │     │   Frontend   │       │
│   │  (SSL/Proxy) │     │              │     │   :18789     │     │    :3000     │       │
│   └──────────────┘     └──────┬───────┘     └──────┬───────┘     └──────────────┘       │
│                               │                     │                                    │
│                               ▼                     ▼                                    │
│   ┌──────────────────────────────────────────────────────────────────────────────┐      │
│   │                          AGENT WORKSPACES                                     │      │
│   │   /root/.openclaw/workspaces/                                                 │      │
│   │                                                                               │      │
│   │   seller_sel_abc123/          seller_sel_xyz789/                             │      │
│   │   ├── CLAUDE.md               ├── CLAUDE.md                                  │      │
│   │   ├── SOUL.md                 ├── SOUL.md                                    │      │
│   │   ├── .mcp.json               ├── .mcp.json                                  │      │
│   │   └── products/               └── products/                                  │      │
│   └──────────────────────────────────────────────────────────────────────────────┘      │
│                               │                     │                                    │
│                               ▼                     ▼                                    │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                            │
│   │  PostgreSQL  │     │    Redis     │     │ Queue Worker │                            │
│   │    :5432     │◀───▶│    :6379     │◀───▶│  (PM2 proc)  │                            │
│   └──────────────┘     └──────────────┘     └──────────────┘                            │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                         │
          ┌──────────────────────────────┼──────────────────────────────┐
          ▼                              ▼                              ▼
   ┌──────────────┐              ┌──────────────┐              ┌──────────────┐
   │   Etsy API   │              │   WhatsApp   │              │   Telegram   │
   │   (OAuth2)   │              │  (Baileys)   │              │   (grammY)   │
   └──────────────┘              └──────────────┘              └──────────────┘
```

---

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              IFA BACKEND (Hono.js)                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                           ROUTES LAYER                                   │    │
│  │                                                                          │    │
│  │  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐ │    │
│  │  │  /auth   │ │ /etsy     │ │ /agents  │ │/products │ │  /messaging   │ │    │
│  │  │          │ │ /oauth    │ │          │ │          │ │               │ │    │
│  │  │ register │ │ authorize │ │ provision│ │  list    │ │ whatsapp/     │ │    │
│  │  │ login    │ │ callback  │ │ me       │ │  sync    │ │ telegram/     │ │    │
│  │  │ me       │ │ connect   │ │ send     │ │          │ │ connect       │ │    │
│  │  └────┬─────┘ └─────┬─────┘ └────┬─────┘ └────┬─────┘ └───────┬───────┘ │    │
│  └───────┼─────────────┼────────────┼────────────┼───────────────┼─────────┘    │
│          │             │            │            │               │              │
│  ┌───────▼─────────────▼────────────▼────────────▼───────────────▼─────────┐    │
│  │                          MIDDLEWARE LAYER                                │    │
│  │                                                                          │    │
│  │  ┌────────────────┐  ┌─────────────────┐  ┌────────────────────────┐    │    │
│  │  │  JWT Auth      │  │  Rate Limiter   │  │    Error Handler       │    │    │
│  │  │  (jose)        │  │  (Redis-based)  │  │    (Global catch)      │    │    │
│  │  └────────────────┘  └─────────────────┘  └────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│          │             │            │            │               │              │
│  ┌───────▼─────────────▼────────────▼────────────▼───────────────▼─────────┐    │
│  │                          SERVICES LAYER                                  │    │
│  │                                                                          │    │
│  │  ┌────────────────────────┐  ┌────────────────────────────────────────┐ │    │
│  │  │     ETSY SERVICE       │  │           AGENT SERVICE                │ │    │
│  │  │                        │  │                                        │ │    │
│  │  │  ┌──────────────────┐  │  │  ┌──────────────┐  ┌────────────────┐ │ │    │
│  │  │  │  OAuth Handler   │  │  │  │ Provisioner  │  │  Orchestrator  │ │ │    │
│  │  │  │  (PKCE flow)     │  │  │  │ (workspace)  │  │  (lifecycle)   │ │ │    │
│  │  │  └──────────────────┘  │  │  └──────────────┘  └────────────────┘ │ │    │
│  │  │                        │  │                                        │ │    │
│  │  │  ┌──────────────────┐  │  │  ┌──────────────────────────────────┐ │ │    │
│  │  │  │   API Client     │  │  │  │       Gateway Client             │ │ │    │
│  │  │  │  (v3 REST)       │  │  │  │   (WebSocket to OpenClaw)        │ │ │    │
│  │  │  └──────────────────┘  │  │  └──────────────────────────────────┘ │ │    │
│  │  │                        │  │                                        │ │    │
│  │  │  ┌──────────────────┐  │  └────────────────────────────────────────┘ │    │
│  │  │  │  Product Sync    │  │                                             │    │
│  │  │  │  (batch import)  │  │  ┌────────────────────────────────────────┐ │    │
│  │  │  └──────────────────┘  │  │        MESSAGING SERVICE               │ │    │
│  │  │                        │  │  ┌──────────────────────────────────┐  │ │    │
│  │  └────────────────────────┘  │  │       Message Router             │  │ │    │
│  │                              │  │  (route to correct agent)        │  │ │    │
│  │                              │  └──────────────────────────────────┘  │ │    │
│  │                              └────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│          │             │            │            │               │              │
│  ┌───────▼─────────────▼────────────▼────────────▼───────────────▼─────────┐    │
│  │                           DATA LAYER                                     │    │
│  │                                                                          │    │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────────┐ │    │
│  │  │   PostgreSQL     │  │      Redis       │  │     File System        │ │    │
│  │  │   (Drizzle ORM)  │  │  (ioredis)       │  │  (Agent Workspaces)    │ │    │
│  │  │                  │  │                  │  │                        │ │    │
│  │  │  - sellers       │  │  - rate limits   │  │  ~/.openclaw/          │ │    │
│  │  │  - connections   │  │  - oauth state   │  │    workspaces/         │ │    │
│  │  │  - products      │  │  - session cache │  │      seller_{id}/      │ │    │
│  │  │  - agents        │  │  - pub/sub       │  │                        │ │    │
│  │  │  - inbox/events  │  │                  │  │                        │ │    │
│  │  └──────────────────┘  └──────────────────┘  └────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Sequence Diagrams

### 1. Seller Registration & Login

```
┌────────┐          ┌─────────┐          ┌──────────┐          ┌────────────┐
│ Seller │          │ Frontend│          │  IFA API │          │ PostgreSQL │
└───┬────┘          └────┬────┘          └────┬─────┘          └─────┬──────┘
    │                    │                    │                      │
    │  1. Fill form      │                    │                      │
    │───────────────────▶│                    │                      │
    │                    │                    │                      │
    │                    │  2. POST /auth/register                   │
    │                    │  {email, password, name}                  │
    │                    │───────────────────▶│                      │
    │                    │                    │                      │
    │                    │                    │  3. Check email exists
    │                    │                    │─────────────────────▶│
    │                    │                    │                      │
    │                    │                    │  4. Hash password    │
    │                    │                    │  (bcrypt)            │
    │                    │                    │                      │
    │                    │                    │  5. INSERT seller    │
    │                    │                    │─────────────────────▶│
    │                    │                    │                      │
    │                    │                    │  6. Generate JWT     │
    │                    │                    │  (7-day expiry)      │
    │                    │                    │                      │
    │                    │  7. {token, seller}│                      │
    │                    │◀───────────────────│                      │
    │                    │                    │                      │
    │  8. Store token    │                    │                      │
    │  in localStorage   │                    │                      │
    │◀───────────────────│                    │                      │
    │                    │                    │                      │
```

### 2. Etsy OAuth Flow (PKCE)

```
┌────────┐     ┌─────────┐     ┌─────────┐     ┌───────┐     ┌────────────┐
│ Seller │     │Frontend │     │ IFA API │     │ Redis │     │  Etsy API  │
└───┬────┘     └────┬────┘     └────┬────┘     └───┬───┘     └─────┬──────┘
    │               │               │              │               │
    │ 1. Click      │               │              │               │
    │ "Connect Etsy"│               │              │               │
    │──────────────▶│               │              │               │
    │               │               │              │               │
    │               │ 2. GET /etsy/oauth/authorize │               │
    │               │──────────────▶│              │               │
    │               │               │              │               │
    │               │               │ 3. Generate: │               │
    │               │               │ - state (random)             │
    │               │               │ - code_verifier              │
    │               │               │ - code_challenge (SHA256)    │
    │               │               │              │               │
    │               │               │ 4. Store     │               │
    │               │               │ oauth:{state}│               │
    │               │               │─────────────▶│               │
    │               │               │              │               │
    │               │ 5. {redirectUrl}             │               │
    │               │◀──────────────│              │               │
    │               │               │              │               │
    │ 6. Redirect to Etsy          │              │               │
    │◀──────────────│               │              │               │
    │               │               │              │               │
    │ 7. Login & authorize app     │              │               │
    │─────────────────────────────────────────────────────────────▶│
    │               │               │              │               │
    │ 8. Redirect to callback?code=xxx&state=xxx  │               │
    │◀─────────────────────────────────────────────────────────────│
    │               │               │              │               │
    │──────────────▶│               │              │               │
    │               │ 9. GET /etsy/oauth/callback  │               │
    │               │──────────────▶│              │               │
    │               │               │              │               │
    │               │               │ 10. Get      │               │
    │               │               │ oauth:{state}│               │
    │               │               │◀─────────────│               │
    │               │               │              │               │
    │               │               │ 11. POST /oauth/token        │
    │               │               │ {code, code_verifier}        │
    │               │               │─────────────────────────────▶│
    │               │               │              │               │
    │               │               │ 12. {access_token,           │
    │               │               │     refresh_token}           │
    │               │               │◀─────────────────────────────│
    │               │               │              │               │
    │               │               │ 13. Encrypt tokens           │
    │               │               │ (AES-256-GCM)│               │
    │               │               │              │               │
    │               │               │ 14. INSERT etsy_connections  │
    │               │               │──────────────────────────────▶
    │               │               │              │               │
    │               │               │ 15. Trigger product sync     │
    │               │               │              │               │
    │               │ 16. Success! │               │               │
    │               │◀──────────────│              │               │
    │ 17. Show      │               │              │               │
    │ connected     │               │              │               │
    │◀──────────────│               │              │               │
```

### 3. Agent Provisioning

```
┌────────┐     ┌─────────┐     ┌─────────┐     ┌────────────┐     ┌───────────┐
│ Seller │     │ IFA API │     │  Queue  │     │ File System│     │ PostgreSQL│
└───┬────┘     └────┬────┘     └────┬────┘     └─────┬──────┘     └─────┬─────┘
    │               │               │                │                  │
    │ 1. POST       │               │                │                  │
    │ /agents/provision             │                │                  │
    │──────────────▶│               │                │                  │
    │               │               │                │                  │
    │               │ 2. Check: seller has Etsy connection?            │
    │               │─────────────────────────────────────────────────▶│
    │               │               │                │                  │
    │               │ 3. Check: agent doesn't exist already?           │
    │               │─────────────────────────────────────────────────▶│
    │               │               │                │                  │
    │               │ 4. INSERT agent                │                  │
    │               │ (status: provisioning)         │                  │
    │               │─────────────────────────────────────────────────▶│
    │               │               │                │                  │
    │               │ 5. Create workspace directory  │                  │
    │               │ ~/.openclaw/workspaces/seller_{id}/              │
    │               │───────────────────────────────▶│                  │
    │               │               │                │                  │
    │               │ 6. Generate CLAUDE.md from template              │
    │               │ (inject shop data, products)   │                  │
    │               │───────────────────────────────▶│                  │
    │               │               │                │                  │
    │               │ 7. Generate SOUL.md            │                  │
    │               │───────────────────────────────▶│                  │
    │               │               │                │                  │
    │               │ 8. Generate .mcp.json          │                  │
    │               │ (etsy-mcp-server config)       │                  │
    │               │───────────────────────────────▶│                  │
    │               │               │                │                  │
    │               │ 9. INSERT agent_sessions       │                  │
    │               │─────────────────────────────────────────────────▶│
    │               │               │                │                  │
    │               │ 10. UPDATE agent               │                  │
    │               │ (status: active)               │                  │
    │               │─────────────────────────────────────────────────▶│
    │               │               │                │                  │
    │               │ 11. Queue initial message      │                  │
    │               │ "Sync my Etsy shop"            │                  │
    │               │──────────────▶│                │                  │
    │               │               │                │                  │
    │ 12. {agent}   │               │                │                  │
    │◀──────────────│               │                │                  │
```

### 4. Message Processing (Queue Worker)

```
┌─────────────┐     ┌────────────┐     ┌──────────┐     ┌──────────┐
│Queue Worker │     │ PostgreSQL │     │ OpenClaw │     │ Workspace│
└──────┬──────┘     └─────┬──────┘     └────┬─────┘     └────┬─────┘
       │                  │                 │                │
       │ 1. Poll every 1s │                 │                │
       │ SELECT FROM agent_inbox            │                │
       │ WHERE status='queued'              │                │
       │ FOR UPDATE SKIP LOCKED             │                │
       │─────────────────▶│                 │                │
       │                  │                 │                │
       │ 2. Job claimed   │                 │                │
       │◀─────────────────│                 │                │
       │                  │                 │                │
       │ 3. UPDATE inbox  │                 │                │
       │ status='processing'                │                │
       │─────────────────▶│                 │                │
       │                  │                 │                │
       │ 4. Get agent workspace path        │                │
       │─────────────────▶│                 │                │
       │                  │                 │                │
       │ 5. Spawn Claude Code process       │                │
       │ claude --cwd {workspace}           │                │
       │ --resume {session_id}              │                │
       │ -p "{message}"   │                 │                │
       │──────────────────────────────────▶│                │
       │                  │                 │                │
       │                  │                 │ 6. Read CLAUDE.md
       │                  │                 │───────────────▶│
       │                  │                 │                │
       │                  │                 │ 7. Load MCP servers
       │                  │                 │ (etsy-mcp-server)
       │                  │                 │───────────────▶│
       │                  │                 │                │
       │                  │                 │ 8. Process message
       │                  │                 │ (use tools, API calls)
       │                  │                 │                │
       │ 9. Stream events │                 │                │
       │◀──────────────────────────────────│                │
       │                  │                 │                │
       │ 10. INSERT agent_events            │                │
       │ (for each tool use, response)      │                │
       │─────────────────▶│                 │                │
       │                  │                 │                │
       │ 11. Process completes              │                │
       │◀──────────────────────────────────│                │
       │                  │                 │                │
       │ 12. UPDATE inbox │                 │                │
       │ status='done'    │                 │                │
       │─────────────────▶│                 │                │
```

### 5. WhatsApp/Telegram Message Flow

```
┌──────────┐     ┌──────────┐     ┌─────────┐     ┌─────────┐     ┌──────────┐
│ Customer │     │ WhatsApp │     │ IFA API │     │  Queue  │     │  Agent   │
│          │     │ /Telegram│     │         │     │ Worker  │     │          │
└────┬─────┘     └────┬─────┘     └────┬────┘     └────┬────┘     └────┬─────┘
     │                │                │               │               │
     │ 1. Send message│                │               │               │
     │ "Hi, do you    │                │               │               │
     │ have blue?"    │                │               │               │
     │───────────────▶│                │               │               │
     │                │                │               │               │
     │                │ 2. Webhook     │               │               │
     │                │ POST /messaging/webhook        │               │
     │                │───────────────▶│               │               │
     │                │                │               │               │
     │                │                │ 3. Lookup seller by          │
     │                │                │ platform_id (phone/chat_id)  │
     │                │                │               │               │
     │                │                │ 4. INSERT     │               │
     │                │                │ agent_inbox   │               │
     │                │                │ kind='seller_message'        │
     │                │                │ source='whatsapp'            │
     │                │                │──────────────▶│               │
     │                │                │               │               │
     │                │                │               │ 5. Process    │
     │                │                │               │ (see flow #4) │
     │                │                │               │──────────────▶│
     │                │                │               │               │
     │                │                │               │ 6. Agent      │
     │                │                │               │ response      │
     │                │                │               │◀──────────────│
     │                │                │               │               │
     │                │                │ 7. Send reply │               │
     │                │                │ via platform API              │
     │                │◀───────────────│               │               │
     │                │                │               │               │
     │ 8. Receive     │                │               │               │
     │ "Yes! We have  │                │               │               │
     │ blue in M, L"  │                │               │               │
     │◀───────────────│                │               │               │
```

---

## State Diagrams

### Agent Status States

```
                                    ┌──────────────────┐
                                    │                  │
                                    │   (not exists)   │
                                    │                  │
                                    └────────┬─────────┘
                                             │
                                             │ POST /agents/provision
                                             ▼
                              ┌──────────────────────────────┐
                              │                              │
                              │        PROVISIONING          │
                              │                              │
                              │  - Creating workspace        │
                              │  - Generating CLAUDE.md      │
                              │  - Setting up MCP            │
                              │                              │
                              └──────────────┬───────────────┘
                                             │
                          ┌──────────────────┴───────────────────┐
                          │                                      │
                          │ Success                              │ Failure
                          ▼                                      ▼
         ┌───────────────────────────────┐        ┌──────────────────────────┐
         │                               │        │                          │
         │            ACTIVE             │        │          ERROR           │
         │                               │        │                          │
         │  - Ready to receive messages  │        │  - Provisioning failed   │
         │  - Processing queue           │        │  - Check logs            │
         │  - Connected to messaging     │        │                          │
         │                               │        └──────────────┬───────────┘
         └───────────────┬───────────────┘                       │
                         │                                       │
          ┌──────────────┴──────────────┐                       │
          │                             │                        │
          │ POST /agents/me/pause       │ Retry                  │
          ▼                             │                        │
┌───────────────────────────┐           │                        │
│                           │           │                        │
│          PAUSED           │───────────┴────────────────────────┘
│                           │    POST /agents/me/resume
│  - Not processing queue   │
│  - Messages queued        │
│                           │
└───────────────────────────┘
```

### Etsy Connection Status States

```
                    ┌──────────────────┐
                    │                  │
                    │   (not exists)   │
                    │                  │
                    └────────┬─────────┘
                             │
                             │ OAuth callback success
                             ▼
          ┌──────────────────────────────────┐
          │                                  │
          │             ACTIVE               │
          │                                  │
          │  - Valid access token            │
          │  - Can sync products             │
          │  - Can use Etsy MCP              │
          │                                  │
          └──────────────┬───────────────────┘
                         │
      ┌──────────────────┴──────────────────┐
      │                                     │
      │ Token expires                       │ User disconnects
      │ (refresh failed)                    │ DELETE /etsy/connection
      ▼                                     ▼
┌─────────────────────┐          ┌─────────────────────┐
│                     │          │                     │
│       EXPIRED       │          │       REVOKED       │
│                     │          │                     │
│  - Need re-auth     │          │  - User removed     │
│  - Prompt user      │          │  - Clean up data    │
│                     │          │                     │
└──────────┬──────────┘          └─────────────────────┘
           │
           │ Re-authorize
           ▼
     Back to ACTIVE
```

### Agent Inbox Status States

```
                    ┌──────────────────┐
                    │                  │
                    │     QUEUED       │
                    │                  │
                    │  - Waiting       │
                    │  - In priority   │
                    │    order         │
                    │                  │
                    └────────┬─────────┘
                             │
                             │ Worker claims job
                             │ (FOR UPDATE SKIP LOCKED)
                             ▼
          ┌──────────────────────────────────┐
          │                                  │
          │           PROCESSING             │
          │                                  │
          │  - Worker executing              │
          │  - Agent running                 │
          │  - Streaming events              │
          │                                  │
          └──────────────┬───────────────────┘
                         │
      ┌──────────────────┴──────────────────┐
      │                                     │
      │ Success                             │ Error
      ▼                                     ▼
┌─────────────────────┐          ┌─────────────────────┐
│                     │          │                     │
│        DONE         │          │       FAILED        │
│                     │          │                     │
│  - Completed        │          │  - Error logged     │
│  - Response stored  │          │  - May retry        │
│                     │          │    (if attempt <3)  │
│                     │          │                     │
└─────────────────────┘          └──────────┬──────────┘
                                            │
                                            │ Retry (if eligible)
                                            ▼
                                      Back to QUEUED
                                      (increased attempt_count)
```

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE SCHEMA                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│       SELLERS        │
├──────────────────────┤
│ PK id                │──────────────────────────────────────┐
│    email      UNIQUE │                                      │
│    password_hash     │                                      │
│    name              │                                      │
│    status            │                                      │
│    plan              │                                      │
│    created_at        │                                      │
│    updated_at        │                                      │
└──────────────────────┘                                      │
         │                                                    │
         │ 1:1                                                │
         ▼                                                    │
┌──────────────────────┐          ┌──────────────────────┐   │
│       AGENTS         │          │   ETSY_CONNECTIONS   │   │
├──────────────────────┤          ├──────────────────────┤   │
│ PK id                │          │ PK id                │   │
│ FK seller_id  UNIQUE │◀─────────│ FK seller_id         │◀──┤
│    name              │          │    shop_id           │   │
│    status            │          │    shop_name         │   │
│    workspace_path    │          │    access_token_enc  │   │
│    config     JSONB  │          │    refresh_token_enc │   │
│    soul_instructions │          │    token_expires_at  │   │
│    created_at        │          │    scopes     ARRAY  │   │
│    updated_at        │          │    status            │   │
└──────────────────────┘          │    last_sync_at      │   │
         │                        │    created_at        │   │
         │ 1:1                    └──────────────────────┘   │
         ▼                                                    │
┌──────────────────────┐                                      │
│   AGENT_SESSIONS     │                                      │
├──────────────────────┤          ┌──────────────────────┐   │
│ PK/FK agent_id       │          │      PRODUCTS        │   │
│    session_id        │          ├──────────────────────┤   │
│    last_run_at       │          │ PK id                │   │
│    created_at        │          │ FK seller_id         │◀──┤
└──────────────────────┘          │    etsy_listing_id   │   │
         │                        │    title             │   │
         │ 1:N                    │    description       │   │
         │                        │    price             │   │
┌────────┴────────┐               │    quantity          │   │
│                 │               │    state             │   │
▼                 ▼               │    tags       ARRAY  │   │
┌──────────────────────┐          │    images     JSONB  │   │
│    AGENT_INBOX       │          │    raw_data   JSONB  │   │
├──────────────────────┤          │    synced_at         │   │
│ PK id                │          │    created_at        │   │
│ FK agent_id          │          └──────────────────────┘   │
│    kind              │                                      │
│    payload    JSONB  │          ┌──────────────────────┐   │
│    status            │          │  MESSAGING_CHANNELS  │   │
│    priority          │          ├──────────────────────┤   │
│    source            │          │ PK id                │   │
│    attempt_count     │          │ FK seller_id         │◀──┘
│    available_at      │          │    platform          │
│    created_at        │          │    platform_id       │
│    processed_at      │          │    status            │
└──────────────────────┘          │    created_at        │
         │                        └──────────────────────┘
         │ 1:N
         ▼
┌──────────────────────┐          ┌──────────────────────┐
│    AGENT_EVENTS      │          │     AGENT_RUNS       │
├──────────────────────┤          ├──────────────────────┤
│ PK id                │          │ PK id                │
│ FK agent_id          │          │ FK agent_id          │
│    event_type        │          │    session_id        │
│    content           │          │ FK inbox_id          │
│    metadata   JSONB  │          │    status            │
│    created_at        │          │    pid               │
└──────────────────────┘          │    started_at        │
                                  │    finished_at       │
                                  │    exit_code         │
                                  │    signal            │
                                  │    error             │
                                  │    created_at        │
                                  └──────────────────────┘
```

---

## Data Flow Diagrams

### Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          COMPLETE USER JOURNEY                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘

  PHASE 1: ONBOARDING
  ═══════════════════

    ┌────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
    │  User  │────▶│ Register │────▶│  Login   │────▶│  JWT     │
    │        │     │          │     │          │     │  Token   │
    └────────┘     └──────────┘     └──────────┘     └──────────┘
                                                           │
                                                           ▼
  PHASE 2: ETSY INTEGRATION
  ═════════════════════════

    ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
    │  Start   │────▶│  OAuth   │────▶│  Token   │────▶│  Store   │
    │  OAuth   │     │  Flow    │     │ Exchange │     │  Tokens  │
    └──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                           │
                                                           ▼
  PHASE 3: PRODUCT SYNC
  ═════════════════════

    ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
    │  Fetch   │────▶│  Parse   │────▶│  Store   │────▶│  Index   │
    │ Listings │     │  Data    │     │  in DB   │     │Products  │
    └──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                           │
                                                           ▼
  PHASE 4: AGENT CREATION
  ═══════════════════════

    ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
    │ Create   │────▶│ Generate │────▶│ Register │────▶│  Agent   │
    │Workspace │     │ Prompts  │     │  with    │     │  Active  │
    │          │     │ + MCP    │     │ Gateway  │     │          │
    └──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                           │
                                                           ▼
  PHASE 5: MESSAGING SETUP
  ════════════════════════

    ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
    │  Scan    │────▶│ Session  │────▶│ Register │────▶│  Ready   │
    │  QR      │     │ Created  │     │ Channel  │     │  to Chat │
    └──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                           │
                                                           ▼
  PHASE 6: OPERATION
  ══════════════════

    ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
    │ Customer │────▶│ Message  │────▶│  Agent   │────▶│ Response │
    │ Message  │     │ Queued   │     │ Process  │     │  Sent    │
    └──────────┘     └──────────┘     └──────────┘     └──────────┘
                           │                                 │
                           └─────────────────────────────────┘
                                    Continuous Loop
```

### Token Refresh Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          ETSY TOKEN REFRESH FLOW                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

    ┌────────────────┐
    │  API Request   │
    │  needs token   │
    └───────┬────────┘
            │
            ▼
    ┌────────────────┐      ┌───────────────┐
    │  Check token   │─────▶│   Token OK    │─────▶ Use token for API call
    │  expiry        │  OK  │   (< 5 min    │
    └───────┬────────┘      │    to expiry) │
            │               └───────────────┘
            │ EXPIRED
            ▼
    ┌────────────────┐
    │  Get refresh   │
    │  token from DB │
    └───────┬────────┘
            │
            ▼
    ┌────────────────┐      ┌───────────────┐
    │  Call Etsy     │─────▶│  New tokens   │
    │  /oauth/token  │  OK  │  received     │
    └───────┬────────┘      └───────┬───────┘
            │                       │
            │ FAILED                ▼
            ▼               ┌───────────────┐
    ┌────────────────┐      │  Encrypt new  │
    │  Mark status   │      │  tokens       │
    │  as EXPIRED    │      └───────┬───────┘
    └───────┬────────┘              │
            │                       ▼
            ▼               ┌───────────────┐
    ┌────────────────┐      │  Update DB    │
    │  Notify user   │      │  with tokens  │
    │  to re-auth    │      └───────┬───────┘
    └────────────────┘              │
                                    ▼
                            Use new token for API call
```

---

## Summary

This architecture provides:

1. **Isolation**: Each seller gets their own agent workspace
2. **Scalability**: Queue-based processing handles load spikes
3. **Reliability**: Atomic job claiming prevents race conditions
4. **Security**: Encrypted tokens, JWT auth, workspace isolation
5. **Observability**: Event logging for all agent activity
6. **Resumability**: Session persistence for agent memory
