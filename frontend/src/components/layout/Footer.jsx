import React from 'react'
import { Sparkles, Database, Server, Smartphone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full border-t border-stone-200 bg-white py-8 text-stone-600 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-stone-900 text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-stone-800">ShopSync Platform Architecture</span>
            <span className="text-stone-400">•</span>
            <span>Beauty E-Commerce & In-Store Smart POS</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-stone-500 font-mono text-[11px]">
            <span className="flex items-center gap-1">
              <Smartphone className="h-3 w-3 text-sky-600" /> React 19 + Tailwind
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1">
              <Server className="h-3 w-3 text-emerald-600" /> Python FastAPI
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1">
              <Database className="h-3 w-3 text-rose-600" /> Supabase PostgreSQL
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-stone-400 text-[11px]">
          <p>© {new Date().getFullYear()} ShopSync. Clean modular foundation.</p>
          <p>Ready for API service layer & database synchronization.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
