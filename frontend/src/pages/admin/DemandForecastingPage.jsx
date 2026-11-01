import React from 'react'
import { LineChart, Sparkles, TrendingUp, Calendar, AlertCircle } from 'lucide-react'

export function DemandForecastingPage() {
  const forecasts = [
    { product: 'Cellular Renewal Peptide Barrier Elixir', velocity: '18 units/day', daysUntilOut: '14 Days', confidence: '96% High', projectedDemand: '+35% (Winter Dryness Season)' },
    { product: 'Silk Radiance Foundation (Shade 100W)', velocity: '12 units/day', daysUntilOut: '22 Days', confidence: '92% High', projectedDemand: '+18% (Holiday Gala Season)' },
    { product: 'Mineral Silk Fluid Broad Spectrum SPF 50+', velocity: '8 units/day', daysUntilOut: '42 Days', confidence: '88% Med', projectedDemand: 'Stable Year-Round Defense' },
    { product: 'Velvet Cloud Cashmere Lipstick (Plum Couture)', velocity: '6 units/day', daysUntilOut: '28 Days', confidence: '90% High', projectedDemand: '+40% Seasonal Peak' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
          Predictive Inventory AI
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
          Demand Forecasting & Runout Estimates
        </h1>
        <p className="text-xs text-[#827A7F] mt-1">
          Machine learning extrapolation based on in-store POS register velocity, cart additions, and seasonal UV index data.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E9DED5] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F]">
            <tr>
              <th className="py-3.5 px-4">Formulation</th>
              <th className="py-3.5 px-4">Sales Velocity</th>
              <th className="py-3.5 px-4">Stockout Horizon</th>
              <th className="py-3.5 px-4">Forecast Confidence</th>
              <th className="py-3.5 px-4 text-right">Seasonal Demand Driver</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9DED5]">
            {forecasts.map((f, idx) => (
              <tr key={idx} className="hover:bg-[#F8F3EE]">
                <td className="py-3 px-4 font-bold text-[#282426]">{f.product}</td>
                <td className="py-3 px-4 font-mono text-[#542B43]">{f.velocity}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold font-mono text-[10px] ${
                    f.daysUntilOut.includes('14') ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {f.daysUntilOut}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-stone-700">{f.confidence}</td>
                <td className="py-3 px-4 text-right text-[#524B4F] font-medium">{f.projectedDemand}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DemandForecastingPage
