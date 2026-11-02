import React, { useState } from 'react'
import { Settings, Save, CheckCircle2, Server, Database, Store } from 'lucide-react'

export function SettingsPage() {
  const [storeLocation, setStoreLocation] = useState('Vadodara Flagship Boutique (Alkapuri)')
  const [terminalId, setTerminalId] = useState('POS-01-VADODARA')
  const [taxRate, setTaxRate] = useState(5.0)
  const [currency, setCurrency] = useState('INR (₹)')
  const [receiptFooter, setReceiptFooter] = useState('Thank you for visiting SHOPSYNC Flagship Boutique. GSTIN: 24AAACS9182K1ZU. Keep glowing!')
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
          Station Configurations
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
          Terminal & Omnichannel Settings
        </h1>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>Station parameters saved successfully across local register memory!</span>
        </div>
      )}

      {/* Backend & Supabase Status Panel */}
      <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-4 shadow-xs text-xs">
        <h3 className="font-serif font-bold text-base text-[#282426]">
          System Integration Health
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#F8F3EE] border border-[#E9DED5] flex items-center gap-3">
            <Server className="w-6 h-6 text-emerald-700" />
            <div>
              <p className="font-bold text-[#282426]">Python FastAPI Core Engine</p>
              <p className="text-[11px] text-stone-500 font-mono">http://localhost:8000/api/v1 (Ready)</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F3EE] border border-[#E9DED5] flex items-center gap-3">
            <Database className="w-6 h-6 text-[#542B43]" />
            <div>
              <p className="font-bold text-[#282426]">Supabase PostgreSQL Data Lake</p>
              <p className="text-[11px] text-stone-500 font-mono">DDL Migrations Configured (Ready)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-6 shadow-xs text-xs">
        <h3 className="font-serif font-bold text-base text-[#282426]">
          Point of Sale Terminal Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold uppercase text-[#524B4F] mb-1">Store / Boutique Name</label>
            <input
              type="text"
              value={storeLocation}
              onChange={(e) => setStoreLocation(e.target.value)}
              className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#524B4F] mb-1">Terminal Station Identifier</label>
            <input
              type="text"
              value={terminalId}
              onChange={(e) => setTerminalId(e.target.value)}
              className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#524B4F] mb-1">Sales Tax Rate (%)</label>
            <input
              type="number"
              step="0.01"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#524B4F] mb-1">Currency Code</label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold uppercase text-[#524B4F] mb-1">Thermal Receipt Printout Note</label>
            <textarea
              rows={2}
              value={receiptFooter}
              onChange={(e) => setReceiptFooter(e.target.value)}
              className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Station Settings
        </button>
      </form>
    </div>
  )
}

export default SettingsPage
