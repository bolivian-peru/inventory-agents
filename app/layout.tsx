import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Space_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// <CHANGE> Using Space Grotesk and Space Mono as requested
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "IFA | AI Sales Agent for Shopify & Etsy",
    template: "%s | Inventory for Agents",
  },
  description:
    "Your first AI employee. IFA gives Shopify and Etsy sellers a 24/7 AI sales agent that finds customers on Reddit, Twitter, and Discord.",
  keywords: [
    "AI sales agent",
    "Shopify AI",
    "Etsy AI",
    "AI employee",
    "automated sales",
    "AI commerce",
    "ecommerce automation",
    "AI outreach",
    "sales automation",
    "IFA token",
  ],
  authors: [{ name: "Inventory for Agents" }],
  creator: "Inventory for Agents",
  publisher: "Inventory for Agents",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://inventoryforagents.xyz",
    siteName: "Inventory for Agents",
    title: "IFA | AI Sales Agent for Shopify & Etsy",
    description:
      "Your first AI employee. Get a 24/7 AI agent that finds customers and sells your products while you sleep.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Inventory for Agents - AI Sales Agent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@agentinventory",
    creator: "@agentinventory",
    title: "IFA | AI Sales Agent for Shopify & Etsy",
    description:
      "Your first AI employee. Get a 24/7 AI agent that finds customers and sells your products while you sleep.",
    images: ["/og-image.jpg"],
  },
  metadataBase: new URL("https://inventoryforagents.xyz"),
  alternates: {
    canonical: "/",
  },
  other: {
    "telegram:channel": "https://t.me/inventoryforagents",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* <CHANGE> Applied new font variables */}
      <body
        className={`${spaceGrotesk.variable} ${spaceMono.variable} font-mono antialiased bg-background text-foreground`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
