import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Users, Leaf, Award, TrendingUp } from "lucide-react"

export default function AboutPage() {
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
      icon: Leaf,
      title: "Bền vững & Xanh",
      description: "Cam kết phát triển bền vững, bảo vệ môi trường và hỗ trợ cộng đồng nông dân địa phương.",
    },
    {
      icon: Users,
      title: "Kết nối cộng đồng",
      description: "Xây dựng cầu nối giữa người tiêu dùng và nông dân, tạo ra giá trị cho cả hai bên.",
    },
  ]

  const milestones = [
    {
      year: "2025",
      title: "Khởi đầu hành trình",
      description: "Thành lập công ty với sứ mệnh mang nông sản Tây Nguyên đến gần hơn với người tiêu dùng.",
    },
    {
      year: "2026",
      title: "Mở rộng sản phẩm",
      description: "Phát triển danh mục sản phẩm đa dạng từ hạt dinh dưỡng đến cà phê đặc sản.",
    },
    {
      year: "2027",
      title: "Hợp tác nông dân",
      description: "Thiết lập quan hệ đối tác với hơn 50 hộ nông dân tại Tây Nguyên.",
    },
    {
      year: "2028",
      title: "Phát triển bền vững",
      description: "Mở rộng quy mô và cam kết phát triển bền vững, bảo vệ môi trường.",
    },
  ]

  const stats = [
    { icon: Users, number: "10,000+", label: "Khách hàng tin tưởng" },
    { icon: Award, number: "50+", label: "Hộ nông dân hợp tác" },
    { icon: TrendingUp, number: "100+", label: "Sản phẩm chất lượng" },
    { icon: Heart, number: "5,000+", label: "Đánh giá tích cực" },
  ]

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-800 to-orange-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">Về chúng tôi</h1>
              <p className="text-xl text-amber-100 max-w-3xl mx-auto leading-relaxed">
                Câu chuyện về hành trình mang tinh hoa nông sản Tây Nguyên đến với mọi nhà
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-amber-900 mb-6 text-balance">
                  Câu chuyện từ
                  <span className="text-orange-600"> trái tim</span>
                  <br />
                  Tây Nguyên
                </h2>
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p>
                    Tây Nguyên Nuts ra đời từ tình yêu sâu sắc với mảnh đất Tây Nguyên và mong muốn mang những tinh hoa
                    nông sản Việt Nam đến gần hơn với mọi người.
                  </p>
                  <p>
                    Chúng tôi hợp tác trực tiếp với các nông dân địa phương, đảm bảo nguồn gốc rõ ràng và chất lượng tốt
                    nhất. Mỗi sản phẩm đều mang trong mình câu chuyện của những người nông dân tần tảo, tâm huyết.
                  </p>
                  <p>
                    Không chỉ là nơi bán hàng, Tây Nguyên Nuts là cầu nối giữa người tiêu dùng và nông sản đặc sản, góp
                    phần xây dựng lối sống lành mạnh và bền vững.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="/vietnamese-farmer-harvesting-coffee.jpg"
                    alt="Nông dân thu hoạch cà phê"
                    className="w-full h-60 object-cover rounded-2xl shadow-lg"
                  />
                  <img
                    src="/processing-cashew-nuts.jpg"
                    alt="Chế biến hạt điều"
                    className="w-full h-48 object-cover rounded-2xl shadow-lg"
                  />
                </div>
                <div className="space-y-4 mt-8">
                  <img
                    src="/macadamia-farm-central-highlands.jpg"
                    alt="Vườn macca Tây Nguyên"
                    className="w-full h-48 object-cover rounded-2xl shadow-lg"
                  />
                  <img
                    src="/vietnamese-farming-family.jpg"
                    alt="Gia đình nông dân"
                    className="w-full h-60 object-cover rounded-2xl shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-amber-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-amber-900 mb-6 text-balance">
                Giá trị cốt lõi
                <span className="text-orange-600"> của chúng tôi</span>
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Chúng tôi cam kết mang đến những sản phẩm chất lượng cao với sự minh bạch, tình yêu và trách nhiệm với
                khách hàng.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <value.icon className="w-10 h-10 text-amber-800" />
                    </div>
                    <h3 className="text-xl font-bold text-amber-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-amber-800 to-orange-700 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-amber-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-amber-900 mb-6">Hành trình phát triển</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Từ những bước đi đầu tiên đến hôm nay, chúng tôi không ngừng nỗ lực để mang đến giá trị tốt nhất
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-amber-200 hidden lg:block" />

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                    } flex-col gap-8`}
                  >
                    {/* Content */}
                    <div className="lg:w-1/2">
                      <Card className={`border-amber-200 shadow-lg ${index % 2 === 0 ? "lg:mr-8" : "lg:ml-8"}`}>
                        <CardContent className="pt-6">
                          <div className="text-3xl font-bold text-amber-600 mb-2">{milestone.year}</div>
                          <h3 className="text-xl font-bold text-amber-900 mb-3">{milestone.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-amber-600 rounded-full border-4 border-white shadow-lg hidden lg:block" />

                    {/* Spacer */}
                    <div className="lg:w-1/2 hidden lg:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-amber-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-amber-900 mb-6">Cùng chúng tôi lan tỏa giá trị</h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Hãy trở thành một phần trong hành trình mang nông sản Việt Nam đến với mọi nhà
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
              >
                Khám phá sản phẩm
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-amber-600 text-amber-900 hover:bg-amber-50 font-semibold rounded-lg transition-colors"
              >
                Liên hệ với chúng tôi
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
