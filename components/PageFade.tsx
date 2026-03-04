"use client";

import { motion } from "framer-motion";

/**
 * Thin client-side wrapper that fades + slides in its children on mount.
 * Use this to add entrance animation to Server Component pages without
 * converting the whole page to a Client Component.
 */
export default function PageFade({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
