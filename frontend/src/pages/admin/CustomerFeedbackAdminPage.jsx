import React, { useState } from 'react'
import {
  MessageSquare,
  Star,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  Eye,
  Edit3,
  UserCheck,
  Download,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  X,
  Check,
  TrendingDown,
  Activity
} from 'lucide-react'
import { useReports } from '../../context/ReportContext'

export function CustomerFeedbackAdminPage() {
  const {
    reports,
    updateReportStatus,
    deleteReport,
    totalSubmissions,
    allergyReactionReports,
    pendingReports,
    resolvedReports,
    avgRating
  } = useReports()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [reactionOnly, setReactionOnly] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)

  // Edit Modal State
  const [modalStatus, setModalStatus] = useState('New')
  const [modalStaff, setModalStaff] = useState('')
  const [modalNotes, setModalNotes] = useState('')

  const openReportModal = (rep) => {
    setSelectedReport(rep)
    setModalStatus(rep.status)
    setModalStaff(rep.assignedStaff || 'Store Owner')
    setModalNotes(rep.internalNotes || '')
  }

  const handleSaveModal = () => {
    if (selectedReport) {
      updateReportStatus(selectedReport.id, modalStatus, modalNotes, modalStaff)
      setSelectedReport(null)
    }
  }

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter
    const matchesReaction = !reactionOnly || r.hasAllergyReaction

    return matchesSearch && matchesStatus && matchesReaction
  })

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Report ID',
      'Customer Name',
      'Phone',
      'City',
      'Order ID',
      'Product',
      'Brand',
      'Rating',
      'Category',
      'Allergy Reaction',
      'Suspected Ingredient',
      'Severity',
      'Status',
      'Assigned Staff',
      'Submitted At'
    ]

    const rows = filteredReports.map(r => [
      r.id,
      `"${r.customerName}"`,
      r.customerPhone,
      `"${r.city}"`,
      r.orderId,
      `"${r.productName}"`,
      `"${r.brand}"`,
      r.rating,
      `"${r.category}"`,
      r.hasAllergyReaction ? 'Yes' : 'No',
      `"${r.suspectedIngredient}"`,
      r.severity,
      r.status,
      `"${r.assignedStaff}"`,
      `"${r.submittedAt}"`
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `ShopSync_Customer_Reports_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#542B43] flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#D9A6AC]" /> Boutique Care & Formulation Vigilance
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#282426]">
            Customer Reports & Reaction Incident Log
          </h1>
          <p className="text-xs text-[#524B4F] mt-1">
            Track customer feedback, suspected allergen reactions, and manage staff resolution workflows across all stores.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-white border border-[#E9DED5] text-[#282426] hover:bg-[#F8F3EE] px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer shadow-2xs"
        >
          <Download className="w-4 h-4 text-[#542B43]" /> Export Incident Log (.CSV)
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-[#E9DED5] p-5 space-y-1 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#827A7F] tracking-wider">
            Total Submissions
          </span>
          <p className="text-2xl font-bold text-[#282426]">{totalSubmissions}</p>
          <span className="text-[10px] text-stone-500">Live Omnichannel Feed</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E9DED5] p-5 space-y-1 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#827A7F] tracking-wider">
            Average Rating
          </span>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-[#282426]">{avgRating}</p>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">92% Positive Sentiment</span>
        </div>

        <div className="bg-rose-50 rounded-2xl border border-rose-200 p-5 space-y-1 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-rose-800 tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Reported Reactions
          </span>
          <p className="text-2xl font-bold text-rose-700">{allergyReactionReports.length}</p>
          <span className="text-[10px] text-rose-600 font-medium">Allergen Sensitivity Flagged</span>
        </div>

        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 space-y-1 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
            Pending Action
          </span>
          <p className="text-2xl font-bold text-amber-700">{pendingReports.length}</p>
          <span className="text-[10px] text-amber-600 font-medium">Requires Concierge Followup</span>
        </div>

        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 space-y-1 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
            Resolved & Closed
          </span>
          <p className="text-2xl font-bold text-emerald-700">{resolvedReports.length}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Customer Replaced / Satisfied</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E9DED5] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, order ID, product, or suspected allergen..."
            className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] pl-10 pr-4 py-2 text-xs text-[#282426] focus:outline-none focus:ring-1 focus:ring-[#542B43]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#E9DED5] bg-[#F8F3EE] px-3 py-2 text-xs font-semibold text-[#282426] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="New">Status: New</option>
            <option value="Under Review">Status: Under Review</option>
            <option value="Resolved">Status: Resolved</option>
            <option value="Closed">Status: Closed</option>
          </select>

          <button
            onClick={() => setReactionOnly(!reactionOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              reactionOnly
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-[#F8F3EE] text-[#524B4F] hover:bg-rose-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Allergies Only ({allergyReactionReports.length})</span>
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-3xl border border-[#E9DED5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F3EE] border-b border-[#E9DED5] text-[10px] uppercase font-bold text-[#827A7F]">
              <tr>
                <th className="py-3.5 px-4">Report ID</th>
                <th className="py-3.5 px-4">Customer & City</th>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Product & Brand</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Category & Allergy</th>
                <th className="py-3.5 px-4">Suspected Allergen</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9DED5]">
              {filteredReports.map((rep) => (
                <tr key={rep.id} className="hover:bg-[#F8F3EE]/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#542B43] whitespace-nowrap">
                    {rep.id}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-[#282426]">{rep.customerName}</p>
                    <p className="text-[10px] text-stone-500">{rep.city}</p>
                    <p className="text-[10px] text-stone-400 font-mono">{rep.customerPhone}</p>
                  </td>
                  <td className="py-3 px-4 font-mono text-stone-600 whitespace-nowrap">
                    {rep.orderId}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <p className="font-semibold text-[#282426] truncate">{rep.productName}</p>
                    <span className="text-[10px] font-bold text-[#542B43]">{rep.brand}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex text-amber-500">
                      {[...Array(rep.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-stone-700">{rep.category}</p>
                    {rep.hasAllergyReaction && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full mt-1">
                        <AlertTriangle className="w-2.5 h-2.5" /> Allergy Reaction
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-stone-600">
                    <span className="italic">{rep.suspectedIngredient}</span>
                    {rep.severity && rep.severity !== 'None' && (
                      <span className="block text-[10px] text-stone-400">
                        Severity: {rep.severity}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        rep.status === 'New'
                          ? 'bg-rose-100 text-rose-700'
                          : rep.status === 'Under Review'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => openReportModal(rep)}
                      className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail / Resolve Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E9DED5] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-black hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#542B43]">
                Incident Investigation & Customer Concierge
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#282426]">
                {selectedReport.id} • {selectedReport.productName}
              </h3>
              <p className="text-xs text-stone-500">
                Submitted on {selectedReport.submittedAt}
              </p>
            </div>

            {/* Customer Details Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8F3EE] p-4 rounded-2xl text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#827A7F]">Customer</span>
                <p className="font-bold text-[#282426]">{selectedReport.customerName}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#827A7F]">Phone</span>
                <p className="font-mono text-stone-700">{selectedReport.customerPhone}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#827A7F]">Order ID</span>
                <p className="font-mono text-stone-700">{selectedReport.orderId}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#827A7F]">Location</span>
                <p className="text-stone-700">{selectedReport.city}</p>
              </div>
            </div>

            {/* Description & Symptoms */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#827A7F]">
                Customer Submitted Timeline & Symptoms
              </span>
              <div className="bg-[#FFF9F5] p-4 rounded-2xl border border-[#F4C6D5] text-xs text-stone-800 leading-relaxed">
                "{selectedReport.description}"
              </div>
            </div>

            {/* Allergy Specifics */}
            {selectedReport.hasAllergyReaction && (
              <div className="grid grid-cols-3 gap-3 bg-rose-50 p-3 rounded-2xl border border-rose-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-rose-800">Suspected Ingredient</span>
                  <p className="font-semibold text-rose-900">{selectedReport.suspectedIngredient}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-rose-800">Severity</span>
                  <p className="font-semibold text-rose-900">{selectedReport.severity}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-rose-800">Medical Attention</span>
                  <p className="font-semibold text-rose-900">{selectedReport.medicalAttention}</p>
                </div>
              </div>
            )}

            {/* Owner Actions & Workflow */}
            <div className="space-y-4 pt-2 border-t border-[#E9DED5]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#524B4F] mb-1">
                    Update Resolution Status
                  </label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                    className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5 text-xs font-semibold"
                  >
                    <option value="New">Status: New</option>
                    <option value="Under Review">Status: Under Review</option>
                    <option value="Escalated to Lab">Status: Escalated to Lab Chemist</option>
                    <option value="Resolved">Status: Resolved (Refund/Replaced)</option>
                    <option value="Closed">Status: Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#524B4F] mb-1">
                    Assigned Staff / Skin Concierge
                  </label>
                  <input
                    type="text"
                    value={modalStaff}
                    onChange={(e) => setModalStaff(e.target.value)}
                    placeholder="e.g. Dr. Anita Mehta / Mahek Merchant"
                    className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#524B4F] mb-1">
                  Internal Store & Concierge Notes
                </label>
                <textarea
                  rows={3}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Record customer communication, replacement shipment tracking, or skin concierge guidance provided..."
                  className="w-full rounded-xl border border-[#E9DED5] bg-[#F8F3EE] p-3 text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Save Incident Updates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerFeedbackAdminPage
