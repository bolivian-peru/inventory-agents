import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Masthead } from "@/components/masthead"
import { Footer } from "@/components/footer"
import {
  Store,
  MessageCircle,
  TrendingUp,
  Clock,
  Sparkles,
  ShoppingBag,
  BarChart3,
  Bell,
  CheckCircle2,
  ArrowRight,
  Package,
  Users,
  Zap,
} from "lucide-react"

export const metadata: Metadata = {
  title: "For Etsy Sellers | IFA",
  description:
    "Get your own AI assistant for your Etsy shop. Manages inventory, talks to customers, and helps you sell more - while you focus on creating.",
  alternates: {
    canonical: "/etsy",
  },
}

export default function EtsyPage() {
  return (
    <main className="min-h-screen bg-muted/30 text-foreground selection:bg-accent selection:text-accent-foreground">
      <div className="mx-auto max-w-[1400px] border-x border-border bg-background shadow-2xl">
        <Masthead />

        {/* Hero Section - Etsy Focused */}
        <section className="border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-16">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 font-mono text-sm text-orange-600">
                <Store className="h-4 w-4" />
                Made for Etsy Sellers
              </div>

              <h1 className="mb-6 font-sans text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                Your Etsy Shop Deserves a Helper That Never Sleeps
              </h1>

              <p className="mb-8 max-w-xl font-mono text-lg leading-relaxed text-muted-foreground">
                You make beautiful things. Let your AI assistant handle the rest - inventory tracking, customer
                messages, sales insights, and more. It&apos;s like hiring help, but smarter and always available.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/merchants">
                  <Button
                    size="lg"
                    className="h-14 w-full rounded-none border-2 border-transparent bg-orange-500 px-8 font-sans text-lg font-bold text-white hover:bg-orange-600 sm:w-auto"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Get My AI Assistant
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 w-full rounded-none border-2 px-8 font-sans text-lg font-bold sm:w-auto"
                  >
                    See How It Works
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Side */}
            <div className="flex items-center justify-center border-l border-border bg-gradient-to-br from-orange-50 to-orange-100 p-8 dark:from-orange-950/20 dark:to-orange-900/10 lg:p-16">
              <div className="w-full max-w-md space-y-4">
                {/* Mock Chat Interface */}
                <div className="rounded-lg border border-border bg-background p-4 shadow-lg">
                  <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
                    <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                    <span className="font-mono text-sm font-bold">Your AI Assistant</span>
                    <span className="ml-auto font-mono text-xs text-muted-foreground">Online</span>
                  </div>

                  <div className="space-y-3 font-mono text-sm">
                    <div className="rounded bg-muted/50 p-3">
                      <span className="text-muted-foreground">You:</span> How&apos;s my shop doing today?
                    </div>
                    <div className="rounded bg-orange-500/10 p-3">
                      <span className="text-orange-600">AI:</span> Great news! You sold 3 items today for $127 total.
                      Your &quot;Handmade Ceramic Mug&quot; is running low (2 left). Want me to mark it as low stock?
                    </div>
                    <div className="rounded bg-muted/50 p-3">
                      <span className="text-muted-foreground">You:</span> Yes, and what&apos;s my best seller this week?
                    </div>
                    <div className="rounded bg-orange-500/10 p-3">
                      <span className="text-orange-600">AI:</span> Your &quot;Vintage Brass Candleholder&quot; is the
                      star! 8 sold this week. I noticed similar items trending on Etsy - want me to suggest some new
                      tags?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pain Points Section */}
        <section className="border-b border-border p-8 lg:p-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 font-sans text-3xl font-bold md:text-4xl">
              Running an Etsy Shop is a Lot of Work
            </h2>
            <p className="mb-12 font-mono text-lg text-muted-foreground">We get it. You&apos;re wearing all the hats.</p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Package,
                title: "Tracking Inventory",
                pain: "Spreadsheets, mental notes, running out of stock...",
              },
              {
                icon: MessageCircle,
                title: "Customer Messages",
                pain: "Answering the same questions over and over again...",
              },
              {
                icon: BarChart3,
                title: "Understanding Sales",
                pain: "Which products are actually making money?",
              },
              {
                icon: Clock,
                title: "Finding Time",
                pain: "When do you actually get to CREATE?",
              },
              {
                icon: TrendingUp,
                title: "Growing Your Shop",
                pain: "Pricing, tags, SEO - so much to learn...",
              },
              {
                icon: Bell,
                title: "Staying on Top",
                pain: "Low stock alerts, expiring listings, reviews...",
              },
            ].map((item, i) => (
              <div key={i} className="border border-border bg-muted/20 p-6">
                <item.icon className="mb-3 h-8 w-8 text-orange-500" />
                <h3 className="mb-2 font-sans text-lg font-bold">{item.title}</h3>
                <p className="font-mono text-sm text-muted-foreground">{item.pain}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Solution Section */}
        <section className="border-b border-border bg-orange-500/5 p-8 lg:p-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 font-sans text-3xl font-bold md:text-4xl">
              Meet Your New Shop Assistant
            </h2>
            <p className="mb-12 font-mono text-lg text-muted-foreground">
              An AI that actually understands your Etsy business
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            {[
              {
                icon: ShoppingBag,
                title: "Knows Your Inventory Inside Out",
                description:
                  "Ask 'What needs restocking?' or 'Show me my top sellers' and get instant answers. Your AI syncs with your Etsy shop automatically.",
              },
              {
                icon: MessageCircle,
                title: "Chat Like You're Texting a Friend",
                description:
                  "Talk to your assistant on WhatsApp or Telegram. Ask questions, get updates, even while you're at craft fairs or on the go.",
              },
              {
                icon: BarChart3,
                title: "Understands Your Numbers",
                description:
                  "See what's selling, what's not, which prices work best. Get simple insights without needing a business degree.",
              },
              {
                icon: Zap,
                title: "Always Learning, Always Helping",
                description:
                  "The more you use it, the better it understands your shop. It remembers your preferences and gets smarter over time.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 border border-border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-orange-500 text-white">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-2 font-sans text-lg font-bold">{item.title}</h3>
                  <p className="font-mono text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="border-b border-border p-8 lg:p-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 font-sans text-3xl font-bold md:text-4xl">How It Works</h2>
            <p className="mb-12 font-mono text-lg text-muted-foreground">
              Set up in 5 minutes. No tech skills needed.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-border md:block"></div>

              {[
                {
                  step: "1",
                  title: "Connect Your Etsy Shop",
                  description:
                    "Click one button to securely connect. We never see your password - Etsy handles that. Your listings sync automatically.",
                },
                {
                  step: "2",
                  title: "Your AI Learns Your Shop",
                  description:
                    "It reads your product titles, prices, stock levels, and descriptions. Within minutes, it knows your entire inventory.",
                },
                {
                  step: "3",
                  title: "Start Chatting",
                  description:
                    "Connect WhatsApp or Telegram. Now you can ask your assistant anything: 'What sold today?' 'Am I running low on anything?' 'Show me my pricing.'",
                },
                {
                  step: "4",
                  title: "Get Smarter Over Time",
                  description:
                    "Your AI notices patterns - which products sell together, when sales spike, what prices work. It shares insights as it learns.",
                },
              ].map((item, i) => (
                <div key={i} className="relative mb-8 flex gap-6 last:mb-0">
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center border-2 border-orange-500 bg-background font-sans text-2xl font-bold text-orange-500">
                    {item.step}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="mb-2 font-sans text-xl font-bold">{item.title}</h3>
                    <p className="font-mono text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Can Ask */}
        <section className="border-b border-border bg-muted/30 p-8 lg:p-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 font-sans text-3xl font-bold md:text-4xl">Things You Can Ask</h2>
            <p className="mb-12 font-mono text-lg text-muted-foreground">Just text your assistant like you&apos;d text a friend</p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
            {[
              "How many items did I sell this week?",
              "What's my best selling product?",
              "Am I running low on anything?",
              "Show me products under $20",
              "What's my total inventory value?",
              "Which items haven't sold in 30 days?",
              "Give me a quick shop report",
              "What should I restock first?",
            ].map((question, i) => (
              <div key={i} className="flex items-center gap-3 border border-border bg-background p-4">
                <MessageCircle className="h-5 w-5 shrink-0 text-orange-500" />
                <span className="font-mono text-sm">&quot;{question}&quot;</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Teaser */}
        <section className="border-b border-border p-8 lg:p-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 font-mono text-sm text-green-600">
              <Sparkles className="h-4 w-4" />
              Early Access Special
            </div>

            <h2 className="mb-4 font-sans text-3xl font-bold md:text-4xl">Try It Free While We&apos;re in Beta</h2>

            <p className="mb-8 font-mono text-lg text-muted-foreground">
              We&apos;re still building and improving. Early sellers get free access and help shape the product.
            </p>

            <div className="mb-8 inline-block border-2 border-border bg-background p-8">
              <div className="mb-2 font-mono text-sm uppercase tracking-wider text-muted-foreground">Beta Access</div>
              <div className="mb-4 font-sans text-5xl font-bold">Free</div>
              <ul className="mb-6 space-y-2 text-left font-mono text-sm">
                {[
                  "Connect your Etsy shop",
                  "Full inventory analysis",
                  "WhatsApp or Telegram access",
                  "Unlimited questions",
                  "Early adopter perks later",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="font-mono text-sm text-muted-foreground">
              * Requires a Claude AI subscription ($20/month from Anthropic) to power the AI
            </div>
          </div>
        </section>

        {/* FAQ for Etsy Sellers */}
        <section className="border-b border-border p-8 lg:p-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center font-sans text-3xl font-bold md:text-4xl">Common Questions</h2>

            <div className="space-y-6">
              {[
                {
                  q: "Is this safe to connect to my Etsy shop?",
                  a: "Yes! We use Etsy's official secure connection (OAuth). We never see or store your Etsy password. You can disconnect anytime from your Etsy settings.",
                },
                {
                  q: "Do I need to be technical to use this?",
                  a: "Not at all! If you can send a text message, you can use this. Just type questions in plain English and get plain English answers.",
                },
                {
                  q: "What's Claude AI? Do I need to pay for that too?",
                  a: "Claude is the AI brain behind your assistant, made by Anthropic. You'll need their $20/month plan. Think of IFA as the 'Etsy expert' layer on top of Claude.",
                },
                {
                  q: "Can the AI change things in my shop?",
                  a: "Right now, it's read-only - it can see your inventory and answer questions but can't make changes. We're adding more features soon!",
                },
                {
                  q: "Will this work for my small shop?",
                  a: "Absolutely! Whether you have 10 products or 1,000, your AI assistant scales with you. Small shops often benefit most from the time savings.",
                },
                {
                  q: "What if I have questions or need help?",
                  a: "We're a small team and we actually respond! Reach out on Telegram and we'll help you get set up.",
                },
              ].map((item, i) => (
                <div key={i} className="border border-border p-6">
                  <h3 className="mb-3 font-sans text-lg font-bold">{item.q}</h3>
                  <p className="font-mono text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 text-white lg:p-16">
          <div className="mx-auto max-w-3xl text-center">
            <Users className="mx-auto mb-6 h-16 w-16 opacity-80" />

            <h2 className="mb-4 font-sans text-3xl font-bold md:text-4xl">
              Join the Etsy Sellers Getting AI Help
            </h2>

            <p className="mb-8 font-mono text-lg opacity-90">
              Stop spending hours on shop management. Let your AI handle the busywork while you focus on creating
              beautiful things.
            </p>

            <Link href="/merchants">
              <Button
                size="lg"
                className="h-14 rounded-none border-2 border-white bg-white px-8 font-sans text-lg font-bold text-orange-600 hover:bg-orange-50"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <p className="mt-6 font-mono text-sm opacity-75">
              No credit card required · Takes 5 minutes · Cancel anytime
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
