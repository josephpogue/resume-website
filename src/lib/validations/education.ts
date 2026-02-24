import { z } from 'zod'

export const educationSchema = z.object({
  school:    z.string().min(1),
  degree:    z.string().min(1),
  field:     z.string().nullable().optional(),
  startDate: z.string().regex(/^\d{4}(-\d{2})?$/),
  endDate:   z.string().regex(/^\d{4}(-\d{2})?$/).nullable().optional(),
  gpa:       z.string().nullable().optional(),
  honors:    z.string().nullable().optional(),
  order:     z.number().int().default(0),
})

export type EducationInput = z.infer<typeof educationSchema>
