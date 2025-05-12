import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LogInSchema } from "schemas/logIn.schema";
import { findUserByEmail } from "utils/findUser";

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
        // Explicitly assert the types for session.user and token
        session.user.id = token.id as string; // Type assertion for 'id'
        session.user.email = token.email as string; // Type assertion for 'email'
      }
      return session;
    },
  },
};

export default authConfig;
