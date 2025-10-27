"use client"

export const dynamic = "force-dynamic"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Truck, MapPin, User, Tag, Check } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/utils/supabase/client"
import AddressInput from "@/components/ui/address-input"
import { ORDER_STATUSES } from "@/utils/constants"
import { useAuth } from "@/contexts/auth-context"
import { formatPrice } from "@/utils/utils"
import { DiscountCodeModal } from "@/components/discount-code-modal"
import type { DiscountCode } from "@/types"

// ... existing sendAdminNotificationEmail function ...

interface CustomerInfo {
  fullName: string
  email: string
  phone: string
  address: string
  province: string
  ward: string
  notes: string
}

interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "cod",
    name: "Thanh toán khi nhận hàng (COD)",
    description: "Thanh toán bằng tiền mặt khi nhận hàng",
    icon: <Truck className="w-5 h-5" />,
  },
  {
    id: "bank_transfer",
    name: "Chuyển khoản ngân hàng",
    description: "Chuyển khoản qua tài khoản ngân hàng",
    icon: <CreditCard className="w-5 h-5" />,
  },
]

const shippingMethods = [
  {
    id: "fast",
    name: "Giao hàng nhanh",
    description: "Giao trong 24-48 giờ",
    fee: 0,
    estimatedDays: "1-2 ngày",
  },
  {
    id: "standard",
    name: "Giao hàng tiêu chuẩn",
    description: "Giao trong 3-5 ngày",
    fee: 0,
    estimatedDays: "3-5 ngày",
  },
]

export const generateRandomString = (length: number): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }
  return result
}

