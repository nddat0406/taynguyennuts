"use client"

import { Star } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Review {
  id: string
  author: string
  rating: number
  comment: string
  date: string
}

interface ProductReviewsProps {
  productName: string
}

export function ProductReviews({ productName }: ProductReviewsProps) {
  // Mock reviews data
  const reviews: Review[] = [
    {
      id: "1",
      author: "Nguyễn Văn A",
      rating: 5,
      comment: "Sản phẩm rất tốt, hương vị đậm đà, giao hàng nhanh. Sẽ mua lại!",
      date: "2 tuần trước",
    },
    {
      id: "2",
      author: "Trần Thị B",
      rating: 5,
      comment: "Không hương liệu nhân tạo như quảng cáo. Chất lượng tuyệt vời!",
      date: "1 tháng trước",
    },
    {
      id: "3",
      author: "Lê Văn C",
      rating: 4,
      comment: "Tốt, nhưng giá hơi cao. Nhưng chất lượng xứng đáng.",
      date: "1 tháng trước",
    },
  ]

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <div className="mt-12 pt-8 border-t border-amber-200">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-amber-900 mb-4">Đánh giá từ khách hàng</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="text-4xl font-bold text-amber-900">{averageRating}</div>
            <div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(Number(averageRating)) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">{reviews.length} đánh giá</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-4">
              <Avatar className="w-10 h-10 border-2 border-amber-200">
                <AvatarFallback className="bg-amber-600 text-white font-bold">{review.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-amber-900">{review.author}</h4>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
