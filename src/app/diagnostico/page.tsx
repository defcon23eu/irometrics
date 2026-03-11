'use client'

import { useReducer, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, useReducedMotion } from 'framer-motion'
import type { SurveyState, SurveyAction, BlockB } from '@/types'
import { ALL_QUESTIONS, TOTAL_ITEMS, BLOCK_RANGES } from '@/lib/questions'
import { calculateIRO } from '@/lib/iro-calculator'
import BlockProgress from '@/components/survey/BlockProgress'
import BlockTransition from '@/components/survey/BlockTransition'
import GlassQuestionCard from '@/components/survey/GlassQuestionCard'
import LikertScale7 from '@/components/survey/LikertScale7'
import MBIScale from '@/components/survey/MBIScale'
import OregScale from '@/components/survey/OregScale'
import SocioQuestion from '@/components/survey/SocioQuestion'

/* ─────────────────────────────────────────────
   Block configuration
───────────────────────────────────────────── */

const BLOCK_CONFIG = {
  A: { num: 1 as const, label: 'Contexto organizacional', start: 0, end: 4 },
  B: { num: 2 as const, label: 'Dinámica organizacional', start: 5, end: 16 },
  C: { num: 3 as const, label: 'Experiencia laboral', start: 17, end: 32 },
  D: { num: 4 as const, label: 'Cambio organizacional', start: 33, end: 49 },
} as const

type BlockKey = keyof typeof BLOCK_CONFIG

/* ─────────────────────────────────────────────
   State management
───────────────────────────────────────────── */

const initialState: SurveyState = {
  currentItem: 0,
  answers: {},
  startTime: Date.now(),
  blockTransition: false,
}

function reducer(state: SurveyState, action: SurveyAction): SurveyState {
  switch (action.type) {
    case 'SET_ANSWER':
      return {
        ...state,
        answers: { ...state.answers, [action.key]: action.value },
      }
    case 'NEXT_ITEM':
      return { ...state, currentItem: Math.min(state.currentItem + 1, TOTAL_ITEMS - 1) }
    case 'PREV_ITEM':
      return { ...state, currentItem: Math.max(state.currentItem - 1, 0) }
    case 'SET_BLOCK_TRANSITION':
      return { ...state, blockTransition: action.active }
    case 'RESTORE_STATE':
      return { ...state, ...action.state }
    default:
      return state
  }
}

