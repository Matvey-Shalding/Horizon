import { DefaultSession } from "next-auth";

// Custom session type to include user ID
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add user ID to session
      email: string;
      name: string; // Optional, if you want user's full name
    };
  }

  interface JWT {
    id: string; // Add user ID to JWT token
    email: string;
  }
}

//satisfies NextAuthConfig;