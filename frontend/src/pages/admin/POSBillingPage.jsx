import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Store,
  ScanBarcode,
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  DollarSign,
  QrCode,
  Printer,
  CheckCircle2,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Receipt,
  RotateCcw
} from 'lucide-react'
import { BEAUTY_PRODUCTS, CATEGORIES } from '../../data/mockBeautyData'
import { usePOS } from '../../context/POSContext'
import { useAuth } from '../../context/AuthContext'

export function POSBillingPage() {
  const {
    posCart,
    addToPosCart,
    updatePosQty,
    removePosItem,
    clearPosCart,
    selectedCustomer,
    setSelectedCustomer,
    discountPercent,
    setDiscountPercent,
    subtotal,
    discountAmount,
    tax,
    total,
    terminalSession,
    completePosSale
  } = usePOS()

  const { customer } = useAuth()

  const [activeCategory, setActiveCategory] = useState('all')
  const [barcodeInput, setBarcodeInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [cashTendered, setCashTendered] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [completedInvoice, setCompletedInvoice] = useState(null)
  const [barcodeNotice, setBarcodeNotice] = useState('')
  const [lastAddedId, setLastAddedId] = useState(null)

  // Filter products for POS grid
  const displayedProducts = BEAUTY_PRODUCTS.filter(p => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.barcode.includes(searchQuery)) return false
    return true
  })

  // Barcode quick scan handler
  const handleBarcodeSubmit = (e) => {
    e.preventDefault()
    if (!barcodeInput.trim()) return

    const found = BEAUTY_PRODUCTS.find(p => p.barcode === barcodeInput.trim() || p.sku.toLowerCase() === barcodeInput.trim().toLowerCase())
    if (found) {
      const shade = found.shades?.[0] || null
      addToPosCart(found, shade)
      setLastAddedId(found.id)
      setTimeout(() => setLastAddedId(null), 1200)
      setBarcodeNotice(`Scanned: ${found.name}`)
      setTimeout(() => setBarcodeNotice(''), 2500)
    } else {
      setBarcodeNotice(`Barcode ${barcodeInput} not recognized.`)
      setTimeout(() => setBarcodeNotice(''), 2500)
    }
    setBarcodeInput('')
  }

  const handleProductTap = (p) => {
    const shade = p.shades?.[0] || null
    addToPosCart(p, shade)
    setLastAddedId(p.id)
    setTimeout(() => setLastAddedId(null), 800)
  }

  const handleCheckoutComplete = (tenderType) => {
    const cashVal = tenderType === 'cash' ? Number(cashTendered || total) : total
    const invoice = completePosSale(tenderType, cashVal)
    setCompletedInvoice(invoice)
    setShowPaymentModal(false)
    setCashTendered('')
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* Top Station Status Bar with futuristic accents */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#282426] text-white shadow-lg text-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-[#542B43]/30 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#542B43] to-[#282426] border border-[#D9A6AC]/40 flex items-center justify-center text-amber-300 shadow-inner">
            <Store className="w-5 h-5 text-[#D9A6AC]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-white">{terminalSession.terminalId}</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live EMV Connected
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Cashier: <strong className="text-white font-medium">{terminalSession.cashierName}</strong> • {terminalSession.storeLocation}
            </p>
          </div>
        </div>

        {/* Barcode scanner input with laser focus styling */}
        <form onSubmit={handleBarcodeSubmit} className="flex items-center gap-2 relative z-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Scan Barcode (e.g. 890123450012)..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="w-64 bg-[#1F1C1D] border border-stone-600 rounded-xl px-3 py-2 pl-8 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#D9A6AC] focus:ring-1 focus:ring-[#D9A6AC] font-mono transition-all"
            />
            <ScanBarcode className="w-4 h-4 text-[#D9A6AC] absolute left-2.5 top-2.5" />
          </div>
          <button
            type="submit"
            className="bg-[#542B43] hover:bg-[#6E3958] active:scale-95 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
            data-cursor-card="true"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D9A6AC]" />
            Scan
          </button>
        </form>
      </div>

      <AnimatePresence>
        {barcodeNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-300 rounded-xl text-xs text-amber-950 font-semibold text-center shadow-xs flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
            <span>{barcodeNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Split Grid: Left Catalog Touchpad + Right Register Cart */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        {/* Left: Product Selector */}
        <div className="lg:col-span-7 flex flex-col bg-white rounded-3xl border border-[#E9DED5] p-5 overflow-hidden shadow-xs space-y-4">
          {/* Category Filter Pills & Search */}
          <div className="flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar flex-1">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                  activeCategory === 'all'
                    ? 'bg-[#542B43] text-white shadow-sm'
                    : 'bg-[#F8F3EE] text-[#524B4F] hover:bg-[#E9DED5]'
                }`}
              >
                All Formulas
              </button>
              {CATEGORIES.slice(0, 5).map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.slug)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                    activeCategory === c.slug
                      ? 'bg-[#542B43] text-white shadow-sm'
                      : 'bg-[#F8F3EE] text-[#524B4F] hover:bg-[#E9DED5]'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="relative w-44 shrink-0">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8F3EE] border border-[#E9DED5] rounded-xl px-2.5 py-1.5 pl-7 text-xs text-[#282426] focus:outline-none focus:border-[#542B43]"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2 top-2" />
            </div>
          </div>

          {/* Product Cards Touch Grid with 3D tactile feedback */}
          <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 pr-1">
            {displayedProducts.map(p => {
              const isJustAdded = lastAddedId === p.id
              return (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -3, scale: 1.015 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleProductTap(p)}
                  data-cursor-card="true"
                  className={`p-3 rounded-2xl border transition-all cursor-pointer bg-[#F8F3EE] flex flex-col justify-between relative overflow-hidden group select-none ${
                    isJustAdded
                      ? 'border-emerald-500 ring-2 ring-emerald-400/40 bg-emerald-50/50'
                      : 'border-[#E9DED5] hover:border-[#542B43] hover:shadow-md'
                  }`}
                >
                  {isJustAdded && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-2 right-2 z-10 bg-emerald-600 text-white p-1 rounded-full shadow-md"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </motion.div>
                  )}
                  <div className="space-y-1.5">
                    <div className="relative h-24 w-full rounded-xl overflow-hidden bg-white">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400">{p.brand}</span>
                    <h4 className="font-semibold text-xs text-[#282426] line-clamp-1">{p.name}</h4>
                  </div>
                  <div className="pt-2 mt-2 border-t border-[#E9DED5] flex items-center justify-between">
                    <span className="font-bold text-xs text-[#542B43]">${p.price.toFixed(2)}</span>
                    <span className="text-[10px] text-stone-400 font-mono">Stock: {p.stockQuantity}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Right: Active POS Register Cart Drawer */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-3xl border border-[#E9DED5] p-5 overflow-hidden shadow-xs space-y-4">
          {/* Customer Attachment */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E9DED5] text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#F8F3EE] flex items-center justify-center text-[#542B43]">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-[#282426]">
                {selectedCustomer ? selectedCustomer.name : 'Walk-in Boutique Client'}
              </span>
            </div>
            {!selectedCustomer ? (
              <button
                onClick={() => setSelectedCustomer(customer)}
                className="text-[11px] font-semibold text-[#542B43] hover:underline"
              >
                + Attach VIP Member
              </button>
            ) : (
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-[11px] font-semibold text-red-600 hover:underline"
              >
                Detach
              </button>
            )}
          </div>

          {/* Cart Items List with Framer Motion AnimatePresence */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E9DED5] pr-1 space-y-1">
            <AnimatePresence initial={false}>
              {posCart.length > 0 ? (
                posCart.map(item => (
                  <motion.div
                    key={item.key}
                    layout
                    initial={{ opacity: 0, x: 24, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -24, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    className="py-2.5 flex items-center justify-between text-xs gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#282426] truncate">{item.name}</p>
                      <p className="text-[10px] text-stone-400">
                        ${item.price.toFixed(2)} {item.shade ? `• ${item.shade.name}` : ''}
                      </p>
                    </div>

                    {/* Stepper with pop microinteraction */}
                    <div className="flex items-center border border-[#E9DED5] rounded-xl bg-[#F8F3EE] p-0.5 shadow-2xs">
                      <button
                        onClick={() => updatePosQty(item.key, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg text-stone-600 hover:bg-white hover:text-black active:scale-90 transition-all font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <motion.span
                        key={item.quantity}
                        initial={{ scale: 1.3, color: '#542B43' }}
                        animate={{ scale: 1, color: '#282426' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        className="px-2 font-mono font-bold text-xs min-w-[20px] text-center"
                      >
                        {item.quantity}
                      </motion.span>
                      <button
                        onClick={() => updatePosQty(item.key, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg text-stone-600 hover:bg-white hover:text-black active:scale-90 transition-all font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono font-bold text-[#282426] text-right min-w-[55px]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    <button
                      onClick={() => removePosItem(item.key)}
                      className="text-stone-300 hover:text-red-600 p-1 rounded-md transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 text-stone-400 text-xs space-y-2"
                >
                  <Receipt className="w-8 h-8 text-stone-300 mx-auto stroke-1" />
                  <p>Register cart is empty.</p>
                  <p className="text-[11px] text-stone-400">Scan a physical barcode or tap catalog tiles to ring up sale.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Register Bottom Panel: Discounts & Calculations */}
          <div className="pt-3 border-t border-[#E9DED5] space-y-3 text-xs shrink-0 bg-white">
            {/* Quick Discount Buttons */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Cashier Discount</span>
              <div className="flex gap-1">
                {[0, 10, 15, 20].map(pct => (
                  <button
                    key={pct}
                    onClick={() => setDiscountPercent(pct)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      discountPercent === pct
                        ? 'bg-[#542B43] text-white shadow-xs'
                        : 'bg-[#F8F3EE] text-[#524B4F] border border-[#E9DED5] hover:bg-[#E9DED5]'
                    }`}
                  >
                    {pct === 0 ? 'None' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtotals */}
            <div className="space-y-1.5 text-xs bg-[#F8F3EE]/60 p-3 rounded-2xl border border-[#E9DED5]">
              <div className="flex justify-between text-[#524B4F]">
                <span>Formulation Subtotal:</span>
                <span className="font-mono font-medium">${subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>VIP Atelier Courtesy ({discountPercent}%):</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#524B4F]">
                <span>City & State Tax (8.25%):</span>
                <span className="font-mono font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-base font-bold text-[#282426] pt-2 border-t border-[#E9DED5]">
                <span>Total Due:</span>
                <motion.span
                  key={total}
                  initial={{ scale: 1.15, color: '#D9A6AC' }}
                  animate={{ scale: 1, color: '#542B43' }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-xl font-extrabold text-[#542B43]"
                >
                  ${total.toFixed(2)}
                </motion.span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                disabled={posCart.length === 0}
                onClick={clearPosCart}
                className="py-2.5 rounded-xl border border-[#E9DED5] font-semibold text-xs text-stone-600 hover:bg-stone-50 active:scale-98 disabled:opacity-40 transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Void Cart
              </button>
              <button
                type="button"
                disabled={posCart.length === 0}
                onClick={() => setShowPaymentModal(true)}
                data-cursor-card="true"
                className="py-2.5 rounded-xl bg-gradient-to-r from-[#542B43] to-[#3B1E2F] hover:from-[#6E3958] hover:to-[#542B43] active:scale-98 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D9A6AC]" />
                Charge ${total.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POS Multi-Tender Modal with spring entrance */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-md bg-white rounded-3xl border border-[#E9DED5] p-6 space-y-6 shadow-2xl text-xs relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E9DED5]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9A6AC]">Payment Processing</span>
                  <h3 className="font-serif font-bold text-xl text-[#282426]">
                    Collect Tender (${total.toFixed(2)})
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-2xl bg-[#F8F3EE] flex items-center justify-center text-[#542B43]">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>

              {/* Payment method tiles */}
              <div className="grid grid-cols-3 gap-3">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCheckoutComplete('Credit Card (Terminal EMV)')}
                  className="p-4 rounded-2xl bg-[#F8F3EE] hover:bg-[#542B43] hover:text-white border border-[#E9DED5] text-center space-y-2 transition-all flex flex-col items-center group cursor-pointer"
                >
                  <CreditCard className="w-6 h-6 text-[#542B43] group-hover:text-white transition-colors" />
                  <span className="font-bold text-[11px]">Chip / Tap Card</span>
                </motion.button>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCheckoutComplete('cash')}
                  className="p-4 rounded-2xl bg-[#F8F3EE] hover:bg-[#542B43] hover:text-white border border-[#E9DED5] text-center space-y-2 transition-all flex flex-col items-center group cursor-pointer"
                >
                  <DollarSign className="w-6 h-6 text-[#542B43] group-hover:text-white transition-colors" />
                  <span className="font-bold text-[11px]">Cash Tender</span>
                </motion.button>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCheckoutComplete('Boutique QR / UPI')}
                  className="p-4 rounded-2xl bg-[#F8F3EE] hover:bg-[#542B43] hover:text-white border border-[#E9DED5] text-center space-y-2 transition-all flex flex-col items-center group cursor-pointer"
                >
                  <QrCode className="w-6 h-6 text-[#542B43] group-hover:text-white transition-colors" />
                  <span className="font-bold text-[11px]">Dynamic QR</span>
                </motion.button>
              </div>

              {/* Cash Calculator */}
              <div className="p-3.5 bg-[#F8F3EE] rounded-2xl border border-[#E9DED5] space-y-2.5">
                <label className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                  Cash Tendered Calculator
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="e.g. 100.00"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="w-full bg-white rounded-xl p-2 font-mono text-xs border border-[#E9DED5] focus:outline-none focus:border-[#542B43]"
                  />
                  <button
                    onClick={() => setCashTendered(Math.ceil(total).toString())}
                    className="px-3 bg-stone-200 hover:bg-stone-300 rounded-xl text-stone-700 font-bold text-xs transition-colors shrink-0"
                  >
                    Exact
                  </button>
                </div>
                {Number(cashTendered) > total && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-bold text-emerald-800 flex items-center justify-between"
                  >
                    <span>Change to Return:</span>
                    <span className="font-mono text-sm">${(Number(cashTendered) - total).toFixed(2)}</span>
                  </motion.p>
                )}
              </div>

              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-2.5 rounded-xl border border-[#E9DED5] hover:bg-stone-50 text-stone-600 font-semibold transition-colors"
              >
                Cancel Tender
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POS Receipt Modal with Celebratory Holographic Stamp */}
      <AnimatePresence>
        {completedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-sm bg-white rounded-3xl border border-[#E9DED5] p-6 space-y-4 shadow-2xl text-xs font-mono relative overflow-hidden"
            >
              {/* Luxury Gold/Plum Stamped Seal */}
              <motion.div
                initial={{ scale: 2.2, opacity: 0, rotate: -25 }}
                animate={{ scale: 1, opacity: 0.85, rotate: -12 }}
                transition={{ delay: 0.25, type: 'spring', stiffness: 300, damping: 15 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none border-4 border-[#542B43] rounded-2xl p-4 text-center text-[#542B43] font-serif uppercase tracking-widest bg-white/40 backdrop-blur-2xs shadow-xl"
              >
                <div className="border border-[#542B43] p-2 rounded-xl">
                  <p className="text-[10px] font-bold">SHOPSYNC VIP</p>
                  <p className="text-xl font-extrabold tracking-wider">PAID</p>
                  <p className="text-[8px] font-mono">SETTLED IN FULL</p>
                </div>
              </motion.div>

              <div className="text-center space-y-1 pb-3 border-b border-dashed border-stone-300">
                <h3 className="font-serif font-bold text-lg text-[#282426]">SHOPSYNC FLAGSHIP</h3>
                <p className="text-[10px] text-stone-500">San Francisco Boutique • Terminal 01</p>
                <p className="text-[10px] text-stone-500 font-bold">{completedInvoice.invoiceNumber}</p>
                <p className="text-[9px] text-stone-400">{completedInvoice.date}</p>
              </div>

              <div className="space-y-1.5 text-[11px] max-h-48 overflow-y-auto pr-1">
                {completedInvoice.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="truncate max-w-[180px]">{i.name} (x{i.quantity})</span>
                    <span className="font-semibold">${(i.price * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-dashed border-stone-300 space-y-1 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span>${completedInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Tax (8.25%):</span>
                  <span>${completedInvoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#542B43] pt-1 border-t border-stone-300">
                  <span>TOTAL PAID:</span>
                  <span>${completedInvoice.total.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-stone-500 pt-1">
                  Method: <strong className="text-stone-700">{completedInvoice.paymentMethod}</strong>
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl border border-[#E9DED5] text-stone-700 font-sans font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#F8F3EE] transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
                <button
                  onClick={() => setCompletedInvoice(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#542B43] hover:bg-[#3B1E2F] text-white font-sans font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  Next Sale
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default POSBillingPage
