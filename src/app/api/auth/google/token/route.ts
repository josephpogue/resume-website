import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Returns the Google access token to authenticated admin clients.
// Used by the Google Drive Picker (which runs in the browser and needs the token directly).
export async function GET(req: NextRequest) {
  const adminToken = req.cookies.get('admin_token')?.value
  if (!adminToken || !(await verifyToken(adminToken))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accessToken = req.cookies.get('google_access_token')?.value
  if (!accessToken) {
    return NextResponse.json({ error: 'Not connected' }, { status: 401 })
  }

  return NextResponse.json({ accessToken })
}
