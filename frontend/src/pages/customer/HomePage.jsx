import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  RefreshCw,
  Cpu,
  Star,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Flame,
  Heart,
  Droplets,
  Layers,
  Award,
  Store,
  Compass,
  CheckCircle,
  Truck,
  IndianRupee,
  Search,
  Tag
} from 'lucide-react'
import { BEAUTY_PRODUCTS, CATEGORIES, BRANDS, MOCK_REVIEWS } from '../../data/mockBeautyData'
import ProductCard from '../../components/common/ProductCard'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import RoleSelectionModal from '../../components/common/RoleSelectionModal'
import { formatINR } from '../../utils/currency'

export function HomePage() {
  const [copiedCode, setCopiedCode] = useState(false)
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 })
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [activeCategoryTab, setActiveCategoryTab] = useState('all')

  const copyPromo = () => {
    navigator.clipboard.writeText('SHOPSYNC15')
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2500)
  }

  // 3D Parallax Mouse Tracker (Desktop only)
  const handleHeroMouseMove = (e) => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const { currentTarget, clientX, clientY } = e
    const rect = currentTarget.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((clientY - rect.top) / rect.height - 0.5) * 2
    setHeroTilt({ x, y })
  }

  const handleHeroMouseLeave = () => {
    setHeroTilt({ x: 0, y: 0 })
  }

  // Filtered Products based on rotating tabs
  const tabCategories = [
    { id: 'all', label: 'All Collections' },
    { id: 'makeup', label: 'Makeup' },
    { id: 'skincare', label: 'Skincare' },
    { id: 'haircare', label: 'Haircare' },
    { id: 'fragrance', label: 'Fragrance' },
    { id: 'bodycare', label: 'Bodycare' },
  ]

  const filteredTabProducts = activeCategoryTab === 'all'
    ? BEAUTY_PRODUCTS.slice(0, 8)
    : BEAUTY_PRODUCTS.filter(p => p.category === activeCategoryTab)

  const trendingProducts = BEAUTY_PRODUCTS.slice(0, 4)
  const bestSellers = BEAUTY_PRODUCTS.filter(p => p.isBestSeller).slice(0, 4)
  const newArrivals = BEAUTY_PRODUCTS.filter(p => p.isNewArrival || p.id === 'prod-006' || p.id === 'prod-009' || p.id === 'prod-012').slice(0, 4)
  const makeupProducts = BEAUTY_PRODUCTS.filter(p => p.category === 'makeup').slice(0, 4)
  const skincareProducts = BEAUTY_PRODUCTS.filter(p => p.category === 'skincare').slice(0, 4)
  const haircareProducts = BEAUTY_PRODUCTS.filter(p => p.category === 'haircare').slice(0, 4)
  const fragranceProducts = BEAUTY_PRODUCTS.filter(p => p.category === 'fragrance' || p.subcategory === 'fragrance').slice(0, 4)

  return (
    <div className="space-y-24 pb-16 overflow-hidden relative bg-[#FFF9F5]">
      {/* 1. CINEMATIC 3D HERO SECTION */}
      <section
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative overflow-hidden bg-gradient-to-b from-[#FFF9F5] via-[#F4C6D5]/20 to-[#FFF9F5] pt-12 pb-24 lg:pt-20 lg:pb-32 border-b border-[#F4C6D5]/60"
      >
        {/* Animated background bubbles, soft gradient blobs & particles */}
        <AnimatedBackground variant="hero" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headlines & Call-to-Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Animated Top Pill */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-[#F4C6D5] text-[#352137] text-xs font-semibold tracking-wide backdrop-blur-md shadow-xs"
              >
                <img
                  src="/logo.jpg"
                  alt="SHOPSYNC Logo"
                  className="w-4 h-4 rounded-full object-cover shadow-2xs"
                />
                <span className="font-bold text-[#D985A5]">SHOPSYNC</span>
                <span className="text-stone-400">•</span>
                <span>Smart Beauty. Smarter Business.</span>
              </motion.div>

              {/* Exact Main Headline */}
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#352137] leading-[1.14]"
                >
                  Discover Your Beauty.{' '}
                  <span className="italic font-normal text-[#D985A5] block mt-1">Shop Smarter.</span>
                </motion.h1>
              </div>

              {/* Exact Supporting Headline */}
              <motion.p
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal"
              >
                Explore your favourite beauty essentials, discover products that suit your preferences and enjoy a smarter shopping experience with SHOPSYNC.
              </motion.p>

              {/* CTAs: "SHOP NOW", "EXPLORE COLLECTION", and Glowing "BUY NOW" */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <Link
                  to="/shop"
                  className="bg-[#352137] hover:bg-[#542B43] text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#F4C6D5]" /> SHOP NOW
                </Link>

                <a
                  href="#trending"
                  className="bg-white hover:bg-[#FFF9F5] text-[#352137] border-2 border-[#D985A5] px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-xs hover:shadow-md hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#D985A5]" /> EXPLORE COLLECTION
                </a>

                <button
                  onClick={() => setRoleModalOpen(true)}
                  className="bg-gradient-to-r from-[#D985A5] via-[#C58A78] to-[#352137] text-white px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-2xl hover:scale-108 active:scale-95 flex items-center gap-2 cursor-pointer border border-white/40 animate-pulse"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" /> BUY NOW / SWITCH ROLE
                </button>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-600 border-t border-[#F4C6D5]/60"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Authentic Indian Brands
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> AI Skin & Shade Matching
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> SkinSafe Allergen Screening
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Truck className="w-4 h-4 text-emerald-600" /> Free Pan-India Delivery &gt; ₹499
                </span>
              </motion.div>
            </div>

            {/* Right Column: 3D Cosmetic Composition with Interactive Parallax */}
            <div className="lg:col-span-5 relative flex justify-center perspective-1200 preserve-3d">
              <div
                className="relative w-full max-w-md aspect-[4/5] rounded-3xl preserve-3d transition-transform duration-200 ease-out"
                style={{
                  transform: `rotateY(${heroTilt.x * 12}deg) rotateX(${-heroTilt.y * 10}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Background Showcase Frame */}
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white/60 backdrop-blur-md">
                  <img
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&auto=format&fit=crop&q=80"
                    alt="SHOPSYNC Indian Beauty Collection"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#352137]/80 via-transparent to-black/10" />
                  <div className="absolute bottom-6 inset-x-6 text-white text-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#F4C6D5]">
                      Luxury Indian Formulations
                    </span>
                    <p className="font-serif text-lg font-bold">Lakmé • Maybelline • Minimalist</p>
                  </div>
                </div>

                {/* Floating 3D Cosmetic Item 1: Skincare Serum Bottle */}
                <motion.div
                  animate={{ y: [0, -14, 0], rotateZ: [0, 2, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 -right-6 w-40 h-50 rounded-2xl p-2.5 bg-white/95 backdrop-blur-md shadow-2xl border border-[#F4C6D5] flex flex-col justify-between hidden sm:flex pointer-events-none"
                  style={{
                    transform: `translate3d(${heroTilt.x * 24}px, ${heroTilt.y * 24}px, 60px)`,
                    boxShadow: '0 25px 40px -10px rgba(53, 33, 55, 0.25)'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400"
                    alt="Minimalist Serum"
                    className="w-full h-28 object-cover rounded-xl"
                  />
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#A56D8A]">10% Niacinamide</span>
                    <p className="text-[11px] font-bold text-[#352137] leading-tight">Minimalist Blemish Serum</p>
                    <span className="text-[10px] text-emerald-700 font-bold">{formatINR(599)}</span>
                  </div>
                </motion.div>

                {/* Floating 3D Cosmetic Item 2: SUGAR Lipstick */}
                <motion.div
                  animate={{ y: [0, 16, 0], rotateZ: [0, -2.5, 0] }}
                  transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                  className="absolute -bottom-8 -left-6 w-44 p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-[#F4C6D5] flex items-center gap-3 pointer-events-none"
                  style={{
                    transform: `translate3d(${-heroTilt.x * 30}px, ${-heroTilt.y * 30}px, 90px)`,
                    boxShadow: '0 25px 40px -10px rgba(53, 33, 55, 0.25)'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300"
                    alt="SUGAR Matte As Hell"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#D985A5]">Matte Crayon</span>
                    <p className="text-xs font-bold text-[#352137]">Scarlett O'Hara</p>
                    <span className="text-[10px] text-[#352137] font-bold">{formatINR(849)}</span>
                  </div>
                </motion.div>

                {/* Floating Holographic AI Badge */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-1/2 -left-8 bg-[#352137] text-white p-3 rounded-2xl shadow-xl border border-[#D985A5] flex items-center gap-2.5 hidden sm:flex pointer-events-none"
                  style={{
                    transform: `translate3d(${heroTilt.x * 15}px, ${heroTilt.y * 15}px, 110px)`
                  }}
                >
                  <div className="h-8 w-8 rounded-full bg-[#D985A5] flex items-center justify-center text-[#352137]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#F4C6D5]">AI Shade Match</p>
                    <p className="text-xs font-semibold">98.4% Accuracy</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION 1: ROTATING CATEGORY NAVIGATION TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4C6D5]/40 text-[#352137] text-xs font-bold uppercase tracking-wider">
            <RefreshCw className="w-3.5 h-3.5 text-[#D985A5] animate-spin" style={{ animationDuration: '8s' }} />
            <span>Interactive Catalog Filter</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#352137]">
            Curated Beauty Formulations
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            Switch between categories to explore clinical skincare, high-pigment makeup, and traditional Ayurvedic hair care.
          </p>
        </div>

        {/* Rotating Tabs Bar */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {tabCategories.map((tab) => {
            const isActive = activeCategoryTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategoryTab(tab.id)}
                className={`relative px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#352137] text-white shadow-md scale-105'
                    : 'bg-white text-stone-700 border border-[#F4C6D5] hover:border-[#D985A5] hover:bg-[#FFF9F5]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeTabPill"
                    className="absolute inset-0 rounded-full bg-[#352137] -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="flex items-center gap-1.5">
                  {tab.id === 'makeup' && '💄'}
                  {tab.id === 'skincare' && '✨'}
                  {tab.id === 'haircare' && '🌿'}
                  {tab.id === 'fragrance' && '🌹'}
                  {tab.id === 'bodycare' && '🧴'}
                  {tab.id === 'all' && '✦'}
                  <span>{tab.label}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Tab Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTabProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. SECTION 2: TRENDING NOW */}
      <section id="trending" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#F4C6D5]/60">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D985A5]">
              <Flame className="w-4 h-4 text-rose-500" /> Most Desired Across India
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#352137] mt-1">
              Trending Right Now
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-[#352137] hover:text-[#D985A5] flex items-center gap-1.5 transition-colors"
          >
            <span>View All Trending ({BEAUTY_PRODUCTS.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. SECTION 3: BEST SELLERS */}
      <section id="bestsellers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#F4C6D5]/60">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> Rated 4.8+ Stars
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#352137] mt-1">
              Customer Best Sellers
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-[#352137] hover:text-[#D985A5] flex items-center gap-1.5 transition-colors"
          >
            <span>Explore All Best Sellers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. SECTION 4: NEW ARRIVALS */}
      <section id="new-arrivals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#F4C6D5]/60">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A56D8A]">
              <Sparkles className="w-4 h-4 text-[#D985A5]" /> Just Landed
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#352137] mt-1">
              New Arrivals & Innovations
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-[#352137] hover:text-[#D985A5] flex items-center gap-1.5 transition-colors"
          >
            <span>Browse New Additions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. SECTION 5: MAKEUP ESSENTIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#FFF9F5] via-[#F4C6D5]/30 to-[#FFF9F5] p-6 sm:p-10 border border-[#F4C6D5]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D985A5]">
                Complexion & Couture Lips
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#352137] mt-1">
                Makeup Essentials
              </h2>
            </div>
            <Link
              to="/category/makeup"
              className="text-xs font-bold uppercase tracking-wider text-[#352137] hover:text-[#D985A5] flex items-center gap-1"
            >
              <span>Explore Makeup Range</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {makeupProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. SECTION 6: SKINCARE FAVOURITES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#FFF9F5] via-[#A56D8A]/15 to-[#FFF9F5] p-6 sm:p-10 border border-[#F4C6D5]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Clinical Actives & Barrier Science
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#352137] mt-1">
                Skincare Favourites
              </h2>
            </div>
            <Link
              to="/category/skincare"
              className="text-xs font-bold uppercase tracking-wider text-[#352137] hover:text-[#D985A5] flex items-center gap-1"
            >
              <span>Explore Skincare Range</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skincareProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. SECTION 7 & 8: HAIRCARE & FRAGRANCE HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Haircare Card */}
        <div className="rounded-3xl bg-white border border-[#F4C6D5] p-8 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D985A5]">
              Ayurvedic & Botanical
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#352137]">
              Haircare & Scalp Wellness
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Formulations powered by onion seed extracts, Redensyl, bhringraj, and cold-pressed oils engineered to curb hair fall and nourish Indian hair textures.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[#F4C6D5]/60">
            <span className="text-xs font-bold text-[#352137]">Featuring Mamaearth Onion Oil ({formatINR(419)})</span>
            <Link
              to="/category/haircare"
              className="bg-[#352137] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#542B43] transition-colors"
            >
              View Haircare
            </Link>
          </div>
        </div>

        {/* Fragrance Card */}
        <div className="rounded-3xl bg-white border border-[#F4C6D5] p-8 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C58A78]">
              Royal Oriental Blends
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#352137]">
              Haute Parfumerie & Attars
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Opulent notes of Damascus Rose, aged Assam Agarwood (Oud), saffron threads, and warm amber cashmere with up to 18 hours of luxurious sillage.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[#F4C6D5]/60">
            <span className="text-xs font-bold text-[#352137]">Royal Velvet Oud EDP ({formatINR(1850)})</span>
            <Link
              to="/category/fragrance"
              className="bg-[#C58A78] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#a56d8a] transition-colors"
            >
              View Fragrances
            </Link>
          </div>
        </div>
      </section>

      {/* 9. SECTION 9: TOP INDIAN BEAUTY BRANDS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4C6D5]/40 text-[#352137] text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#D985A5]" />
            <span>Official Atelier Partners</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#352137]">
            Top Indian & Global Beauty Brands
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            100% authentic, dermatologically tested formulations certified for quality, potency, and safety.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {BRANDS.map((brand) => (
            <div
              key={brand.id}
              className="p-5 rounded-2xl bg-white border border-[#F4C6D5] hover:border-[#D985A5] hover:shadow-md transition-all text-center flex flex-col justify-center items-center space-y-1.5 group cursor-pointer"
            >
              <span className="font-serif text-sm font-bold text-[#352137] group-hover:text-[#D985A5] transition-colors">
                {brand.name}
              </span>
              <span className="text-[10px] text-stone-500 font-medium">
                {brand.badge}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 10. SECTION 10: CUSTOMER REVIEWS & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D985A5]">
            Loved by Beauty Enthusiasts
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#352137]">
            Verified Customer Stories
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-white border border-[#F4C6D5] shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex text-amber-500 gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#F4C6D5]/40 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#352137]">{rev.author}</p>
                  <p className="text-[10px] text-stone-500">{rev.city}</p>
                </div>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. SECTION 11: SPECIAL FESTIVE OFFERS & DISCOUNTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#352137] via-[#542B43] to-[#352137] text-white p-8 sm:p-14 overflow-hidden shadow-2xl border border-[#D985A5]/40">
          <div className="relative z-10 max-w-2xl space-y-4 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D985A5]/30 text-[#F4C6D5] text-xs font-bold uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" /> Festive Beauty Celebrations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Get Flat 15% Off Your First Order + Free Express Delivery
            </h2>
            <p className="text-xs sm:text-sm text-[#F4C6D5] leading-relaxed">
              Enjoy flat 15% discount across all Indian beauty brands. Complimentary express delivery across India on all orders over ₹499.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <button
                onClick={copyPromo}
                className="bg-white text-[#352137] hover:bg-[#FFF9F5] px-5 py-3 rounded-2xl font-mono text-sm font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <span>CODE: SHOPSYNC15</span>
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setRoleModalOpen(true)}
                className="bg-[#D985A5] hover:bg-[#F4C6D5] text-[#352137] px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                Claim Offer & Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 12. SECTION 12: PERSONALIZED AI RECOMMENDATIONS & INGREDIENT GUARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border-2 border-[#F4C6D5] p-8 sm:p-12 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D985A5]/20 text-[#352137] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SkinSafe™ Ingredient Guard & AI Diagnostics</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#352137]">
              Never Experience Another Cosmetic Reaction
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
              Our optical AI scans your face across 8 skin traits, matches exact undertones for warm Indian skin, and flags conflicting allergens (like nut oils, fragrance, or high-percentage BHA) before you checkout.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/ai-skin-analysis"
                className="bg-[#352137] hover:bg-[#542B43] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 transition-transform hover:scale-102"
              >
                <Cpu className="w-4 h-4 text-[#F4C6D5]" /> Start Free AI Face Scan
              </Link>
              <Link
                to="/feedback"
                className="bg-[#FFF9F5] border border-[#F4C6D5] text-[#352137] hover:bg-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Report an Allergy / Feedback
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="p-6 rounded-2xl bg-[#FFF9F5] border border-[#F4C6D5] text-center space-y-3 w-full max-w-xs shadow-xs">
              <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="font-serif font-bold text-base text-[#352137]">100% Allergen Shield</p>
              <p className="text-[11px] text-stone-600">
                140+ irritants cross-checked automatically against your skin profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
      />
    </div>
  )
}

export default HomePage
