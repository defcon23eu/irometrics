"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface FlowParticlesProps {
  color: string;
  intensity: number;
  className?: string;
}

export default function FlowParticles({ color, intensity, className }: FlowParticlesProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const normalizedIntensity = Math.max(0, Math.min(1, intensity));
  const particleCount = Math.floor(normalizedIntensity * 6) + 4;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const effectiveCount = isMobile ? Math.max(3, Math.floor(particleCount * 0.7)) : particleCount;

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden pointer-events-none ${className ?? ""}`}>
      {Array.from({ length: effectiveCount }).map((_, i) => {
        const size = 2 + (i % 3);
        const left = (i * 23) % 100;
        const drift = normalizedIntensity > 0.5 ? ((i % 2 === 0 ? 1 : -1) * (10 + (i % 4) * 6)) : 0;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              left: `${left}%`,
              opacity: 0.4 + normalizedIntensity * 0.3,
            }}
            initial={{ top: "100%", opacity: 0 }}
            animate={{
              top: "-10%",
              opacity: [0, 0.6, 0],
              x: drift === 0 ? 0 : [0, drift, 0],
            }}
            transition={{
              duration: 2 + (i % 5) * 0.35,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
}
