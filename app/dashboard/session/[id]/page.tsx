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
import { FileText, Sparkles, Mic, Lightbulb, Users, Zap } from "lucide-react";

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

        {/* ─── Placeholder: Transcript ─────────────────────────────────── */}
        {!session.transcript && (
          <Card className="bg-[#faf7f2] border border-dashed border-[#d4c9b8] shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#b8a898]" />
                <p className="text-xs font-medium uppercase tracking-widest text-[#9b8e81]">
                  Transcript
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-1.5">
              <p className="text-sm text-[#9b8e81] leading-relaxed">
                Your recorded answer will be automatically transcribed here.
              </p>
              <p className="text-xs text-[#b8a898]">
                Speech-to-text processing coming soon.
              </p>
            </CardContent>
          </Card>
        )}

        {/* ─── Placeholder: AI Interview Analysis ──────────────────────── */}
        <Card className="bg-[#faf7f2] border border-dashed border-[#d4c9b8] shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#b8a898]" />
              <p className="text-xs font-medium uppercase tracking-widest text-[#9b8e81]">
                AI Interview Analysis
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Evaluation metric bars */}
            <div className="space-y-4">
              {[
                "Clarity",
                "Structure",
                "Technical Depth",
                "Confidence",
                "Conciseness",
              ].map((metric) => (
                <div key={metric} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-[#6b6b6b]">{metric}</span>
                    <span className="text-xs text-[#b8a898] font-mono tracking-wide">— / 100</span>
                  </div>
                  <div className="h-1.5 bg-[#e8e2d9] rounded-full w-full" />
                </div>
              ))}
            </div>

            {/* Speech Delivery sub-section */}
            <div className="border-t border-dashed border-[#d4c9b8] pt-5 space-y-3">
              <div className="flex items-center gap-2">
                <Mic className="w-3.5 h-3.5 text-[#b8a898]" />
                <p className="text-xs font-medium uppercase tracking-widest text-[#9b8e81]">
                  Speech Delivery
                </p>
              </div>
              <div className="divide-y divide-[#f0ebe3]">
                {[
                  { label: "Speech Pace",      sub: "words per minute" },
                  { label: "Pauses Detected",  sub: "" },
                  { label: "Filler Words",      sub: "" },
                  { label: "Confidence",        sub: "" },
                  { label: "Tone Stability",    sub: "" },
                ].map(({ label, sub }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-2"
                  >
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs text-[#6b6b6b]">{label}</span>
                      {sub && (
                        <span className="text-[10px] text-[#c4b8ab]">({sub})</span>
                      )}
                    </div>
                    <span className="text-xs text-[#b8a898] font-mono">—</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#b8a898] pt-1">
                Delivery metrics will be calculated from your audio.
              </p>
            </div>

          </CardContent>
        </Card>

        {/* ─── Placeholder: What You Missed ────────────────────────────── */}
        <Card className="bg-[#faf7f2] border border-dashed border-[#d4c9b8] shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-[#b8a898]" />
              <p className="text-xs font-medium uppercase tracking-widest text-[#9b8e81]">
                What You Missed
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-[#9b8e81] leading-relaxed">
              AI will highlight important concepts missing from your answer.
            </p>
            <ul className="space-y-2 pt-1">
              {["Concept 1", "Concept 2", "Concept 3"].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-[#c4b8ab]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4c9b8] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* ─── Placeholder: Peer Comparison ────────────────────────────── */}
        <Card className="bg-[#faf7f2] border border-dashed border-[#d4c9b8] shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[#b8a898]" />
              <p className="text-xs font-medium uppercase tracking-widest text-[#9b8e81]">
                Peer Comparison
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#9b8e81] leading-relaxed">
              You performed better than{" "}
              <span className="font-mono text-[#b8a898]">—%</span>{" "}
              of candidates.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Average Score",  value: "—" },
                { label: "Top 10% Score",  value: "—" },
                { label: "Your Rank",      value: "—" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-[#f2ede6] rounded-lg p-3 text-center border border-[#e8e2d9]"
                >
                  <p className="text-xl font-semibold text-[#9b8e81] font-mono leading-none">
                    {value}
                  </p>
                  <p className="text-[10px] text-[#b8a898] mt-1.5 leading-snug">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ─── Placeholder: Advanced Insights ──────────────────────────── */}
        <Card className="bg-[#faf7f2] border border-dashed border-[#d4c9b8] shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#b8a898]" />
              <p className="text-xs font-medium uppercase tracking-widest text-[#9b8e81]">
                Advanced Insights
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {[
                "Answer Similarity Score",
                "Interview Readiness Score",
                "Answer Depth Analysis",
                "Confidence Trend Over Time",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#9b8e81]">
                  <span className="w-4 h-4 rounded border border-dashed border-[#d4c9b8] flex items-center justify-center flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4c9b8]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-[#b8a898] pt-1 border-t border-dashed border-[#e8e2d9]">
              Available in upcoming releases.
            </p>
          </CardContent>
        </Card>

      </div>
    </PageFade>
  );
}
