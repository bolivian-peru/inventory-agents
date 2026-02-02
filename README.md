# 🛒 IFA — Your First AI Employee

> **Every small creator deserves an AI assistant that handles customers while they create.**

[![$IFA LIVE](https://img.shields.io/badge/%24IFA-LIVE%20ON%20PUMP.FUN-00D9FF?style=for-the-badge)](https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump)
[![Status](https://img.shields.io/badge/Status-BETA-yellow?style=for-the-badge)]()
[![OpenClaw](https://img.shields.io/badge/Powered%20by-OpenClaw-8B5CF6?style=for-the-badge)](https://github.com/openclaw/openclaw)

<p align="center">
<b>
<a href="https://inventoryforagents.xyz">Website</a> · 
<a href="https://t.me/inventoryforagents">Telegram</a> · 
<a href="https://x.com/agentinventory">Twitter</a> · 
<a href="https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump">$IFA Token</a>
</b>
</p>

---

## ⚠️ Beta Notice

**IFA is in active development.** We're building in public and shipping daily.

- ✅ Core agent infrastructure is working
- 🚧 Etsy integration pending API approval
- 🚧 Additional features rolling out over the next 2 weeks

Join our [Telegram](https://t.me/inventoryforagents) for updates and early access.

---

## 🎯 What is IFA?

You're a craftsman. You make beautiful things — handmade jewelry, custom art, vintage finds.

But selling is a full-time job:
- Answering the same questions over and over
- Missing messages while you sleep
- Choosing between creating and selling

**IFA gives you an AI assistant that handles customers while you focus on creating.**

---

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│              YOUR DEDICATED AGENT CONTAINER                 │
│                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│   │  Your       │    │    AI       │    │  Telegram/  │    │
│   │  Products   │───▶│  Assistant  │───▶│  WhatsApp   │    │
│   │  (synced)   │    │             │    │             │    │
│   └─────────────┘    └─────────────┘    └─────────────┘    │
│                                                             │
│   Each seller gets their own isolated environment.          │
│   Your data never mixes with anyone else's.                 │
└─────────────────────────────────────────────────────────────┘
```

### Your Agent Can:

| Capability | Description |
|------------|-------------|
| 📦 **Know your products** | Full catalog with prices, descriptions, stock |
| 💬 **Answer questions** | Shipping, sizing, materials, availability |
| 🎯 **Recommend products** | Help customers find what they're looking for |
| 🌙 **Work 24/7** | Answer that 3am message while you sleep |
| 🤝 **Escalate smart** | Complex issues go to you, not a dead end |

### Your Agent Won't:

- ❌ Make up products or prices
- ❌ Be pushy or salesy
- ❌ Pretend to be human
- ❌ Handle things it shouldn't

---

## 🏗️ What's In This Repo

```
inventory-agents/
├── templates/
│   ├── SOUL.md           # Agent personality & values
│   ├── CLAUDE.md         # Agent instructions
│   └── products.md       # Product catalog template
├── skills/
│   ├── product-lookup/   # Find & recommend products
│   └── customer-service/ # Handle common questions
├── scripts/
│   └── deploy.sh         # Self-hosted deployment
└── docs/
    ├── DEPLOYMENT.md     # Setup guide
    └── ETSY_PLUGIN.md    # Plugin vision (TBA)
```

This repo contains the **open-source agent infrastructure** — the templates, skills, and configuration that power every IFA agent.

---

## 🚀 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Agent Templates | ✅ Ready | SOUL.md, CLAUDE.md |
| Product Lookup Skill | ✅ Ready | Search & recommend |
| Customer Service Skill | ✅ Ready | FAQs, shipping, returns |
| Self-Hosted Deploy | ✅ Ready | For developers |
| Etsy Integration | 🕐 Pending | Awaiting API approval |
| WhatsApp Support | 🕐 TBA | Coming soon |
| Shopify Integration | 🕐 TBA | On roadmap |
| One-Click Deploy | 🕐 TBA | Building over next 2 weeks |

---

## 📱 Etsy Plugin (Coming Soon)

We're building an Etsy app that makes this dead simple:

1. Install from Etsy App Store
2. Authorize your shop
3. Connect Telegram
4. Done — your AI assistant is live

**Status:** Awaiting Etsy API developer approval. Star this repo to get notified when it launches.

---

## 🛠️ Self-Hosted (For Developers)

If you're technical and want to run your own agent now:

```bash
# Requires: VPS, Anthropic API key, Telegram bot token
curl -fsSL https://raw.githubusercontent.com/bolivian-peru/inventory-agents/main/scripts/deploy.sh | bash
```

**[📘 Full Deployment Guide →](docs/DEPLOYMENT.md)**

### Requirements

| Item | Where to Get |
|------|--------------|
| VPS Server | [Hetzner](https://hetzner.cloud/?ref=nXcA4WhTDugS) (~$15/mo) |
| Anthropic API Key | [console.anthropic.com](https://console.anthropic.com) |
| Telegram Bot Token | [@BotFather](https://t.me/BotFather) |

---

## 💎 $IFA Token

**CA:** `GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump`

$IFA is the community token for believers in autonomous commerce.

**[Buy $IFA on Pump.fun →](https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump)**

*Experimental token. No promises. DYOR.*

---

## 🗓️ Roadmap

### Next 2 Weeks
- 🔧 Improved deployment flow
- 🔧 Better product sync
- 🔧 Enhanced skills

### Q1 2026
- 📋 Etsy plugin (pending API approval)
- 📋 WhatsApp integration
- 📋 Dashboard for sellers

### Q2 2026
- 📋 Shopify integration
- 📋 Proactive outreach features
- 📋 Advanced analytics

---

## 🤝 Community

| Platform | Link |
|----------|------|
| 💬 Telegram | [t.me/inventoryforagents](https://t.me/inventoryforagents) |
| 🐦 Twitter | [@agentinventory](https://x.com/agentinventory) |
| 🌍 Website | [inventoryforagents.xyz](https://inventoryforagents.xyz) |

---

## 🛠️ Contributing

We welcome contributions and pay bounties in $IFA.

```bash
git clone https://github.com/bolivian-peru/inventory-agents
# Improve templates, skills, or docs
# Submit a PR
```

---

## ❓ FAQ

<details>
<summary><b>Is this ready to use?</b></summary>

The core infrastructure works. Self-hosted deployment is available for developers. The Etsy plugin (one-click setup) is coming once we receive API approval.
</details>

<details>
<summary><b>How much does it cost?</b></summary>

Self-hosted: ~$25-65/month (server + AI API costs)
Hosted option: Pricing TBA when plugin launches
</details>

<details>
<summary><b>Is my data safe?</b></summary>

Each seller gets their own dedicated container. Your products, conversations, and data are isolated and never shared.
</details>

<details>
<summary><b>When will the Etsy plugin be ready?</b></summary>

We're awaiting Etsy API developer approval. Join our Telegram for updates.
</details>

---

## ⚡ Built With

- **[OpenClaw](https://github.com/openclaw/openclaw)** — Agent runtime
- **[Claude](https://anthropic.com)** — AI model
- **[Hetzner](https://hetzner.cloud/?ref=nXcA4WhTDugS)** — Recommended hosting

---

<div align="center">

## The Future of Commerce is Autonomous

Every creator deserves an AI assistant.

We're building it.

**[⭐ Star this repo](https://github.com/bolivian-peru/inventory-agents)** · **[💬 Join Telegram](https://t.me/inventoryforagents)** · **[💎 $IFA Token](https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump)**

---

**MIT License** — Open source, forever.

<sub>Beta software. Features in development. $IFA is an experimental token — DYOR.</sub>

</div>
