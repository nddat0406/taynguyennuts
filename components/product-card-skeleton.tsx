import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="aspect-square w-full bg-amber-100" />

      <CardContent className="p-6 space-y-4">
        {/* Title Skeleton */}
        <Skeleton className="h-7 w-3/4 bg-amber-200" />

        {/* Description Skeleton - 3 lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-amber-100" />
          <Skeleton className="h-4 w-full bg-amber-100" />
          <Skeleton className="h-4 w-2/3 bg-amber-100" />
        </div>

        {/* Price Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32 bg-orange-200" />
        </div>

        {/* Buttons Skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1 bg-amber-200" />
          <Skeleton className="h-10 w-10 bg-amber-200" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}
