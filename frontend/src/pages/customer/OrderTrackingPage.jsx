import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Package, Truck, CheckCircle2, Clock, MapPin, ArrowLeft, ShieldCheck } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export function OrderTrackingPage() {
  const { orderId } = useParams()
  const { orders } = useCart()

  const order = orders.find(o => o.id === orderId) || orders[0]

  const trackingSteps = [
    { title: 'Order Verified & Screened', desc: 'Formulation batch certified by quality assurance', time: 'Oct 28, 02:40 PM', completed: true },
    { title: 'Atelier Packaging Complete', desc: 'Secure temperature-controlled seal applied', time: 'Oct 28, 05:15 PM', completed: true },
    { title: 'In Transit with FedEx Luxury Express', desc: 'Arrived at San Francisco Distribution Hub', time: 'Oct 29, 08:30 AM', completed: true, active: true },
    { title: 'Out for Courier Delivery', desc: 'Dispatched to final address', time: 'Estimated Oct 31, 09:00 AM', completed: false },
    { title: 'Delivered', desc: 'Direct signature confirmation required', time: 'Pending', completed: false }
  ]

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4 px-4">
        <h2 className="font-serif text-2xl font-bold text-[#282426]">No order selected for tracking</h2>
        <Link to="/orders" className="text-xs font-semibold text-[#542B43] underline">
          View all your orders
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top back */}
      <Link to="/orders" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#542B43] hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to My Orders
      </Link>

      {/* Header Card */}
      <div className="bg-[#E9DED5] rounded-3xl p-8 sm:p-10 border border-[#D9A6AC]/60 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
              Live Carrier Tracking
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#282426]">
              Order #{order.orderNumber}
            </h1>
          </div>
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#542B43] text-white">
            {order.status}
          </span>
        </div>
        <p className="text-xs text-[#524B4F]">
          Carrier: <strong className="text-[#282426]">{order.carrier}</strong> • Tracking #{' '}
          <strong className="text-[#542B43] font-mono">{order.trackingNumber}</strong> • Estimated Delivery:{' '}
          <strong className="text-emerald-800">{order.estimatedDelivery}</strong>
        </p>
      </div>

      {/* Tracking Stepper */}
      <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-10 shadow-xs space-y-8">
        <h3 className="font-serif font-bold text-lg text-[#282426]">
          Dispatch & Transit Milestone Progress
        </h3>

        <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E9DED5]">
          {trackingSteps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div
                className={`absolute -left-8 top-0.5 h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step.active
                    ? 'bg-[#542B43] text-white ring-4 ring-[#D9A6AC]/50'
                    : step.completed
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#F8F3EE] text-stone-400 border border-[#E9DED5]'
                }`}
              >
                {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className={`text-sm font-bold ${step.completed || step.active ? 'text-[#282426]' : 'text-stone-400'}`}>
                    {step.title}
                  </h4>
                  <span className="text-[11px] font-mono text-[#827A7F]">{step.time}</span>
                </div>
                <p className="text-xs text-[#524B4F] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Destination */}
      <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 className="font-serif font-bold text-base text-[#282426] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#542B43]" /> Delivery Destination
        </h3>
        <p className="text-xs text-[#524B4F]">{order.shippingAddress}</p>
        <p className="text-[11px] text-stone-400">
          Package includes tamper-evident cold seal and personalized shade match assurance.
        </p>
      </div>
    </div>
  )
}

export default OrderTrackingPage
