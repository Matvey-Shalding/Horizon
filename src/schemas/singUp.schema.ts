import { z } from 'zod';

// ✅ Zod schema for SignUp form
export const SignUpSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Your first name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .nonempty('Your first name is required'),

  lastName: z
    .string()
    .min(2, 'Your last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .nonempty('Your last name is required'),

  address: z
    .string()
    .min(6, 'Address must be at least 6 characters')
    .max(100, 'Address cannot exceed 100 characters')
    .nonempty('Address is required'),

  state: z
    .string()
    .min(2, 'Your state must be at least 2 characters')
    .max(50, 'State cannot exceed 50 characters')
    .nonempty('Your state is required'),

  postalCode: z
    .string()
    .min(2, 'Your postal code must be at least 2 characters')
    .max(15, 'Postal code cannot exceed 15 characters')
    .nonempty('Your postal code is required'),

  dateOfBirth: z
    .string()
    .regex(
      /^(19[0-9]{2}|20[0-2][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
      'Invalid birthdate format. Use YYYY-MM-DD'
    )
    .nonempty('Your date of birth is required'),

  SSN: z
    .string()
    .min(2, 'Your SSN must be at least 2 characters')
    .max(15, 'SSN cannot exceed 15 characters')
    .nonempty('Your SSN is required'),

  email: z
    .string()
    .email('Invalid email format. Use a valid email like user@example.com')
    .nonempty('Your email is required'),

  password: z
    .string()
    .min(8, 'Your password must be at least 8 characters')
    .max(15, 'Password cannot exceed 15 characters')
    .nonempty('Your password is required'),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;