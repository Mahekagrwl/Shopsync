import React, { useState } from 'react'
import { Bell, AlertTriangle, Calendar, CheckCircle2, ShieldCheck, Trash2 } from 'lucide-react'

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'Low Stock Alert', desc: 'Peptide Barrier Elixir down to 42 units total.', time: '10 mins ago', type: 'warning' },
    { id: 'notif-2', title: 'Batch Expiry Approaching', desc: 'Caviar Hair Mask Lot CG-006 expires in 44 days.', time: '1 hour ago', type: 'danger' },
    { id: 'notif-3', title: 'Smart POS Session Reconciled', desc: 'Register 01 closed with zero cash drawer variance.', time: 'Yesterday', type: 'success' },
    { id: 'notif-4', title: 'FastAPI Backend Synchronized', desc: 'All 8 product tables synced with Supabase PostgreSQL schema.', time: 'Oct 30', type: 'info' }
  ])

  const clearNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#542B43]">
            System Broadcasts
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426]">
            Notifications & Station Audits
          </h1>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={() => setNotifications([])}
            className="text-xs font-semibold text-[#542B43] hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-5 rounded-3xl bg-white border border-[#E9DED5] flex items-center justify-between gap-4 shadow-xs"
          >
            <div className="flex items-center gap-4">
              <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${
                n.type === 'danger'
                  ? 'bg-rose-100 text-rose-700'
                  : n.type === 'warning'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {n.type === 'danger' ? <Calendar className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-serif font-bold text-sm text-[#282426]">{n.title}</h4>
                <p className="text-xs text-[#524B4F]">{n.desc}</p>
                <span className="text-[10px] text-stone-400 font-mono">{n.time}</span>
              </div>
            </div>

            <button
              onClick={() => clearNotification(n.id)}
              className="text-stone-300 hover:text-stone-600 p-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E9DED5] p-8 text-xs text-stone-400">
            No unread system alerts. All stations operating nominally.
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage
