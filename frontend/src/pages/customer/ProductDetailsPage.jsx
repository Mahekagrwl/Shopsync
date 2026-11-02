import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  Check,
  AlertCircle,
  Truck,
  RotateCcw,
  ArrowLeft,
  Share2,
  Zap
} from 'lucide-react'
import { BEAUTY_PRODUCTS, MOCK_REVIEWS } from '../../data/mockBeautyData'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import { useSkinSafe } from '../../context/SkinSafeContext'
import { useProducts } from '../../context/ProductContext'
import { formatINR } from '../../utils/currency'

export function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { isAuthenticated, isCustomer } = useAuth()
  const { checkProductSafety, allergies } = useSkinSafe()
  const { getProduct, products } = useProducts()

  const product = getProduct(id) || products.find(p => p.id === id) || products[0]

  const [activeImage, setActiveImage] = useState(0)
  const [selectedShade, setSelectedShade] = useState(
    product.shades && product.shades.length > 0 ? product.shades[0] : null
  )
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [addedToast, setAddedToast] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [heartSparks, setHeartSparks] = useState(false)

  // 3D Tilt State for Main Product Display
  const [imgTilt, setImgTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, isHovered: false })

  const isFavorited = isInWishlist(product.id)
  const safety = checkProductSafety(product)
  const hasShades = product.shades && product.shades.length > 0

  const handleImgMouseMove = (e) => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rx = -((y - rect.height / 2) / (rect.height / 2)) * 7
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 7
    setImgTilt({
      rx: Math.round(rx * 10) / 10,
      ry: Math.round(ry * 10) / 10,
      gx: Math.round((x / rect.width) * 100),
      gy: Math.round((y / rect.height) * 100),
      isHovered: true
    })
  }

  const handleImgMouseLeave = () => {
    setImgTilt({ rx: 0, ry: 0, gx: 50, gy: 50, isHovered: false })
  }

  const handleAddToCart = () => {
    setErrorMsg('')
    if (hasShades && !selectedShade) {
      setErrorMsg('Please select your preferred shade before adding to your bag.')
      return
    }

    // Login required for shopping actions
    if (!isAuthenticated || !isCustomer) {
      localStorage.setItem('shopsync_pending_intent', JSON.stringify({
        action: 'add_to_cart',
        product,
        selectedShade,
        quantity,
        targetUrl: `/product/${product.id}`
      }))
      navigate(`/login?redirect=${encodeURIComponent(`/product/${product.id}`)}&intent=add_to_cart`)
      return
    }

    const res = addToCart(product, selectedShade, quantity)
    if (res.success) {
      setAddedToast(true)
      setTimeout(() => setAddedToast(false), 3000)
    } else {
      setErrorMsg(res.error)
    }
  }

  const handleBuyNow = () => {
    setErrorMsg('')
    if (hasShades && !selectedShade) {
      setErrorMsg('Please select your preferred shade before purchasing.')
      return
    }

    // Login required for shopping actions
    if (!isAuthenticated || !isCustomer) {
      localStorage.setItem('shopsync_pending_intent', JSON.stringify({
        action: 'buy_now',
        product,
        selectedShade,
        quantity,
        targetUrl: '/checkout'
      }))
      navigate('/login?redirect=%2Fcheckout&intent=buy_now')
      return
    }

    const res = addToCart(product, selectedShade, quantity)
    if (res.success) {
      navigate('/checkout')
    } else {
      setErrorMsg(res.error)
    }
  }

  const handleWishlistToggle = () => {
    if (!isAuthenticated || !isCustomer) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname) + '&intent=wishlist')
      return
    }

    toggleWishlist(product.id)
    if (!isFavorited) {
      setHeartSparks(true)
      setTimeout(() => setHeartSparks(false), 700)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#827A7F]">
        <Link to="/" className="hover:text-[#542B43]">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[#542B43]">Shop</Link>
        <span>/</span>
        <Link to={`/category/${product.category}`} className="hover:text-[#542B43] capitalize">{product.category}</Link>
        <span>/</span>
        <span className="text-[#282426] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: 3D Gallery Showcase */}
        <div className="lg:col-span-7 space-y-4 perspective-1000">
          <div
            data-cursor-card="true"
            onMouseMove={handleImgMouseMove}
            onMouseLeave={handleImgMouseLeave}
            style={{
              transform: imgTilt.isHovered
                ? `perspective(1000px) rotateX(${imgTilt.rx}deg) rotateY(${imgTilt.ry}deg)`
                : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
              transition: imgTilt.isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
              boxShadow: imgTilt.isHovered
                ? '0 25px 45px -15px rgba(84, 43, 67, 0.2)'
                : '0 4px 15px -3px rgba(40, 36, 38, 0.05)'
            }}
            className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-white border border-[#E9DED5] transition-all"
          >
            {/* Dynamic Specular Gloss Sheen */}
            {imgTilt.isHovered && (
              <div
                className="absolute inset-0 pointer-events-none z-20 rounded-3xl transition-opacity duration-200"
                style={{
                  background: `radial-gradient(circle at ${imgTilt.gx}% ${imgTilt.gy}%, rgba(255,255,255,0.3) 0%, transparent 60%)`
                }}
              />
            )}

            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={product.images[activeImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </AnimatePresence>

            {product.isBestSeller && (
              <span className="absolute top-4 left-4 bg-[#542B43] text-white px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md z-10">
                Best Seller
              </span>
            )}
          </div>

          {/* Interactive Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 pt-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative h-20 w-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImage === idx ? 'border-[#542B43] shadow-md scale-105' : 'border-[#E9DED5] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {activeImage === idx && (
                    <div className="absolute inset-0 border-2 border-[#542B43] rounded-2xl pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Box & Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
              {product.brand}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426] leading-tight">
              {product.name}
            </h1>

            {/* Ratings & SKU */}
            <div className="flex items-center gap-4 text-xs pt-1">
              <div className="flex items-center gap-1 text-amber-600 font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-stone-400">({product.reviewsCount} verified reviews)</span>
              </div>
              <span className="text-stone-300">•</span>
              <span className="font-mono text-stone-400">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-3xl font-bold text-[#282426]">
              {formatINR(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-stone-400 line-through">
                {formatINR(product.comparePrice)}
              </span>
            )}
            {product.inStock && product.stockQuantity > 0 ? (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                product.stockQuantity <= 5
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {product.stockQuantity <= 5
                  ? `Only ${product.stockQuantity} Left in Stock`
                  : `In Stock (${product.stockQuantity} units available)`}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                Currently Sold Out
              </span>
            )}
          </div>

          {/* SkinSafe Allergen Cross-Check Banner */}
          <div className={`p-4 rounded-2xl border ${
            safety.isSafe
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-start gap-3">
              {safety.isSafe ? (
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <p className="font-bold">
                  {safety.isSafe ? 'SkinSafe™ Verified for Your Profile' : 'SkinSafe™ Allergen Warning'}
                </p>
                <p className="mt-0.5 leading-relaxed">
                  {safety.isSafe
                    ? 'Contains zero matches for your saved sensitivities (Fragrance-Free, Paraben-Free).'
                    : `Matches potential allergens in your profile: ${safety.flaggedAllergens.map(f => f.allergen).join(', ')}.`}
                </p>
              </div>
            </div>
          </div>

          {/* Makeup Shade Selector (MANDATORY FOR MAKEUP) */}
          {hasShades && (
            <div className="space-y-3 pt-2 border-t border-[#E9DED5]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-[#524B4F]">
                  Select Shade <span className="text-red-500">*</span>
                </span>
                {selectedShade && (
                  <span className="font-semibold text-[#542B43]">
                    {selectedShade.name} ({selectedShade.code})
                  </span>
                )}
              </div>

              {/* Shade attributes preview */}
              {selectedShade && (
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] bg-[#F8F3EE] p-2.5 rounded-xl border border-[#E9DED5]">
                  <div>
                    <span className="text-stone-400 block text-[9px] uppercase">Undertone</span>
                    <span className="font-semibold capitalize text-[#282426]">{selectedShade.undertone}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9px] uppercase">Finish</span>
                    <span className="font-semibold capitalize text-[#282426]">{selectedShade.finish}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9px] uppercase">Coverage</span>
                    <span className="font-semibold capitalize text-[#282426]">{selectedShade.coverage}</span>
                  </div>
                </div>
              )}

              {/* Shade Swatch Grid */}
              <div className="flex flex-wrap gap-2 pt-1">
                {product.shades.map((shade) => (
                  <button
                    key={shade.id}
                    title={`${shade.name} - ${shade.code} (${shade.undertone})`}
                    onClick={() => {
                      setSelectedShade(shade)
                      setErrorMsg('')
                    }}
                    className={`h-9 w-9 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedShade?.id === shade.id
                        ? 'border-[#542B43] ring-2 ring-[#542B43] ring-offset-2 scale-110'
                        : 'border-black/20 hover:scale-105'
                    }`}
                    style={{ backgroundColor: shade.hex }}
                  >
                    {selectedShade?.id === shade.id && (
                      <Check className="w-4 h-4 text-white drop-shadow-sm" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Controls & Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-[#E9DED5]">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#E9DED5] rounded-xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2.5 text-stone-600 hover:bg-[#F8F3EE] transition-colors text-sm font-bold"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-bold font-mono text-[#282426]">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={!product.inStock || product.stockQuantity <= 0}
                  onClick={() => setQuantity(Math.min(product.stockQuantity || 1, quantity + 1))}
                  className="px-3.5 py-2.5 text-stone-600 hover:bg-[#F8F3EE] transition-colors text-sm font-bold disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                disabled={!product.inStock || product.stockQuantity <= 0}
                onClick={handleAddToCart}
                className="flex-1 bg-white hover:bg-[#FFF9F5] text-[#352137] border-2 border-[#D985A5] py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4 text-[#D985A5]" />
                <span>{product.inStock && product.stockQuantity > 0 ? 'Add to Bag' : 'Sold Out'}</span>
              </button>

              {/* Buy Now Button */}
              <button
                type="button"
                disabled={!product.inStock || product.stockQuantity <= 0}
                onClick={handleBuyNow}
                className="flex-1 bg-[#352137] hover:bg-[#542B43] active:scale-98 text-white py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Buy Now</span>
              </button>

              {/* Wishlist Toggle with Animated Sparks */}
              <button
                type="button"
                onClick={handleWishlistToggle}
                className="relative p-3 rounded-xl border border-[#E9DED5] bg-white text-[#542B43] hover:bg-[#F8F3EE] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Toggle Wishlist"
              >
                <motion.div animate={{ scale: isFavorited ? [1, 1.35, 1] : 1 }}>
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-[#542B43]' : ''}`} />
                </motion.div>
                {heartSparks && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    className="absolute inset-0 rounded-xl border-2 border-[#D9A6AC] pointer-events-none"
                  />
                )}
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <p className="text-xs text-red-600 font-semibold p-2 bg-red-50 rounded-lg animate-pulse">
                {errorMsg}
              </p>
            )}

            {/* Added Toast */}
            {addedToast && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Successfully added to your shopping bag!</span>
                <Link to="/cart" className="ml-auto underline text-[#542B43]">View Bag</Link>
              </div>
            )}
          </div>

          {/* Shipping & Return Trust Indicators */}
          <div className="grid grid-cols-2 gap-3 text-[11px] text-[#524B4F] pt-2">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E9DED5]">
              <Truck className="w-4 h-4 text-[#542B43]" />
              <span>Free Express Delivery &gt; ₹499</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E9DED5]">
              <RotateCcw className="w-4 h-4 text-[#542B43]" />
              <span>30-Day Shade Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Ingredients, Reviews */}
      <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex border-b border-[#E9DED5] gap-8">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'description'
                ? 'border-b-2 border-[#542B43] text-[#542B43]'
                : 'text-stone-400 hover:text-[#282426]'
            }`}
          >
            Formulation Details
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'ingredients'
                ? 'border-b-2 border-[#542B43] text-[#542B43]'
                : 'text-stone-400 hover:text-[#282426]'
            }`}
          >
            Complete Ingredients Breakdown
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'reviews'
                ? 'border-b-2 border-[#542B43] text-[#542B43]'
                : 'text-stone-400 hover:text-[#282426]'
            }`}
          >
            Verified Client Reviews ({product.reviewsCount})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'description' && (
          <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-[#524B4F] leading-relaxed">
            <p>{product.description}</p>
            <div className="pt-2">
              <h4 className="font-serif font-bold text-sm text-[#282426] mb-2">Ethical Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {product.allergyTags?.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-[#F8F3EE] text-[#542B43] border border-[#D9A6AC]/40">
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="space-y-4 max-w-3xl text-xs text-[#524B4F] leading-relaxed">
            <p className="font-mono bg-[#F8F3EE] p-4 rounded-2xl border border-[#E9DED5]">
              {product.ingredients}
            </p>
            <p className="text-[11px] text-stone-400">
              Formulated strictly in compliance with EU Cosmetics Regulation 1223/2009 and verified free of synthetic phthalates, formaldehyde releasers, and harsh chemical filters.
            </p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_REVIEWS.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-[#F8F3EE] border border-[#E9DED5] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#282426]">{rev.author}</span>
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#524B4F] italic leading-relaxed">"{rev.comment}"</p>
                  <p className="text-[10px] text-stone-400">{rev.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetailsPage
