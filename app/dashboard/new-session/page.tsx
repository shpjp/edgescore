import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { createSession } from "@/actions/create-session";

export default async function NewSessionPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-6">New Interview Session</h1>

      <form action={createSession} className="flex flex-col gap-4">
        {/* Session type */}
        <div className="flex flex-col gap-1">
          <label htmlFor="type" className="text-sm font-medium text-gray-700">
            Session Type
          </label>
          <select
            id="type"
            name="type"
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
          >
            <option value="behavioral">Behavioral</option>
            <option value="dsa">DSA</option>
            <option value="system_design">System Design</option>
          </select>
        </div>

        {/* Question */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="question"
            className="text-sm font-medium text-gray-700"
          >
            Question
          </label>
          <textarea
            id="question"
            name="question"
            required
            rows={4}
            placeholder="e.g. Tell me about a time you resolved a conflict on your team."
            className="border border-gray-300 rounded px-3 py-2 text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          className="self-start bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Create Session
        </button>
      </form>
    </div>
  );
}
