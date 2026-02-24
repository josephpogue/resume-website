import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { loadoutSchema } from '@/lib/validations/loadout'
import { deserializeLoadout } from '@/lib/serialize'
import { ZodError } from 'zod'

type Params = { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const row = await prisma.loadout.findUnique({
    where: { id: params.id },
    include: { items: { orderBy: { order: 'asc' } } },
  })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextResponse.json(deserializeLoadout(row as any))
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json()
    const data = loadoutSchema.partial().parse(body)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await (prisma.loadout.update as any)({
      where: { id: params.id },
      data: { ...data, ...(data.exportRules && { exportRules: JSON.stringify(data.exportRules) }) },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(deserializeLoadout(row as any))
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ error: err.message }, { status: 400 })
    throw err
  }
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.loadout.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
