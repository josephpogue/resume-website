import { z } from 'zod'

export const projectSchema = z.object({
  title:     z.string().min(1),
  slug:      z.string().min(1).regex(/^[a-z0-9-]+$/, 'Lowercase, numbers, and hyphens only'),
  pitch:     z.string().min(1),
  casestudy: z.string().nullable().optional(),
  githubUrl: z.string().url().nullable().optional().or(z.literal('')),
  demoUrl:   z.string().url().nullable().optional().or(z.literal('')),
  tags:      z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  featured:  z.boolean().default(false),
  order:     z.number().int().default(0),
})

export type ProjectInput = z.infer<typeof projectSchema>
