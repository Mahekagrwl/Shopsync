import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

export function PageTransition({ children }) {
  const location = useLocation()

  useEffect(() => {
    // Smoothly scroll to top on page navigation
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname])

  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    return <div className="w-full">{children}</div>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="w-full flex-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition
