import { Shield, Truck, RotateCcw, Leaf } from "lucide-react"

export function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: "100% Cam kết hoàn trả",
      description: "Không hài lòng? Hoàn tiền 100%",
    },
    {
      icon: Truck,
      title: "Miễn phí vận chuyển",
      description: "Cho đơn hàng trên 500.000đ",
    },
    {
      icon: RotateCcw,
      title: "Đổi trả trong 7 ngày",
      description: "Cam kết chất lượng sản phẩm",
    },
    {
      icon: Leaf,
      title: "Không hương liệu nhân tạo",
      description: "100% tự nhiên, an toàn",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-amber-200/50">
      {badges.map((badge, index) => {
        const Icon = badge.icon
        return (
          <div
            key={index}
            className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 cursor-default"
          >
            <Icon className="w-6 h-6 text-amber-700 mb-2" />
            <h4 className="font-semibold text-sm text-gray-800">{badge.title}</h4>
            <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
          </div>
        )
      })}
    </div>
  )
}
