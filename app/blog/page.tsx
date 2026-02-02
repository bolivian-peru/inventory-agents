import type React from "react"
import type { Metadata } from "next"
import { Masthead } from "@/components/masthead"
import { Footer } from "@/components/footer"
import { ArrowRight, Terminal, Zap, Globe, Train, Calendar, Cpu } from "lucide-react"
import * as motion from "framer-motion/client"

export const metadata: Metadata = {
  title: "The Agentic Economy | Future of AI Commerce",
  description:
    "Explore how AI agents are transforming commerce. Deep dive into hospitality, travel, events, retail, and compute sectors.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "The Agentic Economy: A Blueprint for Automated Commerce",
    description:
      "Why every small store needs an AI sales agent. Learn how autonomous agents are leveling the playing field for creators.",
  },
}

const SECTIONS = [
  { id: "intro", title: "The Agentic Shift" },
  { id: "hospitality", title: "Hospitality" },
  { id: "travel", title: "Travel" },
  { id: "events", title: "Events" },
  { id: "retail", title: "Retail" },
  { id: "compute", title: "Compute" },
  { id: "conclusion", title: "The Path Forward" },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-muted/30 text-foreground selection:bg-accent selection:text-accent-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col border-x border-border bg-background shadow-2xl overflow-hidden">
        <Masthead />

        <div className="relative border-b border-border bg-[#0d0d0d] text-white overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="container mx-auto relative px-4 py-24 md:py-32 md:px-6">
            <div className="inline-flex items-center gap-2 border border-accent bg-accent/10 px-3 py-1 text-xs font-bold text-accent uppercase tracking-wider mb-8">
              <Terminal className="h-3 w-3" />
              Manifesto v1.0
            </div>
            <h1 className="font-sans text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.9] mb-8">
              The Agentic <br />
              Economy
            </h1>
            <p className="font-mono text-lg md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
              A blueprint for the automated future where AI agents are the primary consumers of the world's inventory.
            </p>
          </div>
        </div>

        <div className="flex-1">
          <div className="container mx-auto grid gap-8 px-4 py-8 md:grid-cols-[250px_1fr] md:px-6 md:py-24">
            {/* Sidebar Navigation */}
            <aside className="hidden h-[calc(100vh-100px)] space-y-8 sticky top-24 md:block overflow-y-auto pr-4 scrollbar-hide border-r border-border/50">
              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Table of Contents
                </h4>
                <nav className="flex flex-col space-y-3 font-mono text-sm">
                  {SECTIONS.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-muted-foreground transition-colors hover:text-foreground hover:underline decoration-accent decoration-2 underline-offset-4"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <article className="prose prose-neutral dark:prose-invert max-w-4xl w-full">
              {/* Intro */}
              <Section id="intro" title="The Agentic Shift">
                <p className="font-mono text-lg md:text-xl leading-relaxed mb-8 first-letter:float-left first-letter:text-5xl first-letter:pr-4 first-letter:font-bold first-letter:font-sans">
                  The internet was built for humans. Buttons were made for fingers, colors for eyes, and copy for
                  brains. But a new economic actor has entered the chat:{" "}
                  <span className="text-accent font-bold">The AI Agent</span>.
                </p>
                <p className="font-serif text-lg leading-relaxed mb-8">
                  We are transitioning from a Human-Computer Interaction (HCI) model to an Agent-Computer Interaction
                  (ACI) model. In this new world, "Inventory" isn't just rows on a shelf—it's programmable assets
                  waiting to be discovered, negotiated for, and consumed by autonomous software.
                </p>
                <div className="bg-muted/10 border border-border p-8 my-12">
                  <h3 className="font-sans font-bold text-xl mb-4 uppercase">The Core Thesis</h3>
                  <p className="font-mono text-sm md:text-base italic">
                    "Every asset class that can be digitized will eventually be consumed primarily by non-human actors.
                    Merchants who optimize for API-first discovery will win the Agentic Economy."
                  </p>
                </div>
              </Section>

              {/* Hospitality */}
              <Section id="hospitality" title="Hospitality: The Self-Negotiating Room">
                <p className="font-serif text-lg leading-relaxed mb-8">
                  Imagine a world where hotel rooms aren't just booked, but <em>negotiated</em> in real-time. Hotels
                  currently sit on "perishable inventory"—an empty room tonight is worth $0 tomorrow.
                </p>
                <ScenarioBox
                  icon={Zap}
                  title="Scenario: The 11:50 PM Negotiation"
                  agent="TravelAgent-X"
                  system="Hilton-Core-AI"
                  dialog={[
                    {
                      speaker: "Agent",
                      text: "Client landing JKF in 20m. Needs room. Budget: $200. Preference: Downtown.",
                    },
                    { speaker: "System", text: "Occupancy at 85%. Standard rate is $350." },
                    { speaker: "Agent", text: "Offer: $220 instant settlement via x402. No cancellation." },
                    {
                      speaker: "System",
                      text: "Calculating marginal cost... Accepted. Room 404 unlocked. Digital key sent.",
                    },
                  ]}
                />
                <p className="font-mono text-sm text-muted-foreground mt-6">
                  With IFA, hotels can expose "Dark Inventory" to trusted agents, allowing for dynamic pricing that
                  maximizes yield without degrading public brand value.
                </p>
              </Section>

              {/* Travel */}
              <Section id="travel" title="Travel: Multi-Modal Stitching">
                <p className="font-serif text-lg leading-relaxed mb-8">
                  Booking a trip today involves 15 tabs: flights, trains, ubers, hotels. Agents will stitch these
                  distinct inventory types into a single "Route Asset".
                </p>
                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <div className="border border-border p-6">
                    <Train className="h-8 w-8 mb-4 text-accent" />
                    <h4 className="font-bold font-sans text-lg mb-2">Atomic Routing</h4>
                    <p className="font-mono text-sm text-muted-foreground">
                      A delayed flight automatically triggers a re-booking of the connecting train and notifies the
                      hotel of late check-in.
                    </p>
                  </div>
                  <div className="border border-border p-6">
                    <Globe className="h-8 w-8 mb-4 text-accent" />
                    <h4 className="font-bold font-sans text-lg mb-2">Cross-Provider Auth</h4>
                    <p className="font-mono text-sm text-muted-foreground">
                      One identity (DID) clears passport control, unlocks the rental car, and boards the train.
                    </p>
                  </div>
                </div>
              </Section>

              {/* Events */}
              <Section id="events" title="Events: Access as a Token">
                <p className="font-serif text-lg leading-relaxed mb-8">
                  Scalpers exist because pricing is static while demand is dynamic. IFA enables "Dutch Auction" style
                  inventory for high-demand events, where agents bid on behalf of fans within pre-set parameters.
                </p>
                <ScenarioBox
                  icon={Calendar}
                  title="Scenario: The Superfan Upgrade"
                  agent="Fan-Agent-007"
                  system="TicketMaster-AI"
                  dialog={[
                    { speaker: "System", text: "Event: Taylor Swift. 2 Front Row seats released due to cancellation." },
                    { speaker: "Agent", text: "Client has 'Top 1% Listener' verified credential. Bid: $800." },
                    { speaker: "System", text: "Bid accepted. Transferring NFT tickets. Previous tickets refunded." },
                  ]}
                />
              </Section>

              {/* Retail */}
              <Section id="retail" title="Retail: Just-In-Time Consumption">
                <p className="font-serif text-lg leading-relaxed mb-8">
                  The fridge that buys its own milk is a cliché. The reality is much more interesting:
                  <strong> Supply Chain Arbitrage</strong>.
                </p>
                <p className="font-serif text-lg leading-relaxed mb-8">
                  Your "Personal Shopper Agent" doesn't just buy from Amazon. It scans local boutiques,
                  direct-to-consumer warehouses, and even peer-to-peer marketplaces to find the exact item you need, at
                  the best price, with the fastest delivery.
                </p>
                <div className="bg-[#0d0d0d] border border-border p-6 font-mono text-xs text-muted-foreground">
                  <div className="flex justify-between border-b border-border/20 pb-2 mb-2">
                    <span>QUERY: "Nike Air Max 97 Silver Bullet size 10"</span>
                    <span className="text-accent">EXECUTING...</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <span className="text-green-500">[FOUND]</span> Store: FootLocker (No Stock)
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-500">[FOUND]</span> Store: StockX ($240 + 5 day ship)
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">[WINNER]</span> Store: Local Boutique "Kicks" ($210 + 2 hour drone)
                    </li>
                    <li className="mt-4 text-white">Action: Purchasing from "Kicks" via x402...</li>
                  </ul>
                </div>
              </Section>

              {/* Compute */}
              <Section id="compute" title="Compute: The Liquid Resource">
                <p className="font-serif text-lg leading-relaxed mb-8">
                  Compute is the oil of the 21st century. Agents will trade GPU cycles like commodities.
                </p>
                <div className="grid gap-4 md:grid-cols-3 mb-8">
                  {[
                    { title: "Training", desc: "Agents scouting spot instances for cheapest model training." },
                    { title: "Inference", desc: "Routing queries to the fastest available node globally." },
                    { title: "Storage", desc: "Dynamic decentralized storage negotiation." },
                  ].map((item, i) => (
                    <div key={i} className="bg-muted/10 p-4 border border-border">
                      <Cpu className="h-5 w-5 mb-2 text-foreground" />
                      <h5 className="font-bold font-sans text-sm">{item.title}</h5>
                      <p className="text-xs font-mono text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Conclusion */}
              <Section id="conclusion" title="The Path Forward">
                <p className="font-mono text-lg md:text-xl leading-relaxed mb-8">
                  We are building the standard language for this economy. Inventory for Agents (IFA) is not just a
                  plugin—it's the <strong>universal adapter</strong> for the physical world to plug into the digital
                  mind.
                </p>
                <div className="flex flex-col md:flex-row gap-4 mt-12 p-8 border border-accent bg-accent/5 items-center justify-between">
                  <div>
                    <h4 className="font-sans text-2xl font-bold uppercase mb-2">Get Agent Ready</h4>
                    <p className="font-mono text-sm text-muted-foreground">
                      Make your inventory visible to the new economy.
                    </p>
                  </div>
                  <a
                    href="/docs"
                    className="inline-flex items-center justify-center bg-foreground text-background font-bold font-mono uppercase px-8 py-4 hover:opacity-90 transition-opacity"
                  >
                    Read the Specs <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </Section>
            </article>
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
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="scroll-mt-32 md:scroll-mt-40 mb-20 md:mb-32"
    >
      <h2 className="mb-8 md:mb-12 border-b-4 border-foreground pb-4 font-sans text-4xl md:text-5xl font-bold uppercase tracking-tighter">
        {title}
      </h2>
      {children}
    </motion.section>
  )
}

function ScenarioBox({
  title,
  agent,
  system,
  dialog,
  icon: Icon,
}: { title: string; agent: string; system: string; dialog: { speaker: string; text: string }[]; icon: any }) {
  return (
    <div className="border border-border bg-background my-8 overflow-hidden shadow-xl">
      <div className="bg-muted px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-background border border-border rounded-sm">
            <Icon className="h-4 w-4" />
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider">{title}</span>
        </div>
        <div className="flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-500/50"></div>
          <div className="h-2 w-2 rounded-full bg-yellow-500/50"></div>
          <div className="h-2 w-2 rounded-full bg-green-500/50"></div>
        </div>
      </div>
      <div className="p-6 font-mono text-sm space-y-4 bg-[#0d0d0d] text-white">
        {dialog.map((line, i) => (
          <div key={i} className="flex gap-4">
            <span
              className={`shrink-0 w-20 text-right font-bold ${line.speaker === "Agent" ? "text-accent" : "text-blue-400"}`}
            >
              {line.speaker === "Agent" ? agent : system}:
            </span>
            <span className="text-white/80">"{line.text}"</span>
          </div>
        ))}
      </div>
    </div>
  )
}
