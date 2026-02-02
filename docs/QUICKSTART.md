# ⚡ ClawdBot Quick Start - Hetzner Deployment

> **Deploy your AI Telegram bot on Hetzner in 15 minutes**

This is the fastest way to get ClawdBot running on a Hetzner VPS.

---

## 📋 What You Need

1. **Hetzner Account** - https://hetzner.com
2. **Telegram Bot Token** - Get from [@BotFather](https://t.me/BotFather)
3. **Anthropic API Key** - Get from https://console.anthropic.com

**Total Cost**: ~$26-66/month ($15 server + $10-50 API usage)

---

## 🚀 Step 1: Create Hetzner Server (3 minutes)

### Via Hetzner Cloud Console:

1. Go to https://console.hetzner.cloud
2. Create new project (e.g., "clawdbot")
3. Click **"Add Server"**
4. Select:
   - **Location**: Helsinki (or nearest to you)
   - **Image**: Ubuntu 24.04
   - **Type**: CX22 (2 vCPU, 4GB RAM, ~$5/mo) for small bots
   - **Type**: CCX13 (8GB RAM, ~$15/mo) for production
5. Add your SSH key
6. Create & Deploy

**Wait 30 seconds** for server to boot. Note the IP address.

---

## 🔧 Step 2: Install OpenClaw (5 minutes)

SSH into your server:

```bash
ssh root@YOUR_SERVER_IP
```

Run the installation script:

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify Node.js
node --version  # Should be v18+ or v20+

# Install OpenClaw globally
npm install -g openclaw

# Verify installation
openclaw --version  # Should show 2026.1.30 or later
```

---

## ⚙️ Step 3: Configure OpenClaw (4 minutes)

### 3.1 Set up basic configuration:

```bash
# Create directories
mkdir -p ~/.openclaw/agents/main/sessions
mkdir -p ~/.openclaw/credentials

# Configure gateway mode
openclaw config set gateway.mode local

# Configure AI model (Claude Opus 4.5)
openclaw config set agents.defaults.model.primary anthropic/claude-opus-4-5

# Set auth token for gateway
openclaw config set gateway.auth.token $(openssl rand -hex 16)
```

### 3.2 Enable Telegram plugin:

```bash
# Enable the Telegram channel plugin
openclaw plugins enable telegram

# Verify it's enabled
openclaw plugins list | grep telegram
# Should show: telegram | loaded
```

### 3.3 Install gateway service:

```bash
# Install as systemd service
openclaw gateway install

# Verify service is created
systemctl --user status openclaw-gateway.service
```

---

## 🔑 Step 4: Add API Keys (2 minutes)

Edit the systemd service file to add your API keys:

```bash
# Edit the service file
nano ~/.config/systemd/user/openclaw-gateway.service
```

Add these lines in the `[Service]` section (after the `[Service]` line):

```ini
Environment="ANTHROPIC_API_KEY=your-anthropic-api-key-here"
Environment="OPENCLAW_TELEGRAM_TOKEN=your-telegram-bot-token-here"
```

**Replace** the placeholder values with your actual keys:
- `ANTHROPIC_API_KEY`: Get from https://console.anthropic.com
- `OPENCLAW_TELEGRAM_TOKEN`: Get from @BotFather in Telegram

Save and exit (Ctrl+X, Y, Enter in nano).

Reload the service:

```bash
systemctl --user daemon-reload
```

---

## 🤖 Step 5: Start the Bot (1 minute)

### 5.1 Start the gateway:

```bash
systemctl --user start openclaw-gateway.service

# Verify it's running
openclaw gateway status
# Should show: Runtime: running
```

### 5.2 Add Telegram channel:

```bash
openclaw channels add \
  --channel telegram \
  --account default \
  --name "My AI Bot" \
  --token "YOUR_TELEGRAM_BOT_TOKEN"

# Verify channel is active
openclaw channels status
# Should show: Telegram default: enabled, configured, running
```

---

## ✅ Step 6: Test Your Bot (1 minute)

1. Open Telegram and find your bot
2. Send a message to your bot
3. You'll receive a **pairing code** like: `B732YCW3`
4. On the server, approve your access:

```bash
openclaw pairing approve telegram YOUR_PAIRING_CODE
```

5. **Send another message** to your bot
6. You should get an AI-powered response! 🎉

---

## 🎯 Quick Test Messages

Try these:

- `/start` - Welcome message
- `Hello!` - Natural conversation
- `What can you do?` - Bot capabilities
- `Tell me a joke` - AI humor
- `What is the meaning of life?` - Philosophy

---

## 📊 Verify Everything Is Working

```bash
# Check gateway status
openclaw gateway status

# Check channel status
openclaw channels status

# View recent logs
journalctl --user -u openclaw-gateway.service -n 50

# Check for errors
openclaw doctor
```

All should show green/running status!

---

## 🔄 Enable Auto-Restart

Make sure the bot restarts after server reboot:

```bash
# Enable lingering (keeps user services running)
loginctl enable-linger $USER

# Verify service starts on boot
systemctl --user enable openclaw-gateway.service
```

---

## 💪 Production Improvements (Optional)

### Use PM2 for Better Monitoring

```bash
# Install PM2
npm install -g pm2

# Stop systemd service
systemctl --user stop openclaw-gateway.service
systemctl --user disable openclaw-gateway.service

# Start with PM2
pm2 start "openclaw gateway" --name openclaw-gateway

# Save PM2 configuration
pm2 save

# Enable PM2 on startup
pm2 startup

# Monitor
pm2 status
pm2 logs openclaw-gateway
```

### Set Up Firewall

```bash
# Allow SSH only
ufw allow 22/tcp
ufw enable
```

---

## 🐛 Troubleshooting

### Bot Not Responding?

```bash
# 1. Check if gateway is running
openclaw gateway status

# 2. Check Telegram channel
openclaw channels status

# 3. View logs
journalctl --user -u openclaw-gateway.service -n 100

# 4. Restart gateway
systemctl --user restart openclaw-gateway.service
```

### "Access Not Configured" Error?

You need to approve your Telegram user:

```bash
openclaw pairing list --channel telegram
openclaw pairing approve telegram YOUR_CODE
```

### Gateway Won't Start?

```bash
# Run diagnostics
openclaw doctor

# Check logs for errors
journalctl --user -u openclaw-gateway.service -n 50

# Verify API keys are set
systemctl --user show openclaw-gateway.service --property=Environment
```

---

## 📈 Cost Breakdown

| Item | Monthly Cost |
|------|--------------|
| Hetzner CX22 (4GB) | $5 |
| Hetzner CCX13 (8GB) | $15 |
| Anthropic API (light) | $10-20 |
| Anthropic API (heavy) | $30-50 |
| **Total** | **$15-65/month** |

**No per-user fees. No hidden costs. You own everything.**

---

## 🎉 Success!

Your ClawdBot is now running on Hetzner!

**What's Next?**

1. Customize the bot's personality (see [Advanced Configuration](DEPLOYMENT.md))
2. Add custom skills and commands
3. Connect to your Etsy shop (when integration is available)
4. Scale to multiple bots on one server

---

## 📚 More Resources

- **Full Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **FAQ**: [../FAQ.md](../FAQ.md)
- **Security Guide**: [../SECURITY.md](../SECURITY.md)
- **OpenClaw Docs**: https://docs.openclaw.ai
- **Community**: https://t.me/inventoryforagents

---

## 🆘 Need Help?

- **GitHub Issues**: https://github.com/bolivian-peru/inventory-agents/issues
- **Telegram Group**: https://t.me/inventoryforagents
- **Email**: support@inventoryforagents.xyz

---

**Deployment Time**: ⏱️ 15 minutes
**Difficulty**: 🟢 Beginner-friendly
**Cost**: 💰 $15-65/month
**Status**: ✅ Production-ready
