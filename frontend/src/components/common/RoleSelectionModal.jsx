import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  Store,
  Sparkles,
  ArrowRight,
  X,
  ShieldCheck,
  Zap,
  TrendingUp,
  Sliders,
  CheckCircle2
} from 'lucide-react'

export function RoleSelectionModal({ isOpen, onClose }) {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleSelectCustomer = () => {
    onClose()
    navigate('/shop')
  }

  const handleSelectCustomerAuth = () => {
    onClose()
    navigate('/login')
  }

  const handleSelectOwner = () => {
    onClose()
    navigate('/admin/dashboard')
  }

  const handleSelectPOS = () => {
    onClose()
    navigate('/admin/pos-billing')
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#352137]/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl rounded-3xl bg-[#FFF9F5] border border-[#F4C6D5] p-6 sm:p-10 shadow-2xl overflow-hidden z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-[#352137] hover:bg-[#F4C6D5]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4C6D5]/40 text-[#352137] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D985A5]" /> SHOPSYNC Omnichannel Gateway
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#352137]">
              Choose Your SHOPSYNC Experience
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
              Smart Beauty for Customers. Smarter Retail Intelligence for Store Owners.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Customer Option */}
            <div className="group relative rounded-2xl bg-white border-2 border-[#F4C6D5]/70 p-6 sm:p-7 space-y-5 shadow-xs hover:shadow-xl hover:border-[#D985A5] transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#F4C6D5] to-[#D985A5] flex items-center justify-center text-[#352137] shadow-sm">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D985A5]">
                    Shopper Portal
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#352137]">
                    Beauty Customer
                  </h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Discover authentic Indian beauty formulations (Lakmé, Maybelline, Minimalist, Plum), AI skin & shade diagnostics, clean allergen screening, and express Pan-India shipping.
                </p>

                <div className="space-y-1.5 pt-2 border-t border-[#F4C6D5]/40 text-[11px] text-stone-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Free express shipping over ₹499</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>AI shade & sensitivity checker</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Report product reactions & feedback</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSelectCustomer}
                  className="w-full bg-[#352137] hover:bg-[#542B43] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-102"
                >
                  <span>Explore & Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSelectCustomerAuth}
                  className="w-full bg-[#F4C6D5]/30 hover:bg-[#F4C6D5]/60 text-[#352137] py-2 px-4 rounded-xl text-xs font-semibold transition-colors"
                >
                  Customer Sign In / Register
                </button>
              </div>
            </div>

            {/* 2. Store Owner Option */}
            <div className="group relative rounded-2xl bg-white border-2 border-[#C58A78]/70 p-6 sm:p-7 space-y-5 shadow-xs hover:shadow-xl hover:border-[#352137] transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#352137] to-[#542B43] flex items-center justify-center text-white shadow-sm">
                  <Store className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C58A78]">
                    Retail Management
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#352137]">
                    Beauty Store Owner
                  </h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Manage your boutique retail operations: Instant Smart POS barcode billing, live stock & batch control, sales & profit forecasting, and review Customer Incident Reports.
                </p>

                <div className="space-y-1.5 pt-2 border-t border-[#F4C6D5]/40 text-[11px] text-stone-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Real-time POS register with GST billing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Customer reaction & allergy incident log</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>AI demand forecasting & reordering</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSelectPOS}
                  className="w-full bg-[#C58A78] hover:bg-[#a56d8a] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-102"
                >
                  <span>Launch POS Register</span>
                  <Zap className="w-4 h-4 text-amber-200" />
                </button>
                <button
                  onClick={handleSelectOwner}
                  className="w-full bg-[#352137]/10 hover:bg-[#352137]/20 text-[#352137] py-2 px-4 rounded-xl text-xs font-semibold transition-colors"
                >
                  Owner Dashboard & Reports
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-[11px] text-stone-500">
            You can effortlessly switch roles anytime from the top navigation bar.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default RoleSelectionModal
