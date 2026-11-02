import React from 'react'
import { Navigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ShieldAlert, Sparkles, LayoutDashboard, ShoppingBag } from 'lucide-react'

/**
 * ProtectedRoute
 * Enforces role-based route access:
 * - Unauthenticated visitors are redirected to /login with return destination.
 * - Customers cannot access Owner / Seller pages.
 * - Store Owners cannot access Customer-only pages (e.g. AI Studio, Customer Checkout).
 */
export function ProtectedRoute({ allowedRoles = [], children }) {
  const { isAuthenticated, user, role } = useAuth()
  const location = useLocation()

  // 1. Unauthenticated visitors are redirected to Login with redirect parameter
  if (!isAuthenticated || !user) {
    const destination = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirect=${destination}`} replace state={{ from: location }} />
  }

  // 2. Role verification
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // If a Customer attempts to access Store Owner / Admin routes
    if (role === 'customer' && (allowedRoles.includes('seller') || allowedRoles.includes('admin'))) {
      return (
        <div className="min-h-[75vh] flex items-center justify-center p-4 bg-[#FFF9F5]">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#F4C6D5] p-8 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#D985A5] flex items-center justify-center mx-auto border border-[#F4C6D5]">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#352137]">
              Store Owner Access Required
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Your account is registered as a <span className="font-bold text-[#352137]">Customer</span>.
              Access to inventory, POS billing register, and store analytics requires authenticated <span className="font-bold text-[#D985A5]">Store Owner</span> credentials.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
              <Link
                to="/shop"
                className="bg-[#352137] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#542B43] transition-colors flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" /> Return to Shop
              </Link>
            </div>
          </div>
        </div>
      )
    }

    // If a Store Owner attempts to access Customer-only pages (e.g. AI Studio, Customer Checkout)
    if ((role === 'seller' || role === 'admin') && allowedRoles.includes('customer')) {
      const isAIStudio = location.pathname.includes('ai-') || location.pathname.includes('skinsafe')
      return (
        <div className="min-h-[75vh] flex items-center justify-center p-4 bg-[#FFF9F5]">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#F4C6D5] p-8 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#C58A78] flex items-center justify-center mx-auto border border-[#F4C6D5]">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#352137]">
              {isAIStudio ? 'AI Studio Restricted' : 'Customer Account Required'}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              {isAIStudio
                ? 'AI Studio face scanning and skin analysis are available exclusively to authenticated Customer accounts.'
                : 'This shopping feature is restricted to Customer profiles. Store Owners must manage operations via the Owner Dashboard.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
              <Link
                to="/admin/dashboard"
                className="bg-[#352137] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#542B43] transition-colors flex items-center justify-center gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4" /> Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )
    }

    // Default fallback
    return <Navigate to="/" replace />
  }

  return children ? children : null
}

export default ProtectedRoute
