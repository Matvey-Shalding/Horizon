import NextAuth from 'next-auth';
import authConfig from '../../../../../auth.config';

/**
 * NextAuth handlers for authentication routes.
 */
const { handlers } = NextAuth(authConfig);

/**
 * Exported HTTP method handlers for NextAuth.
 */
export const { GET, POST } = handlers;
