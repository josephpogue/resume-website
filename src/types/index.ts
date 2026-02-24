// ─── Archive Entity Types ──────────────────────────────────────────────────

export interface Bullet {
  id: string
  experienceId: string
  text: string
  tags: string[]
  impactScore: number
  relevanceScore: number
  metric: string | null
  order: number
}

export interface Experience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string | null
  location: string | null
  description: string | null
  tags: string[]
  order: number
  createdAt: string
  updatedAt: string
  bullets?: Bullet[]
}

export interface Project {
  id: string
  title: string
  slug: string
  pitch: string
  casestudy: string | null
  githubUrl: string | null
  demoUrl: string | null
  tags: string[]
  techStack: string[]
  featured: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface Skill {
  id: string
  name: string
  group: string
  proficiency: number
  tags: string[]
  order: number
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string | null
  startDate: string
  endDate: string | null
  gpa: string | null
  honors: string | null
  order: number
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expires: string | null
  credUrl: string | null
  order: number
}

export interface Leadership {
  id: string
  org: string
  role: string
  startDate: string
  endDate: string | null
  bullets: string[]
  tags: string[]
  order: number
}

// ─── Loadout Types ──────────────────────────────────────────────────────────

export type EntityType =
  | 'experience'
  | 'project'
  | 'skill'
  | 'education'
  | 'certification'
  | 'leadership'

export interface LoadoutItem {
  id: string
  loadoutId: string
  entityType: EntityType
  entityId: string
  order: number
  pinned: boolean
  bulletCapOverride: number | null
}

export interface ExportRules {
  minBullets: number
  maxBulletsPerRole: number
  maxProjects: number
  fontScaleRange: [number, number]
  lineHeightRange: [number, number]
}

export interface Loadout {
  id: string
  name: string
  slug: string
  isDefault: boolean
  templateId: string
  exportRules: ExportRules
  createdAt: string
  updatedAt: string
  items?: LoadoutItem[]
}

// ─── Resolved Loadout (built by loadout-resolver.ts) ───────────────────────

export interface ResolvedExperience extends Experience {
  bullets: Bullet[]
  loadoutItem: LoadoutItem
}

export interface ResolvedProject extends Project {
  loadoutItem: LoadoutItem
}

export interface SkillGroup {
  group: string
  skills: Skill[]
}

export interface ResolvedLoadout {
  loadout: Loadout
  experiences: ResolvedExperience[]
  projects: ResolvedProject[]
  skillGroups: SkillGroup[]
  education: Education[]
  certifications: Certification[]
  leadership: Leadership[]
}

// ─── Template System ────────────────────────────────────────────────────────

export type TemplateEngine = 'react-pdf' | 'puppeteer'

export interface TemplateDefinition {
  id: string
  name: string
  description: string
  engine: TemplateEngine
  supportsPhoto: boolean
  atsScore: 'high' | 'medium' | 'low'
}

export interface HtmlTemplateProps {
  loadout: ResolvedLoadout
  siteConfig: {
    name: string
    title: string
    email: string
    socials: Record<string, string>
  }
  photoUrl?: string
  fontScale?: number
}

// ─── PDF Compression ────────────────────────────────────────────────────────

export interface CompressionState {
  bulletCapsPerRole: Record<string, number>
  projectCount: number
  projectsCompact: boolean
  showAdditional: boolean
  showLeadership: boolean
  lineHeightScale: number
  fontScale: number
  canFit: boolean
  leversApplied: string[]
  flaggedRemovals: string[]
}
