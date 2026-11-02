import React from 'react'
import { IndianRupee, PieChart, TrendingUp } from 'lucide-react'

export function ProfitAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
          Financial Margins
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
          Gross & Net Profit Analytics
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 space-y-2 shadow-xs">
          <span className="text-xs text-[#827A7F]">Estimated Gross Margin</span>
          <p className="text-3xl font-bold font-mono text-emerald-700">62.0%</p>
          <p className="text-[11px] text-stone-400">Total COGS: ₹48,83,000 MTD</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 space-y-2 shadow-xs">
          <span className="text-xs text-[#827A7F]">Net Contribution Profit</span>
          <p className="text-3xl font-bold font-mono text-[#542B43]">₹79,66,000</p>
          <p className="text-[11px] text-stone-400">After payment gateway & shipping logistics</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 space-y-2 shadow-xs">
          <span className="text-xs text-[#827A7F]">High-Margin Category</span>
          <p className="text-3xl font-bold text-[#282426]">Skincare Actives</p>
          <p className="text-[11px] text-emerald-700 font-semibold">72.4% Average Unit Margin</p>
        </div>
      </div>

      {/* Category Margins Table */}
      <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 className="font-serif font-bold text-base text-[#282426]">
          Profit Margin Breakdown by Category (in INR)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F]">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Gross Revenue (₹)</th>
                <th className="py-3 px-4">Cost of Goods / COGS (₹)</th>
                <th className="py-3 px-4 text-right">Gross Margin (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9DED5]">
              {[
                { cat: 'Clinical Skincare (Minimalist / L’Oréal)', rev: '₹52,10,000', cogs: '₹14,38,000', margin: '72.4%' },
                { cat: 'Complexion & Makeup (Lakmé / Maybelline)', rev: '₹48,96,000', cogs: '₹17,13,600', margin: '65.0%' },
                { cat: 'Sunscreen Formulations (Dot & Key)', rev: '₹18,43,000', cogs: '₹7,74,000', margin: '58.0%' },
                { cat: 'Haircare & Body Care (Mamaearth)', rev: '₹9,00,000', cogs: '₹2,79,000', margin: '69.0%' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F8F3EE]">
                  <td className="py-3 px-4 font-semibold text-[#282426]">{row.cat}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#542B43]">{row.rev}</td>
                  <td className="py-3 px-4 font-mono text-stone-500">{row.cogs}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-800 font-mono">{row.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ProfitAnalyticsPage
