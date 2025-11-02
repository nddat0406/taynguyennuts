"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Loader2 } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/utils/utils"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/utils/supabase/client"
import { ProductsGridSkeleton } from "@/components/product-card-skeleton"
import { LoadingSpinner } from "@/components/loading-screen"

// Import the provided interfaces
import type { Product, Category } from "@/types"

export default function ProductsPage() {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState<string>("0")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isCategoryLoading, setIsCategoryLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      // Fetch categories
      const { data: categoryData, error: categoryError } = await supabase.from("category").select("id, name")

      if (categoryError) {
        console.error("Error fetching categories:", categoryError)
        return
      }

      setCategories([{ id: 0, name: "Tất cả sản phẩm" }, ...(categoryData ?? [])])

      // Fetch products with necessary fields
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select(`
          id,
          name,
          description,
          price,
          inStock,
          weight,
          benefits,
          expiration,
          ingredients,
          manufactured_at,
          packaged_at,
          storage_instructions,
          usage_instructions,
          product_images (
            url,
            isMainImage
          ),
          category:category_id (id, name)
        `)
        .neq("inStock", 0)

      if (productError) {
        console.error("Error fetching products:", productError)
        return
      }

      // Map the data to match the Product interface
      const formattedProducts: Product[] = (productData ?? []).map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        inStock: product.inStock,
        weight: product.weight,
        benefits: product.benefits,
        expiration: product.expiration,
        ingredients: product.ingredients,
        manufactured_at: product.manufactured_at,
        packaged_at: product.packaged_at,
        storage_instructions: product.storage_instructions,
        usage_instructions: product.usage_instructions,
        created_at: "", // Placeholder, as it's not fetched
        product_images: product.product_images
          ? product.product_images.map((img: { url: string | null; isMainImage: boolean | null }) => ({
              url: img.url ?? "",
              isMainImage: img.isMainImage ?? false,
              alt: `${product.name} image`, // Optional: Add default alt text
            }))
          : null,
        category: product.category
          ? { id: product.category.id, name: product.category.name }
          : { id: 0, name: "Unknown" }, // Fallback for missing category
      }))

      setProducts(formattedProducts)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const filteredProducts =
    selectedCategory === "0"
      ? products
      : products.filter((product) => product.category?.id === Number.parseInt(selectedCategory))

  const handleCategoryChange = async (categoryId: string) => {
    setIsCategoryLoading(true)
    setSelectedCategory(categoryId)
    // Simulate filtering delay for smooth transition
    await new Promise((resolve) => setTimeout(resolve, 300))
    setIsCategoryLoading(false)
  }

  const handleQuickAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.inStock === 0) return

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
                  onClick={() => handleCategoryChange(String(category.id))}
                  disabled={isLoading || isCategoryLoading}
                >
                  {isCategoryLoading && selectedCategory === String(category.id) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            {!isLoading && (
              <div className="mb-6">
                <p className="text-gray-600">
                  Hiển thị <span className="font-semibold text-amber-900">{filteredProducts.length}</span> sản phẩm
                </p>
              </div>
            )}

            {isLoading ? (
              <ProductsGridSkeleton count={6} />
            ) : isCategoryLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                  <LoadingSpinner size="lg" />
                  <p className="text-amber-900 font-medium">Đang tải sản phẩm...</p>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
                  >
                    <Link href={`/products/${product.id}`}>
                      <div className="aspect-square overflow-hidden bg-amber-50">
                        <img
                          src={product.product_images?.find((img) => img.isMainImage)?.url || "/placeholder.svg"}
                          alt={product.product_images?.find((img) => img.isMainImage)?.alt || product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-bold text-amber-900 mb-3">{product.name}</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                          {product.description || "Không có mô tả"}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-2xl font-bold text-orange-600">
                            {product.price ? formatPrice(Number(product.price)) : "Liên hệ"}
                            <span className="text-sm text-gray-500 font-normal">/{product.weight}g</span>
                          </div>
                          {product.inStock === 0 && <span className="text-sm text-red-600 font-medium">Hết hàng</span>}
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
                            disabled={product.inStock === 0}
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

            {!isLoading && !isCategoryLoading && filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600">Không tìm thấy sản phẩm nào trong danh mục này</p>
              </div>
            )}
          </div>
        </section>

        {/* Description Section */}
        <section className="bg-gradient-to-b from-white to-amber-50 py-16 border-t border-amber-200">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-amber-900 mb-8">Mô tả</h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex gap-4">
                <span className="text-amber-800 font-bold">•</span>
                <p className="leading-relaxed">
                  Mỗi sản phẩm được trình bày kèm hình ảnh, vùng sản xuất giới thiệu sản phẩm, giá niêm yết nút "
                  <span className="font-semibold">"Xem chi tiết"</span>" và nút "
                  <span className="font-semibold">"Thêm vào giỏ"</span>".
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-amber-800 font-bold">•</span>
                <p className="leading-relaxed">
                  Khách hàng có thể sử dụng bộ lọc tìm kiếm theo các tiêu chí: loại sản phẩm, mức giá và khu vực (vùng
                  sản xuất). Khi khách hàng chọn tiêu chí lọc, hệ thống sẽ hiển thị những sản phẩm phù hợp.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-amber-800 font-bold">•</span>
                <p className="leading-relaxed">
                  Khách hàng click vào nút "<span className="font-semibold">"Xem chi tiết"</span>" để chuyển đến trang
                  chi tiết từng sản phẩm.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-amber-800 font-bold">•</span>
                <p className="leading-relaxed">
                  Khách hàng thêm sản phẩm vào giỏ hàng bằng cách nhấn nút "
                  <span className="font-semibold">"Thêm vào giỏ hàng"</span>" (được đặt ở ngay cạnh nút "
                  <span className="font-semibold">"Xem chi tiết"</span>") và click nút "
                  <span className="font-semibold">"Thêm vào giỏ hàng"</span>" sẽn được thêm vào giỏ của khách hàng.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
