# 🔒 Security Policy

> **Your shop data stays yours.**

---

## 🚨 Reporting Vulnerabilities

Found a security issue? **Don't open a public issue.**

**Report via Telegram:** [t.me/inventoryforagents](https://t.me/inventoryforagents)

Include:
- Description of the issue
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)

### Response Time

| Action | Timeline |
|--------|----------|
| Acknowledgment | 48 hours |
| Updates | Weekly |
| Critical fixes | 7 days |

We'll credit you (if desired) when the fix ships.

---

## ✅ Security Features

### Self-Hosted (You Control)
| Feature | Implementation |
|---------|----------------|
| Data isolation | Your server only |
| No telemetry | Nothing phones home |
| Encrypted storage | Your choice |
| Access control | Telegram allowlist |

### When Using Etsy Sync API
| Feature | Implementation |
|---------|----------------|
| Token encryption | AES-256-GCM |
| Transport | TLS 1.3 |
| API auth | JWT + rate limiting |
| Input validation | Zod schemas |

---

## 🛡️ Best Practices

When self-hosting:

```bash
# 1. Firewall — only what's needed
ufw default deny incoming
ufw allow 22/tcp    # SSH
ufw allow 443/tcp   # HTTPS (if needed)
ufw enable

# 2. Updates — stay current
apt update && apt upgrade -y
npm update -g openclaw

# 3. Keys — strong and unique
# Use 32+ character secrets
# Never commit API keys

# 4. Backups — because stuff happens
# Backup ~/.openclaw/workspace regularly
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│         YOUR SERVER                 │
│                                     │
│  ┌─────────────┐  ┌─────────────┐   │
│  │  OpenClaw   │  │  products   │   │
│  │  (agent)    │←→│  .md files  │   │
│  └─────────────┘  └─────────────┘   │
│         ↕                           │
│  ┌─────────────┐                    │
│  │  Telegram   │                    │
│  │  (outbound) │                    │
│  └─────────────┘                    │
│                                     │
│  No inbound ports needed            │
│  No database                        │
│  No external dependencies           │
└─────────────────────────────────────┘
```

**Your data never leaves your server** (except Telegram messages to your customers).

---

## 📋 Supported Versions

| Version | Supported |
|---------|-----------|
| Latest | ✅ |
| < 1.0 | ❌ |

Always use the latest release.

---

## 🤝 Responsible Disclosure

We appreciate security researchers who:
- Give us time to fix before public disclosure
- Don't access/modify other users' data
- Act in good faith

We'll work with you and publicly credit contributions.

---

<div align="center">

**Security is a feature, not an afterthought.**

Questions? Join our [Telegram community](https://t.me/inventoryforagents) or ping [@agentinventory](https://x.com/agentinventory) on Twitter.

---

[🌐 Website](https://inventoryforagents.xyz) · [💬 Telegram](https://t.me/inventoryforagents) · [🐦 Twitter](https://x.com/agentinventory)

</div>
