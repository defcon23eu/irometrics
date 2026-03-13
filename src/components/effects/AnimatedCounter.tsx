'use client';

import { useEffect, useState } from 'react';
import { useSpring, useTransform, useReducedMotion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
}

/**
 * AnimatedCounter - Smoothly animated number counter with spring physics
 * Used for Re_org value display in results
 */
export default function AnimatedCounter({ 
  value, 
  decimals = 1,
  duration = 2,
  className = '',
}: AnimatedCounterProps) {
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value.toFixed(decimals));
  
  // Spring physics for smooth counting
  const spring = useSpring(0, { 
    stiffness: 40, 
    damping: 20,
    duration: shouldReduceMotion ? 0 : duration,
  });
  
  const display = useTransform(spring, (v) => v.toFixed(decimals));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => setDisplayValue(v));
    return unsubscribe;
  }, [display]);

  // Instant display for reduced motion
  if (shouldReduceMotion) {
    return <span className={className}>{value.toFixed(decimals)}</span>;
  }

  return <span className={className}>{displayValue}</span>;
}
