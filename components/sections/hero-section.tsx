"use client"
import { Button } from "@/components/ui/button"
import { Leaf, Coffee, Nut, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section className="relative min-h-screen amber-liner overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage: `url('/heroSectionBG.jpg')`,
          backgroundAttachment: "fixed",
        }}
      ></div>

      <div className="absolute inset-0 nut-pattern"></div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Nuts */}
        <div
          className="absolute top-20 left-[10%] animate-float transition-transform duration-300 hover:scale-110"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02 + scrollY * 0.1}px) rotate(${scrollY * 0.1}deg)`,
          }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-orange-700 opacity-30 flex items-center justify-center shadow-lg">
            <Nut className="w-8 h-8 text-amber-900" />
          </div>
        </div>

        <div
          className="absolute top-40 right-[15%] animate-float-slow"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.015 + scrollY * 0.15}px) rotate(${-scrollY * 0.08}deg)`,
          }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 opacity-25 flex items-center justify-center shadow-lg">
            <Nut className="w-10 h-10 text-orange-900" />
          </div>
        </div>

        <div
          className="absolute bottom-32 left-[20%] animate-bounce-gentle"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01 - scrollY * 0.12}px)`,
          }}
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-700 to-orange-800 opacity-20 flex items-center justify-center shadow-lg">
            <Nut className="w-7 h-7 text-amber-950" />
          </div>
        </div>

        {/* Animated Coffee Beans */}
        <div
          className="absolute top-[30%] right-[25%] animate-wiggle"
          style={{
            transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02 + scrollY * 0.08}px)`,
          }}
        >
          <Coffee className="w-12 h-12 text-amber-700/30" />
        </div>

        <div
          className="absolute bottom-[25%] right-[10%] animate-float-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.018}px, ${mousePosition.y * -0.018 - scrollY * 0.1}px) rotate(${scrollY * 0.05}deg)`,
          }}
        >
          <Coffee className="w-16 h-16 text-orange-700/25" />
        </div>

        <div
          className="absolute top-[60%] left-[15%] animate-sway"
          style={{
            transform: `translate(${mousePosition.x * -0.025}px, ${mousePosition.y * 0.025 + scrollY * 0.09}px)`,
          }}
        >
          <Coffee className="w-10 h-10 text-amber-800/30" />
        </div>

        {/* Animated Leaves */}
        <div
          className="absolute top-[50%] left-[5%] animate-float"
          style={{
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015 + scrollY * 0.11}px) rotate(${scrollY * 0.15}deg)`,
          }}
        >
          <Leaf className="w-14 h-14 text-green-700/25 rotate-45" />
        </div>

        <div
          className="absolute bottom-[40%] right-[8%] animate-sway"
          style={{
            transform: `translate(${mousePosition.x * -0.012}px, ${mousePosition.y * 0.012 - scrollY * 0.13}px)`,
          }}
        >
          <Leaf className="w-12 h-12 text-green-600/20 -rotate-12" />
        </div>

        {/* Sparkle effects */}
        <div
          className="absolute top-[20%] left-[40%] animate-spin-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.012}px, ${mousePosition.y * -0.012}px)`,
          }}
        >
          <Sparkles className="w-8 h-8 text-amber-500/25" />
        </div>

        {/* Decorative blurred circles */}
        <div
          className="absolute top-[50%] right-[5%] w-32 h-32 rounded-full bg-amber-400/10 blur-3xl animate-pulse"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        ></div>
        <div
          className="absolute bottom-[20%] left-[5%] w-40 h-40 rounded-full bg-orange-400/10 blur-3xl animate-pulse"
          style={{
            transform: `translateY(${-scrollY * 0.15}px)`,
          }}
        ></div>
      </div>


      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 lg:p-16 shadow-2xl border border-amber-200/50 hover:shadow-amber-200/50 transition-all duration-500 group hover:scale-[1.02]">
            {/* Decorative product icons */}
            <div className="flex justify-center gap-4 mb-4 opacity-60 group-hover:opacity-100 transition-opacity">
              <Nut className="w-8 h-8 text-amber-700 animate-bounce-gentle group-hover:scale-110 transition-transform" />
              <Coffee className="w-8 h-8 text-orange-700 animate-wiggle group-hover:scale-110 transition-transform" />
              <Leaf className="w-8 h-8 text-green-700 animate-sway group-hover:scale-110 transition-transform" />
            </div>
            <div className=" rounded-full flex items-center justify-center">
              <img src="/logo.png" alt="Tây Nguyên Nuts" width={200} height={200} />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-balance">
              <span className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Hương vị Tây Nguyên
              </span>
              <br />
              <span className="text-amber-900">Đậm đà tự nhiên</span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed text-pretty">
              Khám phá tinh hoa nông sản Tây Nguyên với hạt điều, macca, cà phê và ca cao nguyên chất từ những vùng đất
              màu mỡ nhất Việt Nam.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  const productsSection = document.getElementById("products")
                  productsSection?.scrollIntoView({ behavior: "smooth" })
                }}
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-10 py-6 text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all group/btn"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover/btn:rotate-12 transition-transform" />
                Khám phá sản phẩm
              </Button>
              <Button
                onClick={() => {
                  const storySection = document.getElementById("story")
                  storySection?.scrollIntoView({ behavior: "smooth" })
                }}
                size="lg"
                variant="outline"
                className="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 px-10 py-6 text-lg bg-white/50 backdrop-blur hover:scale-105 transition-all"
              >
                Tìm hiểu câu chuyện
              </Button>
            </div>

            {/* Trust indicators with hover effects */}
            <div className="mt-12 pt-8 border-t border-amber-200/50 flex flex-wrap justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2 hover:scale-110 transition-transform cursor-default">
                <Leaf className="w-4 h-4 text-green-600" />
                <span>100% Organic</span>
              </div>
              <div className="flex items-center gap-2 hover:scale-110 transition-transform cursor-default">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Chất lượng cao</span>
              </div>
              <div className="flex items-center gap-2 hover:scale-110 transition-transform cursor-default">
                <Nut className="w-4 h-4 text-amber-700" />
                <span>Tươi nguyên chất</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="white"
            fillOpacity="0.3"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  )
}
