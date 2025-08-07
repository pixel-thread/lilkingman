import { z } from 'zod';
export const authSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  otp: z
    .string()
    .min(6, { message: 'Please enter a valid OTP.' })
    .max(6, { message: 'Please enter a valid OTP.' })
    .optional(),
});
