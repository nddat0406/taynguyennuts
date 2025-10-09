"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, MapPin, CreditCard, Truck, Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/utils/products"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/contexts/auth-context"

interface OrderItem {
  product: {
    id: string
    name: string
    price: number
    image?: string
  }
  quantity: number
}

interface Order {
  id: string
  customerInfo: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    ward: string
    notes: string
  }
  items: OrderItem[]
  total: number
  paymentMethod: string
  status: string
  createdAt: string
}

const statusConfig = {
  pending: {
    label: "Chờ xác nhận",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  confirmed: {
    label: "Đã xác nhận",
    icon: CheckCircle,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  shipping: {
    label: "Đang giao hàng",
    icon: Truck,
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  delivered: {
    label: "Đã giao hàng",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  cancelled: {
    label: "Đã hủy",
    icon: XCircle,
    color: "bg-red-100 text-red-800 border-red-200",
  },
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const userOrders = storedOrders.filter((order: Order) => order.customerInfo.email === user.email)
      setOrders(userOrders)
      setIsLoading(false)
    }
  }, [user, authLoading, router])

  if (authLoading || isLoading) {
    return null
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng"
      case "bank_transfer":
        return "Chuyển khoản ngân hàng"
      default:
        return method
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-amber-800 hover:text-amber-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang cá nhân
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-amber-900 mb-2">Lịch sử đơn hàng</h1>
            <p className="text-gray-600">Xem và theo dõi tất cả đơn hàng của bạn</p>
          </div>

          {orders.length === 0 ? (
            <Card className="border-amber-200 shadow-xl">
              <CardContent className="py-16 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Chưa có đơn hàng nào</h2>
                <p className="text-gray-600 mb-6">Bạn chưa đặt đơn hàng nào. Hãy khám phá sản phẩm của chúng tôi!</p>
                <Link href="/products">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Package className="w-4 h-4 mr-2" />
                    Mua sắm ngay
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
                const StatusIcon = status.icon

                return (
                  <Card key={order.id} className="border-amber-200 shadow-xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <CardTitle className="text-amber-900 flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Đơn hàng #{order.id}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{formatDate(order.createdAt)}</p>
                        </div>
                        <Badge className={`${status.color} border px-3 py-1 flex items-center gap-2 w-fit`}>
                          <StatusIcon className="w-4 h-4" />
                          {status.label}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-gray-900">Địa chỉ giao hàng</p>
                              <p className="text-sm text-gray-600">{order.customerInfo.fullName}</p>
                              <p className="text-sm text-gray-600">{order.customerInfo.phone}</p>
                              <p className="text-sm text-gray-600">
                                {order.customerInfo.address}
                                {order.customerInfo.ward && `, ${order.customerInfo.ward}`}
                                {order.customerInfo.city && `, ${order.customerInfo.city}`}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <CreditCard className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-gray-900">Phương thức thanh toán</p>
                              <p className="text-sm text-gray-600">{getPaymentMethodLabel(order.paymentMethod)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900">Sản phẩm đã đặt</h3>
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                              <img
                                src={item.product.image || "/placeholder.svg"}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">{item.product.name}</h4>
                              <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-amber-700">
                                {formatPrice(item.product.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-4" />

                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                        <span className="text-2xl font-bold text-amber-700">{formatPrice(order.total)}</span>
                      </div>

                      {order.customerInfo.notes && (
                        <>
                          <Separator className="my-4" />
                          <div>
                            <p className="font-semibold text-gray-900 mb-1">Ghi chú:</p>
                            <p className="text-sm text-gray-600 bg-amber-50 p-3 rounded-lg">
                              {order.customerInfo.notes}
                            </p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
