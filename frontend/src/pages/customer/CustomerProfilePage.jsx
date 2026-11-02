import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Sparkles, ShieldCheck, MapPin, Package, Heart, Edit3, Check, Award } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

export function CustomerProfilePage() {
  const { customer, updateProfile, isCustomerAuthenticated } = useAuth()
  const { orders } = useCart()
  const { wishlistCount } = useWishlist()

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(customer?.name || '')
  const [phone, setPhone] = useState(customer?.phone || '')
  const [skinType, setSkinType] = useState(customer?.skinProfile?.skinType || 'Combination / Sensitive')
  const [savedNotice, setSavedNotice] = useState(false)

  if (!isCustomerAuthenticated || !customer) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4 px-4">
        <h2 className="font-serif text-2xl font-bold text-[#282426]">Member Login Required</h2>
        <p className="text-xs text-[#827A7F]">Please sign in to access your personal profile and beauty formulation records.</p>
        <Link to="/login" className="inline-block bg-[#542B43] text-white px-6 py-2.5 rounded-full text-xs font-semibold">
          Sign In
        </Link>
      </div>
    )
  }

  const handleSave = (e) => {
    e.preventDefault()
    updateProfile({
      name,
      phone,
      skinProfile: {
        ...customer.skinProfile,
        skinType
      }
    })
    setIsEditing(false)
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 3000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-[#E9DED5] rounded-3xl p-8 sm:p-12 border border-[#D9A6AC]/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="h-20 w-20 rounded-full object-cover ring-4 ring-[#D9A6AC] shadow-md"
          />
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#542B43] bg-white px-2.5 py-0.5 rounded-full">
              {customer.loyaltyTier}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
              {customer.name}
            </h1>
            <p className="text-xs text-[#524B4F]">{customer.email} • {customer.phone}</p>
          </div>
        </div>

        {/* Loyalty Points Pill */}
        <div className="bg-white rounded-2xl p-4 border border-[#D9A6AC] shadow-xs text-center min-w-[180px]">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#542B43] font-semibold">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Loyalty Vault</span>
          </div>
          <p className="text-2xl font-bold font-mono text-[#282426] mt-1">{customer.loyaltyPoints}</p>
          <p className="text-[10px] text-stone-400">Equivalent to ₹500 reward credit</p>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>Profile records successfully updated.</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account Details & Editing */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E9DED5]">
              <h3 className="font-serif font-bold text-base text-[#282426]">
                Member Information
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-semibold text-[#542B43] hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditing ? 'Cancel' : 'Edit Details'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold uppercase text-[#524B4F] mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-[#524B4F] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-[#524B4F] mb-1">
                    Primary Skin Type
                  </label>
                  <input
                    type="text"
                    value={skinType}
                    onChange={(e) => setSkinType(e.target.value)}
                    className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#542B43] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#3B1E2F]"
                >
                  Save Profile Changes
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Email Address</span>
                  <p className="font-semibold text-[#282426] mt-0.5">{customer.email}</p>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Phone</span>
                  <p className="font-semibold text-[#282426] mt-0.5">{customer.phone}</p>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Member Identifier</span>
                  <p className="font-mono text-stone-500 mt-0.5">{customer.id}</p>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Tier Privileges</span>
                  <p className="font-semibold text-[#542B43] mt-0.5">Complimentary Lab Consultations</p>
                </div>
              </div>
            )}
          </div>

          {/* Skin Profile & Sensitivities Card */}
          <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-serif font-bold text-base text-[#282426] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              Dermatological Profile & Saved Sensitivities
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Skin Diagnostics</span>
                <p className="font-semibold text-[#282426] mt-0.5">{customer.skinProfile?.skinType}</p>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold mb-1">Target Concerns</span>
                <div className="flex flex-wrap gap-2">
                  {customer.skinProfile?.skinConcerns?.map((c, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-[#F8F3EE] text-[#542B43] font-medium border border-[#D9A6AC]/40">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold mb-1">Excluded Allergens (SkinSafe™)</span>
                <div className="flex flex-wrap gap-2">
                  {customer.skinProfile?.allergies?.map((a, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 font-medium border border-rose-200">
                      ✕ {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Navigation Links */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 shadow-xs space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#282426]">
              Quick Shortcuts
            </h4>

            <div className="space-y-2 text-xs">
              <Link
                to="/orders"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F3EE] hover:bg-[#E9DED5] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-[#542B43]" />
                  <span className="font-semibold text-[#282426]">Order History</span>
                </div>
                <span className="font-mono font-bold text-[#542B43]">{orders.length}</span>
              </Link>

              <Link
                to="/saved-addresses"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F3EE] hover:bg-[#E9DED5] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#542B43]" />
                  <span className="font-semibold text-[#282426]">Saved Addresses</span>
                </div>
                <span className="font-mono font-bold text-[#542B43]">{customer.savedAddresses?.length || 0}</span>
              </Link>

              <Link
                to="/wishlist"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F3EE] hover:bg-[#E9DED5] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-[#542B43]" />
                  <span className="font-semibold text-[#282426]">Saved Wishlist</span>
                </div>
                <span className="font-mono font-bold text-[#542B43]">{wishlistCount}</span>
              </Link>

              <Link
                to="/ai-skin-analysis"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F3EE] hover:bg-[#E9DED5] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#542B43]" />
                  <span className="font-semibold text-[#282426]">Retake AI Skin Diagnostic</span>
                </div>
                <span className="text-[10px] text-stone-400">Ready</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerProfilePage
