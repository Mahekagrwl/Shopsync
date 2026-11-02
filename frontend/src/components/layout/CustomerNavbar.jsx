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
  LayoutDashboard,
  MessageSquare,
  Flame,
  Star
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import { BEAUTY_PRODUCTS } from '../../data/mockBeautyData'
import { formatINR } from '../../utils/currency'
import RoleSelectionModal from '../common/RoleSelectionModal'

export function CustomerNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { totalItemCount } = useCart()
  const { wishlistCount } = useWishlist()
  const { user, isAuthenticated, role, isCustomer, isSeller, customer, logout } = useAuth()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoriesDropdown, setCategoriesDropdown] = useState(false)
  const [aiDropdown, setAiDropdown] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const [roleModalOpen, setRoleModalOpen] = useState(false)

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
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#F4C6D5]/60 shadow-xs">
        {/* 1. Announcement Bar */}
        <div className="bg-[#352137] text-[#FFF9F5] text-[11px] font-medium py-1.5 px-4 tracking-wider">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[#F4C6D5]">
              <Sparkles className="w-3.5 h-3.5" /> India’s Premium Beauty & Retail Platform
            </span>
            <div className="flex-1 text-center font-medium">
              Complimentary Express Delivery across India on Orders Over <span className="font-bold text-[#F4C6D5]">₹499</span> • Use Code <span className="font-bold text-[#F4C6D5] underline">SHOPSYNC15</span>
            </div>
            <div className="hidden md:flex items-center gap-3 text-[#F4C6D5] text-[10px]">
              <button
                onClick={() => setRoleModalOpen(true)}
                className="hover:text-white flex items-center gap-1 transition-colors font-bold uppercase tracking-wider cursor-pointer"
              >
                <Store className="w-3 h-3 text-amber-300" /> Switch Role / POS
              </button>
              <span>•</span>
              <Link to="/admin/dashboard" className="hover:text-white flex items-center gap-1 transition-colors">
                <LayoutDashboard className="w-3 h-3" /> Owner Portal
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
                className="p-2 rounded-lg text-[#282426] hover:bg-[#FFF9F5]"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-[#352137]" />}
              </button>
            </div>

            {/* Official SHOPSYNC Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group" title="SHOPSYNC Homepage">
                <img
                  src="/logo.jpg"
                  alt="SHOPSYNC Logo"
                  className="h-11 w-11 rounded-2xl object-cover shadow-sm border border-[#F4C6D5] transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex flex-col">
                  <span className="font-serif text-2xl font-bold tracking-tight text-[#352137] group-hover:text-[#542B43] transition-colors leading-none">
                    SHOP<span className="text-[#D985A5]">SYNC</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.22em] text-[#A56D8A] font-semibold mt-1">
                    Smart Beauty. Smarter Business.
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold uppercase tracking-wider text-[#282426]">
              <Link to="/" className="hover:text-[#352137] transition-colors py-2">
                Home
              </Link>
              <Link to="/shop" className="hover:text-[#352137] transition-colors py-2">
                Shop
              </Link>

              {/* Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCategoriesDropdown(true)}
                onMouseLeave={() => setCategoriesDropdown(false)}
              >
                <button
                  className="flex items-center gap-1 hover:text-[#352137] transition-colors py-2 uppercase font-semibold text-xs cursor-pointer"
                >
                  <span>Categories</span>
                  <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
                </button>
                {categoriesDropdown && (
                  <div className="absolute top-full left-0 w-56 bg-white border border-[#F4C6D5] rounded-2xl shadow-xl py-2 z-50">
                    <Link
                      to="/category/skincare"
                      className="block px-4 py-2 hover:bg-[#FFF9F5] hover:text-[#352137] text-xs normal-case tracking-normal font-medium"
                    >
                      ✨ Skincare Formulations (Minimalist, L’Oréal)
                    </Link>
                    <Link
                      to="/category/makeup"
                      className="block px-4 py-2 hover:bg-[#FFF9F5] hover:text-[#352137] text-xs normal-case tracking-normal font-medium"
                    >
                      💄 Makeup Essentials (Lakmé, Maybelline, SUGAR)
                    </Link>
                    <Link
                      to="/category/haircare"
                      className="block px-4 py-2 hover:bg-[#FFF9F5] hover:text-[#352137] text-xs normal-case tracking-normal font-medium"
                    >
                      🌿 Botanical Haircare (Mamaearth Onion Oil)
                    </Link>
                    <Link
                      to="/shop"
                      className="block px-4 py-2 hover:bg-[#FFF9F5] hover:text-[#352137] text-xs normal-case tracking-normal font-medium border-t border-[#F4C6D5]/40"
                    >
                      ✦ Beauty Essentials & Tools
                    </Link>
                  </div>
                )}
              </div>

              {/* About Us */}
              <a href="/#about" className="hover:text-[#352137] transition-colors py-2">
                About Us
              </a>

              {/* Contact */}
              <a href="#footer-contact" className="hover:text-[#352137] transition-colors py-2">
                Contact
              </a>

              {/* AI Tech Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setAiDropdown(true)}
                onMouseLeave={() => setAiDropdown(false)}
              >
                <button className="flex items-center gap-1 text-[#352137] bg-[#F4C6D5]/40 px-3 py-1.5 rounded-full hover:bg-[#F4C6D5]/70 transition-all cursor-pointer">
                  <Cpu className="h-3.5 w-3.5 text-[#352137]" />
                  <span className="font-bold">AI Studio</span>
                  <ChevronDown className="h-3 w-3 text-[#352137]" />
                </button>
                {aiDropdown && (
                  <div className="absolute top-full right-0 w-64 bg-white border border-[#F4C6D5] rounded-2xl shadow-xl p-3 z-50">
                    <Link
                      to="/ai-skin-analysis"
                      className="block p-2 rounded-xl hover:bg-[#FFF9F5] transition-colors"
                    >
                      <p className="font-semibold text-xs text-[#352137] flex items-center gap-1.5 normal-case tracking-normal">
                        <Sparkles className="w-3.5 h-3.5 text-[#D985A5]" /> AI Face Scanner & Analysis
                      </p>
                      <p className="text-[11px] text-stone-500 normal-case tracking-normal">
                        Live camera face alignment & personalized routine
                      </p>
                    </Link>
                    <Link
                      to="/ai-recommendations"
                      className="block p-2 rounded-xl hover:bg-[#FFF9F5] transition-colors"
                    >
                      <p className="font-semibold text-xs text-[#352137] flex items-center gap-1.5 normal-case tracking-normal">
                        <Cpu className="w-3.5 h-3.5 text-[#352137]" /> Smart Shade Matching
                      </p>
                      <p className="text-[11px] text-stone-500 normal-case tracking-normal">
                        Under-tone matching for Indian skin tones
                      </p>
                    </Link>
                    <Link
                      to="/skinsafe"
                      className="block p-2 rounded-xl hover:bg-[#FFF9F5] transition-colors"
                    >
                      <p className="font-semibold text-xs text-emerald-800 flex items-center gap-1.5 normal-case tracking-normal">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> SkinSafe Allergen Checker
                      </p>
                      <p className="text-[11px] text-stone-500 normal-case tracking-normal">
                        Screen nut oils, sulfates & irritants
                      </p>
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/feedback" className="hover:text-[#352137] transition-colors py-2 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-[#D985A5]" /> Feedback
              </Link>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Glowing BUY NOW / Experience Selector */}
              <button
                onClick={() => setRoleModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#D985A5] via-[#C58A78] to-[#352137] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>BUY NOW</span>
              </button>

              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#352137] hover:text-[#542B43] hover:bg-[#FFF9F5] rounded-full transition-colors cursor-pointer"
                aria-label="Search Catalog"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="relative p-2 text-[#352137] hover:text-[#542B43] hover:bg-[#FFF9F5] rounded-full transition-colors cursor-pointer"
                aria-label="View Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#352137] text-[9px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Link */}
              <Link
                to="/cart"
                className="relative p-2 text-[#352137] hover:text-[#542B43] hover:bg-[#FFF9F5] rounded-full transition-colors cursor-pointer"
                aria-label="View Shopping Bag"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItemCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D985A5] text-[9px] font-bold text-[#352137]">
                    {totalItemCount}
                  </span>
                )}
              </Link>

              {/* User Profile / Auth Menu */}
              <div className="relative">
                {isAuthenticated && user ? (
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#FFF9F5] transition-colors cursor-pointer"
                    aria-label="User Account Menu"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-[#D985A5]"
                    />
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#352137] hover:bg-[#542B43] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xs hover:shadow-md active:scale-95 cursor-pointer"
                    >
                      Login / Sign Up
                    </Link>
                    <Link
                      to="/login"
                      className="sm:hidden p-2 text-[#352137] hover:bg-[#FFF9F5] rounded-full transition-colors"
                      aria-label="Customer Login"
                    >
                      <User className="h-5 w-5" />
                    </Link>
                  </div>
                )}

                {userDropdown && isAuthenticated && user && (
                  <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-white border border-[#F4C6D5] shadow-xl py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-[#F4C6D5]/60">
                      <p className="text-xs font-semibold text-[#352137] truncate">{user.name}</p>
                      <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        isSeller
                          ? 'bg-[#352137] text-white'
                          : 'bg-[#F4C6D5]/50 text-[#352137]'
                      }`}>
                        {isSeller ? (user.role === 'admin' ? 'Store Director (Admin)' : 'Seller Partner') : (user.loyaltyTier || 'Customer')}
                      </span>
                    </div>

                    {isCustomer ? (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdown(false)}
                          className="block px-4 py-2 text-xs text-[#282426] hover:bg-[#FFF9F5]"
                        >
                          My Profile & Skin Preferences
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setUserDropdown(false)}
                          className="block px-4 py-2 text-xs text-[#282426] hover:bg-[#FFF9F5]"
                        >
                          My Orders & Tracking
                        </Link>
                        <Link
                          to="/cart"
                          onClick={() => setUserDropdown(false)}
                          className="block px-4 py-2 text-xs text-[#282426] hover:bg-[#FFF9F5]"
                        >
                          Shopping Bag ({totalItemCount})
                        </Link>
                        <Link
                          to="/feedback"
                          onClick={() => setUserDropdown(false)}
                          className="block px-4 py-2 text-xs text-[#282426] hover:bg-[#FFF9F5]"
                        >
                          Report Reaction / Feedback
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserDropdown(false)}
                          className="block px-4 py-2 text-xs font-bold text-[#352137] hover:bg-[#FFF9F5]"
                        >
                          📊 Seller Dashboard
                        </Link>
                        <Link
                          to="/admin/pos-billing"
                          onClick={() => setUserDropdown(false)}
                          className="block px-4 py-2 text-xs text-[#282426] hover:bg-[#FFF9F5]"
                        >
                          🏪 POS Billing Register
                        </Link>
                        <Link
                          to="/admin/products"
                          onClick={() => setUserDropdown(false)}
                          className="block px-4 py-2 text-xs text-[#282426] hover:bg-[#FFF9F5]"
                        >
                          📦 Product Catalog
                        </Link>
                        <Link
                          to="/admin/inventory"
                          onClick={() => setUserDropdown(false)}
                          className="block px-4 py-2 text-xs text-[#282426] hover:bg-[#FFF9F5]"
                        >
                          📦 Stock & Batch Expiry
                        </Link>
                      </>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdown(false)
                        logout()
                        navigate('/')
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 border-t border-[#F4C6D5]/40 font-semibold cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Dropdown / Input Drawer */}
          {searchOpen && (
            <div className="py-4 border-t border-[#F4C6D5]/60">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search Indian beauty brands (Lakmé, Maybelline, Minimalist, Plum)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-[#F4C6D5] bg-[#FFF9F5] px-4 py-3 pl-11 text-xs text-[#282426] focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                />
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-stone-400" />
              </form>

              {searchResults.length > 0 && (
                <div className="mt-3 bg-white rounded-2xl border border-[#F4C6D5] p-2 space-y-1 shadow-lg">
                  {searchResults.map((prod) => (
                    <Link
                      key={prod.id}
                      to={`/product/${prod.id}`}
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery('')
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FFF9F5] transition-colors"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#282426] truncate">{prod.name}</p>
                        <p className="text-[10px] text-stone-500">{prod.brand} • {formatINR(prod.price)}</p>
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
          <div className="lg:hidden border-t border-[#F4C6D5] bg-[#FFF9F5] px-4 pt-3 pb-6 space-y-2 text-sm font-semibold">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#352137] hover:text-[#D985A5]"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#352137] hover:text-[#D985A5]"
            >
              Shop All Indian Beauty Products
            </Link>
            <Link
              to="/category/makeup"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#352137] hover:text-[#D985A5]"
            >
              Makeup Essentials (Lakmé, Maybelline)
            </Link>
            <Link
              to="/category/skincare"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#352137] hover:text-[#D985A5]"
            >
              Skincare (Minimalist, L’Oréal, Plum)
            </Link>
            <Link
              to="/category/haircare"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#352137] hover:text-[#D985A5]"
            >
              Haircare & Oils (Mamaearth)
            </Link>
            <a
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#352137] hover:text-[#D985A5]"
            >
              About Us
            </a>
            <a
              href="#footer-contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#352137] hover:text-[#D985A5]"
            >
              Contact
            </a>
            <Link
              to="/ai-skin-analysis"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#D985A5] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> AI Face Scanner & Diagnostics
            </Link>
            <Link
              to="/feedback"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-stone-700"
            >
              Report Product Reaction & Feedback
            </Link>

            <div className="pt-4 border-t border-[#F4C6D5] flex flex-col gap-2">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-[#352137] text-white text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Login / Sign Up
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logout()
                  }}
                  className="w-full bg-rose-50 border border-rose-200 text-rose-700 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Sign Out ({user?.name})
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  setRoleModalOpen(true)
                }}
                className="w-full bg-gradient-to-r from-[#D985A5] to-[#352137] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                BUY NOW / Switch Role
              </button>
              <Link
                to="/admin/pos-billing"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#352137] text-white text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Store Owner POS Terminal
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
      />
    </>
  )
}

export default CustomerNavbar
