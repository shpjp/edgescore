"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ─── Floating background shapes (Framer Motion) ───────────────────────────────
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute top-20 left-[8%] w-72 h-72 rounded-full bg-[#e8d9c5] opacity-50 blur-3xl"
        animate={{ y: [0, -24, 0], x: [0, 12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-36 right-[12%] w-56 h-56 rounded-full bg-[#d9c5ab] opacity-35 blur-3xl"
        animate={{ y: [0, 22, 0], x: [0, -16, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      <motion.div
        className="absolute bottom-16 left-[38%] w-80 h-80 rounded-full bg-[#e8d9c5] opacity-25 blur-3xl"
        animate={{ y: [0, 18, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features",     href: "#features"     },
  { label: "Waitlist",     href: "#waitlist"      },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-[#e8e2d9] bg-[#faf7f2]/85 backdrop-blur-sm shadow-sm"
          : "border-b border-transparent bg-[#faf7f2]/40"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-[#e8d9c5] flex items-center justify-center transition-colors duration-200 group-hover:bg-[#d9c5ab]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#a08060" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7" cy="5" r="2" />
              <path d="M3 12c0-2.2 1.8-4 4-4s4 1.8 4 4" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight text-[#1f1f1f]">EdgeScore</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1 text-sm">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-md text-[#6b6b6b] hover:text-[#1f1f1f] hover:bg-[#e8d9c5]/50 transition-all duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Button asChild size="sm" variant="warm" className="text-sm">
          <Link href="/dashboard">Sign in</Link>
        </Button>
      </div>
    </header>
  );
}

// ─── AI Interview Card ────────────────────────────────────────────────────────
// 12 base heights (px) — irregular pattern mimics a real voice waveform
const WAVEFORM_HEIGHTS = [4, 8, 14, 10, 18, 12, 7, 16, 11, 6, 13, 9];

function InterviewCard() {
  return (
    /* Entrance animation — runs once on mount */
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
    >
      {/* Float loop — slow 3px drift up and down */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-80 rounded-2xl border border-[#e8e2d9]/80 bg-white/70 shadow-[0_12px_48px_rgba(168,138,100,0.18)] backdrop-blur-md overflow-hidden"
      >
        {/* Mac window chrome */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#f0ebe3]/90 border-b border-[#e8e2d9]">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-sm" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e] shadow-sm" />
          <span className="w-3 h-3 rounded-full bg-[#28c840] shadow-sm" />
          <span className="ml-3 text-[10px] text-[#9a9490] font-mono">EdgeScore — Session</span>
        </div>
        <div className="p-6 space-y-5">
        {/* Card header */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a08060]">
            Interview Question
          </p>
          <Badge className="bg-[#d9e8f5] text-[#1a3a5c] border-0 text-xs">System Design</Badge>
        </div>

        {/* Question text */}
        <p className="text-sm font-medium text-[#1f1f1f] leading-relaxed">
          Design a URL shortener like bit.ly. Walk me through your architecture.
        </p>

        {/* Recording indicator row */}
        <div className="flex items-center justify-between rounded-lg bg-[#f7f3ed] px-4 py-3">
          <div className="flex items-center gap-2">
            {/* Pulsing red dot — uses Tailwind animate-ping */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <span className="text-xs font-medium text-[#1f1f1f]">Recording</span>
          </div>
          <span className="font-mono text-xs text-[#6b6b6b]">00:23</span>
        </div>

        {/* Waveform — staggered animated bars */}
        <div className="flex items-center justify-center gap-[3px] h-8 overflow-hidden">
          {WAVEFORM_HEIGHTS.map((h, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-[#c9a87c]"
              style={{ height: `${h}px` }}
              animate={{ height: [`${h}px`, `${Math.min(h * 2, 28)}px`, `${h}px`] }}
              transition={{
                duration: 0.7 + (i % 4) * 0.15,   // varied so bars don't all sync
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.06,                    // stagger start times
              }}
            />
          ))}
        </div>

        {/* EdgeScore result bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a08060]">
              EdgeScore
            </span>
            <motion.span
              className="text-sm font-bold text-[#1f1f1f] tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.4 }}
            >
              84 / 100
            </motion.span>
          </div>
          <div className="h-2 rounded-full bg-[#e8d9c5] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#a08060]"
              initial={{ width: "0%" }}
              animate={{ width: "84%" }}
              transition={{ duration: 1.4, delay: 0.9, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#9a9490]">
            <span>Clarity</span>
            <span>Depth</span>
            <span>Structure</span>
          </div>
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <FloatingShapes />
      {/* Two-column grid on large screens; single column (card hidden) on mobile */}
      <div className="relative max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">

        {/* Left — text content */}
        <div className="space-y-7 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <Badge className="bg-[#e8d9c5] text-[#1f1f1f] border-0 px-3 py-1 text-xs font-medium">
              AI-Powered Interview Practice
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight text-[#1f1f1f]"
          >
            Practice Technical Interviews
            <br />
            <span className="text-[#a08060]">with AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-xl text-[#6b6b6b] leading-relaxed max-w-xl"
          >
            Record answers, get feedback, and track improvement — so every practice rep counts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <motion.div
              whileHover={{ y: -4, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 16 }}
            >
              <Button asChild size="lg" variant="warm" className="px-8">
                <Link href="/dashboard">Try Demo</Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ y: -4, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 16 }}
            >
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 border-[#e8e2d9] text-[#1f1f1f] bg-transparent hover:bg-[#f0ebe3]"
              >
                <Link href="#waitlist">Join Waitlist</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Right — floating interview card (desktop only) */}
        <div className="hidden lg:flex items-center justify-center">
          <InterviewCard />
        </div>

      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────
const STEPS = [
  {
    step: "01",
    title: "Choose a Question",
    description: "Pick a technical interview question from our curated library, or add your own.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="16" y2="11" />
        <line x1="8" y1="15" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Record Your Answer",
    description: "Record your spoken answer out loud, just like a real interview. No typing needed.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 10a7 7 0 0 0 14 0" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="9" y1="22" x2="15" y2="22" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "AI Feedback",
    description: "Get a full transcript and structured AI feedback on your answer instantly.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
      </svg>
    ),
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20 space-y-14">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center space-y-3"
      >
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#a08060]">Process</p>
        <h2 className="text-3xl font-bold tracking-tight text-[#1f1f1f]">How it works</h2>
        <p className="text-[#6b6b6b] max-w-md mx-auto">Three simple steps to sharper interview answers.</p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-6">
        {STEPS.map(({ step, icon, title, description }, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.12, ease: "easeOut" }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <div className="h-full bg-[#faf7f2]/70 backdrop-blur-sm border border-[#e8e2d9]/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-7 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-lg bg-[#e8d9c5]/60 flex items-center justify-center text-[#a08060]">
                  {icon}
                </div>
                <span className="text-xs font-mono font-bold text-[#c4b19a] tracking-widest">
                  {step}
                </span>
              </div>
              <div className="space-y-1.5">
                <p className="font-semibold text-[#1f1f1f] text-base">{title}</p>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">{description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    title: "AI Transcription",
    description: "Automatically convert your spoken answer to clean, accurate text.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
        <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="9" y1="22" x2="15" y2="22" />
      </svg>
    ),
    badge: null,
  },
  {
    title: "Practice Interviews",
    description: "Simulate real technical interview questions across multiple domains.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    badge: null,
  },
  {
    title: "Progress Tracking",
    description: "Review past sessions and spot patterns in your answers over time.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    badge: null,
  },
  {
    title: "Confidence Analysis",
    description: "Analyze your speaking confidence, pacing, and delivery patterns.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
        <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
      </svg>
    ),
    badge: "Coming soon",
  },
];

function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-20 space-y-14">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center space-y-3"
      >
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#a08060]">Features</p>
        <h2 className="text-3xl font-bold tracking-tight text-[#1f1f1f]">Everything you need</h2>
        <p className="text-[#6b6b6b] max-w-md mx-auto">
          Built for engineers who take interview prep seriously.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {FEATURES.map(({ title, description, icon, badge }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <div className="relative h-full bg-[#faf7f2]/70 backdrop-blur-sm border border-[#e8e2d9]/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-7 flex flex-col gap-5">
              {badge && (
                <span className="absolute top-4 right-4 text-[10px] font-semibold tracking-wide uppercase bg-[#e8d9c5] text-[#a08060] px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
              <div className="w-11 h-11 rounded-lg bg-[#e8d9c5]/60 flex items-center justify-center text-[#a08060]">
                {icon}
              </div>
              <div className="space-y-1.5">
                <p className={`font-semibold text-base ${badge ? "text-[#9a9490]" : "text-[#1f1f1f]"}`}>
                  {title}
                </p>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">{description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Demo preview ─────────────────────────────────────────────────────────────
function DemoPreview() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 space-y-14">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center space-y-3"
      >
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#a08060]">Preview</p>
        <h2 className="text-3xl font-bold tracking-tight text-[#1f1f1f]">See it in action</h2>
        <p className="text-[#6b6b6b] max-w-md mx-auto">
          A glimpse of your session — question, recording, and AI feedback in one place.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="rounded-2xl border border-[#e8e2d9]/80 bg-[#faf7f2]/70 backdrop-blur-sm shadow-md overflow-hidden"
      >
        {/* Browser chrome */}
        <div className="bg-[#f0ebe3]/80 border-b border-[#e8e2d9] px-5 py-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-sm" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e] shadow-sm" />
          <span className="w-3 h-3 rounded-full bg-[#28c840] shadow-sm" />
          <div className="ml-4 flex-1 max-w-xs rounded-md bg-white/60 border border-[#e8e2d9] px-3 py-1">
            <span className="text-xs text-[#9a9490] font-mono">edgescore.app/dashboard/session</span>
          </div>
        </div>

        {/* Session content */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Badge className="bg-[#e8d9c5] text-[#1f1f1f] border-0">behavioral</Badge>
            <span className="text-xs text-[#9a9490]">Feb 28, 2026</span>
          </div>
          <h3 className="text-xl font-semibold leading-snug text-[#1f1f1f] max-w-xl">
            Tell me about a time you disagreed with your manager and how you handled it.
          </h3>
          {/* Recorder placeholder */}
          <div className="rounded-xl border border-dashed border-[#d9c5ab]/70 bg-white/40 p-5 flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-[#e8d9c5] flex items-center justify-center text-[#a08060] shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="9" y1="22" x2="15" y2="22" />
              </svg>
            </div>
            <span className="text-sm text-[#9a9490]">Your recorded answer appears here</span>
          </div>
          {/* Transcript */}
          <div className="rounded-xl bg-white/50 border border-[#e8e2d9]/60 p-5 text-sm text-[#6b6b6b] leading-relaxed">
            <span className="font-semibold text-[#1f1f1f]">Transcript: </span>
            &ldquo;I once disagreed with my manager about the deployment timeline…&rdquo;
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Waitlist section ─────────────────────────────────────────────────────────
function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="waitlist" className="max-w-6xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-xl mx-auto bg-[#faf7f2]/70 backdrop-blur-sm border border-[#e8e2d9]/80 rounded-2xl shadow-sm px-8 py-12 text-center space-y-8"
      >
        {/* Eyebrow */}
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#a08060]">
          Early Access
        </p>

        {/* Heading */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-[#1f1f1f]">
            Join the Early Access Waitlist
          </h2>
          <p className="text-[#6b6b6b] leading-relaxed">
            Be among the first to practice interviews with AI.
          </p>
        </div>

        {/* Form */}
        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="py-4 space-y-1"
          >
            <p className="text-base font-semibold text-[#1f1f1f]">You&apos;re on the list!</p>
            <p className="text-sm text-[#6b6b6b]">We&apos;ll reach out as soon as early access opens.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 border-[#e8e2d9] bg-white/80 focus-visible:ring-[#d9c5ab] placeholder:text-[#b0a898] text-sm rounded-lg"
            />
            <motion.div
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 420, damping: 16 }}
            >
              <Button
                type="submit"
                disabled={status === "loading"}
                variant="warm"
                className="shrink-0 px-5"
              >
                {status === "loading" ? "Joining…" : "Join Waitlist"}
              </Button>
            </motion.div>
          </form>
        )}

        {status === "error" && (
          <p className="text-xs text-destructive -mt-4">
            Something went wrong. Please try again.
          </p>
        )}

        {/* Social proof hint */}
        <p className="text-xs text-[#b0a898]">No spam. Unsubscribe any time.</p>
      </motion.div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Features",     href: "#features"     },
      { label: "Waitlist",     href: "#waitlist"      },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About",   href: "/about"   },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms",   href: "/terms"   },
    ],
  },
];

function Footer() {
  return (
    <footer className="border-t border-[#e8e2d9] bg-[#f7f3ed]/60 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 sm:grid-cols-4 gap-10">
        {/* Brand column */}
        <div className="col-span-2 sm:col-span-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#e8d9c5] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="#a08060" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7" cy="5" r="2" />
                <path d="M3 12c0-2.2 1.8-4 4-4s4 1.8 4 4" />
              </svg>
            </div>
            <span className="text-sm font-bold text-[#1f1f1f] tracking-tight">EdgeScore</span>
          </div>
          <p className="text-xs text-[#9a9490] leading-relaxed max-w-[160px]">
            AI-powered interview practice for engineers.
          </p>
        </div>

        {/* Link columns */}
        {FOOTER_LINKS.map(({ heading, links }) => (
          <div key={heading} className="space-y-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#a08060]">
              {heading}
            </p>
            <ul className="space-y-2">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs text-[#6b6b6b] hover:text-[#1f1f1f] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom line */}
      <div className="border-t border-[#e8e2d9] max-w-6xl mx-auto px-6 py-5">
        <p className="text-xs text-[#b0a898]">
          © {new Date().getFullYear()} EdgeScore. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="landing-bg min-h-screen text-[#1f1f1f]">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <DemoPreview />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  );
}