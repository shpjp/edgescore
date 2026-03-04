import Link from "next/link";
import { getServerSession } from "next-auth";
import { eq, desc } from "drizzle-orm";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { sessions } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { SessionGrid } from "@/components/SessionGrid";

export default async function DashboardPage() {
  // Layout already redirects unauthenticated users — session is guaranteed here
  const session = await getServerSession(authOptions);

  // Fetch this user's sessions, newest first
  const userSessions = await db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, session!.user.id))
    .orderBy(desc(sessions.createdAt));

  // Serialise dates before passing to the Client Component
  const serialisedSessions = userSessions.map((s) => ({
    id: s.id,
    type: s.type,
    question: s.question,
    createdAtFormatted: s.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }));

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#1f1f1f]">Sessions</h1>
          <p className="text-sm text-[#6b6b6b] mt-0.5">
            {userSessions.length === 0
              ? "No sessions yet"
              : `${userSessions.length} session${
                  userSessions.length === 1 ? "" : "s"
                } recorded`}
          </p>
        </div>
        <Button asChild size="sm" variant="warm">
          <Link href="/dashboard/new-session">+ New Session</Link>
        </Button>
      </div>

      {/* Animated session grid — client component */}
      <SessionGrid sessions={serialisedSessions} />
    </div>
  );
}
