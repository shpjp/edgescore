"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "idle" | "recording" | "stopped" | "uploading";

export default function AudioRecorder({ sessionId }: { sessionId: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const audioBlob = useRef<Blob | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const router = useRouter();

  // Tick the timer every second while recording
  useEffect(() => {
    if (status === "recording") {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  // Format seconds as mm:ss
  function fmt(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  async function startRecording() {
    setError(null);
    // Request mic access — browser will prompt for permission
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    recorder.onstop = () => {
      // Combine all chunks into a single Blob when recording ends
      audioBlob.current = new Blob(chunks.current, { type: "audio/webm" });
      chunks.current = [];
      // Stop the mic stream so the browser recording indicator goes away
      stream.getTracks().forEach((t) => t.stop());
    };

    recorder.start();
    mediaRecorder.current = recorder;
    setStatus("recording");
  }

  function stopRecording() {
    mediaRecorder.current?.stop();
    setStatus("stopped");
  }

  async function upload() {
    if (!audioBlob.current) return;
    setStatus("uploading");
    setError(null);

    const form = new FormData();
    form.append("file", audioBlob.current, "recording.webm");
    form.append("sessionId", sessionId);

    const res = await fetch("/api/upload-audio", { method: "POST", body: form });

    if (!res.ok) {
      const { error: msg } = await res.json().catch(() => ({ error: "Upload failed" }));
      setError(msg ?? "Upload failed");
      setStatus("stopped");
      return;
    }

    // Re-run the Server Component to reflect the updated audio_url in the DB
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Button row — all states rendered in a single horizontal group */}
      <div className="flex items-center gap-3">
        {status === "idle" && (
          <Button onClick={startRecording} size="sm" variant="warm">
            <span className="w-2 h-2 rounded-full bg-[#a08060] inline-block mr-1.5" />
            Start Recording
          </Button>
        )}

        {status === "recording" && (
          <Button onClick={stopRecording} variant="destructive" size="sm">
            <span className="w-2 h-2 rounded-full bg-white inline-block mr-1.5 animate-pulse" />
            Stop Recording
            <span className="ml-2 font-mono text-xs tabular-nums opacity-90">{fmt(elapsed)}</span>
          </Button>
        )}

        {status === "stopped" && (
          <>
            <Button onClick={upload} size="sm" variant="warm">
              Upload Answer
            </Button>
            {/* Allow re-recording without refreshing the page */}
            <Button
              variant="ghost"
              size="sm"
              className="text-[#6b6b6b] hover:text-[#1f1f1f]"
              onClick={() => { audioBlob.current = null; setStatus("idle"); setError(null); }}
            >
              Re-record
            </Button>
          </>
        )}

        {status === "uploading" && (
          <span className="flex items-center gap-2 text-sm text-[#6b6b6b]">
            <Loader2 className="h-4 w-4 animate-spin text-[#a08060]" />
            Uploading…
          </span>
        )}
      </div>

      {/* Status hint line */}
      {status === "recording" && (
        <p className="text-xs text-red-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
          Recording in progress
        </p>
      )}
      {status === "stopped" && !error && (
        <p className="text-xs text-[#6b6b6b]">Ready to upload.</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