function saveToSession(state: SurveyState) {
  try {
    sessionStorage.setItem('survey_state', JSON.stringify({
      currentItem: state.currentItem,
      answers: state.answers,
      startTime: state.startTime,
    }))
  } catch {
    // sessionStorage may be unavailable
  }
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */

export default function DiagnosticoPage() {
  const router = useRouter()
  const reduced = useReducedMotion()
  const [state, dispatch] = useReducer(reducer, initialState)

  // Protect route — must have consent
  useEffect(() => {
    const consent = sessionStorage.getItem('consent_at')
    if (!consent) {
      router.replace('/consentimiento')
      return
    }
    // Restore previous session if exists
    try {
      const saved = sessionStorage.getItem('survey_state')
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<SurveyState>
        dispatch({ type: 'RESTORE_STATE', state: parsed })
      }
    } catch {
      // Ignore parse errors
    }
  }, [router])

  // Save on every answer change
  useEffect(() => {
    saveToSession(state)
  }, [state])

  const question = ALL_QUESTIONS[state.currentItem]
  const answerValue = state.answers[question.id as keyof typeof state.answers]

  // Current block info
  const currentBlockKey = question.block as BlockKey
  const blockConfig = BLOCK_CONFIG[currentBlockKey]
  const itemsInBlock = blockConfig.end - blockConfig.start + 1
  const itemsDoneInBlock = Math.max(0, state.currentItem - blockConfig.start)

  // Check if moving to next item crosses a block boundary
  const getBlockTransitionNum = useCallback(
    (fromIdx: number): 1 | 2 | 3 | null => {
      if (fromIdx >= TOTAL_ITEMS - 1) return null
      const currentBlock = ALL_QUESTIONS[fromIdx].block
      const nextBlock = ALL_QUESTIONS[fromIdx + 1].block
      if (currentBlock !== nextBlock) {
        // Return the block number we just completed (1, 2, or 3)
        const completedBlockNum = BLOCK_CONFIG[currentBlock as BlockKey].num
        if (completedBlockNum <= 3) return completedBlockNum as 1 | 2 | 3
      }
      return null
    },
    [],
  )

  async function handleAnswer(value: string | number) {
    dispatch({ type: 'SET_ANSWER', key: question.id, value })

    // Last item → submit
    if (state.currentItem === TOTAL_ITEMS - 1) {
      await handleSubmit({ ...state.answers, [question.id]: value })
      return
    }

    // Check block transition
    const transBlockNum = getBlockTransitionNum(state.currentItem)
    if (transBlockNum) {
      dispatch({ type: 'SET_BLOCK_TRANSITION', active: true })
      // BlockTransition component will call onComplete after animation
      return
    }

    // Small delay for auto-advance
    await new Promise((r) => setTimeout(r, 280))
    dispatch({ type: 'NEXT_ITEM' })
  }

  function handleBlockTransitionComplete() {
    dispatch({ type: 'SET_BLOCK_TRANSITION', active: false })
    dispatch({ type: 'NEXT_ITEM' })
  }

  function handlePrev() {
    if (state.currentItem > 0) {
      dispatch({ type: 'PREV_ITEM' })
    }
  }

  async function handleSubmit(answers: Record<string, unknown>) {
    const sessionId = crypto.randomUUID()
    const consentAt = sessionStorage.getItem('consent_at') ?? new Date().toISOString()
    const completedAt = new Date().toISOString()
    const durationSeconds = Math.round((Date.now() - state.startTime) / 1000)

    const payload = {
      ...answers,
      session_id: sessionId,
      consent_at: consentAt,
      started_at: new Date(state.startTime).toISOString(),
      completed_at: completedAt,
      duration_seconds: durationSeconds,
    }

    // Client-side fallback: calculate IRO locally in case API fails
    const blockB: BlockB = {
      b1: answers.b1 as number, b2: answers.b2 as number, b3: answers.b3 as number, b4: answers.b4 as number,
      b5: answers.b5 as number, b6: answers.b6 as number, b7: answers.b7 as number, b8: answers.b8 as number,
      b9: answers.b9 as number, b10: answers.b10 as number, b11: answers.b11 as number, b12: answers.b12 as number,
    }
    const fallbackResult = calculateIRO(blockB)

    // Build result payload for sessionStorage
    const buildResultPayload = (result: typeof fallbackResult) => ({
      reOrg: result.re_org,
      regime: result.regime,
      reOrgLog: Math.log10(result.re_org + 1),
      duracionSeg: durationSeconds,
      completedAt,
    })

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const data = await res.json() as { result: typeof fallbackResult }
        sessionStorage.setItem('iro_result', JSON.stringify(buildResultPayload(data.result)))
      } else {
        sessionStorage.setItem('iro_result', JSON.stringify(buildResultPayload(fallbackResult)))
      }
    } catch {
      sessionStorage.setItem('iro_result', JSON.stringify(buildResultPayload(fallbackResult)))
    }

    sessionStorage.removeItem('survey_state')
    router.push('/resultado')
  }

  // Block transition overlay
  if (state.blockTransition) {
    const transBlockNum = getBlockTransitionNum(state.currentItem)
    if (transBlockNum) {
      return (
        <BlockTransition
          blockNum={transBlockNum}
          blockLabel={BLOCK_CONFIG[currentBlockKey].label}
          itemsDone={state.currentItem + 1}
          totalItems={50}
          onComplete={handleBlockTransitionComplete}
        />
      )
    }
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
        )
      case 'mbi':
        return (
          <MBIScale
            value={typeof answerValue === 'number' ? answerValue : null}
            onChange={(v) => handleAnswer(v)}
          />
        )
      case 'likert6':
        return (
          <OregScale
            value={typeof answerValue === 'number' ? answerValue : null}
            onChange={(v) => handleAnswer(v)}
          />
        )
      case 'select':
      case 'number':
        return (
          <SocioQuestion
            question={question}
            value={answerValue as string | number | undefined}
            onChange={(v) => handleAnswer(v)}
          />
        )
    }
  }

  return (
    <main className="flex min-h-screen flex-col px-4 py-6 sm:px-6 sm:py-8">
      {/* Progress — block-based, no question counter */}
      <div className="mx-auto w-full max-w-2xl mb-8">
        <BlockProgress
          currentBlock={blockConfig.num}
          blockLabel={blockConfig.label}
          itemsInBlock={itemsInBlock}
          itemsDoneInBlock={itemsDoneInBlock}
          totalItems={TOTAL_ITEMS}
          totalDone={state.currentItem}
        />
      </div>

      {/* Question area */}
      <div className="flex flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          <GlassQuestionCard
            key={state.currentItem}
            questionId={question.id}
            questionText={question.text}
          >
            {renderInput()}
          </GlassQuestionCard>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mx-auto w-full max-w-2xl pt-6 pb-4">
        {state.currentItem > 0 && (
          <button
            onClick={handlePrev}
            className="rounded-xl px-5 py-2.5 text-sm text-text-muted border border-border-subtle transition-colors hover:text-text-primary hover:border-border-default"
          >
            <span aria-hidden="true">←</span> Anterior
          </button>
        )}
      </div>
    </main>
  )
}
