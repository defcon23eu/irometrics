'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { ACCENT_COLOR, isSmallDevice } from '@/lib/motion-presets';

interface ParticlesProps {
  color?: string;
  count?: number;
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

/**
 * Particles - Floating ambient particles for background decoration
 * Creates a subtle "floating dust" effect
 */
export default function Particles({ 
  color = ACCENT_COLOR, 
  count = 20,
  className = '',
}: ParticlesProps) {
  const shouldReduceMotion = useReducedMotion();
  const [particleCount, setParticleCount] = useState(count);

  useEffect(() => {
    // Reduce density on small devices
    if (isSmallDevice()) {
      setParticleCount(Math.ceil(count / 2));
    }
  }, [count]);

  // Generate stable particle positions
  const particles = useMemo<Particle[]>(() => {
    return [...Array(particleCount)].map((_, i) => ({
      id: i,
      x: (i * 37) % 100, // Pseudo-random but stable distribution
      y: (i * 53) % 100,
      size: 1 + (i % 3),
      delay: (i * 0.3) % 3,
      duration: 3 + (i % 3),
    }));
  }, [particleCount]);

  if (shouldReduceMotion) {
    // Static particles for reduced motion
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: color,
              opacity: 0.3,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: color,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
