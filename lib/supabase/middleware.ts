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
    }
  )

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Only redirect if there's no valid session
    if (!session) {
      // Redirect unauthenticated users trying to access dashboard or admin
      if (
        request.nextUrl.pathname.startsWith("/dashboard") ||
        request.nextUrl.pathname.startsWith("/admin")
      ) {
        const url = request.nextUrl.clone()
        url.pathname = "/login"
        return NextResponse.redirect(url)
      }
    } else {
      // Redirect authenticated users away from auth pages
      if (
        request.nextUrl.pathname.startsWith("/login") ||
        request.nextUrl.pathname.startsWith("/register")
      ) {
        const url = request.nextUrl.clone()
        url.pathname = "/dashboard"
        return NextResponse.redirect(url)
      }
    }
  } catch (error) {
    console.error('[v0] Middleware: Auth check failed:', error)
    // If auth fails and trying to access protected routes, redirect to login
    if (
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/admin")
    ) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
