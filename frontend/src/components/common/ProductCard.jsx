import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Star, Sparkles, Check, AlertCircle, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useSkinSafe } from '../../context/SkinSafeContext'
import { useProducts } from '../../context/ProductContext'
import { formatINR } from '../../utils/currency'

export function ProductCard({ product, featured = false }) {
  const navigate = useNavigate()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { isAuthenticated, isCustomer } = useAuth()
  const { checkProductSafety } = useSkinSafe()
  const { getProduct } = useProducts()

  // Real-time central stock synchronization
  const liveProduct = getProduct(product.id) || product

  const [selectedShade, setSelectedShade] = useState(
    product.shades && product.shades.length > 0 ? product.shades[0] : null
  )
  const [imgSrc, setImgSrc] = useState(product.images?.[0] || 'https://images.unsplash.com/photo-1629732047847-50219e9c5aef?w=800')
  const [addedAnimation, setAddedAnimation] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [heartSparks, setHeartSparks] = useState(false)

  // Sync image source if product changes
  React.useEffect(() => {
    setImgSrc(product.images?.[0] || 'https://images.unsplash.com/photo-1629732047847-50219e9c5aef?w=800')
  }, [product.images])

  // 3D Tilt State
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glareX: 50, glareY: 50, isHovered: false })

  const isFavorited = isInWishlist(product.id)
  const safety = checkProductSafety(product)
  const hasShades = product.shades && product.shades.length > 0

  // 3D Mouse Movement handler
  const handleCardMouseMove = (e) => {
    // Only apply on fine-pointer devices (desktop mouse)
    if (!window.matchMedia('(pointer: fine)').matches) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rx = -((y - rect.height / 2) / (rect.height / 2)) * 6 // max 6deg tilt
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 6 // max 6deg tilt
    setTilt({
      rx: Math.round(rx * 10) / 10,
      ry: Math.round(ry * 10) / 10,
      glareX: Math.round((x / rect.width) * 100),
      glareY: Math.round((y / rect.height) * 100),
      isHovered: true
    })
  }

  const handleCardMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, glareX: 50, glareY: 50, isHovered: false })
  }

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Requirement: Browsing is public, but clicking Add to Cart / Buy Now redirects to login
    if (!isAuthenticated || !isCustomer) {
      localStorage.setItem('shopsync_pending_intent', JSON.stringify({
        action: 'add_to_cart',
        product,
        selectedShade,
        quantity: 1,
        targetUrl: '/cart'
      }))
      navigate('/login?redirect=%2Fcart&intent=add_to_cart')
      return
    }

    if (hasShades && !selectedShade) {
      setErrorMessage('Select shade first')
      setTimeout(() => setErrorMessage(''), 2500)
      return
    }

    const res = addToCart(product, selectedShade, 1)
    if (res.success) {
      setAddedAnimation(true)
      setTimeout(() => setAddedAnimation(false), 2000)
    } else {
      setErrorMessage(res.error)
      setTimeout(() => setErrorMessage(''), 2500)
    }
  }

  const handleWishlistClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated || !isCustomer) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname) + '&intent=wishlist')
      return
    }

    toggleWishlist(product.id)
    if (!isFavorited) {
      setHeartSparks(true)
      setTimeout(() => setHeartSparks(false), 800)
    }
  }

  return (
    <motion.div
      data-cursor-card="true"
      onMouseMove={handleCardMouseMove}
      onMouseLeave={handleCardMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{
        transform: tilt.isHovered
          ? `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-8px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: tilt.isHovered ? 'transform 0.12s ease-out' : 'transform 0.5s ease-out',
        boxShadow: tilt.isHovered
          ? '0 20px 30px -10px rgba(84, 43, 67, 0.14), 0 10px 15px -5px rgba(217, 166, 172, 0.15)'
          : '0 2px 8px 0 rgba(40, 36, 38, 0.04)',
      }}
      className="group relative flex flex-col rounded-3xl bg-white border border-[#E9DED5] overflow-hidden transition-all duration-300"
    >
      {/* 3D Specular Glare Overlay */}
      {tilt.isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-20 rounded-3xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.35) 0%, transparent 65%)`
          }}
        />
      )}

      {/* Product Image Container with Zoom */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F8F3EE]">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={imgSrc}
            alt={product.name}
            onError={() => setImgSrc('https://images.unsplash.com/photo-1629732047847-50219e9c5aef?w=800')}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
            loading="lazy"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
          {product.isBestSeller && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#542B43] text-white shadow-xs">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D9A6AC] text-[#282426] shadow-xs">
              New Arrival
            </span>
          )}
          {!safety.isSafe && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 shadow-xs">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              Allergen Match
            </span>
          )}
        </div>

        {/* Animated Wishlist Heart Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#542B43] shadow-md backdrop-blur-xs hover:bg-white hover:scale-115 active:scale-90 transition-all cursor-pointer"
        >
          <motion.div
            animate={{ scale: isFavorited ? [1, 1.4, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorited ? 'fill-[#542B43] text-[#542B43]' : 'text-stone-400 hover:text-[#542B43]'
              }`}
            />
          </motion.div>
          {heartSparks && (
            <motion.div
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              className="absolute inset-0 rounded-full border-2 border-[#D9A6AC] pointer-events-none"
            />
          )}
        </button>

        {/* Quick Add Overlay on Desktop */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-10">
          <button
            onClick={handleQuickAdd}
            disabled={!liveProduct.inStock || liveProduct.stockQuantity <= 0}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
              addedAnimation
                ? 'bg-emerald-700 text-white scale-[1.02]'
                : liveProduct.inStock && liveProduct.stockQuantity > 0
                ? 'bg-[#542B43] hover:bg-[#3B1E2F] text-white active:scale-95'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            {addedAnimation ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Added to Bag
              </motion.div>
            ) : liveProduct.inStock && liveProduct.stockQuantity > 0 ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#D9A6AC]" />
                {hasShades && product.category === 'makeup' ? `Add (${selectedShade?.name || 'Select'})` : 'Quick Add'}
              </>
            ) : (
              'Sold Out'
            )}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-4 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-[#827A7F]">
          <span className="uppercase tracking-widest font-semibold">{product.brand}</span>
          <div className="flex items-center gap-1 text-[#282426]">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-xs">{product.rating}</span>
            <span className="text-[10px] text-stone-400">({product.reviewsCount})</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`} className="group-hover:text-[#542B43] transition-colors">
          <h3 className="font-serif font-bold text-sm text-[#282426] line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-[#524B4F] line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Shades Palette if makeup */}
        {hasShades && product.category === 'makeup' && (
          <div className="pt-2 flex items-center gap-1.5 overflow-x-auto py-1">
            {product.shades.slice(0, 5).map((shade) => (
              <button
                key={shade.id}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setSelectedShade(shade)
                }}
                title={`${shade.name} (${shade.code})`}
                style={{ backgroundColor: shade.hex }}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedShade?.id === shade.id
                    ? 'ring-2 ring-[#542B43] ring-offset-1 scale-115 border-white'
                    : 'border-black/20 hover:scale-110'
                }`}
              />
            ))}
            {product.shades.length > 5 && (
              <span className="text-[10px] text-stone-400 font-mono ml-0.5">
                +{product.shades.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Price & Status Row */}
        <div className="pt-2 border-t border-[#F4C6D5]/60 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-[#352137]">
              {formatINR(product.price)}
            </span>
            {(product.comparePrice || product.compareAtPrice) && (
              <span className="text-xs text-stone-400 line-through">
                {formatINR(product.comparePrice || product.compareAtPrice)}
              </span>
            )}
          </div>

          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${
              liveProduct.inStock && liveProduct.stockQuantity > 0
                ? liveProduct.stockQuantity <= 5
                  ? 'text-amber-700'
                  : 'text-emerald-700'
                : 'text-rose-500'
            }`}
          >
            {liveProduct.inStock && liveProduct.stockQuantity > 0
              ? liveProduct.stockQuantity <= 5
                ? `Only ${liveProduct.stockQuantity} left`
                : 'In Stock'
              : 'Sold Out'}
          </span>
        </div>

        {/* Error Toast */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-[10px] font-semibold text-rose-700 bg-rose-50 p-1.5 rounded-lg text-center border border-rose-200"
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default ProductCard
