#!/bin/bash
# ============================================
# IFA — Your First AI Employee
# One-command deploy for Etsy/Shopify sellers
# https://inventoryforagents.xyz
# $IFA on Pump.fun
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

clear
echo -e "${MAGENTA}"
echo "  _____ ______   ___  "
echo "  \\_   \\\\ ___| / _ \\ "
echo "   / /\\/ |_   / /_\\ \\"
echo "/\\/ /_ |  _| /  _  \\"
echo "\\____/ |_|   \\_/ \\_/"
echo ""
echo -e "${NC}"
echo -e "${CYAN}Your First AI Employee${NC}"
echo -e "Deploy an AI sales agent in 15 minutes"
echo ""
echo -e "Website: ${GREEN}inventoryforagents.xyz${NC}"
echo -e "Token:   ${GREEN}\$IFA on Pump.fun${NC}"
echo ""
echo "============================================"
echo ""

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}Error: Run as root${NC}"
   echo "Usage: sudo ./deploy.sh"
   exit 1
fi

# Collect info
echo -e "${YELLOW}📋 Step 1: Configuration${NC}"
echo ""

read -p "🔑 Anthropic API Key (sk-ant-...): " ANTHROPIC_KEY
if [[ -z "$ANTHROPIC_KEY" ]]; then
    echo -e "${RED}Required: Anthropic API key${NC}"
    echo "Get one at: https://console.anthropic.com"
    exit 1
fi

read -p "🤖 Telegram Bot Token (from @BotFather): " TELEGRAM_TOKEN
if [[ -z "$TELEGRAM_TOKEN" ]]; then
    echo -e "${RED}Required: Telegram bot token${NC}"
    echo "Create one: t.me/BotFather → /newbot"
    exit 1
fi

read -p "🏪 Your shop name: " SHOP_NAME
SHOP_NAME=${SHOP_NAME:-"My Shop"}

echo ""
echo -e "${GREEN}✓ Configuration saved${NC}"
echo ""

# Install dependencies
echo -e "${YELLOW}📦 Step 2: Installing dependencies...${NC}"
echo ""

apt-get update -qq

# Node.js
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 22..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# OpenClaw
echo "Installing OpenClaw..."
npm install -g openclaw 2>/dev/null || npm install -g openclaw
echo -e "${GREEN}✓ OpenClaw installed${NC}"

echo ""
echo -e "${YELLOW}⚙️ Step 3: Configuring OpenClaw...${NC}"
echo ""

# Configure
openclaw config set gateway.mode local 2>/dev/null
openclaw config set agents.defaults.model.primary anthropic/claude-opus-4-5 2>/dev/null

# API Key
mkdir -p ~/.openclaw
echo "ANTHROPIC_API_KEY=$ANTHROPIC_KEY" > ~/.openclaw/.env
chmod 600 ~/.openclaw/.env
echo -e "${GREEN}✓ API key configured${NC}"

# Telegram
openclaw plugins enable telegram 2>/dev/null || true
echo -e "${GREEN}✓ Telegram plugin enabled${NC}"

echo ""
echo -e "${YELLOW}🛠️ Step 4: Setting up agent workspace...${NC}"
echo ""

# Create workspace
WORKSPACE=~/.openclaw/workspace
mkdir -p $WORKSPACE/skills $WORKSPACE/memory

# Download templates
echo "Downloading agent templates..."
curl -fsSL https://raw.githubusercontent.com/bolivian-peru/inventory-agents/main/templates/CLAUDE.md > $WORKSPACE/CLAUDE.md 2>/dev/null
curl -fsSL https://raw.githubusercontent.com/bolivian-peru/inventory-agents/main/templates/SOUL.md > $WORKSPACE/SOUL.md 2>/dev/null
curl -fsSL https://raw.githubusercontent.com/bolivian-peru/inventory-agents/main/templates/AGENTS.md > $WORKSPACE/AGENTS.md 2>/dev/null
curl -fsSL https://raw.githubusercontent.com/bolivian-peru/inventory-agents/main/templates/products.md > $WORKSPACE/products.md 2>/dev/null

# Customize with shop name
sed -i "s/{{SHOP_NAME}}/$SHOP_NAME/g" $WORKSPACE/CLAUDE.md 2>/dev/null || true
sed -i "s/{{SHOP_NAME}}/$SHOP_NAME/g" $WORKSPACE/SOUL.md 2>/dev/null || true

echo -e "${GREEN}✓ Agent templates installed${NC}"

# Download skills
echo "Installing agent skills..."
curl -fsSL https://raw.githubusercontent.com/bolivian-peru/inventory-agents/main/skills/product-lookup/SKILL.md > $WORKSPACE/skills/product-lookup.md 2>/dev/null
curl -fsSL https://raw.githubusercontent.com/bolivian-peru/inventory-agents/main/skills/customer-service/SKILL.md > $WORKSPACE/skills/customer-service.md 2>/dev/null
echo -e "${GREEN}✓ Skills installed${NC}"

echo ""
echo -e "${YELLOW}📱 Step 5: Connecting Telegram...${NC}"
echo ""

# Configure Telegram
openclaw channels add \
    --channel telegram \
    --account default \
    --name "$SHOP_NAME Agent" \
    --token "$TELEGRAM_TOKEN" 2>/dev/null || echo -e "${CYAN}(Telegram already configured)${NC}"

echo -e "${GREEN}✓ Telegram connected${NC}"

echo ""
echo -e "${YELLOW}🚀 Step 6: Starting your AI agent...${NC}"
echo ""

# Start gateway
openclaw gateway install 2>/dev/null || true
systemctl --user daemon-reload 2>/dev/null || true
systemctl --user enable openclaw-gateway 2>/dev/null || true
systemctl --user start openclaw-gateway 2>/dev/null || openclaw gateway start 2>/dev/null || true

sleep 3

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}"
echo "  🎉 YOUR AI AGENT IS LIVE!"
echo ""
echo -e "${NC}"
echo -e "  Shop: ${CYAN}$SHOP_NAME${NC}"
echo -e "  Status: ${GREEN}Running${NC}"
echo ""
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${YELLOW}📍 Next Steps:${NC}"
echo ""
echo "  1. Open Telegram and find your bot"
echo "  2. Send /start to say hello"
echo "  3. Add your products to:"
echo "     $WORKSPACE/products.md"
echo ""
echo -e "${YELLOW}🛠️ Useful Commands:${NC}"
echo ""
echo "  openclaw status        Check agent status"
echo "  openclaw logs -f       View live logs"
echo "  openclaw gateway stop  Stop the agent"
echo ""
echo -e "${YELLOW}📁 Important Files:${NC}"
echo ""
echo "  $WORKSPACE/CLAUDE.md   Agent instructions"
echo "  $WORKSPACE/SOUL.md     Agent personality"
echo "  $WORKSPACE/products.md Your product catalog"
echo ""
echo -e "${CYAN}📚 Documentation:${NC}"
echo "  https://github.com/bolivian-peru/inventory-agents"
echo ""
echo -e "${CYAN}💬 Need Help?${NC}"
echo "  Join our Telegram: t.me/inventoryforagents"
echo ""
echo -e "${MAGENTA}💎 $IFA Token:${NC}"
echo "  https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump"
echo ""
echo -e "${GREEN}Happy selling! 🛒⚡${NC}"
echo ""
