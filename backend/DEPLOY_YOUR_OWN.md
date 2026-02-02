# 🚀 Deploy Your Own IFA Backend

**Get your own AI agent infrastructure in 15 minutes**

---

## Why Deploy Your Own?

✅ **Full Control** - Your server, your rules
✅ **No Limits** - Unlimited messages, unlimited agents
✅ **Your API Key** - Use your own Anthropic credits
✅ **Private Data** - All data stays on your server
✅ **Open Source** - Fork it, modify it, own it

**Cost:** ~€30/month (Hetzner server) + Anthropic API usage

---

## Prerequisites

You need:
1. **Hetzner Account** - [Sign up here](https://hetzner.cloud/?ref=nXcA4WhTDugS) (€20 free credit)
2. **Anthropic API Key** - [Get it here](https://console.anthropic.com/)
3. **Etsy API Credentials** - [Apply here](https://www.etsy.com/developers/)
4. **Domain Name** - Point to your server (e.g., app.yourdomain.com)

---

## 🎯 Quick Deploy (15 Minutes)

### Step 1: Create Hetzner Server

1. Go to [Hetzner Cloud](https://hetzner.cloud/?ref=nXcA4WhTDugS)
2. Create new project: "IFA Backend"
3. Create server:
   - **Location:** Closest to you
   - **Image:** Ubuntu 22.04
   - **Type:** CX22 (€5.83/month) or CX32 (€11.66/month)
   - **Networking:** IPv4
4. Copy server IP address

### Step 2: Point Your Domain

Add DNS A record:
```
Type: A
Name: app (or whatever subdomain you want)
Value: YOUR_SERVER_IP
TTL: 300
```

Wait 5-10 minutes for DNS to propagate.

### Step 3: Run Deploy Script

SSH into your server:
```bash
ssh root@YOUR_SERVER_IP
```

Download and run the deploy script:
```bash
curl -fsSL https://raw.githubusercontent.com/bolivian-peru/agents-inventory/main/backend/scripts/deploy-hetzner.sh -o deploy.sh
chmod +x deploy.sh
sudo ./deploy.sh
```

Follow the prompts:
- Enter your domain: `app.yourdomain.com`
- Enter your email: `you@example.com`
- Enter your Anthropic API key: `sk-ant-...`
- Enter your Etsy API key: `...`
- Enter your Etsy shared secret: `...`

The script will:
- ✅ Install Node.js, PostgreSQL, Redis, Nginx
- ✅ Clone IFA repository
- ✅ Setup database with migrations
- ✅ Configure SSL certificate (Let's Encrypt)
- ✅ Start API with PM2
- ✅ Configure firewall

### Step 4: Verify It Works

```bash
curl https://app.yourdomain.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "checks": {
    "api": "ok",
    "database": "ok",
    "redis": "ok"
  }
}
```

---

## 🎉 You're Done!

Your IFA backend is now running at: `https://app.yourdomain.com`

**Next steps:**
1. Deploy the frontend (see [Frontend Deploy Guide](../DEPLOY_FRONTEND.md))
2. Register your first account at `https://yourdomain.com/register`
3. Connect your Etsy shop
4. Create your AI agent

---

## 🛠️ Management Commands

### Check Status
```bash
pm2 status
```

### View Logs
```bash
pm2 logs ifa-api
```

### Restart API
```bash
pm2 restart ifa-api
```

### Update to Latest Version
```bash
cd /opt/ifa/backend
git pull origin main
npm install
npm run build
pm2 restart ifa-api
```

### Backup Database
```bash
sudo -u postgres pg_dump ifa > ifa_backup_$(date +%Y%m%d).sql
```

### Monitor Resources
```bash
htop
```

---

## 💰 Cost Breakdown

| Item | Monthly Cost |
|------|--------------|
| Hetzner CX22 | €5.83 |
| Hetzner CX32 | €11.66 |
| Anthropic API | ~€10-50 (depends on usage) |
| Domain | ~€10/year |

**Total:** €15-60/month depending on your server size and API usage.

---

## 🆘 Troubleshooting

### API Not Responding

Check if PM2 is running:
```bash
pm2 status
```

If stopped, restart:
```bash
pm2 restart ifa-api
```

### Database Connection Error

Check PostgreSQL is running:
```bash
systemctl status postgresql
```

Restart if needed:
```bash
systemctl restart postgresql
```

### SSL Certificate Issues

Renew certificate:
```bash
certbot renew
```

### High Memory Usage

Upgrade server to CX32 (8GB RAM):
```bash
# In Hetzner dashboard, resize server
```

---

## 🔒 Security Best Practices

1. **Change SSH Port**
```bash
nano /etc/ssh/sshd_config
# Change Port 22 to Port 2222
systemctl restart sshd
```

2. **Setup SSH Keys** (disable password login)
```bash
ssh-keygen -t ed25519
# Copy public key to server
nano ~/.ssh/authorized_keys
# Disable password auth
nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
```

3. **Regular Updates**
```bash
apt-get update && apt-get upgrade -y
```

4. **Monitor Logs**
```bash
pm2 logs ifa-api
tail -f /var/log/nginx/access.log
```

---

## 📊 Monitoring & Analytics

### Setup Uptime Monitoring

Use [UptimeRobot](https://uptimerobot.com/) (free):
- Monitor: `https://app.yourdomain.com/health`
- Alert via email if down

### Check API Usage

View Anthropic usage:
```bash
# Check logs for API calls
pm2 logs ifa-api | grep "anthropic"
```

---

## 🚀 Scaling

### When You Outgrow CX22:

**10-50 users:** CX32 (4 vCPU, 8GB RAM) - €11.66/month
**50-100 users:** CX42 (8 vCPU, 16GB RAM) - €23.32/month
**100+ users:** CX52 (16 vCPU, 32GB RAM) - €46.64/month

Resize in Hetzner dashboard (takes 1 minute).

---

## 🆓 Get €20 Free Credit

Use our referral link to get €20 free credit on Hetzner:

👉 **[Sign up here](https://hetzner.cloud/?ref=nXcA4WhTDugS)**

(We earn a commission when you sign up, which helps fund IFA development)

---

## 💬 Support

- **GitHub Issues:** [Report bugs](https://github.com/bolivian-peru/agents-inventory/issues)
- **Documentation:** [Full docs](https://github.com/bolivian-peru/agents-inventory)
- **Community:** [Discord](https://discord.gg/your-invite)

---

## ⚖️ License

MIT License - You own your deployment completely.

**Happy selling with your AI agent!** 🤖
