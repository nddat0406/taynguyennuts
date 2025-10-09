"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export function OrderSuccessToast() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const status = searchParams.get("status")

    if (status === "google_login_success") {
      toast({
        title: "Đăng nhập thành công!",
        description: "Chào mừng bạn quay trở lại.",
      })
    } else if (searchParams.get("order") === "success") {
      toast({
        title: "Cảm ơn bạn đã đặt hàng!",
        description: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.",
      })
    }
  }, [searchParams, toast])

  return null
}
