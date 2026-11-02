import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  IndianRupee,
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  Calendar,
  Clock,
  ArrowRight,
  Store,
  Package,
  Layers,
  CheckCircle2,
  Sparkles,
  Activity,
  ShieldAlert,
  MessageSquare
} from 'lucide-react'
import { BEAUTY_PRODUCTS } from '../../data/mockBeautyData'
import { usePOS } from '../../context/POSContext'
import { useCart } from '../../context/CartContext'
import { useReports } from '../../context/ReportContext'

export function AdminDashboardPage() {
  const { invoices } = usePOS()
  const { orders } = useCart()
  const { reports, allergyReactionReports, pendingReports } = useReports()

  const stats = [
    { label: "Today's In-Store + Online Sales", value: "₹4,82,050", change: "+14.2% vs Yesterday", icon: IndianRupee, color: "text-[#542B43]", bg: "bg-[#542B43]/10" },
    { label: "Monthly Revenue (MTD)", value: "₹1,28,49,000", change: "+22.8% vs Target", icon: TrendingUp, color: "text-emerald-700", bg: "bg-emerald-50" },
    { label: "Gross Estimated Profit", value: "₹79,66,000", change: "62% Healthy Margin", icon: Activity, color: "text-[#542B43]", bg: "bg-[#D9A6AC]/25" },
    { label: "Total Active Formulations", value: `${BEAUTY_PRODUCTS.length}`, change: "42 SKUs Synced", icon: Package, color: "text-amber-700", bg: "bg-amber-50" },
    { label: "Loyalty Registered Clients", value: "3,412", change: "+180 This Week", icon: Users, color: "text-sky-700", bg: "bg-sky-50" },
    { label: "Pending Online Dispatches", value: `${orders.length}`, change: "Same-Day Delivery", icon: ShoppingBag, color: "text-[#542B43]", bg: "bg-rose-50" },
    { label: "Customer Incident Reports", value: `${pendingReports.length} Pending`, change: `${allergyReactionReports.length} Sensitivity Flags`, icon: ShieldAlert, color: "text-rose-700", bg: "bg-rose-100" },
    { label: "Near-Expiry Batches (<60d)", value: "3", change: "Discount Promo Active", icon: Calendar, color: "text-amber-700", bg: "bg-amber-100" },
  ]

  const lowStockItems = BEAUTY_PRODUCTS.filter(p => p.stockQuantity < 50)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#542B43] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> ShopSync Executive Terminal
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#282426]">
            Atelier & Omnichannel Command Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/pos-billing"
            className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all hover:scale-102 active:scale-98"
          >
            <Store className="w-4 h-4 text-amber-300" /> Launch POS Register
          </Link>
          <Link
            to="/admin/products/new"
            className="bg-white border border-[#E9DED5] text-[#282426] hover:bg-[#F8F3EE] px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
          >
            + Add Formulation
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid (8 Cards with 3D Hover Lift) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-white rounded-2xl border border-[#E9DED5] p-5 shadow-xs space-y-3 hover:border-[#D9A6AC] hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#827A7F] line-clamp-1">{s.label}</span>
                <div className={`h-8 w-8 rounded-lg ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-[#282426] tracking-tight">{s.value}</p>
                <span className="text-[11px] font-semibold text-[#542B43] mt-0.5 inline-block">
                  {s.change}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Sales Velocity Chart & Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart Visual */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-[#282426]">
                Omnichannel Revenue Velocity
              </h3>
              <p className="text-xs text-[#827A7F]">
                Real-time synchronization between in-store POS register and digital boutique
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Stream Active
            </span>
          </div>

          {/* Graphical Animated Bar Chart */}
          <div className="pt-4 flex items-end justify-between h-48 gap-3 sm:gap-6 border-b border-[#E9DED5] pb-2">
            {[
              { day: 'Mon', pos: 42, online: 58, total: '₹1,42,000' },
              { day: 'Tue', pos: 38, online: 62, total: '₹1,64,000' },
              { day: 'Wed', pos: 55, online: 45, total: '₹1,89,000' },
              { day: 'Thu', pos: 48, online: 52, total: '₹1,73,000' },
              { day: 'Fri', pos: 68, online: 72, total: '₹2,48,000' },
              { day: 'Sat', pos: 92, online: 88, total: '₹3,15,000' },
              { day: 'Sun (Today)', pos: 78, online: 75, total: '₹2,71,000' },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full flex gap-1 items-end justify-center h-40">
                  {/* POS bar with spring animation */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${col.pos}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.08, ease: 'easeOut' }}
                    className="w-1/2 bg-[#542B43] rounded-t-md transition-all group-hover:brightness-110"
                    title={`In-Store POS: ${col.pos}%`}
                  />
                  {/* Online bar with spring animation */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${col.online}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.08 + 0.1, ease: 'easeOut' }}
                    className="w-1/2 bg-[#D9A6AC] rounded-t-md transition-all group-hover:brightness-110"
                    title={`Online: ${col.online}%`}
                  />
                </div>
                <span className="text-[10px] text-[#827A7F] font-semibold">{col.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[#827A7F]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-3 w-3 rounded-full bg-[#542B43]" /> In-Store POS Registers (54%)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-3 w-3 rounded-full bg-[#D9A6AC]" /> Online E-Commerce (46%)
              </span>
            </div>
            <Link to="/admin/sales-analytics" className="font-semibold text-[#542B43] hover:underline flex items-center gap-1">
              Deep Analytics →
            </Link>
          </div>
        </div>

        {/* Channel Highlights & Alerts */}
        <div className="space-y-6">
          {/* Expiry & Low-Stock Alerts */}
          <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#282426] flex items-center justify-between">
              <span>Urgent Operational Alerts</span>
              <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {pendingReports.length > 0 ? `${pendingReports.length} Actions` : 'Optimal'}
              </span>
            </h3>

            <div className="space-y-3">
              {pendingReports.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-rose-900">Incident Reports: {pendingReports.length} Require Review</p>
                    <p className="text-[11px] text-rose-800">{allergyReactionReports.length} customer allergen reactions flagged for concierge followup.</p>
                    <Link to="/admin/feedback" className="text-[11px] font-bold text-rose-900 underline block pt-1">
                      Open Customer Reports Desk →
                    </Link>
                  </div>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-amber-900">High Demand: Maybelline Fit Me 128</p>
                  <p className="text-[11px] text-amber-800">Festive surge predicted. 95 units remaining.</p>
                  <Link to="/admin/demand-forecasting" className="text-[11px] font-bold text-amber-900 underline block pt-1">
                    Demand Prediction →
                  </Link>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs">
                <Calendar className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-rose-900">Batch Expiring: Lipstick 01PC</p>
                  <p className="text-[11px] text-rose-800">24 units expire in 28 days (Asia/Kolkata).</p>
                  <Link to="/admin/expiry" className="text-[11px] font-bold text-rose-900 underline block pt-1">
                    Review Clearance Promo →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Terminal Launcher */}
          <div className="bg-[#282426] text-white rounded-3xl p-6 shadow-xs space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9A6AC]">
              Physical Store Register
            </span>
            <h4 className="font-serif font-bold text-base text-white">Flagship Boutique Terminal 01</h4>
            <p className="text-xs text-stone-300">
              Session active with cashier Victoria Vance. Barcode scanner & FEFO inventory active.
            </p>
            <Link
              to="/admin/pos-billing"
              className="inline-flex items-center gap-2 w-full justify-center bg-[#542B43] hover:bg-[#6E3958] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all mt-2"
            >
              <Store className="w-3.5 h-3.5 text-[#D9A6AC]" /> Enter Register Screen
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
