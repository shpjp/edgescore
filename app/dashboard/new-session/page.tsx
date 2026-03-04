import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { createSession } from "@/actions/create-session";
import PageFade from "@/components/PageFade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default async function NewSessionPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  return (
    <PageFade>
      <div className="max-w-lg">
        <Card className="bg-white border border-[#e8e2d9] shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-[#1f1f1f]">New Interview Session</CardTitle>
            <p className="text-sm text-[#6b6b6b] mt-1">
              Choose a session type and paste in the question you want to practise.
            </p>
          </CardHeader>
          <CardContent>
            <form action={createSession} className="flex flex-col gap-5">
              {/* Session type */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="type" className="text-sm font-medium text-[#1f1f1f]">
                  Session Type
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  className="flex h-9 w-full rounded-md border border-[#e8e2d9] bg-[#f7f3ed] px-3 py-1 text-sm text-[#1f1f1f] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d9c5ab]"
                >
                  <option value="behavioral">Behavioral</option>
                  <option value="dsa">DSA</option>
                  <option value="system_design">System Design</option>
                </select>
              </div>

              {/* Question */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="question" className="text-sm font-medium text-[#1f1f1f]">
                  Question
                </label>
                <Textarea
                  id="question"
                  name="question"
                  required
                  rows={4}
                  placeholder="e.g. Tell me about a time you resolved a conflict on your team."
                  className="resize-none border-[#e8e2d9] bg-[#f7f3ed] focus-visible:ring-[#d9c5ab]"
                />
              </div>

              <Button type="submit" variant="warm" className="self-start hover:-translate-y-0.5 hover:shadow-md transition-all duration-150">
                Create Session
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageFade>
  );
}
