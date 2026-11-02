import React from 'react'
import { TrendingUp, IndianRupee, Store, ShoppingBag, ArrowUpRight } from 'lucide-react'

export function SalesAnalyticsPage() {
  const metrics = [
    { title: 'Total Gross Volume (MTD)', value: '₹1,28,49,000', change: '+22.4%', sub: 'vs last month' },
    { title: 'In-Store POS Revenue', value: '₹69,38,000', change: '+18.1%', sub: '54% of total sales' },
    { title: 'Digital Boutique Revenue', value: '₹59,11,000', change: '+27.6%', sub: '46% of total sales' },
    { title: 'Average Order Value (AOV)', value: '₹1,480', change: '+₹120', sub: 'Driven by shade bundles' }
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
            { name: 'Maybelline New York Fit Me Matte+Poreless (Shade 128)', units: '4,820 units', rev: '₹31,28,180', pct: 88 },
            { name: 'Lakmé 9 to 5 Primer + Matte Perfect Cover', units: '3,910 units', rev: '₹20,52,750', pct: 72 },
            { name: "L'Oréal Paris Revitalift 1.5% Hyaluronic Acid Serum", units: '1,840 units', rev: '₹18,38,160', pct: 64 },
            { name: 'Minimalist 10% Niacinamide + Zinc Serum', units: '2,650 units', rev: '₹15,87,350', pct: 55 },
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
