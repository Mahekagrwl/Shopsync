import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ShieldCheck, Truck, ArrowRight, Check, MapPin, Phone, Mail, Award } from 'lucide-react'

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
    <footer id="footer-contact" className="w-full bg-[#352137] text-[#FFF9F5] pt-16 pb-12 mt-20 border-t border-[#F4C6D5]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-[#F4C6D5]/20">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#542B43] text-[#F4C6D5] shrink-0 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-white">SkinSafe™ Verification</h4>
              <p className="text-xs text-[#FFF9F5]/80 mt-0.5">Every cosmetic ingredient screened against allergens & harsh irritants.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#542B43] text-[#F4C6D5] shrink-0 shadow-sm">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-white">100% Authentic Indian Brands</h4>
              <p className="text-xs text-[#FFF9F5]/80 mt-0.5">Lakmé, Maybelline, L'Oréal, Minimalist, Plum, Dot & Key, SUGAR & more.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#542B43] text-[#F4C6D5] shrink-0 shadow-sm">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-white">Express Pan-India Delivery</h4>
              <p className="text-xs text-[#FFF9F5]/80 mt-0.5">Free delivery across 28,000+ PIN codes on all orders over ₹499.</p>
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
                alt="SHOPSYNC"
                className="h-10 w-10 rounded-xl object-cover shadow-md border border-white/20"
              />
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white block leading-none">
                  SHOP<span className="text-[#D985A5]">SYNC</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#F4C6D5]/90 font-medium">
                  Smart Beauty. Smarter Business.
                </span>
              </div>
            </div>
            <p className="text-xs text-[#FFF9F5]/80 leading-relaxed max-w-sm">
              India's premier beauty shopping & AI retail ecosystem. Empowering customers with safe, personalized formulations and equipping salon & beauty store owners with intelligent POS, inventory & customer care.
            </p>

            <div className="space-y-1.5 text-xs text-[#F4C6D5] pt-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-300" />
                <span>Flagship: Alkapuri, Vadodara, Gujarat 390007</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-rose-300" />
                <span>India Helpline: +91 98251 74677 (Mon-Sat, 9AM-8PM IST)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-rose-300" />
                <span>GSTIN: 24AAACS9182K1ZU • concierge@shopsync.in</span>
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="pt-2 max-w-md">
              <label htmlFor="footer-newsletter" className="block text-[11px] uppercase tracking-wider font-semibold text-[#F4C6D5] mb-2">
                Join the Beauty Circle (15% Off Code: SHOPSYNC15)
              </label>
              <div className="flex gap-2">
                <input
                  id="footer-newsletter"
                  type="email"
                  required
                  placeholder="Enter your email for festive deals"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-[#261628] border border-[#F4C6D5]/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#D985A5]"
                />
                <button
                  type="submit"
                  className="bg-[#D985A5] hover:bg-[#F4C6D5] text-[#352137] px-4 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {subscribed ? <Check className="w-4 h-4 text-emerald-800" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-[#F4C6D5] mt-2 font-medium">
                  Welcome! Use coupon code SHOPSYNC15 at checkout for 15% off.
                </p>
              )}
            </form>
          </div>

          {/* Shop Collections */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Categories
            </h5>
            <ul className="space-y-2.5 text-xs text-[#FFF9F5]/70">
              <li><Link to="/category/makeup" className="hover:text-[#F4C6D5] transition-colors">Makeup (Lakmé, Maybelline)</Link></li>
              <li><Link to="/category/skincare" className="hover:text-[#F4C6D5] transition-colors">Skincare (Minimalist, L’Oréal)</Link></li>
              <li><Link to="/category/haircare" className="hover:text-[#F4C6D5] transition-colors">Haircare (Mamaearth)</Link></li>
              <li><Link to="/category/fragrance" className="hover:text-[#F4C6D5] transition-colors">Royal Oud & Fragrances</Link></li>
              <li><Link to="/category/bodycare" className="hover:text-[#F4C6D5] transition-colors">Bodycare & Butters</Link></li>
              <li><Link to="/category/accessories" className="hover:text-[#F4C6D5] transition-colors">Beauty Tools & Blenders</Link></li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Customer Care
            </h5>
            <ul className="space-y-2.5 text-xs text-[#FFF9F5]/70">
              <li><a href="/#about" className="hover:text-[#F4C6D5] transition-colors">About SHOPSYNC</a></li>
              <li><Link to="/feedback" className="hover:text-[#F4C6D5] transition-colors">Report Product Reaction</Link></li>
              <li><Link to="/order-tracking" className="hover:text-[#F4C6D5] transition-colors">Track Orders (Blue Dart / Delhivery)</Link></li>
              <li><Link to="/saved-addresses" className="hover:text-[#F4C6D5] transition-colors">Pan-India Addresses</Link></li>
              <li><Link to="/skinsafe" className="hover:text-[#F4C6D5] transition-colors">SkinSafe™ Allergen Screening</Link></li>
              <li><Link to="/ai-skin-analysis" className="hover:text-[#F4C6D5] transition-colors">AI Face Scan & Diagnostic</Link></li>
            </ul>
          </div>

          {/* Owner & Platform */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Owner Experience
            </h5>
            <ul className="space-y-2.5 text-xs text-[#FFF9F5]/70">
              <li><Link to="/admin/pos-billing" className="hover:text-[#F4C6D5] transition-colors">Smart POS Barcode Register</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-[#F4C6D5] transition-colors">Owner Operations Command</Link></li>
              <li><Link to="/admin/feedback" className="hover:text-[#F4C6D5] transition-colors">Customer Incident Reports</Link></li>
              <li><Link to="/admin/inventory" className="hover:text-[#F4C6D5] transition-colors">Live Stock & Batch Expiry</Link></li>
              <li><Link to="/admin/demand-forecasting" className="hover:text-[#F4C6D5] transition-colors">AI Sales & Demand Prediction</Link></li>
              <li><Link to="/admin/login" className="hover:text-[#F4C6D5] transition-colors">Store Owner Portal Login</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with Social & Indian Regulatory Compliance */}
        <div className="pt-8 border-t border-[#F4C6D5]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#F4C6D5]/70">
          <p>© {new Date().getFullYear()} SHOPSYNC Technologies Pvt. Ltd. Crafted with precision for India's beauty retailers & shoppers.</p>
          <div className="flex items-center space-x-6">
            <span className="text-[#F4C6D5]">Prices in Indian Rupees (₹)</span>
            <span>•</span>
            <span className="text-[#F4C6D5]">GST Compliant</span>
            <span>•</span>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <span>•</span>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default CustomerFooter
