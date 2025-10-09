"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, User, Phone, MapPin } from "lucide-react"
import { updateProfile, skipProfileCompletion } from "@/app/(client)/(auth)/action/auth"
import { useToast } from "@/hooks/use-toast"
import { Profile } from "@/types"
import AddressInput from "../ui/address-input"
export function CompleteProfileForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [isSkipping, setIsSkipping] = useState(false)

  const [formData, setFormData] = useState<Profile>({
    fullname: "",
    phone: "",
    address: "",
    province: "",
    ward: "",
    updated_at: null,
  })
  const [errors, setErrors] = useState<{
    fullname?: string
    phone?: string
  }>({})
  const handleLocationChange = (field: string, value: string) => {
    if (field === "province") {
      setFormData((prev) => ({ ...prev, province: value, ward: "" }))
    } else if (field === "ward") {
      setFormData((prev) => ({ ...prev, ward: value }))
    }
  }
  const validateForm = () => {
    const newErrors: {
      fullname?: string
      phone?: string
    } = {}

    if (!formData.fullname) {
      newErrors.fullname = "Tên là bắt buộc"
    } else if (formData.fullname.length < 2) {
      newErrors.fullname = "Tên phải có ít nhất 2 ký tự"
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
      const result = await updateProfile(formData)

      if (result?.error) {
        toast({
          title: "Lỗi",
          description: result.error,
        })
        setIsLoading(false)
      } else {
        toast({
          title: "Thành công",
          description: "Hồ sơ của bạn đã được hoàn thiện!",
        })
        router.push("/")
      }
      // Server action will redirect on success
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Cập nhật thông tin thất bại. Vui lòng thử lại.",
      })
      setIsLoading(false)
    }
  }

  const handleSkip = async () => {
    setIsSkipping(true)
    try {
      await skipProfileCompletion()
      toast({
        title: "Đã bỏ qua",
        description: "Bạn có thể hoàn thiện hồ sơ sau trong trang cá nhân.",
      })
      // Server action will redirect
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Có lỗi xảy ra. Vui lòng thử lại.",
      })
      setIsSkipping(false)
    }
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
            value={formData.fullname ?? ""}
            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
            className={`pl-10 ${errors.fullname ? "border-red-500" : "border-amber-200 focus:border-amber-500"}`}
          />
        </div>
        {errors.fullname && <p className="text-sm text-red-500">{errors.fullname}</p>}
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
            value={formData.phone ?? ""}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`pl-10 ${errors.phone ? "border-red-500" : "border-amber-200 focus:border-amber-500"}`}
          />
        </div>
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>
      <div className="space-y-2">
        <div className="relative">
          <AddressInput
            onLocationChange={handleLocationChange}
            location={{
              province: formData.province ?? undefined,
              ward: formData.ward ?? undefined
            }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address" className="text-amber-900">
          Địa chỉ cụ thể
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="address"
            type="text"
            placeholder="123 Đường ABC"
            value={formData.address ?? ""}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
