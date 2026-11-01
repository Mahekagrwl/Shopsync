import React from 'react'
import { TrendingUp, DollarSign, Store, ShoppingBag, ArrowUpRight } from 'lucide-react'

export function SalesAnalyticsPage() {
  const metrics = [
    { title: 'Total Gross Volume', value: '$128,490.00', change: '+22.4%', sub: 'vs last month' },
    { title: 'In-Store POS Revenue', value: '$69,380.00', change: '+18.1%', sub: '54% of total sales' },
    { title: 'Digital Boutique Revenue', value: '$59,110.00', change: '+27.6%', sub: '46% of total sales' },
    { title: 'Average Order Value (AOV)', value: '$84.20', change: '+$6.40', sub: 'Driven by shade bundles' }
  ]

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
          Commercial Intelligence
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
          Omnichannel Sales & Revenue Analytics
        </h1>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-[#E9DED5] p-5 space-y-2 shadow-xs">
            <span className="text-xs text-[#827A7F] font-medium">{m.title}</span>
            <p className="text-2xl font-bold font-mono text-[#282426]">{m.value}</p>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-emerald-700 font-bold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> {m.change}
              </span>
              <span className="text-stone-400 text-[11px]">{m.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Top Formulations Breakdown */}
      <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-6 shadow-xs">
        <h3 className="font-serif font-bold text-base text-[#282426]">
          Top Revenue Generating Beauty Formulations
        </h3>

        <div className="space-y-4 text-xs">
          {[
            { name: 'Cellular Renewal Peptide Barrier Elixir', units: '612 units', rev: '$44,064.00', pct: 85 },
            { name: 'Silk Radiance Luminous Foundation', units: '740 units', rev: '$35,520.00', pct: 70 },
            { name: 'Mineral Silk Fluid Broad Spectrum SPF 50+', units: '580 units', rev: '$24,360.00', pct: 52 },
            { name: 'Velvet Cloud Cashmere Matte Lipstick', units: '420 units', rev: '$13,440.00', pct: 35 },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between">
                <span className="font-semibold text-[#282426]">{item.name}</span>
                <span className="font-mono font-bold text-[#542B43]">{item.rev} ({item.units})</span>
              </div>
              <div className="w-full bg-[#F8F3EE] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#542B43] h-full rounded-full"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SalesAnalyticsPage
