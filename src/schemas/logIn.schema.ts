import { z } from 'zod';

// ✅ Zod schema for LogIn form with email and password validation
export const LogInSchema = z.object({
  email: z
    .string()
    .email('Invalid email format. Use a valid email like user@example.com')
    .min(1, 'Your email is required')
    .max(100, 'Email cannot exceed 100 characters'),

  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .refine((val) => val.length <= 60, { message: 'Password is too long.' }), // bcrypt hash length
});

export type LogInSchemaType = z.infer<typeof LogInSchema>;
