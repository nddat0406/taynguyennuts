"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Eye, EyeOff, Loader2, Lock, Mail, User, Save, LogOut, MapPin, Phone } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { changePassword, logout, updateProfile } from "../action/auth"
import AddressInput from "@/components/ui/address-input"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading: authLoading, refreshUser } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Profile form state
  const [profileData, setProfileData] = useState({
    fullname: "",
    phone: "",
    address: "",
    province: "",
    ward: "",
  })
  const [profileErrors, setProfileErrors] = useState<{
    fullname?: string
    phone?: string
    address?: string
    province?: string
    ward?: string
  }>({})

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
  }>({})

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      setProfileData({
        fullname: user.profile?.fullname || "",
        phone: user.profile?.phone || "",
        address: user.profile?.address || "",
        province: user.profile?.province || "",
        ward: user.profile?.ward || "",
      })
    }
  }, [user, authLoading, router])

  const validateProfileForm = () => {
    const newErrors: { fullname?: string; phone?: string; address?: string; province?: string; ward?: string } = {}

    if (!profileData.fullname) {
      newErrors.fullname = "Tên là bắt buộc"
    } else if (profileData.fullname.length < 2) {
      newErrors.fullname = "Tên phải có ít nhất 2 ký tự"
    }

    if (profileData.phone && !/^[0-9]{10,11}$/.test(profileData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ"
    }

    setProfileErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = () => {
    const newErrors: {
      currentPassword?: string
      newPassword?: string
      confirmPassword?: string
    } = {}

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Mật khẩu hiện tại là bắt buộc"
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "Mật khẩu mới là bắt buộc"
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự"
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc"
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp"
    }

    setPasswordErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateProfileForm()) return

    setIsLoading(true)

    try {
      const result = await updateProfile(profileData)

      if (result?.error) {
        toast({
          title: "Lỗi",
          description: result.error,
          variant: "destructive",
        })
      } else {
        await refreshUser()
        toast({
          title: "Thành công",
          description: "Cập nhật thông tin thành công!",
        })
      }
    } catch (error) {
      console.error("[v0] Profile update error:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật thông tin",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePasswordForm()) return

    setIsLoading(true)

    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword)

      if (result?.error) {
        toast({
          title: "Lỗi",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        toast({
          title: "Thành công",
          description: "Đổi mật khẩu thành công!",
        })
      }
    } catch (error) {
      console.error("[v0] Password change error:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi đổi mật khẩu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  const handleLocationChange = (field: string, value: string) => {
    if (field === "province") {
      setProfileData((prev) => ({ ...prev, city: value, ward: "" }))
    } else if (field === "ward") {
      setProfileData((prev) => ({ ...prev, ward: value }))
    }
  }

  const getUserDisplayName = () => {
    if (!user) return ""
    return user.profile?.fullname || user.email?.split("@")[0] || "User"
  }

  const getUserInitials = () => {
    if (!user) return "U"
    if (user.profile?.fullname) {
      const names = user.profile.fullname.split(" ")
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      }
      return user.profile.fullname[0].toUpperCase()
    }
    return user.email?.[0].toUpperCase() || "U"
  }

  if (authLoading || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="border-amber-200 shadow-xl mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-amber-200">
                <AvatarFallback className="bg-amber-600 text-white text-3xl font-bold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-amber-900">{getUserDisplayName()}</h1>
                <p className="text-gray-600 mt-1">{user.email}</p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-amber-300 text-amber-900 hover:bg-amber-50 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-amber-200">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
            >
              Thông tin cá nhân
            </TabsTrigger>
            <TabsTrigger
              value="delivery"
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
            >
              Địa chỉ giao hàng
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
            >
              Đổi mật khẩu
            </TabsTrigger>
          </TabsList>

          {/* Profile Information Tab */}
          <TabsContent value="profile">
            <Card className="border-amber-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-amber-900">Thông tin cá nhân</CardTitle>
                <CardDescription>Cập nhật thông tin tài khoản của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name" className="text-amber-900">
                      Họ và tên
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="profile-name"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={profileData.fullname}
                        onChange={(e) => setProfileData({ ...profileData, fullname: e.target.value })}
                        className={`pl-10 ${profileErrors.fullname ? "border-red-500" : "border-amber-200 focus:border-amber-500"}`}
                      />
                    </div>
                    {profileErrors.fullname && <p className="text-sm text-red-500">{profileErrors.fullname}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-email" className="text-amber-900">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="profile-email"
                        type="email"
                        value={user.email}
                        disabled
                        className="pl-10 border-amber-200 bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Email không thể thay đổi</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-phone" className="text-amber-900">
                      Số điện thoại
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="profile-phone"
                        type="tel"
                        placeholder="0123456789"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className={`pl-10 ${profileErrors.phone ? "border-red-500" : "border-amber-200 focus:border-amber-500"}`}
                      />
                    </div>
                    {profileErrors.phone && <p className="text-sm text-red-500">{profileErrors.phone}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Information Tab */}
          <TabsContent value="delivery">
            <Card className="border-amber-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-amber-900">Địa chỉ giao hàng</CardTitle>
                <CardDescription>Cập nhật địa chỉ giao hàng mặc định của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="delivery-address" className="text-amber-900">
                      Địa chỉ cụ thể
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="delivery-address"
                        type="text"
                        placeholder="Số nhà, tên đường"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        className="pl-10 border-amber-200 focus:border-amber-500"
                      />
                    </div>
                    {profileErrors.address && <p className="text-sm text-red-500">{profileErrors.address}</p>}
                  </div>

                  <AddressInput
                    onLocationChange={handleLocationChange}
                    location={{ province: profileData.province, ward: profileData.ward }}
                  />

                  

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Lưu địa chỉ
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Change Password Tab */}
          <TabsContent value="password">
            <Card className="border-amber-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-amber-900">Đổi mật khẩu</CardTitle>
                <CardDescription>Cập nhật mật khẩu để bảo mật tài khoản</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-amber-900">
                      Mật khẩu hiện tại
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className={`pl-10 pr-10 ${passwordErrors.currentPassword ? "border-red-500" : "border-amber-200 focus:border-amber-500"}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-amber-900">
                      Mật khẩu mới
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className={`pl-10 pr-10 ${passwordErrors.newPassword ? "border-red-500" : "border-amber-200 focus:border-amber-500"}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-amber-900">
                      Xác nhận mật khẩu mới
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className={`pl-10 pr-10 ${passwordErrors.confirmPassword ? "border-red-500" : "border-amber-200 focus:border-amber-500"}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang cập nhật...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Đổi mật khẩu
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
