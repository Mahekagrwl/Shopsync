import React, { useState } from 'react'
import { Layers, Plus, Trash2, Edit2, Search } from 'lucide-react'
import { BEAUTY_PRODUCTS } from '../../data/mockBeautyData'

export function ProductVariantsPage() {
  const [variants, setVariants] = useState([
    { id: 'var-1', productName: 'Cellular Renewal Peptide Barrier Elixir', sku: 'AD-ELX-30ML', size: '30ml Full Size', priceAdj: '+$0.00', stock: 42 },
    { id: 'var-2', productName: 'Cellular Renewal Peptide Barrier Elixir', sku: 'AD-ELX-15ML', size: '15ml Discovery Travel', priceAdj: '-$32.00', stock: 25 },
    { id: 'var-3', productName: 'Caviar Molecular Bond Repair Hair Mask', sku: 'CG-HAR-250ML', size: '250ml Luxury Tub', priceAdj: '+$0.00', stock: 52 },
    { id: 'var-4', productName: 'Caviar Molecular Bond Repair Hair Mask', sku: 'CG-HAR-500ML', size: '500ml Salon Refill', priceAdj: '+$35.00', stock: 18 },
    { id: 'var-5', productName: 'Mineral Silk Fluid SPF 50+', sku: 'SB-SPF-50ML', size: '50ml Daily Shield', priceAdj: '+$0.00', stock: 95 }
  ])

  const [search, setSearch] = useState('')

  const filtered = variants.filter(v =>
    v.productName.toLowerCase().includes(search.toLowerCase()) ||
    v.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
            SKU Size & Volume Variations
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
            Product Variants Management
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E9DED5] flex items-center justify-between text-xs shadow-xs">
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Search variant by product or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5 pl-9 text-xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
        </div>
        <span className="text-stone-400 font-mono">
          {filtered.length} active variant records
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#E9DED5] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F]">
            <tr>
              <th className="py-3.5 px-4">Parent Product</th>
              <th className="py-3.5 px-4">Variant Size / Volume</th>
              <th className="py-3.5 px-4">Variant SKU</th>
              <th className="py-3.5 px-4">Price Differential</th>
              <th className="py-3.5 px-4">Stock Units</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9DED5]">
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-[#F8F3EE]">
                <td className="py-3 px-4 font-semibold text-[#282426]">{v.productName}</td>
                <td className="py-3 px-4 text-[#542B43] font-medium">{v.size}</td>
                <td className="py-3 px-4 font-mono text-stone-500">{v.sku}</td>
                <td className="py-3 px-4 font-bold font-mono text-[#282426]">{v.priceAdj}</td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-0.5 rounded-full font-bold font-mono text-[11px] bg-emerald-100 text-emerald-800">
                    {v.stock} units
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => setVariants(variants.filter(item => item.id !== v.id))}
                    className="text-stone-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductVariantsPage
