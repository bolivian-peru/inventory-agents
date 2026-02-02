# 🚀 Deploy Your AI Sales Agent

> **15 minutes. $25/month. Your own AI employee.**

Your customers get instant answers while you sleep. No coding required.

---

## ⚡ The Stack

| Layer | What |
|-------|------|
| 🧠 Brain | Claude (Anthropic) |
| 🔧 Runtime | OpenClaw |
| 💬 Chat | Telegram |
| 📦 Products | Markdown files |

**That's it.** No databases. No complex backends. Just files and AI.

---

## 📋 Prerequisites

| Item | Where to Get It |
|------|-----------------|
| VPS Server | [Hetzner](https://hetzner.cloud/?ref=nXcA4WhTDugS) (~$15/mo) |
| Anthropic API Key | [console.anthropic.com](https://console.anthropic.com) |
| Telegram Bot Token | [@BotFather](https://t.me/BotFather) |

**Total Cost: ~$25-65/month** (you own everything)

---

## 🎯 Option 1: One-Command Deploy

```bash
# SSH to your server
ssh root@YOUR_SERVER_IP

# Run the magic
curl -fsSL https://raw.githubusercontent.com/bolivian-peru/inventory-agents/main/scripts/deploy.sh | bash
```

The script handles everything:
- ✅ Installs Node.js & OpenClaw
- ✅ Configures your AI agent
- ✅ Sets up Telegram
- ✅ Starts your agent

**Done in 5 minutes.**

---

## 🔧 Option 2: Manual Setup

### Step 1: Install Dependencies

```bash
# Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# OpenClaw
npm install -g openclaw
```

### Step 2: Configure OpenClaw

```bash
# Set your API key
export ANTHROPIC_API_KEY="sk-ant-your-key"

# Configure Claude Opus 4.5
openclaw config set agents.defaults.model.primary anthropic/claude-opus-4-5

# Enable Telegram
openclaw plugins enable telegram
```

### Step 3: Set Up Agent Workspace

```bash
mkdir -p ~/.openclaw/workspace/skills
cd ~/.openclaw/workspace

# Get the IFA templates
curl -O https://raw.githubusercontent.com/bolivian-peru/inventory-agents/main/templates/CLAUDE.md
curl -O https://raw.githubusercontent.com/bolivian-peru/inventory-agents/main/templates/SOUL.md
curl -O https://raw.githubusercontent.com/bolivian-peru/inventory-agents/main/templates/products.md
```

### Step 4: Add Telegram

```bash
openclaw channels add \
  --channel telegram \
  --name "My Shop Agent" \
  --token "YOUR_BOT_TOKEN"
```

### Step 5: Launch

```bash
# Start the gateway
openclaw gateway start

# Or install as service (recommended)
openclaw gateway install
systemctl --user start openclaw-gateway
```

---

## ✅ Verify It Works

```bash
# Check status
openclaw status

# Watch logs
openclaw logs -f
```

Then open Telegram, find your bot, send `/start`.

**Your AI employee is live.** 🎉

---

## 📦 Adding Products

Edit `~/.openclaw/workspace/products.md`:

```markdown
## Silver Moon Necklace

- **Price:** $34.00
- **Quantity:** 10 in stock
- **Materials:** Sterling silver
- **Description:** Delicate crescent moon pendant on 18" chain

Tags: jewelry, necklace, moon, silver, gift
```

Your agent instantly knows about new products. No restart needed.

---

## 🔗 Connect Etsy (Optional)

Want automatic product sync?

```bash
cd /opt
git clone https://github.com/bolivian-peru/inventory-agents
cd inventory-agents/api
npm install
cp .env.example .env
# Add your Etsy credentials
npm run build && npm start
```

Visit `https://your-domain/etsy/auth` to connect.

---

## 🐛 Troubleshooting

### Agent not responding?

```bash
openclaw status          # Is it running?
openclaw logs --lines 50 # What's it saying?
openclaw gateway restart # Turn it off and on again
```

### Telegram not connecting?

1. Check token with @BotFather
2. Verify with `openclaw status`
3. Make sure no other bot uses same token

### Products not showing?

1. Check `products.md` exists
2. Verify markdown format
3. Ask bot: "what products do you have?"

---

## 📊 Cost Breakdown

| Item | Monthly |
|------|---------|
| [Hetzner](https://hetzner.cloud/?ref=nXcA4WhTDugS) CX22 | ~$15 |
| Anthropic API | ~$10-50 |
| **Total** | **$25-65** |

**No per-message fees. No platform cuts. Pure margin.**

---

## 🔄 Updating

```bash
# Update OpenClaw
npm update -g openclaw

# Get latest templates
cd ~/.openclaw/workspace
curl -O https://raw.githubusercontent.com/bolivian-peru/inventory-agents/main/templates/CLAUDE.md
```

---

## 🆘 Support

| Resource | Link |
|----------|------|
| 📖 Docs | [This repo](https://github.com/bolivian-peru/inventory-agents) |
| 💬 Community | [Telegram](https://t.me/inventoryforagents) |
| 🐛 Issues | [GitHub Issues](https://github.com/bolivian-peru/inventory-agents/issues) |

---

<div align="center">

### Your AI employee is waiting.

**15 minutes to deploy. 24/7 customer service.**

[🌐 Website](https://inventoryforagents.xyz) · [💬 Telegram](https://t.me/inventoryforagents) · [🐦 Twitter](https://x.com/agentinventory)

---

**$IFA** — The token powering autonomous commerce

[Buy on Pump.fun](https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump)

`GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump`

</div>
