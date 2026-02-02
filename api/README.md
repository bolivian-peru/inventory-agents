# IFA API — Etsy OAuth & Sync

> **Minimal API for Etsy integration**

This is the central API that handles Etsy OAuth. Self-hosters use this for the initial shop connection.

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |
| GET | `/status` | Configuration status |
| GET | `/etsy/auth` | Start Etsy OAuth |
| GET | `/etsy/callback` | OAuth callback |
| POST | `/etsy/sync` | Sync products |

---

## Self-Hosting the API

If you want to run your own OAuth server:

### 1. Get Etsy API Credentials

1. Go to [etsy.com/developers](https://www.etsy.com/developers)
2. Create a new app
3. Note your API Key and Shared Secret

### 2. Configure

```bash
cp .env.example .env
# Edit .env with your credentials
```

```env
ETSY_API_KEY=your-api-key
ETSY_SHARED_SECRET=your-secret
ETSY_REDIRECT_URI=https://your-domain/etsy/callback
WORKSPACE_PATH=/root/.openclaw/workspace
PORT=8080
```

### 3. Run

```bash
npm install
npm run build
npm start
```

### 4. Use

```bash
# Get OAuth URL
curl http://localhost:8080/etsy/auth

# After OAuth, sync products
curl -X POST http://localhost:8080/etsy/sync
```

---

## For Most Users

You don't need to run this API yourself!

Use the hosted version at `https://app.inventoryforagents.xyz`:

1. Visit `/etsy/auth`
2. Authorize your shop
3. Tokens saved to your workspace
4. Products synced automatically

---

## Tech Stack

- **Hono** — Fast, lightweight framework
- **TypeScript** — Type safety
- **Node.js** — Runtime

---

<div align="center">

[IFA](https://inventoryforagents.xyz) · [Docs](../docs/DEPLOYMENT.md)

</div>
