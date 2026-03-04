"use client";

import { motion } from "framer-motion";
import { Github } from "lucide-react";

export default function GithubButton() {
  return (
    <motion.a
      href="https://github.com/shpjp/edgescore"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[#a08060] text-white flex items-center justify-center shadow-lg hover:shadow-xl"
      whileHover={{ scale: 1.18, rotate: 10 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      title="View on GitHub"
    >
      <Github size={18} />
    </motion.a>
  );
}
