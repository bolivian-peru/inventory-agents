# FAQ — Frequently Asked Questions

> *Everything you need to know about IFA*

---

## General

### What is IFA?

**IFA (Inventory For Agents)** gives every Etsy and Shopify seller their own AI sales agent. Your agent knows your products, answers customer questions 24/7, and helps close sales.

Think of it as your first AI employee.

### Is this just another chatbot?

No. Chatbots are dumb — they follow scripts and frustrate customers.

IFA agents are different:
- They **know your products** (not generic responses)
- They **understand context** (powered by Claude Opus)
- They **sound human** (customizable personality)
- They **actually help** (not just deflect to FAQs)

### Who is this for?

- Etsy sellers
- Shopify store owners
- Small DTC brands
- Solo creators who need help scaling
- Anyone tired of answering the same questions 100x

---

## Technical

### Do I need to be technical?

**Current state:** You need to be comfortable with basic terminal commands. The deploy script does most of the work, but you'll SSH into a server.

**Coming soon:** One-click deploy with zero terminal. Join our [Telegram](https://t.me/inventoryforagents) to get notified.

### What's the tech stack?

| Component | What |
|-----------|------|
| Agent Runtime | [OpenClaw](https://github.com/openclaw/openclaw) |
| AI Model | Claude Opus 4.5 (Anthropic) |
| Hosting | Your own VPS ([Hetzner](https://hetzner.cloud/?ref=nXcA4WhTDugS) recommended) |
| Messaging | Telegram (WhatsApp coming) |

### Is my data safe?

**Yes.** Your agent runs on YOUR server. We never see:
- Your products
- Your customers
- Your conversations
- Your API keys

That's the whole point of self-hosting.

### What are the costs?

| Item | Monthly |
|------|---------|
| VPS ([Hetzner](https://hetzner.cloud/?ref=nXcA4WhTDugS) CX22) | ~$15 |
| Anthropic API | ~$10-50 (usage-based) |
| **Total** | **$25-65** |

No per-message fees. No platform cuts. Just your infrastructure costs.

---

## $IFA Token

### What is $IFA?

$IFA is the community token for IFA holders. It's how we align incentives between builders, contributors, and believers.

**Contract:** `GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump`

### What's the utility?

| Utility | Description |
|---------|-------------|
| **Bounties** | Contributors get paid in $IFA |
| **Governance** | Token holders shape the roadmap |
| **Early Access** | Priority for new features |
| **Alignment** | Community success = token success |

### Is this a good investment?

**We can't tell you that.** $IFA is an experimental community token. It could go to zero. It could moon. 

What we CAN tell you:
- We ship code daily
- The repo is open source
- The community is active
- We're building something real

DYOR. NFA.

### Where can I buy $IFA?

[Pump.fun](https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump)

---

## Features

### What messaging platforms are supported?

| Platform | Status |
|----------|--------|
| Telegram | ✅ Live |
| WhatsApp | 🚧 Q1 2026 |
| Discord | 📋 Planned |
| Instagram DM | 📋 Planned |

### Can it connect to my Etsy shop automatically?

**Coming soon.** We're waiting on Etsy API approval. Once approved:
- One-click Etsy OAuth
- Auto product sync
- Real-time inventory updates

Star the repo to get notified!

### Can I customize the agent's personality?

**Yes!** Edit `SOUL.md` in your workspace. You control:
- Voice and tone
- Personality traits
- What it will/won't say
- Brand guidelines

### Can it handle multiple languages?

Not yet, but it's on the roadmap. Claude Opus speaks many languages, so the foundation is there.

---

## Troubleshooting

### Agent not responding

```bash
# Check status
openclaw status

# Check logs
openclaw logs --lines 50

# Restart
openclaw gateway restart
```

### Telegram bot not working

1. Verify token with @BotFather
2. Check `openclaw status` for Telegram
3. Make sure no other bot uses the same token

### Products not showing up

1. Check `~/.openclaw/workspace/products.md` exists
2. Verify the format matches the template
3. Ask the bot "what products do you have?"

### API rate limits

Anthropic has rate limits. If you hit them:
- Wait a few minutes
- Consider upgrading your Anthropic tier
- Contact Anthropic support

---

## Community

### How do I get help?

1. Check this FAQ
2. Read the [docs](https://github.com/bolivian-peru/inventory-agents)
3. Join [Telegram](https://t.me/inventoryforagents)
4. Open a [GitHub issue](https://github.com/bolivian-peru/inventory-agents/issues)

### How can I contribute?

1. Fork the repo
2. Build something cool
3. Submit a PR
4. Get paid in $IFA

See [open bounties](https://github.com/bolivian-peru/inventory-agents/issues?q=label%3Abounty).

### Who's building this?

A small team of builders + a growing community of 200+ in Telegram.

We ship daily. Check the commits.

---

## Links

| Resource | URL |
|----------|-----|
| Website | [inventoryforagents.xyz](https://inventoryforagents.xyz) |
| GitHub | [bolivian-peru/inventory-agents](https://github.com/bolivian-peru/inventory-agents) |
| Telegram | [t.me/inventoryforagents](https://t.me/inventoryforagents) |
| Twitter | [@agentinventory](https://x.com/agentinventory) |
| Token | [$IFA on Pump.fun](https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump) |

---

<div align="center">

**Still have questions?**

[Join our Telegram](https://t.me/inventoryforagents) — we're friendly! 💬

</div>
