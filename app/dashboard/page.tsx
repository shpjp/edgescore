import Link from "next/link";
import { getServerSession } from "next-auth";
import { eq, desc } from "drizzle-orm";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { sessions } from "@/db/schema";

// Per-type colors give instant visual differentiation without extra columns
const typeBadgeStyles: Record<string, string> = {
  behavioral:    "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  dsa:           "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  system_design: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
};

function TypeBadge({ type }: { type: string }) {
  const style = typeBadgeStyles[type] ?? "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${style}`}>
      {type.replace("_", " ")}
    </span>
  );
}

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
        <h1 className="text-red-500">TEST UI CHANGE</h1>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Sessions</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {userSessions.length === 0
              ? "No sessions yet"
              : `${userSessions.length} session${
                  userSessions.length === 1 ? "" : "s"
                } recorded`}
          </p>
        </div>
        <Link
          href="/dashboard/new-session"
          className="inline-flex items-center gap-1.5 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          <span aria-hidden>+</span> New Session
        </Link>
      </div>

      {userSessions.length === 0 ? (
        // Empty state — actionable, not just informational
        <div className="border border-dashed border-gray-300 rounded-lg p-10 text-center">
          <p className="text-sm text-gray-500">
            No sessions yet.{" "}
            <Link
              href="/dashboard/new-session"
              className="text-gray-900 font-medium underline underline-offset-2"
            >
              Create your first one.
            </Link>
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {userSessions.map((s) => (
            <li
              key={s.id}
              className="bg-white border border-gray-200 rounded-lg px-5 py-4 shadow-sm hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <TypeBadge type={s.type} />
                <span className="text-xs text-gray-400">
                  {s.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="mt-2.5 text-sm text-gray-800 leading-relaxed line-clamp-2">
                {s.question}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
