import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  AlertTriangle,
  Tag,
  CheckCircle2,
  Trash2,
  ShieldAlert,
  Clock,
  Sparkles,
  ArrowUpRight,
  Filter,
  Layers,
  Flame,
  CheckCircle,
  Archive
} from 'lucide-react'

export function ExpiryManagementPage() {
  const [expiryList, setExpiryList] = useState([
    {
      id: 'exp-1',
      lotCode: 'LOT-2026-VC20',
      product: 'Vitamin C 20% Brightening Active Drops',
      brand: 'AURA BOTANICA',
      expiryDate: '2026-11-12',
      totalShelfDays: 180,
      daysLeft: 11,
      remainingUnits: 14,
      actionTaken: 'Critical - Action Required',
      category: 'skincare'
    },
    {
      id: 'exp-2',
      lotCode: 'LOT-2026-CBM04',
      product: 'Cellular Bio-Repair Midnight Oil',
      brand: 'LUMEN PARIS',
      expiryDate: '2026-12-03',
      totalShelfDays: 240,
      daysLeft: 32,
      remainingUnits: 26,
      actionTaken: 'Standard',
      category: 'skincare'
    },
    {
      id: 'exp-3',
      lotCode: 'LOT-2026-CG06',
      product: 'Caviar Molecular Bond Repair Hair Mask',
      brand: 'ÉLIXIR COUTURE',
      expiryDate: '2026-12-15',
      totalShelfDays: 365,
      daysLeft: 44,
      remainingUnits: 38,
      actionTaken: 'Standard',
      category: 'haircare'
    },
    {
      id: 'exp-4',
      lotCode: 'LOT-2025-LB08',
      product: 'Nectarine Blossom Nourishing Body Soufflé',
      brand: 'ATELIER BOTANIQUE',
      expiryDate: '2027-01-10',
      totalShelfDays: 365,
      daysLeft: 70,
      remainingUnits: 47,
      actionTaken: 'Standard',
      category: 'body'
    },
    {
      id: 'exp-5',
      lotCode: 'LOT-2026-SPF50',
      product: 'Broad Spectrum SPF 50+ Invisible Fluid',
      brand: 'AURA BOTANICA',
      expiryDate: '2027-03-20',
      totalShelfDays: 365,
      daysLeft: 140,
      remainingUnits: 95,
      actionTaken: 'Standard',
      category: 'sunscreen'
    },
    {
      id: 'exp-6',
      lotCode: 'LOT-2025-OLD1',
      product: 'Active Retinol 0.5% Resurfacing Concentrate',
      brand: 'DERMA TECH',
      expiryDate: '2026-10-15',
      totalShelfDays: 180,
      daysLeft: -17,
      remainingUnits: 4,
      actionTaken: 'Expired - Decommissioned',
      category: 'skincare'
    }
  ])

  const [filterMode, setFilterMode] = useState('all')
  const [notice, setNotice] = useState('')

  const handleApplyDiscount = (id, percent = 30) => {
    setExpiryList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, actionTaken: `${percent}% Clearance Applied` } : item
      )
    )
    setNotice(`${percent}% Flash Clearance promo applied across in-store POS and digital storefront for lot!`)
    setTimeout(() => setNotice(''), 3500)
  }

  const handleArchiveLot = (id) => {
    setExpiryList(prev => prev.filter(e => e.id !== id))
    setNotice('Expired formulation lot archived to historical compliance ledger.')
    setTimeout(() => setNotice(''), 3000)
  }

  // Filtered lots
  const filteredList = expiryList.filter(item => {
    if (filterMode === 'critical') return item.daysLeft > 0 && item.daysLeft <= 15
    if (filterMode === 'impending') return item.daysLeft > 15 && item.daysLeft <= 60
    if (filterMode === 'fresh') return item.daysLeft > 60
    if (filterMode === 'expired') return item.daysLeft <= 0
    return true
  })

  // Metrics
  const criticalCount = expiryList.filter(e => e.daysLeft > 0 && e.daysLeft <= 15).length
  const impendingCount = expiryList.filter(e => e.daysLeft > 15 && e.daysLeft <= 60).length
  const freshCount = expiryList.filter(e => e.daysLeft > 60).length
  const expiredCount = expiryList.filter(e => e.daysLeft <= 0).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#542B43] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A6AC]" />
            Formula Stability & Shelf-Life AI
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
            Expiry Date & Batch Potency Control
          </h1>
          <p className="text-xs text-[#827A7F] mt-1 max-w-2xl">
            Real-time degradation tracking for active peptides, stabilized ascorbic acid, and UV filters to protect formulation integrity and client safety.
          </p>
        </div>
      </div>

      {/* 4 3D KPI Summary Cards with perspective tilt hover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 perspective-1000">
        <motion.div
          whileHover={{ y: -4, rotateX: 3, rotateY: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="p-5 rounded-3xl bg-white border border-[#E9DED5] shadow-xs relative overflow-hidden"
          data-cursor-card="true"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Critical Warning</span>
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <Flame className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-mono text-3xl font-bold text-red-600">{criticalCount} Lots</h3>
            <p className="text-[11px] text-stone-500 mt-1">Expiring within 15 days</p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E9DED5] flex items-center gap-1.5 text-[10px] text-red-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            Automated clearance candidate
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, rotateX: 3, rotateY: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="p-5 rounded-3xl bg-white border border-[#E9DED5] shadow-xs relative overflow-hidden"
          data-cursor-card="true"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Impending Expiry</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-mono text-3xl font-bold text-amber-700">{impendingCount} Lots</h3>
            <p className="text-[11px] text-stone-500 mt-1">16 to 60 days remaining</p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E9DED5] text-[10px] text-stone-500 font-semibold">
            Optimal for 30% bundle promos
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, rotateX: 3, rotateY: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="p-5 rounded-3xl bg-white border border-[#E9DED5] shadow-xs relative overflow-hidden"
          data-cursor-card="true"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Peak Freshness</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-mono text-3xl font-bold text-emerald-700">{freshCount} Lots</h3>
            <p className="text-[11px] text-stone-500 mt-1">&gt; 60 days of shelf stability</p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E9DED5] text-[10px] text-emerald-700 font-semibold">
            100% active peptide potency
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, rotateX: 3, rotateY: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="p-5 rounded-3xl bg-white border border-[#E9DED5] shadow-xs relative overflow-hidden"
          data-cursor-card="true"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Decommissioned</span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center">
              <Archive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-mono text-3xl font-bold text-stone-700">{expiredCount} Lots</h3>
            <p className="text-[11px] text-stone-500 mt-1">Quarantined from sales ring</p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E9DED5] text-[10px] text-stone-400 font-semibold">
            Locked from POS & checkout
          </div>
        </motion.div>
      </div>

      {/* Notice Banner */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-300 rounded-2xl text-xs text-emerald-950 font-semibold flex items-center gap-2 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{notice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs">
          {[
            { id: 'all', label: `All Lots (${expiryList.length})` },
            { id: 'critical', label: `Critical (<=15d)` },
            { id: 'impending', label: `Impending (16-60d)` },
            { id: 'fresh', label: `Fresh (>60d)` },
            { id: 'expired', label: `Expired (${expiredCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterMode === tab.id
                  ? 'bg-[#542B43] text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-[#E9DED5] hover:bg-[#F8F3EE]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lots Table with High-Tech Lifespan Gauge */}
      <div className="bg-white rounded-3xl border border-[#E9DED5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Lot ID</th>
                <th className="py-3.5 px-4">Formulation & Atelier</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4 min-w-[200px]">Shelf-Life Gauge</th>
                <th className="py-3.5 px-4">Units in Stock</th>
                <th className="py-3.5 px-4">Active Protocol</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9DED5]">
              <AnimatePresence>
                {filteredList.map((item) => {
                  const percentLeft = Math.max(0, Math.min(100, Math.round((item.daysLeft / item.totalShelfDays) * 100)))
                  const isCritical = item.daysLeft > 0 && item.daysLeft <= 15
                  const isImpending = item.daysLeft > 15 && item.daysLeft <= 60
                  const isExpired = item.daysLeft <= 0

                  return (
                    <motion.tr
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-[#F8F3EE]/80 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#542B43]">
                        {item.lotCode}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#282426]">{item.product}</p>
                        <p className="text-[10px] text-stone-400 uppercase tracking-wider">{item.brand}</p>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-stone-600">
                        {item.expiryDate}
                      </td>

                      {/* Animated Gauge */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold flex items-center gap-1.5">
                              {isCritical && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />}
                              {isImpending && <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />}
                              {!isCritical && !isImpending && !isExpired && <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />}
                              <span className={isExpired ? 'text-red-700 font-bold' : isCritical ? 'text-red-600 font-bold' : 'text-[#282426]'}>
                                {isExpired ? 'EXPIRED' : `${item.daysLeft} Days Remaining`}
                              </span>
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              {percentLeft}% stability
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentLeft}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className={`h-full rounded-full ${
                                isExpired
                                  ? 'bg-red-500'
                                  : isCritical
                                  ? 'bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                                  : isImpending
                                  ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                                  : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                              }`}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-[#282426]">
                        {item.remainingUnits} units
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.actionTaken.includes('Clearance')
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isExpired
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : isCritical
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-stone-100 text-stone-700'
                        }`}>
                          {item.actionTaken}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {item.daysLeft > 0 && !item.actionTaken.includes('Clearance') ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {isCritical ? (
                              <button
                                onClick={() => handleApplyDiscount(item.id, 50)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 active:scale-95"
                              >
                                <Flame className="w-3 h-3 text-amber-200" /> 50% Flash
                              </button>
                            ) : (
                              <button
                                onClick={() => handleApplyDiscount(item.id, 30)}
                                className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-3 py-1 rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center gap-1 active:scale-95"
                              >
                                <Tag className="w-3 h-3 text-[#D9A6AC]" /> 30% Promo
                              </button>
                            )}
                          </div>
                        ) : isExpired ? (
                          <button
                            onClick={() => handleArchiveLot(item.id)}
                            className="text-red-600 hover:text-red-800 text-xs font-semibold flex items-center gap-1 ml-auto hover:underline"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Archive Lot
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold text-[11px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> In-Store Broadcast
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ExpiryManagementPage
