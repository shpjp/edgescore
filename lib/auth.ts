import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // JWT strategy — no database sessions, no adapter needed
  session: {
    strategy: "jwt",
  },

  callbacks: {
    // jwt() is the single place that touches the database.
    // `account` is only present on the first sign-in for a given browser session —
    // that's our signal to upsert and embed the DB id into the token.
    async jwt({ token, account }) {
      if (account) {
        // First sign-in: resolve or create the DB user record.
        const email = token.email!;
        const googleId = account.providerAccountId; // Google's stable user id ("sub")

        const [existing] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!existing) {
          // New user — insert and capture the generated UUID.
          const [created] = await db
            .insert(users)
            .values({ email, googleId })
            .returning({ id: users.id });
          token.id = created.id;
        } else {
          // Existing user — back-fill googleId if it was never stored.
          if (!existing.googleId) {
            await db
              .update(users)
              .set({ googleId })
              .where(eq(users.id, existing.id));
          }
          token.id = existing.id;
        }
      }
      // Subsequent requests: account is absent, token.id is already set.
      return token;
    },

    // session() only reads from the token — no DB call.
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
};
