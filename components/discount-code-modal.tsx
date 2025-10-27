"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, Tag, Trophy } from "lucide-react"
import type { DiscountCode, CartItem } from "@/types"
import { formatPrice } from "@/utils/utils"

interface DiscountCodeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cartItems: CartItem[]
  onSelectDiscount: (discount: DiscountCode | null) => void
  selectedDiscountId?: string
}

export function DiscountCodeModal({
  open,
  onOpenChange,
  cartItems,
  onSelectDiscount,
  selectedDiscountId,
}: DiscountCodeModalProps) {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | undefined>(selectedDiscountId)

  useEffect(() => {
    if (open) {
      fetchDiscountCodes()
    }
  }, [open])

  useEffect(() => {
    setSelectedId(selectedDiscountId)
  }, [selectedDiscountId])

  const fetchDiscountCodes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/discount-codes')
      const result = await response.json()

      if (response.ok && result.data) {
        const productIds = cartItems.map((item) => item.product.id)
        
        const applicableCodes = result.data.filter((code: DiscountCode) => {
          if (code.productIds.length === 0) return true
          return code.productIds.some((id) => productIds.includes(id))
        })

        setDiscountCodes(applicableCodes)

        if (applicableCodes.length > 0 && !selectedDiscountId) {
          const best = getBestDiscount(applicableCodes)
          setSelectedId(best.id)
        }
      }
    } catch (error) {
      console.error('Failed to fetch discount codes:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateDiscount = (code: DiscountCode) => {
    let totalDiscount = 0

    cartItems.forEach((item) => {
      if (code.productIds.length === 0 || code.productIds.includes(item.product.id)) {
        const itemPrice = Number(item.product.price || 0) * item.quantity
        totalDiscount += itemPrice * (code.value / 100)
      }
    })

    return totalDiscount
  }

  const getBestDiscount = (codes: DiscountCode[]) => {
    return codes.reduce((best, current) => {
      const bestAmount = calculateDiscount(best)
      const currentAmount = calculateDiscount(current)
      return currentAmount > bestAmount ? current : best
    })
  }

  const handleApply = () => {
    const selected = discountCodes.find((code) => code.id === selectedId)
    onSelectDiscount(selected || null)
    onOpenChange(false)
  }

  const handleRemove = () => {
    setSelectedId(undefined)
    onSelectDiscount(null)
    onOpenChange(false)
  }

  const bestDiscount = discountCodes.length > 0 ? getBestDiscount(discountCodes) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Chọn mã giảm giá
          </DialogTitle>
          <DialogDescription>
            Chọn mã giảm giá phù hợp với đơn hàng của bạn
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        ) : discountCodes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Tag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Không có mã giảm giá khả dụng</p>
          </div>
        ) : (
          <>
            <RadioGroup value={selectedId} onValueChange={setSelectedId}>
              <div className="space-y-3">
                {discountCodes.map((code) => {
                  const discountAmount = calculateDiscount(code)
                  const isBest = bestDiscount?.id === code.id

                  return (
                    <div
                      key={code.id}
                      className={`relative border rounded-lg p-4 hover:border-amber-500 transition-colors ${
                        selectedId === code.id ? 'border-amber-500 bg-amber-50' : ''
                      }`}
                    >
                      {isBest && (
                        <Badge className="absolute -top-2 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                          <Trophy className="w-3 h-3 mr-1" />
                          Tốt nhất
                        </Badge>
                      )}
                      
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value={code.id} id={code.id} className="mt-1" />
                        <div className="flex-1">
                          <Label
                            htmlFor={code.id}
                            className="cursor-pointer font-semibold text-lg flex items-center gap-2"
                          >
                            <span className="text-amber-800">{code.code}</span>
                            <Badge variant="outline" className="border-red-500 text-red-600">
                              -{code.value}%
                            </Badge>
                          </Label>
                          
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600">
                              Tiết kiệm: <span className="font-semibold text-green-600">{formatPrice(discountAmount)}</span>
                            </p>
                            
                            {code.productIds.length > 0 && (
                              <p className="text-xs text-gray-500">
                                Áp dụng cho {code.productIds.length} sản phẩm cụ thể
                              </p>
                            )}
                            
                            <p className="text-xs text-gray-400">
                              Có hiệu lực đến {new Date(code.endDate).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </RadioGroup>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleRemove}
                className="flex-1"
              >
                Bỏ chọn
              </Button>
              <Button
                onClick={handleApply}
                disabled={!selectedId}
                className="flex-1 bg-amber-800 hover:bg-amber-900"
              >
                Áp dụng
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
