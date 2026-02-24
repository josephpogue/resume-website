import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { loadoutSchema } from '@/lib/validations/loadout'
import { deserializeLoadout } from '@/lib/serialize'
import { ZodError } from 'zod'

export async function GET() {
  const rows = await prisma.loadout.findMany({ orderBy: { createdAt: 'asc' } })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextResponse.json(rows.map((r: any) => deserializeLoadout(r)))
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = loadoutSchema.parse(body)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await (prisma.loadout.create as any)({
      data: { ...data, exportRules: JSON.stringify(data.exportRules) },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(deserializeLoadout(row as any), { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ error: err.message }, { status: 400 })
    throw err
  }
}
