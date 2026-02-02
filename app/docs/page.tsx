import type React from "react"
import type { Metadata } from "next"
import { Masthead } from "@/components/masthead"
import { Footer } from "@/components/footer"
import {
  Bot,
  Store,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Shield,
  Zap,
  Target,
  BarChart3,
  Settings,
  Brain,
  Megaphone,
  Headphones,
  DollarSign,
  Vote,
  Gift,
  Server,
  Lock,
  Code,
  Menu,
  ChevronRight,
  User,
  Palette,
  ShoppingBag,
} from "lucide-react"
import * as motion from "framer-motion/client"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Thesis | The Vision for AI-Powered Commerce",
  description:
    "Our vision: every creator deserves an AI employee. Learn how IFA agents find customers, close sales, and grow your Shopify or Etsy business 24/7.",
  keywords: [
    "IFA thesis",
    "AI commerce vision",
    "AI sales agent",
    "Shopify AI",
    "Etsy AI",
    "future of ecommerce",
    "autonomous sales",
  ],
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "The IFA Thesis | AI Employees for Every Creator",
    description:
      "Why we're building AI sales agents for small creators. The future of commerce is autonomous—and it's here.",
  },
}

const SECTIONS = [
  { id: "intro", title: "Introduction", icon: Bot },
  { id: "getting-started", title: "Getting Started", icon: Zap },
  { id: "dashboard", title: "Your Dashboard", icon: BarChart3 },
  { id: "training", title: "Training Your Agent", icon: Brain },
  { id: "skills", title: "Agent Skills", icon: Sparkles },
  { id: "token", title: "The $IFA Token", icon: DollarSign },
  { id: "developers", title: "For Developers", icon: Code },
  { id: "faq", title: "FAQ", icon: MessageSquare },
]

