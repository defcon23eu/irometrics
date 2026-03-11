'use client';

import { useReducer, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { SurveyState, SurveyAction, BlockB } from '@/types';
import { ALL_QUESTIONS, TOTAL_ITEMS, BLOCK_TRANSITIONS } from '@/lib/questions';
import { calculateIRO } from '@/lib/iro-calculator';
import ProgressBar from '@/components/survey/ProgressBar';
import LikertScale7 from '@/components/survey/LikertScale7';
import MBIScale from '@/components/survey/MBIScale';
import OregScale from '@/components/survey/OregScale';
import SocioQuestion from '@/components/survey/SocioQuestion';

// Determine direction for slide animation
let slideDirection = 1; // 1 = forward, -1 = backward

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

// Persist answers to sessionStorage
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

export default function DiagnosticoPage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  // Protect route — must have consent
  useEffect(() => {
    const consent = sessionStorage.getItem('consent_at');
    if (!consent) {
      router.replace('/consentimiento');
      return;
    }
    // Restore previous session if exists
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

  // Save on every answer change
  useEffect(() => {
    saveToSession(state);
  }, [state]);

  const question = ALL_QUESTIONS[state.currentItem];
  const answerValue = state.answers[question.id as keyof typeof state.answers];

  // Check if moving to next item crosses a block boundary
  const getBlockTransitionMessage = useCallback(
    (fromIdx: number): string | null => {
      if (fromIdx >= TOTAL_ITEMS - 1) return null;
      const currentBlock = ALL_QUESTIONS[fromIdx].block;
      const nextBlock = ALL_QUESTIONS[fromIdx + 1].block;
      if (currentBlock !== nextBlock) {
        const key = `${currentBlock}_${nextBlock}`;
        return BLOCK_TRANSITIONS[key] ?? null;
      }
      return null;
    },
    [],
  );

  async function handleAnswer(value: string | number) {
    dispatch({ type: 'SET_ANSWER', key: question.id, value });

    // Last item → submit
    if (state.currentItem === TOTAL_ITEMS - 1) {
      await handleSubmit({ ...state.answers, [question.id]: value });
      return;
    }

    // Check block transition
    const transMsg = getBlockTransitionMessage(state.currentItem);
    if (transMsg) {
      dispatch({ type: 'SET_BLOCK_TRANSITION', active: true });
      // Show transition screen for 2 seconds
      await new Promise((r) => setTimeout(r, 2000));
      dispatch({ type: 'SET_BLOCK_TRANSITION', active: false });
    } else {
      // Small delay for auto-advance
      await new Promise((r) => setTimeout(r, 280));
    }

    slideDirection = 1;
    dispatch({ type: 'NEXT_ITEM' });
  }

  function handlePrev() {
    if (state.currentItem > 0) {
      slideDirection = -1;
      dispatch({ type: 'PREV_ITEM' });
    }
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

    // Client-side fallback: calculate IRO locally in case API fails
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

  // Block transition overlay
  if (state.blockTransition) {
    const transMsg = getBlockTransitionMessage(state.currentItem);
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-2xl font-semibold sm:text-3xl">
            {transMsg}
          </p>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-16 animate-pulse rounded-full bg-accent-primary" />
          </div>
        </motion.div>
      </main>
    );
  }

  // Render scale component based on question type
  function renderInput() {
    switch (question.type) {
      case 'likert7':
        return (
          <LikertScale7
            value={typeof answerValue === 'number' ? answerValue : null}
            onChange={(v) => handleAnswer(v)}
          />
        );
      case 'mbi':
        return (
          <MBIScale
            value={typeof answerValue === 'number' ? answerValue : null}
            onChange={(v) => handleAnswer(v)}
          />
        );
      case 'likert6':
        return (
          <OregScale
            value={typeof answerValue === 'number' ? answerValue : null}
            onChange={(v) => handleAnswer(v)}
          />
        );
      case 'select':
      case 'number':
        return (
          <SocioQuestion
            question={question}
            value={answerValue as string | number | undefined}
            onChange={(v) => handleAnswer(v)}
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
    <main className="flex min-h-screen flex-col px-6 py-8">
      {/* Progress */}
      <div className="mx-auto w-full max-w-xl">
        <ProgressBar
          current={state.currentItem + 1}
          total={TOTAL_ITEMS}
          blockLabel={question.blockLabel}
        />
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
            >
              <h2 className="mb-8 text-center text-xl font-semibold sm:text-2xl">
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
