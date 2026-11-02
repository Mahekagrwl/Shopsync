import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Check, Sparkles, Store, ShoppingBag, Phone, UserPlus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import AnimatedBackground from '../../components/common/AnimatedBackground'

export function CustomerLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginAsDemo } = useAuth()
  const { addToCart } = useCart()

  // Get intended redirect destination if redirected from ProtectedRoute
  const searchParams = new URLSearchParams(location.search)
  const redirectParam = searchParams.get('redirect')
  const from = redirectParam ? decodeURIComponent(redirectParam) : (location.state?.from?.pathname || null)
  const intentParam = searchParams.get('intent')

  // Login Mode: 'customer' vs 'owner'
  const [loginMode, setLoginMode] = useState(from && from.startsWith('/admin') ? 'owner' : 'customer')

  // Authentication Fields (supports Email or Mobile Phone)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Resume shopping action if user had clicked Add to Cart / Buy Now before login
  const resumePendingShoppingIntent = () => {
    const pendingRaw = localStorage.getItem('shopsync_pending_intent')
    if (pendingRaw) {
      try {
        const intent = JSON.parse(pendingRaw)
        if (intent.product) {
          addToCart(intent.product, intent.variant, intent.quantity || 1)
        }
        localStorage.removeItem('shopsync_pending_intent')
        if (intent.action === 'buy_now') {
          return '/checkout'
        }
        if (intent.action === 'add_to_cart') {
          return '/cart'
        }
      } catch {
        localStorage.removeItem('shopsync_pending_intent')
      }
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!identifier.trim() || !password) {
      setError('Please provide your registered email/phone number and password.')
      return
    }

    setLoading(true)

    try {
      // Normalize identifier (if phone number provided, convert or format)
      let emailToSubmit = identifier.trim().toLowerCase()
      const isPhoneOnly = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(identifier.trim())
      if (isPhoneOnly) {
        // Map phone to user credential
        emailToSubmit = loginMode === 'owner' ? 'seller@shopsync.in' : 'ananya.sharma@shopsync.in'
      }

      const res = await login(emailToSubmit, password, rememberMe)
      setLoading(false)

      const userRole = res?.user?.role || (loginMode === 'owner' ? 'seller' : 'customer')

      // Role-Based Navigation
      if (userRole === 'seller' || userRole === 'admin') {
        const dest = from && from.startsWith('/admin') ? from : '/admin/dashboard'
        navigate(dest, { replace: true })
      } else {
        // Customer login: check if pending cart/buy-now intent was waiting
        const resumeUrl = resumePendingShoppingIntent()
        if (resumeUrl) {
          navigate(resumeUrl, { replace: true })
          return
        }

        const dest = from && !from.startsWith('/admin') ? from : '/shop'
        navigate(dest, { replace: true })
      }
    } catch (err) {
      setLoading(false)
      setError(err?.message || 'Invalid credentials. Please verify your login details.')
    }
  }

  // Quick Demo Account Trigger
  const handleQuickDemo = (role) => {
    const user = loginAsDemo(role)
    if (user.role === 'seller' || user.role === 'admin') {
      const dest = from && from.startsWith('/admin') ? from : '/admin/dashboard'
      navigate(dest, { replace: true })
    } else {
      const resumeUrl = resumePendingShoppingIntent()
      if (resumeUrl) {
        navigate(resumeUrl, { replace: true })
        return
      }
      const dest = from && !from.startsWith('/admin') ? from : '/shop'
      navigate(dest, { replace: true })
    }
  }

  const handleGoogleLogin = () => {
    setError('Google OAuth provider is ready in production. Please sign in with your email and password.')
  }

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-16 overflow-hidden bg-[#FFF9F5]">
      {/* Subtle Animated Background */}
      <AnimatedBackground variant="auth" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl border border-[#F4C6D5] p-8 sm:p-10 shadow-2xl space-y-6 relative z-10"
      >
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2.5">
          <Link to="/" className="inline-block transition-transform hover:scale-105">
            <img
              src="/logo.jpg"
              alt="ShopSync Logo"
              className="h-16 w-16 rounded-2xl object-cover mx-auto shadow-md border border-[#F4C6D5]"
            />
          </Link>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#352137]">
              Welcome Back!
            </h1>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              {intentParam === 'buy_now'
                ? 'Sign in to complete your purchase instantly.'
                : intentParam === 'add_to_cart'
                ? 'Sign in to save your selection to your shopping bag.'
                : 'Sign in to access your ShopSync beauty experience.'}
            </p>
          </div>
        </div>

        {/* 1. Customer vs Store Owner Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#FFF9F5] border border-[#F4C6D5] text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => {
              setLoginMode('customer')
              setError('')
            }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              loginMode === 'customer'
                ? 'bg-[#352137] text-white shadow-sm'
                : 'text-stone-600 hover:text-[#352137]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#F4C6D5]" />
            <span>Customer Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMode('owner')
              setError('')
            }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              loginMode === 'owner'
                ? 'bg-[#352137] text-white shadow-sm'
                : 'text-stone-600 hover:text-[#352137]'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-amber-300" />
            <span>Store Owner</span>
          </button>
        </div>

        {/* Demo Fast Fill Pill */}
        <div className="bg-[#FFF9F5] border border-[#F4C6D5]/60 rounded-2xl p-2.5 flex items-center justify-between text-[11px]">
          <span className="text-stone-600 font-medium">Quick One-Click Demo:</span>
          {loginMode === 'customer' ? (
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#F4C6D5] text-[11px] font-bold text-[#352137] hover:bg-[#F4C6D5]/40 transition-colors cursor-pointer shadow-2xs"
            >
              Fill Ananya (Customer)
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleQuickDemo('seller')}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#F4C6D5] text-[11px] font-bold text-[#352137] hover:bg-[#F4C6D5]/40 transition-colors cursor-pointer shadow-2xs"
            >
              Fill Rohan (Store Owner)
            </button>
          )}
        </div>

        {/* Error Notice */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Email or Phone Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#352137] mb-1.5">
              {loginMode === 'owner' ? 'Owner Email or Phone' : 'Email Address or Phone'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={loginMode === 'owner' ? 'seller@shopsync.in or +91 98251 74677' : 'name@example.com or +91 98251 45890'}
                className="w-full rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] px-4 py-3 pl-10 text-xs text-[#282426] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#352137] focus:border-transparent transition-all"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Password with Show / Hide Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#352137]">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-[#D985A5] hover:underline font-semibold">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] px-4 py-3 pl-10 pr-10 text-xs text-[#282426] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#352137] focus:border-transparent transition-all"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-700 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Option */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#352137]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded text-[#352137] focus:ring-[#352137] border-[#F4C6D5]"
              />
              <span className="font-medium">Remember Me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#352137] hover:bg-[#542B43] active:scale-98 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing In...
              </span>
            ) : (
              <>
                <span>Sign In as {loginMode === 'owner' ? 'Store Owner' : 'Customer'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Create New Account vs Already Have Account */}
        <div className="pt-4 border-t border-[#F4C6D5] flex items-center justify-between text-xs text-stone-600">
          <span>New to ShopSync?</span>
          <Link to="/signup" className="font-bold text-[#352137] hover:underline flex items-center gap-1">
            <UserPlus className="w-3.5 h-3.5 text-[#D985A5]" /> Create New Account
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default CustomerLogin
