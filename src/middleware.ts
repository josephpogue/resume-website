import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/archive/:path*',
    '/api/loadouts/:path*',
    '/api/pdf/:path*',
    '/api/uploads/:path*',
  ],
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const isLoginPage = pathname === '/admin/login'
  const token = req.cookies.get('admin_token')?.value

  if (!token || !(await verifyToken(token))) {
    if (isLoginPage) return NextResponse.next()
    // API routes return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // Already logged in, redirect away from login page
  if (isLoginPage) {
    return NextResponse.redirect(new URL('/admin/archive', req.url))
  }

  return NextResponse.next()
}
