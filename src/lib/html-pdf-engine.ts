import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import puppeteer, { type Browser } from 'puppeteer'
import type { ResolvedLoadout, HtmlTemplateProps } from '@/types'
import type { ComponentType } from 'react'
import { siteConfig } from '@/lib/site-config'

// ── Template component registry ───────────────────────────────────────────────
// Add new HTML templates here: import the component and add to the map.
import { ModernDark } from '@/components/resume-templates/ModernDark'

const HTML_TEMPLATE_COMPONENTS: Record<string, ComponentType<HtmlTemplateProps>> = {
  'modern-dark': ModernDark,
}

// ── Browser singleton ─────────────────────────────────────────────────────────
// Reused across requests in the same Node.js process — avoids cold-start overhead.
let browserInstance: Browser | null = null

async function getBrowser(): Promise<Browser> {
  if (browserInstance) {
    try {
      // Check if still connected by calling a lightweight method
      await browserInstance.version()
      return browserInstance
    } catch {
      browserInstance = null
    }
  }
  browserInstance = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
    ],
  })
  return browserInstance
}

// ── HTML string builder ───────────────────────────────────────────────────────

function buildHtmlString(templateId: string, props: HtmlTemplateProps): string {
  const Component = HTML_TEMPLATE_COMPONENTS[templateId]
  if (!Component) throw new Error(`No HTML template component registered for: "${templateId}"`)
  const markup = renderToStaticMarkup(React.createElement(Component, props))
  return `<!DOCTYPE html>${markup}`
}

// ── Overflow detection ────────────────────────────────────────────────────────
// Sets viewport to letter size (8.5in × 11in at 96dpi = 816 × 1056px).
// Reads scrollHeight — if > 1056px the content overflows one page.
// Uses a lightweight page load (no page.pdf()), so this is fast.

const LETTER_HEIGHT_PX = 1056 // 11in × 96dpi

async function detectOverflow(browser: Browser, html: string): Promise<boolean> {
  const page = await browser.newPage()
  try {
    await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 1 })
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 })
    const scrollHeight = await page.evaluate(
      () => document.documentElement.scrollHeight
    )
    return scrollHeight > LETTER_HEIGHT_PX
  } finally {
    await page.close()
  }
}

// ── PDF renderer ──────────────────────────────────────────────────────────────

async function renderHtmlToPdf(browser: Browser, html: string): Promise<Buffer> {
  const page = await browser.newPage()
  try {
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 })
    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    })
    return Buffer.from(pdfBuffer)
  } finally {
    await page.close()
  }
}

// ── One-page enforcement via binary search on fontScale ───────────────────────
// Strategy:
//   1. Try at fontScale = 1.0. If it fits, done.
//   2. Binary search between MIN_FONT_SCALE (0.88) and 1.0 for 8 iterations.
//      Each iteration only calls detectOverflow (cheap). After converging,
//      one final renderHtmlToPdf (expensive) is called.
// Total Puppeteer page opens: 1 probe + 8 binary search + 1 final = 10 max.

const MIN_FONT_SCALE = 0.88
const MAX_FONT_SCALE = 1.0
const BINARY_SEARCH_ITERATIONS = 8

export interface HtmlCompressionState {
  fontScale: number
  canFit: boolean
  iterations: number
}

async function resolveHtmlOnePage(
  browser: Browser,
  templateId: string,
  baseProps: HtmlTemplateProps
): Promise<{ buffer: Buffer; compression: HtmlCompressionState }> {
  // Try at full scale first
  let fontScale = MAX_FONT_SCALE
  let html = buildHtmlString(templateId, { ...baseProps, fontScale })
  const overflowsAtMax = await detectOverflow(browser, html)

  if (!overflowsAtMax) {
    const buffer = await renderHtmlToPdf(browser, html)
    return { buffer, compression: { fontScale, canFit: true, iterations: 1 } }
  }

  // Binary search
  let lo = MIN_FONT_SCALE
  let hi = MAX_FONT_SCALE
  let iterations = 1

  for (let i = 0; i < BINARY_SEARCH_ITERATIONS; i++) {
    iterations++
    fontScale = (lo + hi) / 2
    html = buildHtmlString(templateId, { ...baseProps, fontScale })
    const overflows = await detectOverflow(browser, html)
    if (overflows) {
      hi = fontScale
    } else {
      lo = fontScale
    }
  }

  // lo is the largest scale that fits (or MIN_FONT_SCALE if nothing fits)
  fontScale = lo
  html = buildHtmlString(templateId, { ...baseProps, fontScale })
  const buffer = await renderHtmlToPdf(browser, html)

  return {
    buffer,
    compression: {
      fontScale,
      canFit: lo > MIN_FONT_SCALE || !(await detectOverflow(browser, html)),
      iterations,
    },
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function generateHtmlResumePDF(
  templateId: string,
  loadout: ResolvedLoadout,
  options: { photoUrl?: string } = {}
): Promise<{ buffer: Buffer; compression: HtmlCompressionState }> {
  const props: HtmlTemplateProps = {
    loadout,
    siteConfig: {
      name: siteConfig.name,
      title: siteConfig.title,
      email: siteConfig.email,
      socials: { ...siteConfig.socials },
    },
    photoUrl: options.photoUrl,
  }

  const browser = await getBrowser()
  return resolveHtmlOnePage(browser, templateId, props)
}
