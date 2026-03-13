'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ACCENT_COLOR, isSmallDevice } from '@/lib/motion-presets';

interface FlowLinesProps {
  color?: string;
  opacity?: number;
  count?: number;
  className?: string;
}

/**
 * FlowLines - Animated horizontal lines representing laminar flow
 * Decorative, non-interactive layer for hero sections
 */
export default function FlowLines({ 
  color = ACCENT_COLOR, 
  opacity = 0.15,
  count = 5,
  className = '',
}: FlowLinesProps) {
  const shouldReduceMotion = useReducedMotion();
  const [lineCount, setLineCount] = useState(count);

  useEffect(() => {
    // Reduce density on small devices
    if (isSmallDevice()) {
      setLineCount(Math.ceil(count / 2));
    }
  }, [count]);

  if (shouldReduceMotion) {
    // Static lines for reduced motion
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {[...Array(lineCount)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px w-full"
            style={{ 
              top: `${20 + i * (60 / lineCount)}%`,
              background: `linear-gradient(90deg, transparent, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}, transparent)`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(lineCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px"
          style={{ 
            top: `${20 + i * (60 / lineCount)}%`,
            width: '200%',
            left: '-50%',
            background: `linear-gradient(90deg, transparent 0%, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 25%, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 75%, transparent 100%)`,
          }}
          animate={{ 
            x: ['0%', '25%', '0%'],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  );
}
