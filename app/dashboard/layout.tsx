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
      {/* Top navigation bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight">EdgeScore</span>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{session.user.email}</span>
          {/* Next.js <Link> works here, but a plain anchor is fine for an auth endpoint */}
          <a
            href="/api/auth/signout"
            className="text-red-500 hover:underline"
          >
            Sign out
          </a>
        </div>
      </header>

      {/* Page content */}
      <main className="p-6">{children}</main>
    </div>
  );
}
