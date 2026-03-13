'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { isSmallDevice } from '@/lib/motion-presets';

interface FlowParticlesProps {
  color: string;
  intensity: number; // 0-1, based on Re_org / 5000
  className?: string;
}

interface FlowParticle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

/**
 * FlowParticles - Dynamic particles that react to flow intensity
 * More particles and chaos as intensity increases (turbulence)
 * Used around the IROGauge for dynamic feedback
 */
export default function FlowParticles({ 
  color, 
  intensity,
  className = '',
}: FlowParticlesProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    setIsSmall(isSmallDevice());
  }, []);

  // Particle count based on intensity (4-12 particles)
  const baseCount = Math.floor(intensity * 8) + 4;
  const particleCount = isSmall ? Math.ceil(baseCount / 2) : baseCount;

  // Generate stable particle data
  const particles = useMemo<FlowParticle[]>(() => {
    return [...Array(particleCount)].map((_, i) => ({
      id: i,
      x: (i * 23) % 100, // Pseudo-random distribution
      size: 2 + (i % 3),
      delay: i * 0.3,
      duration: 2 + (i % 2),
      drift: intensity > 0.5 ? ((i % 2 === 0 ? 1 : -1) * 20) : 0, // Turbulent drift
    }));
  }, [particleCount, intensity]);

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
              opacity: 0.4 + intensity * 0.3,
              left: `${p.x}%`,
              top: '70%',
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
          }}
          initial={{ top: '100%', opacity: 0 }}
          animate={{ 
            top: '-10%', 
            opacity: [0, 0.4 + intensity * 0.4, 0],
            x: p.drift ? [0, p.drift, -p.drift, 0] : 0,
          }}
          transition={{
            duration: p.duration / (0.5 + intensity * 0.5), // Faster at high intensity
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
