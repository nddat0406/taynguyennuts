import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Chị Minh Hương",
    location: "Hà Nội",
    content:
      "Hạt điều của Tây Nguyên Nuts thật sự rất thơm và giòn. Gia đình tôi rất thích, đặc biệt là các con ăn rất ngon. Chất lượng tuyệt vời!",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Anh Tuấn Anh",
    location: "TP. Hồ Chí Minh",
    content:
      "Cà phê nguyên chất ở đây có hương vị đậm đà, không pha trộn. Uống một lần là nhớ mãi. Sẽ tiếp tục ủng hộ sản phẩm Việt Nam.",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Cô Lan Phương",
    location: "Đà Nẵng",
    content:
      "Hạt macca béo ngậy, ngọt tự nhiên. Tôi hay dùng để làm sữa hạt cho cả nhà uống. Bao bì đẹp, thích hợp làm quà tặng người thân.",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60",
  },
]

export function TestimonialsSection() {
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <section className="py-20 bg-white overflow-hidden scroll-snap-section">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
          backgroundAttachment: "fixed",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-amber-900 mb-6 text-balance">
            Khách hàng
            <span className="text-orange-600"> nói gì</span>
            <br />
            về chúng tôi
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Niềm tin và sự hài lòng của khách hàng chính là động lực để chúng tôi không ngừng cải thiện chất lượng sản
            phẩm.
          </p>
        </div>

        <div className="relative">
          <div className="flex gap-8 animate-scroll-infinite hover:[animation-play-state:paused]">
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-amber-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0 w-[400px] hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-amber-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
