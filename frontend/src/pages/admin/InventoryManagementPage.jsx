import React, { useState } from 'react'
import { Boxes, AlertTriangle, ArrowUpDown, Plus, Minus, Search, CheckCircle2 } from 'lucide-react'
import { BEAUTY_PRODUCTS } from '../../data/mockBeautyData'

export function InventoryManagementPage() {
  const [stockList, setStockList] = useState(
    BEAUTY_PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      brand: p.brand,
      boutiqueStock: Math.floor(p.stockQuantity * 0.4),
      warehouseStock: Math.floor(p.stockQuantity * 0.6),
      reorderPoint: 25,
      unitCost: 18.50
    }))
  )

  const [filterLowStock, setFilterLowStock] = useState(false)
  const [search, setSearch] = useState('')
  const [adjustedNotice, setAdjustedNotice] = useState('')

  const handleAdjustStock = (id, delta) => {
    setStockList(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newBoutique = Math.max(0, item.boutiqueStock + delta)
          return { ...item, boutiqueStock: newBoutique }
        }
        return item
      })
    )
    setAdjustedNotice('Stock adjustment recorded in audit log.')
    setTimeout(() => setAdjustedNotice(''), 2500)
  }

  const filtered = stockList.filter(item => {
    const total = item.boutiqueStock + item.warehouseStock
    if (filterLowStock && total > item.reorderPoint) return false
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.sku.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
            Omnichannel Stock Levels
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
            Inventory & Stock Reconciliation
          </h1>
        </div>
      </div>

      {adjustedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{adjustedNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E9DED5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Filter by formulation or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5 pl-9 text-xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
        </div>

        <button
          onClick={() => setFilterLowStock(!filterLowStock)}
          className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            filterLowStock
              ? 'bg-amber-600 text-white border-amber-600'
              : 'border-[#E9DED5] bg-[#F8F3EE] text-[#282426]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          {filterLowStock ? 'Showing Low Stock Only' : 'Filter Low Stock Alert (<25)'}
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-[#E9DED5] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F]">
            <tr>
              <th className="py-3.5 px-4">Formulation SKU</th>
              <th className="py-3.5 px-4">Brand</th>
              <th className="py-3.5 px-4">Boutique Floor (POS)</th>
              <th className="py-3.5 px-4">Central Warehouse</th>
              <th className="py-3.5 px-4">Combined Units</th>
              <th className="py-3.5 px-4">Stock Status</th>
              <th className="py-3.5 px-4 text-right">Quick Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9DED5]">
            {filtered.map((item) => {
              const total = item.boutiqueStock + item.warehouseStock
              const isLow = total <= item.reorderPoint
              return (
                <tr key={item.id} className="hover:bg-[#F8F3EE]">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-[#282426] line-clamp-1">{item.name}</p>
                    <span className="font-mono text-[10px] text-stone-400">{item.sku}</span>
                  </td>
                  <td className="py-3 px-4 text-[#524B4F]">{item.brand}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#542B43]">{item.boutiqueStock} units</td>
                  <td className="py-3 px-4 font-mono text-stone-600">{item.warehouseStock} units</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#282426]">{total}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isLow ? 'Reorder Needed' : 'Optimal'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleAdjustStock(item.id, -1)}
                        className="p-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600"
                        title="Deduct unit"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleAdjustStock(item.id, 5)}
                        className="p-1 rounded-lg bg-[#542B43]/10 hover:bg-[#542B43]/20 text-[#542B43]"
                        title="Add restock (+5)"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InventoryManagementPage
