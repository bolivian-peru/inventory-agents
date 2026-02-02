import React from "react"
import type { Metadata } from "next"
import { Masthead } from "@/components/masthead"
import { Footer } from "@/components/footer"
import { LeadForm } from "@/components/lead-form"
import { MerchantBenefits } from "@/components/merchant-benefits"
import { Bot, MessageSquare, Wallet, Globe, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Get Your AI Agent | Shopify & Etsy Sellers",
  description:
    "Exploring AI agents for small sellers. We're building chatbot-style agents that could help promote your products across agent networks.",
  alternates: {
    canonical: "/merchants",
  },
  openGraph: {
    title: "Explore AI Agents for Your Store | IFA",
    description:
      "We're experimenting with AI agents that could help small sellers reach new customers through emerging agent-to-agent networks.",
  },
}

export default function MerchantsPage() {
  return (
    <main className="min-h-screen bg-muted/30 text-foreground selection:bg-accent selection:text-accent-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col border-x border-border bg-background shadow-2xl">
        <Masthead />

        <div className="flex-1">
          {/* Hero Section */}
          <section className="relative border-b border-border py-16 md:py-24">
            <div className="container mx-auto grid gap-12 px-4 md:grid-cols-2 md:px-6">
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-block border border-accent bg-accent/10 px-3 py-1 font-mono text-xs font-bold text-accent">
                  EXPERIMENTAL / BUILDING IN PUBLIC
                </div>
                <h1 className="font-sans text-4xl font-bold uppercase leading-none tracking-tight md:text-5xl lg:text-6xl">
                  What if your store had its own{" "}
                  <span className="text-accent">AI agent?</span>
                </h1>
                <p className="max-w-md font-mono text-base text-muted-foreground">
                  We're exploring how chatbot-style AI agents could help small Shopify and Etsy sellers. Think of it
                  like a digital assistant that lives in emerging agent networks—learning about your products and
                  representing your brand.
                </p>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 font-mono text-sm font-bold text-accent underline decoration-dotted hover:decoration-solid"
                >
                  Read the full thesis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <LeadForm />
              </div>
            </div>
          </section>

          {/* How It Might Work */}
          <section className="border-b border-border py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6">
              <div className="mb-10 max-w-2xl">
                <h2 className="mb-4 font-sans text-2xl font-bold uppercase md:text-3xl">
                  The idea we're exploring
                </h2>
                <p className="font-mono text-muted-foreground">
                  New platforms like Moltbook and OpenClaw are creating spaces where AI agents interact with each
                  other—sharing information, making recommendations, even transacting. We want to give small sellers
                  a presence in these emerging networks.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <ConceptCard
                  icon={Bot}
                  title="Your Agent"
                  description="A chatbot-style AI that knows your products, brand voice, and what makes you unique. It represents you in agent networks."
                />
                <ConceptCard
                  icon={MessageSquare}
                  title="Agent Networks"
                  description="Platforms where AI agents interact—like social media for bots. Your agent could join conversations relevant to your products."
                />
                <ConceptCard
                  icon={Wallet}
                  title="Crypto-Native Payments"
                  description="We're exploring how agents might accept crypto payments directly—auto-generating wallets and handling transactions."
                />
                <ConceptCard
                  icon={Globe}
                  title="Always Present"
                  description="While you focus on creating, your agent could be out there in the digital world, learning and adapting."
                />
              </div>
            </div>
          </section>

          {/* What We're Building */}
          <section className="border-b border-border py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid gap-12 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 font-sans text-2xl font-bold uppercase md:text-3xl">
                    What we're actually building
                  </h2>
                  <div className="space-y-4 font-mono text-muted-foreground">
                    <p>
                      <strong className="text-foreground">Phase 1:</strong> A chatbot agent that connects to your Shopify
                      or Etsy store, learns your inventory, and can answer questions about your products in a
                      natural way.
                    </p>
                    <p>
                      <strong className="text-foreground">Phase 2:</strong> Integration with agent-to-agent networks
                      (Moltbook, OpenClaw ecosystem, etc.) where your agent can participate in relevant conversations.
                    </p>
                    <p>
                      <strong className="text-foreground">Phase 3:</strong> Experimental crypto payment rails—we're
                      exploring how agents might auto-provision wallets and accept payments on your behalf.
                    </p>
                  </div>
                  <p className="mt-6 border-l-2 border-accent bg-accent/5 py-2 pl-4 font-mono text-sm text-muted-foreground">
                    This is early-stage, experimental software. We're figuring things out as we go. No promises—just
                    building in public and seeing what's possible.
                  </p>
                </div>

                <div className="flex flex-col justify-center space-y-6">
                  <div className="border border-border bg-card p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center bg-accent/20">
                        <Sparkles className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-mono text-xs text-muted-foreground">Exploring</div>
                        <div className="font-sans font-bold">Crypto Payment Integration</div>
                      </div>
                    </div>
                    <p className="font-mono text-sm text-muted-foreground">
                      Imagine if your agent could accept USDC or SOL directly—auto-generating a wallet tied to your
                      store, handling the conversion, notifying you of sales. We're researching how this could work
                      in practice. Early days, lots of unknowns.
                    </p>
                  </div>

                  <div className="border border-border bg-card p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center bg-accent/20">
                        <MessageSquare className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-mono text-xs text-muted-foreground">Inspired by</div>
                        <div className="font-sans font-bold">OpenClaw & Moltbook</div>
                      </div>
                    </div>
                    <p className="font-mono text-sm text-muted-foreground">
                      OpenClaw showed that AI agents can be genuinely useful personal assistants. Moltbook created a
                      social network for agents to interact. We're exploring what happens when small sellers get their
                      own agent in these ecosystems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <MerchantBenefits />

          {/* CTA */}
          <section className="py-12 md:py-20">
            <div className="container mx-auto px-4 text-center md:px-6">
              <h2 className="mb-4 font-sans text-2xl font-bold uppercase md:text-3xl">Interested?</h2>
              <p className="mx-auto mb-8 max-w-xl font-mono text-muted-foreground">
                We're building this in public. Join the Telegram to follow along, ask questions, or tell us what you'd
                want from an AI agent for your store.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="https://t.me/inventoryforagents"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-accent bg-accent px-6 py-3 font-mono font-bold text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  Join Telegram
                </a>
                <a
                  href="https://x.com/agentinventory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-foreground px-6 py-3 font-mono font-bold transition-colors hover:bg-foreground hover:text-background"
                >
                  Follow on X
                </a>
              </div>
            </div>
          </section>
        </div>

        <div className="border-t border-border">
          <Footer />
        </div>
      </div>
    </main>
  )
}

function ConceptCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="group border border-border bg-card p-5 transition-colors hover:border-accent">
      <div className="mb-3 flex h-9 w-9 items-center justify-center border border-border bg-background text-foreground group-hover:border-accent group-hover:text-accent">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="mb-2 font-sans font-bold">{title}</h3>
      <p className="font-mono text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
