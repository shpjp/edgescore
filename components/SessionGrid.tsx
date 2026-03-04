"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Serialised shape — no Date objects (not serialisable across the server→client boundary)
export type SessionRow = {
  id: string;
  type: string;
  question: string;
  createdAtFormatted: string;
};

// Beige-themed badge colours per session type
const typeBadgeClass: Record<string, string> = {
  behavioral:    "bg-[#e8d9c5] text-[#1f1f1f] border-0 hover:bg-[#d9c5ab]",
  dsa:           "bg-[#d9c5ab] text-[#1f1f1f] border-0 hover:bg-[#c9b398]",
  system_design: "bg-white border border-[#e8e2d9] text-[#1f1f1f]",
};

export function SessionGrid({ sessions }: { sessions: SessionRow[] }) {
  if (sessions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-dashed border-[#e8e2d9] bg-white">
          <CardContent className="py-14 text-center">
            <p className="text-sm text-[#6b6b6b]">
              No sessions yet.{" "}
              <Link
                href="/dashboard/new-session"
                className="text-[#1f1f1f] font-medium underline underline-offset-2"
              >
                Create your first one.
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {sessions.map((s, i) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.07, ease: "easeOut" }}
          whileHover={{ y: -4 }}
        >
          <Link href={`/dashboard/session/${s.id}`} className="block h-full">
            <Card className="h-full bg-white border border-[#e8e2d9] shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="px-5 py-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Badge
                    className={
                      typeBadgeClass[s.type] ??
                      "bg-[#e8d9c5] text-[#1f1f1f] border-0"
                    }
                  >
                    {s.type.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-[#6b6b6b]">{s.createdAtFormatted}</span>
                </div>
                <p className="text-sm text-[#1f1f1f] leading-relaxed line-clamp-2 flex-1">
                  {s.question}
                </p>
                <span className="text-xs text-[#6b6b6b] group-hover:text-[#1f1f1f] transition-colors">
                  Open session →
                </span>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
