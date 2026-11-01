import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Sparkles, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import { BEAUTY_PRODUCTS } from '../../data/mockBeautyData'
import ProductCard from '../../components/common/ProductCard'

export function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const wishlistProducts = BEAUTY_PRODUCTS.filter(p => wishlist.includes(p.id))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#E9DED5] rounded-3xl p-8 sm:p-12 border border-[#D9A6AC]/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
            Curated Favorites
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#282426] mt-1">
            My Wishlist ({wishlistProducts.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#524B4F] mt-1">
            Formulations and shades saved for your next boutique or online order.
          </p>
        </div>
        <Link
          to="/shop"
          className="text-xs font-bold text-[#542B43] bg-white px-5 py-2.5 rounded-full border border-[#D9A6AC] shadow-xs"
        >
          Continue Browsing
        </Link>
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map(product => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="mt-2 w-full py-1.5 text-xs text-red-600 hover:text-red-800 font-medium flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E9DED5] p-8 space-y-4">
          <div className="h-16 w-16 rounded-full bg-[#F8F3EE] text-[#D9A6AC] mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#282426]">
            Your wishlist is currently empty
          </h3>
          <p className="text-xs text-[#827A7F] max-w-sm mx-auto">
            Discover clean clinical skincare and personalized complexion shades to save for later.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#542B43] text-white text-xs font-semibold px-6 py-3 rounded-full shadow-md"
          >
            Explore Beauty Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

export default WishlistPage