const sendAdminNotificationEmail = async (order: any, cartItems: any[]) => {
  try {
    const adminEmail = process.env.NEXT_PUBLIC_MAIL_ADMIN
    if (!adminEmail) {
      console.warn("Admin email not configured")
      return
    }

    const productRows = cartItems
      .map(
        (item) => `
          <tr>
            <td style="padding:8px;border:1px solid #ddd;">${item.product.name}</td>
            <td style="padding:8px;border:1px solid #ddd;">${item.quantity}</td>
            <td style="padding:8px;border:1px solid #ddd;">
              ${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(item.product.price || 0))}
            </td>
            <td style="padding:8px;border:1px solid #ddd;">
              ${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(item.product.price * item.quantity || 0))}
            </td>
          </tr>
        `,
      )
      .join("")

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #B45309;">🛒 Đơn hàng mới từ Tây Nguyên Nuts</h2>
        <div style="background: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0; color: #92400E;">Thông tin đơn hàng</h3>
          <p style="margin: 5px 0;"><strong>Mã đơn hàng:</strong> ${order.payment_code}</p>
          <p style="margin: 5px 0;"><strong>Ngày đặt:</strong> ${new Date(order.created_at).toLocaleString("vi-VN")}</p>
          <p style="margin: 5px 0;"><strong>Trạng thái:</strong> ${order.order_status}</p>
          <p style="margin: 5px 0;"><strong>Phương thức thanh toán:</strong> ${order.payment_status === "cod" ? "COD" : "Chuyển khoản"}</p>
        </div>
        
        <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #374151;">Thông tin khách hàng</h3>
          <p style="margin: 5px 0;"><strong>Tên:</strong> ${order.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${order.email}</p>
          <p style="margin: 5px 0;"><strong>Số điện thoại:</strong> ${order.phone}</p>
          <p style="margin: 5px 0;"><strong>Địa chỉ:</strong> ${order.address}, ${order.ward}, ${order.province}</p>
          ${order.note ? `<p style="margin: 5px 0;"><strong>Ghi chú:</strong> ${order.note}</p>` : ""}
        </div>

        <h3 style="color: #374151;">Chi tiết sản phẩm:</h3>
        <table style="width:100%;border-collapse:collapse;margin: 20px 0;">
          <tr style="background:#F3F4F6;">
            <th style="padding:12px;border:1px solid #ddd;text-align:left;">Sản phẩm</th>
            <th style="padding:12px;border:1px solid #ddd;text-align:center;">Số lượng</th>
            <th style="padding:12px;border:1px solid #ddd;text-align:right;">Đơn giá</th>
            <th style="padding:12px;border:1px solid #ddd;text-align:right;">Thành tiền</th>
          </tr>
          ${productRows}
        </table>
        
        <div style="background: #FEF3C7; padding: 15px; border-radius: 8px;">
          ${
            order.discount_amount && order.discount_amount > 0
              ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Tạm tính:</span>
              <span>${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(order.original_total || 0)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #059669;">
              <span>Giảm giá (${order.discount_value}%):</span>
              <span>-${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(order.discount_amount)}</span>
            </div>
            <div style="border-top: 1px solid #D97706; padding-top: 8px;">
              <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #92400E;">
                <span>Tổng cộng:</span>
                <span>${new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order.total || 0)}</span>
              </div>
            </div>
          `
              : `
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #92400E; text-align: right;">
              Tổng cộng: ${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(order.total || 0)}
            </p>
          `
          }
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #FEF2F2; border-radius: 8px;">
          <p style="margin: 0; color: #991B1B; font-weight: bold;">
            ⚠️ Vui lòng xử lý đơn hàng này trong thời gian sớm nhất!
          </p>
        </div>
      </div>
    `

    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: adminEmail,
        subject: `🛒 Đơn hàng mới ${order.payment_code} - ${order.name}`,
        html: htmlContent,
      }),
    })
  } catch (error) {
    console.error("Failed to send admin notification email:", error)
  }
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    province: "",
    ward: "",
    notes: "",
  })

  const [selectedPayment, setSelectedPayment] = useState("cod")
  const [selectedShipping, setSelectedShipping] = useState("fast")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [discountModalOpen, setDiscountModalOpen] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountCode | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    if (user) {
      setCustomerInfo({
        fullName: user.profile?.fullname || "",
        email: user.email || "",
        phone: user.profile?.phone || "",
        address: user.profile?.address || "",
        province: user.profile?.province || "",
        ward: user.profile?.ward || "",
        notes: "",
      })
    }
  }, [user])

  if (cart.items.length === 0) {
    return (
      <>
        <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center py-16">
              <h1 className="text-3xl font-bold text-amber-900 mb-4">Giỏ hàng trống</h1>
              <p className="text-gray-600 mb-8">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
              <Link href="/#products">
                <Button className="bg-amber-800 hover:bg-amber-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại mua sắm
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleLocationChange = (field: string, value: string) => {
    if (field === "province") {
      setCustomerInfo((prev) => ({ ...prev, province: value }))
    } else if (field === "ward") {
      setCustomerInfo((prev) => ({ ...prev, ward: value }))
    }
  }

  const validateForm = (): boolean => {
    const required = ["fullName", "email", "phone", "address", "province"]
    return required.every((field) => customerInfo[field as keyof CustomerInfo].trim() !== "")
  }

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      toast({
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
      })
      return
    }

    setIsSubmitting(true)

    const discountAmount = calculateDiscountAmount()
    const shippingFee = cart.total >= 500000 ? 0 : 30000
    const finalTotal = cart.total - discountAmount + shippingFee
    const paymentCode = `DH${generateRandomString(6).toUpperCase()}`

    try {
      const supabase = createClient()
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            name: customerInfo.fullName,
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: customerInfo.address,
            province: customerInfo.province,
            ward: customerInfo.ward || "",
            order_status: ORDER_STATUSES.PENDING_CONFIRMATION,
            payment_code: paymentCode,
            payment_status: selectedPayment === "bank_transfer" ? "pending" : "cod",
            total: finalTotal,
            note: customerInfo.notes || "",
            user_id: user?.id || null,
            discount_code_id: selectedDiscount?.id || null,
            discount_code: selectedDiscount?.code || null,
            discount_value: selectedDiscount?.value || null,
            discount_type: "percentage",
            discount_amount: discountAmount || null,
            original_total: cart.total,
          },
        ])
        .select()
        .single()

      if (orderError || !order) {
        throw orderError
      }
      const orderDetails = cart.items.map((item) => ({
        order_id: order.id,
        product_id: Number(item.product.id),
        quantity: item.quantity,
      }))

      const orderDetailsResponse = await fetch("/api/order-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          orderDetails: orderDetails,
        }),
      })

      const orderDetailsData = await orderDetailsResponse.json()

      if (!orderDetailsResponse.ok) {
        console.error("Order details insert error:", orderDetailsData.error)
        throw new Error(orderDetailsData.error || "Có lỗi xảy ra khi tạo chi tiết đơn hàng")
      }

      // Send admin notification email
      await sendAdminNotificationEmail(order, cart.items)

      if (selectedPayment === "bank_transfer") {
        router.push(`/payment?locale=vi&amount=${finalTotal}&content=${paymentCode}`)
        return
      } else if (selectedPayment === "cod") {
        router.push(`/payment?codPayment=true&orderId=${order.id}`)
        return
      }

      clearCart()
      toast({
        title: "Đặt hàng thành công!",
        description: "Chúng tôi sẽ liên hệ để xác nhận đơn hàng.",
      })
      router.push("/?order=success")
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateDiscountAmount = () => {
    if (!selectedDiscount) return 0

    let discountAmount = 0
    cart.items.forEach((item) => {
      if (selectedDiscount.productIds.length === 0 || selectedDiscount.productIds.includes(item.product.id)) {
        const itemPrice = Number(item.product.price || 0) * item.quantity
        discountAmount += itemPrice * (selectedDiscount.value / 100)
      }
    })

    return discountAmount
  }

  const discountAmount = calculateDiscountAmount()
  const shippingFee = cart.total >= 500000 ? 0 : 30000
  const finalTotal = cart.total - discountAmount + shippingFee

  const steps = [
    { number: 1, label: "Thông tin" },
    { number: 2, label: "Vận chuyển" },
    { number: 3, label: "Thanh toán" },
    { number: 4, label: "Xác nhận" },
  ]

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-800 hover:text-amber-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang chủ
          </Link>

          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                      currentStep >= step.number ? "bg-amber-800 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <p
                    className={`ml-2 text-sm font-medium ${
                      currentStep >= step.number ? "text-amber-900" : "text-gray-600"
                    }`}
                  >
                    {step.label}
                  </p>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all ${
                        currentStep > step.number ? "bg-amber-800" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <User className="w-5 h-5" />
                    Thông tin khách hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Họ và tên *</Label>
                      <Input
                        id="fullName"
                        value={customerInfo.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Nhập địa chỉ email"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <MapPin className="w-5 h-5" />
                    Địa chỉ giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Địa chỉ cụ thể *</Label>
                    <Input
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Số nhà, tên đường"
                    />
                  </div>
                  <AddressInput
                    onLocationChange={handleLocationChange}
                    location={{ province: customerInfo.province, ward: customerInfo.ward }}
                  />
                  <div>
                    <Label htmlFor="notes">Ghi chú đơn hàng</Label>
                    <Textarea
                      id="notes"
                      value={customerInfo.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Ghi chú thêm về đơn hàng (tùy chọn)"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <Truck className="w-5 h-5" />
                    Phương thức vận chuyển
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                    {shippingMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-amber-50 transition-colors"
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div className="flex items-center justify-between flex-1">
                          <div>
                            <Label htmlFor={method.id} className="font-semibold cursor-pointer">
                              {method.name}
                            </Label>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-amber-900">{method.estimatedDays}</p>
                            <p className="text-sm text-green-600">
                              {method.fee === 0 ? "Miễn phí" : formatPrice(method.fee)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <CreditCard className="w-5 h-5" />
                    Phương thức thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-amber-50 transition-colors"
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div className="flex items-center gap-3 flex-1">
                          {method.icon}
                          <div>
                            <Label htmlFor={method.id} className="font-semibold cursor-pointer">
                              {method.name}
                            </Label>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-amber-900">Đơn hàng của bạn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.product.product_images?.[0]?.url || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.product.name}</h4>
                        <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-orange-600">
                          {formatPrice((Number(item.product.price) ?? 9999999999999999) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(cart.total)}</span>
                    </div>

                    <div className="border-t pt-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-amber-800 border-amber-300 hover:bg-amber-50 bg-transparent"
                        onClick={() => setDiscountModalOpen(true)}
                      >
                        <Tag className="w-4 h-4 mr-2" />
                        {selectedDiscount ? (
                          <span className="flex-1 text-left">
                            Mã: {selectedDiscount.code} (-{selectedDiscount.value}%)
                          </span>
                        ) : (
                          <span className="flex-1 text-left">Chọn mã giảm giá</span>
                        )}
                      </Button>
                    </div>

                    {selectedDiscount && discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá:</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Phí vận chuyển:</span>
                      <span className={shippingFee === 0 ? "text-green-600" : ""}>
                        {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                      </span>
                    </div>
                    {cart.total >= 500000 && (
                      <p className="text-xs text-green-600">Miễn phí vận chuyển cho đơn hàng từ 500.000đ</p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-orange-600">{formatPrice(finalTotal)}</span>
                  </div>
                </CardContent>
              </Card>

              <Button
                size="lg"
                className="w-full bg-amber-800 hover:bg-amber-900 text-white py-6"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
              </Button>

              <div className="text-center text-sm text-gray-600">
                <p>Bằng cách đặt hàng, bạn đồng ý với</p>
                <p>
                  <Link href="#" className="text-amber-800 hover:underline">
                    Điều khoản dịch vụ
                  </Link>
                  {" và "}
                  <Link href="#" className="text-amber-800 hover:underline">
                    Chính sách bảo mật
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <DiscountCodeModal
          open={discountModalOpen}
          onOpenChange={setDiscountModalOpen}
          cartItems={cart.items}
          onSelectDiscount={setSelectedDiscount}
          selectedDiscountId={selectedDiscount?.id}
        />
      </main>
    </>
  )
}
