import RealtimeOrders from "@/components/realtime-orders";
import Image from "next/image";

const response = {
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
  vi: {
    title: "CK Ngân Hàng",
    description: "Vui lòng chuyển khoản để thanh toán.",
    metadata: {
      amount: "Số Tiền",
      accountName: "Tên Tài Khoản",
      accountNumber: "Số Tài Khoản",
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
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string }>;
};

const PaymentPage = async (props: Props) => {
  const searchParams = await props.searchParams;

  const locale = searchParams.locale as keyof typeof response;
  const localeData = response[locale ?? "en"];

  const amount = searchParams.amount ?? "0";
  const transferContent = searchParams.content ?? "N/A";

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <div className="w-3/6 mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {localeData.title}
          </h2>
          <p className="text-gray-600 mb-8">{localeData.description}</p>
          <div className="flex gap-5">
            <div className="w-full flex justify-center items-center gap-5">
              <Image
                width={300}
                height={300}
                className="rounded-lg shadow-md"
                src={`${localeData.bankAccount.qrHref}&amount=${amount}&des=${transferContent}`}
                alt="QR Code"
              />
            </div>
            <div className="w-full space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="block text-sm font-medium text-gray-500 mb-1">
                  {localeData.metadata.accountNumber}
                </span>
                <span className="block text-lg font-semibold text-gray-800">
                  {localeData.bankAccount.accountNumber}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="block text-sm font-medium text-gray-500 mb-1">
                  {localeData.metadata.accountName}
                </span>
                <span className="block text-lg font-semibold text-gray-800">
                  {localeData.bankAccount.accountName}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="block text-sm font-medium text-gray-500 mb-1">
                  {localeData.metadata.amount}
                </span>
                <span className="block text-xl font-bold text-gray-800">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(Number(amount))}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="block text-sm font-medium text-gray-500 mb-1">
                  {localeData.metadata.transferContent}
                </span>
                <span className="block text-lg font-semibold text-gray-800">
                  {transferContent}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="block text-sm font-medium text-gray-500 mb-1">
                  {localeData.metadata.bankName}
                </span>
                <span className="block text-lg font-semibold text-gray-800">
                  {localeData.bankAccount.bankShortName} -{" "}
                  {localeData.bankAccount.bankName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RealtimeOrders paymentCode={transferContent} />
    </div>
  );
};

export default PaymentPage;
