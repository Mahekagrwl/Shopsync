import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Mail, Lock, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function CustomerLogin() {
  const navigate = useNavigate()
  const { loginCustomer } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in both your email address and password.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      loginCustomer(email, password)
      setLoading(false)
      navigate('/profile')
    }, 600)
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E9DED5] p-8 sm:p-10 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <img
            src="/logo.jpg"
            alt="ShopSync Logo"
            className="h-16 w-16 rounded-2xl object-cover mx-auto shadow-md border border-[#E9DED5]"
          />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
            Welcome Back to ShopSync
          </h1>
          <p className="text-xs text-[#827A7F]">
            Sign in to access your saved formulations, loyalty points & orders
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#524B4F]">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-[#542B43] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] px-4 py-2.5 pl-10 text-xs text-[#282426] focus:outline-none focus:ring-2 focus:ring-[#542B43]"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#542B43] hover:bg-[#3B1E2F] text-white py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Account'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="pt-4 border-t border-[#E9DED5] text-center text-xs text-[#827A7F]">
          Don't have an account yet?{' '}
          <Link to="/signup" className="font-semibold text-[#542B43] hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CustomerLogin
