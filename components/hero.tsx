import { Sparkles, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      {/* Main Story - Left Column */}
      <div className="col-span-1 border-r border-border p-6 lg:col-span-2 lg:p-12">
        <h2 className="mb-6 font-sans text-4xl font-extrabold leading-none tracking-tight md:text-6xl lg:text-7xl">
          Your First AI Employee is Ready for Work.
        </h2>

        <p className="mb-8 max-w-2xl font-mono text-lg leading-relaxed text-muted-foreground md:text-xl">
          IFA gives your Shopify or Etsy store a dedicated AI sales agent. It learns your brand, finds customers on
          social media, and sells your products 24/7. No technical skill required.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/merchants">
            <Button
              size="lg"
              className="h-14 w-full rounded-none border-2 border-transparent bg-accent px-8 font-sans text-lg font-bold text-accent-foreground hover:bg-accent/90 sm:w-auto"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Activate Your Agent
            </Button>
          </Link>
          <Link href="/docs">
            <Button
              size="lg"
              className="group h-14 w-full rounded-none border-2 border-foreground bg-transparent px-8 font-sans text-lg font-bold text-foreground hover:bg-foreground hover:text-background sm:w-auto"
            >
              <FileText className="mr-2 h-5 w-5" />
              Read The Thesis
            </Button>
          </Link>
        </div>
      </div>

      {/* Sidebar - Right Column */}
      <div className="col-span-1 bg-muted/20 p-6 lg:p-8">
        <div className="h-full border border-border bg-background p-4 shadow-sm">
          <div className="mb-4 border-b border-border pb-2">
            <h3 className="font-sans text-lg font-bold uppercase">Agent Network Status</h3>
          </div>

          <div className="space-y-6 font-mono">
            <div>
              <div className="text-sm text-muted-foreground">Active AI Agents</div>
              <div className="text-3xl font-bold tracking-tight">Coming Soon</div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">Sales Generated</div>
              <div className="text-3xl font-bold tracking-tight">$0.00</div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">System Status</div>
              <div className="flex items-center gap-2 text-xl font-bold text-accent-foreground/80">
                <span className="h-3 w-3 rounded-full bg-accent"></span>
                BUILDING
              </div>
            </div>

            <div className="mt-8 border-t border-dashed border-border pt-4 text-xs text-muted-foreground">
              * Your AI agent will show real-time activity here once activated.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
