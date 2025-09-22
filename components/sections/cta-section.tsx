import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-amber-800 via-orange-700 to-red-700 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
      </div>

      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
          backgroundAttachment: "fixed",
        }}
      ></div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl lg:text-6xl font-bold mb-8 text-balance">
          Trải nghiệm hương vị
          <span className="text-orange-200"> Tây Nguyên</span>
          <br />
          ngay hôm nay
        </h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed opacity-90">
          Đặt hàng ngay để thưởng thức những sản phẩm nông sản chất lượng cao, được giao tận nơi với dịch vụ chuyên
          nghiệp.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-amber-800 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
            Đặt hàng ngay
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
          >
            Xem bảng giá
          </Button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 opacity-20">
        <img src="/placeholder.svg?height=128&width=128" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute bottom-10 right-10 w-28 h-28 opacity-20">
        <img src="/placeholder.svg?height=112&width=112" alt="" className="w-full h-full object-contain" />
      </div>
    </section>
  )
}
