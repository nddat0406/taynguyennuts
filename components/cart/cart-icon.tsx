"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"

interface CartIconProps {
  onClick?: () => void
}

export function CartIcon({ onClick }: CartIconProps) {
  const { cart } = useCart()

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative bg-white hover:bg-amber-50 border-amber-200"
      onClick={onClick}
    >
      <ShoppingCart className="h-5 w-5 text-amber-800" />
      {cart.itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-orange-600 hover:bg-orange-700"
        >
          {cart.itemCount > 99 ? "99+" : cart.itemCount}
        </Badge>
      )}
    </Button>
  )
}
