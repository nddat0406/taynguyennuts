"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { GoogleSignupButton } from "@/components/auth/google-signup-button"

export default function LoginPage() {
    const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const status = searchParams.get("status")

    if (status === "auth_error") {
      toast({
        variant: "destructive",
        title: "Lỗi xác thực",
        description: "Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.",
      })
    } else if (status === "existing_user") {
      toast({
        title: "Chào mừng trở lại!",
        description: "Bạn đã đăng nhập thành công với tài khoản Google.",
      })
    }
  }, [searchParams, toast])

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
