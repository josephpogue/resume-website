import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { educationSchema } from '@/lib/validations/education'
import { ZodError } from 'zod'

export async function GET() {
  const rows = await prisma.education.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = educationSchema.parse(body)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await (prisma.education.create as any)({ data })
    return NextResponse.json(row, { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ error: err.message }, { status: 400 })
    throw err
  }
}
