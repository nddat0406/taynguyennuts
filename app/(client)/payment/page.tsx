"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import RealtimeOrders from "@/components/realtime-orders";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle2 } from "lucide-react";
import { ORDER_STATUSES } from "@/utils/constants";
import OrderSuccessSection from "@/components/product/order_succcess_section";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/use-cart";

type Locale = 'vi' | 'en';

const localeData = {
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
      bankName: "Joint Stock Commercial Bank for Investment and Development of Vietnam",
      bankShortName: "BIDV",
      accountName: "TRAN VIET TIEN",
      accountNumber: "96247SH58E",
    },
  },
};

const generateProductRows = (orderDetails: any[], includeSubtotal: boolean, locale: Locale) => {
  const currencyFormatter = new Intl.NumberFormat(locale === 'vi' ? "vi-VN" : "en-US", {
    style: "currency",
    currency: "VND",
  });

  return orderDetails?.map((item: any) => `
    <tr>
      <td style="padding:8px;border:1px solid #ddd;">${item.products.name}</td>
      <td style="padding:8px;border:1px solid #ddd;">${item.quantity}</td>
      <td style="padding:8px;border:1px solid #ddd;">
        ${currencyFormatter.format(Number(item.products.price || 0))}
      </td>
      ${includeSubtotal ? `
        <td style="padding:8px;border:1px solid #ddd;">
          ${currencyFormatter.format(Number(item.products.price * item.quantity || 0))}
        </td>
      ` : ''}
    </tr>
  `).join("") || "";
};

