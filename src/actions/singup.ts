'use server';

/**
 * Registers a new user with validated data.
 * @param data - User signup data.
 * @returns Success message with email and hashed password, or error message.
 */
import { SignUpSchema } from 'schemas/singUp.schema';
import { SingUp } from 'types/Auth.types';
import { Database } from 'database/database';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from 'utils/findUser';

export const signUp = async (data: SingUp) => {
  const validatedFields = SignUpSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { password, email } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return { error: 'This email is already in use' };
  }

  await Database.user.create({
    data: {
      ...validatedFields.data,
      password: hashedPassword,
    },
  });

  return { success: 'User created', email };
};
