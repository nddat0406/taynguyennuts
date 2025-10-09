"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { checkProfileComplete } from "@/app/(client)/(auth)/action/auth"
import { useAuth } from "@/contexts/auth-context"

export function ProfileCompletionBanner() {
  const { user, authLoading } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const checkProfile = async () => {
    const dismissed = localStorage.getItem("profile-banner-dismissed")
    if (dismissed === "true") {
      setIsDismissed(true)
      setIsVisible(false)
      return
    }

    const { isComplete, hasProfile } = await checkProfileComplete()

    if (hasProfile && !isComplete) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  useEffect(() => {
    // Only check when user exists and auth loading finished
    if (!authLoading && user) {
      checkProfile()
    }
    // If user logs out, hide the banner
    if (!authLoading && !user) {
      setIsVisible(false)
    }
  }, [user, authLoading]) // 👈 re-run whenever user state changes

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem("profile-banner-dismissed", "true")
  }

  if (!isVisible || isDismissed) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-900">
              <span className="font-medium">Hoàn thiện hồ sơ của bạn</span> để có trải nghiệm mua sắm tốt hơn và thanh
              toán nhanh chóng.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-sm h-8">
              <Link href="/complete-profile">Hoàn thiện ngay</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-8 w-8 text-amber-600 hover:text-amber-900 hover:bg-amber-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
