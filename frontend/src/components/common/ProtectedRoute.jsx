import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ShieldAlert, Lock, ArrowRight } from 'lucide-react'

/**
 * ProtectedRoute
 * Guards private routes based on authentication state and user roles ('customer', 'seller', 'admin').
 *
 * @param {Array<string>} allowedRoles - Array of roles permitted (e.g. ['customer'], ['seller', 'admin'])
 * @param {React.ReactNode} children - Optional nested elements
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
    // If a Customer attempts to access Seller / Owner routes
    if (role === 'customer' && (allowedRoles.includes('seller') || allowedRoles.includes('admin'))) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#FFF9F5]">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#F4C6D5] p-8 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#D985A5] flex items-center justify-center mx-auto border border-[#F4C6D5]">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#352137]">
              Seller Access Required
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Your account is registered as a <span className="font-bold text-[#352137]">Customer</span>.
              Access to inventory management, POS register, and store analytics requires a verified <span className="font-bold text-[#D985A5]">Seller Account</span>.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Navigate to="/shop" replace />
            </div>
          </div>
        </div>
      )
    }

    // If a Seller attempts to access Customer-restricted pages
    if ((role === 'seller' || role === 'admin') && allowedRoles.includes('customer')) {
      // Sellers can still view customer storefront pages, but checkout/personal profile defaults to seller dashboard if desired
      return <Navigate to="/admin/dashboard" replace />
    }

    // Default fallback
    return <Navigate to="/" replace />
  }

  return children ? children : null
}

export default ProtectedRoute
