import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, Check, ShoppingBag, Store, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AnimatedBackground from '../../components/common/AnimatedBackground'

export function CustomerSignup() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('customer') // 'customer' or 'seller' only
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-stone-200' }
    let score = 0
    if (pass.length >= 8) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[0-9]/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' }
    if (score === 2 || score === 3) return { score: 70, label: 'Moderate', color: 'bg-amber-500', text: 'text-amber-600' }
    return { score: 100, label: 'Strong', color: 'bg-emerald-600', text: 'text-emerald-700' }
  }

  const pwdStrength = getPasswordStrength(password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Form validations
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all required registration fields.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address (e.g., name@example.com).')
      return
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password confirmation.')
      return
    }

    if (!agreeTerms) {
      setError('Please review and accept the ShopSync Terms & Conditions to create an account.')
      return
    }

    // Strictly ensure role cannot be privileged admin
    const safeRole = role === 'seller' ? 'seller' : 'customer'

    setLoading(true)

    try {
      const res = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role: safeRole
      })
      setLoading(false)

      // Role-Based Navigation
      if (res?.user?.role === 'seller') {
        navigate('/admin/dashboard', { replace: true })
      } else {
        navigate('/shop', { replace: true })
      }
    } catch (err) {
      setLoading(false)
      setError(err?.message || 'Unable to register account. Please check your information.')
    }
  }

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-16 overflow-hidden bg-[#FFF9F5]">
      {/* Subtle Animated Background */}
      <AnimatedBackground variant="auth" />

      {/* Sign Up Card */}
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
              Create Your Account
            </h1>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Join ShopSync to experience smart Indian beauty & retail.
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Role Selection (Customer or Seller) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#352137] mb-2">
              Select Your Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Customer Option */}
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  role === 'customer'
                    ? 'border-[#352137] bg-[#FFF9F5] shadow-xs ring-2 ring-[#352137]/10'
                    : 'border-[#F4C6D5] bg-white hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-xl ${role === 'customer' ? 'bg-[#352137] text-white' : 'bg-stone-100 text-stone-600'}`}>
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  {role === 'customer' && <Check className="w-4 h-4 text-[#352137]" />}
                </div>
                <div className="mt-2">
                  <p className="font-serif font-bold text-xs text-[#352137]">Customer</p>
                  <p className="text-[10px] text-stone-500 leading-tight mt-0.5">Shop beauty & routines</p>
                </div>
              </button>

              {/* Seller Option */}
              <button
                type="button"
                onClick={() => setRole('seller')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  role === 'seller'
                    ? 'border-[#352137] bg-[#FFF9F5] shadow-xs ring-2 ring-[#352137]/10'
                    : 'border-[#F4C6D5] bg-white hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-xl ${role === 'seller' ? 'bg-[#352137] text-white' : 'bg-stone-100 text-stone-600'}`}>
                    <Store className="w-4 h-4" />
                  </div>
                  {role === 'seller' && <Check className="w-4 h-4 text-[#352137]" />}
                </div>
                <div className="mt-2">
                  <p className="font-serif font-bold text-xs text-[#352137]">Seller</p>
                  <p className="text-[10px] text-stone-500 leading-tight mt-0.5">POS, stock & products</p>
                </div>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#352137] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Ananya Sharma"
                className="w-full rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] px-4 py-3 pl-10 text-xs text-[#282426] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#352137] focus:border-transparent transition-all"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

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
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#352137] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
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

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-stone-400">Password strength:</span>
                  <span className={`font-bold ${pwdStrength.text}`}>{pwdStrength.label}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${pwdStrength.color}`}
                    style={{ width: `${pwdStrength.score}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password with Show / Hide Toggle */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#352137] mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] px-4 py-3 pl-10 pr-10 text-xs text-[#282426] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#352137] focus:border-transparent transition-all"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-700 cursor-pointer"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-[10px] text-rose-600 mt-1">Passwords do not match.</p>
            )}
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#352137] leading-tight">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-[#352137] focus:ring-[#352137] border-[#F4C6D5]"
              />
              <span>
                I agree to the{' '}
                <span className="text-[#352137] underline font-semibold">
                  Terms & Conditions
                </span>{' '}
                and{' '}
                <span className="text-[#352137] underline font-semibold">
                  Privacy Policy
                </span>
                .
              </span>
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
                Creating {role === 'seller' ? 'Seller' : 'Customer'} Account...
              </span>
            ) : (
              <>
                <span>Create {role === 'seller' ? 'Seller' : 'Customer'} Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Link: "Existing account? Login" */}
        <div className="pt-4 border-t border-[#F4C6D5] text-center text-xs text-stone-600">
          Existing account?{' '}
          <Link to="/login" className="font-bold text-[#352137] hover:underline">
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default CustomerSignup
