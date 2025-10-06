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

  useEffect(() => {
    const supabase = createClient();
    const checkPayment = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("payment_status")
        .eq("payment_code", transferContent)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data?.payment_status === "success") {
        setIsPaid(true);
      }
    };

    checkPayment();
  }, [transferContent]);
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
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 py-10">
      <div className="w-5/6 max-w-5xl bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">{localeData.title}</h2>
          <p className="text-gray-600 mb-4">{localeData.description}</p>

          {!isExpired ? (
            <>
              {!isPaid && (
                <p className="text-sm text-red-600 font-medium mb-2">
                  ⚠️ Mã QR sẽ hết hạn sau: {formatTime(timeLeft)}
                </p>
              )}

              <div className="flex flex-col md:flex-row gap-5 relative">
                <div className="flex justify-center items-center relative w-[300px] h-[300px]">
                  <Image
                    width={300}
                    height={300}
                    className={`rounded-lg shadow-md transition-opacity duration-300 ${
                      isPaid ? "opacity-50" : "opacity-100"
                    }`}
                    src={`${localeData.bankAccount.qrHref}&amount=${amount}&des=${transferContent}`}
                    alt="QR Code"
                  />
                  {isPaid && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
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
                    </div>
                  )}
                </div>

                <div className="w-full space-y-4">
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
            <div className="text-center py-10">
              <p className="text-xl font-semibold text-red-600 mb-4">
                ⌛ Mã QR đã hết hạn!
              </p>
              <p className="text-gray-600">
                Vui lòng quay lại và tạo đơn hàng mới nếu bạn vẫn muốn thanh toán.
              </p>
            </div>
          )}
        </div>
      </div>

      {!isExpired && (
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
