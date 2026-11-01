import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Plus, Trash2, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function SavedAddressesPage() {
  const { customer, addAddress, removeAddress, isCustomerAuthenticated } = useAuth()
  const [showAddForm, setShowAddForm] = useState(false)
  const [title, setTitle] = useState('Home')
  const [fullName, setFullName] = useState(customer?.name || '')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('CA')
  const [zip, setZip] = useState('')
  const [country, setCountry] = useState('United States')

  if (!isCustomerAuthenticated || !customer) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4 px-4">
        <h2 className="font-serif text-2xl font-bold text-[#282426]">Member Login Required</h2>
        <Link to="/login" className="inline-block bg-[#542B43] text-white px-6 py-2.5 rounded-full text-xs font-semibold">
          Sign In
        </Link>
      </div>
    )
  }

  const handleAddAddress = (e) => {
    e.preventDefault()
    if (!street || !city || !zip) return

    addAddress({
      title,
      fullName: fullName || customer.name,
      street,
      city,
      state,
      zip,
      country,
      isDefault: false
    })

    setShowAddForm(false)
    setStreet('')
    setCity('')
    setZip('')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top back */}
      <Link to="/profile" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#542B43] hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" /> Return to Profile
      </Link>

      {/* Header */}
      <div className="bg-[#E9DED5] rounded-3xl p-8 sm:p-10 border border-[#D9A6AC]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
            Delivery Destinations
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#282426] mt-1">
            Saved Shipping Addresses
          </h1>
          <p className="text-xs sm:text-sm text-[#524B4F] mt-1">
            Manage your residences, corporate ateliers, and gift recipients.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Destination
        </button>
      </div>

      {/* Add Address Form */}
      {showAddForm && (
        <form onSubmit={handleAddAddress} className="bg-white rounded-3xl border border-[#D9A6AC] p-6 sm:p-8 space-y-4 shadow-md">
          <h3 className="font-serif font-bold text-base text-[#282426]">
            New Destination Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold uppercase text-[#524B4F] mb-1">
                Address Label (e.g. Home, Studio, Beach House)
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-[#524B4F] mb-1">
                Recipient Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold uppercase text-[#524B4F] mb-1">
                Street Address
              </label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-[#524B4F] mb-1">
                City
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-[#524B4F] mb-1">
                State / Zip Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-20 rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5 text-center"
                />
                <input
                  type="text"
                  required
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="flex-1 rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5"
                  placeholder="Zip"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-[#542B43] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#3B1E2F]"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-[#F8F3EE] text-[#282426] px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#E9DED5]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {customer.savedAddresses?.map((addr) => (
          <div
            key={addr.id}
            className={`rounded-3xl p-6 border space-y-3 relative ${
              addr.isDefault
                ? 'bg-white border-[#542B43] shadow-md ring-2 ring-[#542B43]/10'
                : 'bg-white border-[#E9DED5] shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-[#282426] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#542B43]" />
                {addr.title}
              </span>
              {addr.isDefault && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#542B43] text-white">
                  Default Destination
                </span>
              )}
            </div>

            <div className="text-xs text-[#524B4F] space-y-0.5 leading-relaxed">
              <p className="font-semibold text-[#282426]">{addr.fullName}</p>
              <p>{addr.street}</p>
              <p>{addr.city}, {addr.state} {addr.zip}</p>
              <p>{addr.country}</p>
            </div>

            {!addr.isDefault && (
              <div className="pt-2 border-t border-[#E9DED5] flex justify-end">
                <button
                  onClick={() => removeAddress(addr.id)}
                  className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SavedAddressesPage
