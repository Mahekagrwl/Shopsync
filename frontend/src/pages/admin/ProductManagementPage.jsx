import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Plus, Search, Edit2, Trash2, Eye, Filter } from 'lucide-react'
import { BEAUTY_PRODUCTS, CATEGORIES } from '../../data/mockBeautyData'

export function ProductManagementPage() {
  const [products, setProducts] = useState(BEAUTY_PRODUCTS)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you wish to decommission this product formulation?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const filtered = products.filter(p => {
    if (selectedCat !== 'all' && p.category !== selectedCat) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
            Formulation Inventory
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
            Product Catalog Management
          </h1>
        </div>

        <Link
          to="/admin/products/new"
          className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Formulation
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E9DED5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by formulation name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5 pl-9 text-xs text-[#282426] focus:outline-none focus:ring-2 focus:ring-[#542B43]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-stone-400">Category:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2 text-xs font-semibold text-[#282426]"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#E9DED5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F]">
              <tr>
                <th className="py-3.5 px-4">Product Formulation</th>
                <th className="py-3.5 px-4">SKU / Barcode</th>
                <th className="py-3.5 px-4">Brand</th>
                <th className="py-3.5 px-4">Retail Price</th>
                <th className="py-3.5 px-4">Stock Units</th>
                <th className="py-3.5 px-4">Shades</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9DED5]">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#F8F3EE]/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={prod.images[0]} alt="" className="h-10 w-10 rounded-xl object-cover bg-stone-100" />
                      <div>
                        <p className="font-semibold text-[#282426] line-clamp-1">{prod.name}</p>
                        <span className="text-[10px] text-stone-400 uppercase">{prod.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-stone-500">
                    <p className="font-semibold text-[#282426]">{prod.sku}</p>
                    <p className="text-[10px]">{prod.barcode}</p>
                  </td>
                  <td className="py-3 px-4 text-[#524B4F]">{prod.brand}</td>
                  <td className="py-3 px-4 font-bold font-mono text-[#282426]">${prod.price.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold font-mono text-[11px] ${
                      prod.stockQuantity < 50 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {prod.stockQuantity} in stock
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {prod.shades && prod.shades.length > 0 ? (
                      <span className="px-2 py-0.5 rounded-md bg-[#542B43]/10 text-[#542B43] font-semibold text-[11px]">
                        {prod.shades.length} shades
                      </span>
                    ) : (
                      <span className="text-stone-400 text-[11px]">Universal</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/product/${prod.id}`}
                        target="_blank"
                        className="p-1.5 text-stone-500 hover:text-[#542B43] hover:bg-[#F8F3EE] rounded-lg"
                        title="Preview on Store"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/admin/products/edit/${prod.id}`}
                        className="p-1.5 text-stone-500 hover:text-[#542B43] hover:bg-[#F8F3EE] rounded-lg"
                        title="Edit Formulation"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Decommission SKU"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ProductManagementPage
