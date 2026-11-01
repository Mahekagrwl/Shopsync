import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, Lock, CreditCard, Check, ArrowRight, Truck } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import confetti from 'canvas-confetti'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, subtotal, discountAmount, shippingFee, estimatedTax, grandTotal, createOrder } = useCart()
  const { customer, isCustomerAuthenticated } = useAuth()

  // Form states
  const [email, setEmail] = useState(customer ? customer.email : '')
  const [fullName, setFullName] = useState(customer ? customer.name : '')
  const [street, setStreet] = useState(customer?.savedAddresses?.[0]?.street || '')
  const [city, setCity] = useState(customer?.savedAddresses?.[0]?.city || '')
  const [state, setState] = useState(customer?.savedAddresses?.[0]?.state || 'CA')
  const [zip, setZip] = useState(customer?.savedAddresses?.[0]?.zip || '')
  const [country, setCountry] = useState('United States')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242')
  const [cardExp, setCardExp] = useState('12/28')
  const [cardCvc, setCardCvc] = useState('888')
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center space-y-4 px-4">
        <h2 className="font-serif text-2xl font-bold text-[#282426]">Your bag is currently empty</h2>
        <p className="text-xs text-[#827A7F]">Add items to your bag before checking out.</p>
        <Link to="/shop" className="inline-block bg-[#542B43] text-white px-6 py-2.5 rounded-full text-xs font-semibold">
          Return to Shop
        </Link>
      </div>
    )
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!email || !fullName || !street || !city || !zip) {
      setErrorMsg('Please complete all required shipping fields.')
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      const order = createOrder({
        email,
        fullName,
        shippingAddress: `${street}, ${city}, ${state} ${zip}, ${country}`,
        paymentMethod: paymentMethod === 'card' ? 'Visa (ending in 4242)' : 'Apple Pay'
      })

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      setIsProcessing(false)
      navigate(`/order-confirmation?orderNumber=${order.orderNumber}`)
    }, 1200)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E9DED5]">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
            Express Checkout
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#282426]">
            Secure Order Finalization
          </h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold">
          <Lock className="w-4 h-4 text-emerald-700" />
          <span>SSL 256-Bit Encrypted</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form: Shipping & Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Contact Info */}
          <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-serif font-bold text-base text-[#282426]">
              1. Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#524B4F] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 focus:outline-none focus:ring-2 focus:ring-[#542B43]"
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#524B4F] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 focus:outline-none focus:ring-2 focus:ring-[#542B43]"
                  placeholder="Camille Laurent"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-serif font-bold text-base text-[#282426]">
              2. Shipping Destination
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#524B4F] mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 focus:outline-none focus:ring-2 focus:ring-[#542B43]"
                  placeholder="742 Evergreen Terrace, Apt 4B"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#524B4F] mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 focus:outline-none focus:ring-2 focus:ring-[#542B43]"
                    placeholder="San Francisco"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#524B4F] mb-1.5">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 focus:outline-none focus:ring-2 focus:ring-[#542B43]"
                    placeholder="CA"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#524B4F] mb-1.5">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 focus:outline-none focus:ring-2 focus:ring-[#542B43]"
                    placeholder="94107"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-serif font-bold text-base text-[#282426]">
              3. Payment Information
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#542B43] bg-[#542B43] text-white shadow-xs'
                    : 'border-[#E9DED5] text-[#282426] hover:bg-[#F8F3EE]'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Credit / Debit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('applepay')}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'applepay'
                    ? 'border-[#542B43] bg-[#542B43] text-white shadow-xs'
                    : 'border-[#E9DED5] text-[#282426] hover:bg-[#F8F3EE]'
                }`}
              >
                 Apple Pay / Instant
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#524B4F] mb-1.5">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full text-xs font-mono rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 focus:outline-none focus:ring-2 focus:ring-[#542B43]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#524B4F] mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full text-xs font-mono rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 focus:outline-none focus:ring-2 focus:ring-[#542B43]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#524B4F] mb-1.5">
                      CVC Code
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full text-xs font-mono rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 focus:outline-none focus:ring-2 focus:ring-[#542B43]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5 space-y-6 sticky top-28">
          <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-serif font-bold text-base text-[#282426]">
              Order Items ({cartItems.length})
            </h3>

            {/* Micro items list */}
            <div className="max-h-60 overflow-y-auto divide-y divide-[#E9DED5] pr-1 space-y-3">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex items-center gap-3 pt-3 first:pt-0">
                  <img src={item.image} alt="" className="h-12 w-12 rounded-xl object-cover bg-[#F8F3EE]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#282426] truncate">{item.name}</p>
                    <p className="text-[10px] text-stone-500">
                      Qty: {item.quantity} {item.shade ? `• ${item.shade.name}` : ''}
                    </p>
                  </div>
                  <span className="text-xs font-bold font-mono text-[#282426]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-[#E9DED5] text-xs">
              <div className="flex justify-between text-[#524B4F]">
                <span>Subtotal</span>
                <span className="font-mono text-[#282426] font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>VIP Promo Discount</span>
                  <span className="font-mono font-semibold">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#524B4F]">
                <span>Shipping</span>
                <span className="font-mono text-[#282426] font-semibold">
                  {shippingFee === 0 ? <span className="text-emerald-700">FREE</span> : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-[#524B4F]">
                <span>Taxes</span>
                <span className="font-mono text-[#282426] font-semibold">${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#282426] pt-3 border-t border-[#E9DED5]">
                <span>Total Due</span>
                <span className="font-mono text-xl text-[#542B43]">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 font-semibold p-2 bg-red-50 rounded-lg">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#542B43] hover:bg-[#3B1E2F] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? 'Authorizing Payment...' : `Complete Order ($${grandTotal.toFixed(2)})`}
              {!isProcessing && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CheckoutPage
