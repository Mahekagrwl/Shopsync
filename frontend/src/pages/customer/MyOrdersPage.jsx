import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Truck, ArrowRight, Clock, CheckCircle2, FileText, AlertCircle, RotateCcw, XCircle } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatINR } from '../../utils/currency'
import InvoiceModal from '../../components/common/InvoiceModal'

export function MyOrdersPage() {
  const { orders, cancelOrder } = useCart()
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null)
  const [cancelToast, setCancelToast] = useState('')

  const handleCancel = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order? Stock will be returned to the atelier inventory.')) {
      const res = cancelOrder(orderId)
      if (res.success) {
        setCancelToast('Order successfully cancelled. Inventory has been updated.')
        setTimeout(() => setCancelToast(''), 4000)
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#FFF9F5] rounded-3xl p-8 sm:p-10 border border-[#F4C6D5] shadow-xs space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D985A5]">
          Order History & Invoices
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#352137]">
          My Formulation Orders ({orders.length})
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Review dispatch statuses, real-time carrier tracking, payment verification, and official downloadable tax invoices.
        </p>
      </div>

      {cancelToast && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-amber-700" />
          <span>{cancelToast}</span>
        </div>
      )}

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const isPaid = order.paymentStatus?.toLowerCase().includes('paid')
            const isCancelled = order.status === 'Cancelled'

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-[#F4C6D5] p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Top Meta Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F4C6D5]/60 gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-[#352137] text-sm">Order #{order.orderNumber}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFF9F5] text-stone-600 border border-[#F4C6D5]/60">
                        Invoice: {order.invoiceNumber || `INV-${order.orderNumber}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Placed on {new Date(order.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {/* Order Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
                      isCancelled
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : order.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {isCancelled ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>Status: {order.status}</span>
                    </span>

                    {/* Payment Status Badge */}
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      isCancelled
                        ? 'bg-stone-50 text-stone-600 border-stone-200'
                        : isPaid
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      Payment: {order.paymentStatus || (isPaid ? 'Paid' : 'Pending')}
                    </span>

                    {/* Download Invoice Button */}
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFF9F5] text-[#352137] border border-[#F4C6D5] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#D985A5]" />
                      <span>Invoice</span>
                    </button>

                    {/* Live Tracking Link */}
                    {!isCancelled && (
                      <Link
                        to={`/order-tracking/${order.id}`}
                        className="bg-[#352137] hover:bg-[#542B43] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5 text-[#F4C6D5]" />
                        <span>Track</span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Items in order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF9F5] border border-[#F4C6D5]/60">
                      <img src={item.image} alt="" className="h-14 w-14 rounded-xl object-cover bg-white border border-[#F4C6D5]/40" />
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-[#352137] truncate">{item.name}</p>
                        <p className="text-[11px] text-stone-500">
                          Qty: {item.quantity} {item.shade ? `• ${item.shade.name || item.shade}` : ''}
                        </p>
                        <span className="text-xs font-bold font-mono text-[#352137]">
                          {formatINR(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-stone-600 bg-[#FFF9F5]/50 p-3 rounded-xl border border-[#F4C6D5]/40">
                  <div>
                    <span className="font-semibold text-[#352137]">Delivery Address:</span>{' '}
                    <span>{order.shippingAddress}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#352137]">Payment Method:</span>{' '}
                    <span>{order.paymentMethod}</span>
                  </div>
                </div>

                {/* Bottom footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[#F4C6D5]/60 text-xs gap-3">
                  <div className="flex items-center gap-2 text-stone-600">
                    <span>
                      Carrier: <strong className="text-[#352137]">{order.carrier}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      AWB Code: <strong className="text-[#352137] font-mono">{order.trackingNumber}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {!isCancelled && order.status === 'Order Placed' && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline cursor-pointer"
                      >
                        Cancel Order
                      </button>
                    )}
                    <span className="font-bold text-sm text-[#352137]">
                      Grand Total: {formatINR(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#F4C6D5] p-8 space-y-4">
          <Package className="w-16 h-16 text-stone-300 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#352137]">No past formulation orders found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            When you place an order, its real-time dispatch progress, carrier AWB, and printable GST tax invoice will appear here.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#352137] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#542B43] transition-colors"
          >
            <span>Explore Formulations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
        order={selectedInvoiceOrder}
      />
    </div>
  )
}

export default MyOrdersPage
