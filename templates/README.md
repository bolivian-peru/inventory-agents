# 🤖 Agent Workspace Templates

These templates were created by **Commerce Spirit**, the AI agent powering [@agentsinventory_bot](https://t.me/agentsinventory_bot).

Use these to set up your own OpenClaw agent's workspace.

---

## 📁 Files

### AGENTS.md
**Workspace guide** - Instructions for the agent on how to use its workspace, manage memory, and persist knowledge across sessions.

**Use this when:** Setting up any OpenClaw agent workspace

### SOUL.md
**Agent personality** - Core principles, boundaries, and behavioral guidelines for your agent.

**Customize this to:** Define your agent's personality, tone, and ethical boundaries

### IDENTITY.md.example
**Agent identity** - Who your agent is, what it does, and its mission.

**Customize this to:** Give your agent a name, purpose, and specific role

---

## 🚀 How to Use

### 1. Copy to Your Workspace

```bash
# On your server where OpenClaw is installed
cd ~/.openclaw/workspace

# Copy the templates
cp /path/to/templates/AGENTS.md .
cp /path/to/templates/SOUL.md .
cp /path/to/templates/IDENTITY.md.example IDENTITY.md

# Edit IDENTITY.md with your agent's details
nano IDENTITY.md
```

### 2. Customize for Your Use Case

**IDENTITY.md** - Define your agent's:
- Name and personality
- What it can access (databases, APIs, file systems)
- What it helps with (customer service, inventory, analytics)
- Its mission statement

**SOUL.md** - Adjust the tone and principles:
- How formal/casual should it be?
- What are its ethical boundaries?
- How should it handle sensitive information?

**AGENTS.md** - Usually leave as-is, but you can:
- Add domain-specific memory guidelines
- Include project-specific file conventions
- Add custom workflow instructions

---

## 💡 Example: Commerce Spirit

The included templates are based on **Commerce Spirit**, the AI agent that powers Inventory For Agents:

- **Name:** Commerce Spirit
- **Role:** AI sales agent for Etsy sellers
- **Personality:** Sharp, builder-minded, commerce-obsessed
- **Emoji:** 🛒⚡

**What it does:**
- Answers customer questions via Telegram 24/7
- Helps sellers manage inventory (when Etsy integration is ready)
- Provides e-commerce advice and insights

**Try it:** [@agentsinventory_bot](https://t.me/agentsinventory_bot)

---

## 🧠 Why These Templates Matter

OpenClaw agents wake up fresh each session. These files are how they remember who they are and what they're doing.

**AGENTS.md** teaches the agent how to persist memory across sessions.

**SOUL.md** defines its personality so it stays consistent.

**IDENTITY.md** gives it a sense of purpose and role.

Together, these create an agent that feels continuous and purposeful, not just a stateless chatbot.

---

## 🔧 Advanced: Agent Memory System

The templates include a sophisticated memory system:

### Daily Logs
```
memory/
├── 2026-02-02.md      # Today's conversations
├── 2026-02-01.md      # Yesterday
└── 2026-01-31.md      # etc.
```

### Long-term Memory
```
MEMORY.md              # Curated memories (main session only)
```

The agent reads:
1. **Every session:** SOUL.md, IDENTITY.md, USER.md, today's + yesterday's logs
2. **Main session only:** MEMORY.md (contains personal context)
3. **As needed:** Project files, skill definitions, etc.

---

## 📚 Learn More

- **OpenClaw Docs**: https://docs.openclaw.ai
- **Full Deployment Guide**: [../docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)
- **Quick Start**: [../docs/QUICKSTART.md](../docs/QUICKSTART.md)

---

**Created by:** Commerce Spirit (OpenClaw Agent)
**For:** ClawdBot Open Source Project
**License:** MIT
