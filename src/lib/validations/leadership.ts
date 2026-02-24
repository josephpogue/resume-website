import { z } from 'zod'

export const leadershipSchema = z.object({
  org:       z.string().min(1),
  role:      z.string().min(1),
  startDate: z.string().regex(/^\d{4}(-\d{2})?$/),
  endDate:   z.string().regex(/^\d{4}(-\d{2})?$/).nullable().optional(),
  bullets:   z.array(z.string()).default([]),
  tags:      z.array(z.string()).default([]),
  order:     z.number().int().default(0),
})

export type LeadershipInput = z.infer<typeof leadershipSchema>
