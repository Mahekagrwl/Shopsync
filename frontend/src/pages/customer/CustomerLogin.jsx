import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Check, Sparkles, Store, ShoppingBag } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AnimatedBackground from '../../components/common/AnimatedBackground'

export function CustomerLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginAsDemo } = useAuth()

  // Get intended redirect destination if redirected from ProtectedRoute
  const searchParams = new URLSearchParams(location.search)
  const redirectParam = searchParams.get('redirect')
  const from = redirectParam ? decodeURIComponent(redirectParam) : (location.state?.from?.pathname || null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Form validations
    if (!email.trim() || !password) {
      setError('Please provide both your registered email address and password.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address format (e.g., name@example.com).')
      return
    }

    setLoading(true)

    try {
      const res = await login(email.trim(), password, rememberMe)
      setLoading(false)

      const userRole = res?.user?.role || 'customer'

      // Role-Based Redirect
      if (userRole === 'seller' || userRole === 'admin') {
        const dest = from && from.startsWith('/admin') ? from : '/admin/dashboard'
        navigate(dest, { replace: true })
      } else {
        // Customer
        const dest = from && !from.startsWith('/admin') ? from : '/shop'
        navigate(dest, { replace: true })
      }
    } catch (err) {
      setLoading(false)
      setError(err?.message || 'Invalid email or password. Please verify your credentials.')
    }
  }

  // Quick Demo Account Trigger
  const handleQuickDemo = (role) => {
    const user = loginAsDemo(role)
    if (user.role === 'seller' || user.role === 'admin') {
      const dest = from && from.startsWith('/admin') ? from : '/admin/dashboard'
      navigate(dest, { replace: true })
    } else {
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
              Sign in to your ShopSync account to continue your beauty journey.
            </p>
          </div>
        </div>

        {/* Demo One-Click Login Pills */}
        <div className="bg-[#FFF9F5] border border-[#F4C6D5] rounded-2xl p-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#352137]">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D985A5]" /> Quick Demo Logins:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-[#F4C6D5] text-[11px] font-semibold text-[#352137] hover:bg-[#F4C6D5]/30 hover:border-[#D985A5] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ShoppingBag className="w-3 h-3 text-[#D985A5]" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('seller')}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-[#F4C6D5] text-[11px] font-semibold text-[#352137] hover:bg-[#F4C6D5]/30 hover:border-[#D985A5] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Store className="w-3 h-3 text-[#C58A78]" />
              <span>Seller Demo</span>
            </button>
          </div>
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
          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#352137] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
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
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative py-2 flex items-center justify-center">
            <div className="border-t border-[#F4C6D5] w-full" />
            <span className="bg-white px-3 text-[10px] text-stone-400 uppercase tracking-wider absolute">
              or
            </span>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] hover:bg-stone-100 active:scale-98 text-[#352137] font-semibold text-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>

        {/* Bottom Link: "Don't have an account? Sign Up" */}
        <div className="pt-4 border-t border-[#F4C6D5] text-center text-xs text-stone-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-[#352137] hover:underline">
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default CustomerLogin
