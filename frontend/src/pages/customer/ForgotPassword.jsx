import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setSubmitted(true)
      }, 600)
    }
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
            Reset Your Password
          </h1>
          <p className="text-xs text-[#827A7F]">
            Enter your account email to receive a secure recovery link
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4 text-center p-6 bg-[#F8F3EE] rounded-2xl border border-[#D9A6AC]">
            <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
            <h3 className="font-serif font-bold text-base text-[#282426]">
              Recovery Email Dispatched
            </h3>
            <p className="text-xs text-[#524B4F] leading-relaxed">
              If an account is associated with <span className="font-semibold text-[#542B43]">{email}</span>, you will receive password reset instructions shortly.
            </p>
            <Link
              to="/login"
              className="inline-block mt-2 text-xs font-semibold text-[#542B43] hover:underline"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#524B4F] mb-1.5">
                Registered Email Address
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#542B43] hover:bg-[#3B1E2F] text-white py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Sending Instructions...' : 'Send Recovery Link'}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[#E9DED5] text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-[#542B43] hover:underline font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
