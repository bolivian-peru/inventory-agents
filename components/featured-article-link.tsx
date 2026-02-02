import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function FeaturedArticleLink() {
  return (
    <Link href="/blog" className="group relative block overflow-hidden border-t border-border">
      <div className="bg-background p-6 transition-colors duration-300 group-hover:bg-foreground group-hover:text-background lg:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 bg-accent group-hover:bg-background"></span>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-background/70">
                Deep Dive
              </span>
            </div>
            <h3 className="font-sans text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
              Why Every Small Store Needs an AI Sales Agent in 2026
            </h3>
            <p className="max-w-3xl font-mono text-sm leading-relaxed text-muted-foreground group-hover:text-background/80 md:text-base">
              The creator economy is exploding, but so is the competition. Learn how AI agents are becoming the great
              equalizer—giving solo artisans and small brands the same 24/7 sales power as enterprise teams.
            </p>
          </div>
          <div className="shrink-0 self-start md:self-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-foreground transition-transform duration-300 group-hover:translate-x-2 group-hover:border-background">
              <ArrowRight className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
