import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, CheckCircle2, ThumbsUp, Sparkles, MessageSquare, Plus } from 'lucide-react'
import { MOCK_REVIEWS, BEAUTY_PRODUCTS } from '../../data/mockBeautyData'

export function ProductReviewsPage() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS)
  const [selectedRating, setSelectedRating] = useState('all')
  const [showReviewModal, setShowReviewModal] = useState(false)

  // Form states
  const [author, setAuthor] = useState('')
  const [productName, setProductName] = useState(BEAUTY_PRODUCTS[0].name)
  const [rating, setRating] = useState(5)
  const [shade, setShade] = useState('')
  const [comment, setComment] = useState('')
  const [submittedNotice, setSubmittedNotice] = useState(false)

  const handleAddReview = (e) => {
    e.preventDefault()
    if (!author || !comment) return

    const newRev = {
      id: 'rev-' + Date.now(),
      author,
      rating: Number(rating),
      date: 'Just now',
      verified: true,
      shade: shade || null,
      comment,
      productName
    }

    setReviews([newRev, ...reviews])
    setShowReviewModal(false)
    setAuthor('')
    setComment('')
    setShade('')
    setSubmittedNotice(true)
    setTimeout(() => setSubmittedNotice(false), 3500)
  }

  const filteredReviews = reviews.filter(r => {
    if (selectedRating !== 'all' && r.rating !== Number(selectedRating)) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#E9DED5] rounded-3xl p-8 sm:p-12 border border-[#D9A6AC]/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
            Verified Formulations
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#282426] mt-1">
            Client & Clinical Reviews
          </h1>
          <p className="text-xs sm:text-sm text-[#524B4F] mt-1 max-w-xl">
            Real feedback from verified purchasers, aesthetic chemists, and sensitive-skin testers.
          </p>
        </div>

        <button
          onClick={() => setShowReviewModal(true)}
          className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-6 py-3 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Write a Review
        </button>
      </div>

      {submittedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Thank you! Your verified product review has been published.</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E9DED5] shadow-xs text-xs">
        <span className="text-[#524B4F]">
          Showing <strong className="text-[#282426]">{filteredReviews.length}</strong> verified reviews
        </span>

        <div className="flex items-center gap-2">
          <span className="text-stone-400">Filter by stars:</span>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2 text-xs font-semibold text-[#282426]"
          >
            <option value="all">All Stars (5 to 1)</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
          </select>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] text-stone-400 font-mono">{rev.date}</span>
              </div>

              <h4 className="font-serif font-bold text-sm text-[#282426]">
                {rev.productName}
              </h4>

              <p className="text-xs sm:text-sm text-[#524B4F] leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-4 border-t border-[#E9DED5] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#282426]">{rev.author}</span>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </div>
              {rev.shade && (
                <span className="text-[10px] font-medium bg-[#F8F3EE] px-2.5 py-1 rounded-full text-[#542B43]">
                  {rev.shade}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <form
            onSubmit={handleAddReview}
            className="w-full max-w-lg bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-4 shadow-2xl text-xs"
          >
            <h3 className="font-serif font-bold text-lg text-[#282426]">
              Share Your Product Experience
            </h3>

            <div>
              <label className="block font-semibold uppercase text-[#524B4F] mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Camille Laurent"
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-[#524B4F] mb-1">
                Product Formulation
              </label>
              <select
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5"
              >
                {BEAUTY_PRODUCTS.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase text-[#524B4F] mb-1">
                  Rating
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5"
                >
                  <option value={5}>5 Stars (Exceptional)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Average)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold uppercase text-[#524B4F] mb-1">
                  Shade Worn (Optional)
                </label>
                <input
                  type="text"
                  value={shade}
                  onChange={(e) => setShade(e.target.value)}
                  placeholder="e.g. 100W Porcelain"
                  className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase text-[#524B4F] mb-1">
                Your Detailed Review & Texture Impressions
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How did the formula perform on your skin type? How was the longevity and finish?"
                className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors"
              >
                Publish Review
              </button>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="bg-[#F8F3EE] text-[#282426] px-5 py-2.5 rounded-xl font-semibold border border-[#E9DED5]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default ProductReviewsPage
