import { Suspense } from "react";
import { HeroSection } from "@/components/sections/hero-section";
import { ProductsSection } from "@/components/sections/products-section";
import { StorySection } from "@/components/sections/story-section";
import { ValuesSection } from "@/components/sections/values-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { CtaSection } from "@/components/sections/cta-section";
import { createClient } from "@/utils/supabase/server";
import { OrderSuccessToast } from "@/components/order-success-toast";

// Import types from a consistent source
import type { Product } from "@/types";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase.from("products").select(`
    *,
    product_images (
      url,
      isMainImage
    )
  `);

  const productsData: Product[] = products || [];
  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <>
      <main className="min-h-screen">
        <section className="scroll-snap-section">
          <HeroSection />
        </section>
        <section className="scroll-snap-section">
          <ProductsSection products={productsData} />
        </section>
        <section className="scroll-snap-section">
          <StorySection />
        </section>
        <section className="scroll-snap-section">
          <ValuesSection />
        </section>
        <section className="scroll-snap-section">
          <TestimonialsSection />
        </section>
        <section className="scroll-snap-section">
          <CtaSection />
        </section>
      </main>
      <Suspense fallback={null}>
        <OrderSuccessToast />
      </Suspense>
    </>
  );
}