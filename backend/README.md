# 🤖 Inventory For Agents (IFA) - Open Source Backend

> The first open-source platform to give every e-commerce seller their own AI sales agent

**⚠️ Status: MVP - Core features functional, active development**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Powered by $IFA](https://img.shields.io/badge/Token-%24IFA-00D9FF)](https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump)
[![Built with Claude](https://img.shields.io/badge/AI-Claude-8B5CF6)](https://claude.ai)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6)](https://www.typescriptlang.org/)
[![Hono.js](https://img.shields.io/badge/Hono.js-4.6-E36002)](https://hono.dev)

---

## 🎯 What This Is

**IFA** enables small Etsy/Shopify sellers to deploy personal AI agents that:
- 📦 Know their entire product catalog
- 💬 Answer customer questions 24/7 via WhatsApp/Telegram
- 🤖 Operate autonomously without technical knowledge required
- 🔒 Run in isolated, secure workspaces

**This is NOT vaporware.** This is production-grade infrastructure for the AI agent economy.

**Powered by the $IFA token ecosystem.**

---

## 🚀 Deploy Your Own (Recommended)

**Get your own AI agent infrastructure in 15 minutes**

👉 **[1-Click Deploy Guide](DEPLOY_YOUR_OWN.md)** 👈

### Why Self-Host?
- ✅ **Full Control** - Your server, your rules, your data
- ✅ **No Limits** - Unlimited messages, unlimited agents
- ✅ **Your API Key** - Use your own Anthropic credits
- ✅ **Open Source** - Fork it, modify it, own it

### Quick Deploy:
1. **Get Hetzner Server** - [Sign up here](https://hetzner.cloud/?ref=nXcA4WhTDugS) (€20 free credit)
2. **Run Script** - One command deploys everything
3. **Done** - Your AI agent backend is live

**Cost:** ~€15-30/month (server) + your Anthropic API usage

[📘 Full Deploy Guide](DEPLOY_YOUR_OWN.md)

---

## 🏗️ Architecture Highlights

### Unique Approach
- **Workspace Isolation**: Each seller gets their own Claude workspace
- **MCP Integration**: Agents access Etsy API directly via Model Context Protocol
- **Queue-based Messaging**: PostgreSQL `FOR UPDATE SKIP LOCKED` for atomic job processing
- **Markdown Configuration**: Agents configured via `CLAUDE.md` (system) + `SOUL.md` (personality)

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Hono.js (fast, lightweight, TypeScript-first) |
| **Database** | PostgreSQL 16 + Drizzle ORM |
| **Cache/Queue** | Redis 7 |
| **AI Runtime** | Claude Code CLI via OpenClaw gateway |
| **Auth** | JWT (jose) + bcrypt |
| **Encryption** | AES-256-GCM for OAuth tokens |
| **Messaging** | WhatsApp (Baileys), Telegram (grammY) |

[📖 See full architecture documentation](docs/ARCHITECTURE.md)

---

## 📊 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Authentication** | ✅ Working | JWT + bcrypt, 7-day expiry |
| **Etsy OAuth 2.0** | ✅ Working | PKCE flow, encrypted tokens |
| **Product Sync** | ✅ Working | Fetch & upsert from Etsy API |
| **Agent Provisioning** | ✅ Working | Workspace creation, templates |
| **Message Queue** | ✅ Working | Atomic job claiming, retry logic |
| **Rate Limiting** | ✅ Working | Redis sliding window |
| **Health Endpoints** | ✅ Working | /health, /ready, /live |
| **WhatsApp Integration** | ✅ Working | QR code generation implemented |
| **Telegram Integration** | 🚧 In Progress | Webhook configuration pending |
| **Skills System** | ✅ Working | Modular agent capabilities |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- PostgreSQL 16
- Redis 7
- Anthropic API key
- Etsy API credentials

### Installation

```bash
# Clone the repo
git clone https://github.com/bolivian-peru/agents-inventory
cd ifa-backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Run migrations
npm run migrate

# Start development server
npm run dev
```

### Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Run migrations
docker-compose exec api npm run migrate
```

Server runs at `http://localhost:8080`

### Deploy to Production

**Recommended:** Deploy on Hetzner Cloud

[🚀 Deploy on Hetzner](https://hetzner.cloud/?ref=nXcA4WhTDugS) (Get €20 credit with our link)

Server costs: ~€30/month for unlimited merchants

[📘 Full deployment guide](docs/SYSTEM.md)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, UML diagrams, data flows |
| [SYSTEM.md](docs/SYSTEM.md) | Complete implementation guide, API reference |
| [SECURITY_AUDIT.md](docs/SECURITY_AUDIT.md) | Security review, vulnerability analysis |
| [SKILLS.md](docs/SKILLS.md) | Agent skills system, creating new capabilities |

---

## 💎 $IFA Token Integration

### Current Utility
- ✅ Early merchant signups receive $IFA token airdrops
- ✅ Developer bounties paid in $IFA (see [BOUNTIES.md](BOUNTIES.md))
- 🚧 Token-gated premium features (coming soon)

### Roadmap
- **Q2 2026**: Agent-to-agent marketplace (agents pay $IFA for cross-shop data)
- **Q3 2026**: Skills store (install premium capabilities with $IFA)
- **Q4 2026**: DAO governance for feature voting

**$IFA is building the currency for autonomous AI agents.**

[💰 Buy $IFA](https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump) | [📊 Chart](https://dexscreener.com/solana/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump)

---

## 🛠️ Project Structure

```
ifa-backend/
├── src/
│   ├── app.ts                 # Hono app setup
│   ├── index.ts               # Server entry point
│   ├── config/                # Environment & constants
│   ├── db/
│   │   ├── schema.ts          # Drizzle ORM schema
│   │   └── migrations/        # SQL migrations
│   ├── routes/                # API endpoints
│   │   ├── auth.ts            # Register, login, me
│   │   ├── agents.ts          # Agent CRUD, messaging
│   │   ├── etsy-oauth.ts      # OAuth flow
│   │   ├── products.ts        # Inventory sync
│   │   └── messaging.ts       # WhatsApp/Telegram
│   ├── services/
│   │   ├── agents/            # Provisioner, gateway client
│   │   ├── etsy/              # OAuth handler, API client
│   │   └── messaging/         # Channel routing
│   ├── middleware/            # Auth, rate limiting, errors
│   ├── skills/                # Agent capabilities
│   │   └── inventory-analysis/
│   ├── workers/
│   │   └── queue-worker.ts    # Background job processor
│   └── utils/                 # Crypto, logging, helpers
├── templates/
│   └── agent-workspace/       # CLAUDE.md, SOUL.md templates
├── docs/                      # Full documentation
├── tests/                     # Unit & integration tests
└── docker-compose.yml         # Local development stack
```

---

## 🧪 Development

### Run Tests
```bash
npm test                    # All tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests
npm run test:coverage      # With coverage report
```

### Code Quality
```bash
npm run lint              # ESLint
npm run type-check        # TypeScript
npm run format            # Prettier
```

### Database
```bash
npm run migrate           # Run migrations
npm run db:studio         # Drizzle Studio GUI
npm run db:seed           # Seed test data
```

---

## 🤝 Contributing

We welcome contributions! This is an open-source project funded by the $IFA community.

### Ways to Contribute
1. 🐛 **Report Bugs**: Open an issue with details
2. 💡 **Propose Features**: Discuss in Discussions tab
3. 🔧 **Submit PRs**: Fix bugs, add features
4. 📖 **Improve Docs**: Help others understand the codebase
5. 💰 **Claim Bounties**: Get paid in $IFA for merged work

### Active Bounties
See [BOUNTIES.md](BOUNTIES.md) for $IFA rewards on:
- WhatsApp QR code implementation (5,000 $IFA)
- Shopify integration (5,000 $IFA)
- Test coverage >80% (3,000 $IFA)
- Mobile dashboard (2,000 $IFA)

### Contribution Guidelines
1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

[📋 See CONTRIBUTING.md for details](CONTRIBUTING.md)

---

## 🔒 Security

### Security Features
- ✅ **AES-256-GCM** encryption for OAuth tokens
- ✅ **JWT authentication** with HS256, 7-day expiry
- ✅ **bcrypt password hashing** with 12 rounds
- ✅ **Rate limiting** (100 req/min per user)
- ✅ **SQL injection prevention** via Drizzle ORM
- ✅ **Input validation** with Zod schemas

### Security Audit
We've published our [full security audit](docs/SECURITY_AUDIT.md) for transparency.

**Found a vulnerability?** Please email security@inventoryforagents.xyz (do not open public issues).

---

## 🌐 Community

- 💬 **Discord**: [Join 200+ builders](https://discord.gg/your-invite)
- 🐦 **Twitter**: [@InventoryAgents](https://twitter.com/your-handle)
- 🌍 **Website**: [inventoryforagents.xyz](https://www.inventoryforagents.xyz)
- 💎 **Token**: [$IFA on Pump.fun](https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump)

---

## 🚀 What's Next

**Shipping This Week:**
- 🔥 WhatsApp/Telegram integration
- 🔥 Beta merchant onboarding (limited)
- 🔥 Dashboard polish

**Coming Soon:**
- Shopify integration
- Advanced agent skills
- Community features

**Check the commits. We ship daily.** 📈

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

**TL;DR**: Fork it, build with it, moon with it. 🚀

---

## 🙏 Acknowledgments

Built with:
- [Claude AI](https://claude.ai) - The brains of every agent
- [Hono.js](https://hono.dev) - Blazing fast web framework
- [Drizzle ORM](https://orm.drizzle.team) - Type-safe database access
- [OpenClaw](https://github.com/openclaw/openclaw) - Agent workspace runtime

Inspired by the vision of autonomous AI agents serving humanity.

---

## ⚡ Quick Links

- 📖 [Documentation](docs/)
- 🐛 [Report Bug](https://github.com/bolivian-peru/agents-inventory/issues)
- 💡 [Request Feature](https://github.com/bolivian-peru/agents-inventory/discussions)
- 💰 [Bounties](BOUNTIES.md)
- 🔐 [Security](docs/SECURITY_AUDIT.md)
- 🏗️ [Architecture](docs/ARCHITECTURE.md)

---

<div align="center">

**Built by the $IFA community**

[Website](https://www.inventoryforagents.xyz) • [Discord](https://discord.gg/your-invite) • [Twitter](https://twitter.com/your-handle) • [Buy $IFA](https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump)

⭐ **Star this repo if you believe in the AI agent economy** ⭐

</div>
