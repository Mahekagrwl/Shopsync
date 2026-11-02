import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Sparkles, Package, Truck, ArrowRight, Printer } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatINR } from '../../utils/currency'

export function OrderConfirmationPage() {
  const [params] = useSearchParams()
  const orderNumber = params.get('orderNumber')
  const { orders } = useCart()

  const currentOrder = orders.find(o => o.orderNumber === orderNumber) || orders[0]

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
          Thank You For Your Order
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#282426]">
          Your Formulations Are Being Prepared
        </h1>
        <p className="text-xs sm:text-sm text-[#524B4F] max-w-md mx-auto">
          We have sent an order receipt and dispatch notification to your email.
        </p>
      </div>

      {currentOrder && (
        <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Order Header Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E9DED5] gap-4 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Order Number</span>
              <span className="font-mono text-base font-bold text-[#282426]">{currentOrder.orderNumber}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Tracking Code</span>
              <span className="font-mono text-xs font-semibold text-[#542B43]">{currentOrder.trackingNumber}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Estimated Delivery</span>
              <span className="font-semibold text-emerald-800">{currentOrder.estimatedDelivery}</span>
            </div>
          </div>

          {/* Purchased Items */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#282426]">
              Atelier Formulations in this Order
            </h3>
            <div className="divide-y divide-[#E9DED5]">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="h-12 w-12 rounded-xl object-cover bg-[#F8F3EE]" />
                    <div>
                      <p className="font-semibold text-[#282426]">{item.name}</p>
                      <p className="text-[10px] text-stone-400">
                        Qty: {item.quantity} {item.shade ? `• Shade: ${item.shade.name}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#282426]">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-2 pt-4 border-t border-[#E9DED5] text-xs">
            <div className="flex justify-between text-[#524B4F]">
              <span>Subtotal</span>
              <span className="font-mono">{formatINR(currentOrder.subtotal)}</span>
            </div>
            {currentOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Promotional VIP Discount</span>
                <span className="font-mono">-{formatINR(currentOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#524B4F]">
              <span>Shipping</span>
              <span className="font-mono">{currentOrder.shipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatINR(currentOrder.shipping)}</span>
            </div>
            <div className="flex justify-between text-[#524B4F]">
              <span>GST (5% Cosmetics)</span>
              <span className="font-mono">{formatINR(currentOrder.tax)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#282426] pt-2 border-t border-[#E9DED5]">
              <span>Total Paid</span>
              <span className="font-mono text-base font-bold text-[#542B43]">{formatINR(currentOrder.total)}</span>
            </div>
          </div>

          {/* Delivery & Payment destination info */}
          <div className="p-4 rounded-2xl bg-[#F8F3EE] border border-[#E9DED5] text-xs space-y-1">
            <p className="font-bold text-[#282426]">Shipping To:</p>
            <p className="text-[#524B4F]">{currentOrder.shippingAddress}</p>
            <p className="text-[11px] text-stone-400 pt-1">Charged to: {currentOrder.paymentMethod}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to={`/order-tracking/${currentOrder?.id || ''}`}
          className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-7 py-3 rounded-full text-xs font-semibold shadow-md flex items-center gap-2"
        >
          Track Shipment Live <Truck className="w-4 h-4" />
        </Link>
        <Link
          to="/shop"
          className="bg-white border border-[#E9DED5] hover:bg-[#F8F3EE] text-[#282426] px-7 py-3 rounded-full text-xs font-semibold"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default OrderConfirmationPage
