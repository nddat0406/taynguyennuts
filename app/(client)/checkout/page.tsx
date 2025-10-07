"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Truck, MapPin, User } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/products";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";
import { createClient } from "@/lib/supabase/client";
import AddressInput from "@/components/ui/address-input"
import { ORDER_STATUSES } from "@/lib/constants";
import { useAuth } from "@/contexts/auth-context";

interface CustomerInfo {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  ward: string
  notes: string
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
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
];

export const generateRandomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth()

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    ward: "",
    notes: "",
  });

  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
    if (user) {
      setCustomerInfo({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        ward: user.ward || "",
        notes: user.notes || "",
      })
    }
  }, [user])

  if (cart.items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center py-16">
              <h1 className="text-3xl font-bold text-amber-900 mb-4">
                Giỏ hàng trống
              </h1>
              <p className="text-gray-600 mb-8">
                Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán
              </p>
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
    );
  }

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (field: string, value: string) => {
    if (field === "province") {
      setCustomerInfo((prev) => ({ ...prev, city: value }))
    } else if (field === "ward") {
      setCustomerInfo((prev) => ({ ...prev, ward: value }))
    }
  }

  const validateForm = (): boolean => {
    const required = ["fullName", "email", "phone", "address", "city"];
    return required.every(
      (field) => customerInfo[field as keyof CustomerInfo].trim() !== ""
    );
  };
const handleSubmitOrder = async () => {
  if (!validateForm()) {
    toast({
      title: "Thông tin chưa đầy đủ",
      description: "Vui lòng điền đầy đủ thông tin bắt buộc",
    });
    return;
  }

  setIsSubmitting(true);

  const shippingFee = cart.total >= 500000 ? 0 : 30000;
  const finalTotal = cart.total + shippingFee;
  const paymentCode = `DH${generateRandomString(6).toUpperCase()}`;

  try {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          name: customerInfo.fullName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          province: customerInfo.city,
          ward: customerInfo.ward || "",
          order_status: ORDER_STATUSES.PENDING_CONFIRMATION,
          payment_code: paymentCode,
          payment_status:
            selectedPayment === "bank_transfer" ? "pending" : "cod",
          total: finalTotal,
          note: customerInfo.notes || "",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      throw orderError;
    }
    const orderDetails = cart.items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      created_at: new Date().toISOString(),
    }));

    const { error: detailError } = await supabase
      .from("order_details")
      .insert(orderDetails);

    if (detailError) {
      throw detailError;
    }
    if (selectedPayment === "bank_transfer") {
      router.push(
        `/payment?locale=vi&amount=${finalTotal}&content=${paymentCode}`
      );
      return;
    }

    clearCart();
    toast({
      title: "Đặt hàng thành công!",
      description: "Chúng tôi sẽ liên hệ để xác nhận đơn hàng.",
    });
    router.push("/?order=success");
  } catch (error) {
    toast({
      title: "Có lỗi xảy ra",
      description: "Vui lòng thử lại sau",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  const shippingFee = cart.total >= 500000 ? 0 : 30000; 
  const finalTotal = cart.total + shippingFee;

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
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
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
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="Số nhà, tên đường"
                    />
                  </div>
                  <AddressInput
                    onLocationChange={handleLocationChange}
                    location={{ province: customerInfo.city, ward: customerInfo.ward }}
                  />
                  <div>
                    <Label htmlFor="notes">Ghi chú đơn hàng</Label>
                    <Textarea
                      id="notes"
                      value={customerInfo.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      placeholder="Ghi chú thêm về đơn hàng (tùy chọn)"
                      rows={3}
                    />
                  </div>
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
                  <RadioGroup
                    value={selectedPayment}
                    onValueChange={setSelectedPayment}
                  >
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-amber-50 transition-colors"
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div className="flex items-center gap-3 flex-1">
                          {method.icon}
                          <div>
                            <Label
                              htmlFor={method.id}
                              className="font-semibold cursor-pointer"
                            >
                              {method.name}
                            </Label>
                            <p className="text-sm text-gray-600">
                              {method.description}
                            </p>
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
                  <CardTitle className="text-amber-900">
                    Đơn hàng của bạn
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.product.product_images[0]?.url || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-orange-600">
                          {formatPrice(item.product.price * item.quantity)}
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
                    <div className="flex justify-between">
                      <span>Phí vận chuyển:</span>
                      <span
                        className={shippingFee === 0 ? "text-green-600" : ""}
                      >
                        {shippingFee === 0
                          ? "Miễn phí"
                          : formatPrice(shippingFee)}
                      </span>
                    </div>
                    {cart.total >= 500000 && (
                      <p className="text-xs text-green-600">
                        🎉 Miễn phí vận chuyển cho đơn hàng từ 500.000đ
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-orange-600">
                      {formatPrice(finalTotal)}
                    </span>
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
      </main>
    </>
  );
}
