import React, { useState } from 'react'
import { Palette, Plus, Search, Check, Sparkles, Filter } from 'lucide-react'
import { BEAUTY_PRODUCTS } from '../../data/mockBeautyData'

export function MakeupShadesPage() {
  // Aggregate all shades from makeup products
  const allShades = BEAUTY_PRODUCTS.flatMap(p =>
    (p.shades || []).map(s => ({
      ...s,
      productName: p.name,
      productId: p.id,
      brand: p.brand
    }))
  )

  const [shadesList, setShadesList] = useState(allShades)
  const [selectedUndertone, setSelectedUndertone] = useState('all')
  const [selectedFinish, setSelectedFinish] = useState('all')

  const filtered = shadesList.filter(s => {
    if (selectedUndertone !== 'all' && s.undertone !== selectedUndertone) return false
    if (selectedFinish !== 'all' && s.finish !== selectedFinish) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
            Complexion Matrix
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
            Makeup Shades Master Table
          </h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E9DED5] flex flex-wrap items-center justify-between gap-4 text-xs shadow-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Undertone:</span>
            <select
              value={selectedUndertone}
              onChange={(e) => setSelectedUndertone(e.target.value)}
              className="rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2 text-xs font-semibold text-[#282426]"
            >
              <option value="all">All Undertones</option>
              <option value="warm">Warm</option>
              <option value="cool">Cool</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Finish:</span>
            <select
              value={selectedFinish}
              onChange={(e) => setSelectedFinish(e.target.value)}
              className="rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2 text-xs font-semibold text-[#282426]"
            >
              <option value="all">All Finishes</option>
              <option value="dewy">Dewy</option>
              <option value="natural">Natural</option>
              <option value="matte">Matte</option>
            </select>
          </div>
        </div>

        <span className="text-stone-400 font-mono">
          {filtered.length} shades displayed
        </span>
      </div>

      {/* Shades Table */}
      <div className="bg-white rounded-3xl border border-[#E9DED5] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F]">
            <tr>
              <th className="py-3.5 px-4">Swatch</th>
              <th className="py-3.5 px-4">Shade Name</th>
              <th className="py-3.5 px-4">Shade Code</th>
              <th className="py-3.5 px-4">Parent Product Formulation</th>
              <th className="py-3.5 px-4">Undertone</th>
              <th className="py-3.5 px-4">Finish</th>
              <th className="py-3.5 px-4">Coverage</th>
              <th className="py-3.5 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9DED5]">
            {filtered.map((s, idx) => (
              <tr key={idx} className="hover:bg-[#F8F3EE]">
                <td className="py-3 px-4">
                  <div
                    className="h-7 w-7 rounded-full border border-black/20 shadow-xs ring-1 ring-black/5"
                    style={{ backgroundColor: s.hex }}
                    title={s.hex}
                  />
                </td>
                <td className="py-3 px-4 font-bold text-[#282426]">{s.name}</td>
                <td className="py-3 px-4 font-mono font-bold text-[#542B43]">{s.code}</td>
                <td className="py-3 px-4 text-[#524B4F] max-w-xs truncate">{s.productName}</td>
                <td className="py-3 px-4 capitalize">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    s.undertone === 'warm'
                      ? 'bg-amber-100 text-amber-800'
                      : s.undertone === 'cool'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-stone-100 text-stone-800'
                  }`}>
                    {s.undertone}
                  </span>
                </td>
                <td className="py-3 px-4 capitalize font-medium text-[#282426]">{s.finish}</td>
                <td className="py-3 px-4 capitalize text-[#524B4F]">{s.coverage}</td>
                <td className="py-3 px-4 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Live at POS
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

export default MakeupShadesPage
