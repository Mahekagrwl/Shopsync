import React from 'react'
import { Sparkles, ShoppingBag, ShieldCheck, Database, ArrowRight, Layers, Tag, Heart } from 'lucide-react'
import { Card, CardHeader } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Link } from 'react-router-dom'

export function StorefrontHome() {
  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white p-8 md:p-12 shadow-md">
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <Badge variant="rose" className="bg-rose-950/80 text-rose-300 border-rose-800">
            <Sparkles className="h-3 w-3 mr-1" />
            ShopSync Foundation Initialized
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white">
            Beauty E-Commerce & Omnichannel Architecture
          </h1>
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            The foundation for ShopSync's high-performance digital beauty boutique is active.
            Built with modern React.js, clean modular components, and ready for FastAPI + Supabase integration.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/pos">
              <Button variant="gold" size="md" icon={Layers}>
                Switch to Smart POS Register
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Architecture Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-700 mb-4">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-stone-900">Beauty Product Catalog</h3>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed">
            Scalable data structures ready for luxury cosmetics, skincare, haircare variants, shade pickers, and real-time inventory levels.
          </p>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>Status: Schema Ready</span>
            <Badge variant="success">Modular</Badge>
          </div>
        </Card>

        <Card hover>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700 mb-4">
            <Tag className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-stone-900">Unified Cart & Promotions</h3>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed">
            State-driven shopping bag architecture supporting discounts, bundle pricing, and synchronized checkout across online and in-store.
          </p>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>Status: Ready for State</span>
            <Badge variant="info">Prepared</Badge>
          </div>
        </Card>

        <Card hover>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-stone-800 mb-4">
            <Database className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-stone-900">FastAPI & Supabase Pipeline</h3>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed">
            Prepared API service connectors with environment-based configuration for PostgreSQL tables, authentication, and inventory sync.
          </p>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>Status: Connected</span>
            <Badge variant="rose">Configured</Badge>
          </div>
        </Card>
      </div>

      {/* Architecture Checklist Card */}
      <Card>
        <CardHeader
          title="Foundation & Scalability Checklist"
          description="Verification of foundational requirements before feature implementations."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200/60">
            <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <div>
              <p className="font-semibold text-stone-800">React 19 + Vite + Tailwind</p>
              <p className="text-stone-500 mt-0.5">High-speed development runtime, responsive mobile-first typography and design tokens.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200/60">
            <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <div>
              <p className="font-semibold text-stone-800">React Router v7</p>
              <p className="text-stone-500 mt-0.5">Isolated route trees for Storefront consumer views and In-Store POS register views.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200/60">
            <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <div>
              <p className="font-semibold text-stone-800">Python FastAPI Backend Layout</p>
              <p className="text-stone-500 mt-0.5">Enterprise directory layout: api, core, models, schemas, services, and db.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200/60">
            <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <div>
              <p className="font-semibold text-stone-800">Supabase PostgreSQL Schema Ready</p>
              <p className="text-stone-500 mt-0.5">DDL migrations for unified products, inventory, orders, and POS transactions.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default StorefrontHome
