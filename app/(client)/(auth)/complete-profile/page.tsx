"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CompleteProfileForm } from "@/components/auth/complete-profile-form"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { use, useEffect } from "react"

export default function CompleteProfilePage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const status = searchParams.get("status")

    if (status === "new_google_user") {
      toast({
        title: "Chào mừng bạn!",
        description: "Vui lòng hoàn thiện thông tin cá nhân để tiếp tục.",
      })
    } else if (status === "incomplete_profile") {
      toast({
        title: "Đăng nhập thành công!",
        description: "Vui lòng hoàn thiện thông tin cá nhân của bạn.",
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
          <h1 className="text-3xl font-bold text-amber-900 mt-4">Hoàn thiện hồ sơ</h1>
          <p className="text-gray-600 mt-2">Điền thông tin để hoàn tất đăng ký</p>
        </div>

        <Card className="border-amber-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-amber-900">Thông tin cá nhân</CardTitle>
            <CardDescription>Vui lòng cung cấp thông tin của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <CompleteProfileForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
