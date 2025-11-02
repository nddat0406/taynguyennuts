import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, Check, Truck, Shield, RotateCcw } from "lucide-react"
import Link from "next/link"
import Head from "next/head"
import { createClient } from "@/utils/supabase/server"
import { formatPrice } from "@/utils/utils"
import { cn } from "@/utils/utils"
import { ProductImageGallery } from "@/components/product/product-image-gallery"
import type { Product, ProductImages } from "@/types"
import { ProductClientActions } from "@/components/product/product-client-actions"
import { ProductFAQ } from "@/components/product/product-faq"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      price,
      inStock,
      weight,
      benefits,
      ingredients,
      expiration,
      storage_instructions,
      usage_instructions,
      manufactured_at,
      packaged_at,
      product_images (
        url,
        isMainImage
      ),
      category:category_id (id, name)
    `)
    .eq("id", id)
    .single<Product>()
  if (error || !product) {
    console.error("Error fetching product:", error)
    notFound()
  }

  // Copy product into a mutable variable so we can attach computed fields (server-side only)
  let productWithDiscount = product as Product

  // Fetch active discount codes and attach the best discount (if any) to the product copy
  try {
    const now = new Date().toISOString()
    const { data: discountData, error: discountError } = await supabase
      .from("discount_codes")
      .select(`*, discount_code_products (product_id)`)
      .eq("is_active", true)
      .lte("start_date", now)
      .gte("end_date", now)

    if (!discountError && discountData && discountData.length > 0) {
      const discountCodes = (discountData || []).map((code: any) => ({
        id: code.id,
        code: code.code,
        value: Number(code.value),
        startDate: code.start_date,
        endDate: code.end_date,
        isActive: code.is_active,
        productIds: code.discount_code_products?.map((p: any) => p.product_id) ?? [],
      }))

      const applicable = discountCodes.filter((d: any) => {
        // global discount when productIds is empty
        if (!d.productIds || d.productIds.length === 0) return true
        return d.productIds.includes(productWithDiscount.id as number)
      })

      if (applicable.length > 0) {
        const best = applicable.reduce((best: any, cur: any) => (cur.value > best.value ? cur : best))
        const originalPrice = Number(productWithDiscount.price ?? 0)
        const discountedPrice = originalPrice * (1 - best.value / 100)

        // create a copy of productWithDiscount with bestDiscount attached
        productWithDiscount = {
          ...productWithDiscount,
          bestDiscount: {
            id: best.id,
            code: best.code,
            value: best.value,
            discountedPrice,
          },
        } as Product
      }
    }
  } catch (err) {
    // non-fatal: if discounts fail, simply render without them
    console.error("Failed to fetch discounts for product detail:", err)
  }

  // Prepare sorted images
  const sortedImages = productWithDiscount.product_images
    ? [...productWithDiscount.product_images].sort(
        (a: ProductImages, b: ProductImages) => (b.isMainImage ? 1 : 0) - (a.isMainImage ? 1 : 0),
      )
    : []

  // Prepare key information points
  const keyInfo = [
    productWithDiscount.benefits ? { label: "Lợi ích", value: productWithDiscount.benefits } : null,
    productWithDiscount.ingredients ? { label: "Thành phần", value: productWithDiscount.ingredients } : null,
    productWithDiscount.expiration ? { label: "Hạn sử dụng", value: productWithDiscount.expiration } : null,
    productWithDiscount.storage_instructions ? { label: "Bảo quản", value: productWithDiscount.storage_instructions } : null,
  ].filter(Boolean) // Remove null entries

  // Prepare features for highlights
  const features = [
    productWithDiscount.benefits || "100% tự nhiên, không chất bảo quản",
    productWithDiscount.ingredients ? `Thành phần: ${productWithDiscount.ingredients}` : "Chế biến hiện đại",
    productWithDiscount.packaged_at ? "Đóng gói cẩn thận" : "Bảo đảm chất lượng",
    "Giao hàng toàn quốc",
  ].slice(0, 3) // Limit to 3 features for brevity

  return (
    <>
      <Head>
        <meta name="og:type" content="product" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-amber-50 to-white relative overflow-hidden pb-16">
        <div className="absolute inset-0 opacity-50 nut-pattern" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-20 animate-float" />

        <div className="relative max-w-7xl mx-auto px-4 py-8">
          {/* Back Link */}
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 text-amber-800 hover:text-amber-900 mb-8 transition-all duration-300 hover:gap-3 font-semibold group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            Quay lại sản phẩm
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="order-1 lg:order-1 sticky top-4 lg:h-[calc(100vh-6rem)] space-y-8">
              <ProductImageGallery images={sortedImages} productName={productWithDiscount.name} />
              {/* Additional Info (if available) */}
              {(productWithDiscount.manufactured_at || productWithDiscount.packaged_at || productWithDiscount.usage_instructions) && (
                <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 animate-slide-up stagger-3">
                  <h3 className="text-lg font-semibold text-amber-900 mb-4">Thông tin bổ sung</h3>
                  <div className="space-y-3">
                    {productWithDiscount.manufactured_at && (
                      <div>
                        <span className="text-gray-600 font-medium">Nơi sản xuất:</span>
                        <p className="text-gray-900">{productWithDiscount.manufactured_at}</p>
                      </div>
                    )}
                    {productWithDiscount.packaged_at && (
                      <div>
                        <span className="text-gray-600 font-medium">Nơi đóng gói:</span>
                        <p className="text-gray-900">{productWithDiscount.packaged_at}</p>
                      </div>
                    )}
                    {productWithDiscount.usage_instructions && (
                      <div>
                        <span className="text-gray-600 font-medium">Hướng dẫn sử dụng:</span>
                        <p className="text-gray-900">{productWithDiscount.usage_instructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-sm border border-blue-100 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Cam kết chất lượng</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center text-center">
                    <Shield className="w-8 h-8 text-blue-600 mb-3" />
                    <p className="text-xs font-semibold text-blue-900">Hoàn trả 100%</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Truck className="w-8 h-8 text-blue-600 mb-3" />
                    <p className="text-xs font-semibold text-blue-900">Giao 48 giờ</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <RotateCcw className="w-8 h-8 text-blue-600 mb-3" />
                    <p className="text-xs font-semibold text-blue-900">Đổi 7 ngày</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="order-2 lg:order-2 space-y-6">
              {/* Product Name and Price */}
              <div className="animate-slide-up bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
                <h1 className="text-4xl font-bold text-amber-900 mb-4">{productWithDiscount.name}</h1>
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-baseline gap-3">
                    {productWithDiscount.bestDiscount ? (
                      <>
                        <span className="text-4xl font-bold text-red-600">
                          {formatPrice(productWithDiscount.bestDiscount.discountedPrice)}
                        </span>
                        <span className="text-2xl text-gray-500 line-through">
                          {formatPrice(productWithDiscount.price != null ? Number(productWithDiscount.price) : null)}
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(productWithDiscount.price != null ? Number(productWithDiscount.price) : null)}
                      </span>
                    )}
                  </div>
                  {productWithDiscount.bestDiscount && (
                    <div className="inline-flex items-center gap-2">
                      <Badge variant="destructive" className="px-2 py-1 text-sm bg-red-600">
                        -{productWithDiscount.bestDiscount.value}%
                      </Badge>
                      <span className="text-red-600 font-medium">
                        Tiết kiệm {formatPrice(Number(productWithDiscount.price) - productWithDiscount.bestDiscount.discountedPrice)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <Badge
                    variant={productWithDiscount.inStock ? "default" : "destructive"}
                    className={cn(
                      "text-sm font-semibold px-3 py-1",
                      productWithDiscount.inStock && "bg-green-600 hover:bg-green-700",
                    )}
                  >
                    {productWithDiscount.inStock ? "✓ Còn hàng" : "✗ Hết hàng"}
                  </Badge>
                  {productWithDiscount.inStock > 0 && (
                    <span className="text-sm text-gray-600">
                      ({productWithDiscount.inStock} sản phẩm)
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <ProductClientActions product={productWithDiscount} />

              {/* Features */}
              <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl shadow-sm border border-amber-100 p-6 animate-slide-up stagger-2">
                <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  Đặc điểm nổi bật
                </h3>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-gray-800 animate-slide-in-left"
                      style={{ animationDelay: `${0.1 * index}s` }}
                    >
                      <Check className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <span className="text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 animate-slide-up stagger-1">
                <h3 className="text-lg font-semibold text-amber-900 mb-4">Thông tin sản phẩm</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-x-4">
                    <div>
                      <span className="text-gray-600 font-medium">Khối lượng:</span>
                      <p className="text-gray-900">{productWithDiscount.weight ? `${productWithDiscount.weight}g` : "Không xác định"}</p>
                    </div>
                    {keyInfo.find((info) => info?.label === "Hạn sử dụng") && (
                      <div>
                        <span className="text-gray-600 font-medium">Hạn sử dụng:</span>
                        <p className="text-gray-900">{keyInfo.find((info) => info?.label === "Hạn sử dụng")?.value}</p>
                      </div>
                    )}
                  </div>
                  {keyInfo
                    .filter((info) => info?.label !== "Hạn sử dụng")
                    .map((info, index) =>
                      info ? (
                        <div key={index} className="border-t border-gray-100 pt-3">
                          <span className="text-gray-600 font-medium">{info.label}:</span>
                          <p className="text-gray-900">{info.value}</p>
                        </div>
                      ) : null,
                    )}
                </div>
                </div>
            </div>
          </div>

          <div className="mt-16 mx-auto">
            <ProductFAQ productName={productWithDiscount.name} />
          </div>
        </div>
      </main>
    </>
  )
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select(`
      id,
      name,
      benefits,
      ingredients,
      product_images (
        url,
        isMainImage
      )
    `)
    .eq("id", id)
    .single()

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  const mainImage = product.product_images?.find((img) => img.isMainImage)?.url
  const shortDescription = product.benefits || product.ingredients || "Chất lượng từ thiên nhiên"

  return {
    title: `${product.name} - Tây Nguyên Nuts`,
    description: `Khám phá ${product.name} - ${shortDescription}`,
    openGraph: {
      title: product.name,
      description: `Khám phá ${product.name} - ${shortDescription}`,
      images: mainImage ? [{ url: mainImage, alt: product.name }] : [],
    },
  }
}
