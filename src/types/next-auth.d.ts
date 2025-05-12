// types/next-auth.d.ts (or next-auth.d.ts in your project root)
import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add id to session.user
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string; // Add id to User (used in callbacks)
    email?: string | null;
    name?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string; // Add id to JWT token
  }
}
