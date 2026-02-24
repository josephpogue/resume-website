import { prisma } from '@/lib/prisma'
import {
  deserializeExperience, deserializeBullet, deserializeProject,
  deserializeSkill, deserializeLeadership, deserializeLoadout
} from '@/lib/serialize'
import type {
  ResolvedLoadout, ResolvedExperience, ResolvedProject,
  SkillGroup, Loadout, LoadoutItem
} from '@/types'

export async function resolveLoadout(loadoutIdOrSlug: string): Promise<ResolvedLoadout | null> {
  // Try by ID first, then by slug
  const raw = await prisma.loadout.findFirst({
    where: { OR: [{ id: loadoutIdOrSlug }, { slug: loadoutIdOrSlug }] },
    include: { items: { orderBy: { order: 'asc' } } },
  })
  if (!raw) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadout = deserializeLoadout(raw as any) as Loadout & { items: LoadoutItem[] }
  const items = raw.items as LoadoutItem[]

  // Group items by type
  const byType = {
    experience:    items.filter(i => i.entityType === 'experience'),
    project:       items.filter(i => i.entityType === 'project'),
    skill:         items.filter(i => i.entityType === 'skill'),
    education:     items.filter(i => i.entityType === 'education'),
    certification: items.filter(i => i.entityType === 'certification'),
    leadership:    items.filter(i => i.entityType === 'leadership'),
  }

  // Resolve experiences with bullets
  const experiences: ResolvedExperience[] = []
  for (const item of byType.experience) {
    const exp = await prisma.experience.findUnique({
      where: { id: item.entityId },
      include: { bullets: { orderBy: { order: 'asc' } } },
    })
    if (!exp) continue
    experiences.push({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...deserializeExperience(exp as any),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bullets: exp.bullets.map((b: any) => deserializeBullet(b)),
      loadoutItem: item,
    })
  }

  // Resolve projects
  const projects: ResolvedProject[] = []
  for (const item of byType.project) {
    const proj = await prisma.project.findUnique({ where: { id: item.entityId } })
    if (!proj) continue
    projects.push({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...deserializeProject(proj as any),
      loadoutItem: item,
    })
  }

  // Resolve skills grouped
  const skillMap = new Map<string, SkillGroup>()
  for (const item of byType.skill) {
    const skill = await prisma.skill.findUnique({ where: { id: item.entityId } })
    if (!skill) continue
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deserialized = deserializeSkill(skill as any)
    if (!skillMap.has(deserialized.group)) {
      skillMap.set(deserialized.group, { group: deserialized.group, skills: [] })
    }
    skillMap.get(deserialized.group)!.skills.push(deserialized)
  }
  const skillGroups = Array.from(skillMap.values())

  // Resolve education
  const education = []
  for (const item of byType.education) {
    const edu = await prisma.education.findUnique({ where: { id: item.entityId } })
    if (edu) education.push(edu)
  }

  // Resolve certifications
  const certifications = []
  for (const item of byType.certification) {
    const cert = await prisma.certification.findUnique({ where: { id: item.entityId } })
    if (cert) certifications.push(cert)
  }

  // Resolve leadership
  const leadership = []
  for (const item of byType.leadership) {
    const lead = await prisma.leadership.findUnique({ where: { id: item.entityId } })
    if (!lead) continue
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    leadership.push(deserializeLeadership(lead as any))
  }

  return {
    loadout,
    experiences,
    projects,
    skillGroups,
    education,
    certifications,
    leadership,
  }
}

// Quick list of loadouts for the public selector (no full resolution)
export async function listLoadouts() {
  const rows = await prisma.loadout.findMany({ orderBy: { createdAt: 'asc' } })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rows.map((r: any) => deserializeLoadout(r))
}
