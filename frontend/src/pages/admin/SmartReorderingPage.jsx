import React, { useState } from 'react'
import { RefreshCw, CheckCircle2, ArrowRight, Package } from 'lucide-react'
import { formatINR } from '../../utils/currency'

export function SmartReorderingPage() {
  const [reorders, setReorders] = useState([
    { id: 'ro-1', product: 'Maybelline New York Fit Me (Shade 128)', supplier: "L'Oréal India Pvt. Ltd. (Mumbai Hub)", currentStock: 95, suggestedOrder: 500, unitCost: 320, leadTime: '3 Business Days', status: 'Pending Approval' },
    { id: 'ro-2', product: 'Lakmé 9 to 5 Primer + Matte Foundation', supplier: 'Hindustan Unilever Ltd. (Mumbai Hub)', currentStock: 180, suggestedOrder: 400, unitCost: 260, leadTime: '4 Business Days', status: 'Pending Approval' },
    { id: 'ro-3', product: 'Minimalist 10% Niacinamide + Zinc Serum', supplier: 'Uprising Science Pvt. Ltd. (Jaipur Depot)', currentStock: 210, suggestedOrder: 600, unitCost: 290, leadTime: '5 Business Days', status: 'Pending Approval' }
  ])

  const [approvedNotice, setApprovedNotice] = useState('')

  const handleApprovePO = (id, prodName) => {
    setReorders(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'PO Dispatched to Brand Depot' } : r))
    )
    setApprovedNotice(`GST Purchase Order generated and transmitted to distributor for ${prodName}!`)
    setTimeout(() => setApprovedNotice(''), 3500)
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
          Automated Replenishment (INR)
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
          Smart Brand & Distributor Reordering Queue
        </h1>
      </div>

      {approvedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{approvedNotice}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-[#E9DED5] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F]">
            <tr>
              <th className="py-3.5 px-4">Formulation SKU</th>
              <th className="py-3.5 px-4">Brand Distributor / Depot</th>
              <th className="py-3.5 px-4">Current Reserve</th>
              <th className="py-3.5 px-4">Recommended Reorder</th>
              <th className="py-3.5 px-4">Estimated PO Cost (₹)</th>
              <th className="py-3.5 px-4">Lead Time</th>
              <th className="py-3.5 px-4 text-right">Approval</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9DED5]">
            {reorders.map((r) => (
              <tr key={r.id} className="hover:bg-[#F8F3EE]">
                <td className="py-3 px-4 font-bold text-[#282426]">{r.product}</td>
                <td className="py-3 px-4 text-[#524B4F]">{r.supplier}</td>
                <td className="py-3 px-4 font-mono font-bold text-amber-800">{r.currentStock} units</td>
                <td className="py-3 px-4 font-mono font-bold text-[#542B43]">+{r.suggestedOrder} units</td>
                <td className="py-3 px-4 font-mono font-bold text-[#542B43]">{formatINR(r.suggestedOrder * r.unitCost)}</td>
                <td className="py-3 px-4 text-stone-500">{r.leadTime}</td>
                <td className="py-3 px-4 text-right">
                  {r.status === 'Pending Approval' ? (
                    <button
                      onClick={() => handleApprovePO(r.id, r.product)}
                      className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      Issue GST PO
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Transmitted
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SmartReorderingPage
