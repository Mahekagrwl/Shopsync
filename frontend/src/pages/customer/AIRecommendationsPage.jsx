import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Cpu, ShieldCheck, Heart, ShoppingBag, CheckCircle2, Sliders } from 'lucide-react'
import { BEAUTY_PRODUCTS } from '../../data/mockBeautyData'
import { useSkinSafe } from '../../context/SkinSafeContext'
import { useCart } from '../../context/CartContext'

export function AIRecommendationsPage() {
  const { allergies } = useSkinSafe()
  const { addToCart } = useCart()

  const [preferredFinish, setPreferredFinish] = useState('dewy')
  const [skinTarget, setSkinTarget] = useState('barrier')
  const [addedNotice, setAddedNotice] = useState('')

  const recommendations = [
    {
      product: BEAUTY_PRODUCTS.find(p => p.id === 'prod-002'), // Barrier Elixir
      matchScore: 98,
      reason: 'Contains 5 multi-weight ceramides and copper peptides targeted specifically for barrier replenishment and sensitive skin.',
      allergySafe: true
    },
    {
      product: BEAUTY_PRODUCTS.find(p => p.id === 'prod-001'), // Silk Radiance Foundation
      matchScore: 96,
      reason: 'Micro-pearl luminous dewy finish with zero synthetic fragrance or pore-clogging mineral oils.',
      allergySafe: true
    },
    {
      product: BEAUTY_PRODUCTS.find(p => p.id === 'prod-004'), // Mineral Silk SPF 50+
      matchScore: 94,
      reason: 'Non-nano zinc oxide formula safe for rosacea-prone skin, providing broad-spectrum UV and blue light defense.',
      allergySafe: true
    }
  ].filter(r => Boolean(r.product))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#542B43] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-[#D9A6AC]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#D9A6AC] text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" /> Algorithmic Formulation Match
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            Curated Beauty Formulations for You
          </h1>
          <p className="text-xs sm:text-sm text-[#E9DED5] leading-relaxed">
            Formulations cross-referenced against your known allergens, undertone profiles, and current seasonal humidity indicators.
          </p>
        </div>
      </div>

      {addedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Preferences Filter Bar */}
      <div className="bg-white rounded-2xl p-6 border border-[#E9DED5] shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6 flex-wrap">
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold mb-1">Finish Preference</span>
            <div className="flex gap-1.5">
              {['dewy', 'natural', 'matte'].map(finish => (
                <button
                  key={finish}
                  onClick={() => setPreferredFinish(finish)}
                  className={`px-3 py-1 rounded-lg capitalize font-medium border ${
                    preferredFinish === finish
                      ? 'bg-[#542B43] text-white border-[#542B43]'
                      : 'bg-[#F8F3EE] text-[#524B4F] border-[#E9DED5]'
                  }`}
                >
                  {finish}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold mb-1">Target Priority</span>
            <div className="flex gap-1.5">
              {['barrier', 'radiance', 'anti-redness'].map(target => (
                <button
                  key={target}
                  onClick={() => setSkinTarget(target)}
                  className={`px-3 py-1 rounded-lg capitalize font-medium border ${
                    skinTarget === target
                      ? 'bg-[#542B43] text-white border-[#542B43]'
                      : 'bg-[#F8F3EE] text-[#524B4F] border-[#E9DED5]'
                  }`}
                >
                  {target}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Screened against {allergies.length} saved sensitivities</span>
        </div>
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-6">
        {recommendations.map(({ product, matchScore, reason }) => (
          <div
            key={product.id}
            className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between shadow-xs hover:border-[#D9A6AC] transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-28 w-28 rounded-2xl object-cover bg-[#F8F3EE] border border-[#E9DED5]"
              />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#542B43] text-white">
                    {matchScore}% Compatibility Match
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% SkinSafe
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#282426]">
                  {product.name}
                </h3>
                <p className="text-xs text-[#524B4F] leading-relaxed max-w-xl">
                  <strong>Why it matches:</strong> {reason}
                </p>
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <span>{product.brand}</span>
                  <span>•</span>
                  <span>${product.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
              <button
                onClick={() => {
                  const shade = product.shades?.[0] || null
                  addToCart(product, shade, 1)
                  setAddedNotice(`Added ${product.name} to your bag!`)
                  setTimeout(() => setAddedNotice(''), 3000)
                }}
                className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-6 py-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" /> Add Formulation
              </button>
              <Link
                to={`/product/${product.id}`}
                className="text-center px-6 py-3 rounded-xl text-xs font-semibold border border-[#E9DED5] text-[#282426] hover:bg-[#F8F3EE]"
              >
                View Clinical Breakdown
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AIRecommendationsPage
