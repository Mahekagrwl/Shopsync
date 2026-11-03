import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * ProtectedRoute
 * Strict role-based route guard:
 * 1. Unauthenticated visitors are redirected to the appropriate login page:
 *    - Admin / Seller routes -> /seller/login?redirect=...
 *    - Customer protected routes -> /login?redirect=...
 * 2. Authenticated role enforcement:
 *    - Customer opening seller/POS routes -> redirected to customer experience (/shop)
 *    - Store Owner / Seller opening customer-only routes (e.g. AI Studio, Cart, Wishlist) -> redirected to /admin/dashboard
 * 3. Role strictly derived from verified session token/user profile.
 */
export function ProtectedRoute({ allowedRoles = [], children }) {
  const { isAuthenticated, user, role } = useAuth()
  const location = useLocation()

  // 1. Unauthenticated visitors are redirected to the correct login page
  if (!isAuthenticated || !user) {
    const destination = encodeURIComponent(location.pathname + location.search)
    const isSellerTarget = location.pathname.startsWith('/admin') || location.pathname.startsWith('/seller')
    const targetLogin = isSellerTarget ? `/seller/login?redirect=${destination}` : `/login?redirect=${destination}`
    return <Navigate to={targetLogin} replace state={{ from: location }} />
  }

  // 2. Strict Role Verification
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Customer opening a seller/POS route -> redirect to customer storefront / dashboard
    if (role === 'customer' && (allowedRoles.includes('seller') || allowedRoles.includes('admin'))) {
      return <Navigate to="/shop" replace />
    }

    // Store Owner / Seller opening a customer-only route (AI Studio, Cart, Checkout, Wishlist) -> redirect to seller dashboard
    if ((role === 'seller' || role === 'admin') && allowedRoles.includes('customer')) {
      return <Navigate to="/admin/dashboard" replace />
    }

    // Default safety fallback
    return <Navigate to="/" replace />
  }

  return children ? children : null
}

export default ProtectedRoute
