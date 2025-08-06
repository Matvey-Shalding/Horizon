import type { User } from '@prisma/client';
import { Database } from 'database/database';

/**
 * Finds a user by email.
 *
 * @param {string} email - Email to search for.
 * @returns {Promise<User | null>} The user if found, otherwise null.
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    return await Database.user.findUnique({
      where: { email },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error finding user by email:', error);
    }
    return null;
  }
};
