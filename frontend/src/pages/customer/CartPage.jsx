import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  AlertCircle,
  Truck
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { formatINR } from '../../utils/currency'

export function CartPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isCustomer } = useAuth()
  const {
    cartItems,
    totalItemCount,
    subtotal,
    discountAmount,
    appliedPromo,
    promoError,
    shippingFee,
    estimatedTax,
    grandTotal,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode
  } = useCart()

  const [promoInput, setPromoInput] = useState('')

  const handleApplyPromo = (e) => {
    e.preventDefault()
    if (promoInput.trim()) {
      applyPromoCode(promoInput.trim())
      setPromoInput('')
    }
  }

  // Free shipping threshold calculation (₹499)
  const freeShippingThreshold = 499
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100)
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#E9DED5] rounded-3xl p-8 sm:p-10 border border-[#D9A6AC]/60">
        <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
          Your Curated Bag
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#282426] mt-1">
          Shopping Bag ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
        </h1>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free shipping progress bar */}
            <div className="bg-white rounded-2xl p-4 border border-[#E9DED5] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-[#282426]">
                  <Truck className="w-4 h-4 text-[#542B43]" />
                  {remainingForFreeShipping > 0
                    ? `Add ${formatINR(remainingForFreeShipping)} more for Free Express Delivery`
                    : '🎉 You have unlocked Free Express Delivery across India!'}
                </span>
                <span className="text-[#827A7F] font-mono text-[11px]">{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="w-full bg-[#F8F3EE] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#542B43] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Cart Items Cards */}
            <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 shadow-xs divide-y divide-[#E9DED5]">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-2xl object-cover bg-[#F8F3EE] border border-[#E9DED5]"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#542B43]">
                        {item.brand}
                      </span>
                      <h3 className="font-serif text-sm font-semibold text-[#282426]">
                        {item.name}
                      </h3>

                      {/* Shade badge if selected */}
                      {item.shade && (
                        <div className="flex items-center gap-2 pt-1 text-xs">
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-black/20"
                            style={{ backgroundColor: item.shade.hex }}
                          />
                          <span className="font-medium text-[#524B4F]">
                            Shade: {item.shade.name} ({item.shade.code})
                          </span>
                        </div>
                      )}
                      <p className="text-xs font-mono text-stone-400">SKU: {item.sku}</p>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="flex items-center border border-[#E9DED5] rounded-xl bg-[#F8F3EE]">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="px-3 py-1.5 text-xs font-bold text-stone-600 hover:text-black"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold font-mono text-[#282426]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="px-3 py-1.5 text-xs font-bold text-stone-600 hover:text-black"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-bold text-[#282426]">
                        {formatINR(item.price * item.quantity)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="block text-[10px] text-stone-400">
                          {formatINR(item.price)} each
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-stone-400 hover:text-red-600 transition-colors p-2"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Order Summary & Promo */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 shadow-xs space-y-6">
              <h3 className="font-serif font-bold text-lg text-[#282426]">
                Order Summary
              </h3>

              {/* Promo Code Input */}
              <div className="space-y-2">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Promo Code (SHOPSYNC15)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full text-xs rounded-xl border border-[#E9DED5] bg-[#F8F3EE] px-3.5 py-2.5 uppercase font-mono text-[#282426] focus:outline-none focus:ring-2 focus:ring-[#542B43]"
                    />
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-3" />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#542B43] text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#3B1E2F] transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {appliedPromo && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs">
                    <span className="font-medium">Applied: {appliedPromo.code} ({appliedPromo.discountPercent}% Off)</span>
                    <button
                      onClick={removePromoCode}
                      className="text-[11px] underline hover:text-red-700 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {promoError && (
                  <p className="text-xs text-red-600 font-medium">{promoError}</p>
                )}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-3 pt-4 border-t border-[#E9DED5] text-xs">
                <div className="flex justify-between text-[#524B4F]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#282426] font-semibold">{formatINR(subtotal)}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Promo Discount ({appliedPromo.discountPercent}%)</span>
                    <span className="font-mono font-semibold">-{formatINR(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#524B4F]">
                  <span>Estimated Shipping</span>
                  <span className="font-mono text-[#282426] font-semibold">
                    {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatINR(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-[#524B4F]">
                  <span>GST (5% Cosmetics)</span>
                  <span className="font-mono text-[#282426] font-semibold">{formatINR(estimatedTax)}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-[#282426] pt-3 border-t border-[#E9DED5]">
                  <span>Grand Total</span>
                  <span className="font-mono text-xl text-[#542B43]">{formatINR(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  if (!isAuthenticated || !isCustomer) {
                    navigate('/login?redirect=%2Fcheckout')
                  } else {
                    navigate('/checkout')
                  }
                }}
                className="w-full bg-[#352137] hover:bg-[#542B43] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#827A7F]">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>256-Bit Encrypted Omnichannel Checkout</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E9DED5] p-8 space-y-4">
          <div className="h-16 w-16 rounded-full bg-[#F8F3EE] text-[#542B43] mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#282426]">
            Your shopping bag is empty
          </h3>
          <p className="text-xs text-[#827A7F] max-w-sm mx-auto">
            Discover clinical serums, weightless foundations, and nourishing botanical body soufflés.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#542B43] text-white text-xs font-semibold px-6 py-3 rounded-full shadow-md"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

export default CartPage
