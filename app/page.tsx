import type { Metadata } from "next"
import { Masthead } from "@/components/masthead"
import { Hero } from "@/components/hero"
import { FeaturedArticleLink } from "@/components/featured-article-link"
import { Explainer } from "@/components/explainer"
import { HowItWorks } from "@/components/how-it-works"
import { TokenSection } from "@/components/token-section"
import { Audience } from "@/components/audience"
import { Roadmap } from "@/components/roadmap"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "IFA | AI Agents That Sell For You",
  description:
    "Get a 24/7 AI sales agent for your Shopify or Etsy store. Finds customers on Reddit, Twitter, Discord and sells while you sleep.",
  alternates: {
    canonical: "/",
  },
}

export default function Page() {
  return (
    <main className="min-h-screen bg-muted/30 text-foreground selection:bg-accent selection:text-accent-foreground">
      <div className="mx-auto max-w-[1400px] border-x border-border bg-background shadow-2xl">
        <Masthead />
        <Hero />
        <FeaturedArticleLink />
        <div className="border-t border-border">
          <Explainer />
        </div>
        <div className="border-t border-border">
          <HowItWorks />
        </div>
        <div className="border-t border-border">
          <TokenSection />
        </div>
        <div className="border-t border-border">
          <Audience />
        </div>
        <div className="border-t border-border">
          <Roadmap />
        </div>
        <div className="border-t border-border">
          <FAQ />
        </div>
        <div className="border-t border-border">
          <Footer />
        </div>
      </div>
    </main>
  )
}
