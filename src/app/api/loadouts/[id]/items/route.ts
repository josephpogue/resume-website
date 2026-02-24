import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { loadoutItemSchema } from '@/lib/validations/loadout'
import { ZodError, z } from 'zod'

type Params = { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const items = await prisma.loadoutItem.findMany({
    where: { loadoutId: params.id },
    orderBy: { order: 'asc' },
  })
  return NextResponse.json(items)
}

export async function POST(req: Request, { params }: Params) {
  try {
    const body = await req.json()
    const data = loadoutItemSchema.parse(body)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item = await (prisma.loadoutItem.create as any)({
      data: { ...data, loadoutId: params.id },
    })
    return NextResponse.json(item, { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ error: err.message }, { status: 400 })
    throw err
  }
}

// Batch reorder: PUT body = [{ id, order }]
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const updates = z.array(z.object({ id: z.string(), order: z.number().int() })).parse(body)
    await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updates.map(({ id, order }) => (prisma.loadoutItem.update as any)({ where: { id }, data: { order } }))
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ error: err.message }, { status: 400 })
    throw err
  }
}
