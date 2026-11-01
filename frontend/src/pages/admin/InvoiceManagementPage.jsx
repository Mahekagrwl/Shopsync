import React, { useState } from 'react'
import { FileText, Printer, Search, CheckCircle2 } from 'lucide-react'
import { usePOS } from '../../context/POSContext'

export function InvoiceManagementPage() {
  const { invoices } = usePOS()
  const [search, setSearch] = useState('')
  const [activeInvoice, setActiveInvoice] = useState(null)

  const filtered = invoices.filter(inv =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
    inv.paymentMethod.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
            Fiscal Receipts & Records
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
            Invoice & Register Audit Log
          </h1>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-[#E9DED5] flex items-center justify-between text-xs shadow-xs">
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Search invoice number or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5 pl-9 text-xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
        </div>
        <span className="text-stone-400 font-mono">
          {filtered.length} settled invoices
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#E9DED5] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F]">
            <tr>
              <th className="py-3.5 px-4">Invoice #</th>
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">Cashier</th>
              <th className="py-3.5 px-4">Client</th>
              <th className="py-3.5 px-4">Payment Tender</th>
              <th className="py-3.5 px-4 text-right">Amount Paid</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9DED5]">
            {filtered.map((inv, idx) => (
              <tr key={idx} className="hover:bg-[#F8F3EE]">
                <td className="py-3 px-4 font-mono font-bold text-[#542B43]">{inv.invoiceNumber}</td>
                <td className="py-3 px-4 text-stone-500 font-mono">
                  {new Date(inv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="py-3 px-4 text-[#282426]">{inv.cashierName}</td>
                <td className="py-3 px-4 font-medium text-[#282426]">{inv.customerName}</td>
                <td className="py-3 px-4 text-stone-500 truncate max-w-xs">{inv.paymentMethod}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-[#282426]">${inv.total.toFixed(2)}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => setActiveInvoice(inv)}
                    className="p-1.5 text-stone-500 hover:text-[#542B43] hover:bg-[#F8F3EE] rounded-lg"
                    title="Print Receipt"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoice modal */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-[#E9DED5] p-6 space-y-4 shadow-2xl text-xs font-mono">
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-stone-300">
              <h3 className="font-serif font-bold text-lg text-[#282426]">RECEIPT REPRINT</h3>
              <p className="text-[10px] text-stone-500">{activeInvoice.invoiceNumber}</p>
            </div>
            <div className="space-y-1.5 text-[11px]">
              {activeInvoice.items.map((i, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{i.name} (x{i.quantity})</span>
                  <span>${(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-dashed border-stone-300 space-y-1 text-xs">
              <div className="flex justify-between font-bold text-sm text-[#542B43]">
                <span>TOTAL:</span>
                <span>${activeInvoice.total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => setActiveInvoice(null)}
              className="w-full py-2.5 rounded-xl bg-[#542B43] text-white font-sans font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceManagementPage
