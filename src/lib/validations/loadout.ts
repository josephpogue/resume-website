import { z } from 'zod'

export const exportRulesSchema = z.object({
  minBullets:        z.number().int().min(0).default(1),
  maxBulletsPerRole: z.number().int().min(1).default(5),
  maxProjects:       z.number().int().min(1).default(5),
  fontScaleRange:    z.tuple([z.number(), z.number()]).default([0.92, 1.0]),
  lineHeightRange:   z.tuple([z.number(), z.number()]).default([0.92, 1.0]),
})

export const loadoutSchema = z.object({
  name:        z.string().min(1),
  slug:        z.string().min(1).regex(/^[a-z0-9-]+$/),
  isDefault:   z.boolean().default(false),
  templateId:  z.string().default('ats-classic'),
  exportRules: exportRulesSchema.default({
    minBullets: 1,
    maxBulletsPerRole: 5,
    maxProjects: 5,
    fontScaleRange: [0.92, 1.0],
    lineHeightRange: [0.92, 1.0],
  }),
})

export const loadoutItemSchema = z.object({
  entityType:       z.enum(['experience', 'project', 'skill', 'education', 'certification', 'leadership']),
  entityId:         z.string().min(1),
  order:            z.number().int().default(0),
  pinned:           z.boolean().default(false),
  bulletCapOverride: z.number().int().nullable().optional(),
})

export type LoadoutInput = z.infer<typeof loadoutSchema>
export type LoadoutItemInput = z.infer<typeof loadoutItemSchema>
