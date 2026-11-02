import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AnimatedBackground from '../../components/common/AnimatedBackground'

export function CustomerSignup() {
  const navigate = useNavigate()
  const { signupCustomer } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

    setLoading(true)

    try {
      await signupCustomer({ fullName: fullName.trim(), email: email.trim(), password })
      setLoading(false)
      navigate('/profile', { replace: true })
    } catch (err) {
      setLoading(false)
      setError(err?.message || 'Unable to register account. Please check your information.')
    }
  }

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* 5. Matching Animated Background */}
      <AnimatedBackground variant="auth" />

      {/* 5. Sign Up Card */}
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
              Create Your ShopSync Account
            </h1>
            <p className="text-xs text-[#827A7F] mt-1 leading-relaxed">
              Join ShopSync and discover a smarter shopping experience.
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
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#524B4F] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Camille Laurent"
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] px-4 py-3 pl-10 text-xs text-[#282426] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#542B43] focus:border-transparent transition-all"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

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
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#524B4F] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#524B4F] mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] px-4 py-3 pl-10 pr-10 text-xs text-[#282426] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#542B43] focus:border-transparent transition-all"
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
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#524B4F] leading-tight">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-[#542B43] focus:ring-[#542B43] border-[#E9DED5]"
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" className="text-[#542B43] underline font-semibold">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy-policy" className="text-[#542B43] underline font-semibold">
                  Privacy Policy
                </Link>
                .
              </span>
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
                Creating Account...
              </span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Link: "Existing account? Login" */}
        <div className="pt-4 border-t border-[#E9DED5] text-center text-xs text-[#827A7F]">
          Existing account?{' '}
          <Link to="/login" className="font-bold text-[#542B43] hover:underline">
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default CustomerSignup
