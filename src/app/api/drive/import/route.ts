import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const EXTRACTION_PROMPT = `Extract all career and resume data from this document. Return ONLY a valid JSON object — no markdown, no explanation.

Schema (only include sections that have data in the document):
{
  "experiences": [{
    "company": "string",
    "role": "string",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM | Present | null",
    "location": "string | null",
    "description": "brief role summary or null",
    "tags": ["relevant skill/domain keywords"],
    "bullets": [{ "text": "achievement statement", "metric": "quantified result or null" }],
    "contextNotes": "2-4 paragraphs of rich private context: day-to-day responsibilities, technical depth, team context, challenges, impact — things that would not fit on a resume but provide important background for AI to generate better bullets later. Write in first person."
  }],
  "education": [{
    "school": "string",
    "degree": "string",
    "field": "string | null",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM | null",
    "gpa": "string | null",
    "honors": "string | null"
  }],
  "skills": [{
    "name": "string",
    "group": "Languages | Tools | Platforms | Frameworks | Certifications",
    "proficiency": 3
  }],
  "certifications": [{
    "name": "string",
    "issuer": "string",
    "date": "YYYY-MM",
    "expires": "YYYY-MM | null",
    "credUrl": "string | null"
  }],
  "leadership": [{
    "org": "string",
    "role": "string",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM | Present | null",
    "bullets": ["achievement statement"],
    "tags": ["keywords"]
  }],
  "projects": [{
    "title": "string",
    "pitch": "1-2 sentence description",
    "casestudy": "longer description | null",
    "githubUrl": "string | null",
    "demoUrl": "string | null",
    "tags": ["keywords"],
    "techStack": ["technology names"],
    "featured": false
  }]
}

For dates, use "YYYY-MM" format. If only a year is given, use "YYYY-01". For "Present" or current roles, use null for endDate.
For skill proficiency: 1=beginner, 2=basic, 3=intermediate, 4=advanced, 5=expert.
Return ONLY the JSON object.`

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get('google_access_token')?.value
  if (!accessToken) {
    return NextResponse.json({ error: 'NOT_CONNECTED' }, { status: 401 })
  }

  const { fileId, mimeType } = await req.json()

  let messageContent: Anthropic.MessageParam['content']

  if (mimeType === 'application/vnd.google-apps.document') {
    const driveRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    if (!driveRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch file from Drive' }, { status: 500 })
    }
    const text = await driveRes.text()
    messageContent = `${EXTRACTION_PROMPT}\n\n---\n\n${text}`
  } else {
    // PDF — download and send as base64 document
    const driveRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    if (!driveRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch file from Drive' }, { status: 500 })
    }
    const buffer = await driveRes.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    messageContent = [
      {
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: base64 },
      } as Anthropic.DocumentBlockParam,
      { type: 'text', text: EXTRACTION_PROMPT },
    ]
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 16384,
    messages: [{ role: 'user', content: messageContent }],
  })

  const rawText = response.content[0].type === 'text' ? response.content[0].text : ''

  // Strip markdown code fences if the model wrapped the output
  const cleaned = rawText.replace(/^```(?:json)?\n?|\n?```$/g, '').trim()

  try {
    return NextResponse.json(JSON.parse(cleaned))
  } catch {
    return NextResponse.json(
      { error: 'Failed to parse AI response', raw: rawText },
      { status: 500 }
    )
  }
}
