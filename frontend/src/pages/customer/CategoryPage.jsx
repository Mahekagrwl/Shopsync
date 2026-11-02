import React, { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CATEGORIES } from '../../data/mockBeautyData'
import { useProducts } from '../../context/ProductContext'
import ProductCard from '../../components/common/ProductCard'
import { Sparkles, ArrowLeft, SlidersHorizontal } from 'lucide-react'

export function CategoryPage() {
  const { slug } = useParams()
  const { products: allProducts } = useProducts()
  const [sortBy, setSortBy] = useState('featured')

  // Find category metadata
  const currentCategory = CATEGORIES.find(c => c.slug === slug) || {
    name: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'Category',
    description: 'Consciously formulated beauty essentials.',
    slug
  }

  // Related subcategories if in makeup
  const subcategories = CATEGORIES.filter(c => c.parent === slug)

  const products = useMemo(() => {
    return allProducts.filter(p => {
      if (p.category === slug || p.subcategory === slug) {
        return true
      }
      return false
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
    })
  }, [allProducts, slug, sortBy])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Header */}
      <div className="bg-[#E9DED5] rounded-3xl p-8 sm:p-12 border border-[#D9A6AC]/60">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#542B43] hover:underline mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Formulations
        </Link>
        <span className="block text-xs font-bold uppercase tracking-widest text-[#542B43]">
          Curated Atelier Collection
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#282426] mt-1 capitalize">
          {currentCategory.name}
        </h1>
        <p className="text-xs sm:text-sm text-[#524B4F] mt-2 max-w-xl leading-relaxed">
          {currentCategory.description} All formulations are dermatologically tested and screened via SkinSafe protocols.
        </p>

        {/* Subcategories quick tabs */}
        {subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-6">
            <span className="text-xs text-[#827A7F] self-center mr-1">Subcategories:</span>
            {subcategories.map(sub => (
              <Link
                key={sub.id}
                to={`/category/${sub.slug}`}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white text-[#282426] hover:bg-[#542B43] hover:text-white transition-colors border border-[#D9A6AC]/40"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Top Controls Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E9DED5] shadow-xs">
        <span className="text-xs text-[#524B4F]">
          Showing <span className="font-bold text-[#282426]">{products.length}</span> {currentCategory.name} products
        </span>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#827A7F]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-medium rounded-xl border border-[#E9DED5] p-2 bg-[#F8F3EE] text-[#282426] focus:outline-none focus:ring-2 focus:ring-[#542B43]"
          >
            <option value="featured">Featured Curations</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E9DED5] p-8 space-y-3">
          <Sparkles className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#282426]">
            More formulations arriving soon in this collection
          </h3>
          <p className="text-xs text-[#827A7F] max-w-sm mx-auto">
            Our lab is currently perfecting new batches for {currentCategory.name}.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-2 text-xs font-bold text-[#542B43] bg-[#F8F3EE] px-4 py-2 rounded-xl"
          >
            Browse Other Collections
          </Link>
        </div>
      )}
    </div>
  )
}

export default CategoryPage
