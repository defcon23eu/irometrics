'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import LikertScale7 from '@/components/survey/LikertScale7';
import ProgressBar from '@/components/survey/ProgressBar';
import { IROGauge } from '@/components/resultado/IROGauge';
import { RegimeCard } from '@/components/iro/RegimeCard';

// Sample questions for demo - representative of actual IRO instrument
const DEMO_QUESTIONS = [
  { id: 'b1', text: 'Los procesos de trabajo cambian con frecuencia.', block: 'Dinamica' },
  { id: 'b2', text: 'La comunicacion interna es clara y efectiva.', block: 'Comunicacion' },
  { id: 'b3', text: 'Los cambios se implementan de forma planificada.', block: 'Cambio' },
  { id: 'b4', text: 'Hay incertidumbre sobre la estabilidad laboral.', block: 'Estabilidad' },
  { id: 'b5', text: 'Los objetivos del equipo cambian constantemente.', block: 'Objetivos' },
  { id: 'b6', text: 'Tengo autonomia para realizar mi trabajo.', block: 'Autonomia' },
  { id: 'b7', text: 'Los conflictos se resuelven de forma constructiva.', block: 'Conflictos' },
  { id: 'b8', text: 'La carga de trabajo es predecible y manejable.', block: 'Carga' },
];

const TOTAL_QUESTIONS = DEMO_QUESTIONS.length;

// Simulated subscales for result display
const SUBSCALES = [
  { name: 'Densidad (delta)', code: 'delta', score: 14.2, max: 21, color: 'var(--color-regime-incipiente)' },
  { name: 'Velocidad (v)', code: 'v', score: 11.8, max: 21, color: 'var(--color-regime-transicion)' },
  { name: 'Dispersion (D)', code: 'D', score: 15.5, max: 21, color: 'var(--color-regime-incipiente)' },
  { name: 'Resistencia (mu)', code: 'mu', score: 8.3, max: 21, color: 'var(--color-regime-laminar)' },
];

