import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles, ShoppingBag, Store, ShieldCheck, Layers } from 'lucide-react'
import { Badge } from '../common/Badge'

export function Navbar() {
  const location = useLocation()
  const isPos = location.pathname.startsWith('/pos')

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-900 text-amber-300 transition-transform group-hover:scale-105 shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-stone-950">
                Shop<span className="text-rose-600">Sync</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-widest text-stone-400 font-semibold">
                Beauty & Retail POS
              </span>
            </div>
          </Link>

          {/* Navigation Pill */}
          <nav className="flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-medium">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                !isPos
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5 text-rose-600" />
              <span>Storefront</span>
            </Link>
            <Link
              to="/pos"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                isPos
                  ? 'bg-stone-900 text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Store className="h-3.5 w-3.5 text-amber-400" />
              <span>Smart POS</span>
            </Link>
          </nav>
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-3">
          <Badge variant="rose" className="hidden md:inline-flex">
            <Layers className="h-3 w-3 mr-1" />
            FastAPI + Supabase Ready
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-stone-500 bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-md">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono">v0.1.0</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
