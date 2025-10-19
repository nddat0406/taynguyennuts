export function StorySection() {
  return (
    <section id="story" className="py-20 bg-amber-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-6"></div>
      </div>

      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
          backgroundAttachment: "fixed",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-balance">
              Câu chuyện từ
              <span className="text-orange-300"> trái tim</span>
              <br />
              Tây Nguyên
            </h2>
            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                Tây Nguyên Nuts ra đời từ tình yêu sâu sắc với mảnh đất Tây Nguyên và mong muốn mang những tinh hoa nông
                sản Việt Nam đến gần hơn với mọi người.
              </p>
              <p>
                Chúng tôi hợp tác trực tiếp với các nông dân địa phương, đảm bảo nguồn gốc rõ ràng và chất lượng tốt
                nhất. Mỗi sản phẩm đều mang trong mình câu chuyện của những người nông dân tần tảo, tâm huyết.
              </p>
              <p>
                Không chỉ là nơi bán hàng, Tây Nguyên Nuts là cầu nối giữa người tiêu dùng và nông sản đặc sản, góp phần
                xây dựng lối sống lành mạnh và bền vững.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="/nongdanthuhoachcafe.jpg"
                alt="Nông dân thu hoạch cà phê"
                className="w-full h-60 object-cover rounded-2xl shadow-lg"
                height={250}
                width={300}
              />
              <img
                src="/hạt điều.jpg"
                alt="Chế biến hạt điều"
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
                width={300}
                height={200}
              />
            </div>
            <div className="space-y-4 mt-8">
              <img
                src="/vuonMacca.png"
                alt="Vườn macca Tây Nguyên"
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
                height={200}
                width={300}
              />
              <img
                src="/Ca-Phe-8.jpg"
                alt="Gia đình nông dân"
                className="w-full h-60 object-cover rounded-2xl shadow-lg"
                width={300}
                height={250}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
