import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Derive up-to-2 initials from display name or email for the avatar bubble
  const initials = (session.user?.name ?? session.user?.email ?? "?")
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0].toUpperCase())
    .join("");

  return (
    <div className="min-h-screen bg-[#f7f3ed]">
      {/* Sticky beige navbar */}
      <header className="sticky top-0 z-40 bg-[#f7f3ed]/80 backdrop-blur-sm border-b border-[#e8e2d9] h-14 flex items-center px-6">
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-sm font-bold tracking-tight text-[#1f1f1f] hover:opacity-80 transition-opacity"
          >
            EdgeScore
          </Link>

          {/* Nav links + avatar */}
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/dashboard"
              className="text-[#6b6b6b] hover:text-[#1f1f1f] transition-colors duration-200 hidden sm:block"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/new-session"
              className="text-[#6b6b6b] hover:text-[#1f1f1f] transition-colors duration-200 hidden sm:block"
            >
              New Session
            </Link>

            <div className="flex items-center gap-3">
              {/* Avatar bubble */}
              <div
                className="w-7 h-7 rounded-full bg-[#e8d9c5] text-[#1f1f1f] flex items-center justify-center text-xs font-semibold select-none"
                title={session.user?.email ?? ""}
              >
                {initials}
              </div>
              <a
                href="/api/auth/signout?callbackUrl=/"
                className="text-[#6b6b6b] hover:text-[#1f1f1f] transition-colors duration-200 hidden sm:block"
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
