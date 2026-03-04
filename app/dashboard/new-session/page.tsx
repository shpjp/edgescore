import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import NewSessionForm from "@/components/NewSessionForm";
import PageFade from "@/components/PageFade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
            <NewSessionForm />
          </CardContent>
        </Card>
      </div>
    </PageFade>
  );
}
