"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Package, Truck, CheckCircle, Clock, Loader2 } from "lucide-react"

interface OrderStatus {
  id: string
  order_status: "pending" | "confirmed" | "shipping" | "delivered"
  date: string
  items: Array<{
    name: string
    quantity: number
    price: number
    image?: string | null
  }>
  total: number
  customerName: string
  address: string
  phone?: string
  email?: string
  note?: string
  paymentStatus?: string
}

const ORDER_STATUSES = {
  pending: {
    label: "Chờ xác nhận",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  confirmed: {
    label: "Đã xác nhận",
    icon: CheckCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  shipping: {
    label: "Đang giao hàng",
    icon: Truck,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  delivered: {
    label: "Đã giao hàng",
    icon: Package,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
}

export default function TrackOrderPage() {
  const [orderCode, setOrderCode] = useState("")
  const [orderData, setOrderData] = useState<OrderStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async () => {
    if (!orderCode.trim()) {
      setError("Vui lòng nhập mã đơn hàng")
      return
    }

    setIsLoading(true)
    setError("")
    setOrderData(null)

    try {
      const response = await fetch(`/api/order-tracking?code=${encodeURIComponent(orderCode.trim())}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Có lỗi xảy ra khi tra cứu đơn hàng")
        return
      }

      if (data.order) {
        setOrderData(data.order)
      } else {
        setError("Không tìm thấy đơn hàng với mã này")
      }
    } catch (error) {
      console.error("Search error:", error)
      setError("Có lỗi xảy ra khi tra cứu đơn hàng")
    } finally {
      setIsLoading(false)
    }
  }

  const statusInfo = orderData ? ORDER_STATUSES[orderData.order_status] : null
  const StatusIcon = statusInfo?.icon

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-white to-amber-50/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">Tra cứu đơn hàng</h1>
              <p className="text-lg text-gray-600">Nhập mã đơn hàng để kiểm tra tình trạng giao hàng của bạn</p>
            </div>

            {/* Search Box */}
            <Card className="mb-8 border-amber-200 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Nhập mã đơn hàng (VD: DH123456)"
                      value={orderCode}
                      onChange={(e) => {
                        setOrderCode(e.target.value)
                        setError("")
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isLoading) {
                          handleSearch()
                        }
                      }}
                      className="h-12 text-lg border-amber-300 focus:border-amber-500"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="h-12 px-8 bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5 mr-2" />
                    )}
                    {isLoading ? "Đang tìm..." : "Tra cứu"}
                  </Button>
                </div>

                {error && (
                  <p className="mt-4 text-red-600 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                    {error}
                  </p>
                )}
                
                {orderData && !error && (
                  <p className="mt-4 text-green-600 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Tìm thấy đơn hàng thành công!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Order Details */}
            {orderData && (
              <Card className="border-amber-200 shadow-lg">
                <CardHeader className="border-b border-amber-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-amber-900">Đơn hàng #{orderData.id}</CardTitle>
                    {statusInfo && StatusIcon && (
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.bgColor}`}>
                        <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                        <span className={`font-semibold ${statusInfo.color}`}>{statusInfo.label}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  {/* Customer Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-2">Thông tin khách hàng</h3>
                      <p className="text-gray-700">{orderData.customerName}</p>
                      {orderData.phone && (
                        <p className="text-gray-600 text-sm mt-1">📞 {orderData.phone}</p>
                      )}
                      {orderData.email && (
                        <p className="text-gray-600 text-sm">✉️ {orderData.email}</p>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-2">Ngày đặt hàng</h3>
                      <p className="text-gray-700">{new Date(orderData.date).toLocaleDateString("vi-VN")}</p>
                      {orderData.paymentStatus && (
                        <p className="text-gray-600 text-sm mt-1">
                          💳 Trạng thái thanh toán: {orderData.paymentStatus === "cod" ? "COD" : "Đã thanh toán"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Địa chỉ giao hàng</h3>
                    <p className="text-gray-700">{orderData.address}</p>
                  </div>

                  {/* Order Notes */}
                  {orderData.note && (
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-2">Ghi chú đơn hàng</h3>
                      <p className="text-gray-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                        {orderData.note}
                      </p>
                    </div>
                  )}

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-3">Sản phẩm đã đặt</h3>
                    <div className="space-y-3">
                      {orderData.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0"
                        >
                          {item.image && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                            <p className="text-sm text-gray-500">
                              Đơn giá: {item.price.toLocaleString("vi-VN")}đ
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-amber-900">
                              {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t-2 border-amber-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-amber-900">Tổng cộng</span>
                      <span className="text-2xl font-bold text-amber-600">
                        {orderData.total.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-amber-900 mb-4">Trạng thái đơn hàng</h3>
                    <div className="space-y-4">
                      {Object.entries(ORDER_STATUSES).map(([key, status]) => {
                        const Icon = status.icon
                        const statusOrder = ["pending", "confirmed", "shipping", "delivered"]
                        const currentStatusIndex = statusOrder.indexOf(orderData.order_status)
                        const currentItemIndex = statusOrder.indexOf(key)
                        const isActive = currentItemIndex <= currentStatusIndex
                        const isCurrent = currentItemIndex === currentStatusIndex

                        return (
                          <div
                            key={key}
                            className={`flex items-center gap-4 ${isActive ? "opacity-100" : "opacity-30"}`}
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isCurrent ? status.bgColor : isActive ? "bg-gray-200" : "bg-gray-100"
                              }`}
                            >
                              <Icon className={`w-5 h-5 ${
                                isCurrent ? status.color : isActive ? "text-gray-600" : "text-gray-400"
                              }`} />
                            </div>
                            <span className={`font-medium ${
                              isCurrent ? "text-gray-900" : isActive ? "text-gray-700" : "text-gray-400"
                            }`}>
                              {status.label}
                              {isCurrent && <span className="ml-2 text-sm text-amber-600">(Hiện tại)</span>}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
