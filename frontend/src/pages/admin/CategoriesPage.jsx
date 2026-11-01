import React, { useState } from 'react'
import { FolderTree, Plus, Trash2, Edit2, Sparkles } from 'lucide-react'
import { CATEGORIES } from '../../data/mockBeautyData'

export function CategoriesPage() {
  const [categories, setCategories] = useState(CATEGORIES)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name) return

    const newCat = {
      id: slug || name.toLowerCase().replace(/\s+/g, '-'),
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description
    }

    setCategories([...categories, newCat])
    setName('')
    setSlug('')
    setDescription('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
            Taxonomy Architecture
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
            Categories & Subcategories
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E9DED5] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F]">
              <tr>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug URI</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9DED5]">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-[#F8F3EE]">
                  <td className="py-3 px-4 font-semibold text-[#282426] flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-[#542B43]" />
                    {c.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#542B43]">{c.slug}</td>
                  <td className="py-3 px-4 text-[#524B4F] max-w-xs truncate">{c.description}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setCategories(categories.filter(item => item.id !== c.id))}
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

        {/* Add Category Form */}
        <form onSubmit={handleAdd} className="lg:col-span-4 bg-white rounded-3xl border border-[#E9DED5] p-6 space-y-4 shadow-xs text-xs">
          <h3 className="font-serif font-bold text-base text-[#282426]">
            Add New Category
          </h3>

          <div>
            <label className="block font-semibold uppercase text-[#524B4F] mb-1">Category Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))
              }}
              placeholder="e.g. Cleansers & Toners"
              className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#524B4F] mb-1">URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#524B4F] mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5 text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#542B43] hover:bg-[#3B1E2F] text-white py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Category
          </button>
        </form>
      </div>
    </div>
  )
}

export default CategoriesPage
