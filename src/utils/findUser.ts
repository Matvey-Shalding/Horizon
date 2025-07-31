import { Database } from 'database/database';
import type { User } from '@prisma/client';

/**
 * Finds a user by email.
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

/**
 * Finds a user by id.
 * @param {string} id - User id to search for.
 * @returns {Promise<User | null>} The user if found, otherwise null.
 */
export const findUserById = async (id: string): Promise<User | null> => {
  try {
    return await Database.user.findUnique({
      where: { id },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error finding user by id:', error);
    }
    return null;
  }
};
