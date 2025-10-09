"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { Menu, X, User, LogOut, UserCircle, Package } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { logout } from "@/app/(client)/(auth)/action/auth"
import { useRouter } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, authLoading, refreshUser } = useAuth()
  const router = useRouter()


  const navigation = [
    { name: "Trang chủ", href: "/" },
    { name: "Sản phẩm", href: "/products" },
    { name: "Tra cứu đơn hàng", href: "/order-tracking" },
    { name: "Về chúng tôi", href: "/about" },
    { name: "Liên hệ", href: "/contact" },
  ]

  const handleLogout = async () => {
  try {
    const result = await logout()
    if (result?.error) {
      console.error(result.error)
      return
    }
    await refreshUser()   //  directly refresh AuthContext
    localStorage.removeItem("profile-banner-dismissed") // Clear profile-banner-dismissed from localStorage
    router.push("/")       //  then redirect manually
  } catch (error) {
    console.error("[v0] Logout error:", error)
  }
}


  const getUserDisplayName = () => {
    if (!user) return ""
    return user.profile?.fullname || user.email?.split("@")[0] || "User"
  }

  const getUserInitials = () => {
    if (!user) {
      console.debug("getUserInitials: no user")
      return "U"
    }
    if (user.profile?.fullname) {
      console.debug("getUserInitials: fullname =", user.profile.fullname)
      const names = user.profile.fullname.split(" ")
      if (names.length >= 2) {
        const initials = `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        console.debug("getUserInitials: initials =", initials)
        return initials
      }
      const initial = user.profile.fullname[0].toUpperCase()
      console.debug("getUserInitials: single initial =", initial)
      return initial
    }
    const emailInitial = user.email?.[0].toUpperCase() || "U"
    console.debug("getUserInitials: email initial =", emailInitial)
    return emailInitial
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <img src="/logo.jpg" alt="Tây Nguyên Nuts" className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-amber-900">Tây Nguyên Nuts</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-amber-800 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <CartDrawer />

            {/* Auth UI - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {!authLoading && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 hover:bg-amber-50">
                      <Avatar className="w-8 h-8 border-2 border-amber-200">
                        <AvatarFallback className="bg-amber-600 text-white text-sm font-bold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-amber-900">{getUserDisplayName()}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="text-amber-900">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{getUserDisplayName()}</p>
                        <p className="text-xs text-gray-500 font-normal">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <UserCircle className="w-4 h-4 mr-2" />
                        Thông tin cá nhân
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer">
                        <Package className="w-4 h-4 mr-2" />
                        Lịch sử đơn hàng
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : !authLoading ? (
                <>
                  <Button variant="ghost" asChild className="text-amber-900 hover:bg-amber-50">
                    <Link href="/login">Đăng nhập</Link>
                  </Button>
                  <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Link href="/signup">Đăng ký</Link>
                  </Button>
                </>
              ) : null}
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-amber-100 py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-amber-800 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-amber-100 space-y-2">
                {!authLoading && user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 bg-amber-50 rounded-md">
                      <Avatar className="w-10 h-10 border-2 border-amber-200">
                        <AvatarFallback className="bg-amber-600 text-white font-bold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-amber-900">{getUserDisplayName()}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full justify-start border-amber-200 text-amber-900 hover:bg-amber-50 bg-transparent"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/profile">
                        <UserCircle className="w-4 h-4 mr-2" />
                        Thông tin cá nhân
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full justify-start border-amber-200 text-amber-900 hover:bg-amber-50 bg-transparent"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/orders">
                        <Package className="w-4 h-4 mr-2" />
                        Lịch sử đơn hàng
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </Button>
                  </>
                ) : !authLoading ? (
                  <>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full border-amber-200 text-amber-900 hover:bg-amber-50 bg-transparent"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/login">
                        <User className="w-4 h-4 mr-2" />
                        Đăng nhập
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/signup">Đăng ký</Link>
                    </Button>
                  </>
                ) : null}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
