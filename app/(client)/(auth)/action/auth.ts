"use server"

import { Profile } from "@/types"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signup(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, data }
}

export async function login(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Check if email is verified
  if (data.user && !data.user.email_confirmed_at) {
    await supabase.auth.signOut()
    return {
      error: "Vui lòng xác nhận email của bạn trước khi đăng nhập. Kiểm tra hộp thư đến của bạn.",
      needsVerification: true,
    }
  }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function logout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function signupWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function updateProfile(profileData: Profile) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Không tìm thấy người dùng" }
  }

  const { error } = await supabase.from("profiles").update({
    id: user.id,
    ...profileData,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  revalidatePath("/profile")
  redirect("/")
}

export async function skipProfileCompletion() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Không tìm thấy người dùng" }
  }

  // Create an empty profile entry to mark that user has been prompted
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function checkProfileComplete() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { isComplete: false, hasProfile: false }
  }

  const { data: profile } = await supabase.from("profiles").select("fullname, phone").eq("id", user.id).single()

  if (!profile) {
    return { isComplete: false, hasProfile: false }
  }

  // Profile is complete if user has at least a name
  const isComplete = !!profile.fullname

  return { isComplete, hasProfile: true }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Không tìm thấy người dùng" }
  }

  // Verify current password by attempting to sign in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  })

  if (verifyError) {
    return { error: "Mật khẩu hiện tại không đúng" }
  }

  // Update password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
