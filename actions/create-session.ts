"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { sessions } from "@/db/schema";

export async function createSession(formData: FormData) {
  // Re-read session server-side — never trust userId from form inputs
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  const type = formData.get("type") as string;
  const question = formData.get("question") as string;

  if (!type || !question.trim()) return; // basic guard; can add proper errors later

  await db.insert(sessions).values({
    userId: session.user.id,
    type,
    question: question.trim(),
    // transcript and audioUrl left null — populated later via AI pipeline
  });

  redirect("/dashboard");
}
