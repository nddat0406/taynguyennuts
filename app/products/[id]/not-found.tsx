import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-amber-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-600 max-w-md">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link href="/#products">
          <Button className="bg-amber-800 hover:bg-amber-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại sản phẩm
          </Button>
        </Link>
      </div>
    </main>
  )
}
