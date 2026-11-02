import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Printer, Download, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react'
import { formatINR } from '../../utils/currency'

/**
 * InvoiceModal (Phase 3 - Automatic Invoice Generation)
 * Generates an official, printable & downloadable tax invoice with
 * ShopSync branding, GST details, order items, taxes, and payment status.
 */
export function InvoiceModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null

  const handlePrint = () => {
    window.print()
  }

  const isPaid = order.paymentStatus?.toLowerCase().includes('paid') || order.payment_status?.toLowerCase().includes('paid')
  const isCancelled = order.status === 'Cancelled'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#F4C6D5] p-6 sm:p-10 my-8 overflow-hidden print:shadow-none print:border-none print:p-0 print:my-0"
        >
          {/* Action Bar (Hidden during print) */}
          <div className="flex items-center justify-between pb-6 border-b border-[#F4C6D5]/60 print:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#352137]">
                Official Tax Invoice
              </span>
              <span className="text-[11px] font-mono text-stone-500">
                #{order.invoiceNumber || `INV-${order.orderNumber}`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#352137] hover:bg-[#542B43] text-white text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Download PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer"
                aria-label="Close Invoice"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Invoice Body */}
          <div className="space-y-6 pt-4 text-xs text-[#282426]">
            {/* Header: Brand & Company Details */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.jpg"
                  alt="ShopSync Logo"
                  className="h-14 w-14 rounded-2xl object-cover border border-[#F4C6D5]"
                />
                <div>
                  <h2 className="font-serif text-2xl font-bold tracking-tight text-[#352137]">
                    SHOP<span className="text-[#D985A5]">SYNC</span>
                  </h2>
                  <p className="text-[10px] uppercase tracking-widest text-[#A56D8A] font-semibold">
                    Smart Beauty. Smarter Business.
                  </p>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    ShopSync Atelier Retail Pvt. Ltd. • GSTIN: 24AAACS9821K1ZP
                  </p>
                </div>
              </div>

              {/* Invoice Meta */}
              <div className="text-left sm:text-right space-y-1">
                <div className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFF9F5] border border-[#F4C6D5] text-[#352137]">
                  Tax Invoice / Bill of Supply
                </div>
                <p className="text-xs font-mono font-bold text-[#352137]">
                  Invoice: {order.invoiceNumber || `INV-${order.orderNumber}`}
                </p>
                <p className="text-[11px] text-stone-500">
                  Order ID: <span className="font-mono font-semibold">{order.orderNumber}</span>
                </p>
                <p className="text-[11px] text-stone-500">
                  Date: {new Date(order.date || Date.now()).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Billing & Shipping Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FFF9F5] border border-[#F4C6D5]/60 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A56D8A]">
                  Billed & Shipped To:
                </span>
                <p className="font-bold text-[#352137]">{order.contactName || 'Ananya Sharma'}</p>
                <p className="text-stone-600 leading-relaxed text-[11px]">{order.shippingAddress}</p>
                <p className="text-stone-500 text-[11px]">
                  Email: {order.contactEmail || 'customer@shopsync.in'}
                </p>
              </div>

              <div className="space-y-1 sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A56D8A]">
                  Dispatch & Carrier Information:
                </span>
                <p className="font-medium text-[#352137]">Carrier: {order.carrier || 'Blue Dart Express'}</p>
                <p className="font-mono text-stone-600 text-[11px]">
                  AWB: {order.trackingNumber || 'Pending Dispatch'}
                </p>
                <div className="pt-1">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isCancelled
                      ? 'bg-rose-100 text-rose-800'
                      : isPaid
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isCancelled ? (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        <span>Order Cancelled</span>
                      </>
                    ) : isPaid ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Payment Verified</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        <span>Payment Pending (COD)</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#F4C6D5] text-[#352137] uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4C6D5]/40">
                  {order.items && order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-[#352137]">{item.name}</p>
                        <p className="text-[10px] text-stone-500">
                          {item.brand ? `${item.brand} • ` : ''}
                          {item.shade ? `Shade: ${item.shade.name || item.shade} • ` : ''}
                          {item.sku ? `SKU: ${item.sku}` : ''}
                        </p>
                      </td>
                      <td className="py-3 px-3 text-center font-mono">{item.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono">{formatINR(item.price)}</td>
                      <td className="py-3 px-3 text-right font-mono font-semibold">
                        {formatINR(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Breakdown */}
            <div className="flex flex-col sm:flex-row justify-between pt-4 border-t border-[#F4C6D5] gap-4">
              <div className="space-y-1.5 max-w-sm text-[11px] text-stone-500">
                <p className="font-bold text-[#352137] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Tax & Regulatory Notes:
                </p>
                <p>
                  Goods once sold are covered by ShopSync 15-day genuine formulation guarantee. This is a computer-generated tax invoice adhering to Indian CGST/SGST cosmetics rules.
                </p>
              </div>

              <div className="w-full sm:w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">{formatINR(order.subtotal || 0)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount:</span>
                    <span className="font-mono">-{formatINR(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>GST (5% Cosmetics):</span>
                  <span className="font-mono">{formatINR(order.tax || 0)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Express Shipping:</span>
                  <span className="font-mono">
                    {order.shipping === 0 ? 'FREE' : formatINR(order.shipping || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#352137] pt-2 border-t border-[#F4C6D5]">
                  <span>Total Amount:</span>
                  <span className="font-mono text-lg text-[#352137]">{formatINR(order.total || 0)}</span>
                </div>
                <div className="pt-1 text-[11px] text-stone-500 flex justify-between">
                  <span>Payment Mode:</span>
                  <span className="font-medium text-[#352137]">{order.paymentMethod || 'UPI'}</span>
                </div>
              </div>
            </div>

            {/* Footer Sign-off */}
            <div className="pt-6 border-t border-[#F4C6D5]/60 text-center text-[10px] text-stone-400">
              <p>Thank you for choosing ShopSync • Vadodara Atelier, Gujarat, India • support@shopsync.in</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default InvoiceModal
