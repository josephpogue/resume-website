import { z } from 'zod'

export const certificationSchema = z.object({
  name:    z.string().min(1),
  issuer:  z.string().min(1),
  date:    z.string().regex(/^\d{4}(-\d{2})?$/),
  expires: z.string().regex(/^\d{4}(-\d{2})?$/).nullable().optional(),
  credUrl: z.string().url().nullable().optional().or(z.literal('')),
  order:   z.number().int().default(0),
})

export type CertificationInput = z.infer<typeof certificationSchema>
