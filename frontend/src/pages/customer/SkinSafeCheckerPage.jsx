import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  ArrowRight,
  Sparkles,
  Layers,
  Activity,
  Check
} from 'lucide-react'
import { useSkinSafe } from '../../context/SkinSafeContext'
import { BEAUTY_PRODUCTS, COMMON_ALLERGENS } from '../../data/mockBeautyData'
import { formatINR } from '../../utils/currency'

export function SkinSafeCheckerPage() {
  const { allergies, addAllergy, removeAllergy } = useSkinSafe()

  const [newAllergen, setNewAllergen] = useState('')
  const [pasteText, setPasteText] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [analyzedIngredients, setAnalyzedIngredients] = useState(null)

  // Compare products state
  const [prodAId, setProdAId] = useState(BEAUTY_PRODUCTS[0].id)
  const [prodBId, setProdBId] = useState(BEAUTY_PRODUCTS[1].id)
  const [isComparing, setIsComparing] = useState(false)

  const productA = BEAUTY_PRODUCTS.find(p => p.id === prodAId)
  const productB = BEAUTY_PRODUCTS.find(p => p.id === prodBId)

  const handleAddAllergen = (e) => {
    e.preventDefault()
    if (newAllergen.trim()) {
      addAllergy(newAllergen.trim())
      setNewAllergen('')
    }
  }

  const handleAnalyzePaste = (e) => {
    e.preventDefault()
    if (!pasteText.trim()) return

    setIsScanning(true)
    setAnalyzedIngredients(null)

    setTimeout(() => {
      const lower = pasteText.toLowerCase()
      const flagged = []

      // Check user saved allergies
      allergies.forEach(allergen => {
        const aLow = allergen.toLowerCase()
        if (lower.includes(aLow)) {
          flagged.push({
            name: allergen,
            risk: 'User Blacklist Match',
            status: 'KNOWN_MATCH',
            note: `Directly matches your saved sensitivity: "${allergen}".`
          })
        }
      })

      // Check general high sensitizers
      if (lower.includes('fragrance') || lower.includes('parfum') || lower.includes('linalool') || lower.includes('limonene')) {
        if (!flagged.some(f => f.name.toLowerCase().includes('fragrance'))) {
          flagged.push({
            name: 'Fragrance Compounds (Parfum / Linalool)',
            risk: 'High Sensitizer',
            status: 'KNOWN_MATCH',
            note: 'Common volatile sensitizer known to trigger contact redness and dermal flare-ups.'
          })
        }
      }
      if (lower.includes('sulfate') || lower.includes('sls') || lower.includes('sles')) {
        flagged.push({
          name: 'Sulfates (SLS/SLES Surfactants)',
          risk: 'Stripping Detergent',
          status: 'KNOWN_MATCH',
          note: 'Anionic surfactant capable of disrupting intercellular stratum corneum lipids.'
        })
      }
      if (lower.includes('paraben')) {
        flagged.push({
          name: 'Parabens (Methyl/Propylparaben)',
          risk: 'Preservative Allergen',
          status: 'KNOWN_MATCH',
          note: 'Preservative flagged for reactive and sensitized skin barriers.'
        })
      }
      if (lower.includes('alcohol') && !lower.includes('cetearyl') && !lower.includes('benzyl')) {
        flagged.push({
          name: 'Denatured Alcohol',
          risk: 'Barrier Dehydrator',
          status: 'KNOWN_MATCH',
          note: 'Fast-evaporating solvent that may induce trans-epidermal moisture loss.'
        })
      }

      const tokens = pasteText.split(',').filter(t => t.trim().length > 0)

      setAnalyzedIngredients({
        totalTokens: tokens.length,
        flagged,
        status: flagged.length > 0 ? 'KNOWN_MATCH' : (tokens.length > 0 ? 'NO_REPORTED_MATCH' : 'INCOMPLETE_DATA'),
        safeRating: flagged.length === 0 ? '100% Clean & Hypoallergenic' : 'Allergenic Matches Detected'
      })
      setIsScanning(false)
    }, 900)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#E9DED5] rounded-3xl p-8 sm:p-12 border border-[#D9A6AC]/60 space-y-2 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/30 rounded-full blur-2xl pointer-events-none" />
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          SkinSafe™ Laboratory Verification
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#282426]">
          Allergy & Sensitivity Guardian
        </h1>
        <p className="text-xs sm:text-sm text-[#524B4F] max-w-xl">
          Screen formulations against contact allergens, tree nut oils, stripping sulfates, and synthetic fragrances before purchasing.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Manage My Allergies */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#282426]">
              Your Personal Allergy Profile
            </h3>
            <p className="text-xs text-[#827A7F] mt-1">
              ShopSync automatically cross-references these triggers against every product formulation and AI recommendation.
            </p>
          </div>

          {/* Add form */}
          <form onSubmit={handleAddAllergen} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Lavender Oil, Gluten, Macadamia..."
              value={newAllergen}
              onChange={(e) => setNewAllergen(e.target.value)}
              className="flex-1 text-xs rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 focus:outline-none focus:border-[#542B43]"
            />
            <button
              type="submit"
              className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            >
              Add
            </button>
          </form>

          {/* Active Allergy Chips */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#827A7F] block">
              Active Blacklisted Sensitizers ({allergies.length}):
            </span>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {allergies.map((allergy) => (
                  <motion.div
                    key={allergy}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F8F3EE] border border-[#D9A6AC] text-xs font-semibold text-[#282426]"
                  >
                    <span>{allergy}</span>
                    <button
                      type="button"
                      onClick={() => removeAllergy(allergy)}
                      className="text-stone-400 hover:text-rose-600 transition-colors"
                      title="Remove Allergen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Preset Allergens */}
          <div className="space-y-2 pt-4 border-t border-[#E9DED5]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#827A7F] block">
              Quick Select Common Triggers:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['Synthetic Fragrance', 'Tree Nut Oils', 'Parabens', 'Sulfates (SLS)', 'Linalool', 'Essential Oils'].map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => addAllergy(item)}
                  disabled={allergies.includes(item)}
                  className="text-[11px] px-2.5 py-1 rounded-lg border border-[#E9DED5] bg-[#F8F3EE] hover:bg-[#E9DED5] text-[#282426] transition-colors disabled:opacity-40 cursor-pointer"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Custom Ingredient Inspector */}
        <div className="lg:col-span-7 space-y-8">
          {/* Custom Paste Inspector with Animated Laser Scan */}
          <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-4 shadow-xs relative overflow-hidden">
            <h3 className="font-serif font-bold text-lg text-[#282426]">
              Instant Ingredient Scanner
            </h3>
            <p className="text-xs text-[#827A7F]">
              Paste any cosmetic formula list to scan for sensitizers, drying alcohols, and sulfates with molecular precision.
            </p>

            <form onSubmit={handleAnalyzePaste} className="space-y-3 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#E9DED5] bg-[#F8F3EE]">
                <textarea
                  rows={3}
                  placeholder="Water/Aqua, Glycerin, Dimethicone, Parfum, Limonene, Sodium Lauryl Sulfate..."
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  className="w-full text-xs font-mono p-3.5 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#542B43] resize-none"
                />

                {/* Animated Scanning Laser Line */}
                {isScanning && (
                  <motion.div
                    animate={{ top: ['0%', '90%', '0%'] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute left-0 right-0 h-0.5 bg-[#D9A6AC] shadow-[0_0_12px_#D9A6AC] pointer-events-none"
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={isScanning}
                className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isScanning ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-[#D9A6AC]" />
                    Scanning Molecular Formulations...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-[#D9A6AC]" />
                    Analyze Formula Ingredients
                  </>
                )}
              </button>
            </form>

            {/* Analysis Results Display */}
            {analyzedIngredients && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-5 rounded-2xl bg-[#F8F3EE] border border-[#E9DED5] space-y-4 text-xs"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#E9DED5]">
                  <div>
                    <span className="font-bold text-[#282426] text-sm block">SkinSafe Safety Assessment</span>
                    <span className="text-[11px] text-[#827A7F]">
                      {analyzedIngredients.totalTokens} ingredients parsed
                    </span>
                  </div>

                  {analyzedIngredients.status === 'KNOWN_MATCH' ? (
                    <span className="px-3 py-1 rounded-full font-bold text-xs bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5 animate-pulse">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
                      Allergenic Match
                    </span>
                  ) : analyzedIngredients.status === 'NO_REPORTED_MATCH' ? (
                    <span className="px-3 py-1 rounded-full font-bold text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      100% Hypoallergenic
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full font-bold text-xs bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                      Incomplete Data
                    </span>
                  )}
                </div>

                {analyzedIngredients.flagged.length > 0 ? (
                  <div className="space-y-2.5">
                    {analyzedIngredients.flagged.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-3 bg-white rounded-xl border border-rose-200 shadow-2xs space-y-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-950 text-xs">{item.name}</span>
                          <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                            {item.risk}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#524B4F]">{item.note}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Clean formula: No reported allergens, drying alcohols, or stripping sulfates found.</span>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Product Ingredient Comparison Tool */}
          <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-serif font-bold text-lg text-[#282426]">
              Side-by-Side Formulation Comparison
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-[#524B4F] mb-1">Product A</label>
                <select
                  value={prodAId}
                  onChange={(e) => setProdAId(e.target.value)}
                  className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5 text-xs focus:border-[#542B43]"
                >
                  {BEAUTY_PRODUCTS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#524B4F] mb-1">Product B</label>
                <select
                  value={prodBId}
                  onChange={(e) => setProdBId(e.target.value)}
                  className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5 text-xs focus:border-[#542B43]"
                >
                  {BEAUTY_PRODUCTS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparison Cards */}
            {productA && productB && (
              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <motion.div
                  whileHover={{ y: -3 }}
                  className="p-5 bg-[#F8F3EE] rounded-2xl border border-[#E9DED5] space-y-2 shadow-xs"
                >
                  <img src={productA.images[0]} alt="" className="h-28 w-full object-cover rounded-xl" />
                  <h4 className="font-serif font-bold text-sm text-[#282426] line-clamp-1">{productA.name}</h4>
                  <p className="font-bold text-[#542B43] font-mono">{formatINR(productA.price)}</p>
                  <p className="text-[11px] text-[#524B4F] line-clamp-3 leading-relaxed">{productA.ingredients}</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3 }}
                  className="p-5 bg-[#F8F3EE] rounded-2xl border border-[#E9DED5] space-y-2 shadow-xs"
                >
                  <img src={productB.images[0]} alt="" className="h-28 w-full object-cover rounded-xl" />
                  <h4 className="font-serif font-bold text-sm text-[#282426] line-clamp-1">{productB.name}</h4>
                  <p className="font-bold text-[#542B43] font-mono">{formatINR(productB.price)}</p>
                  <p className="text-[11px] text-[#524B4F] line-clamp-3 leading-relaxed">{productB.ingredients}</p>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkinSafeCheckerPage
