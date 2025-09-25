import type { Product } from "@/types"

export const ALL_PRODUCTS: Product[] = [
  {
    id: "hat-dieu-say",
    name: "Hạt Điều Sấy",
    description:
      "Hạt điều sấy giòn tan, thơm ngon tự nhiên từ vùng đất Tây Nguyên. Giàu protein, vitamin E và các khoáng chất thiết yếu. Hoàn hảo để ăn trực tiếp, pha sữa hạt hoặc kết hợp với sữa chua.",
    price: 180000,
    image: "/placeholder.svg?height=400&width=400",
    category: "nuts",
    inStock: true,
    weight: "1kg",
    origin: "Đắk Lắk, Tây Nguyên",
  },
  {
    id: "hat-macca-say",
    name: "Hạt Macca Sấy",
    description:
      "Hạt macca sấy béo ngậy, ngọt nhẹ tự nhiên với hương vị đặc trưng. Giàu chất xơ, protein và các acid béo không bão hòa tốt cho tim mạch. Thích hợp cho mọi lứa tuổi.",
    price: 450000,
    image: "/placeholder.svg?height=400&width=400",
    category: "nuts",
    inStock: true,
    weight: "500g",
    origin: "Đắk Lắk, Tây Nguyên",
  },
  {
    id: "hat-dieu-rang-muoi",
    name: "Hạt Điều Rang Muối",
    description:
      "Hạt điều rang muối với vị mặn nhẹ, giữ nguyên hương vị tự nhiên của hạt. Được rang theo công thức truyền thống, tạo nên snack lành mạnh cho cả gia đình.",
    price: 200000,
    image: "/placeholder.svg?height=400&width=400",
    category: "nuts",
    inStock: true,
    weight: "1kg",
    origin: "Đắk Lắk, Tây Nguyên",
  },
  {
    id: "hat-hanh-nhan",
    name: "Hạt Hạnh Nhân",
    description:
      "Hạt hạnh nhân giòn tan, bổ sung nhiều vitamin E và chất xơ. Tuyệt vời cho sức khỏe tim mạch và hệ miễn dịch. Có thể ăn trực tiếp hoặc dùng trong các món bánh.",
    price: 320000,
    image: "/placeholder.svg?height=400&width=400",
    category: "nuts",
    inStock: true,
    weight: "500g",
    origin: "Đắk Lắk, Tây Nguyên",
  },
  {
    id: "ca-phe-nguyen-chat",
    name: "Cà Phê Nguyên Chất",
    description:
      "Cà phê Robusta nguyên chất với hương thơm đậm đà, vị đắng dịu đặc trưng của cao nguyên. Giúp tỉnh táo và tràn đầy năng lượng cho ngày mới.",
    price: 280000,
    image: "/placeholder.svg?height=400&width=400",
    category: "coffee",
    inStock: true,
    weight: "1kg",
    origin: "Buôn Ma Thuột, Đắk Lắk",
  },
  {
    id: "ca-cao-nguyen-chat",
    name: "Ca Cao Nguyên Chất",
    description:
      "Ca cao nguyên chất với hương thơm nồng, vị đắng đặc trưng, giàu chất chống oxy hóa. Lý tưởng để pha đồ uống và làm bánh, mang lại hương vị đậm đà tự nhiên.",
    price: 150000,
    image: "/placeholder.svg?height=400&width=400",
    category: "specialties",
    inStock: true,
    weight: "500g",
    origin: "Đắk Lắk, Tây Nguyên",
  },
]

export function getProductById(id: string): Product | undefined {
  return ALL_PRODUCTS.find((product) => product.id === id)
}

export function getProductsByCategory(category: Product["category"]): Product[] {
  return ALL_PRODUCTS.filter((product) => product.category === category)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price)
}
