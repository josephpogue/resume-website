import type { TemplateDefinition } from '@/types'

const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'ats-classic',
    name: 'ATS Classic',
    description:
      'Single-column layout rendered with react-pdf. Helvetica only, no backgrounds. Maximum compatibility with applicant tracking systems.',
    engine: 'react-pdf',
    supportsPhoto: false,
    atsScore: 'high',
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    description:
      'Two-column Valorant-themed layout. Sidebar (skills, education, certs) + main column (experience, projects). Supports profile photo.',
    engine: 'puppeteer',
    supportsPhoto: true,
    atsScore: 'low',
  },
]

const registry = new Map<string, TemplateDefinition>(
  TEMPLATES.map(t => [t.id, t])
)

export function getTemplate(id: string): TemplateDefinition {
  const tmpl = registry.get(id)
  if (!tmpl) {
    // Fall back to ATS Classic if unknown templateId (e.g. old loadouts)
    return registry.get('ats-classic')!
  }
  return tmpl
}

export function listTemplates(): TemplateDefinition[] {
  return TEMPLATES
}

export function isValidTemplateId(id: string): boolean {
  return registry.has(id)
}
