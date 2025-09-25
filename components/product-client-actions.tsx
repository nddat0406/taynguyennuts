"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/products"
import type { Product } from "@/types"

interface ProductClientActionsProps {
  product: Product
}

export function ProductClientActions({ product }: ProductClientActionsProps) {
  const { addToCart, isInCart, getItemQuantity } = useCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)

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
      {/* Cart quantity display */}
      {isProductInCart && (
        <div className="space-y-4 p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Trong giỏ hàng:</span>
            <span className="font-semibold text-amber-800">{currentQuantityInCart} sản phẩm</span>
          </div>
        </div>
      )}

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
    </>
  )
}
