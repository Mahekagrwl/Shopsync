import React, { useState } from 'react'
import { Users, Award, ShieldCheck, Search, Plus } from 'lucide-react'

export function CustomerManagementPage() {
  const [customers, setCustomers] = useState([
    { id: 'c-1', name: 'Camille Laurent', email: 'camille@example.com', tier: 'Gold Member', points: 1250, totalSpend: 1420.50, skinType: 'Combination Sensitive', allergies: 'Fragrance, Nut Oils' },
    { id: 'c-2', name: 'Sarah Jenkins', email: 'sarah.j@example.com', tier: 'Silver Member', points: 480, totalSpend: 540.00, skinType: 'Dry / Rosacea', allergies: 'Parabens' },
    { id: 'c-3', name: 'Dr. Michael Chen', email: 'm.chen@example.com', tier: 'VIP Platinum', points: 3100, totalSpend: 3890.00, skinType: 'Normal Dehydrated', allergies: 'None' },
    { id: 'c-4', name: 'Elena Rostova', email: 'elena.r@example.com', tier: 'Gold Member', points: 1820, totalSpend: 1950.00, skinType: 'Sensitive', allergies: 'Essential Oils' }
  ])

  const [search, setSearch] = useState('')

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
            Client Relations & Loyalty
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
            Customer Management & Skin Profiles
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E9DED5] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F]">
            <tr>
              <th className="py-3.5 px-4">Client Name & Email</th>
              <th className="py-3.5 px-4">Loyalty Tier</th>
              <th className="py-3.5 px-4">Loyalty Points</th>
              <th className="py-3.5 px-4">Lifetime Spend</th>
              <th className="py-3.5 px-4">Skin Profile</th>
              <th className="py-3.5 px-4 text-right">Sensitivities</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9DED5]">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-[#F8F3EE]">
                <td className="py-3 px-4">
                  <p className="font-semibold text-[#282426]">{c.name}</p>
                  <span className="text-[10px] text-stone-400 font-mono">{c.email}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D9A6AC]/20 text-[#542B43]">
                    {c.tier}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-[#282426]">{c.points} pts</td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-800">${c.totalSpend.toFixed(2)}</td>
                <td className="py-3 px-4 text-[#524B4F]">{c.skinType}</td>
                <td className="py-3 px-4 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
                    {c.allergies}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CustomerManagementPage
