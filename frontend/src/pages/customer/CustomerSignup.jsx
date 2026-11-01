import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Mail, Lock, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function CustomerSignup() {
  const navigate = useNavigate()
  const { signupCustomer } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [agreedToSkinTerms, setAgreedToSkinTerms] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!fullName || !email || !password) {
      setError('Please provide your full name, email, and password.')
      return
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      signupCustomer({ fullName, email, phone })
      setLoading(false)
      navigate('/profile')
    }, 600)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E9DED5] p-8 sm:p-10 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <img
            src="/logo.jpg"
            alt="ShopSync Logo"
            className="h-16 w-16 rounded-2xl object-cover mx-auto shadow-md border border-[#E9DED5]"
          />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
            Join ShopSync Circle
          </h1>
          <p className="text-xs text-[#827A7F]">
            Unlock tailored AI skin analysis, allergen screening & 100 bonus loyalty points
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#524B4F] mb-1.5">
              Full Legal Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Camille Laurent"
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] px-4 py-2.5 pl-10 text-xs text-[#282426] focus:outline-none focus:ring-2 focus:ring-[#542B43]"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

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
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] px-4 py-2.5 pl-10 text-xs text-[#282426] focus:outline-none focus:ring-2 focus:ring-[#542B43]"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#524B4F] mb-1.5">
              Mobile Phone (For Order Notifications)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] px-4 py-2.5 pl-10 text-xs text-[#282426] focus:outline-none focus:ring-2 focus:ring-[#542B43]"
              />
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#524B4F] mb-1.5">
              Secure Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] px-4 py-2.5 pl-10 text-xs text-[#282426] focus:outline-none focus:ring-2 focus:ring-[#542B43]"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              id="skin-terms"
              type="checkbox"
              checked={agreedToSkinTerms}
              onChange={(e) => setAgreedToSkinTerms(e.target.checked)}
              className="mt-0.5 rounded text-[#542B43] focus:ring-[#542B43]"
            />
            <label htmlFor="skin-terms" className="text-[11px] text-[#524B4F] leading-tight">
              I agree to the SkinSafe Privacy Terms and acknowledge that AI skin recommendations do not constitute clinical medical diagnosis.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#542B43] hover:bg-[#3B1E2F] text-white py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Creating Member Profile...' : 'Complete Registration'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="pt-4 border-t border-[#E9DED5] text-center text-xs text-[#827A7F]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#542B43] hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CustomerSignup
