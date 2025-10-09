"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Share2, Minus, Plus, Check, Sparkles } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types"
import { cn, formatPrice } from "@/utils/utils"

interface ProductClientActionsProps {
  product: Product
}

export function ProductClientActions({ product }: ProductClientActionsProps) {
  const { addToCart, isInCart, getItemQuantity } = useCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const currentQuantityInCart = getItemQuantity(product.id)
  const isProductInCart = isInCart(product.id)

  const handleAddToCart = async () => {
    if (!product.inStock) return

    setIsAdding(true)
    await new Promise((resolve) => setTimeout(resolve, 600))

    addToCart(product, quantity)
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name} (${quantity} sản phẩm)`,
    })
    setQuantity(1)
    setIsAdding(false)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description ?? undefined,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Share cancelled")
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Đã sao chép liên kết",
        description: "Liên kết sản phẩm đã được sao chép vào clipboard",
      })
    }
  }

  return (
    <div className="space-y-6 animate-slide-in-right">
      {isProductInCart && (
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-200 animate-zoom-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-bounce-gentle">
                <Check className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-700 font-medium">Trong giỏ hàng:</span>
            </div>
            <span className="font-bold text-xl text-green-700">{currentQuantityInCart} sản phẩm</span>
          </div>
        </div>
      )}

      {product.inStock && (
        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            Chọn số lượng
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden hover:border-amber-500 transition-colors duration-300">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 hover:bg-amber-50 transition-all duration-300 hover:scale-110"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-5 w-5" />
              </Button>
              <span className="w-20 text-center font-bold text-2xl text-amber-900 transition-all duration-300">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 hover:bg-amber-50 transition-all duration-300 hover:scale-110"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 99}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">Tổng cộng</div>
              <div className="font-bold text-2xl text-orange-600 transition-all duration-300">
                {formatPrice((Number(product.price ?? "9999999999999999")) * quantity)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Button
          size="lg"
          className={cn(
            "w-full text-white text-lg py-7 rounded-xl font-bold shadow-lg transition-all duration-300 relative overflow-hidden group",
            product.inStock
              ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 hover:shadow-2xl hover:scale-105"
              : "bg-gray-400 cursor-not-allowed",
          )}
          disabled={!product.inStock || isAdding}
          onClick={handleAddToCart}
        >
          <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100" />
          <div className="relative flex items-center justify-center gap-2">
            {isAdding ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang thêm...</span>
              </>
            ) : (
              <>
                <ShoppingCart className={cn("w-6 h-6 transition-transform duration-300", isAdding && "scale-0")} />
                <span>{isProductInCart ? "Thêm tiếp vào giỏ" : "Thêm vào giỏ hàng"}</span>
              </>
            )}
          </div>
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "py-6 rounded-xl font-semibold border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg",
              isFavorited
                ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100"
                : "bg-white border-gray-200 hover:border-red-300 hover:bg-red-50",
            )}
            onClick={() => setIsFavorited(!isFavorited)}
          >
            <Heart className={cn("w-5 h-5 mr-2 transition-all duration-300", isFavorited && "fill-current")} />
            {isFavorited ? "Đã thích" : "Yêu thích"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="py-6 rounded-xl font-semibold border-2 bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5 mr-2" />
            Chia sẻ
          </Button>
        </div>
      </div>
    </div>
  )
}
