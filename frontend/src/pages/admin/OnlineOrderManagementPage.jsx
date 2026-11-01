import React, { useState } from 'react'
import { ShoppingBag, Truck, CheckCircle2, Search, ArrowRight } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export function OnlineOrderManagementPage() {
  const { orders } = useCart()
  const [orderList, setOrderList] = useState(orders)
  const [search, setSearch] = useState('')

  const handleUpdateStatus = (id, newStatus) => {
    setOrderList(prev =>
      prev.map(o => (o.id === id ? { ...o, status: newStatus } : o))
    )
  }

  const filtered = orderList.filter(o =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.trackingNumber.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
            Digital Boutique Fulfillment
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
            Online Orders Management
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E9DED5] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F]">
            <tr>
              <th className="py-3.5 px-4">Order #</th>
              <th className="py-3.5 px-4">Carrier & Tracking</th>
              <th className="py-3.5 px-4">Items Count</th>
              <th className="py-3.5 px-4">Shipping Destination</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Order Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9DED5]">
            {filtered.map((ord) => (
              <tr key={ord.id} className="hover:bg-[#F8F3EE]">
                <td className="py-3 px-4 font-mono font-bold text-[#542B43]">{ord.orderNumber}</td>
                <td className="py-3 px-4">
                  <p className="font-semibold text-[#282426]">{ord.carrier}</p>
                  <span className="font-mono text-[10px] text-stone-400">{ord.trackingNumber}</span>
                </td>
                <td className="py-3 px-4 font-mono">{ord.items.length} items</td>
                <td className="py-3 px-4 text-stone-500 max-w-xs truncate">{ord.shippingAddress}</td>
                <td className="py-3 px-4">
                  <select
                    value={ord.status}
                    onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                    className="rounded-lg border border-[#E9DED5] bg-[#F8F3EE] p-1.5 text-xs font-semibold text-[#542B43]"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Atelier Packing">Atelier Packing</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-[#282426]">${ord.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OnlineOrderManagementPage
