import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// POST /api/waitlist
// ---------------------------------------------------------------------------
// Accepts { email: string } and stores the entry.
// Right now we log it and return 200 — swap the body for a real DB write or
// an email-marketing API call (e.g. Resend, Loops, ConvertKit) later.
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body?.email ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // TODO: persist `email` to a waitlist table or send to a marketing service.
    console.log("[waitlist] new signup:", email);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
