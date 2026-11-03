import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Store, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, ShoppingBag, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginAsDemo } = useAuth()

  // Get intended redirect destination if redirected from ProtectedRoute
  const searchParams = new URLSearchParams(location.search)
  const redirectParam = searchParams.get('redirect')
  const from = redirectParam ? decodeURIComponent(redirectParam) : (location.state?.from?.pathname || null)

  const [username, setUsername] = useState('seller@shopsync.in')
  const [password, setPassword] = useState('Seller@ShopSync2026')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) {
      setError('Please provide store owner or administrative credentials.')
      return
    }

    setLoading(true)
    try {
      const res = await login(username.trim().toLowerCase(), password, rememberMe)
      setLoading(false)

      const authenticatedRole = res?.user?.role || 'seller'
      if (authenticatedRole === 'seller' || authenticatedRole === 'admin') {
        const dest = from && from.startsWith('/admin') ? from : '/admin/dashboard'
        navigate(dest, { replace: true })
      } else {
        // If a customer account attempts to log in via store owner login, redirect to customer store
        navigate('/shop', { replace: true })
      }
    } catch (err) {
      setLoading(false)
      setError(err?.message || 'Invalid store owner credentials. Please verify your email and password.')
    }
  }

  const handleDemoFill = (roleType) => {
    if (roleType === 'seller') {
      setUsername('seller@shopsync.in')
      setPassword('Seller@ShopSync2026')
    } else {
      setUsername('admin@shopsync.beauty')
      setPassword('Admin@ShopSync2026')
    }
    setError('')
  }

  const handleInstantDemoLogin = (roleType) => {
    const demoUser = loginAsDemo(roleType)
    if (demoUser.role === 'seller' || demoUser.role === 'admin') {
      const dest = from && from.startsWith('/admin') ? from : '/admin/dashboard'
      navigate(dest, { replace: true })
    } else {
      navigate('/shop', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-[#282426] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#542B43]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D9A6AC]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#1F1C1D] rounded-3xl border border-[#524B4F]/50 p-8 sm:p-10 text-white space-y-6 shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center space-y-2.5">
          <Link to="/" className="inline-block transition-transform hover:scale-105">
            <img
              src="/logo.jpg"
              alt="ShopSync Logo"
              className="h-16 w-16 rounded-2xl object-cover mx-auto shadow-xl border border-[#542B43]"
            />
          </Link>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#542B43]/60 border border-[#D9A6AC]/30 text-[#D9A6AC] text-[10px] font-bold uppercase tracking-wider mb-2">
              <Store className="w-3.5 h-3.5 text-amber-300" /> Store Owner Console
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Store Owner Login
            </h1>
            <p className="text-xs text-[#827A7F] mt-1 leading-relaxed">
              Boutique POS Operations, Central Inventory Depletion & Formulation Control
            </p>
          </div>
        </div>

        {/* Demo Fast-Fill Buttons */}
        <div className="p-2.5 rounded-2xl bg-[#282426] border border-[#524B4F]/40 flex items-center justify-between text-[11px]">
          <span className="text-[#827A7F] font-medium">Quick Credentials:</span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => handleDemoFill('seller')}
              className="px-2 py-1 rounded-lg bg-[#1F1C1D] border border-[#524B4F] text-[11px] font-bold text-amber-300 hover:bg-[#524B4F]/40 transition-colors cursor-pointer"
            >
              Rohan (Seller)
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="px-2 py-1 rounded-lg bg-[#1F1C1D] border border-[#524B4F] text-[11px] font-bold text-[#D9A6AC] hover:bg-[#524B4F]/40 transition-colors cursor-pointer"
            >
              Victoria (Admin)
            </button>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300 font-medium animate-in fade-in">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase tracking-wider font-semibold text-[#827A7F] mb-1.5">
              Store Owner Email / Phone
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="seller@shopsync.in"
                className="w-full rounded-xl border border-[#524B4F] bg-[#282426] p-3 pl-10 text-xs text-white focus:outline-none focus:border-[#D9A6AC] transition-colors"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider font-semibold text-[#827A7F] mb-1.5">
              Access Token / Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-[#524B4F] bg-[#282426] p-3 pl-10 pr-10 text-xs text-white focus:outline-none focus:border-[#D9A6AC] transition-colors"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-stone-400 hover:text-white cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Audit disclaimer */}
          <div className="p-3 rounded-xl bg-[#282426] border border-[#524B4F]/40 text-[11px] text-[#827A7F] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Authorized store sessions are audited for real-time POS stock depletion.</span>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#542B43] hover:bg-[#6E3958] active:scale-98 text-white py-3.5 rounded-xl font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating Station...
              </span>
            ) : (
              <>
                <span>Authenticate & Launch Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Link to Customer Login */}
        <div className="pt-4 border-t border-[#524B4F]/40 text-center">
          <Link
            to="/login"
            className="text-xs text-stone-400 hover:text-[#D9A6AC] font-semibold inline-flex items-center gap-1.5 transition-colors p-2 rounded-xl hover:bg-white/5"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#D9A6AC]" />
            <span>Looking for beauty shopping? Go to Customer Login →</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLoginPage
