import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // Handle cookie setting errors in middleware
            }
          },
        },
      },
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        console.log("[v0] User ID:", user.id)
        console.log("[v0] User email:", user.email)

        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        // Determine if this is a new signup or existing login
        const isNewUser = !profile
        const hasCompletedProfile = profile?.fullname && profile.fullname.trim() !== ""

        // Set appropriate redirect with status message
        if (isNewUser) {
          // New user signing up with Google - redirect to profile completion
          return NextResponse.redirect(`${origin}/complete-profile?status=new_google_user`)
        } else if (!hasCompletedProfile) {
          // Existing user but profile not complete - redirect to profile completion
          return NextResponse.redirect(`${origin}/complete-profile?status=incomplete_profile`)
        } else {
          // Existing user with complete profile - redirect to home with success message
          return NextResponse.redirect(`${origin}/?status=google_login_success`)
        }
      }

      return NextResponse.redirect(`${origin}/`)
    }
  }

  // Return to signup if something went wrong
  return NextResponse.redirect(`${origin}/signup?status=auth_error`)
}
