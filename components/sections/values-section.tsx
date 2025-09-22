import { CheckCircle, Heart, Shield, Truck } from "lucide-react"

const values = [
  {
    icon: Shield,
    title: "Chất lượng đảm bảo",
    description:
      "Sản phẩm được kiểm tra nghiêm ngặt, đảm bảo an toàn vệ sinh thực phẩm và giữ nguyên giá trị dinh dưỡng.",
  },
  {
    icon: Heart,
    title: "Tình yêu từ nông dân",
    description: "Mỗi sản phẩm đều chứa đựng tâm huyết và tình yêu của những người nông dân Tây Nguyên.",
  },
  {
    icon: CheckCircle,
    title: "Minh bạch nguồn gốc",
    description: "Cung cấp đầy đủ thông tin về vùng trồng, quy trình sản xuất và câu chuyện từ nông dân.",
  },
  {
    icon: Truck,
    title: "Giao hàng tận nơi",
    description: "Đóng gói cẩn thận, giao hàng nhanh chóng đến tận tay khách hàng trên toàn quốc.",
  },
]

export function ValuesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-amber-900 mb-6 text-balance">
            Giá trị cốt lõi
            <span className="text-orange-600"> của chúng tôi</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Chúng tôi cam kết mang đến những sản phẩm chất lượng cao với sự minh bạch, tình yêu và trách nhiệm với khách
            hàng.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors duration-300">
                <value.icon className="w-10 h-10 text-amber-800" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
