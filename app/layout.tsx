import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { ProfileCompletionBanner } from "@/components/auth/profile-completion-banner"
import { AuthProvider } from "@/contexts/auth-context"
export const metadata: Metadata = {
  title: "Tây Nguyên Nuts - Premium Vietnamese Nuts & Agricultural Products",
  description:
    "Discover authentic Vietnamese nuts and agricultural products from the Central Highlands. Premium quality cashews, coffee beans, and traditional specialties.",
  keywords:
    "Vietnamese nuts, Tây Nguyên, cashews, coffee beans, agricultural products, Central Highlands, premium nuts",
  authors: [{ name: "Tây Nguyên Nuts" }],
  creator: "Tây Nguyên Nuts",
  publisher: "Tây Nguyên Nuts",
  openGraph: {
    title: "Tây Nguyên Nuts - Premium Vietnamese Nuts",
    description: "Authentic Vietnamese nuts and agricultural products from the Central Highlands",
    type: "website",
    locale: "vi_VN",
    siteName: "Tây Nguyên Nuts",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tây Nguyên Nuts - Premium Vietnamese Nuts",
    description: "Authentic Vietnamese nuts and agricultural products from the Central Highlands",
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            <Toaster />
            <Analytics />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
