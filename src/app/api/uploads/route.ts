import { NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: `File type not allowed. Accepted: jpeg, png, webp` },
      { status: 400 }
    )
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: `File exceeds 5MB limit` },
      { status: 400 }
    )
  }

  // Generate a safe, unique filename
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadsDir, { recursive: true })

  const bytes = await file.arrayBuffer()
  await writeFile(path.join(uploadsDir, safeName), Buffer.from(bytes))

  return NextResponse.json({ url: `/uploads/${safeName}`, name: safeName }, { status: 201 })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')

  // Prevent path traversal
  if (!name || name.includes('/') || name.includes('..') || name.includes('\\')) {
    return NextResponse.json({ error: 'Invalid file name' }, { status: 400 })
  }

  const filePath = path.join(process.cwd(), 'public', 'uploads', name)
  try {
    await unlink(filePath)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
