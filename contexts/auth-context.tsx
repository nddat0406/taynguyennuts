"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client"
import { User } from "@/types"

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  isLoading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const loadUserProfile = async (authUser: SupabaseUser) => {
    setSupabaseUser(authUser)
    
    // Fetch profile data from profiles table
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

    if (profile) {
      setUser({
        id: authUser.id,
        email: authUser.email!,
        profile: { ...profile },
      })
    } else {
      // User exists but no profile yet
      setUser({
        id: authUser.id,
        email: authUser.email!,
      })
    }
  }

  const refreshUser = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (authUser) {
      await loadUserProfile(authUser)
    }
  }

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (authUser) {
        await loadUserProfile(authUser)
      }
      setIsLoading(false)
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
        setUser(null)
        setSupabaseUser(null)
      }

      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        isLoading,
        refreshUser,
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
