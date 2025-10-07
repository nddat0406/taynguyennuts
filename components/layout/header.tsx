"use client"

import Link from "next/link"
import Image from "next/image"
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

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const navigation = [
    { name: "Trang chủ", href: "/" },
    { name: "Sản phẩm", href: "/products" },
    { name: "Tra cứu đơn hàng", href: "/order-tracking" },
    { name: "Về chúng tôi", href: "/#story" },
    { name: "Liên hệ", href: "/#contact" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center">
              <Image src="/logo.jpg" alt="Tây Nguyên Nuts Logo" width={98} height={98} className="object-contain" />
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
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 hover:bg-amber-50">
                      <Avatar className="w-8 h-8 border-2 border-amber-200">
                        <AvatarFallback className="bg-amber-600 text-white text-sm font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-amber-900">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="text-amber-900">Tài khoản của tôi</DropdownMenuLabel>
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
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" asChild className="text-amber-900 hover:bg-amber-50">
                    <Link href="/login">Đăng nhập</Link>
                  </Button>
                  <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Link href="/signup">Đăng ký</Link>
                  </Button>
                </>
              )}
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
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 bg-amber-50 rounded-md">
                      <Avatar className="w-10 h-10 border-2 border-amber-200">
                        <AvatarFallback className="bg-amber-600 text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-amber-900">{user.name}</p>
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
                      className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </Button>
                  </>
                ) : (
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
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
