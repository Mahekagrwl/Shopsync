import React, { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2, Sparkles } from 'lucide-react'
import { BEAUTY_PRODUCTS, CATEGORIES, BRANDS } from '../../data/mockBeautyData'

export function AddEditProductPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const existing = isEditing ? BEAUTY_PRODUCTS.find(p => p.id === id) : null

  // Form states
  const [name, setName] = useState(existing?.name || '')
  const [brand, setBrand] = useState(existing?.brand || 'Velour Atelier')
  const [category, setCategory] = useState(existing?.category || 'makeup')
  const [subcategory, setSubcategory] = useState(existing?.subcategory || 'face-makeup')
  const [price, setPrice] = useState(existing?.price || 48.00)
  const [costPrice, setCostPrice] = useState(18.50)
  const [stockQuantity, setStockQuantity] = useState(existing?.stockQuantity || 60)
  const [sku, setSku] = useState(existing?.sku || 'VA-NEW-009')
  const [barcode, setBarcode] = useState(existing?.barcode || '890123450098')
  const [description, setDescription] = useState(existing?.description || '')
  const [ingredients, setIngredients] = useState(existing?.ingredients || '')
  const [imageUrl, setImageUrl] = useState(existing?.images?.[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800')

  // Dynamic shades
  const [shades, setShades] = useState(
    existing?.shades || [
      { id: 'sh-1', name: 'Alabaster Light', code: '090W', hex: '#FBE8DB', undertone: 'warm', finish: 'dewy', coverage: 'medium' }
    ]
  )
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleAddShade = () => {
    setShades([
      ...shades,
      {
        id: 'sh-' + Date.now(),
        name: 'New Custom Shade',
        code: '150N',
        hex: '#E0B594',
        undertone: 'neutral',
        finish: 'natural',
        coverage: 'full'
      }
    ])
  }

  const handleRemoveShade = (idx) => {
    setShades(shades.filter((_, i) => i !== idx))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
      navigate('/admin/products')
    }, 1200)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back */}
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#542B43] hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
            Formulation Master
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#282426]">
            {isEditing ? `Edit Formulation: ${name}` : 'Register New Formulation SKU'}
          </h1>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>Formulation successfully committed to database and synchronized with POS registers!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-4 shadow-xs text-xs">
          <h3 className="font-serif font-bold text-base text-[#282426]">
            1. Core Formulation Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold uppercase text-[#524B4F] mb-1">
                Product Formulation Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Silk Radiance Luminous Foundation"
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-[#524B4F] mb-1">Brand *</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs"
              >
                {BRANDS.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase text-[#524B4F] mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase text-[#524B4F] mb-1">SKU Code *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-[#524B4F] mb-1">Barcode (EAN-13 / UPC) *</label>
              <input
                type="text"
                required
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold uppercase text-[#524B4F] mb-1">Product Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-4 shadow-xs text-xs">
          <h3 className="font-serif font-bold text-base text-[#282426]">
            2. Commercial Pricing & Initial Batch Stock
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold uppercase text-[#524B4F] mb-1">Retail Price (₹) *</label>
              <input
                type="number"
                step="1"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-[#524B4F] mb-1">Cost of Goods / COGS (₹)</label>
              <input
                type="number"
                step="1"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-[#524B4F] mb-1">Initial Reserve Stock Units *</label>
              <input
                type="number"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Ingredients & Clinical Copy */}
        <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-4 shadow-xs text-xs">
          <h3 className="font-serif font-bold text-base text-[#282426]">
            3. INCI Ingredients & Description
          </h3>

          <div>
            <label className="block font-semibold uppercase text-[#524B4F] mb-1">
              Full Scientific INCI Ingredient List (Comma-separated)
            </label>
            <textarea
              rows={3}
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 font-mono text-xs"
              placeholder="Aqua, Glycerin, Sodium Hyaluronate, Niacinamide, Squalane..."
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#524B4F] mb-1">Description & Texture Profile</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs"
              placeholder="Describe sensory payoff, longevity, and clinical claims..."
            />
          </div>
        </div>

        {/* Makeup Shades Configuration */}
        <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-4 shadow-xs text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-[#282426]">
                4. Complexion Shades & Swatches
              </h3>
              <p className="text-[#827A7F]">
                Configure undertones (Warm, Cool, Neutral), finish, and hexadecimal color codes.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddShade}
              className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Shade Swatch
            </button>
          </div>

          <div className="space-y-3">
            {shades.map((shade, idx) => (
              <div key={shade.id || idx} className="grid grid-cols-1 sm:grid-cols-6 gap-2 p-3 bg-[#F8F3EE] rounded-2xl border border-[#E9DED5] items-center">
                <input
                  type="text"
                  placeholder="Shade Name"
                  value={shade.name}
                  onChange={(e) => {
                    const updated = [...shades]
                    updated[idx].name = e.target.value
                    setShades(updated)
                  }}
                  className="rounded-lg border border-[#E9DED5] bg-white p-2 text-xs sm:col-span-2"
                />

                <input
                  type="text"
                  placeholder="Code (e.g. 100W)"
                  value={shade.code}
                  onChange={(e) => {
                    const updated = [...shades]
                    updated[idx].code = e.target.value
                    setShades(updated)
                  }}
                  className="rounded-lg border border-[#E9DED5] bg-white p-2 text-xs font-mono"
                />

                <select
                  value={shade.undertone}
                  onChange={(e) => {
                    const updated = [...shades]
                    updated[idx].undertone = e.target.value
                    setShades(updated)
                  }}
                  className="rounded-lg border border-[#E9DED5] bg-white p-2 text-xs"
                >
                  <option value="warm">Warm</option>
                  <option value="cool">Cool</option>
                  <option value="neutral">Neutral</option>
                </select>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={shade.hex}
                    onChange={(e) => {
                      const updated = [...shades]
                      updated[idx].hex = e.target.value
                      setShades(updated)
                    }}
                    className="h-8 w-10 p-0.5 rounded border border-[#E9DED5] cursor-pointer"
                  />
                  <span className="font-mono text-[10px] text-stone-500">{shade.hex}</span>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveShade(idx)}
                    className="text-stone-400 hover:text-red-600 p-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            to="/admin/products"
            className="px-6 py-3 rounded-xl border border-[#E9DED5] text-xs font-semibold text-[#282426] hover:bg-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Formulation Record
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddEditProductPage
