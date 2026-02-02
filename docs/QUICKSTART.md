# ⚡ Quick Start — 15 Minutes to Your AI Employee

> **Hetzner + OpenClaw + Telegram = AI sales agent**

The fastest path from zero to "my bot just answered a customer."

---

## 📋 You Need

| Item | Get It |
|------|--------|
| Hetzner account | [hetzner.cloud/?ref=nXcA4WhTDugS](https://hetzner.cloud/?ref=nXcA4WhTDugS) |
| Telegram bot | [@BotFather](https://t.me/BotFather) |
| Anthropic key | [console.anthropic.com](https://console.anthropic.com) |

**Cost: ~$25-65/month total**

---

## 🖥️ Step 1: Create Server (3 min)

1. Go to [Hetzner Cloud Console](https://hetzner.cloud/?ref=nXcA4WhTDugS)
2. New Project → "my-shop-ai"
3. **Add Server**:
   - Location: Helsinki (or nearest)
   - Image: **Ubuntu 24.04**
   - Type: **CX22** ($5/mo) or **CCX13** ($15/mo)
   - Add your SSH key
4. **Create**

Note the IP address. Wait 30 seconds.

---

## ⚡ Step 2: One-Command Deploy (5 min)

```bash
# SSH in
ssh root@YOUR_IP

# Run the magic
curl -fsSL https://raw.githubusercontent.com/bolivian-peru/inventory-agents/main/scripts/deploy.sh | bash
```

Follow the prompts. Enter your API keys when asked.

**That's it.** Your AI is live.

---

## 🧪 Step 3: Test (2 min)

1. Open Telegram
2. Find your bot
3. Send: `/start`
4. Get response → **Success!** 🎉

Try: "What products do you have?"

---

## 📦 Step 4: Add Products (5 min)

Edit `~/.openclaw/workspace/products.md`:

```markdown
## Handmade Candle

- **Price:** $24.00
- **Quantity:** 15 in stock
- **Materials:** Soy wax, essential oils
- **Description:** Hand-poured lavender candle, 8oz

Tags: candle, lavender, handmade, gift
```

Save. Your agent now knows about this product.

---

## ✅ You're Done

**What you have:**
- 🤖 AI agent running 24/7
- 💬 Telegram bot for customers
- 📦 Product knowledge from markdown
- 🔒 Your own server (you control everything)

**What it costs:**
- Server: $5-15/mo
- AI API: $10-50/mo (usage-based)
- **Total: $15-65/mo**

---

## 🚀 Next Steps

| Task | Guide |
|------|-------|
| Customize personality | Edit `SOUL.md` |
| Add more products | Edit `products.md` |
| Connect Etsy | [ETSY_PLUGIN.md](ETSY_PLUGIN.md) |
| Full deployment options | [DEPLOYMENT.md](DEPLOYMENT.md) |

---

## 🐛 Something Wrong?

```bash
# Check status
openclaw status

# View logs
openclaw logs -f

# Restart
openclaw gateway restart
```

**Still stuck?** [Join Telegram](https://t.me/inventoryforagents) — we help.

---

## 🔄 Auto-Restart on Reboot

```bash
loginctl enable-linger $USER
systemctl --user enable openclaw-gateway
```

Your agent survives server restarts.

---

<div align="center">

### 15 minutes. Done.

**Your AI employee is serving customers.**

---

[🌐 Website](https://inventoryforagents.xyz) · [💬 Community](https://t.me/inventoryforagents) · [🐦 Twitter](https://x.com/agentinventory)

---

**$IFA** — The commerce AI token

[Pump.fun](https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump)

</div>
