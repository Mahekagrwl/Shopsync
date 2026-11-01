import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Star,
  CheckCircle2,
  Copy,
  Check,
  Smile,
  Palette,
  Wind,
  Sun,
  Scissors,
  Layers,
  Activity,
  Zap,
  Flame
} from 'lucide-react'
import { BEAUTY_PRODUCTS, CATEGORIES, BRANDS, MOCK_REVIEWS } from '../../data/mockBeautyData'
import ProductCard from '../../components/common/ProductCard'

export function HomePage() {
  const [copiedCode, setCopiedCode] = useState(false)
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 })

  const bestSellers = BEAUTY_PRODUCTS.filter(p => p.isBestSeller)
  const newArrivals = BEAUTY_PRODUCTS.filter(p => p.isNewArrival)

  const copyPromo = () => {
    navigator.clipboard.writeText('SHOPSYNC15')
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2500)
  }

  // 3D Parallax Mouse Tracker
  const handleHeroMouseMove = (e) => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const { currentTarget, clientX, clientY } = e
    const rect = currentTarget.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width - 0.5) * 2 // -1 to +1
    const y = ((clientY - rect.top) / rect.height - 0.5) * 2 // -1 to +1
    setHeroTilt({ x, y })
  }

  const handleHeroMouseLeave = () => {
    setHeroTilt({ x: 0, y: 0 })
  }

  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      {/* 1. CINEMATIC 3D HERO SECTION */}
      <section
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative overflow-hidden bg-gradient-to-b from-[#F8F3EE] via-[#E9DED5]/50 to-[#F8F3EE] pt-10 pb-20 lg:pt-20 lg:pb-32 border-b border-[#E9DED5]/70"
      >
        {/* Ambient 3D Depth Glow Spheres */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 bg-[#D9A6AC]/25 rounded-full blur-3xl pointer-events-none transition-transform duration-700 ease-out"
          style={{
            transform: `translate3d(${-heroTilt.x * 25}px, ${-heroTilt.y * 25}px, 0)`
          }}
        />
        <div
          className="absolute top-1/2 -right-32 w-[32rem] h-[32rem] bg-[#542B43]/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 ease-out"
          style={{
            transform: `translate3d(${heroTilt.x * 35}px, ${heroTilt.y * 35}px, 0)`
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Animated Top Pill */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#542B43]/10 border border-[#D9A6AC]/50 text-[#542B43] text-xs font-semibold tracking-wide backdrop-blur-xs"
              >
                <img src="/logo.jpg" alt="ShopSync Logo" className="w-4 h-4 rounded-full object-cover shadow-2xs" />
                <span>Next-Gen Haute Beauty Atelier & Smart POS</span>
              </motion.div>

              {/* Cinematic Heading Reveal */}
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#282426] leading-[1.12]"
                >
                  Where <span className="italic font-normal text-[#542B43]">Haute Formulations</span> Meet Optical AI.
                </motion.h1>
              </div>

              {/* Subtitle with Blur Reveal */}
              <motion.p
                initial={{ opacity: 0, y: 25, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-base sm:text-lg text-[#524B4F] leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal"
              >
                Clean clinical skincare, inclusive shade science, and zero-irritant cosmetic formulations. Analyzed by optical AI algorithms and synchronized live with our retail boutique.
              </motion.p>

              {/* Staggered Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <Link
                  to="/shop"
                  className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:scale-102 active:scale-98 flex items-center gap-2 cursor-pointer"
                >
                  Explore Clean Formulas <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/ai-skin-analysis"
                  className="bg-white hover:bg-[#F8F3EE] text-[#542B43] border border-[#D9A6AC] px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-xs hover:shadow-md hover:scale-102 active:scale-98 flex items-center gap-2 cursor-pointer"
                >
                  <Cpu className="w-4 h-4 text-[#542B43]" /> Live AI Face Scanner & Routine
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#827A7F] border-t border-[#E9DED5]"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" /> 100% SkinSafe Certified
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Inclusive 40+ Undertones
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Cruelty-Free & Vegan
                </span>
              </motion.div>
            </div>

            {/* Right: 3D Cosmetic Composition with Interactive Parallax */}
            <div className="lg:col-span-5 relative flex justify-center perspective-1200 preserve-3d">
              {/* 3D Master Showcase Box */}
              <div
                className="relative w-full max-w-md aspect-[4/5] rounded-3xl preserve-3d transition-transform duration-200 ease-out"
                style={{
                  transform: `rotateY(${heroTilt.x * 12}deg) rotateX(${-heroTilt.y * 10}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Background Showcase Frame */}
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white/40 backdrop-blur-md">
                  <img
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&auto=format&fit=crop&q=80"
                    alt="ShopSync Beauty Collection"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#282426]/75 via-transparent to-black/10" />
                </div>

                {/* Floating 3D Cosmetic Item 1: Skincare Serum Bottle */}
                <motion.div
                  animate={{ y: [0, -14, 0], rotateZ: [0, 2, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 -right-6 w-36 h-48 rounded-2xl p-2 bg-white/95 backdrop-blur-md shadow-2xl border border-[#D9A6AC]/60 flex flex-col justify-between hidden sm:flex pointer-events-none"
                  style={{
                    transform: `translate3d(${heroTilt.x * 24}px, ${heroTilt.y * 24}px, 60px)`,
                    boxShadow: '0 25px 40px -10px rgba(84, 43, 67, 0.25)'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400"
                    alt="Peptide Barrier Elixir"
                    className="w-full h-28 object-cover rounded-xl"
                  />
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#827A7F]">Clinical Serum</span>
                    <p className="text-[11px] font-bold text-[#282426] leading-tight">Peptide Elixir</p>
                    <span className="text-[10px] text-emerald-700 font-semibold">100% Ceramide NP</span>
                  </div>
                </motion.div>

                {/* Floating 3D Cosmetic Item 2: Cashmere Lipstick */}
                <motion.div
                  animate={{ y: [0, 16, 0], rotateZ: [0, -2.5, 0] }}
                  transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                  className="absolute -bottom-8 -left-6 w-40 p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-[#D9A6AC]/60 flex items-center gap-3 pointer-events-none"
                  style={{
                    transform: `translate3d(${-heroTilt.x * 30}px, ${-heroTilt.y * 30}px, 90px)`,
                    boxShadow: '0 25px 40px -10px rgba(84, 43, 67, 0.25)'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300"
                    alt="Velvet Cloud Lipstick"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#D9A6AC]">Cashmere Matte</span>
                    <p className="text-xs font-bold text-[#282426]">Plum Couture</p>
                    <span className="text-[10px] text-stone-500 font-mono">$32.00</span>
                  </div>
                </motion.div>

                {/* Floating Holographic AI Badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-10 -left-8 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-[#D9A6AC]/60 flex items-center gap-3 hidden sm:flex pointer-events-none"
                  style={{
                    transform: `translate3d(${heroTilt.x * 20}px, ${heroTilt.y * 20}px, 110px)`
                  }}
                >
                  <div className="h-10 w-10 rounded-xl bg-[#542B43] flex items-center justify-center text-[#D9A6AC] shadow-xs">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#D9A6AC] tracking-wider block">Optical AI Mesh</span>
                    <p className="text-xs font-bold text-[#282426]">99.4% Tone Accuracy</p>
                  </div>
                </motion.div>

                {/* Floating Sparkle Particles Layer */}
                <div className="absolute inset-0 pointer-events-none">
                  <span className="absolute top-4 right-10 text-[#D9A6AC] animate-sparkle text-lg">✦</span>
                  <span className="absolute bottom-16 right-4 text-amber-300 animate-sparkle text-sm" style={{ animationDelay: '1s' }}>✦</span>
                  <span className="absolute top-1/2 -left-4 text-[#D9A6AC] animate-sparkle text-base" style={{ animationDelay: '1.8s' }}>✧</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
              Curated Formulations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#282426] mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-[#542B43] hover:text-[#3B1E2F] flex items-center gap-1 group"
          >
            Browse Complete Catalog <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.slice(0, 6).map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <Link
                to={`/category/${cat.slug}`}
                className="group p-5 rounded-3xl bg-white border border-[#E9DED5] hover:border-[#D9A6AC] hover:shadow-lg transition-all text-center flex flex-col items-center justify-between h-full hover:-translate-y-1"
              >
                <div className="h-14 w-14 rounded-2xl bg-[#F8F3EE] group-hover:bg-[#542B43] text-[#542B43] group-hover:text-[#D9A6AC] flex items-center justify-center transition-all mb-3 group-hover:scale-110 shadow-xs">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-[#282426] group-hover:text-[#542B43] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-stone-400 font-mono mt-1 block">
                    {cat.itemCount || 12} items
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
              Customer Favorites
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#282426] mt-1">
              Boutique Best Sellers
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-[#542B43] hover:text-[#3B1E2F] flex items-center gap-1 group"
          >
            View All Formulations <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. FUTURISTIC AI SKIN ANALYSIS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#542B43] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D9A6AC]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#D9A6AC] text-xs font-semibold backdrop-blur-xs">
                <Cpu className="w-3.5 h-3.5" /> Proprietary Biometric Vision AI
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
                Live AI Face Scanning & Multi-Zone Beauty Diagnostics
              </h2>
              <p className="text-sm sm:text-base text-[#E9DED5] leading-relaxed max-w-xl">
                Open your device camera with live face alignment or upload a portrait. Evaluates 8 visible skin traits (redness, shine, dark spots, acne, pores, and under-eye tone) to synthesize custom AM/PM skincare routines.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/ai-skin-analysis"
                  className="bg-[#D9A6AC] hover:bg-[#F2D8DC] text-[#282426] px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-102"
                >
                  Start Live Face Scanner
                </Link>
                <Link
                  to="/skinsafe"
                  className="border border-white/40 hover:bg-white/10 text-white px-7 py-3.5 rounded-full font-semibold text-xs transition-colors"
                >
                  Check Allergy Ingredients
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-[#D9A6AC]/20 text-[#D9A6AC] mx-auto flex items-center justify-center">
                <Sparkles className="h-7 w-7" />
              </div>
              <h4 className="font-serif font-bold text-lg text-white">Non-Invasive & Private</h4>
              <p className="text-xs text-[#E9DED5]/85 leading-relaxed">
                Evaluated locally in session memory. No facial identity recognition; educational cosmetic guidance only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
              Fresh from Lab
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#282426] mt-1">
              New Botanical Arrivals
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-[#542B43] hover:text-[#3B1E2F] flex items-center gap-1 group"
          >
            Explore All Formulas <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. ATELIER BRANDS CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#E9DED5]/40 rounded-3xl p-8 sm:p-12 border border-[#E9DED5] space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
              Exclusive Partnerships
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
              Featured Clean Beauty Houses
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {BRANDS.map((brand, idx) => (
              <motion.div
                key={brand.id}
                whileHover={{ y: -4 }}
                className="p-5 rounded-2xl bg-white border border-[#E9DED5] text-center space-y-1 shadow-xs hover:border-[#D9A6AC] transition-all"
              >
                <h4 className="font-serif font-bold text-sm text-[#282426]">{brand.name}</h4>
                <p className="text-[10px] text-stone-400 font-medium">{brand.origin}</p>
                <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-[#F8F3EE] text-[#542B43] font-semibold">
                  {brand.badge}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
