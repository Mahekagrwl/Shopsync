import React from 'react'
import { Store, ScanBarcode, CreditCard, RefreshCw, Layers, ShieldCheck, Box, UserCheck } from 'lucide-react'
import { Card, CardHeader } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Link } from 'react-router-dom'

export function POSDashboard() {
  return (
    <div className="space-y-6">
      {/* POS Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-stone-900 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">ShopSync POS Terminal 01</h2>
              <Badge variant="success">Station Ready</Badge>
            </div>
            <p className="text-xs text-stone-400">Beauty Boutique Counter • Cashier Session Active</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="outline" size="sm" className="bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700">
              Return to Storefront
            </Button>
          </Link>
        </div>
      </div>

      {/* POS Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Terminal Mode</span>
            <Store className="h-4 w-4 text-stone-400" />
          </div>
          <p className="text-xl font-bold text-stone-900 mt-2">Retail POS</p>
          <p className="text-[11px] text-stone-400 mt-1">Ready for barcode scanner input</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Inventory Sync</span>
            <RefreshCw className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-emerald-700 mt-2">Omnichannel</p>
          <p className="text-[11px] text-stone-400 mt-1">Storefront & In-Store unified</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Payment Engine</span>
            <CreditCard className="h-4 w-4 text-rose-600" />
          </div>
          <p className="text-xl font-bold text-stone-900 mt-2">Multi-Tender</p>
          <p className="text-[11px] text-stone-400 mt-1">Cash, Card, QR, Gift Cards</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">FastAPI Service</span>
            <Layers className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-xl font-bold text-stone-900 mt-2">POS Endpoints</p>
          <p className="text-[11px] text-stone-400 mt-1">`/api/v1/pos/checkout` pipeline</p>
        </Card>
      </div>

      {/* POS Architecture Layout Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader
              title="POS Register Architecture"
              description="Visual layout blueprint for fast high-volume beauty checkout."
              action={<Badge variant="rose">POS Foundation</Badge>}
            />
            <div className="border border-dashed border-stone-300 rounded-lg p-8 text-center bg-stone-50/50 space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <ScanBarcode className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-semibold text-stone-800">Barcode & Item Grid Zone</h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                This zone is architected to house the interactive touch-screen product grid, SKU/Barcode scanner listener, and quick beauty category selectors (Skincare, Fragrance, Makeup, Haircare).
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Cart & Receipt Drawer"
              description="Real-time transaction panel"
            />
            <div className="border border-dashed border-stone-300 rounded-lg p-6 text-center bg-stone-50/50 space-y-3">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-stone-200 text-stone-700">
                <CreditCard className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-semibold text-stone-800">Register Transaction State</h4>
              <p className="text-[11px] text-stone-500">
                Customer lookup, dynamic tax calculations, and instant receipt printing ready.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default POSDashboard
