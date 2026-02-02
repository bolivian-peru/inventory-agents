"use client"

import { useState } from "react"
import {
  Activity,
  Settings,
  Package,
  Users,
  CreditCard,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Terminal,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardMock() {
  const [step, setStep] = useState<"onboarding" | "dashboard">("onboarding")
  const [connected, setConnected] = useState(false)

  return (
    <div className="flex min-h-[800px] flex-col border border-border bg-background font-mono md:flex-row">
      {/* Sidebar */}
      <div className="w-full border-b border-border md:w-64 md:border-b-0 md:border-r">
        <div className="border-b border-border p-6">
          <div className="flex items-center gap-2 font-sans font-bold text-xl uppercase tracking-tighter">
            <div className="h-4 w-4 bg-accent" />
            Merchant
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          <NavItem icon={Activity} label="Overview" active={step === "dashboard"} />
          <NavItem icon={Package} label="Inventory" />
          <NavItem icon={Users} label="Agents" />
          <NavItem icon={CreditCard} label="Payments" />
          <div className="my-4 border-t border-border" />
          <NavItem icon={Settings} label="Settings" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-muted/5">
        {step === "onboarding" ? <OnboardingFlow onComplete={() => setStep("dashboard")} /> : <LiveDashboard />}
      </div>
    </div>
  )
}

function NavItem({ icon: Icon, label, active }: { icon: any; label: string; active?: boolean }) {
  return (
    <button
      className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-bold uppercase transition-colors ${
        active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleConnect = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setCurrentStep(2)
    }, 1500)
  }

  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="w-full max-w-lg border border-border bg-background p-8 shadow-xl">
        <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
          <h2 className="font-sans text-2xl font-bold uppercase">Setup Wizard</h2>
          <span className="bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">STEP {currentStep}/3</span>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase text-muted-foreground">Select Platform</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className="flex flex-col items-center gap-3 border-2 border-foreground bg-muted/10 p-6 hover:bg-accent hover:border-accent-foreground hover:text-accent-foreground"
                  onClick={handleConnect}
                >
                  <Package className="h-8 w-8" />
                  <span className="font-bold">Etsy</span>
                </button>
                <button className="flex flex-col items-center gap-3 border-2 border-border p-6 opacity-50 cursor-not-allowed">
                  <Package className="h-8 w-8" />
                  <span className="font-bold">Shopify</span>
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase text-muted-foreground">Store URL</label>
              <div className="flex gap-2">
                <span className="flex items-center border border-border bg-muted px-3 text-muted-foreground">
                  https://
                </span>
                <input
                  type="text"
                  placeholder="your-shop.etsy.com"
                  className="flex-1 border-border bg-background p-2 font-mono text-sm placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none"
                />
              </div>
            </div>
            <Button
              onClick={handleConnect}
              disabled={loading}
              className="w-full rounded-none bg-foreground text-background hover:bg-accent hover:text-accent-foreground"
            >
              {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
              {loading ? "Connecting..." : "Connect Store"}
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-accent/20 p-4 border border-accent">
              <CheckCircle2 className="h-6 w-6 text-accent-foreground" />
              <div>
                <p className="font-bold text-accent-foreground">Store Connected Successfully</p>
                <p className="text-xs text-muted-foreground">Synced 142 products from Etsy</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold uppercase">Configure Agent Rules</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between border border-border p-3">
                  <span className="text-sm">Minimum Margin</span>
                  <input
                    type="text"
                    defaultValue="15%"
                    className="w-20 border-b border-border bg-transparent text-right font-bold focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between border border-border p-3">
                  <span className="text-sm">Max Bulk Discount</span>
                  <input
                    type="text"
                    defaultValue="25%"
                    className="w-20 border-b border-border bg-transparent text-right font-bold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep(3)}
              className="w-full rounded-none bg-foreground text-background hover:bg-accent hover:text-accent-foreground"
            >
              Next Step
            </Button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-foreground text-background">
              <RefreshCw className="h-10 w-10 animate-spin" />
            </div>
            <div>
              <h3 className="mb-2 text-xl font-bold uppercase">Generating MCP Schema...</h3>
              <p className="text-sm text-muted-foreground">Mapping your inventory to the Agent Protocol standards.</p>
            </div>
            <Button
              onClick={onComplete}
              className="w-full rounded-none bg-accent text-accent-foreground hover:bg-foreground hover:text-background"
            >
              Launch Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function LiveDashboard() {
  return (
    <div className="h-full overflow-y-auto p-6 lg:p-12">
      <div className="mb-8 flex items-end justify-between border-b border-border pb-6">
        <div>
          <h1 className="font-sans text-3xl font-black uppercase md:text-4xl">Live Overview</h1>
          <p className="font-mono text-sm text-muted-foreground">
            Network Status: <span className="text-accent-foreground">● ONLINE</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-none border-border bg-transparent">
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <StatCard label="Active Agents" value="24" trend="+12%" />
        <StatCard label="Queries / Hr" value="1,892" trend="+5%" />
        <StatCard label="Sales Volume" value="$4,250" trend="+18%" />
        <StatCard label="Pending Deals" value="8" trend="--" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Feed */}
        <div className="lg:col-span-2">
          <div className="border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border p-4 bg-muted/20">
              <h3 className="font-bold uppercase flex items-center gap-2">
                <Terminal className="h-4 w-4" /> Agent Negotiation Stream
              </h3>
              <span className="text-[10px] bg-accent text-accent-foreground px-2 py-0.5 font-bold animate-pulse">
                LIVE
              </span>
            </div>
            <div className="h-[400px] overflow-y-auto p-4 font-mono text-xs space-y-3 bg-black text-green-500">
              <LogEntry
                time="11:42:01"
                agent="TravelBot-X1"
                action="QUERY inventory.search({ location: 'Paris', dates: 'Aug 12-15' })"
              />
              <LogEntry time="11:42:02" agent="TravelBot-X1" action="RESPONSE Found 3 matches. Sending options..." />
              <LogEntry time="11:42:05" agent="Concierge-Alpha" action="NEGOTIATE Room 404 rate: $250 -> $220" />
              <LogEntry time="11:42:06" agent="System" action="CHECK Rules: Margin > 15% (PASS)" />
              <LogEntry time="11:42:06" agent="System" action="OFFER Accepted: $220/night" />
              <LogEntry time="11:42:09" agent="Concierge-Alpha" action="TRANSACTION Initiating USDC transfer..." />
              <LogEntry time="11:42:12" agent="System" action="CONFIRMED Tx: 0x8f...3a21" />
              <LogEntry
                time="11:43:45"
                agent="Retail-Scout-09"
                action="QUERY products.list({ category: 'shoes', size: '10' })"
              />
              <LogEntry time="11:43:46" agent="System" action="RESPONSE 12 items found." />
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="space-y-6">
          <div className="border border-border bg-background p-6">
            <h3 className="mb-4 font-bold uppercase border-b border-border pb-2">Inventory Health</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Sync Status</span>
                  <span className="text-accent-foreground">100%</span>
                </div>
                <div className="h-2 w-full bg-muted">
                  <div className="h-full w-full bg-accent" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>API Latency</span>
                  <span>45ms</span>
                </div>
                <div className="h-2 w-full bg-muted">
                  <div className="h-full w-[20%] bg-foreground" />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-border bg-accent/10 p-6">
            <h3 className="mb-2 font-bold uppercase text-accent-foreground">Need more agents?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Boost your inventory visibility to the top 100 performing autonomous agents.
            </p>
            <Button
              size="sm"
              className="w-full border-accent-foreground bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent"
            >
              Promote Inventory
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="border border-border bg-background p-6 transition-all hover:border-accent hover:shadow-lg">
      <div className="text-sm font-bold uppercase text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-black tracking-tight">{value}</div>
      <div className="mt-1 text-xs font-bold text-accent-foreground">{trend} from last hour</div>
    </div>
  )
}

function LogEntry({ time, agent, action }: { time: string; agent: string; action: string }) {
  return (
    <div className="flex gap-4 border-b border-white/10 pb-2 last:border-0 last:pb-0">
      <span className="text-white/50 w-16 shrink-0">{time}</span>
      <span className="text-accent w-32 shrink-0">{agent}</span>
      <span className="text-white/90">{action}</span>
    </div>
  )
}
