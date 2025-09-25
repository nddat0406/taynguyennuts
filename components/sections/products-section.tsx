"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { ALL_PRODUCTS, formatPrice } from "@/lib/products"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

export function ProductsSection() {
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleQuickAddToCart = (e: React.MouseEvent, product: (typeof ALL_PRODUCTS)[0]) => {
    e.preventDefault() // Prevent navigation to product page
    e.stopPropagation()

    if (!product.inStock) return

    addToCart(product, 1)
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name}`,
    })
  }

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-amber-900 mb-6 text-balance">
            Sản phẩm đặc sản
            <span className="text-orange-600"> Tây Nguyên</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Từ những vùng đất màu mỡ của Tây Nguyên, chúng tôi mang đến những sản phẩm nông sản chất lượng cao, được chế
            biến theo phương pháp truyền thống.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_PRODUCTS.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
            >
              <Link href={`/products/${product.id}`}>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-amber-900 mb-3">{product.name}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatPrice(product.price)}
                      <span className="text-sm text-gray-500 font-normal">/{product.weight}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent hover:bg-amber-50"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        // This will navigate to the product page
                        window.location.href = `/products/${product.id}`
                      }}
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      className="bg-amber-800 hover:bg-amber-900 text-white px-4"
                      disabled={!product.inStock}
                      onClick={(e) => handleQuickAddToCart(e, product)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
