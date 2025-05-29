import { z } from 'zod';

export const DefaultPaginationQuery = z.object({
  skip: z.coerce.number().int().min(0),
  limit: z.coerce.number().int().positive().min(5).max(50),
  orderBy: z.enum(['-createdAt', '+createdAt']).default('-createdAt'),
});

export type DefaultPaginationQuery = z.infer<typeof DefaultPaginationQuery>;

export const NonEmptyString = z
  .string()
  .trim()
  .min(1, 'Please enter a valid value');
export type NonEmptyString = z.infer<typeof NonEmptyString>;
