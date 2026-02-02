# 💎 $IFA Development Bounties

Earn $IFA tokens by contributing to the Inventory For Agents platform.

---

## 💰 Current Bounty Pool

**Total Available:** 50,000 $IFA
**Funded By:** Development allocation
**Updated:** February 2026

---

## 🏆 Active Bounties

### High Priority (5,000 $IFA each)

#### 1. WhatsApp QR Code Implementation
**Status:** 🔴 Open
**Difficulty:** Medium
**Skills:** TypeScript, Baileys library, WebSocket

**Description:**
Complete the WhatsApp integration by implementing QR code generation for seller pairing.

**Requirements:**
- Generate QR code when seller connects WhatsApp
- Display QR in dashboard or return as base64
- Handle pairing events (success/failure)
- Store session credentials securely
- Auto-reconnect on disconnect

**Files:** `src/routes/messaging.ts`, `src/services/messaging/whatsapp.ts`

[📋 Claim this bounty →](https://github.com/InventoryForAgents/ifa-backend/issues/1)

---

#### 2. Shopify Integration
**Status:** 🔴 Open
**Difficulty:** High
**Skills:** TypeScript, OAuth 2.0, Shopify API

**Description:**
Add Shopify as a second e-commerce platform alongside Etsy.

**Requirements:**
- Shopify OAuth 2.0 flow (similar to Etsy)
- Product sync from Shopify Admin API
- Store Shopify credentials encrypted
- Update agent provisioner for Shopify shops
- Create `shopify-mcp-server` integration

**Deliverables:**
- `src/routes/shopify-oauth.ts`
- `src/services/shopify/` directory
- Database migration for `shopify_connections` table
- MCP server config for Shopify

[📋 Claim this bounty →](https://github.com/InventoryForAgents/ifa-backend/issues/2)

---

#### 3. Agent Performance Dashboard
**Status:** 🔴 Open
**Difficulty:** Medium
**Skills:** TypeScript, SQL, Data Visualization

**Description:**
Build analytics endpoints for tracking agent performance metrics.

**Requirements:**
- Message response times
- Customer satisfaction tracking
- Daily/weekly/monthly stats
- Most asked questions analysis
- Product recommendation success rate

**Deliverables:**
- `GET /agents/me/analytics` endpoint
- Dashboard queries optimized for performance
- Data aggregation tables/views
- Real-time metrics via SSE

[📋 Claim this bounty →](https://github.com/InventoryForAgents/ifa-backend/issues/3)

---

### Medium Priority (2,000-3,000 $IFA each)

#### 4. Test Coverage >80%
**Bounty:** 3,000 $IFA
**Status:** 🔴 Open
**Difficulty:** Medium
**Skills:** Vitest, Unit Testing, Integration Testing

**Description:**
Increase test coverage from current ~0% to >80% across the codebase.

**Requirements:**
- Unit tests for all services
- Integration tests for API routes
- E2E tests for critical flows (signup → agent provision → message)
- CI/CD with GitHub Actions
- Coverage report in README

**Existing:** `tests/` directory has structure, needs implementation

[📋 Claim this bounty →](https://github.com/InventoryForAgents/ifa-backend/issues/4)

---

#### 5. Telegram Webhook Configuration
**Bounty:** 2,000 $IFA
**Status:** 🔴 Open
**Difficulty:** Easy
**Skills:** TypeScript, Telegram Bot API, grammY

**Description:**
Configure Telegram webhook for production message handling (currently uses polling).

**Requirements:**
- Set up webhook endpoint
- Verify webhook security (secret token)
- Handle all message types (text, photos, documents)
- Graceful fallback to polling in dev mode

**Files:** `src/services/messaging/telegram.ts`

[📋 Claim this bounty →](https://github.com/InventoryForAgents/ifa-backend/issues/5)

---

#### 6. Mobile-Responsive Dashboard
**Bounty:** 2,000 $IFA
**Status:** 🔴 Open
**Difficulty:** Medium
**Skills:** React, Tailwind CSS, Responsive Design

**Description:**
Make the merchant dashboard mobile-friendly (note: this is frontend work).

**Requirements:**
- Mobile layouts for all pages
- Touch-friendly controls
- Optimized for iOS/Android browsers
- Works offline (PWA)

**Repo:** [ifa-frontend](https://github.com/InventoryForAgents/ifa-frontend)

[📋 Claim this bounty →](https://github.com/InventoryForAgents/ifa-frontend/issues/1)

---

### Low Priority (500-1,000 $IFA each)

#### 7. Documentation Improvements
**Bounty:** 500 $IFA per major doc
**Status:** 🟢 Always Open
**Difficulty:** Easy
**Skills:** Markdown, Technical Writing

**Eligible Improvements:**
- API endpoint examples with curl/fetch
- Deployment guides for different platforms (AWS, DigitalOcean, Railway)
- Troubleshooting FAQs
- Architecture diagram improvements
- Video tutorials (1,000 $IFA bonus)

[📋 Submit docs PR →](https://github.com/InventoryForAgents/ifa-backend/pulls)

---

#### 8. Bug Fixes
**Bounty:** 500-1,000 $IFA depending on severity
**Status:** 🟢 Always Open
**Difficulty:** Varies

**How it works:**
1. Find a bug (or claim an existing issue)
2. Submit a PR with fix + test
3. Get it merged
4. Claim your $IFA

**Current Known Bugs:**
- SSE connection cleanup not working (#6)
- Product sync fails for shops with >1000 items (#7)
- Token refresh race condition (#8)

[📋 See all bugs →](https://github.com/InventoryForAgents/ifa-backend/labels/bug)

---

#### 9. Code Refactoring & Quality
**Bounty:** 500 $IFA per PR
**Status:** 🟢 Always Open
**Difficulty:** Easy-Medium

**Eligible Improvements:**
- Extract duplicated code into utilities
- Improve error messages
- Add TypeScript strict mode compliance
- Performance optimizations
- Reduce bundle size

**Note:** Must improve code quality without breaking functionality.

---

## 🎯 How to Claim Bounties

### Step 1: Pick a Bounty
Comment on the GitHub issue: **"I'd like to work on this"**

We'll assign it to you and provide guidance if needed.

### Step 2: Build It
Fork the repo, create a branch, implement the solution.

- Write tests for your code
- Follow existing code style
- Update documentation

### Step 3: Submit PR
Open a Pull Request with:
- Clear description of changes
- Before/after examples (if applicable)
- Test coverage added
- Link to the bounty issue

### Step 4: Get Merged
Maintainers will review within 3-5 days.

Once merged, you're paid!

### Step 5: Receive $IFA
Post your Solana wallet address in the PR comments.

$IFA will be sent within 48 hours of merge.

---

## 📋 Bounty Rules

### Eligibility
- ✅ Anyone can claim bounties (no restrictions)
- ✅ You can work on multiple bounties simultaneously
- ✅ Team submissions accepted (split bounty as you prefer)
- ❌ Can't claim your own bug reports (to prevent spam)

### Quality Standards
- All code must pass existing tests
- New features need tests (min 70% coverage for that feature)
- Follow project code style (use Prettier/ESLint)
- Documentation updated if APIs change

### Payment
- Paid in $IFA tokens only (no fiat)
- Sent to Solana wallet addresses
- Payment within 48 hours of merge
- Bounty amounts are fixed (no negotiation after claiming)

### Disputes
If there's a disagreement:
1. Maintainers have final say on merge decisions
2. Partial bounties may be awarded for partial work
3. Good faith efforts are appreciated even if not merged

---

## 💡 Suggest a Bounty

Have an idea for a feature that deserves a bounty?

1. Open a GitHub Discussion
2. Tag it with `bounty-suggestion`
3. Explain the value it adds
4. Community votes (👍 reactions)

If it gets >10 votes, we'll fund it!

---

## 📊 Bounty Leaderboard

| Contributor | Bounties Claimed | Total $IFA Earned |
|-------------|------------------|-------------------|
| 🏆 TBD | - | - |
| 🥈 TBD | - | - |
| 🥉 TBD | - | - |

*Updated weekly*

---

## 🤝 Not a Developer?

You can still earn $IFA:

- 📝 **Write tutorials** (500 $IFA each)
- 🎥 **Create videos** (1,000 $IFA each)
- 🎨 **Design assets** (500 $IFA per approved design)
- 📢 **Community management** (Monthly stipend for active mods)

DM @InventoryAgents on Twitter or ask in Discord #bounties channel.

---

## ❓ FAQ

### Q: What's the $IFA token address?
**A:** [Contract Address on Pump.fun]

### Q: Can I work on a bounty that's already claimed?
**A:** No, but you can ask to collaborate or wait for it to be released.

### Q: How long do I have to complete a bounty?
**A:** 2 weeks from assignment. Ask for extension if needed.

### Q: Do I need KYC to receive bounties?
**A:** No KYC required. Just a Solana wallet.

### Q: What if my PR isn't merged?
**A:** You don't get paid, but you still helped! We might offer a consolation bounty (10-20%) for good efforts.

### Q: Can I sell my $IFA immediately?
**A:** Yes, but we'd love if you held 😊. No vesting or lock-ups.

---

<div align="center">

**Ready to earn $IFA?**

[Browse Open Bounties](https://github.com/InventoryForAgents/ifa-backend/labels/bounty) • [Join Discord](https://discord.gg/your-invite) • [Buy $IFA](https://pump.fun/your-token)

💎 **Built by the community, for the community** 💎

</div>
