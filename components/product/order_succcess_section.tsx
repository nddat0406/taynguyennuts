"use client";

import { Calendar, CheckCircle2, Copy, MapPin, Package, Phone, User } from "lucide-react";
import { useState } from "react";

interface OrderSuccessSectionProps {
    orderInfo: any;
}

const OrderSuccessSection = ({ orderInfo }: OrderSuccessSectionProps) => {
    const [copied, setCopied] = useState(false);


    const copyOrderCode = () => {
        navigator.clipboard.writeText(orderInfo.payment_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className=" bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
            <div className="w-full ">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-6">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle2 className="w-8 h-8" />
                            <h1 className="text-2xl font-bold">Đơn hàng đã được thanh toán</h1>
                        </div>
                        <p className="text-green-50 text-sm">Cảm ơn bạn đã tin tưởng và mua hàng</p>
                    </div>

                    <div className="p-8">
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 mb-2 font-medium">Mã đơn hàng của bạn</p>
                                    <p className="text-3xl font-bold text-orange-600 tracking-wide mb-3">
                                        {orderInfo.payment_code}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-1.5">
                                        <Package className="w-4 h-4" />
                                        Bạn có thể tra cứu đơn hàng với mã này
                                    </p>
                                </div>
                                <button
                                    onClick={copyOrderCode}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-orange-300 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 hover:border-orange-400 transition-all duration-200 shadow-sm hover:shadow active:scale-95"
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Đã sao chép</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            <span>Sao chép</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin đơn hàng</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">Ngày đặt</p>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {new Date(orderInfo.created_at).toLocaleString("vi-VN")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">Khách hàng</p>
                                        <p className="text-sm text-gray-900 font-medium">{orderInfo.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">Số điện thoại</p>
                                        <p className="text-sm text-gray-900 font-medium">{orderInfo.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 sm:col-span-2">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">Địa chỉ giao hàng</p>
                                        <p className="text-sm text-gray-900 font-medium">{orderInfo.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Sản phẩm đã mua</h3>
                            <div className="space-y-3 mb-6">
                                {orderInfo.order_details.map((detail: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 mb-1">
                                                {detail.products.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Số lượng: <span className="font-medium">{detail.quantity}</span> × {" "}
                                                <span className="font-medium">
                                                    {new Intl.NumberFormat("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    }).format(detail.products.price)}
                                                </span>
                                            </p>
                                        </div>
                                        <span className="font-bold text-lg text-orange-600 ml-4">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(detail.products.price * detail.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-5 flex items-center justify-between">
                                <span className="text-lg font-semibold">Tổng tiền thanh toán</span>
                                <span className="text-2xl font-bold">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(orderInfo.total)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 text-center">
                        <button
                            onClick={() => (window.location.href = "/")}
                            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                        >
                            Quay lại trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccessSection;
