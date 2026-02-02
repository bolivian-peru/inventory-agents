# 🤖 Inventory For Agents

> Open-source AI agent infrastructure for e-commerce sellers

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with Claude](https://img.shields.io/badge/AI-Claude-8B5CF6)](https://claude.ai)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6)](https://www.typescriptlang.org/)

---

## ⚠️ Project Status: Early MVP

### ✅ What Works Today:
- **Backend Infrastructure**: Production-ready API (live at app.inventoryforagents.xyz)
- **Authentication**: JWT + bcrypt, rate limiting, encryption
- **Agent System**: Workspace provisioning, job queue, process management
- **OAuth Framework**: Complete PKCE implementation for platform integrations
- **Database**: PostgreSQL with full schema, migrations, encryption

### 🚧 In Active Development:
- **Etsy Integration**: Code complete, pending Etsy API approval (1-3 weeks)
- **Messaging Channels**: WhatsApp QR generation working, full integration pending
- **Test Coverage**: Framework setup, tests being written
- **Dashboard**: Basic UI exists, production version in progress

### 📅 Planned:
- Etsy App Store listing (Q1 2026)
- Production dashboard with analytics
- Billing/subscription system
- Multi-platform support (Shopify, Amazon)

**This is real infrastructure, not vaporware** - but it's early stage. Perfect for developers who want to build on top of agent infrastructure or contribute to the platform.

---

## 🎯 Two Ways to Use IFA

### 🛍️ For Etsy Sellers (Simple)

**Install from Etsy App Store** → [Coming Q1 2026]

- 🚧 No technical knowledge required *(when App Store launches)*
- 🚧 2-minute setup *(pending Etsy approval)*
- 🚧 AI agent answers customer questions 24/7 *(backend ready)*
- 🚧 Knows your entire product catalog *(sync code complete)*

**[📖 Installation Guide](INSTALL_FROM_ETSY.md)** *(for future reference)*

### 👨‍💻 For Developers (Advanced)

**Fork and self-host** → [Developer Guide](backend/DEVELOPER_DEPLOYMENT.md)

- ✅ Full control & customization
- ✅ Open source agent infrastructure
- ✅ Use for any e-commerce platform
- ✅ Build your own service

**[📖 Developer Documentation](backend/README.md)**

---

## 🏗️ What is IFA?

**Inventory For Agents** is an AI-powered sales agent platform that enables e-commerce sellers to deploy autonomous AI assistants that:

- 📦 **Know their entire product catalog**
- 💬 **Answer customer questions 24/7** via WhatsApp/Telegram
- 🤖 **Operate autonomously** without technical knowledge
- 🔒 **Run in isolated, secure workspaces**

This is production-grade infrastructure for the AI agent economy.

---

## 📦 Repository Structure

This is a **monorepo** containing:

```
agents-inventory/
├── backend/          # Open Source AI Agent Infrastructure
│   ├── src/          # API, services, workers
│   ├── docs/         # Full documentation
│   ├── tests/        # Unit & integration tests
│   └── README.md     # Backend documentation
│
├── app/              # Frontend (Next.js)
├── components/       # UI components
└── docs/             # User documentation
```

---

## 🚀 Quick Links

| For | Link |
|-----|------|
| **Etsy Sellers** | [Install from App Store](INSTALL_FROM_ETSY.md) |
| **Developers** | [Self-Host Guide](backend/DEVELOPER_DEPLOYMENT.md) |
| **Documentation** | [Full Docs](backend/docs/) |
| **FAQ** | [Frequently Asked Questions](FAQ.md) |
| **Contributing** | [Contribution Guide](backend/CONTRIBUTING.md) |
| **Security** | [Security Policy](SECURITY.md) |
| **Live Site** | [inventoryforagents.xyz](https://www.inventoryforagents.xyz) |

---

## 💻 Technology Stack

### Backend (Open Source)
- **Hono.js** - Fast TypeScript web framework
- **PostgreSQL** - Database with Drizzle ORM
- **Redis** - Queue & cache
- **Claude AI** - Agent runtime
- **Docker** - Containerized deployment

### Frontend
- **Next.js 16** - React framework
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **TypeScript** - Type safety

---

## ✨ Features

### For End Users (Etsy Sellers)
- 🚧 One-click installation from Etsy App Store *(pending Etsy approval)*
- 🚧 Automatic product catalog sync *(code ready, needs Etsy API)*
- 🚧 24/7 customer question answering *(agent system ready, needs messaging)*
- 🚧 Multi-channel messaging (WhatsApp, Telegram) *(in progress)*
- 🚧 No technical setup required *(when App Store launches)*

### For Developers (Self-Hosting) - Available Now
- ✅ Complete agent infrastructure code
- ✅ Multi-tenant workspace isolation
- ✅ OAuth 2.0 integration framework
- ✅ Message queue with retry logic
- ✅ AES-256-GCM encryption
- ✅ JWT authentication
- ✅ Plugin-based skills system
- ✅ Comprehensive documentation

---

## 🚀 Quick Start

### Option 1: Install as Etsy Seller

1. Go to Etsy App Store (coming soon)
2. Install "Inventory for Agents"
3. Click "Allow" to authorize
4. Done!

**[Full Installation Guide](INSTALL_FROM_ETSY.md)**

### Option 2: Self-Host as Developer

```bash
# Clone repository
git clone https://github.com/bolivian-peru/agents-inventory
cd agents-inventory/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run with Docker
docker-compose up -d

# Or run directly
npm run migrate
npm run dev
```

**[Full Developer Guide](backend/DEVELOPER_DEPLOYMENT.md)**

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [INSTALL_FROM_ETSY.md](INSTALL_FROM_ETSY.md) | For Etsy sellers - simple installation |
| [FAQ.md](FAQ.md) | Frequently asked questions |
| [Backend README](backend/README.md) | Technical documentation |
| [Architecture](backend/docs/ARCHITECTURE.md) | System design & diagrams |
| [API Reference](backend/docs/SYSTEM.md) | Complete API documentation |
| [Security](SECURITY.md) | Security policy & reporting |
| [Contributing](backend/CONTRIBUTING.md) | Contribution guidelines |
| [Code of Conduct](CODE_OF_CONDUCT.md) | Community guidelines |

---

## 🤝 Contributing

We welcome contributions! Whether you're:
- Fixing bugs
- Adding features
- Improving documentation
- Creating new agent skills

See [CONTRIBUTING.md](backend/CONTRIBUTING.md) for guidelines.

---

## 🔒 Security

We take security seriously:
- ✅ AES-256-GCM encryption for OAuth tokens
- ✅ JWT authentication with bcrypt
- ✅ Rate limiting on all endpoints
- ✅ Input validation with Zod
- ✅ SQL injection prevention via ORM

**Found a vulnerability?** See [SECURITY.md](SECURITY.md) for responsible disclosure.

---

## 🌐 Community

- 💬 **Telegram**: [t.me/inventoryforagents](https://t.me/inventoryforagents)
- 🐦 **Twitter**: [@agentinventory](https://x.com/agentinventory)
- 🌍 **Website**: [inventoryforagents.xyz](https://www.inventoryforagents.xyz)
- 🐙 **GitHub**: Issues & Discussions

---

## 📄 License

**MIT License** - see [LICENSE](LICENSE) file for details.

**TL;DR**: Fork it, modify it, build with it. Commercial use allowed.

---

## 🙏 Built With

- [Claude AI](https://claude.ai) - Powers the agents
- [Hono.js](https://hono.dev) - Web framework
- [Drizzle ORM](https://orm.drizzle.team) - Database toolkit
- [Next.js](https://nextjs.org) - React framework

---

## 📞 Support

- **Email**: support@inventoryforagents.xyz
- **Documentation**: [Full docs](backend/docs/)
- **FAQ**: [Common questions](FAQ.md)
- **GitHub Issues**: [Report bugs](../../issues)

---

<div align="center">

**Built by the open source community**

[Website](https://www.inventoryforagents.xyz) • [Telegram](https://t.me/inventoryforagents) • [Twitter](https://x.com/agentinventory) • [GitHub](https://github.com/bolivian-peru/agents-inventory)

⭐ **Star this repo if you believe in AI agents for small businesses** ⭐

</div>
