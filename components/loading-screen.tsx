"use client"

import { useEffect, useState } from "react"

interface LoadingScreenProps {
  message?: string
  fullScreen?: boolean
}

export function LoadingScreen({ message = "Đang tải...", fullScreen = true }: LoadingScreenProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className={`${
        fullScreen ? "fixed inset-0 z-50" : "relative w-full"
      } flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 ${
        mounted ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
    >
      <div className="flex flex-col items-center gap-8 p-8">
        {/* Animated Nuts Container */}
        <div className="relative w-32 h-32">
          {/* Center Nut - Spinning */}
          <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-orange-700 shadow-lg flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
            </div>
          </div>

          {/* Orbiting Nuts */}
          <div className="absolute inset-0 animate-spin-reverse">
            {/* Nut 1 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-md animate-bounce-slow" />
            {/* Nut 2 */}
            <div
              className="absolute top-1/2 right-0 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 shadow-md animate-bounce-slow"
              style={{ animationDelay: "0.2s" }}
            />
            {/* Nut 3 */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 to-orange-700 shadow-md animate-bounce-slow"
              style={{ animationDelay: "0.4s" }}
            />
            {/* Nut 4 */}
            <div
              className="absolute top-1/2 left-0 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-orange-600 to-amber-700 shadow-md animate-bounce-slow"
              style={{ animationDelay: "0.6s" }}
            />
          </div>

          {/* Floating Leaves */}
          <div className="absolute -top-4 -left-4 w-6 h-6 animate-float">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-green-600 opacity-60">
              <path d="M12 2C12 2 7 4 7 12C7 16 9 18 12 22C15 18 17 16 17 12C17 4 12 2 12 2Z" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute -bottom-4 -right-4 w-5 h-5 animate-float" style={{ animationDelay: "0.5s" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-green-500 opacity-60">
              <path d="M12 2C12 2 7 4 7 12C7 16 9 18 12 22C15 18 17 16 17 12C17 4 12 2 12 2Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-amber-900 animate-pulse">{message}</h2>
          <div className="flex gap-1 justify-center">
            <div className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-orange-600 animate-bounce" style={{ animationDelay: "0.1s" }} />
            <div className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>
        </div>

        {/* Brand Tagline */}
        <p className="text-sm text-amber-700 font-medium">Tây Nguyên Nuts - Hương vị thiên nhiên</p>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-amber-400 opacity-20 animate-float-random"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Compact version for inline loading states
export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-4 border-amber-200" />
        <div className="absolute inset-0 rounded-full border-4 border-amber-600 border-t-transparent animate-spin" />
      </div>
    </div>
  )
}
