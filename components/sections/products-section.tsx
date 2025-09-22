import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const products = [
  {
    name: "Hạt Điều Sấy",
    description: "Giòn, thơm, giàu dinh dưỡng. Hoàn hảo để ăn trực tiếp, pha sữa hạt hoặc kết hợp với sữa chua.",
    price: "180.000đ",
    unit: "/kg",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Hạt Macca Sấy",
    description: "Béo ngậy, ngọt nhẹ tự nhiên, giàu chất xơ và dinh dưỡng. Thích hợp cho mọi lứa tuổi.",
    price: "450.000đ",
    unit: "/kg",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Hạt Điều Rang Muối",
    description: "Vị mặn nhẹ, giữ nguyên hương vị tự nhiên của hạt. Snack lành mạnh cho cả gia đình.",
    price: "200.000đ",
    unit: "/kg",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Hạt Hạnh Nhân",
    description: "Giòn tan, bổ sung nhiều vitamin E và chất xơ. Tuyệt vời cho sức khỏe tim mạch.",
    price: "320.000đ",
    unit: "/kg",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Cà Phê Nguyên Chất",
    description: "Hương thơm đậm đà, vị đắng dịu đặc trưng của cao nguyên. Giúp tỉnh táo và tràn đầy năng lượng.",
    price: "280.000đ",
    unit: "/kg",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Ca Cao Nguyên Chất",
    description: "Hương thơm nồng, vị đắng đặc trưng, giàu chất chống oxy hóa. Lý tưởng để pha đồ uống và làm bánh.",
    price: "150.000đ",
    unit: "/kg",
    image: "/placeholder.svg?height=300&width=300",
  },
]

export function ProductsSection() {
  return (
    <section id="products" className="py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-amber-900 mb-6 text-balance">
            Sản phẩm đặc sản
            <span className="text-orange-600"> Tây Nguyên</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Từ những vùng đất màu mỡ của Tây Nguyên, chúng tôi mang đến những sản phẩm nông sản chất lượng cao, được chế
            biến theo phương pháp truyền thống.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-amber-900 mb-3">{product.name}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-orange-600">
                    {product.price}
                    <span className="text-sm text-gray-500 font-normal">{product.unit}</span>
                  </div>
                  <Button className="bg-amber-800 hover:bg-amber-900 text-white">Đặt hàng</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
