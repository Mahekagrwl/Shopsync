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
  Star,
  Bell,
  LogOut,
  HelpCircle,
  Package,
  Layers
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import { BEAUTY_PRODUCTS } from '../../data/mockBeautyData'
import { formatINR } from '../../utils/currency'

export function CustomerNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { totalItemCount } = useCart()
  const { wishlistCount } = useWishlist()
  const { user, isAuthenticated, isCustomer, isSeller, logout } = useAuth()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [shopDropdown, setShopDropdown] = useState(false)
  const [categoriesDropdown, setCategoriesDropdown] = useState(false)
  const [aiDropdown, setAiDropdown] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const [notifDropdown, setNotifDropdown] = useState(false)

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

  const handleLogout = () => {
    setUserDropdown(false)
    setMobileMenuOpen(false)
    logout()
    navigate('/', { replace: true })
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
              Complimentary Express Delivery across India on Orders Over <span className="font-bold text-[#F4C6D5]">₹499</span> • Code <span className="font-bold text-[#F4C6D5] underline">SHOPSYNC15</span>
            </div>
            <div className="hidden md:flex items-center gap-3 text-[#F4C6D5] text-[10px]">
              {isSeller ? (
                <Link to="/admin/dashboard" className="hover:text-white flex items-center gap-1 transition-colors font-bold uppercase tracking-wider">
                  <LayoutDashboard className="w-3.5 h-3.5 text-amber-300" /> Store Owner Console
                </Link>
              ) : isCustomer ? (
                <span className="flex items-center gap-1 text-[#F4C6D5]">
                  <Sparkles className="w-3 h-3 text-[#F4C6D5]" /> {user?.loyaltyTier || 'Beauty Member'}
                </span>
              ) : (
                <Link to="/seller/login" className="hover:text-white flex items-center gap-1 transition-colors font-medium">
                  <Store className="w-3 h-3 text-amber-300" /> Store Owner Portal
                </Link>
              )}
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

            {/* Official SHOPSYNC Brand Logo */}
            <div className="flex items-center">
              <Link to="/store" className="flex items-center gap-3 group" title="SHOPSYNC Homepage">
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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold uppercase tracking-wider text-[#282426]">
              {/* CASE A: PUBLIC VISITOR NAVIGATION (ONLY 4 MAIN OPTIONS) */}
              {!isAuthenticated && (
                <>
                  <Link to="/store" className="hover:text-[#352137] transition-colors py-2">
                    Home
                  </Link>

                  {/* Shop Dropdown with 6 Categories */}
                  <div
                    className="relative"
                    onMouseEnter={() => setShopDropdown(true)}
                    onMouseLeave={() => setShopDropdown(false)}
                  >
                    <button
                      onClick={() => navigate('/shop')}
                      className="flex items-center gap-1 hover:text-[#352137] transition-colors py-2 uppercase font-semibold text-xs cursor-pointer"
                    >
                      <span>Shop</span>
                      <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
                    </button>
                    {shopDropdown && (
                      <div className="absolute top-full left-0 w-60 bg-white border border-[#F4C6D5] rounded-2xl shadow-xl py-2.5 z-50 animate-in fade-in duration-200">
                        <Link
                          to="/category/makeup"
                          className="block px-4 py-2 hover:bg-[#FFF9F5] hover:text-[#352137] text-xs normal-case tracking-normal font-medium"
                        >
                          💄 Makeup
                        </Link>
                        <Link
                          to="/category/skincare"
                          className="block px-4 py-2 hover:bg-[#FFF9F5] hover:text-[#352137] text-xs normal-case tracking-normal font-medium"
                        >
                          ✨ Skincare
                        </Link>
                        <Link
                          to="/category/haircare"
                          className="block px-4 py-2 hover:bg-[#FFF9F5] hover:text-[#352137] text-xs normal-case tracking-normal font-medium"
                        >
                          🌿 Haircare
                        </Link>
                        <Link
                          to="/category/fragrance"
                          className="block px-4 py-2 hover:bg-[#FFF9F5] hover:text-[#352137] text-xs normal-case tracking-normal font-medium"
                        >
                          🌹 Fragrance
                        </Link>
                        <Link
                          to="/category/bodycare"
                          className="block px-4 py-2 hover:bg-[#FFF9F5] hover:text-[#352137] text-xs normal-case tracking-normal font-medium"
                        >
                          🧴 Bodycare
                        </Link>
                        <Link
                          to="/category/accessories"
                          className="block px-4 py-2 hover:bg-[#FFF9F5] hover:text-[#352137] text-xs normal-case tracking-normal font-medium border-t border-[#F4C6D5]/40"
                        >
                          ✂️ Beauty Accessories
                        </Link>
                        <Link
                          to="/shop"
                          className="block px-4 py-2 text-[11px] font-bold text-[#D985A5] hover:underline"
                        >
                          Explore All Formulations →
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* About Us */}
                  <a href="/store#about" className="hover:text-[#352137] transition-colors py-2">
                    About Us
                  </a>

                  {/* Help */}
                  <a href="/store#help" className="hover:text-[#352137] transition-colors py-2">
                    Help
                  </a>
                </>
              )}

              {/* CASE B: AUTHENTICATED CUSTOMER NAVIGATION */}
              {isAuthenticated && isCustomer && (
                <>
                  <Link to="/store" className="hover:text-[#352137] transition-colors py-2">
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
                      <div className="absolute top-full left-0 w-60 bg-white border border-[#F4C6D5] rounded-2xl shadow-xl py-2 z-50">
                        <Link
                          to="/category/makeup"
                          className="block px-4 py-2 hover:bg-[#FFF9F5] text-xs normal-case tracking-normal font-medium"
                        >
                          💄 Makeup Essentials
                        </Link>
                        <Link
                          to="/category/skincare"
                          className="block px-4 py-2 hover:bg-[#FFF9F5] text-xs normal-case tracking-normal font-medium"
                        >
                          ✨ Clinical Skincare
                        </Link>
                        <Link
                          to="/category/haircare"
                          className="block px-4 py-2 hover:bg-[#FFF9F5] text-xs normal-case tracking-normal font-medium"
                        >
                          🌿 Ayurvedic Haircare
                        </Link>
                        <Link
                          to="/category/fragrance"
                          className="block px-4 py-2 hover:bg-[#FFF9F5] text-xs normal-case tracking-normal font-medium"
                        >
                          🌹 Royal Fragrances
                        </Link>
                        <Link
                          to="/category/bodycare"
                          className="block px-4 py-2 hover:bg-[#FFF9F5] text-xs normal-case tracking-normal font-medium"
                        >
                          🧴 Bodycare Butters
                        </Link>
                        <Link
                          to="/category/accessories"
                          className="block px-4 py-2 hover:bg-[#FFF9F5] text-xs normal-case tracking-normal font-medium border-t border-[#F4C6D5]/40"
                        >
                          ✂️ Beauty Accessories
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Best Sellers */}
                  <a href="/store#bestsellers" className="hover:text-[#352137] transition-colors py-2 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-rose-500" /> Best Sellers
                  </a>

                  {/* New Arrivals */}
                  <a href="/store#new-arrivals" className="hover:text-[#352137] transition-colors py-2 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500" /> New Arrivals
                  </a>

                  {/* AI Studio (CUSTOMER EXCLUSIVE) */}
                  <div
                    className="relative"
                    onMouseEnter={() => setAiDropdown(true)}
                    onMouseLeave={() => setAiDropdown(false)}
                  >
                    <button className="flex items-center gap-1 text-[#352137] bg-gradient-to-r from-[#F4C6D5]/60 to-[#F4C6D5]/30 px-3.5 py-1.5 rounded-full hover:from-[#F4C6D5] hover:to-[#D985A5]/40 transition-all cursor-pointer border border-[#D985A5]/40 shadow-2xs">
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
                            <Sparkles className="w-3.5 h-3.5 text-[#D985A5]" /> Live AI Face Scanner
                          </p>
                          <p className="text-[11px] text-stone-500 normal-case tracking-normal">
                            Real-time camera scan & personalized routine
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
                            Undertone matching for Indian complexions
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
                </>
              )}

              {/* CASE C: STORE OWNER ON STOREFRONT */}
              {isAuthenticated && isSeller && (
                <>
                  <Link to="/store" className="hover:text-[#352137] transition-colors py-2">
                    Home
                  </Link>
                  <Link to="/shop" className="hover:text-[#352137] transition-colors py-2">
                    Shop
                  </Link>
                  <a href="/store#about" className="hover:text-[#352137] transition-colors py-2">
                    About Us
                  </a>
                  <a href="/store#help" className="hover:text-[#352137] transition-colors py-2">
                    Help
                  </a>
                </>
              )}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#352137] hover:text-[#542B43] hover:bg-[#FFF9F5] rounded-full transition-colors cursor-pointer"
                aria-label="Search Catalog"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* CUSTOMER ONLY: Wishlist Icon */}
              {isAuthenticated && isCustomer && (
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
              )}

              {/* CUSTOMER ONLY: Shopping Bag / Cart */}
              {isAuthenticated && isCustomer && (
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
              )}

              {/* CUSTOMER ONLY: Notifications Bell */}
              {isAuthenticated && isCustomer && (
                <div className="relative">
                  <button
                    onClick={() => setNotifDropdown(!notifDropdown)}
                    className="relative p-2 text-[#352137] hover:text-[#542B43] hover:bg-[#FFF9F5] rounded-full transition-colors cursor-pointer"
                    aria-label="Customer Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                  </button>

                  {notifDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white border border-[#F4C6D5] shadow-xl py-3 px-3 z-50 animate-in fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-[#F4C6D5]/60 mb-2">
                        <span className="text-xs font-bold text-[#352137]">Notifications</span>
                        <span className="text-[10px] text-[#D985A5] font-semibold">2 New</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2 rounded-xl bg-[#FFF9F5] border border-[#F4C6D5]/40 space-y-0.5">
                          <p className="font-semibold text-[#352137]">Festive 15% Discount Active</p>
                          <p className="text-[11px] text-stone-500">Apply promo code SHOPSYNC15 at checkout.</p>
                        </div>
                        <div className="p-2 rounded-xl bg-[#FFF9F5] border border-[#F4C6D5]/40 space-y-0.5">
                          <p className="font-semibold text-[#352137]">1,250 Loyalty Points Earned</p>
                          <p className="text-[11px] text-stone-500">Gold tier membership unlocked.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STORE OWNER: Direct Dashboard Button */}
              {isAuthenticated && isSeller && (
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#352137] hover:bg-[#542B43] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#F4C6D5]" />
                  <span>Owner Dashboard</span>
                </Link>
              )}

              {/* USER PROFILE / AUTH MENU */}
              <div className="relative">
                {isAuthenticated && user ? (
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-[#FFF9F5] transition-colors cursor-pointer"
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
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#352137] hover:bg-[#542B43] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xs hover:shadow-md active:scale-95 cursor-pointer"
                    >
                      Login / Sign Up
                    </Link>
                  </div>
                )}

                {/* User Dropdown */}
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
                        {isSeller ? 'Store Owner' : (user.loyaltyTier || 'Customer')}
                      </span>
                    </div>

                    {isCustomer ? (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdown(false)}
                          className="block px-4 py-2 text-xs text-[#282426] hover:bg-[#FFF9F5]"
                        >
                          My Account & Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setUserDropdown(false)}
                          className="block px-4 py-2 text-xs text-[#282426] hover:bg-[#FFF9F5]"
                        >
                          My Orders & Tracking
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={() => setUserDropdown(false)}
                          className="block px-4 py-2 text-xs text-[#282426] hover:bg-[#FFF9F5]"
                        >
                          Wishlist ({wishlistCount})
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
                          📊 Store Owner Dashboard
                        </Link>
                        <Link
                          to="/admin/pos-billing"
                          onClick={() => setUserDropdown(false)}
                          className="block px-4 py-2 text-xs text-[#282426] hover:bg-[#FFF9F5]"
                        >
                          🏪 POS Register
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 border-t border-[#F4C6D5]/40 font-semibold cursor-pointer flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Dropdown / Input Drawer */}
          {searchOpen && (
            <div className="py-4 border-t border-[#F4C6D5]/60 animate-in fade-in duration-200">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search 100+ authentic Indian beauty formulations (e.g. Lakmé, Minimalist, Niacinamide)..."
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
            {/* PUBLIC VISITOR MOBILE MENU (ONLY 4 MAIN OPTIONS) */}
            {!isAuthenticated && (
              <>
                <Link
                  to="/store"
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
                  Shop (All Formulations)
                </Link>
                <a
                  href="/store#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#352137] hover:text-[#D985A5]"
                >
                  About Us
                </a>
                <a
                  href="/store#help"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#352137] hover:text-[#D985A5]"
                >
                  Help
                </a>
                <div className="pt-3 border-t border-[#F4C6D5]">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full bg-[#352137] text-white text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider block"
                  >
                    Login / Sign Up
                  </Link>
                </div>
              </>
            )}

            {/* CUSTOMER MOBILE MENU */}
            {isAuthenticated && isCustomer && (
              <>
                <Link
                  to="/store"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#352137]"
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#352137]"
                >
                  Shop
                </Link>
                <Link
                  to="/ai-skin-analysis"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#D985A5] flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> AI Studio Scanner
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#352137]"
                >
                  Wishlist ({wishlistCount})
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#352137]"
                >
                  Cart ({totalItemCount})
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#352137]"
                >
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#352137]"
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full mt-3 bg-rose-50 border border-rose-200 text-rose-700 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-center"
                >
                  Logout ({user?.name})
                </button>
              </>
            )}

            {/* STORE OWNER MOBILE MENU */}
            {isAuthenticated && isSeller && (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 font-bold text-[#352137]"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/pos-billing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#352137]"
                >
                  POS Billing Register
                </Link>
                <Link
                  to="/admin/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#352137]"
                >
                  Product Catalog
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full mt-3 bg-rose-50 border border-rose-200 text-rose-700 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-center"
                >
                  Logout (Owner)
                </button>
              </>
            )}
          </div>
        )}
      </header>
    </>
  )
}

export default CustomerNavbar
