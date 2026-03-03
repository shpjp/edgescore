import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Redirect before rendering anything — no HTML leaks to unauthenticated users
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar — fixed height keeps the bar consistent regardless of content */}
      <header className="bg-white border-b border-gray-200 h-14 flex items-center px-6">
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-gray-900">
            EdgeScore
          </span>

          <div className="flex items-center gap-5 text-sm">
            <span className="text-gray-500 hidden sm:block">
              {session.user.email}
            </span>
            {/* Neutral tone — sign-out is routine, not dangerous */}
            <a
              href="/api/auth/signout"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Sign out
            </a>
          </div>
        </div>
      </header>

      {/* Constrained content area — prevents runaway line lengths on wide screens */}
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
