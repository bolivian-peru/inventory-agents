# Frequently Asked Questions

## General Questions

### What is Inventory For Agents (IFA)?
IFA is an **early-stage, open-source** AI agent platform that enables e-commerce sellers to deploy autonomous AI assistants that know their product catalog and answer customer questions 24/7.

**Current Status**: Backend infrastructure is production-ready. Etsy App Store integration pending API approval (1-3 weeks). Perfect for developers who want to build on agent infrastructure or contribute.

### Who is this for?
- **Etsy Sellers**: Install from Etsy App Store for instant setup
- **Developers**: Fork the open source agent infrastructure for custom implementations

---

## For Etsy Sellers

### Do I need an Etsy developer account?
**No.** If you install from the Etsy App Store, you just click "Allow" to authorize. No technical knowledge required.

### Do I need my own API keys?
**No.** The hosted service handles all API integrations. You just connect your shop.

### How long does setup take?
**When launched:** About 2 minutes. Install from Etsy App Store, click "Allow", and your agent is live.

**Currently:** The Etsy App Store listing is pending approval. For developers, self-hosting takes 15-30 minutes following our [deployment guide](backend/DEVELOPER_DEPLOYMENT.md).

### Where is my data stored?
On secure cloud infrastructure. Your shop data is encrypted and only used to power your AI agent.

### Can I customize the agent?
Yes, through the dashboard you can adjust the agent's personality and behavior.

---

## For Developers

### Can I self-host this?
**Yes.** The agent infrastructure is open source. See [DEVELOPER_DEPLOYMENT.md](backend/DEVELOPER_DEPLOYMENT.md).

### Do I need Etsy API keys to self-host?
**Yes,** if you want Etsy integration. You'll need to apply for an Etsy developer account and create your own Etsy API app.

Alternatively, you can use the infrastructure for other platforms (Shopify, custom APIs, etc.) without Etsy.

### What's included in the open source release?
- Complete agent infrastructure (provisioning, messaging, queue system)
- Claude AI integration code
- Skills plugin architecture
- Deployment scripts
- Full documentation

### What's NOT open source?
- The hosted service dashboard
- Etsy OAuth integration layer (specific to our app)
- Production configurations

### Can I build a competing service?
**Yes.** The MIT license allows commercial use. You're free to fork and build your own service.

### Can I use this for platforms other than Etsy?
**Absolutely.** The agent infrastructure is platform-agnostic. You can create plugins for Shopify, Amazon, WooCommerce, or any custom API.

---

## Technical Questions

### What AI model does this use?
Claude (Anthropic) powers the agents. You can configure which model version in your deployment.

### How does the agent know about my products?
The system syncs your product catalog and creates embeddings for semantic search. The agent has real-time access to inventory data.

### Can the agent make sales?
Not directly. It answers questions, provides recommendations, and can share product links. Actual purchases happen through your normal checkout flow.

### What messaging platforms are supported?
- WhatsApp
- Telegram
- Email (coming soon)
- Custom webhooks

### How much does it cost?

**Hosted Service (Etsy App Store):**
- Pricing to be announced

**Self-Hosted (Developers):**
- Server: ~$15-30/month (Hetzner VPS)
- Anthropic API: Pay-as-you-go for Claude usage
- No licensing fees (MIT license)

---

## Security & Privacy

### Is my data safe?
Yes. OAuth tokens are encrypted with AES-256-GCM. Passwords use bcrypt hashing. All data is stored securely.

### Do you sell my data?
**No.** Your shop and customer data is only used to power your AI agent.

### Can I delete my account?
Yes, at any time. All your data will be permanently deleted.

### Is this GDPR compliant?
Yes, the infrastructure supports GDPR requirements including data deletion and export.

---

## Support

### How do I get help?
- **Documentation**: Full docs at [/docs](docs/)
- **GitHub Issues**: Report bugs or request features
- **Email**: GitHub Issues

### Is there a community?
- **GitHub**: [github.com/bolivian-peru/agents-inventory](https://github.com/bolivian-peru/agents-inventory)
- **Telegram**: [t.me/inventoryforagents](https://t.me/inventoryforagents)
- **Twitter**: [@agentinventory](https://x.com/agentinventory)

### Can I contribute to the project?
Yes! See [CONTRIBUTING.md](backend/CONTRIBUTING.md) for guidelines.

---

**Still have questions?** Open an issue on GitHub or email GitHub Issues
