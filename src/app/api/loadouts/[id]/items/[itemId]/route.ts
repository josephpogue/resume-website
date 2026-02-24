import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z, ZodError } from 'zod'

type Params = { params: { id: string; itemId: string } }

const updateSchema = z.object({
  pinned:            z.boolean().optional(),
  bulletCapOverride: z.number().int().nullable().optional(),
  order:             z.number().int().optional(),
})

export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json()
    const data = updateSchema.parse(body)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item = await (prisma.loadoutItem.update as any)({ where: { id: params.itemId }, data })
    return NextResponse.json(item)
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ error: err.message }, { status: 400 })
    throw err
  }
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.loadoutItem.delete({ where: { id: params.itemId } })
  return NextResponse.json({ ok: true })
}
