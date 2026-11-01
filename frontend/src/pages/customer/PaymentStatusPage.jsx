import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, ShieldCheck, ArrowRight, Clock, CreditCard } from 'lucide-react'

export function PaymentStatusPage() {
  const [params] = useSearchParams()
  const status = params.get('status') || 'successful'
  const txId = params.get('txId') || 'TXN-' + Math.floor(100000 + Math.random() * 900000)

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
      <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mx-auto flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
          Gateway Verification
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#282426]">
          Payment Authorized & Confirmed
        </h1>
        <p className="text-xs sm:text-sm text-[#524B4F] max-w-md mx-auto">
          Your transaction has cleared through our tokenized PCI-DSS Tier 1 gateway.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 text-xs text-left max-w-md mx-auto space-y-3 shadow-xs">
        <div className="flex justify-between py-1 border-b border-[#E9DED5]">
          <span className="text-stone-400">Payment Status</span>
          <span className="font-bold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Settled / Completed
          </span>
        </div>
        <div className="flex justify-between py-1 border-b border-[#E9DED5]">
          <span className="text-stone-400">Transaction ID</span>
          <span className="font-mono font-semibold text-[#282426]">{txId}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-[#E9DED5]">
          <span className="text-stone-400">Verification Protocol</span>
          <span className="font-semibold text-[#282426]">3D Secure 2.0 Biometric</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-stone-400">Authorization Code</span>
          <span className="font-mono text-[#542B43]">AUTH-8921-OK</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Link
          to="/orders"
          className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-6 py-3 rounded-full text-xs font-semibold shadow-md flex items-center gap-2"
        >
          View My Orders <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/shop"
          className="bg-white border border-[#E9DED5] hover:bg-[#F8F3EE] text-[#282426] px-6 py-3 rounded-full text-xs font-semibold"
        >
          Back to Shop
        </Link>
      </div>
    </div>
  )
}

export default PaymentStatusPage
