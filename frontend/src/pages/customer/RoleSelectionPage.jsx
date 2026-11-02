import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Store, ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react'
import AnimatedBackground from '../../components/common/AnimatedBackground'

/**
 * RoleSelectionPage (Phase 2)
 * Presented when user clicks "Login / Get Started".
 * Clear choice between Customer and Seller authentication paths.
 */
export function RoleSelectionPage() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen bg-[#FFF9F5] flex flex-col items-center justify-center px-4 py-12 sm:px-6 overflow-hidden">
      <AnimatedBackground variant="auth" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-4xl w-full text-center space-y-8"
      >
        {/* Header with Logo */}
        <div className="space-y-3">
          <Link to="/" className="inline-block transition-transform hover:scale-105">
            <img
              src="/logo.jpg"
              alt="ShopSync Logo"
              className="h-16 w-16 rounded-2xl object-cover mx-auto shadow-md border border-[#F4C6D5]"
            />
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#352137]">
            Welcome to ShopSync
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            Please select your account type to proceed to your personalized shopping portal or boutique retail console.
          </p>
        </div>

        {/* Two Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto text-left">
          {/* Card 1: Customer */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl bg-white/95 backdrop-blur-md border-2 border-[#F4C6D5] p-7 sm:p-8 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-[#D985A5]"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFF9F5] to-[#F4C6D5]/50 border border-[#F4C6D5] flex items-center justify-center text-[#352137] shadow-sm">
                <ShoppingBag className="w-7 h-7 text-[#D985A5]" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D985A5]">
                  Beauty Shopping
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#352137] mt-1">
                  Customer
                </h2>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Browse authentic luxury Indian beauty formulations, save favorites to your wishlist, track online orders, and access personalized AI skin shade analysis.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#F4C6D5]/50 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Pan-India complimentary delivery &gt; ₹499</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Optical AI skin & undertone matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>SkinSafe™ ingredient allergen screening</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-4">
              <Link
                to="/login"
                className="w-full py-3.5 px-4 rounded-xl bg-[#352137] hover:bg-[#542B43] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Customer Sign In</span>
                <ArrowRight className="w-4 h-4 text-[#F4C6D5]" />
              </Link>
              <Link
                to="/signup"
                className="w-full py-3 px-4 rounded-xl bg-[#FFF9F5] hover:bg-[#F4C6D5]/30 text-[#352137] text-xs font-bold uppercase tracking-wider transition-all border border-[#F4C6D5] flex items-center justify-center gap-1.5"
              >
                <span>Create New Account</span>
              </Link>
            </div>
          </motion.div>

          {/* Card 2: Store Owner / Seller */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl bg-white/95 backdrop-blur-md border-2 border-[#F4C6D5] p-7 sm:p-8 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-[#C58A78]"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFF9F5] to-[#C58A78]/30 border border-[#F4C6D5] flex items-center justify-center text-[#352137] shadow-sm">
                <Store className="w-7 h-7 text-[#C58A78]" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C58A78]">
                  Retail & Operations
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#352137] mt-1">
                  Store Owner / Seller
                </h2>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Manage point-of-sale boutique billing, track FEFO batch expiries, review real-time sales analytics, oversee supplier purchase orders, and monitor customer reaction logs.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#F4C6D5]/50 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Real-time POS barcode scanning & GST billing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>FEFO batch expiry tracking & automated alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Central shared inventory across online & store</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-4">
              <Link
                to="/admin/login"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C58A78] to-[#352137] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Store Owner Sign In</span>
                <ArrowRight className="w-4 h-4 text-amber-200" />
              </Link>
              <div className="text-center py-2 text-[11px] text-stone-500">
                <span>Seller onboarding requires merchant verification</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Public Browsing Shortcut */}
        <div className="pt-2">
          <Link
            to="/store"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#352137] underline transition-colors"
          >
            <span>Or continue browsing products as a guest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default RoleSelectionPage
