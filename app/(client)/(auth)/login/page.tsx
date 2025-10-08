import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">TN</span>
            </div>
            <span className="font-bold text-2xl text-amber-900">Tây Nguyên Nuts</span>
          </Link>
          <h1 className="text-3xl font-bold text-amber-900 mt-4">Đăng nhập</h1>
          <p className="text-gray-600 mt-2">Chào mừng bạn trở lại!</p>
        </div>

        <Card className="border-amber-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-amber-900">Đăng nhập tài khoản</CardTitle>
            <CardDescription>Nhập thông tin đăng nhập của bạn để tiếp tục</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link href="/signup" className="text-amber-700 hover:text-amber-900 font-medium hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
