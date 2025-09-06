import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  let user = null
  try {
    const { data, error } = (await Promise.race([
      supabase.auth.getUser(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Auth timeout")), 5000)),
    ])) as any

    if (error) {
      console.log("[v0] Auth error:", error.message)
    } else {
      user = data?.user
    }
  } catch (error) {
    console.log("[v0] Auth check failed:", error)
    // Continue without user if auth check fails
  }

  const publicPaths = [
    "/",
    "/marketplace",
    "/quizzes",
    "/projects",
    "/leaderboard",
    "/profile",
    "/about",
    "/auth/login",
    "/auth/signup",
    "/auth/signup-success",
    "/auth/error",
  ]

  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + "/"),
  )

  if (!user && !isPublicPath && !request.nextUrl.pathname.startsWith("/auth")) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirectTo", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
