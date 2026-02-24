import { NextResponse } from 'next/server'
import { resolveLoadout } from '@/lib/loadout-resolver'
import { generateResumePDF } from '@/lib/pdf-engine'
import { generateHtmlResumePDF } from '@/lib/html-pdf-engine'
import { getTemplate } from '@/lib/template-registry'

export const maxDuration = 60

type Params = { params: { loadoutId: string } }

export async function GET(req: Request, { params }: Params) {
  const resolved = await resolveLoadout(params.loadoutId)
  if (!resolved) {
    return NextResponse.json({ error: 'Loadout not found' }, { status: 404 })
  }

  const templateId = resolved.loadout.templateId ?? 'ats-classic'
  const template = getTemplate(templateId)
  const filename = `${resolved.loadout.slug}-${templateId}-resume.pdf`

  if (template.engine === 'react-pdf') {
    const { buffer, compression } = await generateResumePDF(resolved)
    const headers: Record<string, string> = {
      'Content-Type':        'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'X-Compression-Log':   compression.leversApplied.join('; '),
    }
    if (!compression.canFit) {
      headers['X-PDF-Warning'] = 'Content may not fit on one page'
    }
    return new Response(buffer as unknown as BodyInit, { headers })
  }

  if (template.engine === 'puppeteer') {
    // Optional photo URL from query param: ?photo=/uploads/xxx.jpg
    const { searchParams } = new URL(req.url)
    const photoParam = searchParams.get('photo')
    // Convert relative path to absolute URL for Puppeteer (it needs a full URL or base64)
    const photoUrl = photoParam
      ? new URL(photoParam, new URL(req.url).origin).toString()
      : undefined

    const { buffer, compression } = await generateHtmlResumePDF(templateId, resolved, { photoUrl })
    const headers: Record<string, string> = {
      'Content-Type':        'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'X-Font-Scale':        compression.fontScale.toFixed(4),
      'X-Iterations':        String(compression.iterations),
    }
    if (!compression.canFit) {
      headers['X-PDF-Warning'] = 'Content may not fit on one page after maximum compression'
    }
    return new Response(buffer as unknown as BodyInit, { headers })
  }

  return NextResponse.json({ error: 'Unknown template engine' }, { status: 500 })
}
