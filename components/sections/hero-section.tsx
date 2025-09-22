import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern"></div>

      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
          backgroundAttachment: "fixed",
        }}
      ></div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between p-6 lg:px-12">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-amber-800 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">TN</span>
          </div>
          <span className="text-2xl font-bold text-amber-900">Tây Nguyên Nuts</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#products" className="text-amber-800 hover:text-amber-900 font-medium">
            Sản phẩm
          </a>
          <a href="#story" className="text-amber-800 hover:text-amber-900 font-medium">
            Câu chuyện
          </a>
          <a href="#contact" className="text-amber-800 hover:text-amber-900 font-medium">
            Liên hệ
          </a>
          <Button className="bg-amber-800 hover:bg-amber-900 text-white">Đặt hàng ngay</Button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
            <h1 className="text-5xl lg:text-7xl font-bold text-amber-900 mb-6 text-balance">
              Hương vị
              <span className="text-orange-600"> Tây Nguyên</span>
              <br />
              Đậm đà tự nhiên
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              Khám phá tinh hoa nông sản Tây Nguyên với hạt điều, macca, cà phê và ca cao nguyên chất từ những vùng đất
              màu mỡ nhất Việt Nam.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-4 text-lg">
                Khám phá sản phẩm
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-amber-800 text-amber-800 hover:bg-amber-50 px-8 py-4 text-lg bg-transparent"
              >
                Tìm hiểu câu chuyện
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 opacity-30">
        <img src="/placeholder.svg?height=80&width=80" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute bottom-20 right-10 w-24 h-24 opacity-30">
        <img src="/placeholder.svg?height=96&width=96" alt="" className="w-full h-full object-contain" />
      </div>
    </section>
  )
}
