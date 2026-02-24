import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import { ResumePDF } from '@/components/pdf/ResumePDF'
import type { ResolvedLoadout, CompressionState, ExportRules } from '@/types'

// Detect page count by scanning PDF bytes for the Pages Count entry
function getPDFPageCount(buffer: Buffer): number {
  const text = buffer.toString('latin1')
  // PDF page tree: /Count <N>
  const match = text.match(/\/Count\s+(\d+)/)
  return match ? parseInt(match[1], 10) : 1
}

function isOnePage(buffer: Buffer): boolean {
  return getPDFPageCount(buffer) === 1
}

async function renderOnce(loadout: ResolvedLoadout, state: CompressionState): Promise<Buffer> {
  const element = React.createElement(ResumePDF, {
    loadout,
    fontScale: state.fontScale,
    lineHeightScale: state.lineHeightScale,
    bulletCapsPerRole: state.bulletCapsPerRole,
    projectCount: state.projectCount,
    projectsCompact: state.projectsCompact,
    showLeadership: state.showLeadership,
    showAdditional: state.showAdditional,
    recruiterMode: false,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(element as any)
  return Buffer.from(buffer)
}

function initBulletCaps(
  loadout: ResolvedLoadout,
  maxPerRole: number
): Record<string, number> {
  const caps: Record<string, number> = {}
  for (const exp of loadout.experiences) {
    const cap = exp.loadoutItem.bulletCapOverride ?? maxPerRole
    caps[exp.id] = Math.min(cap, exp.bullets.length)
  }
  return caps
}

function canReduceBullets(state: CompressionState, minBullets: number): boolean {
  return Object.values(state.bulletCapsPerRole).some(n => n > minBullets)
}

function reduceLeastImpactfulBullet(
  state: CompressionState,
  loadout: ResolvedLoadout
): CompressionState {
  // Find the experience with the most bullets above min, reduce by 1
  // Prefer unpinned experiences, prefer lower impactScore bullets being removed
  const newCaps = { ...state.bulletCapsPerRole }
  let bestExpId: string | null = null
  let lowestImpact = Infinity

  for (const exp of loadout.experiences) {
    if (exp.loadoutItem.pinned) continue
    const current = newCaps[exp.id] ?? 1
    if (current <= 1) continue
    // The bullet being removed is the last visible one
    const removedBullet = exp.bullets[current - 1]
    const impact = removedBullet?.impactScore ?? 5
    if (impact < lowestImpact) {
      lowestImpact = impact
      bestExpId = exp.id
    }
  }

  if (bestExpId) {
    newCaps[bestExpId] = (newCaps[bestExpId] ?? 1) - 1
  }

  return {
    ...state,
    bulletCapsPerRole: newCaps,
    leversApplied: [
      ...state.leversApplied,
      `Reduced bullets for experience`,
    ],
  }
}

export async function resolveOnePage(
  loadout: ResolvedLoadout,
  rules: ExportRules
): Promise<CompressionState> {
  let state: CompressionState = {
    bulletCapsPerRole:  initBulletCaps(loadout, rules.maxBulletsPerRole),
    projectCount:       Math.min(loadout.projects.length, rules.maxProjects),
    projectsCompact:    false,
    showAdditional:     true,
    showLeadership:     true,
    lineHeightScale:    1.0,
    fontScale:          1.0,
    canFit:             false,
    leversApplied:      [],
    flaggedRemovals:    [],
  }

  // ── Lever 1: Reduce bullets (up to 10 rounds) ──────────────────────────
  for (let attempt = 0; attempt < 15; attempt++) {
    const buf = await renderOnce(loadout, state)
    if (isOnePage(buf)) {
      state.canFit = true
      return state
    }
    if (canReduceBullets(state, rules.minBullets)) {
      state = reduceLeastImpactfulBullet(state, loadout)
    } else {
      break
    }
  }

  // ── Lever 2a: Switch to compact project format ──────────────────────────
  if (!state.projectsCompact) {
    state = { ...state, projectsCompact: true, leversApplied: [...state.leversApplied, 'Compact project format'] }
    const buf = await renderOnce(loadout, state)
    if (isOnePage(buf)) { state.canFit = true; return state }
  }

  // ── Lever 2b: Reduce project count ─────────────────────────────────────
  while (state.projectCount > 1) {
    state = { ...state, projectCount: state.projectCount - 1, leversApplied: [...state.leversApplied, `Reduced projects to ${state.projectCount - 1}`] }
    const buf = await renderOnce(loadout, state)
    if (isOnePage(buf)) { state.canFit = true; return state }
  }

  // ── Lever 3: Collapse leadership ──────────────────────────────────────
  if (state.showLeadership && loadout.leadership.length > 0) {
    state = { ...state, showLeadership: false, leversApplied: [...state.leversApplied, 'Removed leadership section'] }
    const buf = await renderOnce(loadout, state)
    if (isOnePage(buf)) { state.canFit = true; return state }
  }

  // ── Lever 4: Tighten line height ───────────────────────────────────────
  const [minLH] = rules.lineHeightRange
  for (let lh = 0.98; lh >= minLH; lh = Math.round((lh - 0.02) * 100) / 100) {
    state = { ...state, lineHeightScale: lh, leversApplied: [...state.leversApplied, `lineHeight → ${lh}`] }
    const buf = await renderOnce(loadout, state)
    if (isOnePage(buf)) { state.canFit = true; return state }
  }

  // ── Lever 5: Reduce font scale ─────────────────────────────────────────
  const [minFS] = rules.fontScaleRange
  for (let fs = 0.98; fs >= minFS; fs = Math.round((fs - 0.02) * 100) / 100) {
    state = { ...state, fontScale: fs, leversApplied: [...state.leversApplied, `fontSize → ${fs}`] }
    const buf = await renderOnce(loadout, state)
    if (isOnePage(buf)) { state.canFit = true; return state }
  }

  // ── Cannot fit ─────────────────────────────────────────────────────────
  state.canFit = false
  state.flaggedRemovals = [
    'Content still overflows after all compression levers applied.',
    'Consider reducing experiences, bullets, or sections in the Loadout Builder.',
  ]
  return state
}

export async function generateResumePDF(
  loadout: ResolvedLoadout
): Promise<{ buffer: Buffer; compression: CompressionState }> {
  const rules = loadout.loadout.exportRules
  const compression = await resolveOnePage(loadout, rules)
  const buffer = await renderOnce(loadout, compression)
  return { buffer, compression }
}
