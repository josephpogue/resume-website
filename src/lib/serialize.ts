import { parseJsonArray, stringifyArray } from '@/lib/utils'
import type {
  Experience, Bullet, Project, Skill, Leadership, Loadout
} from '@/types'

// Raw DB row types (arrays stored as JSON strings)
type RawExperience = Omit<Experience, 'tags' | 'bullets'> & { tags: string; bullets?: RawBullet[] }
type RawBullet = Omit<Bullet, 'tags'> & { tags: string }
type RawProject = Omit<Project, 'tags' | 'techStack'> & { tags: string; techStack: string }
type RawSkill = Omit<Skill, 'tags'> & { tags: string }
type RawLeadership = Omit<Leadership, 'bullets' | 'tags'> & { bullets: string; tags: string }
type RawLoadout = Omit<Loadout, 'exportRules'> & { exportRules: string }

export function deserializeExperience(raw: RawExperience): Experience {
  return {
    ...raw,
    tags: parseJsonArray(raw.tags),
    createdAt: (raw.createdAt as unknown) instanceof Date ? (raw.createdAt as unknown as Date).toISOString() : raw.createdAt,
    updatedAt: (raw.updatedAt as unknown) instanceof Date ? (raw.updatedAt as unknown as Date).toISOString() : raw.updatedAt,
    bullets: raw.bullets?.map(deserializeBullet),
  }
}

export function serializeExperience(data: Partial<Experience> & { tags?: string[] }) {
  const { tags, ...rest } = data
  return { ...rest, ...(tags !== undefined && { tags: stringifyArray(tags) }) }
}

export function deserializeBullet(raw: RawBullet): Bullet {
  return { ...raw, tags: parseJsonArray(raw.tags) }
}

export function serializeBullet(data: Partial<Bullet> & { tags?: string[] }) {
  const { tags, ...rest } = data
  return { ...rest, ...(tags !== undefined && { tags: stringifyArray(tags) }) }
}

export function deserializeProject(raw: RawProject): Project {
  return {
    ...raw,
    tags: parseJsonArray(raw.tags),
    techStack: parseJsonArray(raw.techStack),
    createdAt: (raw.createdAt as unknown) instanceof Date ? (raw.createdAt as unknown as Date).toISOString() : raw.createdAt,
    updatedAt: (raw.updatedAt as unknown) instanceof Date ? (raw.updatedAt as unknown as Date).toISOString() : raw.updatedAt,
  }
}

export function serializeProject(data: Partial<Project> & { tags?: string[]; techStack?: string[] }) {
  const { tags, techStack, ...rest } = data
  return {
    ...rest,
    ...(tags !== undefined && { tags: stringifyArray(tags) }),
    ...(techStack !== undefined && { techStack: stringifyArray(techStack) }),
  }
}

export function deserializeSkill(raw: RawSkill): Skill {
  return { ...raw, tags: parseJsonArray(raw.tags) }
}

export function serializeSkill(data: Partial<Skill> & { tags?: string[] }) {
  const { tags, ...rest } = data
  return { ...rest, ...(tags !== undefined && { tags: stringifyArray(tags) }) }
}

export function deserializeLeadership(raw: RawLeadership): Leadership {
  return {
    ...raw,
    bullets: parseJsonArray(raw.bullets),
    tags: parseJsonArray(raw.tags),
  }
}

export function serializeLeadership(data: Partial<Leadership> & { bullets?: string[]; tags?: string[] }) {
  const { bullets, tags, ...rest } = data
  return {
    ...rest,
    ...(bullets !== undefined && { bullets: stringifyArray(bullets) }),
    ...(tags !== undefined && { tags: stringifyArray(tags) }),
  }
}

export function deserializeLoadout(raw: RawLoadout): Loadout {
  return {
    ...raw,
    exportRules: typeof raw.exportRules === 'string' ? JSON.parse(raw.exportRules) : raw.exportRules,
    createdAt: (raw.createdAt as unknown) instanceof Date ? (raw.createdAt as unknown as Date).toISOString() : raw.createdAt,
    updatedAt: (raw.updatedAt as unknown) instanceof Date ? (raw.updatedAt as unknown as Date).toISOString() : raw.updatedAt,
  }
}
