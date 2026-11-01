import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Sparkles,
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Cpu,
  Store,
  LayoutDashboard
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import { BEAUTY_PRODUCTS } from '../../data/mockBeautyData'

export function CustomerNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { totalItemCount } = useCart()
  const { wishlistCount } = useWishlist()
  const { customer, isCustomerAuthenticated, logoutCustomer } = useAuth()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [makeupDropdown, setMakeupDropdown] = useState(false)
  const [aiDropdown, setAiDropdown] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)

  const searchResults = searchQuery.trim()
    ? BEAUTY_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : []

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E9DED5]">
      {/* 1. Announcement Bar */}
      <div className="bg-[#542B43] text-[#F8F3EE] text-[11px] font-medium py-1.5 px-4 text-center tracking-wider">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden sm:inline-block text-[#D9A6AC]">✦ Boutique Quality & Lab Precision</span>
          <div className="flex-1 text-center font-medium">
            Complimentary Luxury Express Shipping on Orders Over $50 • Use Code <span className="font-bold text-[#D9A6AC] underline">SHOPSYNC15</span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-[#E9DED5] text-[10px]">
            <Link to="/pos" className="hover:text-white flex items-center gap-1 transition-colors">
              <Store className="w-3 h-3" /> POS Terminal
            </Link>
            <span>•</span>
            <Link to="/admin/dashboard" className="hover:text-white flex items-center gap-1 transition-colors">
              <LayoutDashboard className="w-3 h-3" /> Admin
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#282426] hover:bg-[#F8F3EE]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group" title="ShopSync Homepage">
              <img
                src="/logo.jpg"
                alt="ShopSync Logo"
                className="h-11 w-11 rounded-2xl object-cover shadow-sm border border-[#E9DED5] transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#282426] group-hover:text-[#542B43] transition-colors leading-none">
                  Shop<span className="text-[#542B43]">Sync</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#827A7F] font-semibold mt-1">
                  Smart Retail • Beauty Tech
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold uppercase tracking-wider text-[#282426]">
            <Link to="/shop" className="hover:text-[#542B43] transition-colors py-2">
              Shop All
            </Link>
            <Link to="/category/skincare" className="hover:text-[#542B43] transition-colors py-2">
              Skincare
            </Link>

            {/* Makeup Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMakeupDropdown(true)}
              onMouseLeave={() => setMakeupDropdown(false)}
            >
              <Link
                to="/category/makeup"
                className="flex items-center gap-1 hover:text-[#542B43] transition-colors py-2"
              >
                <span>Makeup</span>
                <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
              </Link>
              {makeupDropdown && (
                <div className="absolute top-full left-0 w-48 bg-white border border-[#E9DED5] rounded-xl shadow-xl py-2 z-50">
                  <Link
                    to="/category/face-makeup"
                    className="block px-4 py-2 hover:bg-[#F8F3EE] hover:text-[#542B43] text-xs normal-case tracking-normal font-medium"
                  >
                    Face Makeup (Foundation, Concealer)
                  </Link>
                  <Link
                    to="/category/eye-makeup"
                    className="block px-4 py-2 hover:bg-[#F8F3EE] hover:text-[#542B43] text-xs normal-case tracking-normal font-medium"
                  >
                    Eye Makeup (Shadows, Liner)
                  </Link>
                  <Link
                    to="/category/lip-makeup"
                    className="block px-4 py-2 hover:bg-[#F8F3EE] hover:text-[#542B43] text-xs normal-case tracking-normal font-medium"
                  >
                    Lip Makeup (Lipsticks, Oils)
                  </Link>
                </div>
              )}
            </div>

            <Link to="/category/haircare" className="hover:text-[#542B43] transition-colors py-2">
              Haircare
            </Link>
            <Link to="/category/body-care" className="hover:text-[#542B43] transition-colors py-2">
              Body Care
            </Link>
            <Link to="/category/sunscreen" className="hover:text-[#542B43] transition-colors py-2">
              Sunscreen
            </Link>

            {/* AI Tech Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAiDropdown(true)}
              onMouseLeave={() => setAiDropdown(false)}
            >
              <button className="flex items-center gap-1 text-[#542B43] bg-[#D9A6AC]/20 px-3 py-1.5 rounded-full hover:bg-[#D9A6AC]/30 transition-all">
                <Cpu className="h-3.5 w-3.5 text-[#542B43]" />
                <span className="font-bold">AI Studio</span>
                <ChevronDown className="h-3 w-3 text-[#542B43]" />
              </button>
              {aiDropdown && (
                <div className="absolute top-full right-0 w-64 bg-white border border-[#E9DED5] rounded-xl shadow-xl p-3 z-50">
                  <Link
                    to="/ai-skin-analysis"
                    className="block p-2 rounded-lg hover:bg-[#F8F3EE] transition-colors"
                  >
                    <p className="font-semibold text-xs text-[#542B43] flex items-center gap-1.5 normal-case tracking-normal">
                      <Sparkles className="w-3.5 h-3.5" /> AI Face Scanner & Analysis
                    </p>
                    <p className="text-[11px] text-stone-500 normal-case tracking-normal">
                      Live camera face alignment, 8 skin traits & AM/PM routines
                    </p>
                  </Link>
                  <Link
                    to="/ai-recommendations"
                    className="block p-2 rounded-lg hover:bg-[#F8F3EE] transition-colors"
                  >
                    <p className="font-semibold text-xs text-[#542B43] flex items-center gap-1.5 normal-case tracking-normal">
                      <Cpu className="w-3.5 h-3.5" /> Smart Recommendations
                    </p>
                    <p className="text-[11px] text-stone-500 normal-case tracking-normal">
                      Allergy-aware personalized formulations
                    </p>
                  </Link>
                  <Link
                    to="/skinsafe"
                    className="block p-2 rounded-lg hover:bg-[#F8F3EE] transition-colors"
                  >
                    <p className="font-semibold text-xs text-emerald-800 flex items-center gap-1.5 normal-case tracking-normal">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> SkinSafe Checker
                    </p>
                    <p className="text-[11px] text-stone-500 normal-case tracking-normal">
                      Filter irritants, nut oils & allergens
                    </p>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#282426] hover:text-[#542B43] hover:bg-[#F8F3EE] rounded-full transition-colors"
              aria-label="Search Catalog"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 text-[#282426] hover:text-[#542B43] hover:bg-[#F8F3EE] rounded-full transition-colors"
              aria-label="View Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#542B43] text-[9px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative p-2 text-[#282426] hover:text-[#542B43] hover:bg-[#F8F3EE] rounded-full transition-colors"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItemCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D9A6AC] text-[9px] font-bold text-[#282426]">
                  {totalItemCount}
                </span>
              )}
            </Link>

            {/* Customer Profile / Auth Menu */}
            <div className="relative">
              {isCustomerAuthenticated ? (
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#F8F3EE] transition-colors"
                >
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-[#D9A6AC]"
                  />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-[#282426] hover:text-[#542B43] hover:bg-[#F8F3EE] rounded-full transition-colors"
                  aria-label="Customer Login"
                >
                  <User className="h-5 w-5" />
                </Link>
              )}

              {userDropdown && isCustomerAuthenticated && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white border border-[#E9DED5] shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#E9DED5]/60">
                    <p className="text-xs font-semibold text-[#282426] truncate">{customer.name}</p>
                    <p className="text-[10px] text-[#827A7F] truncate">{customer.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#D9A6AC]/20 text-[#542B43]">
                      {customer.loyaltyTier}
                    </span>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdown(false)}
                    className="block px-4 py-2 text-xs text-[#282426] hover:bg-[#F8F3EE]"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setUserDropdown(false)}
                    className="block px-4 py-2 text-xs text-[#282426] hover:bg-[#F8F3EE]"
                  >
                    My Orders & Tracking
                  </Link>
                  <Link
                    to="/saved-addresses"
                    onClick={() => setUserDropdown(false)}
                    className="block px-4 py-2 text-xs text-[#282426] hover:bg-[#F8F3EE]"
                  >
                    Saved Addresses
                  </Link>
                  <button
                    onClick={() => {
                      logoutCustomer()
                      setUserDropdown(false)
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 border-t border-[#E9DED5]/60 mt-1"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Search Drawer / Overlay */}
        {searchOpen && (
          <div className="pb-4 pt-1">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search formulas, clean skincare, foundations, shade 100W, ceramides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8F3EE] border border-[#D9A6AC] rounded-xl px-4 py-3 pl-11 text-sm text-[#282426] focus:outline-none focus:ring-2 focus:ring-[#542B43]"
              />
              <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-[#827A7F]" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700 text-xs font-semibold"
                >
                  Clear
                </button>
              )}
            </form>

            {/* Live Autocomplete Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-white rounded-xl border border-[#E9DED5] shadow-lg p-3 space-y-2">
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#827A7F] px-2">
                  Matching Products
                </span>
                {searchResults.map(prod => (
                  <Link
                    key={prod.id}
                    to={`/product/${prod.id}`}
                    onClick={() => {
                      setSearchOpen(false)
                      setSearchQuery('')
                    }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F8F3EE] transition-colors"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#282426] truncate">{prod.name}</p>
                      <p className="text-[10px] text-stone-500">{prod.brand} • ${prod.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E9DED5] bg-[#F8F3EE] px-4 pt-3 pb-6 space-y-2 text-sm font-semibold">
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#282426] hover:text-[#542B43]"
          >
            Shop All Products
          </Link>
          <Link
            to="/category/skincare"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#282426] hover:text-[#542B43]"
          >
            Skincare
          </Link>
          <Link
            to="/category/makeup"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#282426] hover:text-[#542B43]"
          >
            Makeup Collection
          </Link>
          <Link
            to="/category/haircare"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#282426] hover:text-[#542B43]"
          >
            Haircare
          </Link>
          <Link
            to="/category/body-care"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#282426] hover:text-[#542B43]"
          >
            Body Care
          </Link>
          <Link
            to="/category/sunscreen"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#282426] hover:text-[#542B43]"
          >
            Sunscreen
          </Link>
          <Link
            to="/category/accessories"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#282426] hover:text-[#542B43]"
          >
            Beauty Accessories
          </Link>

          <div className="pt-3 border-t border-[#E9DED5] space-y-2">
            <Link
              to="/ai-skin-analysis"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-[#542B43] font-semibold"
            >
              <Sparkles className="h-4 w-4" /> AI Face Scanner & Analysis
            </Link>
            <Link
              to="/skinsafe"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-emerald-800"
            >
              <ShieldCheck className="h-4 w-4" /> SkinSafe Allergy Checker
            </Link>
            <Link
              to="/pos"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-amber-800"
            >
              <Store className="h-4 w-4" /> Smart POS Register
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default CustomerNavbar
