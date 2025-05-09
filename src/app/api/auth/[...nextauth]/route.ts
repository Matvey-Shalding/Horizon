// /app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import authConfig from "../../../../../auth.config"; // Adjust as needed

const handler = NextAuth({
  ...authConfig,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
