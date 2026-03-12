"use client"

import { type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface QuestionTransitionProps {
  questionId: string | number
  children: ReactNode
  direction?: "forward" | "backward"
  onSubmit?: () => void
}

const EU_OSHA_STATS = [
  "El 44% de los trabajadores europeos reportan estrés laboral",
  "1 de cada 6 trabajadores sufre riesgos psicosociales graves",
  "El coste del estrés laboral en la UE supera los 20.000M EUR/año",
  "El 25% del absentismo se relaciona con factores organizacionales",
  "Los riesgos psicosociales afectan al 28% de la fuerza laboral UE",
]

const slideVariants = {
  enter: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? "100%" : "-100%",
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? "-100%" : "100%",
    opacity: 0,
  }),
}

export function QuestionTransition({
  questionId,
  children,
  direction = "forward",
  onSubmit,
}: QuestionTransitionProps) {
  const randomStat = EU_OSHA_STATS[Math.floor(Math.random() * EU_OSHA_STATS.length)]

  const handleSubmit = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([50])
    }
    onSubmit?.()
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* EU-OSHA contextual stat */}
      <div className="mb-4 px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle text-xs text-text-muted flex items-start gap-2">
        <span className="text-accent-primary mt-0.5 shrink-0">📊</span>
        <span>
          {randomStat}{" "}
          <span className="text-text-muted/60">— EU-OSHA</span>
        </span>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={questionId}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {onSubmit && (
        <button
          onClick={handleSubmit}
          className="sr-only"
          aria-label="Confirmar respuesta y avanzar"
        >
          Confirmar
        </button>
      )}
    </div>
  )
}

export default QuestionTransition
