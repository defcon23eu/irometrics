'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LikertScale7 from '@/components/survey/LikertScale7';
import ProgressBar from '@/components/survey/ProgressBar';
import { IROGauge } from '@/components/resultado/IROGauge';
import { RegimeCard } from '@/components/iro/RegimeCard';

// Sample questions for demo
const DEMO_QUESTIONS = [
  { id: 'b1', text: 'Nuestros procesos de trabajo se modifican con mucha frecuencia.' },
  { id: 'b2', text: 'La comunicación interna es clara y efectiva.' },
  { id: 'b3', text: 'Los cambios organizacionales se implementan de forma planificada.' },
  { id: 'b4', text: 'Existe incertidumbre sobre la estabilidad de mi puesto de trabajo.' },
  { id: 'b5', text: 'Los objetivos del equipo cambian constantemente.' },
  { id: 'b6', text: 'Tengo autonomía suficiente para realizar mi trabajo.' },
  { id: 'b7', text: 'Los conflictos se resuelven de manera constructiva.' },
  { id: 'b8', text: 'La carga de trabajo es predecible y manejable.' },
];

const TOTAL_QUESTIONS = DEMO_QUESTIONS.length;

// Subescalas simuladas para el resultado
const SUBSCALES = [
  { name: 'Agotamiento Emocional', score: 3.2, max: 6, color: 'var(--color-regime-incipiente)' },
  { name: 'Despersonalización', score: 1.8, max: 6, color: 'var(--color-regime-transicion)' },
  { name: 'Realización Personal', score: 4.5, max: 6, color: 'var(--color-regime-laminar)' },
  { name: 'Resistencia al Cambio', score: 3.8, max: 6, color: 'var(--color-regime-incipiente)' },
];

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
    }, 500);
  }, [currentQuestion]);

  const handleShowResult = () => {
    setShowResult(true);
    // Animate gauge from 0 to target value
    setTimeout(() => setGaugeValue(1050), 100);
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
      {/* Subtle grid background */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-grid-line) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10">
        {!showResult ? (
          /* ===== SURVEY FLOW ===== */
          <div className="flex min-h-screen flex-col">
            {/* Progress bar - fixed at top */}
            <div className="sticky top-0 z-20 bg-bg-base/80 backdrop-blur-sm px-4 py-4">
              <div className="mx-auto max-w-2xl">
                <ProgressBar current={progress} total={TOTAL_QUESTIONS} minimal />
              </div>
            </div>

            {/* Question area */}
            <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
              <div className="w-full max-w-2xl">
                <AnimatePresence mode="wait">
                  {!isTransitioning && (
                    <motion.div
                      key={currentQuestion}
                      initial={{ opacity: 0, y: 40, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -40, scale: 0.98 }}
                      transition={{ 
                        duration: 0.4, 
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="rounded-2xl border border-border-subtle bg-bg-surface/80 backdrop-blur-sm p-6 sm:p-8"
                    >
                      {/* Question number indicator */}
                      <div className="mb-6 flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-subtle font-mono text-sm font-semibold text-accent-primary">
                          {progress}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-border-subtle to-transparent" />
                      </div>

                      {/* Question text */}
                      <h2 className="mb-8 text-lg sm:text-xl font-medium leading-relaxed text-text-primary text-balance">
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
                      <p className="mt-6 hidden text-center text-xs text-text-muted sm:block">
                        Pulsa las teclas 1-7 para responder
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Show result button when all answered */}
                <AnimatePresence>
                  {allAnswered && !isTransitioning && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-8 text-center"
                    >
                      <button
                        onClick={handleShowResult}
                        className="inline-flex items-center gap-2 rounded-xl bg-accent-primary px-8 py-4 text-lg font-semibold text-white transition-all duration-150 hover:bg-accent-hover hover:scale-105 focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
                      >
                        Ver Resultado
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        ) : (
          /* ===== RESULTS DASHBOARD ===== */
          <div className="min-h-screen px-4 py-12">
            <div className="mx-auto max-w-4xl">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
              >
                <p className="mb-2 font-mono text-xs tracking-[0.2em] text-text-muted uppercase">
                  RESULTADO DEL DIAGNÓSTICO
                </p>
                <h1 className="text-3xl font-bold sm:text-4xl">
                  Tu Índice de Reynolds Organizacional
                </h1>
              </motion.div>

              {/* Gauge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-12"
              >
                <IROGauge reOrg={gaugeValue} regime="turbulencia_incipiente" />
              </motion.div>

              {/* Regime Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mb-12 mx-auto max-w-md"
              >
                <RegimeCard 
                  regime="turbulencia_incipiente" 
                  reOrg={1050}
                  description="El flujo organizacional muestra patrones de inestabilidad significativos. Se detectan perturbaciones que afectan la eficiencia y el bienestar del equipo."
                />
              </motion.div>

              {/* Subscales breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="mb-12"
              >
                <h2 className="mb-6 text-center text-xl font-semibold">Desglose por Subescalas</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {SUBSCALES.map((sub, i) => (
                    <motion.div
                      key={sub.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + i * 0.1 }}
                      className="rounded-xl border border-border-subtle bg-bg-surface p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-text-primary">{sub.name}</span>
                        <span className="font-mono text-sm" style={{ color: sub.color }}>
                          {sub.score.toFixed(1)} / {sub.max}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-elevated">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(sub.score / sub.max) * 100}%` }}
                          transition={{ delay: 1.6 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: sub.color }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Reset button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-center"
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
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