// Floating particles background
function FlowBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-grid-line) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Flowing gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: 'var(--color-accent-primary)', opacity: 0.03 }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{ backgroundColor: 'var(--color-regime-transicion)', opacity: 0.03 }}
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function DemoPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [gaugeValue, setGaugeValue] = useState(0);

  const handleAnswer = useCallback((value: number) => {
    const questionId = DEMO_QUESTIONS[currentQuestion].id;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    
    // Start transition animation
    setIsTransitioning(true);
    
    // Auto-advance after animation
    setTimeout(() => {
      if (currentQuestion < TOTAL_QUESTIONS - 1) {
        setCurrentQuestion((prev) => prev + 1);
      }
      setIsTransitioning(false);
    }, 600);
  }, [currentQuestion]);

  const handleShowResult = () => {
    setShowResult(true);
    // Animate gauge from 0 to target value
    setTimeout(() => setGaugeValue(1050), 200);
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setGaugeValue(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showResult || isTransitioning) return;
      const key = parseInt(e.key);
      if (key >= 1 && key <= 7) {
        handleAnswer(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResult, isTransitioning, handleAnswer]);

  const progress = currentQuestion + 1;
  const allAnswered = Object.keys(answers).length === TOTAL_QUESTIONS;

  return (
    <main className="min-h-screen bg-bg-base">
      <FlowBackground />

      <div className="relative z-10">
        {!showResult ? (
          /* ===== SURVEY FLOW ===== */
          <div className="flex min-h-screen flex-col">
            {/* Header with progress */}
            <header className="sticky top-0 z-20 bg-bg-base/90 backdrop-blur-xl border-b border-border-subtle">
              <div className="mx-auto max-w-2xl px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <Link 
                    href="/"
                    className="text-xs font-mono text-text-muted hover:text-text-secondary transition-colors"
                  >
                    irometrics.app
                  </Link>
                  <span className="text-xs text-text-muted font-mono">
                    DEMO
                  </span>
                </div>
                <ProgressBar current={progress} total={TOTAL_QUESTIONS} minimal />
              </div>
            </header>

            {/* Question area */}
            <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
              <div className="w-full max-w-xl">
                <AnimatePresence mode="wait">
                  {!isTransitioning && (
                    <motion.div
                      key={currentQuestion}
                      initial={{ opacity: 0, y: 40, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -30, scale: 0.98 }}
                      transition={{ 
                        duration: 0.4, 
                        ease: [0.25, 0.4, 0.25, 1],
                      }}
                      className="rounded-2xl border border-border-subtle bg-bg-surface/95 backdrop-blur-sm p-5 sm:p-8"
                      style={{
                        boxShadow: '0 4px 24px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.02)',
                      }}
                    >
                      {/* Question header - simplified for mobile */}
                      <div className="mb-5 sm:mb-6 flex items-center gap-3">
                        <motion.span 
                          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl font-mono text-base sm:text-lg font-bold"
                          style={{
                            backgroundColor: 'var(--color-accent-subtle)',
                            color: 'var(--color-accent-primary)',
                          }}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {progress}
                        </motion.span>
                        <div className="flex-1">
                          <div className="h-px bg-gradient-to-r from-border-subtle via-border-default to-transparent" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-mono text-text-muted px-2 py-1 rounded-lg bg-bg-elevated">
                          {DEMO_QUESTIONS[currentQuestion].block}
                        </span>
                      </div>

                      {/* Question text - better mobile typography */}
                      <h2 className="mb-6 sm:mb-8 text-base sm:text-xl font-medium leading-relaxed text-text-primary text-balance text-center sm:text-left">
                        {DEMO_QUESTIONS[currentQuestion].text}
                      </h2>

                      {/* Likert Scale */}
                      <LikertScale7
                        value={answers[DEMO_QUESTIONS[currentQuestion].id] ?? null}
                        onChange={handleAnswer}
                        disabled={isTransitioning}
                        compact
                      />

                      {/* Keyboard hint (desktop only) */}
                      <motion.p 
                        className="mt-6 hidden text-center text-xs text-text-muted sm:flex items-center justify-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <kbd className="px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle font-mono text-[10px]">1-7</kbd>
                        para responder
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Show result button when all answered */}
                <AnimatePresence>
                  {allAnswered && !isTransitioning && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                      className="mt-8 text-center"
                    >
                      <motion.button
                        onClick={handleShowResult}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-lg font-semibold text-bg-base transition-all duration-200"
                        style={{
                          backgroundColor: 'var(--color-accent-primary)',
                          boxShadow: '0 0 40px var(--color-accent-glow)',
                        }}
                      >
                        Ver Resultado
                        <motion.svg 
                          className="h-5 w-5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth={2}
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </motion.svg>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        ) : (
          /* ===== RESULTS DASHBOARD ===== */
          <div className="min-h-screen px-4 py-12">
            <div className="mx-auto max-w-3xl">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 text-center"
              >
                <motion.div 
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-xs font-mono border"
                  style={{
                    backgroundColor: 'var(--color-accent-subtle)',
                    borderColor: 'var(--color-accent-border)',
                    color: 'var(--color-accent-primary)',
                  }}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-primary animate-pulse" />
                  DIAGNOSTICO SIMULADO
                </motion.div>
                <h1 className="text-3xl font-bold sm:text-4xl text-text-primary">
                  Tu Indice de Reynolds Organizacional
                </h1>
              </motion.div>

              {/* Gauge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-10"
              >
                <IROGauge reOrg={gaugeValue} regime="turbulencia_incipiente" />
              </motion.div>

              {/* Regime Card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="mb-10 mx-auto max-w-lg"
              >
                <RegimeCard 
                  regime="turbulencia_incipiente" 
                  reOrg={1050}
                  description="El flujo organizacional muestra patrones de inestabilidad significativos. Se detectan perturbaciones que afectan la eficiencia y el bienestar del equipo."
                />
              </motion.div>

              {/* Subscales breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                className="mb-10"
              >
                <h2 className="mb-6 text-center text-lg font-semibold text-text-primary">
                  Desglose por Variables de Flujo
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SUBSCALES.map((sub, i) => (
                    <motion.div
                      key={sub.code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2 + i * 0.1 }}
                      className="rounded-xl border border-border-subtle bg-bg-surface/80 backdrop-blur-sm p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-text-primary">{sub.name}</span>
                        <span className="font-mono text-sm font-bold" style={{ color: sub.color }}>
                          {sub.score.toFixed(1)}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-elevated">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(sub.score / sub.max) * 100}%` }}
                          transition={{ delay: 2.2 + i * 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: sub.color }}
                        />
                      </div>
                      <div className="flex justify-between mt-1.5 text-[10px] font-mono text-text-muted">
                        <span>0</span>
                        <span>{sub.max}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Formula reminder */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="mb-10 text-center"
              >
                <div className="inline-block rounded-xl border border-border-subtle bg-bg-surface/50 backdrop-blur-sm px-6 py-4">
                  <p className="font-mono text-lg text-text-secondary">
                    Re<sub>org</sub> = <span className="text-accent-primary">(delta * v * D)</span> / <span className="text-regime-laminar">mu</span>
                  </p>
                </div>
              </motion.div>

              {/* Reset button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-xl border border-border-default bg-bg-surface px-6 py-3 text-sm font-medium text-text-secondary transition-all hover:border-border-focus hover:text-text-primary"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reiniciar demo
                </button>
                <Link
                  href="/"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  Volver al inicio
                </Link>
              </motion.div>

              {/* Disclaimer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                className="mt-12 text-center text-xs text-text-muted"
              >
                Esta es una simulacion con datos ficticios. El instrumento completo consta de 50 items.
              </motion.p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
