import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

export function ClientMiddleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  // Define protected routes
  const protectedPaths = ['/dashboard', '/task']
  
  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // If it's a protected route and no token exists
  if (isProtectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    try {
      // Verify token is valid by attempting to decode it
      jwtDecode(token)
    } catch {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/task/:path*'
  ]
}