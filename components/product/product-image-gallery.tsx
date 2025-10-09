"use client"

import type React from "react"

import { useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import type { ProductImages } from "@/types"
import { ZoomIn, Maximize2 } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/utils/utils"

interface ProductImageGalleryProps {
  images: ProductImages[]
  productName: string
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const displayImages =
    images.length > 0 ? images : [{ url: "/placeholder.svg?height=600&width=600", isMainImage: true }]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  return (
    <div className="space-y-4 animate-slide-in-left">
      {/* Main Image Display with Zoom */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 shadow-2xl group">
        <div
          className="relative w-full h-full cursor-zoom-in"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={displayImages[selectedIndex].url || "/placeholder.svg"}
            alt={displayImages[selectedIndex].alt || `${productName} - Image ${selectedIndex + 1}`}
            className={cn(
              "w-full h-full object-cover transition-all duration-700 ease-out",
              isZoomed ? "scale-150" : "scale-100 group-hover:scale-105",
            )}
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  }
                : undefined
            }
            key={selectedIndex}
          />

          <div
            className={cn(
              "absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300",
              isZoomed ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100",
            )}
          >
            <ZoomIn className="w-5 h-5" />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <button className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 hover:scale-110">
                <Maximize2 className="w-5 h-5" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
              <img
                src={displayImages[selectedIndex].url || "/placeholder.svg"}
                alt={displayImages[selectedIndex].alt || `${productName} - Image ${selectedIndex + 1}`}
                className="w-full h-full object-contain"
              />
            </DialogContent>
          </Dialog>
        </div>

        {displayImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-slide-up">
            {selectedIndex + 1} / {displayImages.length}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {displayImages.length > 1 && (
        <div className="relative px-12">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {displayImages.map((image, index) => (
                <CarouselItem key={index} className="pl-2 basis-1/3 md:basis-1/4 lg:basis-1/5">
                  <button
                    onClick={() => setSelectedIndex(index)}
                    className={cn(
                      "relative aspect-square rounded-xl overflow-hidden bg-white shadow-md transition-all duration-300 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 hover-lift",
                      selectedIndex === index
                        ? "ring-3 ring-amber-600 ring-offset-2 scale-105 shadow-xl"
                        : "opacity-60 hover:opacity-100",
                    )}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.alt || `${productName} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    {selectedIndex === index && (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-600/30 to-orange-600/30 pointer-events-none animate-pulse-glow" />
                    )}
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 bg-white/95 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110" />
            <CarouselNext className="right-0 bg-white/95 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110" />
          </Carousel>
        </div>
      )}
    </div>
  )
}
