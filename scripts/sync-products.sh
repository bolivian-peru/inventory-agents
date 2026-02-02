#!/bin/bash
# ============================================
# IFA — Product Sync via Central API
# Syncs your Etsy products to products.md
# https://inventoryforagents.xyz
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Config
WORKSPACE="${WORKSPACE:-$HOME/.openclaw/workspace}"
IFA_DIR="${IFA_DIR:-$HOME/.ifa}"
TOKENS_FILE="$IFA_DIR/etsy-tokens.json"
API_URL="${IFA_API_URL:-https://app.inventoryforagents.xyz}"

echo -e "${CYAN}🛒 IFA Product Sync${NC}"
echo ""

# Check for tokens
if [[ ! -f "$TOKENS_FILE" ]]; then
    echo -e "${YELLOW}No Etsy connection found.${NC}"
    echo ""
    echo "To connect your Etsy shop:"
    echo ""
    echo "  1. Visit: ${CYAN}${API_URL}/etsy/auth${NC}"
    echo "  2. Authorize your shop"
    echo "  3. Save the tokens when prompted"
    echo ""
    echo "Or manually edit your products:"
    echo "  ${CYAN}$WORKSPACE/products.md${NC}"
    echo ""
    exit 0
fi

echo -e "${YELLOW}Syncing products via IFA API...${NC}"

# Load tokens
ACCESS_TOKEN=$(jq -r '.accessToken' "$TOKENS_FILE" 2>/dev/null)

if [[ -z "$ACCESS_TOKEN" || "$ACCESS_TOKEN" == "null" ]]; then
    echo -e "${RED}Error: Invalid tokens file${NC}"
    echo "Please reconnect at ${API_URL}/etsy/auth"
    exit 1
fi

# Call our API to sync
RESPONSE=$(curl -s -X POST "${API_URL}/etsy/sync" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

SUCCESS=$(echo "$RESPONSE" | jq -r '.success' 2>/dev/null)
COUNT=$(echo "$RESPONSE" | jq -r '.count' 2>/dev/null)
ERROR=$(echo "$RESPONSE" | jq -r '.error' 2>/dev/null)

if [[ "$SUCCESS" == "true" ]]; then
    echo ""
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}✓ Synced $COUNT products!${NC}"
    echo -e "${GREEN}============================================${NC}"
    echo ""
    echo "Your AI agent now knows about all your products."
    echo ""
    echo -e "${CYAN}Products saved to: $WORKSPACE/products.md${NC}"
    echo ""
else
    echo -e "${RED}Sync failed: $ERROR${NC}"
    echo ""
    echo "Try reconnecting at ${API_URL}/etsy/auth"
    exit 1
fi
