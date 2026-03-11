'use client'

import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface GlassQuestionCardProps {
  children: ReactNode
  questionText: string
  questionId: string
}

/**
 * GlassQuestionCard
 * Glassmorphic container for survey questions with morphing entry animation.
 * Used as the wrapper for all question types in the diagnostico page.
 */

export default function GlassQuestionCard({
  children,
  questionText,
  questionId,
}: GlassQuestionCardProps) {
  const reduced = useReducedMotion()

  const cardVariants = reduced
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, scale: 0.96, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.98, y: -10 },
      }

  const textVariants = reduced
    ? { initial: {}, animate: {} }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
      }

  return (
    <motion.div
      key={questionId}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: reduced ? 0 : 0.35,
        ease: 'easeOut',
      }}
      className="w-full max-w-2xl mx-auto rounded-2xl border border-border-default bg-bg-elevated/80 backdrop-blur-md p-6 sm:p-8 shadow-lg"
    >
      {/* Question text */}
      <motion.h2
        variants={textVariants}
        initial="initial"
        animate="animate"
        transition={{
          duration: reduced ? 0 : 0.3,
          delay: reduced ? 0 : 0.1,
          ease: 'easeOut',
        }}
        className="mb-8 text-center text-lg font-semibold text-text-primary leading-relaxed sm:text-xl"
      >
        {questionText}
      </motion.h2>

      {/* Scale/input component */}
      {children}
    </motion.div>
  )
}
