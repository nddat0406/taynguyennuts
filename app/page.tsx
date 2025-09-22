import { HeroSection } from "@/components/sections/hero-section"
import { ProductsSection } from "@/components/sections/products-section"
import { StorySection } from "@/components/sections/story-section"
import { ValuesSection } from "@/components/sections/values-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { CtaSection } from "@/components/sections/cta-section"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProductsSection />
      <StorySection />
      <ValuesSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
