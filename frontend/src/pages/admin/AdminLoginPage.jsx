import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { loginAdmin } = useAuth()

  const [username, setUsername] = useState('victoria@shopsyncbeauty.com')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    if (!username || !password) {
      setError('Please provide administrative username and credentials.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      loginAdmin(username, password)
      setLoading(false)
      navigate('/admin/dashboard')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-[#282426] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1F1C1D] rounded-3xl border border-[#524B4F]/50 p-8 sm:p-10 text-white space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <img
            src="/logo.jpg"
            alt="ShopSync Logo"
            className="h-16 w-16 rounded-2xl object-cover mx-auto shadow-xl border border-[#542B43]"
          />
          <h1 className="font-serif text-2xl font-bold tracking-tight">
            ShopSync Enterprise Console
          </h1>
          <p className="text-xs text-[#827A7F]">
            Boutique POS Operations & Laboratory Formulation Master
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase tracking-wider font-semibold text-[#827A7F] mb-1.5">
              Operator Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-[#524B4F] bg-[#282426] p-3 pl-10 text-xs text-white focus:outline-none focus:border-[#D9A6AC]"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider font-semibold text-[#827A7F] mb-1.5">
              Access Token / Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#524B4F] bg-[#282426] p-3 pl-10 text-xs text-white focus:outline-none focus:border-[#D9A6AC]"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#282426] border border-[#524B4F]/40 text-[11px] text-[#827A7F] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Authorized terminal sessions are logged and audited for inventory depletion.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#542B43] hover:bg-[#6E3958] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating Station...' : 'Authenticate & Launch Console'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginPage
