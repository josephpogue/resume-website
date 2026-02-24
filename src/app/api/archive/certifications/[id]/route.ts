import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { certificationSchema } from '@/lib/validations/certification'
import { ZodError } from 'zod'

type Params = { params: { id: string } }

export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json()
    const data = certificationSchema.partial().parse(body)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await (prisma.certification.update as any)({ where: { id: params.id }, data })
    return NextResponse.json(row)
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ error: err.message }, { status: 400 })
    throw err
  }
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.certification.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
