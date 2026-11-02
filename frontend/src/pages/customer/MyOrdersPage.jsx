import React from 'react'
import { Link } from 'react-router-dom'
import { Package, Truck, ArrowRight, Clock, CheckCircle2 } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatINR } from '../../utils/currency'

export function MyOrdersPage() {
  const { orders } = useCart()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#E9DED5] rounded-3xl p-8 sm:p-10 border border-[#D9A6AC]/60">
        <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
          Order History & Tracking
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#282426] mt-1">
          My Formulation Orders ({orders.length})
        </h1>
        <p className="text-xs sm:text-sm text-[#524B4F] mt-1">
          Review dispatch statuses, real-time carrier tracking numbers, and order receipts.
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-6 shadow-xs"
            >
              {/* Top Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E9DED5] gap-4 text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#282426] text-sm">Order #{order.orderNumber}</span>
                  <p className="text-[11px] text-stone-400">
                    Placed on {new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {order.status}
                  </span>
                  <Link
                    to={`/order-tracking/${order.id}`}
                    className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    Track Live <Truck className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items in order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F3EE] border border-[#E9DED5]">
                    <img src={item.image} alt="" className="h-14 w-14 rounded-xl object-cover bg-white" />
                    <div className="min-w-0">
                      <p className="font-semibold text-xs text-[#282426] truncate">{item.name}</p>
                      <p className="text-[11px] text-[#524B4F]">
                        Qty: {item.quantity} {item.shade ? `• ${item.shade.name}` : ''}
                      </p>
                      <span className="text-xs font-bold font-mono text-[#542B43]">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[#E9DED5] text-xs gap-2">
                <span className="text-[#524B4F]">
                  Carrier: <strong className="text-[#282426]">{order.carrier}</strong> • Tracking Code: <strong className="text-[#542B43] font-mono">{order.trackingNumber}</strong>
                </span>
                <span className="font-bold text-sm text-[#282426]">
                  Total: {formatINR(order.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E9DED5] p-8 space-y-4">
          <Package className="w-16 h-16 text-stone-300 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#282426]">No past orders found</h3>
          <p className="text-xs text-[#827A7F]">When you place an order, its live dispatch progress will appear here.</p>
        </div>
      )}
    </div>
  )
}

export default MyOrdersPage
