"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/products"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import type { Product, ProductImages, Category } from "@/types"
import { createClient } from "@/lib/supabase/client"

export default function ProductsPage() {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: categoryData } = await supabase.from("category").select("id, name")
      setCategories([{ id: "all", name: "Tất cả sản phẩm" }, ...(categoryData ?? [])])

      const { data: productData } = await supabase
        .from("products")
        .select(`
          id,
          name,
          description,
          price,
          inStock,
          weight,
          product_images (
            url,
            isMainImage
          ),
          category_id
        `)
        .neq('inStock', 0)
      const { data: categoryMap } = await supabase
        .from('category')
        .select('*')
      const categoryLookup = (categoryMap ?? []).reduce<Record<string, string>>(
        (acc, cat) => ({ ...acc, [cat.id]: cat.name }),
        {}
      )
      const formattedProducts = (productData ?? []).map(product => ({
        ...product,
        category: { id: product.category_id, name: categoryLookup[product.category_id] }
      }))
      setProducts(formattedProducts)
    }
    fetchData()
  }, [supabase])

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((product) => product.category?.id === parseInt(selectedCategory))

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

  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-800 to-orange-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">Sản phẩm đặc sản Tây Nguyên</h1>
          <p className="text-xl text-amber-100 max-w-3xl leading-relaxed">
            Khám phá bộ sưu tập đầy đủ các sản phẩm nông sản chất lượng cao từ vùng đất màu mỡ Tây Nguyên
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === String(category.id) ? "default" : "outline"}
                className={
                  selectedCategory === String(category.id)
                    ? "bg-amber-800 hover:bg-amber-900 text-white"
                    : "border-amber-300 text-amber-900 hover:bg-amber-50"
                }
                onClick={() => setSelectedCategory(String(category.id))}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <p className="text-gray-600">
              Hiển thị <span className="font-semibold text-amber-900">{filteredProducts.length}</span> sản phẩm
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="aspect-square overflow-hidden bg-amber-50">
                    <img
                      src={product.product_images.find(img => img.isMainImage)?.url || "/placeholder.svg"}
                      alt={product.product_images.find(img => img.isMainImage)?.alt || product.name}
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
                      {!product.inStock && <span className="text-sm text-red-600 font-medium">Hết hàng</span>}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent hover:bg-amber-50 border-amber-300 text-amber-900"
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

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">Không tìm thấy sản phẩm nào trong danh mục này</p>
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  )
}