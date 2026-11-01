import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ShieldCheck, HeartHandshake, Truck, ArrowRight, Check } from 'lucide-react'

export function CustomerFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <footer className="w-full bg-[#282426] text-[#F8F3EE] pt-16 pb-12 mt-20 border-t border-[#542B43]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-[#524B4F]/40">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#542B43] text-[#D9A6AC]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-white">SkinSafe™ Verification</h4>
              <p className="text-xs text-[#E9DED5]/80 mt-0.5">Every ingredient screened against 140+ irritants & nut allergens.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#542B43] text-[#D9A6AC]">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-white">Precision AI Formulations</h4>
              <p className="text-xs text-[#E9DED5]/80 mt-0.5">Biomimetic peptides and high-pigment shades verified by optical data.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#542B43] text-[#D9A6AC]">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-white">Omnichannel Boutique Sync</h4>
              <p className="text-xs text-[#E9DED5]/80 mt-0.5">Real-time inventory reserve across online bag and in-store smart POS.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          {/* Brand Info & Newsletter */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="ShopSync"
                className="h-10 w-10 rounded-xl object-cover shadow-md border border-white/20"
              />
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white block leading-none">
                  Shop<span className="text-[#D9A6AC]">Sync</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#D9A6AC]/90 font-medium">
                  Smart Retail. Beautiful Results.
                </span>
              </div>
            </div>
            <p className="text-xs text-[#E9DED5]/80 leading-relaxed max-w-sm">
              An AI-guided beauty atelier merging dermatological biochemistry with retail technology. Consciously formulated, shade-inclusive, and allergen-screened.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2 max-w-md">
              <label htmlFor="footer-newsletter" className="block text-[11px] uppercase tracking-wider font-semibold text-[#D9A6AC] mb-2">
                Join the Private Circle (15% Off First Order)
              </label>
              <div className="flex gap-2">
                <input
                  id="footer-newsletter"
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-[#3B1E2F]/60 border border-[#524B4F] rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#D9A6AC]"
                />
                <button
                  type="submit"
                  className="bg-[#D9A6AC] hover:bg-[#F2D8DC] text-[#282426] px-4 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1"
                >
                  {subscribed ? <Check className="w-4 h-4 text-emerald-800" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-[#D9A6AC] mt-2 font-medium">
                  Welcome to the circle! Use code SHOPSYNC15 at checkout.
                </p>
              )}
            </form>
          </div>

          {/* Shop Categories */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-[#E9DED5]/70">
              <li><Link to="/category/skincare" className="hover:text-[#D9A6AC] transition-colors">Skincare Elixirs</Link></li>
              <li><Link to="/category/face-makeup" className="hover:text-[#D9A6AC] transition-colors">Luminous Foundations</Link></li>
              <li><Link to="/category/lip-makeup" className="hover:text-[#D9A6AC] transition-colors">Velvet Lipsticks</Link></li>
              <li><Link to="/category/eye-makeup" className="hover:text-[#D9A6AC] transition-colors">Pigmented Palettes</Link></li>
              <li><Link to="/category/sunscreen" className="hover:text-[#D9A6AC] transition-colors">Mineral Invisible SPF</Link></li>
              <li><Link to="/category/haircare" className="hover:text-[#D9A6AC] transition-colors">Molecular Haircare</Link></li>
            </ul>
          </div>

          {/* AI Tech & Safety */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              AI Beauty Tech
            </h5>
            <ul className="space-y-2.5 text-xs text-[#E9DED5]/70">
              <li><Link to="/ai-skin-analysis" className="hover:text-[#D9A6AC] transition-colors">AI Skin Diagnostics</Link></li>
              <li><Link to="/ai-recommendations" className="hover:text-[#D9A6AC] transition-colors">Smart Formulations</Link></li>
              <li><Link to="/skinsafe" className="hover:text-[#D9A6AC] transition-colors">SkinSafe Ingredient Checker</Link></li>
              <li><Link to="/feedback" className="hover:text-[#D9A6AC] transition-colors">Customer Feedback</Link></li>
              <li><Link to="/reviews" className="hover:text-[#D9A6AC] transition-colors">Verified Lab Reviews</Link></li>
            </ul>
          </div>

          {/* Retail & Admin */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Retail Platform
            </h5>
            <ul className="space-y-2.5 text-xs text-[#E9DED5]/70">
              <li><Link to="/pos" className="hover:text-[#D9A6AC] transition-colors">In-Store Smart POS</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-[#D9A6AC] transition-colors">Admin Management</Link></li>
              <li><Link to="/orders" className="hover:text-[#D9A6AC] transition-colors">Order Tracking</Link></li>
              <li><Link to="/profile" className="hover:text-[#D9A6AC] transition-colors">Loyalty Rewards</Link></li>
              <li><Link to="/saved-addresses" className="hover:text-[#D9A6AC] transition-colors">Shipping Addresses</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#524B4F]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#827A7F]">
          <p>© {new Date().getFullYear()} ShopSync Technologies Inc. All formulas patented & ethically crafted.</p>
          <div className="flex items-center space-x-6">
            <span>Clean Beauty Certified</span>
            <span>•</span>
            <span>Cruelty-Free International</span>
            <span>•</span>
            <span>ISO 22716 GMP Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default CustomerFooter
