"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, User, Phone, MapPin } from "lucide-react"
import { updateProfile } from "@/app/(client)/(auth)/action/auth"

export function CompleteProfileForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
  })
  const [errors, setErrors] = useState<{
    full_name?: string
    phone?: string
  }>({})

  const validateForm = () => {
    const newErrors: {
      full_name?: string
      phone?: string
    } = {}

    if (!formData.full_name) {
      newErrors.full_name = "Tên là bắt buộc"
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = "Tên phải có ít nhất 2 ký tự"
    }

    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const result = await updateProfile({
        full_name: formData.full_name,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
      })

      if (result?.error) {
        setErrors({ full_name: result.error })
        setIsLoading(false)
      }
      // Server action will redirect on success
    } catch (error: any) {
      setErrors({ full_name: "Cập nhật thông tin thất bại. Vui lòng thử lại." })
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    router.push("/")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-amber-900">
          Họ và tên <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="full_name"
            type="text"
            placeholder="Nguyễn Văn A"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className={`pl-10 ${errors.full_name ? "border-red-500" : "border-amber-200 focus:border-amber-500"}`}
          />
        </div>
        {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-amber-900">
          Số điện thoại
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="phone"
            type="tel"
            placeholder="0123456789"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`pl-10 ${errors.phone ? "border-red-500" : "border-amber-200 focus:border-amber-500"}`}
          />
        </div>
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-amber-900">
          Địa chỉ
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="address"
            type="text"
            placeholder="123 Đường ABC"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="pl-10 border-amber-200 focus:border-amber-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city" className="text-amber-900">
          Thành phố
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="city"
            type="text"
            placeholder="Hồ Chí Minh"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="pl-10 border-amber-200 focus:border-amber-500"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleSkip}
          className="flex-1 border-amber-200 hover:bg-amber-50 bg-transparent"
        >
          Bỏ qua
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : (
            "Hoàn tất"
          )}
        </Button>
      </div>
    </form>
  )
}
