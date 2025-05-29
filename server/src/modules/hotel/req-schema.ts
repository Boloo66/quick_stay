import { z } from 'zod';
import { NonEmptyString } from '../../shared/req-schema';

export const SignUpBody = z.object({
  name: NonEmptyString,
  images: z.array(NonEmptyString).min(1, 'At least one image is required'),
});
export type SignUpBody = z.infer<typeof SignUpBody>;
