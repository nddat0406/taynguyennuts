"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ShoppingCart, Tag, Search, X } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import type { Product, DiscountCode, Category } from "@/types"
import { formatPrice } from "@/utils/utils"
import { createClient } from "@/utils/supabase/client"

interface ProductsSectionProps {
  products: Product[]
}

export function ProductsSection({ products: initialProducts }: ProductsSectionProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(false)
  
  const handleQuickAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()

    if (!product.inStock) return

    addToCart(product, 1)
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name}`,
    })
  }

  const getMainImage = (product: Product) => {
    const mainImage = product.product_images?.find((img) => img.isMainImage)
    return mainImage?.url || product.product_images?.[0]?.url || "/placeholder.svg?height=400&width=400"
  }

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim())
      }

      if (selectedCategory && selectedCategory !== "all") {
        params.set("category_id", selectedCategory)
      }

      const response = await fetch(`/api/products?${params}`)
      const result = await response.json()

      if (response.ok && result.data) {
        setProducts(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedCategory])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("category")
          .select("id, name")
          .order("name")

        if (error) throw error
        setCategories(data ?? [])
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (searchQuery || selectedCategory !== "all") {
      fetchProducts()
    } else {
      setProducts(initialProducts)
    }
  }, [searchQuery, selectedCategory, fetchProducts, initialProducts])

  useEffect(() => {
    const fetchDiscountCodes = async () => {
      try {
        const response = await fetch('/api/discount-codes')
        const result = await response.json()
        
        if (response.ok && result.data) {
          const discountCodes: DiscountCode[] = result.data
          
          setProducts((currentProducts) => {
            const productsWithDiscounts = currentProducts.map((product) => {
              const applicableDiscounts = discountCodes.filter((discount) => {
                if (discount.productIds.length === 0) return true
                return discount.productIds.includes(product.id)
              })

              if (applicableDiscounts.length > 0) {
                const bestDiscount = applicableDiscounts.reduce((best, current) => 
                  current.value > best.value ? current : best
                )

                const originalPrice = Number(product.price || 0)
                const discountedPrice = originalPrice * (1 - bestDiscount.value / 100)

                return {
                  ...product,
                  bestDiscount: {
                    id: bestDiscount.id,
                    code: bestDiscount.code,
                    value: bestDiscount.value,
                    discountedPrice
                  }
                }
              }

              return product
            })

            return productsWithDiscounts
          })
        }
      } catch (error) {
        console.error('Failed to fetch discount codes:', error)
      }
    }

    fetchDiscountCodes()
  }, [])

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-amber-900 mb-6 text-balance">
            Sản phẩm đặc sản
            <span className="text-orange-600"> Tây Nguyên</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Từ những vùng đất màu mỡ của Tây Nguyên, chúng tôi mang đến những sản phẩm nông sản chất lượng cao, được chế
            biến theo phương pháp truyền thống.
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Tất cả danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Đang tải sản phẩm...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searchQuery || selectedCategory !== "all"
                ? "Không tìm thấy sản phẩm phù hợp"
                : "Không có sản phẩm nào"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
            >
              <Link href={`/products/${product.id}`}>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={getMainImage(product) || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-amber-900 mb-3">{product.name}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{product.description}</p>
                  {product.bestDiscount && (
                    <div className="mb-3">
                      <Badge className="bg-red-500 hover:bg-red-600 text-white">
                        <Tag className="w-3 h-3 mr-1" />
                        Giảm {product.bestDiscount.value}%
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    {product.bestDiscount ? (
                      <>
                        <div className="text-2xl font-bold text-red-600">
                          {formatPrice(product.bestDiscount.discountedPrice)}
                        </div>
                        <div className="text-lg text-gray-400 line-through">
                          {formatPrice(Number(product.price ?? 0))}
                        </div>
                      </>
                    ) : (
                      <div className="text-2xl font-bold text-orange-600">
                        {formatPrice(Number(product.price ?? 9999999999999999))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent hover:bg-amber-50"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
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
        )}
      </div>
    </section>
  )
}
