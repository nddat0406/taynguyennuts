"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function HeroActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        onClick={() => {
          const productsSection = document.getElementById("products")
          productsSection?.scrollIntoView({ behavior: "smooth" })
        }}
        size="lg"
        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-10 py-6 text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all group/btn"
      >
        <Sparkles className="w-5 h-5 mr-2 group-hover/btn:rotate-12 transition-transform" />
        Khám phá sản phẩm
      </Button>
      <Button
        onClick={() => {
          const storySection = document.getElementById("story")
          storySection?.scrollIntoView({ behavior: "smooth" })
        }}
        size="lg"
        variant="outline"
        className="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 px-10 py-6 text-lg bg-white/50 backdrop-blur hover:scale-105 transition-all"
      >
        Tìm hiểu câu chuyện
      </Button>
    </div>
  )
}
