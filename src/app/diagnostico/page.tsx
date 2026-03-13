'use client';

import { useReducer, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { SurveyState, SurveyAction, BlockB } from '@/types';
import { ALL_QUESTIONS, TOTAL_ITEMS, BLOCK_RANGES } from '@/lib/questions';
import { calculateIRO } from '@/lib/iro-calculator';
import LikertScale7 from '@/components/survey/LikertScale7';
import MBIScale from '@/components/survey/MBIScale';
import OregScale from '@/components/survey/OregScale';
import SocioQuestion from '@/components/survey/SocioQuestion';
import NumericInput from '@/components/survey/NumericInput';

// Block metadata for defcon23-style headers
const BLOCK_META: Record<string, { num: string; label: string; icon: string }> = {
  A: { num: '01', label: 'Contexto organizacional', icon: '◈' },
  B: { num: '02', label: 'Dinámica organizacional', icon: '⧫' },
  C: { num: '03', label: 'Experiencia laboral', icon: '■' },
  D: { num: '04', label: 'Cambio organizacional', icon: '▶' },
};

const BLOCK_TRANSITION_MESSAGES: Record<string, { title: string; subtitle: string }> = {
  'A_B': { title: 'BLOQUE 01 COMPLETADO ◈', subtitle: 'Ahora evaluaremos la dinámica de tu organización' },
  'B_C': { title: 'BLOQUE 02 COMPLETADO ⧫', subtitle: 'A continuación, sobre tu experiencia personal en el trabajo' },
  'C_D': { title: 'BLOQUE 03 COMPLETADO ■', subtitle: 'Por último, algunas preguntas sobre el cambio organizacional' },
};

let slideDirection = 1;

const initialState: SurveyState = {
  currentItem: 0,
  answers: {},
  startTime: Date.now(),
  blockTransition: false,
};

function reducer(state: SurveyState, action: SurveyAction): SurveyState {
  switch (action.type) {
    case 'SET_ANSWER':
      return {
        ...state,
        answers: { ...state.answers, [action.key]: action.value },
      };
    case 'NEXT_ITEM':
      return { ...state, currentItem: Math.min(state.currentItem + 1, TOTAL_ITEMS - 1) };
    case 'PREV_ITEM':
      return { ...state, currentItem: Math.max(state.currentItem - 1, 0) };
    case 'SET_BLOCK_TRANSITION':
      return { ...state, blockTransition: action.active };
    case 'RESTORE_STATE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

function saveToSession(state: SurveyState) {
  try {
    sessionStorage.setItem('survey_state', JSON.stringify({
      currentItem: state.currentItem,
      answers: state.answers,
      startTime: state.startTime,
    }));
  } catch {
    // sessionStorage may be unavailable
  }
}

function getBlockProgress(currentItem: number, block: string) {
  const range = BLOCK_RANGES[block as keyof typeof BLOCK_RANGES];
  if (!range) return { pct: 0, current: 0, total: 0 };
  const blockSize = range.end - range.start + 1;
  const posInBlock = currentItem - range.start;
  return {
    pct: Math.round(((posInBlock + 1) / blockSize) * 100),
    current: posInBlock + 1,
    total: blockSize,
  };
}

function getBlockIndex(block: string): number {
  return ['A', 'B', 'C', 'D'].indexOf(block) + 1;
}

export default function DiagnosticoPage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const consent = sessionStorage.getItem('consent_at');
    if (!consent) {
      router.replace('/consentimiento');
      return;
    }
    try {
      const saved = sessionStorage.getItem('survey_state');
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<SurveyState>;
        dispatch({ type: 'RESTORE_STATE', state: parsed });
      }
    } catch {
      // Ignore parse errors
    }
  }, [router]);

  useEffect(() => {
    saveToSession(state);
  }, [state]);

  const question = ALL_QUESTIONS[state.currentItem];
  const answerValue = state.answers[question.id as keyof typeof state.answers];
  const blockMeta = BLOCK_META[question.block];
  const blockProgress = getBlockProgress(state.currentItem, question.block);

  // ─── Auto-advance refs (BUG-01 fix) ───
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isNavigatingBack = useRef(false);

  function clearAutoAdvance() {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
  }

  // Cleanup on unmount
  useEffect(() => () => clearAutoAdvance(), []);

  const getBlockTransitionKey = useCallback(
    (fromIdx: number): string | null => {
      if (fromIdx >= TOTAL_ITEMS - 1) return null;
      const currentBlock = ALL_QUESTIONS[fromIdx].block;
      const nextBlock = ALL_QUESTIONS[fromIdx + 1].block;
      if (currentBlock !== nextBlock) return `${currentBlock}_${nextBlock}`;
      return null;
    },
    [],
  );

  // ─── Advance to next item (shared logic) ───
  function advanceToNextItem() {
    const transKey = getBlockTransitionKey(state.currentItem);
    if (transKey) {
      dispatch({ type: 'SET_BLOCK_TRANSITION', active: true });
      autoAdvanceRef.current = setTimeout(() => {
        dispatch({ type: 'SET_BLOCK_TRANSITION', active: false });
        slideDirection = 1;
        dispatch({ type: 'NEXT_ITEM' });
      }, 2200);
    } else {
      slideDirection = 1;
      dispatch({ type: 'NEXT_ITEM' });
    }
  }

  // ─── Likert/MBI/Oreg: auto-advance after 280ms ───
  function handleLikertAnswer(value: number) {
    if (isNavigatingBack.current) return;
    clearAutoAdvance();

    dispatch({ type: 'SET_ANSWER', key: question.id, value });

    if (state.currentItem === TOTAL_ITEMS - 1) {
      handleSubmit({ ...state.answers, [question.id]: value });
      return;
    }

    const transKey = getBlockTransitionKey(state.currentItem);
    if (transKey) {
      dispatch({ type: 'SET_BLOCK_TRANSITION', active: true });
      autoAdvanceRef.current = setTimeout(() => {
        dispatch({ type: 'SET_BLOCK_TRANSITION', active: false });
        slideDirection = 1;
        dispatch({ type: 'NEXT_ITEM' });
      }, 2200);
    } else {
      autoAdvanceRef.current = setTimeout(() => {
        slideDirection = 1;
        dispatch({ type: 'NEXT_ITEM' });
      }, 280);
    }
  }

  // ─── Select: store answer only (no auto-advance) ───
  function handleSelectAnswer(value: string) {
    dispatch({ type: 'SET_ANSWER', key: question.id, value });
  }

  // ─── Explicit advance (number confirm / select "Siguiente") ───
  function handleConfirmAndAdvance(value?: string | number) {
    clearAutoAdvance();

    const updatedAnswers = value !== undefined
      ? { ...state.answers, [question.id]: value }
      : { ...state.answers };

    if (value !== undefined) {
      dispatch({ type: 'SET_ANSWER', key: question.id, value });
    }

    if (state.currentItem === TOTAL_ITEMS - 1) {
      handleSubmit(updatedAnswers as Record<string, unknown>);
      return;
    }

    advanceToNextItem();
  }

  // ─── Back navigation (BUG-01 fix) ───
  function handlePrev() {
    if (state.currentItem <= 0) return;
    clearAutoAdvance();
    isNavigatingBack.current = true;
    slideDirection = -1;
    dispatch({ type: 'PREV_ITEM' });
    setTimeout(() => { isNavigatingBack.current = false; }, 50);
  }

  async function handleSubmit(answers: Record<string, unknown>) {
    const sessionId = crypto.randomUUID();
    const consentAt = sessionStorage.getItem('consent_at') ?? new Date().toISOString();
    const completedAt = new Date().toISOString();
    const durationSeconds = Math.round((Date.now() - state.startTime) / 1000);

    const payload = {
      ...answers,
      session_id: sessionId,
      consent_at: consentAt,
      started_at: new Date(state.startTime).toISOString(),
      completed_at: completedAt,
      duration_seconds: durationSeconds,
    };

    const blockB: BlockB = {
      b1: answers.b1 as number, b2: answers.b2 as number, b3: answers.b3 as number, b4: answers.b4 as number,
      b5: answers.b5 as number, b6: answers.b6 as number, b7: answers.b7 as number, b8: answers.b8 as number,
      b9: answers.b9 as number, b10: answers.b10 as number, b11: answers.b11 as number, b12: answers.b12 as number,
    };
    const fallbackResult = calculateIRO(blockB);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json() as { result: { re_org: number; regime: string; delta: number; v: number; D: number; mu: number } };
        sessionStorage.setItem('iro_result', JSON.stringify(data.result));
      } else {
        console.error('Submit failed:', res.status);
        sessionStorage.setItem('iro_result', JSON.stringify(fallbackResult));
      }
    } catch (err) {
      console.error('Submit error:', err);
      sessionStorage.setItem('iro_result', JSON.stringify(fallbackResult));
    }

    sessionStorage.removeItem('survey_state');
    router.push('/resultado');
  }

  // Block transition splash
  if (state.blockTransition) {
    const transKey = getBlockTransitionKey(state.currentItem);
    const transData = transKey ? BLOCK_TRANSITION_MESSAGES[transKey] : null;
    const completedBlocks = getBlockIndex(ALL_QUESTIONS[state.currentItem].block);

    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key="block-transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            {/* Animated checkmark */}
            <motion.svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              className="mx-auto mb-6 text-accent-primary"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <motion.path
                d="M20 32 L28 40 L44 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </motion.svg>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-mono text-sm tracking-[0.2em] text-text-muted"
            >
              {transData?.title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-3 text-xl font-semibold sm:text-2xl"
            >
              {transData?.subtitle}
            </motion.p>

            {/* Total progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mx-auto mt-8 w-48"
            >
              <div className="h-1 w-full overflow-hidden rounded-full bg-bg-elevated">
                <motion.div
                  className="h-full rounded-full bg-accent-primary"
                  initial={{ width: `${((completedBlocks - 1) / 4) * 100}%` }}
                  animate={{ width: `${(completedBlocks / 4) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                />
              </div>
              <p className="mt-2 font-mono text-xs text-text-muted">
                Bloque {completedBlocks}/4
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </main>
    );
  }

  function renderInput() {
    switch (question.type) {
      case 'likert7':
        return (
          <LikertScale7
            value={typeof answerValue === 'number' ? answerValue : null}
            onChange={(v) => handleLikertAnswer(v)}
          />
        );
      case 'mbi':
        return (
          <MBIScale
            value={typeof answerValue === 'number' ? answerValue : null}
            onChange={(v) => handleLikertAnswer(v)}
          />
        );
      case 'likert6':
        return (
          <OregScale
            value={typeof answerValue === 'number' ? answerValue : null}
            onChange={(v) => handleLikertAnswer(v)}
          />
        );
      case 'select':
        return (
          <SocioQuestion
            question={question}
            value={typeof answerValue === 'string' ? answerValue : undefined}
            onSelect={(v) => handleSelectAnswer(v)}
            onConfirm={() => handleConfirmAndAdvance()}
          />
        );
      case 'number':
        return (
          <NumericInput
            min={question.validation?.min ?? 0}
            max={question.validation?.max ?? 999}
            initialValue={typeof answerValue === 'number' ? answerValue : undefined}
            onConfirm={(v) => handleConfirmAndAdvance(v)}
          />
        );
    }
  }

  const variants = {
    enter: { x: slideDirection * 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: slideDirection * -300, opacity: 0 },
  };

  return (
    <main className="flex min-h-screen flex-col px-4 py-6 sm:py-8">
      {/* 4-block phase progress — shows % per phase, not "X of 50" */}
      <div className="mx-auto mb-4 w-full max-w-xl sm:mb-6">
        <div className="flex w-full gap-3">
          {(['A', 'B', 'C', 'D'] as const).map((block) => {
            const meta = BLOCK_META[block];
            const blockOrder = ['A', 'B', 'C', 'D'];
            const isCompleted = blockOrder.indexOf(question.block) > blockOrder.indexOf(block);
            const isActive = question.block === block;
            const pct = isCompleted ? 100 : isActive ? blockProgress.pct : 0;
            return (
              <div key={block} className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-text-muted">{meta.icon}</span>
                  <span className={`font-mono text-[10px] ${
                    isCompleted ? 'text-[var(--color-regime-laminar)]' : isActive ? 'text-accent-primary' : 'text-text-muted'
                  }`}>
                    {isCompleted ? '✓' : isActive ? `${pct}%` : '—'}
                  </span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-bg-elevated">
                  <motion.div
                    className="h-full rounded-full"
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{
                      backgroundColor: isCompleted
                        ? 'var(--color-regime-laminar)'
                        : isActive
                          ? 'var(--color-accent-primary)'
                          : 'transparent',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-center font-mono text-[10px] tracking-wide text-text-muted">
          {blockMeta.icon} {blockMeta.label}
        </p>
      </div>

      {/* Question area */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentItem}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="rounded-2xl border border-border-subtle bg-bg-elevated/60 p-5 sm:p-8"
            >
              <h2 className="mb-6 text-center text-base font-semibold leading-relaxed sm:mb-8 sm:text-xl">
                {question.text}
              </h2>
              {renderInput()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="mx-auto w-full max-w-xl pb-4">
        {state.currentItem > 0 && (
          <button
            onClick={handlePrev}
            className="rounded-lg px-4 py-2 text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            ← Anterior
          </button>
        )}
      </div>
    </main>
  );
}
