import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { LogInSchema } from 'schemas/logIn.schema';
import { findUserByEmail } from 'utils/findUser';

const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LogInSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await findUserByEmail(email);

          if (!user) return null;

          const isPasswordMatch = password === user.password;

          if (isPasswordMatch) {
            return {
              id: user.id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
            };
          }
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  trustHost: true, // 👈 REQUIRED for Vercel deployments

  secret: process.env.NEXTAUTH_SECRET,

  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production', // 👈 IMPORTANT
      },
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
};

export default authConfig;
