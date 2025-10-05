import { notFound } from "next/navigation"
import { formatPrice } from "@/lib/products"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { createClient } from "@/lib/supabase/server"
import { ProductImages } from "@/types"
import { ProductClientActions } from "@/components/product-client-actions"
import Head from "next/head"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      price,
      inStock,
      weight,
      product_images (
        url,
        isMainImage
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !product) {
    console.error("Error fetching product:", error)
    notFound()
  }

  const mainImage =
    product.product_images?.find((img: ProductImages) => img.isMainImage)?.url ||
    product.product_images?.[0]?.url ||
    "/placeholder.svg?height=400&width=400"

  return (
    <>
      <Head>
        <meta name="og:type" content="product" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Navigation */}
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 text-amber-800 hover:text-amber-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại sản phẩm
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
                <img src={mainImage || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                {/* <Badge variant="secondary" className="mb-3">
                  {product.category === "nuts" && "Hạt dinh dưỡng"}
                  {product.category === "coffee" && "Cà phê"}
                  {product.category === "dried-fruits" && "Trái cây sấy"}
                  {product.category === "specialties" && "Đặc sản"}
                </Badge> */}
                <h1 className="text-4xl font-bold text-amber-900 mb-4 text-balance">{product.name}</h1>
                <p className="text-xl text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Product Info */}
              <div className="space-y-4 p-6 bg-white rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Giá:</span>
                  <span className="text-3xl font-bold text-orange-600">{formatPrice(product.price)}</span>
                </div>
                {product.weight && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Khối lượng:</span>
                    <span className="font-semibold">{product.weight}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tình trạng:</span>
                  <Badge variant={product.inStock ? "default" : "destructive"}>
                    {product.inStock ? "Còn hàng" : "Hết hàng"}
                  </Badge>
                </div>
              </div>

              <ProductClientActions product={product} />

              {/* Product Features */}
              <div className="space-y-4 p-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                <h3 className="text-xl font-bold text-amber-900">Đặc điểm nổi bật</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                    100% tự nhiên, không chất bảo quản
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                    Chế biến theo công nghệ hiện đại
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                    Đóng gói kín, bảo quản tốt
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                    Giao hàng toàn quốc
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export async function generateMetadata({ params }: ProductPageProps) {
  const supabase = await createClient()

  const { data: product } = await supabase.from("products").select("id, name, description").eq("id", params.id).single()

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product.name} - Tây Nguyên Nuts`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
    },
  }
}
