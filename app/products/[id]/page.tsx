"use client"

import { notFound } from "next/navigation"
import { getProductById, formatPrice } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/layout/header"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id)
  const { addToCart, isInCart, getItemQuantity } = useCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    notFound()
  }

  const currentQuantityInCart = getItemQuantity(product.id)
  const isProductInCart = isInCart(product.id)

  const handleAddToCart = () => {
    if (!product.inStock) return

    addToCart(product, quantity)
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name} (${quantity} sản phẩm)`,
    })
    setQuantity(1) // Reset quantity after adding
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Navigation */}
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 text-amber-800 hover:text-amber-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại sản phẩm
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-3">
                  {product.category === "nuts" && "Hạt dinh dưỡng"}
                  {product.category === "coffee" && "Cà phê"}
                  {product.category === "dried-fruits" && "Trái cây sấy"}
                  {product.category === "specialties" && "Đặc sản"}
                </Badge>
                <h1 className="text-4xl font-bold text-amber-900 mb-4 text-balance">{product.name}</h1>
                <p className="text-xl text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Product Info */}
              <div className="space-y-4 p-6 bg-white rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Giá:</span>
                  <span className="text-3xl font-bold text-orange-600">{formatPrice(product.price)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Khối lượng:</span>
                  <span className="font-semibold">{product.weight}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Xuất xứ:</span>
                  <span className="font-semibold">{product.origin}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tình trạng:</span>
                  <Badge variant={product.inStock ? "default" : "destructive"}>
                    {product.inStock ? "Còn hàng" : "Hết hàng"}
                  </Badge>
                </div>
                {isProductInCart && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Trong giỏ hàng:</span>
                    <span className="font-semibold text-amber-800">{currentQuantityInCart} sản phẩm</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {product.inStock && (
                <div className="space-y-4 p-6 bg-white rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">Số lượng</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= 99}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-gray-600">
                      Tổng: <span className="font-bold text-orange-600">{formatPrice(product.price * quantity)}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  size="lg"
                  className="w-full bg-amber-800 hover:bg-amber-900 text-white text-lg py-6"
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isProductInCart ? "Đã thêm vào giỏ hàng" : "Thêm vào giỏ hàng"}
                </Button>

                <div className="flex gap-3">
                  <Button variant="outline" size="lg" className="flex-1 bg-transparent">
                    <Heart className="w-5 h-5 mr-2" />
                    Yêu thích
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1 bg-transparent">
                    <Share2 className="w-5 h-5 mr-2" />
                    Chia sẻ
                  </Button>
                </div>
              </div>

              {/* Product Features */}
              <div className="space-y-4 p-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                <h3 className="text-xl font-bold text-amber-900">Đặc điểm nổi bật</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                    100% tự nhiên, không chất bảo quản
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                    Chế biến theo công nghệ hiện đại
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                    Đóng gói kín, bảo quản tốt
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                    Giao hàng toàn quốc
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
