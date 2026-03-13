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
  // Deterministic stat based on questionId to avoid impure render
  const statIndex = typeof questionId === 'number' 
    ? questionId % EU_OSHA_STATS.length 
    : String(questionId).length % EU_OSHA_STATS.length
  const currentStat = EU_OSHA_STATS[statIndex]

  const handleSubmit = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([50])
    }
    onSubmit?.()
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background shimmer with EU-OSHA stat */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg-base via-bg-elevated to-bg-base">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-subtle to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <p className="text-xs text-text-muted italic">{currentStat}</p>
          <p className="text-[10px] text-text-muted/60 mt-1">Fuente: EU-OSHA</p>
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={questionId}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="relative z-10 p-6 sm:p-8"
        >
          {children}

          {onSubmit && (
            <motion.button
              onClick={handleSubmit}
              whileTap={{ scale: 0.95 }}
              className="mt-6 w-full sm:w-auto px-8 py-3 bg-accent-primary hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-bg-base"
            >
              Continuar
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default QuestionTransition
