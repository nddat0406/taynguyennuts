"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, CheckCircle, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export default function VerifyEmailPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState<string>("")

  useEffect(() => {
    const getEmail = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user?.email) {
        setUserEmail(session.user.email)
      }
    }
    getEmail()
  }, [supabase])

  const handleResendEmail = async () => {
    if (!userEmail) return

    setIsResending(true)
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: userEmail,
      })

      if (error) throw error

      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 3000)
    } catch (error) {
      console.error("[v0] Resend email error:", error)
    } finally {
      setIsResending(false)
    }
  }

  const handleVerifyAndContinue = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user?.email_confirmed_at) {
      router.push("/complete-profile")
    } else {
      alert("Vui lòng xác nhận email trước khi tiếp tục")
    }
  }

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
        </div>

        <Card className="border-amber-200 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-amber-700" />
            </div>
            <CardTitle className="text-amber-900">Xác nhận email của bạn</CardTitle>
            <CardDescription>
              Chúng tôi đã gửi một email xác nhận đến <span className="font-medium text-amber-900">{userEmail}</span>.
              Vui lòng kiểm tra hộp thư và nhấp vào liên kết để xác nhận tài khoản.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resendSuccess && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Email xác nhận đã được gửi lại!</span>
              </div>
            )}

            <div className="space-y-3">
              <Button onClick={handleVerifyAndContinue} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                Tôi đã xác nhận email
              </Button>

              <Button
                variant="outline"
                onClick={handleResendEmail}
                disabled={isResending || !userEmail}
                className="w-full border-amber-200 hover:bg-amber-50 bg-transparent"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang gửi lại...
                  </>
                ) : (
                  "Gửi lại email xác nhận"
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600 mt-4">
              <p>Không nhận được email?</p>
              <p className="mt-1">Kiểm tra thư mục spam hoặc thử gửi lại.</p>
            </div>

            <div className="text-center mt-6">
              <Link href="/login" className="text-sm text-amber-700 hover:text-amber-900 hover:underline">
                Quay lại đăng nhập
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
