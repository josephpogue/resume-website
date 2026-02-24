import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { projectSchema } from '@/lib/validations/project'
import { deserializeProject } from '@/lib/serialize'
import { stringifyArray } from '@/lib/utils'
import { ZodError } from 'zod'

export async function GET() {
  const rows = await prisma.project.findMany({ orderBy: { order: 'asc' } })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextResponse.json(rows.map((r: any) => deserializeProject(r)))
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = projectSchema.parse(body)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = await (prisma.project.create as any)({
      data: {
        ...data,
        tags: stringifyArray(data.tags),
        techStack: stringifyArray(data.techStack),
      },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(deserializeProject(row as any), { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) return NextResponse.json({ error: err.message }, { status: 400 })
    throw err
  }
}
