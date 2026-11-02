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
  Tag,
  ShieldAlert,
  Clock,
  Sparkle,
  RotateCcw,
  HelpCircle,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react'
import { BEAUTY_PRODUCTS, BRANDS, MOCK_REVIEWS } from '../../data/mockBeautyData'
import { useProducts } from '../../context/ProductContext'
import ProductCard from '../../components/common/ProductCard'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import RoleSelectionModal from '../../components/common/RoleSelectionModal'
import { formatINR } from '../../utils/currency'

export function HomePage() {
  const { products } = useProducts()
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

  // 4 Primary Required Categories
  const FEATURED_CATEGORIES = [
    {
      id: 'skincare',
      title: 'Skincare',
      description: 'Clinical actives, 10% Niacinamide, Hyaluronic hydration & barrier repair formulations.',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
      link: '/category/skincare',
      badge: 'Clinically Tested',
      productCount: '180+ Formulations'
    },
    {
      id: 'makeup',
      title: 'Makeup',
      description: 'Flawless matte foundations, high-pigment lipsticks, waterproof kajals & blushes.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      link: '/category/makeup',
      badge: 'Pro Artistry',
      productCount: '240+ Shades'
    },
    {
      id: 'haircare',
      title: 'Haircare',
      description: 'Ayurvedic onion seed oils, Redensyl scalp therapy & bond repair conditioning masks.',
      image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80',
      link: '/category/haircare',
      badge: 'Ayurvedic Actives',
      productCount: '95+ Formulations'
    },
    {
      id: 'beauty-essentials',
      title: 'Beauty Essentials',
      description: 'Sunscreen fluid SPF 50+, precision blending tools, micellar waters & routine kits.',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
      link: '/shop',
      badge: 'Everyday Must-Haves',
      productCount: '120+ Essentials'
    }
  ]

  // Filtered Products based on rotating tabs
  const tabCategories = [
    { id: 'all', label: 'All Collections' },
    { id: 'skincare', label: 'Skincare' },
    { id: 'makeup', label: 'Makeup' },
    { id: 'haircare', label: 'Haircare' },
    { id: 'fragrance', label: 'Fragrance' },
    { id: 'bodycare', label: 'Bodycare' },
  ]

  const filteredTabProducts = activeCategoryTab === 'all'
    ? products.slice(0, 8)
    : products.filter(p => p.category === activeCategoryTab)

  const trendingProducts = products.slice(0, 4)
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4)

  return (
    <div className="space-y-24 pb-16 overflow-hidden relative bg-[#FFF9F5]">
      {/* 1. CINEMATIC HERO SECTION */}
      <section
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative overflow-hidden bg-gradient-to-b from-[#FFF9F5] via-[#F4C6D5]/25 to-[#FFF9F5] pt-12 pb-24 lg:pt-20 lg:pb-32 border-b border-[#F4C6D5]/60"
      >
        {/* Subtle moving gradients and floating particles */}
        <AnimatedBackground variant="hero" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Required Headlines & CTA Buttons */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Brand Pill */}
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
                  className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#352137] leading-[1.12]"
                >
                  Your Beauty. Your Style.{' '}
                  <span className="italic font-normal text-[#D985A5] block mt-1">Your Shop.</span>
                </motion.h1>
              </div>

              {/* Exact Supporting Headline */}
              <motion.p
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-base sm:text-xl text-stone-700 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal"
              >
                Everything You Love, All in One Place.
              </motion.p>

              {/* Required CTAs: "Explore Collection" & "Shop Now" */}
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
                  <ShoppingBag className="w-4 h-4 text-[#F4C6D5]" /> Shop Now
                </Link>

                <a
                  href="#categories"
                  className="bg-white hover:bg-[#FFF9F5] text-[#352137] border-2 border-[#D985A5] px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-xs hover:shadow-md hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#D985A5]" /> Explore Collection
                </a>

                <button
                  onClick={() => setRoleModalOpen(true)}
                  className="bg-gradient-to-r from-[#D985A5] via-[#C58A78] to-[#352137] text-white px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer border border-white/40"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" /> Switch Role / POS
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
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Curated Indian Skin Tones
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#352137]/85 via-transparent to-black/10" />
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

                {/* Floating Dermatologically Tested Badge */}
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
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#F4C6D5]">Derm Tested</p>
                    <p className="text-xs font-semibold">100% Genuine</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT CATEGORIES (Skincare, Makeup, Haircare, Beauty Essentials) */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4C6D5]/40 text-[#352137] text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-[#D985A5]" />
            <span>Curated Collections</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#352137]">
            Shop By Categories
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            Discover precision beauty formulations tailored to your skin tone, texture, and personal care routine.
          </p>
        </div>

        {/* 4 Category Cards with Hover Animation and Image Zoom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-3xl overflow-hidden bg-white border border-[#F4C6D5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Container with Subtle Zoom */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#352137] shadow-xs">
                  {cat.badge}
                </span>
                <span className="absolute bottom-3 left-4 text-white text-xs font-medium">
                  {cat.productCount}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#352137] group-hover:text-[#D985A5] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1.5">
                    {cat.description}
                  </p>
                </div>

                <Link
                  to={cat.link}
                  className="pt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#352137] group-hover:text-[#D985A5] transition-colors"
                >
                  <span>Explore {cat.title}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. TRENDING PRODUCTS */}
      <section id="trending" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#F4C6D5]/60">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D985A5]">
              <Flame className="w-4 h-4 text-rose-500" /> Most Desired Across India
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#352137] mt-1">
              Trending Products
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-[#352137] hover:text-[#D985A5] flex items-center gap-1.5 transition-colors"
          >
            <span>View All Trending</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. BESTSELLING PRODUCTS */}
      <section id="bestsellers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#F4C6D5]/60">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> Rated 4.8+ Stars
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#352137] mt-1">
              Bestselling Formulations
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-[#352137] hover:text-[#D985A5] flex items-center gap-1.5 transition-colors"
          >
            <span>Explore All Bestsellers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. SPECIAL OFFERS & DISCOUNTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#352137] via-[#542B43] to-[#352137] text-white p-8 sm:p-14 overflow-hidden shadow-2xl border border-[#D985A5]/40">
          <div className="relative z-10 max-w-2xl space-y-4 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D985A5]/30 text-[#F4C6D5] text-xs font-bold uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" /> Special Offers & Celebrations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Get Flat 15% Off Your First Order + Free Express Delivery
            </h2>
            <p className="text-xs sm:text-sm text-[#F4C6D5] leading-relaxed">
              Use promo code <span className="font-mono font-bold text-white">SHOPSYNC15</span> at checkout. Complimentary express shipping across India on orders over ₹499.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <button
                onClick={copyPromo}
                className="bg-white text-[#352137] hover:bg-[#FFF9F5] px-5 py-3 rounded-2xl font-mono text-sm font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <span>CODE: SHOPSYNC15</span>
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>

              <Link
                to="/shop"
                className="bg-[#D985A5] hover:bg-[#F4C6D5] text-[#352137] px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE SHOPSYNC */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4C6D5]/40 text-[#352137] text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#D985A5]" />
            <span>The ShopSync Difference</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#352137]">
            Why Choose ShopSync?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            Combining dermatological safety, authentic Indian beauty heritage, and pure formulations with local boutique empowerment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Award,
              title: '100% Authentic Indian Brands',
              desc: 'Direct atelier sourcing from Lakmé, Maybelline, Minimalist, Plum, SUGAR, and Dot & Key. No grey market stock.'
            },
            {
              icon: Sparkles,
              title: 'Curated Shade Matching',
              desc: 'Diverse pigment formulations calibrated specifically for warm, cool, and olive Indian undertones.'
            },
            {
              icon: ShieldCheck,
              title: 'SkinSafe™ Allergen Screening',
              desc: 'Pre-checkout ingredient scans automatically flag parabens, sulfates, nut oils, and fragrance triggers.'
            },
            {
              icon: Truck,
              title: 'Complimentary Pan-India Delivery',
              desc: 'Free express shipping across 28,000+ PIN codes on all orders over ₹499 with live tracking updates.'
            },
            {
              icon: RotateCcw,
              title: 'Hassle-Free Returns & Support',
              desc: '15-day genuine product return policy backed by our dedicated Vadodara concierge support team.'
            },
            {
              icon: Store,
              title: 'Integrated Seller POS Ecosystem',
              desc: 'Local salons and boutique stores leverage our cloud POS, FEFO batch expiry alerts, and inventory intelligence.'
            }
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="p-6 rounded-3xl bg-white border border-[#F4C6D5] shadow-xs hover:shadow-md transition-shadow space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FFF9F5] border border-[#F4C6D5] text-[#352137] flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#D985A5]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#352137]">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* 7. ABOUT SHOPSYNC SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="rounded-3xl bg-white border-2 border-[#F4C6D5] p-8 sm:p-14 shadow-lg space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D985A5]">
              About ShopSync
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#352137]">
              Smart Beauty. Smarter Business.
            </h2>
            <p className="text-sm text-stone-700 leading-relaxed font-normal">
              ShopSync was born in Vadodara, Gujarat to bridge the gap between premium dermatological formulations and everyday Indian beauty shopping. We unite two vital retail worlds on a single high-performance platform:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#F4C6D5]/60">
            {/* For Customers */}
            <div className="p-6 rounded-2xl bg-[#FFF9F5] border border-[#F4C6D5] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#352137]">
                <ShoppingBag className="w-4 h-4 text-[#D985A5]" />
                <span>For Beauty Lovers</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#352137]">
                Clean Formulations & Dermatological Care
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Enjoy authentic formulations from top Indian & global ateliers. Our dermatologist-tested standards and SkinSafe™ ingredient transparency ensure every serum, moisturizer, and lipstick matches your skin profile and allergen needs.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#352137] hover:text-[#D985A5] pt-2"
              >
                <span>Browse The Atelier</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* For Sellers */}
            <div className="p-6 rounded-2xl bg-[#FFF9F5] border border-[#F4C6D5] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#352137]">
                <Store className="w-4 h-4 text-[#C58A78]" />
                <span>For Retailers & Salons</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#352137]">
                Boutique POS & Expiry Management
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Empowering independent beauty merchants and salon directors with cloud-based point-of-sale billing, FEFO batch expiry alerts, real-time GST tax compliance, and automated inventory replenishment.
              </p>
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#352137] hover:text-[#C58A78] pt-2"
              >
                <span>Enter Seller Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. HELP & CUSTOMER CONCIERGE SECTION */}
      <section id="help" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="rounded-3xl bg-white border-2 border-[#F4C6D5] p-8 sm:p-12 shadow-lg space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4C6D5]/40 text-[#352137] text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 text-[#D985A5]" />
              <span>Customer Care & FAQs</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#352137]">
              How Can We Help You?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Our Vadodara beauty concierge team is here to assist with product formulation queries, orders, shipping, and store owner support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-[#FFF9F5] border border-[#F4C6D5] space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-[#F4C6D5]/50 flex items-center justify-center text-[#352137] mx-auto sm:mx-0">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#352137]">Pan-India Shipping</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Free standard express shipping on orders exceeding ₹499 across all Indian PIN codes. Orders dispatched within 24 hours.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFF9F5] border border-[#F4C6D5] space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-[#F4C6D5]/50 flex items-center justify-center text-[#352137] mx-auto sm:mx-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#352137]">15-Day Return Guarantee</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Unopened beauty items or products triggering adverse skin reactions can be returned within 15 days with full refund or store credit.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFF9F5] border border-[#F4C6D5] space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-[#F4C6D5]/50 flex items-center justify-center text-[#352137] mx-auto sm:mx-0">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#352137]">Concierge Support</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Speak with our team Mon–Sat (9 AM – 8 PM IST) via WhatsApp or email at <span className="font-semibold text-[#352137]">support@shopsync.in</span>.
              </p>
            </div>
          </div>

          <div className="border-t border-[#F4C6D5]/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> All products sourced directly from authorized brand ateliers
            </span>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#352137] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#542B43] transition-colors"
            >
              <span>Explore Formulations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
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
