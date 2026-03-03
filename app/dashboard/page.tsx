import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  // Layout already redirects unauthenticated users — session is guaranteed here
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-gray-700">Welcome, {session!.user.email}</p>
      <p className="mt-1 text-sm text-gray-400">
        Your DB User ID: {session!.user.id}
      </p>
    </div>
  );
}
