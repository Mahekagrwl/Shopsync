import React, { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { BEAUTY_PRODUCTS } from '../../data/mockBeautyData'
import ProductCard from '../../components/common/ProductCard'
import { Search, Sparkles, ArrowLeft } from 'lucide-react'

export function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return BEAUTY_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.ingredients.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="bg-[#E9DED5] rounded-3xl p-8 sm:p-12 border border-[#D9A6AC]/60">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#542B43] hover:underline mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Catalog
        </Link>
        <span className="block text-xs font-bold uppercase tracking-widest text-[#542B43]">
          Search Results
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#282426] mt-1">
          {query ? `Results for "${query}"` : 'Search Formulas'}
        </h1>
        <p className="text-xs sm:text-sm text-[#524B4F] mt-2">
          Found <span className="font-bold text-[#282426]">{results.length}</span> matching beauty items
        </p>
      </div>

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E9DED5] p-8 space-y-4">
          <Search className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#282426]">
            No formulations matched your query
          </h3>
          <p className="text-xs text-[#827A7F] max-w-sm mx-auto">
            Try searching for terms like "foundation", "serum", "SPF", "peptides", or "Velour".
          </p>
          <Link
            to="/shop"
            className="inline-block text-xs font-bold text-[#542B43] bg-[#F8F3EE] px-5 py-2.5 rounded-xl border border-[#D9A6AC]"
          >
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  )
}

export default SearchResultsPage
