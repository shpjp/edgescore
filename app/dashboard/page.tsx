import Link from "next/link";
import { getServerSession } from "next-auth";
import { eq, desc } from "drizzle-orm";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { sessions } from "@/db/schema";

export default async function DashboardPage() {
  // Layout already redirects unauthenticated users — session is guaranteed here
  const session = await getServerSession(authOptions);

  // Fetch this user's sessions, newest first
  const userSessions = await db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, session!.user.id))
    .orderBy(desc(sessions.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Sessions</h1>
        <Link
          href="/dashboard/new-session"
          className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          + New Session
        </Link>
      </div>

      {userSessions.length === 0 ? (
        <p className="text-sm text-gray-500">
          No sessions yet.{" "}
          <Link href="/dashboard/new-session" className="underline">
            Create your first one.
          </Link>
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {userSessions.map((s) => (
            <li
              key={s.id}
              className="bg-white border border-gray-200 rounded p-4"
            >
              <div className="flex items-center justify-between">
                {/* Badge for session type */}
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {s.type.replace("_", " ")}
                </span>
                <span className="text-xs text-gray-400">
                  {s.createdAt.toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-800 line-clamp-2">
                {s.question}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
