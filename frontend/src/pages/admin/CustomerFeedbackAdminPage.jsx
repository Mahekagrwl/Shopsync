import React, { useState } from 'react'
import { MessageSquare, Star, CheckCircle2 } from 'lucide-react'

export function CustomerFeedbackAdminPage() {
  const [feedbackItems] = useState([
    { id: 'fb-1', channel: 'In-Store Smart POS', author: 'Elena Rostova', rating: 5, subject: 'Fast barcode and immediate shade match', time: 'Yesterday' },
    { id: 'fb-2', channel: 'AI Skin Analysis', author: 'Camille Laurent', rating: 5, subject: 'Screened out my nut oil allergies with zero hassle', time: '2 days ago' },
    { id: 'fb-3', channel: 'Formulation Quality', author: 'Dr. Michael Chen', rating: 5, subject: 'Copper peptides helped reduce erythema in 72 hours', time: '3 days ago' }
  ])

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
          Voice of Customer & Experience Log
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
          Customer Feedback Submissions
        </h1>
      </div>

      <div className="bg-white rounded-3xl border border-[#E9DED5] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F]">
            <tr>
              <th className="py-3.5 px-4">Touchpoint</th>
              <th className="py-3.5 px-4">Client</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Subject & Content</th>
              <th className="py-3.5 px-4 text-right">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9DED5]">
            {feedbackItems.map((fb) => (
              <tr key={fb.id} className="hover:bg-[#F8F3EE]">
                <td className="py-3 px-4 font-bold text-[#542B43]">{fb.channel}</td>
                <td className="py-3 px-4 font-semibold text-[#282426]">{fb.author}</td>
                <td className="py-3 px-4">
                  <div className="flex text-amber-500">
                    {[...Array(fb.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-[#524B4F]">{fb.subject}</td>
                <td className="py-3 px-4 text-right text-stone-400 font-mono">{fb.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CustomerFeedbackAdminPage
