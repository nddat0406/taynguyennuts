"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/sections/hero-section"
import { ProductsSection } from "@/components/sections/products-section"
import { StorySection } from "@/components/sections/story-section"
import { ValuesSection } from "@/components/sections/values-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { CtaSection } from "@/components/sections/cta-section"
import { Footer } from "@/components/layout/footer"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    if (searchParams.get("order") === "success") {
      toast({
        title: "Cảm ơn bạn đã đặt hàng!",
        description: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.",
      })
    }
  }, [searchParams, toast])

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <ProductsSection />
        <StorySection />
        <ValuesSection />
        <TestimonialsSection />
        <CtaSection />
        <Footer />
      </main>
    </>
  )
}
