import { NextResponse } from 'next/server'
import { listTemplates } from '@/lib/template-registry'

export async function GET() {
  return NextResponse.json(listTemplates())
}
