import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Middleware: Missing Supabase environment variables")
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
      auth: {
        detectSessionInUrl: false,
        persistSession: true,
        autoRefreshToken: true,
        flowType: 'pkce',
      },
    }
  )

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    const isProtectedRoute = 
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/admin")

    const isAuthRoute = 
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname.startsWith("/register")

    if (isProtectedRoute) {
      console.log('[v0] Middleware: Protected route access', {
        path: request.nextUrl.pathname,
        hasUser: !!user,
        authError: authError?.message
      })
    }

    if (!user && isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set('redirectTo', request.nextUrl.pathname)
      console.log('[v0] Middleware: Redirecting to login from', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    if (user && isAuthRoute) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      console.log('[v0] Middleware: Redirecting authenticated user to dashboard')
      return NextResponse.redirect(url)
    }
  } catch (error: any) {
    console.error("[v0] Middleware: Auth error:", error?.message || error)
    if (
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/admin")
    ) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set('error', 'auth_failed')
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
