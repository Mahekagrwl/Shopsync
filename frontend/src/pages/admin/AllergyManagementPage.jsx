import React, { useState } from 'react'
import { ShieldAlert, Plus, CheckCircle2, Trash2 } from 'lucide-react'
import { COMMON_ALLERGENS } from '../../data/mockBeautyData'

export function AllergyManagementPage() {
  const [allergenRules, setAllergenRules] = useState(COMMON_ALLERGENS)

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
          SkinSafe™ Protocol Configuration
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
          Allergy Sensitivity Rule Engine
        </h1>
        <p className="text-xs text-[#827A7F] mt-1">
          Configures algorithmic warnings for sensitive customers across e-commerce product cards and POS receipt alerts.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E9DED5] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F]">
            <tr>
              <th className="py-3.5 px-4">Allergen Class</th>
              <th className="py-3.5 px-4">Catalog Exposure</th>
              <th className="py-3.5 px-4">Clinical Severity</th>
              <th className="py-3.5 px-4 text-right">Detection Rule</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9DED5]">
            {allergenRules.map((rule) => (
              <tr key={rule.id} className="hover:bg-[#F8F3EE]">
                <td className="py-3 px-4 font-bold text-[#282426] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  {rule.name}
                </td>
                <td className="py-3 px-4 text-[#524B4F]">{rule.count}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    rule.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rule.severity} Risk
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#F8F3EE] text-[#542B43]">
                    Regex Keyword Parser Active
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

export default AllergyManagementPage
