import React, { useState } from 'react'
import { Star, CheckCircle2, Trash2, Eye } from 'lucide-react'
import { MOCK_REVIEWS } from '../../data/mockBeautyData'

export function ProductReviewsAdminPage() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS)

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
          Social Proof & Moderation
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
          Client Product Reviews Moderation
        </h1>
      </div>

      <div className="bg-white rounded-3xl border border-[#E9DED5] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F]">
            <tr>
              <th className="py-3.5 px-4">Reviewer</th>
              <th className="py-3.5 px-4">Product Formulation</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Comment</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9DED5]">
            {reviews.map((rev) => (
              <tr key={rev.id} className="hover:bg-[#F8F3EE]">
                <td className="py-3 px-4 font-semibold text-[#282426]">{rev.author}</td>
                <td className="py-3 px-4 font-medium text-[#542B43]">{rev.productName}</td>
                <td className="py-3 px-4">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-[#524B4F] max-w-xs truncate italic">"{rev.comment}"</td>
                <td className="py-3 px-4 text-stone-400 font-mono text-[11px]">{rev.date}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => setReviews(reviews.filter(r => r.id !== rev.id))}
                    className="text-stone-400 hover:text-red-600 p-1"
                    title="Remove from public store"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductReviewsAdminPage
