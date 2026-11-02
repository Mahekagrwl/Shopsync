import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Sparkles,
  ShieldCheck,
  MapPin,
  Package,
  Heart,
  Edit3,
  Check,
  Award,
  FileText,
  Settings,
  LogOut,
  Bell,
  Lock
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import InvoiceModal from '../../components/common/InvoiceModal'

export function CustomerProfilePage() {
  const navigate = useNavigate()
  const { customer, user, updateProfile, isCustomerAuthenticated, isAuthenticated, logout } = useAuth()
  const { orders } = useCart()
  const { wishlistCount } = useWishlist()

  const activeUser = customer || user

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(activeUser?.name || 'Ananya Sharma')
  const [phone, setPhone] = useState(activeUser?.phone || '+91 98251 45890')
  const [skinType, setSkinType] = useState(activeUser?.skinProfile?.skinType || 'Combination / Sensitive')
  const [savedNotice, setSavedNotice] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4 px-4">
        <h2 className="font-serif text-2xl font-bold text-[#352137]">Customer Sign In Required</h2>
        <p className="text-xs text-stone-600">Please sign in to access your personal profile, formulation records, and order invoices.</p>
        <Link
          to="/login"
          className="inline-block bg-[#352137] hover:bg-[#542B43] text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-md transition-all"
        >
          Sign In
        </Link>
      </div>
    )
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (updateProfile) {
      updateProfile({
        name,
        phone,
        skinProfile: {
          ...activeUser?.skinProfile,
          skinType
        }
      })
    }
    setIsEditing(false)
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 3000)
  }

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-[#FFF9F5] rounded-3xl p-8 sm:p-12 border border-[#F4C6D5] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={activeUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
            alt={activeUser?.name || 'Customer'}
            className="h-20 w-20 rounded-full object-cover ring-4 ring-[#D985A5] shadow-md border-2 border-white"
          />
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#352137] bg-white border border-[#F4C6D5] px-2.5 py-0.5 rounded-full">
              {activeUser?.loyaltyTier || 'Gold Member'}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#352137]">
              {activeUser?.name || 'Ananya Sharma'}
            </h1>
            <p className="text-xs text-stone-600">{activeUser?.email || 'ananya.sharma@shopsync.in'} • {activeUser?.phone || '+91 98251 45890'}</p>
          </div>
        </div>

        {/* Loyalty Points Pill */}
        <div className="bg-white rounded-2xl p-4 border border-[#F4C6D5] shadow-xs text-center min-w-[180px]">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#352137] font-semibold">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Loyalty Vault</span>
          </div>
          <p className="text-2xl font-bold font-mono text-[#352137] mt-1">{activeUser?.loyaltyPoints || 1250}</p>
          <p className="text-[10px] text-stone-400">₹500 Redeemable Credit Available</p>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>Profile records successfully updated.</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account Details & Editing */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-[#F4C6D5] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#F4C6D5]/60">
              <h3 className="font-serif font-bold text-base text-[#352137]">
                Personal Member Information
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-semibold text-[#D985A5] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold uppercase text-stone-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-2.5 text-xs text-[#352137] focus:outline-none focus:ring-2 focus:ring-[#352137]"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-stone-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-2.5 text-xs text-[#352137] focus:outline-none focus:ring-2 focus:ring-[#352137]"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-stone-600 mb-1">
                    Primary Skin Type
                  </label>
                  <input
                    type="text"
                    value={skinType}
                    onChange={(e) => setSkinType(e.target.value)}
                    className="w-full rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-2.5 text-xs text-[#352137] focus:outline-none focus:ring-2 focus:ring-[#352137]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#352137] hover:bg-[#542B43] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                >
                  Save Profile Changes
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Email Address</span>
                  <p className="font-semibold text-[#352137] mt-0.5">{activeUser?.email || 'ananya.sharma@shopsync.in'}</p>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Phone</span>
                  <p className="font-semibold text-[#352137] mt-0.5">{activeUser?.phone || '+91 98251 45890'}</p>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Customer ID</span>
                  <p className="font-mono text-stone-500 mt-0.5">{activeUser?.id || 'CUST-8901'}</p>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Pan-India Atelier Tier</span>
                  <p className="font-semibold text-[#D985A5] mt-0.5">Complimentary express shipping on all orders</p>
                </div>
              </div>
            )}
          </div>

          {/* Skin Profile & Sensitivities Card */}
          <div className="bg-white rounded-3xl border border-[#F4C6D5] p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-serif font-bold text-base text-[#352137] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Dermatological Profile & Saved Sensitivities
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Skin Diagnostics</span>
                <p className="font-semibold text-[#352137] mt-0.5">{activeUser?.skinProfile?.skinType || 'Combination / Sensitive'}</p>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold mb-1">Target Concerns</span>
                <div className="flex flex-wrap gap-2">
                  {(activeUser?.skinProfile?.skinConcerns || ['Redness / Rosacea', 'Dehydration']).map((c, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-[#FFF9F5] text-[#352137] font-medium border border-[#F4C6D5]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold mb-1">Excluded Allergens (SkinSafe™)</span>
                <div className="flex flex-wrap gap-2">
                  {(activeUser?.skinProfile?.allergies || ['Synthetic Fragrance', 'Tree Nut Oils']).map((a, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 font-medium border border-rose-200">
                      ✕ {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Navigation Links & Invoices */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#F4C6D5] p-6 shadow-xs space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#352137]">
              Customer Shortcuts
            </h4>

            <div className="space-y-2 text-xs">
              <Link
                to="/orders"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF9F5] hover:bg-[#F4C6D5]/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-[#352137]" />
                  <span className="font-semibold text-[#352137]">My Orders</span>
                </div>
                <span className="font-mono font-bold text-[#D985A5]">{orders.length}</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  if (orders.length > 0) {
                    setSelectedInvoice(orders[0])
                  } else {
                    alert('No orders placed yet to view invoices.')
                  }
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FFF9F5] hover:bg-[#F4C6D5]/40 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#352137]" />
                  <span className="font-semibold text-[#352137]">My Invoices (Tax Receipts)</span>
                </div>
                <span className="font-mono font-bold text-[#D985A5]">{orders.length}</span>
              </button>

              <Link
                to="/saved-addresses"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF9F5] hover:bg-[#F4C6D5]/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#352137]" />
                  <span className="font-semibold text-[#352137]">Saved Delivery Addresses</span>
                </div>
                <span className="font-mono font-bold text-[#D985A5]">2</span>
              </Link>

              <Link
                to="/wishlist"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF9F5] hover:bg-[#F4C6D5]/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-[#352137]" />
                  <span className="font-semibold text-[#352137]">Saved Wishlist</span>
                </div>
                <span className="font-mono font-bold text-[#D985A5]">{wishlistCount}</span>
              </Link>

              <Link
                to="/ai-skin-analysis"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF9F5] hover:bg-[#F4C6D5]/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#D985A5]" />
                  <span className="font-semibold text-[#352137]">AI Skin Diagnostics Studio</span>
                </div>
                <span className="text-[10px] text-[#D985A5] font-bold">Active</span>
              </Link>
            </div>

            {/* Logout Button */}
            <div className="pt-3 border-t border-[#F4C6D5]/60">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-rose-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        order={selectedInvoice}
      />
    </div>
  )
}

export default CustomerProfilePage
