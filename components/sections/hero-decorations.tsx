"use client"

import { useState, useEffect } from "react"
import { Leaf, Coffee, Nut, Sparkles } from "lucide-react"

export default function HeroDecorations() {
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
  )
}
