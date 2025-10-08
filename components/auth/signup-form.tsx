"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"
import { signup } from "@/app/(client)/(auth)/action/auth"

export function SignupForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const validateForm = () => {
    const newErrors: {
      email?: string
      password?: string
    } = {}

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc"
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const result = await signup(formData.email, formData.password)

      if (result.error) {
        setErrors({
          email: result.error,
        })
      } else {
        // Redirect to verify email page
        router.push("/verify-email")
      }
    } catch (error: any) {
      setErrors({
        email: "Đăng ký thất bại. Vui lòng thử lại.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-amber-900">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`pl-10 ${errors.email ? "border-red-500" : "border-amber-200 focus:border-amber-500"}`}
          />
        </div>
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-amber-900">
          Mật khẩu
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={`pl-10 pr-10 ${errors.password ? "border-red-500" : "border-amber-200 focus:border-amber-500"}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Đang đăng ký...
          </>
        ) : (
          "Đăng ký"
        )}
      </Button>
    </form>
  )
}
