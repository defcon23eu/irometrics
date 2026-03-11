import { z } from 'zod';

// Block A: Sociodemographic validation
const blockASchema = z.object({
  a1_sector: z.string().min(1, 'Selecciona un sector'),
  a2_size: z.number().int().min(1).max(9),
  a3_role: z.string().min(1, 'Selecciona un rol'),
  a4_tenure_months: z.number().int().min(3).max(600),
  a5_age: z.number().int().min(18).max(75),
});

// Block B: IRO Likert 1-7
const likert7 = z.number().int().min(1).max(7);
const blockBSchema = z.object({
  b1: likert7, b2: likert7, b3: likert7, b4: likert7,
  b5: likert7, b6: likert7, b7: likert7, b8: likert7,
  b9: likert7, b10: likert7, b11: likert7, b12: likert7,
});

// Block C: MBI-GS scale 0-6
const mbiScale = z.number().int().min(0).max(6);
const blockCSchema = z.object({
  c1: mbiScale, c2: mbiScale, c3: mbiScale, c4: mbiScale,
  c5: mbiScale, c6: mbiScale, c7: mbiScale, c8: mbiScale,
  c9: mbiScale, c10: mbiScale, c11: mbiScale, c12: mbiScale,
  c13: mbiScale, c14: mbiScale, c15: mbiScale, c16: mbiScale,
});

// Block D: Oreg RTC Likert 1-6
const likert6 = z.number().int().min(1).max(6);
const blockDSchema = z.object({
  d1: likert6, d2: likert6, d3: likert6, d4: likert6,
  d5: likert6, d6: likert6, d7: likert6, d8: likert6,
  d9: likert6, d10: likert6, d11: likert6, d12: likert6,
  d13: likert6, d14: likert6, d15: likert6, d16: likert6,
  d17: likert6,
});

// Full survey submission schema
export const surveySubmissionSchema = z.object({
  session_id: z.string().uuid(),
  consent_at: z.string().datetime(),
  started_at: z.string().datetime(),
  completed_at: z.string().datetime(),
  duration_seconds: z.number().int().positive(),
}).merge(blockASchema)
  .merge(blockBSchema)
  .merge(blockCSchema)
  .merge(blockDSchema);

export type SurveySubmission = z.infer<typeof surveySubmissionSchema>;

export { blockASchema, blockBSchema, blockCSchema, blockDSchema };
