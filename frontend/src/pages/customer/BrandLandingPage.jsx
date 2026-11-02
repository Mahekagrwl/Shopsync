import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Compass, ShieldCheck } from 'lucide-react'
import AnimatedBackground from '../../components/common/AnimatedBackground'

/**
 * BrandLandingPage (Phase 1)
 * Single-screen (100vh) luxury brand introduction page.
 * Strictly fits within 100vh with zero scrolling, no navbar, no footer,
 * and exactly TWO main buttons: "Explore Website" and "Login / Get Started".
 */
export function BrandLandingPage() {
  const navigate = useNavigate()

  return (
    <div className="relative h-screen max-h-screen w-screen overflow-hidden bg-[#FFF9F5] flex flex-col items-center justify-center px-4 sm:px-6 select-none">
      {/* Subtle, elegant moving background blobs & particles */}
      <AnimatedBackground variant="hero" />

      {/* Luxury Ambient Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(244, 198, 213, 0.35) 0%, rgba(255, 249, 245, 0) 70%)'
        }}
      />

      {/* Main Single-Screen Brand Container */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center space-y-6 sm:space-y-7"
      >
        {/* SHOPSYNC Official Brand Logo with Floating Aura */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative group cursor-pointer"
          onClick={() => navigate('/store')}
        >
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#D985A5] via-[#F4C6D5] to-[#C58A78] opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-500" />
          <img
            src="/logo.jpg"
            alt="SHOPSYNC Official Brand Logo"
            className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-3xl object-cover shadow-xl border-2 border-white/80 transition-transform duration-300 group-hover:scale-105"
          />
        </motion.div>

        {/* Brand Name & Luxury Editorial Heading */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-[#F4C6D5] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D985A5]" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#352137]">
              Smart Beauty. Smarter Business.
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#352137] leading-[1.1]">
            SHOP<span className="text-[#D985A5]">SYNC</span>
          </h1>

          <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#352137]/90 font-medium">
            "Your Beauty. Your Style. Your Shop."
          </p>
        </div>

        {/* Short Narrative Description */}
        <p className="text-xs sm:text-sm md:text-base text-stone-600 max-w-lg leading-relaxed font-normal px-2">
          Discover your favourite beauty products, find your perfect skincare match and enjoy a smarter shopping experience with ShopSync.
        </p>

        {/* Exactly TWO Main Buttons */}
        <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 w-full max-w-md">
          {/* 1. Explore Website */}
          <Link
            to="/store"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-full bg-[#352137] hover:bg-[#542B43] active:scale-95 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl border border-[#352137]"
          >
            <span>Explore Website</span>
            <ArrowRight className="w-4 h-4 text-[#F4C6D5]" />
          </Link>

          {/* 2. Login / Get Started */}
          <Link
            to="/role-select"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#D985A5] via-[#C58A78] to-[#352137] hover:opacity-95 active:scale-95 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl border border-white/40"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Login / Get Started</span>
          </Link>
        </div>

        {/* Minimal Subtle Trust Indicator */}
        <div className="pt-3 flex items-center justify-center gap-4 text-[10px] sm:text-xs text-stone-500 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            100% Authentic Indian Ateliers
          </span>
          <span className="text-stone-300">•</span>
          <span>Vadodara, India</span>
        </div>
      </motion.div>
    </div>
  )
}

export default BrandLandingPage
