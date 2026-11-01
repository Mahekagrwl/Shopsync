import React, { useState } from 'react'
import { FlaskConical, Plus, ShieldCheck, Search } from 'lucide-react'

export function IngredientManagementPage() {
  const [ingredients, setIngredients] = useState([
    { id: 'ing-1', inci: 'Sodium Hyaluronate', function: 'Multi-Weight Humectant', ewgRating: '1 (Ultra-Clean)', safeStatus: 'Approved - Clean Beauty' },
    { id: 'ing-2', inci: 'Copper Tripeptide-1', function: 'Biomimetic Cellular Peptide', ewgRating: '1 (Ultra-Clean)', safeStatus: 'Approved - Clean Beauty' },
    { id: 'ing-3', inci: 'Ceramide NP', function: 'Stratum Corneum Lipid', ewgRating: '1 (Ultra-Clean)', safeStatus: 'Approved - Clean Beauty' },
    { id: 'ing-4', inci: 'Zinc Oxide (Non-Nano)', function: 'Mineral Physical UV Filter', ewgRating: '2 (Low Hazard)', safeStatus: 'Approved - Reef Safe' },
    { id: 'ing-5', inci: 'Limonene / Linalool', function: 'Natural Terpenes / Fragrance', ewgRating: '5 (Sensitizer)', safeStatus: 'Flagged - SkinSafe Warning' },
    { id: 'ing-6', inci: 'Sodium Lauryl Sulfate', function: 'Anionic Surfactant', ewgRating: '4 (Moderate Hazard)', safeStatus: 'Banned from ShopSync' }
  ])

  const [search, setSearch] = useState('')

  const filtered = ingredients.filter(i =>
    i.inci.toLowerCase().includes(search.toLowerCase()) ||
    i.function.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
            Cosmetic Chemistry Master
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
            Ingredient & Chemical INCI Registry
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E9DED5] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F]">
            <tr>
              <th className="py-3.5 px-4">INCI Standard Chemical Name</th>
              <th className="py-3.5 px-4">Dermatological Function</th>
              <th className="py-3.5 px-4">EWG / Clean Rating</th>
              <th className="py-3.5 px-4 text-right">Regulatory Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9DED5]">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-[#F8F3EE]">
                <td className="py-3 px-4 font-mono font-bold text-[#282426] flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-[#542B43]" />
                  {item.inci}
                </td>
                <td className="py-3 px-4 text-[#524B4F]">{item.function}</td>
                <td className="py-3 px-4 font-semibold text-stone-700">{item.ewgRating}</td>
                <td className="py-3 px-4 text-right">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.safeStatus.includes('Approved')
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.safeStatus.includes('Flagged')
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.safeStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default IngredientManagementPage
