import type { Metadata } from "next"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"

export const metadata: Metadata = {
  title: "Get Started | Deploy Your AI Agent",
  description: "Deploy your own AI sales agent in 15 minutes. Full control, no limits, open source.",
}

export default function GetStartedPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="border-b border-border bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Deploy Your AI Agent
                <br />
                <span className="text-primary">In 15 Minutes</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Get your own AI sales agent infrastructure. Full control, no limits, open source.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://hetzner.cloud/?ref=nXcA4WhTDugS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-lg transition-colors"
                >
                  🚀 Get Server (€20 Free Credit)
                </a>
                <a
                  href="https://github.com/bolivian-peru/agents-inventory/blob/main/backend/DEPLOY_YOUR_OWN.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 border-2 border-border hover:bg-accent text-foreground font-bold text-lg rounded-lg transition-colors"
                >
                  📖 Deploy Guide
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Why Self-Host */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Deploy Your Own?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-2">Full Control</h3>
                <p className="text-muted-foreground">
                  Your server, your rules. Modify the code, add features, customize everything.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl mb-4">∞</div>
                <h3 className="text-xl font-bold mb-2">No Limits</h3>
                <p className="text-muted-foreground">
                  Unlimited messages, unlimited agents, unlimited possibilities.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl mb-4">🔑</div>
                <h3 className="text-xl font-bold mb-2">Your API Key</h3>
                <p className="text-muted-foreground">
                  Use your own Anthropic credits. No markup, no middleman.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-2">Private Data</h3>
                <p className="text-muted-foreground">
                  All your customer data and products stay on your server.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Steps */}
        <div className="border-t border-border bg-muted/30">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">3 Simple Steps</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Get a Server</h3>
                    <p className="text-muted-foreground mb-4">
                      Sign up for Hetzner Cloud (€20 free credit). Choose CX22 server (€5.83/month).
                    </p>
                    <a
                      href="https://hetzner.cloud/?ref=nXcA4WhTDugS"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#D50C2D] hover:bg-[#B00A26] text-white font-semibold rounded transition-colors"
                    >
                      Sign Up on Hetzner →
                    </a>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Run Deploy Script</h3>
                    <p className="text-muted-foreground mb-4">
                      SSH into your server and run one command. The script installs everything automatically.
                    </p>
                    <div className="bg-zinc-900 p-4 rounded-lg font-mono text-sm text-green-400 overflow-x-auto">
                      <code>
                        curl -fsSL https://raw.githubusercontent.com/bolivian-peru/agents-inventory/main/backend/scripts/deploy-hetzner.sh -o deploy.sh && chmod +x deploy.sh && sudo ./deploy.sh
                      </code>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Start Selling</h3>
                    <p className="text-muted-foreground">
                      Your AI agent is live! Connect your Etsy shop, sync products, and let your agent handle customer inquiries 24/7.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="border-t border-border">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Simple, Transparent Pricing</h2>
              <div className="bg-card border border-border rounded-lg p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="font-semibold">Hetzner Server (CX22)</span>
                    <span className="text-2xl font-bold">€5.83/month</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="font-semibold">Anthropic API</span>
                    <span className="text-2xl font-bold">~€10-50/month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-3xl font-bold text-primary">€15-60/month</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  * Anthropic API cost depends on usage. Most sellers use €10-30/month.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-border bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Deploy?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Get €20 free credit on Hetzner and deploy your AI agent in 15 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://hetzner.cloud/?ref=nXcA4WhTDugS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-lg transition-colors"
                >
                  Get Started with Hetzner →
                </a>
                <a
                  href="https://github.com/bolivian-peru/agents-inventory/blob/main/backend/DEPLOY_YOUR_OWN.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 border-2 border-border hover:bg-accent text-foreground font-bold text-lg rounded-lg transition-colors"
                >
                  Read Full Guide
                </a>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Need help? Join our{" "}
                <Link href="https://discord.gg/your-invite" className="text-primary hover:underline">
                  Discord community
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
