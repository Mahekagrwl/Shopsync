import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Sparkles, Home } from 'lucide-react'

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 text-stone-700 mb-6">
        <Sparkles className="h-8 w-8 text-rose-600" />
      </div>
      <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">404 - Page Not Found</h1>
      <p className="text-sm text-stone-500 max-w-md mb-6">
        The route you are looking for does not exist in ShopSync. Return to the storefront home or access the POS terminal.
      </p>
      <div className="flex gap-3">
        <Link to="/">
          <Button variant="primary" icon={Home}>
            Back to Storefront
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
