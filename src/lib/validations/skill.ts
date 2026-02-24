import { z } from 'zod'

export const skillSchema = z.object({
  name:        z.string().min(1),
  group:       z.string().min(1),
  proficiency: z.number().int().min(1).max(5).default(3),
  tags:        z.array(z.string()).default([]),
  order:       z.number().int().default(0),
})

export type SkillInput = z.infer<typeof skillSchema>