const sendAdminPaidOrderNotification = async (orderInfo: any, locale: Locale) => {
  try {
    const adminEmail = process.env.NEXT_PUBLIC_MAIL_ADMIN;
    if (!adminEmail) {
      console.warn("Admin email not configured");
      return;
    }

    const productRows = generateProductRows(orderInfo.order_details, true, locale);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">💰 Đơn hàng đã thanh toán - Tây Nguyên Nuts</h2>
        <div style="background: #D1FAE5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0; color: #047857;">Thông tin đơn hàng</h3>
          <p style="margin: 5px 0;"><strong>Mã đơn hàng:</strong> ${orderInfo.payment_code}</p>
          <p style="margin: 5px 0;"><strong>Ngày đặt:</strong> ${new Date(orderInfo.created_at).toLocaleString(locale === 'vi' ? "vi-VN" : "en-US")}</p>
          <p style="margin: 5px 0;"><strong>Trạng thái:</strong> Đã thanh toán</p>
          <p style="margin: 5px 0;"><strong>Phương thức thanh toán:</strong> Chuyển khoản ngân hàng</p>
        </div>
        
        <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #374151;">Thông tin khách hàng</h3>
          <p style="margin: 5px 0;"><strong>Tên:</strong> ${orderInfo.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${orderInfo.email}</p>
          <p style="margin: 5px 0;"><strong>Số điện thoại:</strong> ${orderInfo.phone}</p>
          <p style="margin: 5px 0;"><strong>Địa chỉ:</strong> ${orderInfo.address}, ${orderInfo.ward}, ${orderInfo.province}</p>
          ${orderInfo.note ? `<p style="margin: 5px 0;"><strong>Ghi chú:</strong> ${orderInfo.note}</p>` : ''}
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
        
        <div style="background: #D1FAE5; padding: 15px; border-radius: 8px; text-align: right;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #047857;">
            Tổng cộng: ${new Intl.NumberFormat(locale === 'vi' ? "vi-VN" : "en-US", {
              style: "currency",
              currency: "VND",
            }).format(orderInfo.total || 0)}
          </p>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #FEF3C7; border-radius: 8px;">
          <p style="margin: 0; color: #92400E; font-weight: bold;">
            ✅ Đơn hàng đã được thanh toán! Vui lòng chuẩn bị và giao hàng.
          </p>
        </div>
      </div>
    `;

    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: adminEmail,
        subject: `💰 Đơn hàng đã thanh toán ${orderInfo.payment_code} - ${orderInfo.name}`,
        html: htmlContent,
      }),
    });
  } catch (error) {
    console.error("Failed to send admin paid order notification:", error);
  }
};

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const locale = (searchParams.get("locale") as Locale) ?? "vi";
  const data = localeData[locale];
  const amount = searchParams.get("amount") ?? "0";
  const transferContent = searchParams.get("content") ?? "N/A";
  const codPayment = searchParams.get("codPayment") === "true";
  const orderId = searchParams.get("orderId");
  const paymentCode = searchParams.get("content");

  const [timeLeft, setTimeLeft] = useState(300);
  const [isExpired, setIsExpired] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { cart, clearCart } = useCart();
  
  const supabase = createClient();

  const currencyFormatter = useCallback(() => new Intl.NumberFormat(locale === 'vi' ? "vi-VN" : "en-US", {
    style: "currency",
    currency: "VND",
  }), [locale]);

  const fetchOrder = useCallback(async (isCod: boolean, id: string | null) => {
    if (!id) return;
    setIsLoading(true);
    const query = isCod ? supabase.from("orders").select(`*, order_details(quantity, products(name, price))`).eq("id", Number(id)).single()
                        : supabase.from("orders").select(`*, order_details(quantity, products(name, price))`).eq("payment_code", id).single();

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching order:", error);
    } else {
      setOrderInfo(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (codPayment && orderId) {
      fetchOrder(true, orderId);
    } else if (paymentCode) {
      fetchOrder(false, paymentCode);
    }
  }, [codPayment, orderId, paymentCode, fetchOrder]);

  const sendConfirmationEmails = useCallback(async () => {
    if (!orderInfo) return;

    const productRows = generateProductRows(orderInfo.order_details, false, locale);

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
        <p><strong>Tổng tiền:</strong> ${currencyFormatter().format(orderInfo.total || 0)}</p>
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

    await sendAdminPaidOrderNotification(orderInfo, locale);
  }, [orderInfo, locale, currencyFormatter]);

  useEffect(() => {
    if (!isPaid || !orderInfo) return;

    supabase.from("orders").update({ order_status: ORDER_STATUSES.PENDING_PICKUP }).eq("id", orderInfo.id).then(({ error }) => {
      if (error) {
        console.error("Error updating order status:", error);
      }
    });
    clearCart();
    sendConfirmationEmails().catch(error => console.error("Error sending emails:", error));
  }, [isPaid, orderInfo, sendConfirmationEmails, supabase]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (codPayment) {
    clearCart();
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="text-center border-b border-gray-200 px-6 py-6 bg-gradient-to-r from-green-500 to-emerald-600">
            <h2 className="text-2xl font-bold text-white">Thanh Toán COD</h2>
            <p className="text-sm text-green-50 mt-1">Bạn đã chọn thanh toán khi nhận hàng.</p>
          </div>
          <div className="px-6 py-8">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <p className="text-green-600 font-semibold text-xl">
                Bạn đã chọn thanh toán khi nhận hàng (COD)!
              </p>
              {orderInfo && <OrderSuccessSection orderInfo={orderInfo} />}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="text-center border-b border-gray-200 px-6 py-6 bg-gradient-to-r from-green-500 to-emerald-600">
          <h2 className="text-2xl font-bold text-white">{data.title}</h2>
          <p className="text-sm text-green-50 mt-1">{data.description}</p>
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
                        src={`${data.bankAccount.qrHref}&amount=${amount}&des=${transferContent}`}
                        alt="QR Code"
                        loading="eager"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                      <InfoItem label={data.metadata.accountNumber} value={data.bankAccount.accountNumber} />
                      <InfoItem label={data.metadata.accountName} value={data.bankAccount.accountName} />
                      <InfoItem label={data.metadata.amount} value={currencyFormatter().format(Number(amount))} />
                      <InfoItem label={data.metadata.transferContent} value={transferContent} />
                      <InfoItem
                        label={data.metadata.bankName}
                        value={`${data.bankAccount.bankShortName} - ${data.bankAccount.bankName}`}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-6 text-center">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-green-600 font-semibold text-xl">
                    Bạn đã thanh toán thành công!
                  </p>
                  {orderInfo && <OrderSuccessSection orderInfo={orderInfo} />}
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
    <span className="block text-sm font-medium text-gray-500 mb-1">{label}</span>
    <span className="block text-lg font-semibold text-gray-800">{value}</span>
  </div>
);
