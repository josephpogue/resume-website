import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('google_access_token')?.value

  if (!accessToken) {
    return NextResponse.json({ error: 'NOT_CONNECTED' }, { status: 401 })
  }

  const query =
    "(mimeType='application/vnd.google-apps.document' or mimeType='application/pdf') and trashed=false"

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,modifiedTime)&orderBy=modifiedTime%20desc&pageSize=50`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  if (res.status === 401) {
    return NextResponse.json({ error: 'NOT_CONNECTED' }, { status: 401 })
  }

  if (!res.ok) {
    return NextResponse.json({ error: 'Drive API error' }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json(data.files ?? [])
}
