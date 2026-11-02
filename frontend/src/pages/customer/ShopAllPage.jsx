import React, { useState, useMemo } from 'react'
import { CATEGORIES, BRANDS } from '../../data/mockBeautyData'
import { useProducts } from '../../context/ProductContext'
import ProductCard from '../../components/common/ProductCard'
import { Filter, SlidersHorizontal, Sparkles, X, ChevronDown } from 'lucide-react'
import { formatINR } from '../../utils/currency'

export function ShopAllPage() {
  const { products } = useProducts()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [maxPrice, setMaxPrice] = useState(4000)
  const [onlyInStock, setOnlyInStock] = useState(false)
  const [onlySafe, setOnlySafe] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (prod.category !== selectedCategory && prod.subcategory !== selectedCategory) {
          return false
        }
      }
      // Brand filter
      if (selectedBrand !== 'all' && prod.brand !== selectedBrand) {
        return false
      }
      // Price filter
      if (prod.price > maxPrice) {
        return false
      }
      // In-stock
      if (onlyInStock && !prod.inStock) {
        return false
      }
      return true
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0)
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
    })
  }, [products, selectedCategory, selectedBrand, sortBy, maxPrice, onlyInStock])

  const clearAllFilters = () => {
    setSelectedCategory('all')
    setSelectedBrand('all')
    setMaxPrice(4000)
    setOnlyInStock(false)
    setSortBy('featured')
  }

  const hasActiveFilters = selectedCategory !== 'all' || selectedBrand !== 'all' || maxPrice < 4000 || onlyInStock

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#E9DED5] rounded-3xl p-8 sm:p-12 border border-[#D9A6AC]/60">
        <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
          Full Formulation Atelier
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#282426] mt-1">
          Explore All Products
        </h1>
        <p className="text-xs sm:text-sm text-[#524B4F] mt-2 max-w-xl leading-relaxed">
          Screened for sensitive skin, cruelty-free, and formulated with clinical dermatological actives. Filter by shade, formulation type, and allergens.
        </p>
      </div>

      {/* Main Layout: Filters Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block bg-white rounded-2xl p-6 border border-[#E9DED5] space-y-6 sticky top-28 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#E9DED5]">
            <span className="font-serif font-bold text-sm text-[#282426] flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#542B43]" /> Filter Collection
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#542B43] hover:underline font-semibold"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#524B4F]">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs rounded-xl border border-[#E9DED5] p-2.5 bg-[#F8F3EE] text-[#282426] focus:outline-none focus:ring-2 focus:ring-[#542B43]"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#524B4F]">
              Atelier Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full text-xs rounded-xl border border-[#E9DED5] p-2.5 bg-[#F8F3EE] text-[#282426] focus:outline-none focus:ring-2 focus:ring-[#542B43]"
            >
              <option value="all">All Brands</option>
              {BRANDS.map(brand => (
                <option key={brand.id} value={brand.name}>{brand.name}</option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-[#524B4F]">
              <span>Max Price</span>
              <span className="text-[#542B43] font-mono">{formatINR(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="300"
              max="4000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#542B43]"
            />
          </div>

          {/* Availability Toggle */}
          <div className="pt-2 border-t border-[#E9DED5] space-y-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#282426]">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded text-[#542B43] focus:ring-[#542B43]"
              />
              <span>In-Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Products Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E9DED5] shadow-xs">
            <div className="text-xs text-[#524B4F]">
              Showing <span className="font-bold text-[#282426]">{filteredProducts.length}</span> formulations
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-[#E9DED5] text-xs font-semibold text-[#282426]"
              >
                <Filter className="w-3.5 h-3.5" /> Filters
              </button>

              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <span className="text-xs text-[#827A7F] hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-medium rounded-xl border border-[#E9DED5] p-2 bg-[#F8F3EE] text-[#282426] focus:outline-none focus:ring-2 focus:ring-[#542B43]"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">New Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-stone-400">Active Filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#542B43] text-white">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedBrand !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#542B43] text-white">
                  Brand: {selectedBrand}
                  <button onClick={() => setSelectedBrand('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {maxPrice < 4000 && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#542B43] text-white">
                  Under {formatINR(maxPrice)}
                  <button onClick={() => setMaxPrice(4000)}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E9DED5] p-8 space-y-3">
              <Sparkles className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#282426]">
                No matching formulations found
              </h3>
              <p className="text-xs text-[#827A7F] max-w-sm mx-auto">
                Try widening your price range or clearing specific category filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-2 text-xs font-bold text-[#542B43] bg-[#F8F3EE] px-4 py-2 rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShopAllPage
