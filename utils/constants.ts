import type { Product, Testimonial, CompanyValue, ContactInfo, SocialLinks } from "@/types"

export const COMPANY_INFO = {
  name: "Tây Nguyên Nuts",
  tagline: "Hương vị đậm đà từ Tây Nguyên",
  description: "Chuyên cung cấp các sản phẩm hạt dinh dưỡng và nông sản cao cấp từ vùng đất Tây Nguyên",
}

export const CONTACT_INFO: ContactInfo = {
  phone: "+84 123 456 789",
  email: "info@taynyguennuts.com",
  address: "Đắk Lắk, Tây Nguyên, Việt Nam",
  workingHours: "8:00 - 17:00 (Thứ 2 - Thứ 6)",
}

export const SOCIAL_LINKS: SocialLinks = {
  facebook: "https://facebook.com/taynyguennuts",
  instagram: "https://instagram.com/taynyguennuts",
  zalo: "https://zalo.me/taynyguennuts",
}


export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Nguyễn Thị Lan",
    role: "Khách hàng thân thiết",
    content: "Hạt điều ở đây thật sự ngon và chất lượng. Gia đình tôi đã mua nhiều lần và rất hài lòng.",
    rating: 5,
  },
  {
    id: "2",
    name: "Trần Văn Minh",
    role: "Chủ cửa hàng thực phẩm",
    content: "Sản phẩm chất lượng cao, đóng gói đẹp. Khách hàng của tôi rất thích các sản phẩm từ Tây Nguyên Nuts.",
    rating: 5,
  },
  {
    id: "3",
    name: "Lê Thị Hoa",
    role: "Người tiêu dùng",
    content: "Cà phê Robusta ở đây có hương vị đậm đà, đúng chuẩn Tây Nguyên. Sẽ tiếp tục ủng hộ!",
    rating: 5,
  },
]

export const COMPANY_VALUES: CompanyValue[] = [
  {
    id: "1",
    title: "Chất Lượng Cao",
    description: "Cam kết cung cấp sản phẩm chất lượng cao nhất từ vùng đất Tây Nguyên",
    icon: "🌟",
  },
  {
    id: "2",
    title: "Tự Nhiên 100%",
    description: "Sản phẩm hoàn toàn tự nhiên, không chất bảo quản, an toàn cho sức khỏe",
    icon: "🌿",
  },
  {
    id: "3",
    title: "Giao Hàng Nhanh",
    description: "Giao hàng toàn quốc, đảm bảo sản phẩm tươi ngon đến tay khách hàng",
    icon: "🚚",
  },
  {
    id: "4",
    title: "Hỗ Trợ 24/7",
    description: "Đội ngũ chăm sóc khách hàng chuyên nghiệp, hỗ trợ tư vấn mọi lúc",
    icon: "💬",
  },
]
export const ORDER_STATUSES: Record<string, string> = {
  PENDING_CONFIRMATION: "Chờ xác nhận",
  PENDING_PICKUP: "Chờ lấy hàng",
  SHIPPING: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
} as const

export const orderStatusMap: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Chờ lấy hàng",
  shipping: "Đang giao hàng",
  delivered: "Đã giao hàng",
}

export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES]

export const ORDER_STATUS_OPTIONS: OrderStatus[] = Object.values(ORDER_STATUSES)