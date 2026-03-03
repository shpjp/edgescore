import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// NextAuth() returns a single handler; we re-export it for both HTTP verbs
// that the OAuth flow requires (GET for redirects, POST for callbacks).
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
