# 🤖 ClawdBot Deployment Guide

> **Deploy AI-powered Telegram bots in 15 minutes using OpenClaw + Claude**

---

## 🎯 Architecture

```
User → Telegram → OpenClaw Gateway → Claude Opus → Response
```

**That's it!** No custom backend required for basic AI bot functionality.

**Coming Soon**: Etsy shop integration (pending Etsy API approval)

---

## 🚀 15-Minute Deployment

### Prerequisites

- VPS server (Hetzner recommended, ~$15/month)
- Telegram bot token (from [@BotFather](https://t.me/BotFather))
- Anthropic API key ([get one here](https://console.anthropic.com))

### Step 1: Create Your Telegram Bot (2 min)

Open Telegram → Search for **@BotFather**

```
/newbot
Name: Your Bot Name
Username: yourbot_bot
```

Save the token: `1234567890:ABCdef...`

### Step 2: Set Up Server (3 min)

```bash
# SSH to your VPS
ssh root@your-server-ip

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install OpenClaw globally
npm install -g openclaw

# Verify installation
openclaw --version  # Should show 2026.1.30 or later
```

### Step 3: Configure OpenClaw (5 min)

```bash
# Set up basic config
mkdir -p ~/.openclaw
openclaw config set gateway.mode local
openclaw config set agents.defaults.model.primary anthropic/claude-opus-4-5

# Set API keys in systemd service
SERVICE_FILE=~/.config/systemd/user/openclaw-gateway.service
mkdir -p ~/.config/systemd/user

# Add environment variables to systemd service
# (Replace with your actual keys)
cat >> $SERVICE_FILE << 'EOF'
[Service]
Environment="ANTHROPIC_API_KEY=your-anthropic-key-here"
Environment="OPENCLAW_TELEGRAM_TOKEN=your-telegram-bot-token-here"
EOF

# Create required directories
mkdir -p ~/.openclaw/agents/main/sessions
mkdir -p ~/.openclaw/credentials
```

### Step 4: Enable Telegram Plugin (2 min)

```bash
# Enable the Telegram channel plugin
openclaw plugins enable telegram

# Reload systemd configuration
systemctl --user daemon-reload

# Install and start gateway
openclaw gateway install
systemctl --user start openclaw-gateway.service

# Verify it's running
openclaw gateway status  # Should show "running"
```

### Step 5: Configure Telegram Channel (3 min)

```bash
# Add your Telegram bot
openclaw channels add \
  --channel telegram \
  --account default \
  --name "My AI Bot" \
  --token "YOUR_TELEGRAM_BOT_TOKEN"

# Verify channel is active
openclaw channels status
# Should show: "Telegram default: enabled, configured, running"
```

### Step 6: Approve Your Access

1. Open Telegram and message your bot
2. You'll receive a pairing code
3. On the server, approve it:

```bash
openclaw pairing approve telegram <YOUR_PAIRING_CODE>
```

4. Message the bot again - it should now respond with AI! 🎉

---

## 🧪 Testing

Send these messages to your bot:

- `/start` - Welcome message
- `Hello!` - Natural conversation
- `What can you do?` - Bot capabilities
- Any question - AI-powered response using Claude Opus 4.5

---

## 📊 Production Monitoring

### Check Status

```bash
# Gateway health
openclaw gateway status
openclaw doctor

# Check logs
journalctl --user -u openclaw-gateway.service -n 100

# Channel status
openclaw channels status
```

### Using PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Stop systemd service
systemctl --user stop openclaw-gateway.service
systemctl --user disable openclaw-gateway.service

# Start with PM2 for better monitoring
pm2 start "openclaw gateway" --name openclaw-gateway
pm2 save
pm2 startup

# Monitor
pm2 status
pm2 logs openclaw-gateway
```

---

## 💰 Cost Breakdown

| Component | Cost/Month | Notes |
|-----------|-----------|-------|
| **VPS** | $15 | Hetzner CCX13 (8GB RAM) |
| **Anthropic API** | $10-50 | Pay per usage |
| **Total** | **$25-65/month** | Scales with usage |

**No per-user fees. Full control. Self-hosted.**

---

## 🔒 Security

✅ **Self-hosted** - You own the data
✅ **No data sharing** - Everything on your server
✅ **Encrypted** - TLS for all API calls
✅ **Token auth** - Secure gateway access
✅ **SSH-only** - No public ports except SSH

---

## 🐛 Troubleshooting

### Gateway Won't Start

```bash
# Check logs
journalctl --user -u openclaw-gateway.service -n 50

# Verify config
openclaw doctor

# Fix issues
openclaw doctor --fix
```

### Bot Not Responding

```bash
# 1. Check channel status
openclaw channels status

# 2. Verify Telegram plugin enabled
openclaw plugins list | grep telegram

# 3. Check gateway is running
openclaw gateway status

# 4. View recent logs
tail -100 /tmp/openclaw/openclaw-2026-02-02.log
```

### Pairing Issues

```bash
# List pending pairings
openclaw pairing list --channel telegram

# Approve a user
openclaw pairing approve telegram <CODE>
```

---

## 🔄 Updates

```bash
# Update OpenClaw to latest version
npm update -g openclaw

# Restart gateway
systemctl --user restart openclaw-gateway.service
# OR with PM2:
pm2 restart openclaw-gateway
```

---

## 📈 Scaling

### Single Bot
- 1 server handles ~1000 messages/hour
- Perfect for small to medium businesses

### Multiple Bots
Use OpenClaw profiles for isolation:

```bash
# Deploy multiple bots on one server
openclaw --profile bot1 gateway install
openclaw --profile bot2 gateway install

# Each gets isolated config:
~/.openclaw-bot1/
~/.openclaw-bot2/
```

---

## 🌟 Real-World Example

**[Inventory For Agents](https://inventoryforagents.xyz)** uses ClawdBot to power [@agentsinventory_bot](https://t.me/agentsinventory_bot).

**Features:**
- Natural AI conversations
- Product inventory queries (coming with Etsy integration)
- 24/7 customer support
- Full Etsy shop integration (pending API approval)

Try it: [@agentsinventory_bot](https://t.me/agentsinventory_bot)

---

## 🔌 Etsy Integration (Coming Soon)

We're building full Etsy shop integration for ClawdBot. Features include:

- Real-time inventory sync
- Product queries via Telegram
- Order management
- Shop analytics

**Status**: Awaiting Etsy API approval. Once approved, we'll add:
- OAuth connection flow
- Secure credential storage
- Etsy API integration guide

---

## 📚 Additional Resources

- **OpenClaw Docs**: https://docs.openclaw.ai
- **OpenClaw GitHub**: https://github.com/openclaw/openclaw
- **Claude API**: https://docs.anthropic.com
- **Telegram Bot API**: https://core.telegram.org/bots

---

## 📞 Support

- **Documentation**: [Full docs](/)
- **Issues**: [GitHub Issues](https://github.com/bolivian-peru/inventory-agents/issues)
- **Community**: [Telegram Group](https://t.me/inventoryforagents)
- **Website**: [inventoryforagents.xyz](https://inventoryforagents.xyz)

---

**Last Updated**: February 2026
**Tested On**: Hetzner CCX13, Ubuntu 24.04, OpenClaw 2026.1.30
**Production Bot**: @agentsinventory_bot
**Status**: ✅ Production-ready
