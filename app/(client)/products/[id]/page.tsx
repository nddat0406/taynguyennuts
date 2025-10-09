
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Check } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import { createClient } from "@/utils/supabase/server";
import { formatPrice } from "@/utils/utils";
import { cn } from "@/utils/utils";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { Product, ProductImages } from "@/types";
import { ProductClientActions } from "@/components/product/product-client-actions";

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

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
    .single<Product>();
  if (error || !product) {
    console.error("Error fetching product:", error);
    notFound();
  }

  // Prepare sorted images
  const sortedImages = product.product_images
    ? [...product.product_images].sort(
      (a: ProductImages, b: ProductImages) => (b.isMainImage ? 1 : 0) - (a.isMainImage ? 1 : 0)
    )
    : [];

  // Prepare key information points
  const keyInfo = [
    product.benefits ? { label: "Lợi ích", value: product.benefits } : null,
    product.ingredients ? { label: "Thành phần", value: product.ingredients } : null,
    product.expiration ? { label: "Hạn sử dụng", value: product.expiration } : null,
    product.storage_instructions ? { label: "Bảo quản", value: product.storage_instructions } : null,
  ].filter(Boolean); // Remove null entries

  // Prepare features for highlights
  const features = [
    product.benefits || "100% tự nhiên, không chất bảo quản",
    product.ingredients ? `Thành phần: ${product.ingredients}` : "Chế biến hiện đại",
    product.packaged_at ? "Đóng gói cẩn thận" : "Bảo đảm chất lượng",
    "Giao hàng toàn quốc",
  ].slice(0, 3); // Limit to 3 features for brevity

  return (
    <>
      <Head>
        <meta name="og:type" content="product" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-amber-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-50 nut-pattern" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-20 animate-float" />

        <div className="relative max-w-6xl mx-auto px-4 py-8">
          {/* Back Link */}
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 text-amber-800 hover:text-amber-900 mb-6 transition-all duration-300 hover:gap-3 font-semibold group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            Quay lại sản phẩm
          </Link>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="order-1 lg:order-1">
              <ProductImageGallery images={sortedImages} productName={product.name} />
            </div>

            {/* Product Info */}
            <div className="order-2 lg:order-2 space-y-6">
              {/* Product Name and Price */}
              <div className="animate-slide-up">
                <h1 className="text-4xl font-bold text-amber-900 mb-4">{product.name}</h1>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {formatPrice(product.price != null ? Number(product.price) : null)}
                  </span>
                  <Badge
                    variant={product.inStock ? "default" : "destructive"}
                    className={cn(
                      "text-sm font-semibold px-4 py-1",
                      product.inStock && "bg-green-500 hover:bg-green-600"
                    )}
                  >
                    {product.inStock ? "✓ Còn hàng" : "✗ Hết hàng"}
                  </Badge>
                </div>
              </div>

              {/* Key Information */}
              <div className="p-4 bg-amber-50 rounded-xl shadow-md border border-amber-200 animate-slide-up stagger-1">
                <h3 className="text-lg font-semibold text-amber-900 mb-3">Thông tin chính</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600 font-medium">Khối lượng:</span>
                    <p className="text-gray-900">{product.weight ? `${product.weight}g` : "Không xác định"}</p>
                  </div>
                  {keyInfo.map((info, index) =>
                    info ? (
                      <div key={index}>
                        <span className="text-gray-600 font-medium">{info.label}:</span>
                        <p className="text-gray-900">{info.value}</p>
                      </div>
                    ) : null
                  )}
                </div>
              </div>

              {/* Actions */}
              <ProductClientActions product={product} />

              {/* Features */}
              <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-50 rounded-xl shadow-md border border-amber-200 animate-slide-up stagger-2">
                <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  Đặc điểm nổi bật
                </h3>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-gray-800 animate-slide-in-left"
                      style={{ animationDelay: `${0.1 * index}s` }}
                    >
                      <Check className="w-4 h-4 text-amber-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Additional Info (if available) */}
              {(product.manufactured_at || product.packaged_at || product.usage_instructions) && (
                <div className="p-4 bg-amber-50 rounded-xl shadow-md border border-amber-200 animate-slide-up stagger-3">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">Thông tin bổ sung</h3>
                  <div className="space-y-2">
                    {product.manufactured_at && (
                      <div>
                        <span className="text-gray-600 font-medium">Ngày sản xuất:</span>
                        <p className="text-gray-900">{product.manufactured_at}</p>
                      </div>
                    )}
                    {product.packaged_at && (
                      <div>
                        <span className="text-gray-600 font-medium">Ngày đóng gói:</span>
                        <p className="text-gray-900">{product.packaged_at}</p>
                      </div>
                    )}
                    {product.usage_instructions && (
                      <div>
                        <span className="text-gray-600 font-medium">Hướng dẫn sử dụng:</span>
                        <p className="text-gray-900">{product.usage_instructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

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
    .single();

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const mainImage = product.product_images?.find((img) => img.isMainImage)?.url;
  const shortDescription = product.benefits || product.ingredients || "Chất lượng từ thiên nhiên";

  return {
    title: `${product.name} - Tây Nguyên Nuts`,
    description: `Khám phá ${product.name} - ${shortDescription}`,
    openGraph: {
      title: product.name,
      description: `Khám phá ${product.name} - ${shortDescription}`,
      images: mainImage ? [{ url: mainImage, alt: product.name }] : [],
    },
  };
}