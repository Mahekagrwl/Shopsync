import React, { useState } from 'react'
import { Layers, Plus, CheckCircle2, ShieldCheck } from 'lucide-react'

export function BatchManagementPage() {
  const [batches, setBatches] = useState([
    { id: 'b-1', lotCode: 'LOT-2026-VA01', product: 'Silk Radiance Luminous Foundation', mfgDate: '2026-08-15', units: 500, labCert: 'Passed - ISO 22716 GMP', status: 'In Distribution' },
    { id: 'b-2', lotCode: 'LOT-2026-AD02', product: 'Cellular Renewal Peptide Barrier Elixir', mfgDate: '2026-09-01', units: 350, labCert: 'Passed - Clinical Microbes Clean', status: 'In Distribution' },
    { id: 'b-3', lotCode: 'LOT-2026-SB04', product: 'Mineral Silk Fluid Broad Spectrum SPF 50+', mfgDate: '2026-07-20', units: 600, labCert: 'Passed - Broad Spectrum Critical Wavelength', status: 'In Distribution' },
    { id: 'b-4', lotCode: 'LOT-2026-CG06', product: 'Caviar Molecular Bond Repair Hair Mask', mfgDate: '2026-06-10', units: 250, labCert: 'Passed - Stability Test', status: 'Near Expiry Alert' }
  ])

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
          Quality Assurance & Traceability
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
          Laboratory Batch & Lot Control
        </h1>
      </div>

      <div className="bg-white rounded-3xl border border-[#E9DED5] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F]">
            <tr>
              <th className="py-3.5 px-4">Batch Lot Number</th>
              <th className="py-3.5 px-4">Formulation Name</th>
              <th className="py-3.5 px-4">Manufacturing Date</th>
              <th className="py-3.5 px-4">Batch Yield</th>
              <th className="py-3.5 px-4">QA Lab Assay</th>
              <th className="py-3.5 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9DED5]">
            {batches.map((b) => (
              <tr key={b.id} className="hover:bg-[#F8F3EE]">
                <td className="py-3 px-4 font-mono font-bold text-[#542B43]">{b.lotCode}</td>
                <td className="py-3 px-4 font-semibold text-[#282426]">{b.product}</td>
                <td className="py-3 px-4 text-stone-500 font-mono">{b.mfgDate}</td>
                <td className="py-3 px-4 font-mono">{b.units} units</td>
                <td className="py-3 px-4 text-emerald-800 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {b.labCert}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    b.status.includes('Alert') ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {b.status}
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

export default BatchManagementPage
