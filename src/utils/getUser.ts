'use server';

import { findUserByEmail } from 'utils/findUser';
import { auth } from '../../auth';
import type { User } from '@prisma/client';

/**
 * Retrieves the currently authenticated user based on session email.
 *
 * @returns {Promise<User | null | undefined>} The user if found, otherwise undefined.
 */
export async function getUser(): Promise<User | null | undefined> {
  const session = await auth();

  const email = session?.user?.email;

  const user = email ? await findUserByEmail(email) : undefined;

  return user;
}