function MobileNav() {
  return (
    <div className="mb-8 block md:hidden">
      <details className="group rounded-lg border border-border bg-background">
        <summary className="flex cursor-pointer select-none items-center justify-between p-4 font-mono text-sm font-bold uppercase">
          <span>Jump to Section</span>
          <Menu className="h-4 w-4 transition-transform group-open:rotate-180" />
        </summary>
        <nav className="flex flex-col border-t border-border p-2">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="flex items-center gap-2 rounded-sm px-4 py-3 font-mono text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <section.icon className="h-4 w-4" />
              {section.title}
            </a>
          ))}
        </nav>
      </details>
    </div>
  )
}

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-muted/30 text-foreground selection:bg-accent selection:text-accent-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col overflow-hidden border-x border-border bg-background shadow-2xl">
        <Masthead />

        <div className="flex-1">
          <div className="container mx-auto grid gap-8 px-4 py-8 md:grid-cols-[250px_1fr] md:px-6 md:py-16">
            {/* Sidebar Navigation */}
            <aside className="sticky top-24 hidden h-[calc(100vh-100px)] space-y-8 overflow-y-auto pr-4 md:block">
              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Documentation
                </h4>
                <nav className="flex flex-col space-y-2 font-mono text-sm">
                  {SECTIONS.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-2 text-muted-foreground decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      <section.icon className="h-3 w-3" />
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="space-y-4 border-t border-border pt-8">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Quick Links
                </h4>
                <nav className="flex flex-col space-y-2 font-mono text-sm">
                  <a
                    href="https://t.me/inventoryforagents"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <MessageSquare className="h-3 w-3" /> Telegram
                  </a>
                  <a
                    href="https://x.com/agentinventory"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Megaphone className="h-3 w-3" /> Twitter
                  </a>
                  <a
                    href="https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <DollarSign className="h-3 w-3" /> Buy $IFA
                  </a>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="w-full max-w-4xl space-y-12 md:space-y-20">
              <MobileNav />

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 border-b border-border pb-8 md:pb-12"
              >
                <div className="inline-flex items-center gap-2 border border-accent bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                  <Bot className="h-3 w-3" />
                  Your AI Employee Manual
                </div>
                <h1 className="break-words font-sans text-4xl font-bold uppercase tracking-tight md:text-6xl">
                  How IFA Works
                </h1>
                <p className="max-w-2xl font-mono text-base text-muted-foreground md:text-xl">
                  Everything you need to know about setting up, training, and managing your AI sales agent. No technical
                  experience required.
                </p>
              </motion.div>

              {/* 1. Introduction */}
              <Section id="intro" title="Introduction">
                <div className="space-y-8">
                  {/* What is an IFA Agent */}
                  <div className="space-y-4">
                    <h3 className="font-sans text-xl font-bold">What is an IFA Agent?</h3>
                    <p className="font-mono leading-relaxed text-muted-foreground">
                      Think of an IFA Agent as your first AI employee—a tireless sales and marketing associate that works
                      24/7, never takes breaks, and never asks for a raise. Unlike a chatbot that sits on your website
                      waiting for customers to come to you, your IFA Agent is{" "}
                      <span className="font-bold text-foreground">proactive</span>. It goes out onto the internet,
                      finds people who need your products, and brings them to your store.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="border border-border bg-muted/20 p-4">
                        <div className="mb-2 font-sans font-bold text-muted-foreground line-through">Old Way: Chatbot</div>
                        <p className="font-mono text-sm text-muted-foreground">
                          Waits on your website. Only talks to people who already found you. Reactive.
                        </p>
                      </div>
                      <div className="border-2 border-accent bg-accent/10 p-4">
                        <div className="mb-2 font-sans font-bold text-accent">New Way: IFA Agent</div>
                        <p className="font-mono text-sm text-muted-foreground">
                          Hunts across social media. Finds customers before they find you. Proactive.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* How It Works */}
                  <div className="space-y-4">
                    <h3 className="font-sans text-xl font-bold">How It Works</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <StepCard
                        number={1}
                        title="Connect"
                        desc="Install the IFA plugin from your Shopify or Etsy app store. Takes 2 minutes."
                        icon={Store}
                      />
                      <StepCard
                        number={2}
                        title="Awaken"
                        desc="Your agent learns your products, brand story, and voice. It becomes YOU."
                        icon={Brain}
                      />
                      <StepCard
                        number={3}
                        title="Deploy"
                        desc="Your agent starts scouting Reddit, Twitter, Discord for customers. Sales roll in."
                        icon={TrendingUp}
                      />
                    </div>
                  </div>

                  {/* Is IFA For You */}
                  <div className="space-y-4">
                    <h3 className="font-sans text-xl font-bold">Is IFA For You?</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <PersonaCard
                        icon={Palette}
                        title="The Solo Artisan"
                        desc="You pour your heart into creating handmade products on Etsy. Marketing feels like a chore that takes you away from your craft. IFA handles the outreach so you can focus on what you love."
                      />
                      <PersonaCard
                        icon={ShoppingBag}
                        title="The Small DTC Brand"
                        desc="You're competing against brands with 10x your marketing budget. IFA is your equalizer—giving you enterprise-level sales outreach at a fraction of the cost."
                      />
                      <PersonaCard
                        icon={User}
                        title="The Side Hustler"
                        desc="You have a day job but run a store on the side. You don't have time to hunt for customers. Your agent works while you work (and while you sleep)."
                      />
                    </div>
                  </div>
                </div>
              </Section>

              {/* 2. Getting Started */}
              <Section id="getting-started" title="Getting Started">
                <div className="space-y-8">
                  {/* Quickstart */}
                  <div className="border-2 border-accent bg-accent/5 p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-accent" />
                      <h3 className="font-sans text-xl font-bold">Quickstart: 5 Minutes to Your First Agent</h3>
                    </div>
                    <ol className="space-y-3 font-mono text-sm">
                      <li className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground">
                          1
                        </span>
                        <span>
                          Go to your <strong>Shopify</strong> or <strong>Etsy</strong> app store and search for
                          "Inventory for Agents"
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground">
                          2
                        </span>
                        <span>
                          Click <strong>Install</strong> and approve the permissions (we only ask for what we need)
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground">
                          3
                        </span>
                        <span>
                          Complete the 3-question onboarding wizard to tell your agent about your brand
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground">
                          4
                        </span>
                        <span>
                          Click <strong>"Activate Agent"</strong> — you're live!
                        </span>
                      </li>
                    </ol>
                  </div>

                  {/* Platform Guides */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="border border-border p-6 transition-colors hover:border-accent">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full bg-[#95BF47]"></div>
                        <h3 className="font-sans text-xl font-bold">Installing on Shopify</h3>
                      </div>
                      <ul className="space-y-2 font-mono text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-3 w-3 text-accent" />
                          Search "IFA" in Shopify App Store
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-3 w-3 text-accent" />
                          Click Install and approve permissions
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-3 w-3 text-accent" />
                          Redirected to IFA dashboard automatically
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-3 w-3 text-accent" />
                          No theme edits required
                        </li>
                      </ul>
                      <div className="mt-4 rounded bg-muted/30 p-3 font-mono text-xs text-muted-foreground">
                        <strong>Permissions:</strong> read_products (to learn your catalog), write_orders (to create
                        sales)
                      </div>
                    </div>

                    <div className="border border-border p-6 transition-colors hover:border-accent">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full bg-[#F56400]"></div>
                        <h3 className="font-sans text-xl font-bold">Installing on Etsy</h3>
                      </div>
                      <ul className="space-y-2 font-mono text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-3 w-3 text-accent" />
                          Connect your Etsy account via OAuth
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-3 w-3 text-accent" />
                          Select which listings to expose to agent
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-3 w-3 text-accent" />
                          Agent learns your shop's unique style
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-3 w-3 text-accent" />
                          Syncs automatically as you add products
                        </li>
                      </ul>
                      <div className="mt-4 rounded bg-muted/30 p-3 font-mono text-xs text-muted-foreground">
                        <strong>Permissions:</strong> listings_r (to read products), transactions_r (to track sales)
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              {/* 3. Your Dashboard */}
              <Section id="dashboard" title="Your Agent Dashboard">
                <div className="space-y-6">
                  <p className="font-mono leading-relaxed text-muted-foreground">
                    The dashboard is your command center. Here's what each section tells you:
                  </p>

                  <div className="grid gap-4">
                    <DashboardFeature
                      title="Agent Status"
                      icon={Bot}
                      desc="See if your agent is active, paused, or needs attention. Green means it's working for you right now."
                    />
                    <DashboardFeature
                      title="Activity Feed"
                      icon={MessageSquare}
                      desc="A real-time log of everything your agent does: conversations found, replies drafted, leads generated. Full transparency."
                    />
                    <DashboardFeature
                      title="Performance Analytics"
                      icon={BarChart3}
                      desc="Track your ROI. See how many leads your agent found, how many converted to sales, and your total revenue attributed to IFA."
                    />
                    <DashboardFeature
                      title="Settings"
                      icon={Settings}
                      desc="Manage your subscription, update your brand voice, set rules of engagement, and configure which platforms your agent uses."
                    />
                  </div>
                </div>
              </Section>

              {/* 4. Training Your Agent */}
              <Section id="training" title="Training Your Agent">
                <div className="space-y-8">
                  <p className="font-mono leading-relaxed text-muted-foreground">
                    Your agent is only as good as the training you give it. Here's how to make it great:
                  </p>

                  <div className="space-y-6">
                    <TrainingTopic
                      title="How Your Agent Learns"
                      icon={Brain}
                      content="When you connect your store, your agent immediately ingests your product catalog, descriptions, and any brand information you provide. This forms its base knowledge. The more detail you give, the smarter it gets."
                    />

                    <TrainingTopic
                      title="Chatting With Your Agent"
                      icon={MessageSquare}
                      content="You can talk to your agent directly in the dashboard. Give it instructions, ask it to draft content, or refine its approach. Think of it like onboarding a new employee."
                    >
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div className="border border-accent/50 bg-accent/5 p-3">
                          <div className="mb-1 font-mono text-xs font-bold text-accent">Good Prompt</div>
                          <p className="font-mono text-xs text-muted-foreground">
                            "Write a Reddit comment recommending our organic dog treats to someone asking about healthy
                            snacks for puppies. Be helpful, not salesy."
                          </p>
                        </div>
                        <div className="border border-destructive/50 bg-destructive/5 p-3">
                          <div className="mb-1 font-mono text-xs font-bold text-destructive">Bad Prompt</div>
                          <p className="font-mono text-xs text-muted-foreground">"Do marketing."</p>
                        </div>
                      </div>
                    </TrainingTopic>

                    <TrainingTopic
                      title="Setting Rules of Engagement"
                      icon={Shield}
                      content="You're in control. Tell your agent which platforms to use (Reddit, Twitter, Discord), which topics to avoid (competitors, politics), and whether it should post automatically or wait for your approval."
                    />

                    <TrainingTopic
                      title="Perfecting Your Brand Voice"
                      icon={Palette}
                      content="If a reply feels too formal or too casual, tell your agent. Example feedback: 'That was a bit corporate, let's be more playful and use emojis.' It learns from every correction."
                    />
                  </div>
                </div>
              </Section>

              {/* 5. Agent Skills */}
              <Section id="skills" title="Agent Skills">
                <div className="space-y-6">
                  <p className="font-mono leading-relaxed text-muted-foreground">
                    Your agent comes with powerful skills out of the box, with more capabilities planned:
                  </p>

                  <div className="grid gap-4">
                    <SkillCard
                      title="Social Media Scout"
                      icon={Target}
                      tier="Core"
                      desc="Your agent monitors Reddit, Twitter, Discord, and forums 24/7. It finds conversations where your product is the perfect solution and drafts helpful, authentic responses for your approval."
                    />
                    <SkillCard
                      title="Content Creator"
                      icon={Megaphone}
                      tier="Core"
                      desc="Generate blog posts, tweets, product descriptions, and social media content that matches your brand voice. Never stare at a blank page again."
                    />
                    <SkillCard
                      title="Customer Service Agent"
                      icon={Headphones}
                      tier="Advanced"
                      tierColor="accent"
                      desc="Handle common customer questions automatically. Your agent can answer FAQs, provide order status, and escalate complex issues to you."
                    />
                    <SkillCard
                      title="Ad Campaign Manager"
                      icon={DollarSign}
                      tier="Advanced"
                      tierColor="accent"
                      desc="Let your agent create and manage small-budget ad campaigns. It tests creatives, optimizes targeting, and reports results—all autonomously."
                    />
                  </div>

                  <div className="border-l-2 border-accent bg-accent/5 p-4">
                    <p className="font-mono text-sm text-muted-foreground">
                      <strong className="text-foreground">Advanced Skills:</strong> We're exploring ways $IFA holders might
                      get early access to new capabilities. Stay tuned.
                    </p>
                  </div>
                </div>
              </Section>

              {/* 6. The $IFA Token */}
              <Section id="token" title="The $IFA Token">
                <div className="space-y-6">
                  <p className="font-mono leading-relaxed text-muted-foreground">
                    $IFA is a community token for believers in AI-powered commerce. We're building in public and
                    exploring what this could become together.
                  </p>

                  <div className="grid gap-6 md:grid-cols-3">
                    <TokenFeature
                      title="Community First"
                      icon={Sparkles}
                      desc="Join a community of creators, degens, and builders who believe in autonomous commerce. Early believers, early access."
                    />
                    <TokenFeature
                      title="Shape the Direction"
                      icon={Vote}
                      desc="We're exploring ways for holders to influence what gets built. Your voice could help shape the roadmap."
                    />
                    <TokenFeature
                      title="Open Source Journey"
                      icon={Gift}
                      desc="Code going open-source soon. We're figuring out sustainable models—nothing promised, everything possible."
                    />
                  </div>

                  <div className="border border-border bg-muted/20 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-mono text-sm font-bold">$IFA Token</span>
                      <span className="rounded-full border border-accent bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                        LIVE
                      </span>
                    </div>
                    <div className="space-y-2 font-mono text-sm text-muted-foreground">
                      <div>
                        <strong>Chain:</strong> Solana
                      </div>
                      <div>
                        <strong>Platform:</strong> Pump.fun
                      </div>
                      <div className="break-all">
                        <strong>CA:</strong> GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump
                      </div>
                    </div>
                    <a
                      href="https://pump.fun/coin/GdRFrMAUF6J4e4FrogFuDPQmv6kQAT197NeeY7ropump"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 block w-full border-2 border-accent bg-accent px-4 py-3 text-center font-bold text-accent-foreground transition-colors hover:bg-accent/80"
                    >
                      Buy $IFA on Pump.fun
                    </a>
                  </div>
                </div>
              </Section>

              {/* 7. For Developers */}
              <Section id="developers" title="For Developers">
                <div className="space-y-6">
                  <p className="font-mono leading-relaxed text-muted-foreground">
                    Curious about the tech under the hood? Here's a peek behind the curtain:
                  </p>

                  <div className="grid gap-4">
                    <DevTopic
                      title="Architectural Overview"
                      icon={Server}
                      content="IFA runs on a multi-tenant architecture with dedicated OpenClaw instances per merchant. Shopify/Etsy plugins sync inventory to our backend, which orchestrates AI agents across social platforms."
                    />
                    <DevTopic
                      title="Security & Sandboxing"
                      icon={Lock}
                      content="Each merchant's agent runs in an isolated container with strict network policies. We follow the principle of least privilege—agents only have access to what they need. Your data never touches another merchant's agent."
                    />
                    <DevTopic
                      title="Building Your Own Skills"
                      icon={Code}
                      content="Coming soon: A developer SDK for building custom agent skills. Create skills, contribute to the ecosystem, and help shape what AI employees can do."
                    />
                  </div>

                  <div className="border border-border bg-muted/10 p-4">
                    <p className="font-mono text-sm text-muted-foreground">
                      <strong>Open Source:</strong> Core components going open-source soon. Star the repo and contribute.
                    </p>
                  </div>
                </div>
              </Section>

              {/* 8. FAQ */}
              <Section id="faq" title="Frequently Asked Questions">
                <div className="space-y-4">
                  <FAQItem
                    question="Is this just another chatbot?"
                    answer="No. A chatbot is reactive—it waits for customers to come to you. An IFA Agent is proactive—it goes out onto the internet and finds customers for you. It's the difference between a receptionist and a sales rep."
                  />
                  <FAQItem
                    question="Is this safe for my brand?"
                    answer="Absolutely. Your agent is trained on YOUR brand voice. You set the rules of engagement, choose which platforms it uses, and can require approval before any post goes live. Full control, full transparency."
                  />
                  <FAQItem
                    question="Do I need to know anything about crypto?"
                    answer="No. The core product will work without any crypto knowledge. $IFA is a community token for those who want to be part of the experiment—totally optional."
                  />
                  <FAQItem
                    question="What is OpenClaw?"
                    answer="OpenClaw is the powerful, open-source AI agent framework that serves as the 'engine' for our agents. We've built a secure, scalable platform on top of it so you get all the power without any technical headaches."
                  />
                  <FAQItem
                    question="How much does it cost?"
                    answer="We're currently in beta. Early merchants get special pricing. Join the waitlist to be first in line when we launch."
                  />
                  <FAQItem
                    question="Can I pause or stop my agent?"
                    answer="Yes, anytime. One click in the dashboard pauses all activity. Your agent will pick up right where it left off when you're ready."
                  />
                </div>
              </Section>

              {/* CTA */}
              <div className="border-2 border-accent bg-accent/10 p-8 text-center">
                <h3 className="mb-4 font-sans text-2xl font-bold">Ready to Meet Your AI Employee?</h3>
                <p className="mb-6 font-mono text-muted-foreground">
                  Join the waitlist and be first to activate your agent when we launch.
                </p>
                <Link
                  href="/merchants"
                  className="inline-block border-2 border-accent bg-accent px-8 py-3 font-bold text-accent-foreground transition-colors hover:bg-accent/80"
                >
                  Get Early Access
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border">
          <Footer />
        </div>
      </div>
    </main>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="scroll-mt-28 md:scroll-mt-32"
    >
      <h2 className="mb-4 border-b border-border pb-2 font-sans text-2xl font-bold uppercase tracking-tight md:mb-6 md:text-3xl">
        {title}
      </h2>
      {children}
    </motion.section>
  )
}

function StepCard({
  number,
  title,
  desc,
  icon: Icon,
}: { number: number; title: string; desc: string; icon: React.ElementType }) {
  return (
    <div className="border border-border bg-background p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent font-mono font-bold text-accent-foreground">
          {number}
        </div>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <h4 className="mb-1 font-sans font-bold">{title}</h4>
      <p className="font-mono text-xs text-muted-foreground">{desc}</p>
    </div>
  )
}

function PersonaCard({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="border border-border bg-background p-4 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg">
      <Icon className="mb-3 h-6 w-6 text-accent" />
      <h4 className="mb-2 font-sans font-bold">{title}</h4>
      <p className="font-mono text-xs leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  )
}

function DashboardFeature({ title, icon: Icon, desc }: { title: string; icon: React.ElementType; desc: string }) {
  return (
    <div className="flex gap-4 border border-border bg-background p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-muted">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="mb-1 font-sans font-bold">{title}</h4>
        <p className="font-mono text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}

function TrainingTopic({
  title,
  icon: Icon,
  content,
  children,
}: { title: string; icon: React.ElementType; content: string; children?: React.ReactNode }) {
  return (
    <div className="border-l-2 border-border pl-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-accent" />
        <h4 className="font-sans font-bold">{title}</h4>
      </div>
      <p className="font-mono text-sm text-muted-foreground">{content}</p>
      {children}
    </div>
  )
}

function SkillCard({
  title,
  icon: Icon,
  tier,
  tierColor = "muted-foreground",
  desc,
}: { title: string; icon: React.ElementType; tier: string; tierColor?: string; desc: string }) {
  return (
    <div className="flex gap-4 border border-border bg-background p-4 transition-colors hover:border-accent">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-muted">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <h4 className="font-sans font-bold">{title}</h4>
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${tierColor === "accent" ? "border-accent bg-accent/20 text-accent" : "border-border bg-muted text-muted-foreground"}`}
          >
            {tier}
          </span>
        </div>
        <p className="font-mono text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}

function TokenFeature({ title, icon: Icon, desc }: { title: string; icon: React.ElementType; desc: string }) {
  return (
    <div className="border border-border bg-background p-4 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
        <Icon className="h-6 w-6 text-accent" />
      </div>
      <h4 className="mb-2 font-sans font-bold">{title}</h4>
      <p className="font-mono text-xs text-muted-foreground">{desc}</p>
    </div>
  )
}

function DevTopic({ title, icon: Icon, content }: { title: string; icon: React.ElementType; content: string }) {
  return (
    <div className="flex gap-4 border border-border bg-muted/10 p-4">
      <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
      <div>
        <h4 className="mb-1 font-sans font-bold">{title}</h4>
        <p className="font-mono text-xs text-muted-foreground">{content}</p>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border border-border bg-background">
      <summary className="flex cursor-pointer select-none items-center justify-between p-4 font-sans font-bold">
        {question}
        <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
      </summary>
      <div className="border-t border-border p-4">
        <p className="font-mono text-sm text-muted-foreground">{answer}</p>
      </div>
    </details>
  )
}
