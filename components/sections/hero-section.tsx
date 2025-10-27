"use client"

import type React from "react"

import { Leaf, Coffee, Nut, Search } from "lucide-react"
import Image from "next/image"
import { Suspense } from "react"
import HeroDecorations from "./hero-decorations.client"
import HeroActions from "./hero-actions.client"
import { TrustBadges } from "./trust-badges"
import { Input } from "@/components/ui/input"

// Force dynamic rendering so this server component is always SSR
export const dynamic = "force-dynamic"

export function HeroSection() {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get("search") as string
    if (query.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(query)}`
    }
  }

  return (
    <section className="relative min-h-screen amber-liner overflow-hidden">
      {/* Background image using next/image with fixed positioning to emulate background-attachment: fixed */}
      <div className="fixed inset-0 -z-10 opacity-90 pointer-events-none">
        <Image
          src="/heroSectionBG.avif"
          alt="Hero background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 nut-pattern"></div>

      {/* Client-only decorations (mouse & scroll animations) — non-blocking */}
      <Suspense fallback={null}>
        <HeroDecorations />
      </Suspense>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 lg:p-16 shadow-2xl border border-amber-200/50 hover:shadow-amber-200/50 transition-all duration-500 group hover:scale-[1.02]">
            {/* Decorative product icons */}
            <div className="flex justify-center gap-4 mb-4 opacity-60 group-hover:opacity-100 transition-opacity">
              <Nut className="w-8 h-8 text-amber-700 animate-bounce-gentle group-hover:scale-110 transition-transform" />
              <Coffee className="w-8 h-8 text-orange-700 animate-wiggle group-hover:scale-110 transition-transform" />
              <Leaf className="w-8 h-8 text-green-700 animate-sway group-hover:scale-110 transition-transform" />
            </div>
            <div className=" rounded-full flex items-center justify-center">
              <Image src="/logo.avif" alt="Tây Nguyên Nuts" width={200} height={200} priority />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-balance">
              <span className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Hương vị Tây Nguyên
              </span>
              <br />
              <span className="text-amber-900">Đậm đà tự nhiên</span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed text-pretty">
              Khám phá tinh hoa nông sản Tây Nguyên với hạt điều, macca, cà phê và ca cao nguyên chất từ những vùng đất
              màu mỡ nhất Việt Nam.
            </p>

            <form onSubmit={handleSearch} className="mb-8 max-w-2xl mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    name="search"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="pl-10 py-3 rounded-lg border-amber-200 focus:border-amber-600"
                  />
                </div>
              </div>
            </form>

            {/* Client-only action buttons */}
            <HeroActions />

            {/* Trust indicators with hover effects */}
            <TrustBadges />
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="white"
            fillOpacity="0.3"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  )
}
