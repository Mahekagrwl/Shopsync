import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AnimatedBackground from '../../components/common/AnimatedBackground'

export function CustomerLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { loginCustomer, loginAdmin } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect destination after login
  const from = location.state?.from?.pathname || '/profile'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Form validation
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
      // Check if admin login is triggered from this portal
      if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('victoria@shopsyncbeauty.com')) {
        const res = await loginAdmin(email, password)
        setLoading(false)
        navigate('/admin/dashboard', { replace: true })
        return
      }

      // Customer login
      const res = await loginCustomer(email, password)
      setLoading(false)
      navigate(from, { replace: true })
    } catch (err) {
      setLoading(false)
      setError(err?.message || 'Invalid email or password. Please verify your credentials.')
    }
  }

  const handleGoogleLogin = () => {
    // Elegant toast / notice for Google Auth connection
    setError('Google OAuth provider is ready in production. Please sign in with your email and password.')
  }

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* 4.A Subtle Animated Background */}
      <AnimatedBackground variant="auth" />

      {/* 4.B Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl border border-[#E9DED5] p-8 sm:p-10 shadow-xl space-y-6 relative z-10"
      >
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2.5">
          <Link to="/" className="inline-block transition-transform hover:scale-105">
            <img
              src="/logo.jpg"
              alt="ShopSync Logo"
              className="h-16 w-16 rounded-2xl object-cover mx-auto shadow-md border border-[#E9DED5]"
            />
          </Link>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
              Welcome Back!
            </h1>
            <p className="text-xs text-[#827A7F] mt-1 leading-relaxed">
              Welcome back to ShopSync. Continue your shopping experience.
            </p>
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#524B4F] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="camille@example.com"
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] px-4 py-3 pl-10 text-xs text-[#282426] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#542B43] focus:border-transparent transition-all"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Password with Show / Hide Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#524B4F]">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-[#542B43] hover:underline font-semibold">
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
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] px-4 py-3 pl-10 pr-10 text-xs text-[#282426] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#542B43] focus:border-transparent transition-all"
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
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#524B4F]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded text-[#542B43] focus:ring-[#542B43] border-[#E9DED5]"
              />
              <span>Remember Me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#542B43] hover:bg-[#3B1E2F] active:scale-98 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
            <div className="border-t border-[#E9DED5] w-full" />
            <span className="bg-white px-3 text-[10px] text-stone-400 uppercase tracking-wider absolute">
              or
            </span>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 rounded-xl border border-[#E9DED5] bg-[#F8F3EE] hover:bg-[#E9DED5] active:scale-98 text-[#282426] font-semibold text-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
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
        <div className="pt-4 border-t border-[#E9DED5] text-center text-xs text-[#827A7F]">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-[#542B43] hover:underline">
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default CustomerLogin
