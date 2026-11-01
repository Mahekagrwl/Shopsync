import React, { useState } from 'react'
import { MessageSquare, Sparkles, CheckCircle2, Star, Send } from 'lucide-react'

export function CustomerFeedbackPage() {
  const [category, setCategory] = useState('In-Store Smart POS')
  const [rating, setRating] = useState(5)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message || !email) return

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setMessage('')
      setSubject('')
    }, 4000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#E9DED5] rounded-3xl p-8 sm:p-12 border border-[#D9A6AC]/60 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
          Customer Voice
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#282426]">
          Experience Feedback & Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-[#524B4F] max-w-xl">
          Help our cosmetic chemists, software engineers, and boutique attendants refine the ShopSync experience.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-2xl text-[#282426]">
            Feedback Transmitted to Atelier Team
          </h3>
          <p className="text-xs text-[#524B4F] max-w-md mx-auto leading-relaxed">
            Thank you for helping us elevate ShopSync. Our client care specialists review every submission within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-10 space-y-6 shadow-xs text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold uppercase text-[#524B4F] mb-1.5">
                Feedback Touchpoint *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs"
              >
                <option value="In-Store Smart POS">In-Store Smart POS Register</option>
                <option value="E-Commerce Ordering">Online Digital Boutique</option>
                <option value="AI Skin Analysis">AI Skin Diagnostic Accuracy</option>
                <option value="Formulation & Texture">Cosmetic Formulation Quality</option>
                <option value="Delivery & Packaging">Express Shipping & Packaging</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase text-[#524B4F] mb-1.5">
                Your Contact Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="camille@example.com"
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#524B4F] mb-1.5">
              Experience Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-stone-400 font-semibold pl-2">
                {rating} of 5 Stars
              </span>
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#524B4F] mb-1.5">
              Subject Headline
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Flawless shade matching at boutique POS counter"
              className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#524B4F] mb-1.5">
              Detailed Impressions & Suggestions *
            </label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you loved or how we can improve our formulation, shade range, or interface..."
              className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#542B43] hover:bg-[#3B1E2F] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" /> Transmit Client Feedback
          </button>
        </form>
      )}
    </div>
  )
}

export default CustomerFeedbackPage
