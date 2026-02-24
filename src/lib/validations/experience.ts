import { z } from 'zod'

export const experienceSchema = z.object({
  company:     z.string().min(1),
  role:        z.string().min(1),
  startDate:   z.string().regex(/^\d{4}(-\d{2})?$/, 'Use YYYY or YYYY-MM'),
  endDate:     z.string().regex(/^\d{4}(-\d{2})?$/).nullable().optional(),
  location:    z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  tags:        z.array(z.string()).default([]),
  order:       z.number().int().default(0),
})

export const bulletSchema = z.object({
  text:          z.string().min(1),
  tags:          z.array(z.string()).default([]),
  impactScore:   z.number().int().min(1).max(10).default(5),
  relevanceScore: z.number().int().min(1).max(10).default(5),
  metric:        z.string().nullable().optional(),
  order:         z.number().int().default(0),
})

export type ExperienceInput = z.infer<typeof experienceSchema>
export type BulletInput = z.infer<typeof bulletSchema>
