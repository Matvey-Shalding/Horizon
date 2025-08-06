import NextAuth from 'next-auth';
import authConfig from '../../../../../auth.config';

// Initialize NextAuth with the provided configuration
const nextAuthHandlers = NextAuth(authConfig);

// Export GET and POST handlers for NextAuth authentication routes
export const { GET, POST } = nextAuthHandlers.handlers;
