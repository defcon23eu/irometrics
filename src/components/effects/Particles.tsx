"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ParticlesProps {
  count?: number;
  className?: string;
}

export default function Particles({ count = 20, className }: ParticlesProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const safeCount = Math.max(6, Math.min(24, count));

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const effectiveCount = isMobile ? Math.max(4, Math.floor(safeCount * 0.65)) : safeCount;

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden pointer-events-none ${className ?? ""}`}>
      {Array.from({ length: effectiveCount }).map((_, i) => {
        const top = (i * 37) % 100;
        const left = (i * 53) % 100;
        const duration = 3 + (i % 5) * 0.4;
        const delay = (i % 6) * 0.25;

        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-accent-primary/40"
            style={{ top: `${top}%`, left: `${left}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
          />
        );
      })}
    </div>
  );
}
