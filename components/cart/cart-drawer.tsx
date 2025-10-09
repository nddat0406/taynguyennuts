"use client"

import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/hooks/use-cart"
import { CartItem } from "./cart-item"
import { CartIcon } from "./cart-icon"
import { useState } from "react"
import Link from "next/link"
import { formatPrice } from "@/utils/utils"

export function CartDrawer() {
  const { cart, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const handleCheckout = () => {
    setIsOpen(false)
    // Navigation to checkout will be handled by the checkout process
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div>
          <CartIcon onClick={() => setIsOpen(true)} />
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-amber-900">
            <ShoppingBag className="h-5 w-5" />
            Giỏ hàng ({cart.itemCount} sản phẩm)
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Giỏ hàng trống</h3>
                <p className="text-gray-500 mb-6">Thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm</p>
                <Button onClick={() => setIsOpen(false)} className="bg-amber-800 hover:bg-amber-900">
                  Tiếp tục mua sắm
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.items.length > 0 && (
            <div className="border-t border-gray-200 pt-4 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-orange-600">{formatPrice(cart.total)}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link href="/checkout" onClick={handleCheckout}>
                  <Button size="lg" className="w-full bg-amber-800 hover:bg-amber-900">
                    Thanh toán
                  </Button>
                </Link>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsOpen(false)}>
                    Tiếp tục mua sắm
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                    onClick={clearCart}
                  >
                    Xóa tất cả
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
