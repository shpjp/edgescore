import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { sessions } from "@/db/schema";
import AudioRecorder from "@/components/AudioRecorder";
import PageFade from "@/components/PageFade";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const typeBadgeClass: Record<string, string> = {
  behavioral:    "bg-[#e8d9c5] text-[#1f1f1f] border-0",
  dsa:           "bg-[#d9c5ab] text-[#1f1f1f] border-0",
  system_design: "bg-white border border-[#e8e2d9] text-[#1f1f1f]",
};

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Validate UUID format before hitting the database.
  // Neon/Postgres will throw a runtime error if a non-UUID string is passed
  // to a uuid-typed column — this catches it cheaply at the edge.
  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(id)) redirect("/dashboard");

  const authSession = await getServerSession(authOptions);
  if (!authSession) redirect("/api/auth/signin");

  // Fetch the session row by primary key
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, id))
    .limit(1);

  // Not found, or belongs to a different user — both redirect to dashboard.
  // We don't distinguish the two cases to avoid leaking existence information.
  if (!session || session.userId !== authSession.user.id) {
    redirect("/dashboard");
  }

  return (
    <PageFade>
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* Back navigation */}
        <a
          href="/dashboard"
          className="inline-block text-sm text-[#6b6b6b] hover:text-[#1f1f1f] transition-colors duration-200"
        >
          ← Sessions
        </a>

        {/* Card 1 — Question */}
        <Card className="bg-white border border-[#e8e2d9] shadow-sm">
          <CardHeader className="pb-3">
            <p className="text-xs font-medium uppercase tracking-widest text-[#6b6b6b]">
              Question
            </p>
            <div className="flex items-center gap-3 mt-2">
              <Badge
                className={
                  typeBadgeClass[session.type] ?? "bg-[#e8d9c5] text-[#1f1f1f] border-0"
                }
              >
                {session.type.replace("_", " ")}
              </Badge>
              <span className="text-xs text-[#6b6b6b]">
                {session.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <h1 className="text-xl font-semibold text-[#1f1f1f] leading-relaxed">
              {session.question}
            </h1>
          </CardContent>
        </Card>

        {/* Card 2 — Your Answer (hidden once transcript is available) */}
        {!session.transcript && (
          <Card className="bg-white border border-[#e8e2d9] shadow-sm">
            <CardHeader className="pb-3">
              <p className="text-xs font-medium uppercase tracking-widest text-[#6b6b6b]">
                Your Answer
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {session.audioUrl && (
                <audio controls src={session.audioUrl} className="w-full" />
              )}
              <AudioRecorder sessionId={session.id} />
            </CardContent>
          </Card>
        )}

        {/* Card 3 — Transcript */}
        {session.transcript && (
          <Card className="bg-white border border-[#e8e2d9] shadow-sm">
            <CardHeader className="pb-3">
              <p className="text-xs font-medium uppercase tracking-widest text-[#6b6b6b]">
                Transcript
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#1f1f1f] leading-relaxed whitespace-pre-wrap">
                {session.transcript}
              </p>
            </CardContent>
          </Card>
        )}

      </div>
    </PageFade>
  );
}
