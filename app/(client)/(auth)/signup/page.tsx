import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SignupForm } from "@/components/auth/signup-form"
import { GoogleSignupButton } from "@/components/auth/google-signup-button"

export default function SignupPage() {
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
          <h1 className="text-3xl font-bold text-amber-900 mt-4">Đăng ký</h1>
          <p className="text-gray-600 mt-2">Tạo tài khoản mới để bắt đầu</p>
        </div>

        <Card className="border-amber-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-amber-900">Tạo tài khoản</CardTitle>
            <CardDescription>Điền thông tin của bạn để đăng ký</CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            <GoogleSignupButton />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link href="/login" className="text-amber-700 hover:text-amber-900 font-medium hover:underline">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
