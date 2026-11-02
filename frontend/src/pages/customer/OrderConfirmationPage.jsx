import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Sparkles, Package, Truck, ArrowRight, Printer, FileText } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatINR } from '../../utils/currency'
import InvoiceModal from '../../components/common/InvoiceModal'

export function OrderConfirmationPage() {
  const [params] = useSearchParams()
  const orderNumber = params.get('orderNumber')
  const { orders } = useCart()
  const [invoiceOpen, setInvoiceOpen] = useState(false)

  const currentOrder = orders.find(o => o.orderNumber === orderNumber) || orders[0]

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#D985A5]">
          Thank You For Your Order
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#352137]">
          Your Formulations Are Being Prepared
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          We have generated your order confirmation and dispatch notification. Your inventory items have been securely reserved.
        </p>
      </div>

      {currentOrder && (
        <div className="bg-white rounded-3xl border border-[#F4C6D5] p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Order Header Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F4C6D5]/60 gap-4 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Order Number</span>
              <span className="font-mono text-base font-bold text-[#352137]">{currentOrder.orderNumber}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Tracking Code</span>
              <span className="font-mono text-xs font-semibold text-[#D985A5]">{currentOrder.trackingNumber}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Payment Status</span>
              <span className={`font-semibold ${currentOrder.paymentStatus?.includes('Paid') ? 'text-emerald-700' : 'text-amber-800'}`}>
                {currentOrder.paymentStatus || 'Paid'}
              </span>
            </div>
          </div>

          {/* Purchased Items */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#352137]">
              Atelier Formulations in this Order
            </h3>
            <div className="divide-y divide-[#F4C6D5]/40">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="h-12 w-12 rounded-xl object-cover bg-[#FFF9F5] border border-[#F4C6D5]/40" />
                    <div>
                      <p className="font-semibold text-[#352137]">{item.name}</p>
                      <p className="text-[10px] text-stone-400">
                        Qty: {item.quantity} {item.shade ? `• Shade: ${item.shade.name || item.shade}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#352137]">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-2 pt-4 border-t border-[#F4C6D5]/60 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-mono">{formatINR(currentOrder.subtotal)}</span>
            </div>
            {currentOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Promotional VIP Discount</span>
                <span className="font-mono">-{formatINR(currentOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Shipping</span>
              <span className="font-mono">{currentOrder.shipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatINR(currentOrder.shipping)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>GST (5% Cosmetics)</span>
              <span className="font-mono">{formatINR(currentOrder.tax)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#352137] pt-2 border-t border-[#F4C6D5]/60">
              <span>Total Amount</span>
              <span className="font-mono text-base font-bold text-[#352137]">{formatINR(currentOrder.total)}</span>
            </div>
          </div>

          {/* Delivery & Payment destination info */}
          <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#F4C6D5]/60 text-xs space-y-1">
            <p className="font-bold text-[#352137]">Shipping Address:</p>
            <p className="text-stone-600">{currentOrder.shippingAddress}</p>
            <p className="text-[11px] text-stone-500 pt-1">Payment Method: {currentOrder.paymentMethod}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => setInvoiceOpen(true)}
          className="bg-white border-2 border-[#D985A5] hover:bg-[#FFF9F5] text-[#352137] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md flex items-center gap-2 cursor-pointer transition-all"
        >
          <FileText className="w-4 h-4 text-[#D985A5]" />
          <span>Download Tax Invoice</span>
        </button>

        <Link
          to={`/order-tracking/${currentOrder?.id || ''}`}
          className="bg-[#352137] hover:bg-[#542B43] text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 transition-all"
        >
          <span>Track Shipment</span>
          <Truck className="w-4 h-4 text-[#F4C6D5]" />
        </Link>

        <Link
          to="/shop"
          className="bg-[#FFF9F5] border border-[#F4C6D5] hover:bg-[#F4C6D5]/30 text-[#352137] px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        order={currentOrder}
      />
    </div>
  )
}

export default OrderConfirmationPage
