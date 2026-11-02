import React from 'react'
import { LineChart, Sparkles, TrendingUp, Calendar, AlertCircle } from 'lucide-react'

export function DemandForecastingPage() {
  const forecasts = [
    { product: 'Maybelline New York Fit Me Matte+Poreless (Shade 128 Warm Nude)', velocity: '28 units/day', daysUntilOut: '12 Days', confidence: '98% High', projectedDemand: '+55% (Indian Festive Wedding Season)' },
    { product: 'Lakmé 9 to 5 Primer + Matte Perfect Cover Foundation', velocity: '18 units/day', daysUntilOut: '16 Days', confidence: '94% High', projectedDemand: '+35% (Daily Office & Festive Wear)' },
    { product: 'Minimalist 10% Niacinamide + Zinc Daily Blemish Serum', velocity: '22 units/day', daysUntilOut: '18 Days', confidence: '96% High', projectedDemand: '+40% (Post-Festive Skin Rebalancing)' },
    { product: 'Dot & Key Watermelon Hyaluronic Sunscreen SPF 50+', velocity: '16 units/day', daysUntilOut: '24 Days', confidence: '91% High', projectedDemand: 'Consistent High Volume' },
    { product: 'Mamaearth Onion Hair Oil with Redensyl', velocity: '14 units/day', daysUntilOut: '22 Days', confidence: '89% Med', projectedDemand: '+25% (Winter Hair Fall Season)' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#542B43] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D985A5]" /> Predictive Retail AI
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
          AI Demand Forecasting & Stockout Prediction
        </h1>
        <p className="text-xs text-[#827A7F] mt-1">
          Machine learning extrapolation based on physical store POS checkout rates, online cart additions, and Indian festive calendar trends.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E9DED5] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F]">
            <tr>
              <th className="py-3.5 px-4">Formulation & Shade</th>
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
                <td className="py-3 px-4 font-mono font-bold text-[#542B43]">{f.velocity}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold font-mono text-[10px] ${
                    f.daysUntilOut.includes('12') ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800'
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
