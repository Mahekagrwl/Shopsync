import React, { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false)
  const [hoverType, setHoverType] = useState('default') // 'default' | 'button' | 'card' | 'text'
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [ripples, setRipples] = useState([])
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Motion values
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Spring physics for the trailing outer ring
  const springConfig = { damping: 26, stiffness: 320, mass: 0.5 }
  const ringX = useSpring(mouseX, springConfig)
  const ringY = useSpring(mouseY, springConfig)

  const rafRef = useRef(null)
  const mousePos = useRef({ x: -100, y: -100 })

  useEffect(() => {
    // 1. Check for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)
    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleMotionChange)

    // 2. Check if device has a fine pointer (mouse/trackpad, NOT touch screen)
    const pointerQuery = window.matchMedia('(pointer: fine)')
    if (!pointerQuery.matches || motionQuery.matches) {
      return () => motionQuery.removeEventListener('change', handleMotionChange)
    }

    document.body.classList.add('has-custom-cursor')

    // Continuous smooth animation loop via requestAnimationFrame
    const updatePosition = () => {
      mouseX.set(mousePos.current.x)
      mouseY.set(mousePos.current.y)
      rafRef.current = requestAnimationFrame(updatePosition)
    }
    rafRef.current = requestAnimationFrame(updatePosition)

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)

      // Detect hover target
      const target = e.target
      if (!target) return

      const cardElement = target.closest('[data-cursor-card], .product-card, .pos-touch-card')
      const buttonElement = target.closest('a, button, input, select, textarea, [role="button"], [data-cursor-hover], [data-pos-key]')

      if (cardElement) {
        setIsHovered(true)
        setHoverType('card')
      } else if (buttonElement) {
        setIsHovered(true)
        setHoverType('button')
      } else {
        setIsHovered(false)
        setHoverType('default')
      }
    }

    const handleMouseDown = (e) => {
      setIsClicking(true)
      // Spawn click ripple
      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      }
      setRipples((prev) => [...prev.slice(-3), newRipple])
    }

    const handleMouseUp = () => setIsClicking(false)
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      document.body.classList.remove('has-custom-cursor')
      motionQuery.removeEventListener('change', handleMotionChange)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isVisible, mouseX, mouseY])

  // Clean up ripples after animation
  const removeRipple = (id) => {
    setRipples((prev) => prev.filter((r) => r.id !== id))
  }

  if (prefersReducedMotion || !isVisible) {
    return null
  }

  // Dynamic dimensions based on hover state
  const ringDimensions = isClicking
    ? { width: 22, height: 22 }
    : hoverType === 'card'
    ? { width: 56, height: 56 }
    : hoverType === 'button'
    ? { width: 48, height: 48 }
    : { width: 32, height: 32 }

  return (
    <>
      {/* 1. Outer Deep Plum Trailing Ring with Spring Physics */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-[#542B43] shadow-[0_0_14px_rgba(217,166,172,0.45)]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: ringDimensions.width,
          height: ringDimensions.height,
          backgroundColor: isHovered
            ? 'rgba(217, 166, 172, 0.22)'
            : 'rgba(84, 43, 67, 0.06)',
          borderColor: isHovered ? '#D9A6AC' : '#542B43',
          borderWidth: isHovered ? '2px' : '1.5px',
        }}
        transition={{ type: 'spring', damping: 22, stiffness: 380 }}
      />

      {/* 2. Inner Glowing Dusty Rose Center Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full bg-[#D9A6AC] border border-[#542B43]/50 shadow-[0_0_10px_rgba(217,166,172,0.95),0_0_3px_#542B43]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.6 : isHovered ? 1.5 : 1,
          backgroundColor: isHovered ? '#542B43' : '#D9A6AC',
        }}
        transition={{ duration: 0.12 }}
      >
        <div className="w-2.5 h-2.5 rounded-full" />
      </motion.div>

      {/* 3. Subtle Radiating Click Ripples */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.div
            key={r.id}
            initial={{ scale: 0.2, opacity: 0.7 }}
            animate={{ scale: 2.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onAnimationComplete={() => removeRipple(r.id)}
            className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-[#D9A6AC]"
            style={{
              left: r.x,
              top: r.y,
              width: 36,
              height: 36,
              translateX: '-50%',
              translateY: '-50%',
              boxShadow: '0 0 12px rgba(217, 166, 172, 0.6)',
            }}
          />
        ))}
      </AnimatePresence>
    </>
  )
}

export default CustomCursor
