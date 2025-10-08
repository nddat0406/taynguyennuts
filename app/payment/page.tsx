"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import RealtimeOrders from "@/components/realtime-orders";
import { createClient } from "@/lib/supabase/client";

const response = {
  vi: {
    title: "CK Ngân Hàng",
    description: "Vui lòng chuyển khoản để thanh toán.",
    metadata: {
      amount: "Số Tiền",
      accountName: "Tên Tài Khoản",
      accountNumber: "Số Tài Khoản",
      bankName: "Ngân Hàng",
      transferContent: "Nội Dung Chuyển Khoản",
    },
    bankAccount: {
      qrHref: "https://qr.sepay.vn/img?acc=96247SH58E&bank=BIDV",
      bankName: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
      bankShortName: "BIDV",
      accountName: "TRAN VIET TIEN",
      accountNumber: "96247SH58E",
    },
  },
  en: {
    title: "Bank Transfer",
    description: "Please transfer the amount to pay.",
    metadata: {
      amount: "Amount",
      accountName: "Account Name",
      accountNumber: "Account Number",
      bankName: "Bank Name",
      transferContent: "Transfer Content",
    },
    bankAccount: {
      qrHref: "https://qr.sepay.vn/img?acc=96247SH58E&bank=BIDV",
      bankName:
        "Joint Stock Commercial Bank for Investment and Development of Vietnam",
      bankShortName: "BIDV",
      accountName: "TRAN VIET TIEN",
      accountNumber: "96247SH58E",
    },
  },
};

type Props = {
  searchParams: { [key: string]: string };
};

export default function PaymentPage({ searchParams }: Props) {
  const locale = (searchParams.locale as keyof typeof response) ?? "vi";
  const localeData = response[locale];

  const amount = searchParams.amount ?? "0";
  const transferContent = searchParams.content ?? "N/A";

  const [timeLeft, setTimeLeft] = useState(300);
  const [isExpired, setIsExpired] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const supabase = createClient();
  const paymentCode = searchParams.content;

useEffect(() => {
  const fetchOrder = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_details(
          quantity,
          products(name, price)
        )
      `)
      .eq("payment_code", paymentCode)
      .single();

    if (error) {
      console.error("", error);
      return;
    }

    console.log(":", data);
    setOrderInfo(data);
  };

  fetchOrder();
}, [paymentCode]);
useEffect(() => {
  if (!isPaid || !orderInfo) return;

  const sendEmail = async () => {
    const productRows = orderInfo.order_details
      ?.map(
        (item: any) => `
          <tr>
            <td style="padding:8px;border:1px solid #ddd;">${item.products.name}</td>
            <td style="padding:8px;border:1px solid #ddd;">${item.quantity}</td>
            <td style="padding:8px;border:1px solid #ddd;">
              ${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(item.products.price || 0))}
            </td>
          </tr>
        `
      )
      .join("");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Cảm ơn ${orderInfo.name} đã mua hàng tại Tây Nguyên Nuts! </h2>
        <p>Đơn hàng của bạn đã thanh toán thành công.</p>
        <p><strong>Mã đơn hàng:</strong> ${orderInfo.payment_code}</p>
        <h3>Chi tiết sản phẩm:</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr style="background:#f2f2f2;">
            <th style="padding:8px;border:1px solid #ddd;">Sản phẩm</th>
            <th style="padding:8px;border:1px solid #ddd;">Số lượng</th>
            <th style="padding:8px;border:1px solid #ddd;">Đơn giá</th>
          </tr>
          ${productRows}
        </table>
        <p><strong>Tổng tiền:</strong> ${new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(orderInfo.total || 0)}</p>
      </div>
    `;

    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: orderInfo.email,
        subject: `Xác nhận thanh toán - Đơn hàng ${orderInfo.payment_code}`,
        html: htmlContent,
      }),
    });
  };

  sendEmail();
}, [isPaid, orderInfo]);


  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="text-center border-b border-gray-200 px-6 py-6 bg-gradient-to-r from-green-500 to-emerald-600">
          <h2 className="text-2xl font-bold text-white">{localeData.title}</h2>
          <p className="text-sm text-green-50 mt-1">{localeData.description}</p>
        </div>

        <div className="px-6 py-8">
          {!isExpired ? (
            <>
              {!isPaid ? (
                <>
                  <p className="text-center text-sm text-gray-600 mb-5">
                    ⏳ Mã QR sẽ hết hạn sau{" "}
                    <span className="font-semibold text-red-600">
                      {formatTime(timeLeft)}
                    </span>
                  </p>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                    <div className="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-100">
                      <Image
                        width={280}
                        height={280}
                        className="rounded-xl shadow-md"
                        src={`${localeData.bankAccount.qrHref}&amount=${amount}&des=${transferContent}`}
                        alt="QR Code"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                      <InfoItem
                        label={localeData.metadata.accountNumber}
                        value={localeData.bankAccount.accountNumber}
                      />
                      <InfoItem
                        label={localeData.metadata.accountName}
                        value={localeData.bankAccount.accountName}
                      />
                      <InfoItem
                        label={localeData.metadata.amount}
                        value={new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Number(amount))}
                      />
                      <InfoItem
                        label={localeData.metadata.transferContent}
                        value={transferContent}
                      />
                      <InfoItem
                        label={localeData.metadata.bankName}
                        value={`${localeData.bankAccount.bankShortName} - ${localeData.bankAccount.bankName}`}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-6 text-center">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-7.364 7.364a1 1 0 01-1.414 0l-3.364-3.364a1 1 0 111.414-1.414L8.5 11.086l6.657-6.657a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-green-600 font-semibold text-xl">
                    Bạn đã thanh toán thành công!
                  </p>

                  {orderInfo && (
                    <div className="w-full max-w-2xl bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                      <div className="bg-green-600 text-white px-6 py-4 font-semibold text-lg text-left">
                        Đơn hàng của bạn đã được thanh toán
                      </div>
                      <div className="p-6 text-gray-700 space-y-2 text-sm">
                        <div className="grid sm:grid-cols-2 gap-2">
                          <p>
                            <span className="font-semibold text-gray-900">
                              Mã đơn hàng:
                            </span>{" "}
                            {orderInfo.payment_code}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-900">
                              Ngày đặt:
                            </span>{" "}
                            {new Date(orderInfo.created_at).toLocaleString("vi-VN")}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-900">
                              Khách hàng:
                            </span>{" "}
                            {orderInfo.name}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-900">
                              Số điện thoại:
                            </span>{" "}
                            {orderInfo.phone}
                          </p>
                          <p className="sm:col-span-2">
                            <span className="font-semibold text-gray-900">
                              Địa chỉ giao hàng:
                            </span>{" "}
                            {orderInfo.address}
                          </p>
                        </div>

                        <p className="font-semibold text-green-600 text-base mt-3">
                          Tổng tiền:{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(orderInfo.total)}
                        </p>

                        <div className="mt-4 border-t border-gray-200 pt-3">
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Sản phẩm đã mua
                          </h4>
                          <div className="space-y-3">
                            {orderInfo.order_details.map(
                              (detail: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition"
                                >
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {detail.products.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      SL: {detail.quantity} ×{" "}
                                      {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                      }).format(detail.products.price)}
                                    </p>
                                  </div>
                                  <span className="font-semibold text-orange-600 text-sm whitespace-nowrap">
                                    {new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(
                                      detail.products.price * detail.quantity
                                    )}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 px-6 py-4 text-center">
                        <button
                          onClick={() => (window.location.href = "/")}
                          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                        >
                          Quay lại trang chủ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl font-semibold text-red-600 mb-4">
                Mã QR đã hết hạn!
              </p>
              <p className="text-gray-600">
                Vui lòng quay lại và tạo đơn hàng mới nếu bạn vẫn muốn thanh toán.
              </p>
            </div>
          )}
        </div>
      </div>

      {!isExpired && !isPaid && (
        <RealtimeOrders paymentCode={transferContent} setIsPaid={setIsPaid} />
      )}
    </div>
  );
}
const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <span className="block text-sm font-medium text-gray-500 mb-1">
      {label}
    </span>
    <span className="block text-lg font-semibold text-gray-800">{value}</span>
  </div>
);
