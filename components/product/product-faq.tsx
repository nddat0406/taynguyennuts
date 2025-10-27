"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FAQItem {
  question: string
  answer: string
}

interface ProductFAQProps {
  productName: string
}

export function ProductFAQ({ productName }: ProductFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: "Sản phẩm này có chứa chất bảo quản không?",
      answer:
        "Không. Tất cả sản phẩm của chúng tôi được chế biến 100% tự nhiên, không chứa bất kỳ chất bảo quản, hương liệu nhân tạo hay màu nhân tạo nào.",
    },
    {
      question: "Thời gian giao hàng là bao lâu?",
      answer:
        "Chúng tôi cam kết giao hàng nhanh toàn quốc trong vòng 48 giờ. Bạn sẽ nhận được thông báo theo dõi đơn hàng ngay sau khi đặt hàng.",
    },
    {
      question: "Chính sách đổi trả như thế nào?",
      answer:
        "Chúng tôi cam kết đổi trả sản phẩm trong vòng 7 ngày nếu sản phẩm không đạt chất lượng hoặc không như mô tả. Vui lòng liên hệ chúng tôi để được hỗ trợ.",
    },
    {
      question: "Sản phẩm được bảo quản như thế nào?",
      answer:
        "Sản phẩm nên được bảo quản ở nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp. Hạn sử dụng được ghi rõ trên bao bì sản phẩm.",
    },
    {
      question: "Sản phẩm có chứng nhận gì không?",
      answer:
        "Tất cả sản phẩm của chúng tôi đều được chứng nhận OCOP (One Commune One Product) và đạt tiêu chuẩn vệ sinh an toàn thực phẩm.",
    },
    {
      question: "Tôi có thể mua số lượng lớn không?",
      answer:
        "Có. Chúng tôi hỗ trợ mua số lượng lớn cho các doanh nghiệp. Vui lòng liên hệ chúng tôi để được tư vấn giá tốt nhất.",
    },
  ]

  return (
    <div className="mt-12 pt-8 border-t border-amber-200">
      <h3 className="text-2xl font-bold text-amber-900 mb-6">Câu hỏi thường gặp</h3>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-amber-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <Button
              variant="ghost"
              className="w-full justify-between p-4 h-auto hover:bg-amber-50 text-left"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-semibold text-amber-900">{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-amber-700 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
              />
            </Button>
            {openIndex === index && (
              <div className="px-4 py-3 bg-amber-50 border-t border-amber-200">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
