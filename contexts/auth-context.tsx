"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client"
import { User } from "@/types"

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  authLoading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()


  const loadUserProfile = async (authUser: SupabaseUser) => {
    setSupabaseUser(authUser)
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single()

    if (profile) {
      setUser({ id: authUser.id, email: authUser.email!, profile: { ...profile } })
    } else {
      setUser({ id: authUser.id, email: authUser.email! })
    }
  }

  const refreshUser = async () => {
    setAuthLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setUser(null)
        setSupabaseUser(null)
      }
    } finally {
      setAuthLoading(false)
    }
  }

  useEffect(() => {
    const loadUser = async () => {
      setAuthLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          await loadUserProfile(session.user)
        } else {
          setUser(null)
          setSupabaseUser(null)
        }
      } finally {
        setAuthLoading(false)
      }
    }

    loadUser()

const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setAuthLoading(true)
      if (session?.user) {
        // fire and forget — no await here
        loadUserProfile(session.user)
          .catch((err) => console.error("Error in auth state change:", err))
          .finally(() => setAuthLoading(false))
      } else {
        setUser(null)
        setSupabaseUser(null)
        setAuthLoading(false)
      }
    }
  )


    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        authLoading,
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
