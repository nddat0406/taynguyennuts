"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  ward?: string
  notes?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("[v0] Error parsing stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const userData: User = {
          email,
          name: email.split("@")[0],
        }
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
        resolve()
      }, 1500)
    })
  }

  const signup = async (name: string, email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const userData: User = {
          name,
          email,
        }
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
        resolve()
      }, 1500)
    })
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
