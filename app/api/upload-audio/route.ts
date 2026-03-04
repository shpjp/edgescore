import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";
import OpenAI from "openai";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { sessions } from "@/db/schema";

export async function POST(req: NextRequest) {
  const authSession = await getServerSession(authOptions);
  if (!authSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const sessionId = form.get("sessionId") as string | null;

  if (!file || !sessionId) {
    return NextResponse.json({ error: "Missing file or sessionId" }, { status: 400 });
  }

  // Ownership check — confirm this session belongs to the authenticated user
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!session || session.userId !== authSession.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Upload audio to Vercel Blob — path is keyed to sessionId so re-uploads overwrite cleanly.
  const filename = `${sessionId}.webm`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const blob = await put(`audio/${filename}`, buffer, {
    access: "public",
    contentType: "audio/webm",
    addRandomSuffix: false,
  });

  const audioUrl = blob.url;

  // Checkpoint 1: persist audio_url immediately.
  // Even if transcription fails below, the audio is not lost.
  await db
    .update(sessions)
    .set({ audioUrl })
    .where(eq(sessions.id, sessionId));

  // Checkpoint 2: transcribe — best-effort, errors are caught and swallowed.
  let transcript: string | null = null;
  try {
    // Instantiate lazily so missing key at build time doesn't crash the build
    const openai = new OpenAI();
    // Pass a File object built from the uploaded buffer
    const audioFile = new File([buffer], filename, { type: "audio/webm" });

    const result = await openai.audio.transcriptions.create({
      model: "gpt-4o-mini-transcribe",
      file: audioFile,
    });

    transcript = result.text ?? null;

    if (transcript) {
      await db
        .update(sessions)
        .set({ transcript })
        .where(eq(sessions.id, sessionId));
    }
  } catch (err) {
    // Log for observability but don't fail the request —
    // the audio_url is already saved and the user can retry transcription later.
    console.error("[upload-audio] Whisper transcription failed:", err);
  }

  return NextResponse.json({ audioUrl, transcript });
}
