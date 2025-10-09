"use client"

import { Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/utils/utils"
import type { CartItem as CartItemType } from "@/types"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()
  const { product, quantity } = item

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(product.id)
    } else {
      updateQuantity(product.id, newQuantity)
    }
  }

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0">
      {/* Product Image */}
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        <img src={product.product_images?.[0]?.url || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
        <p className="text-sm text-gray-500">{product.weight}</p>
        <p className="text-lg font-bold text-orange-600 mt-1">{formatPrice(Number(product.price ?? 9999999999999999))}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-transparent"
          onClick={() => handleQuantityChange(quantity - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center font-semibold">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-transparent"
          onClick={() => handleQuantityChange(quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-400 hover:text-red-500"
        onClick={() => removeFromCart(product.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
