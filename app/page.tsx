import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/sections/hero-section"
import { ProductsSection } from "@/components/sections/products-section"
import { StorySection } from "@/components/sections/story-section"
import { ValuesSection } from "@/components/sections/values-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { CtaSection } from "@/components/sections/cta-section"
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/types"
import { OrderSuccessToast } from "@/components/order-success-toast"

export default async function HomePage() {
  const supabase = await createClient()


  const { data: products, error } = await supabase.from("products").select(`
      id,
      name,
      description,
      price,
      inStock,
      weight,
      product_images (
        url,
        isMainImage
      )
    `)
    
  const productsData: Product[] = products || []
  if (error) {
    console.error("Error fetching products:", error)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <p className="text-center text-2xl font-bold text-gray-800 py-8">
          {productsData.length} Products Available
        </p>
        <HeroSection />
        <ProductsSection products={productsData} />
        <StorySection />
        <ValuesSection />
        <TestimonialsSection />
        <CtaSection />
        <Footer />
      </main>
      <Suspense fallback={null}>
        <OrderSuccessToast />
      </Suspense>
    </>
  )
}
