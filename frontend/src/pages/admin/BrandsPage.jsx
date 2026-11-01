import React, { useState } from 'react'
import { Tag, Plus, Trash2, Globe, Sparkles } from 'lucide-react'
import { BRANDS } from '../../data/mockBeautyData'

export function BrandsPage() {
  const [brands, setBrands] = useState(BRANDS)
  const [name, setName] = useState('')
  const [origin, setOrigin] = useState('')
  const [badge, setBadge] = useState('Clean Luxury')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name) return

    const newBrand = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      origin: origin || 'Geneva, Switzerland',
      badge
    }

    setBrands([...brands, newBrand])
    setName('')
    setOrigin('')
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
          Supplier & Atelier Registry
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
          Featured Atelier Brands
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Brands Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {brands.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl border border-[#E9DED5] p-5 flex items-center justify-between shadow-xs"
            >
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F8F3EE] text-[#542B43]">
                  {b.badge}
                </span>
                <h3 className="font-serif font-bold text-base text-[#282426]">{b.name}</h3>
                <p className="text-xs text-[#827A7F] flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-stone-400" /> {b.origin}
                </p>
              </div>

              <button
                onClick={() => setBrands(brands.filter(item => item.id !== b.id))}
                className="text-stone-300 hover:text-red-600 p-2"
                title="Remove Brand"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Brand Form */}
        <form onSubmit={handleAdd} className="lg:col-span-4 bg-white rounded-3xl border border-[#E9DED5] p-6 space-y-4 shadow-xs text-xs">
          <h3 className="font-serif font-bold text-base text-[#282426]">
            Register Atelier Partner
          </h3>

          <div>
            <label className="block font-semibold uppercase text-[#524B4F] mb-1">Brand Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maison de Rose"
              className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#524B4F] mb-1">Origin City & Country</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Tokyo, Japan"
              className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#524B4F] mb-1">Formulation Badge</label>
            <select
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5 text-xs"
            >
              <option value="Clean Luxury">Clean Luxury</option>
              <option value="High Pigment">High Pigment</option>
              <option value="Clinical AI">Clinical AI</option>
              <option value="Bio-Fermented">Bio-Fermented</option>
              <option value="Mineral SPF">Mineral SPF</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#542B43] hover:bg-[#3B1E2F] text-white py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Register Atelier
          </button>
        </form>
      </div>
    </div>
  )
}

export default BrandsPage
