"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface FlowLinesProps {
  lines?: number;
  className?: string;
}

export default function FlowLines({ lines = 5, className }: FlowLinesProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const safeLines = Math.max(2, Math.min(8, lines));

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const effectiveLines = isMobile ? Math.max(2, Math.floor(safeLines * 0.7)) : safeLines;

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden pointer-events-none ${className ?? ""}`}>
      {Array.from({ length: effectiveLines }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent"
          style={{ top: `${20 + i * 15}%`, width: "100%" }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}
