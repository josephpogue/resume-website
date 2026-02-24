import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const storedState = req.cookies.get('google_oauth_state')?.value

  const errorUrl = new URL('/admin/import?error=oauth_failed', req.url)

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(errorUrl)
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(errorUrl)
  }

  const { access_token, refresh_token, expires_in } = await tokenRes.json()

  const res = NextResponse.redirect(new URL('/admin/import', req.url))
  res.cookies.delete('google_oauth_state')

  res.cookies.set('google_access_token', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: expires_in ?? 3600,
    path: '/',
  })

  if (refresh_token) {
    res.cookies.set('google_refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
  }

  return res
}
