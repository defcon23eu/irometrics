'use client'

/**
 * AnimatedGridBackground
 * CSS-only animated grid with subtle radial pulse — no JS animations.
 * Respects prefers-reduced-motion via media query.
 */

export default function AnimatedGridBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* CSS grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(250,250,250,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250,250,250,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radial glow from top center — subtle pulse animation */}
      <div
        className="hero-glow absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/4"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(99,102,241,0.15), transparent 70%)',
        }}
      />

      {/* Secondary glow — bottom right accent */}
      <div
        className="absolute bottom-0 right-0 h-[400px] w-[500px] translate-x-1/4 translate-y-1/4"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 70% 70%, rgba(99,102,241,0.08), transparent 70%)',
        }}
      />

      {/* Keyframes injected via style tag for pulse */}
      <style>{`
        @keyframes hero-glow-pulse {
          0%, 100% { opacity: 1; transform: translateX(-50%) translateY(-25%) scale(1); }
          50% { opacity: 0.7; transform: translateX(-50%) translateY(-25%) scale(1.05); }
        }
        .hero-glow {
          animation: hero-glow-pulse 8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-glow {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
