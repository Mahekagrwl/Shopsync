import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, Lock, CreditCard, Check, ArrowRight, Truck, QrCode, Banknote } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { formatINR } from '../../utils/currency'
import confetti from 'canvas-confetti'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, subtotal, discountAmount, shippingFee, estimatedTax, grandTotal, createOrder } = useCart()
  const { customer, isCustomerAuthenticated } = useAuth()

  // Form states
  const [email, setEmail] = useState(customer ? customer.email : 'ananya.sharma@shopsync.in')
  const [fullName, setFullName] = useState(customer ? customer.name : 'Ananya Sharma')
  const [phone, setPhone] = useState(customer?.phone || '+91 98251 45890')
  const [street, setStreet] = useState(customer?.savedAddresses?.[0]?.street || 'B-402, Sun Villa, Near Akota Garden, Old Padra Road')
  const [city, setCity] = useState(customer?.savedAddresses?.[0]?.city || 'Vadodara')
  const [state, setState] = useState(customer?.savedAddresses?.[0]?.state || 'Gujarat')
  const [pinCode, setPinCode] = useState(customer?.savedAddresses?.[0]?.pinCode || '390007')
  const [country, setCountry] = useState('India')
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [upiId, setUpiId] = useState('ananya@okhdfcbank')
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
        <Link to="/shop" className="inline-block bg-[#352137] text-white px-6 py-2.5 rounded-full text-xs font-semibold">
          Return to Shop
        </Link>
      </div>
    )
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    setIsProcessing(true)
    setErrorMsg('')

    setTimeout(async () => {
      try {
        const order = await createOrder({
          fullName,
          email,
          phone,
          shippingAddress: `${street}, ${city}, ${state} - ${pinCode}, ${country}`,
          paymentMethod: paymentMethod === 'upi' ? `UPI (${upiId})` : paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Credit/Debit Card (Visa/RuPay)'
        })

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })

        navigate(`/order-confirmation?orderNumber=${order.orderNumber}`)
      } catch (err) {
        setErrorMsg('Failed to place order. Please try again.')
        setIsProcessing(false)
      }
    }, 1200)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#FFF9F5] min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FFF9F5] via-[#F4C6D5]/30 to-[#FFF9F5] rounded-3xl p-8 border border-[#F4C6D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#352137]">
            Express Pan-India Checkout
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#352137] mt-1">
            Secure Delivery & Payment
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-white px-4 py-2 rounded-full border border-[#F4C6D5] shadow-xs">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>SSL 256-Bit Encrypted Payment</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form: Details & Delivery */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Contact Info */}
          <div className="bg-white rounded-3xl border border-[#F4C6D5] p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-serif font-bold text-base text-[#352137]">
              1. Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-600 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-3 focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-600 mb-1.5">
                  Mobile Number (+91) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-3 focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-white rounded-3xl border border-[#F4C6D5] p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-serif font-bold text-base text-[#352137]">
              2. Pan-India Delivery Address
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-600 mb-1.5">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-3 focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-600 mb-1.5">
                  Street Address & Flat / House No. *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-3 focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-600 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-3 focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-600 mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-3 focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-600 mb-1.5">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="390007"
                    className="w-full text-xs font-mono rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-3 focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white rounded-3xl border border-[#F4C6D5] p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-serif font-bold text-base text-[#352137]">
              3. Payment Information (INR)
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-[#352137] bg-[#352137] text-white shadow-xs'
                    : 'border-[#F4C6D5] text-[#282426] hover:bg-[#FFF9F5]'
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-400" /> UPI / QR
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-[#352137] bg-[#352137] text-white shadow-xs'
                    : 'border-[#F4C6D5] text-[#282426] hover:bg-[#FFF9F5]'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Card (RuPay/Visa)
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-[#352137] bg-[#352137] text-white shadow-xs'
                    : 'border-[#F4C6D5] text-[#282426] hover:bg-[#FFF9F5]'
                }`}
              >
                <Banknote className="w-4 h-4 text-amber-300" /> Cash on Delivery
              </button>
            </div>

            {paymentMethod === 'upi' && (
              <div className="space-y-2 pt-2 bg-[#FFF9F5] p-4 rounded-2xl border border-[#F4C6D5]">
                <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                  Virtual Payment Address (VPA / UPI ID)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@paytm / name@okaxis"
                  className="w-full text-xs font-mono rounded-xl border border-[#F4C6D5] bg-white p-3 focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                />
                <p className="text-[11px] text-stone-500">
                  Instant verification via PhonePe, Google Pay, Paytm, or BHIM.
                </p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full text-xs font-mono rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-3 focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full text-xs font-mono rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-3 focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                      CVC / CVV Code
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full text-xs font-mono rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-3 focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#F4C6D5] p-6 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-base text-[#352137]">
              Order Summary ({cartItems.length} items)
            </h3>

            {/* Micro items list */}
            <div className="max-h-60 overflow-y-auto divide-y divide-[#F4C6D5]/40 pr-1 space-y-3">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex items-center gap-3 pt-3 first:pt-0">
                  <img src={item.image} alt="" className="h-12 w-12 rounded-xl object-cover bg-[#FFF9F5]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#282426] truncate">{item.name}</p>
                    <p className="text-[10px] text-stone-500">
                      Qty: {item.quantity} {item.shade ? `• ${item.shade.name}` : ''}
                    </p>
                  </div>
                  <span className="text-xs font-bold font-mono text-[#352137]">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations breakdown in INR */}
            <div className="space-y-2.5 pt-4 border-t border-[#F4C6D5]/60 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-mono text-[#282426] font-semibold">{formatINR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>VIP Promo Discount</span>
                  <span className="font-mono font-semibold">-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Shipping (Express India)</span>
                <span className="font-mono text-[#282426] font-semibold">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatINR(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>GST (5% Cosmetics)</span>
                <span className="font-mono text-[#282426] font-semibold">{formatINR(estimatedTax)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#352137] pt-3 border-t border-[#F4C6D5]">
                <span>Total Due</span>
                <span className="font-mono text-xl text-[#352137] font-extrabold">{formatINR(grandTotal)}</span>
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
              className="w-full bg-[#352137] hover:bg-[#542B43] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isProcessing ? 'Authorizing Payment...' : `Complete Order (${formatINR(grandTotal)})`}
              {!isProcessing && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CheckoutPage
