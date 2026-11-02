import React, { createContext, useContext, useState, useEffect } from 'react'

const ReportContext = createContext()

const INITIAL_REPORTS = [
  {
    id: 'REP-IN-2026-081',
    customerName: 'Priya Patel',
    customerEmail: 'priya.patel@example.com',
    customerPhone: '+91 98251 12345',
    city: 'Ahmedabad, Gujarat',
    orderId: 'ORD-IN-84920',
    productName: 'Minimalist 10% Niacinamide + Zinc Serum',
    brand: 'Minimalist',
    rating: 2,
    category: 'Skin irritation / Redness',
    hasAllergyReaction: true,
    suspectedIngredient: 'High concentration Niacinamide (10%)',
    severity: 'Moderate',
    medicalAttention: 'No, consulted dermatologist via tele-consult',
    description: 'Experienced mild tingling and persistent cheek redness for 48 hours after applying 3 drops. Switching to 5% recommended.',
    status: 'Under Review',
    assignedStaff: 'Dr. Anita Mehta (Skin Concierge)',
    internalNotes: 'Client contacted via WhatsApp. Recommended soothing centella barrier cream and offered exchange.',
    submittedAt: '02 Nov 2026, 14:15 IST'
  },
  {
    id: 'REP-IN-2026-079',
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya.sharma@shopsync.in',
    customerPhone: '+91 98251 45890',
    city: 'Vadodara, Gujarat',
    orderId: 'ORD-IN-984210',
    productName: 'Mamaearth Onion Hair Oil',
    brand: 'Mamaearth',
    rating: 3,
    category: 'Allergy or Sensitivity',
    hasAllergyReaction: true,
    suspectedIngredient: 'Prunus Amygdalus Dulcis (Almond Nut Oil)',
    severity: 'Mild',
    medicalAttention: 'No',
    description: 'I forgot to check that this formulation contains sweet almond oil. I have a known tree nut sensitivity so had slight scalp itchiness.',
    status: 'New',
    assignedStaff: 'Mahek Merchant',
    internalNotes: 'SkinSafe allergy checker correctly flagged this before checkout. Offered complimentary return.',
    submittedAt: '01 Nov 2026, 18:30 IST'
  },
  {
    id: 'REP-IN-2026-072',
    customerName: 'Rohan Mehra',
    customerEmail: 'rohan.mehra@example.com',
    customerPhone: '+91 99099 87654',
    city: 'Mumbai, Maharashtra',
    orderId: 'ORD-IN-771904',
    productName: 'Dot & Key Watermelon Sunscreen SPF 50+',
    brand: 'Dot & Key',
    rating: 5,
    category: 'General Positive Feedback',
    hasAllergyReaction: false,
    suspectedIngredient: 'None',
    severity: 'None',
    medicalAttention: 'No',
    description: 'Zero white cast and completely sweat-proof under Mumbai humidity. Perfect texture!',
    status: 'Resolved',
    assignedStaff: 'Client Care Team',
    internalNotes: 'Featured on storefront testimonials.',
    submittedAt: '29 Oct 2026, 11:10 IST'
  },
  {
    id: 'REP-IN-2026-068',
    customerName: 'Kavita Iyer',
    customerEmail: 'kavita.iyer@example.com',
    customerPhone: '+91 97412 34567',
    city: 'Bengaluru, Karnataka',
    orderId: 'ORD-IN-662810',
    productName: 'Maybelline New York Fit Me Foundation',
    brand: 'Maybelline New York',
    rating: 4,
    category: 'Packaging leak / Defective pump',
    hasAllergyReaction: false,
    suspectedIngredient: 'None',
    severity: 'None',
    medicalAttention: 'No',
    description: 'Cap was slightly loose during transit; minimal seepage on outer carton. Product bottle itself intact.',
    status: 'Resolved',
    assignedStaff: 'Fulfillment Lead',
    internalNotes: 'Credited ₹100 loyalty points for transit inconvenience.',
    submittedAt: '25 Oct 2026, 16:45 IST'
  }
]

export function ReportProvider({ children }) {
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('shopsync_customer_reports')
    return saved ? JSON.parse(saved) : INITIAL_REPORTS
  })

  useEffect(() => {
    localStorage.setItem('shopsync_customer_reports', JSON.stringify(reports))
  }, [reports])

  const submitReport = (reportData) => {
    const newReport = {
      id: 'REP-IN-2026-' + String(Math.floor(100 + Math.random() * 900)),
      customerName: reportData.customerName || 'Boutique Client',
      customerEmail: reportData.customerEmail || 'client@example.com',
      customerPhone: reportData.customerPhone || '+91 98000 00000',
      city: reportData.city || 'India',
      orderId: reportData.orderId || 'ORD-IN-' + Math.floor(10000 + Math.random() * 90000),
      productName: reportData.productName || 'Cosmetic Formulation',
      brand: reportData.brand || 'Atelier Brand',
      rating: Number(reportData.rating) || 5,
      category: reportData.category || 'General Inquiries',
      hasAllergyReaction: Boolean(reportData.hasAllergyReaction),
      suspectedIngredient: reportData.suspectedIngredient || 'None Specified',
      severity: reportData.severity || 'Mild',
      medicalAttention: reportData.medicalAttention || 'No',
      description: reportData.description || '',
      status: 'New',
      assignedStaff: 'Store Owner',
      internalNotes: '',
      submittedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + ', ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
    }

    setReports(prev => [newReport, ...prev])
    return newReport
  }

  const updateReportStatus = (id, newStatus, internalNotes, assignedStaff) => {
    setReports(prev =>
      prev.map(r => {
        if (r.id === id) {
          return {
            ...r,
            ...(newStatus && { status: newStatus }),
            ...(internalNotes !== undefined && { internalNotes }),
            ...(assignedStaff && { assignedStaff })
          }
        }
        return r
      })
    )
  }

  const deleteReport = (id) => {
    setReports(prev => prev.filter(r => r.id !== id))
  }

  // Summary Metrics
  const totalSubmissions = reports.length
  const allergyReactionReports = reports.filter(r => r.hasAllergyReaction)
  const pendingReports = reports.filter(r => r.status === 'New' || r.status === 'Under Review')
  const resolvedReports = reports.filter(r => r.status === 'Resolved' || r.status === 'Closed')
  const avgRating = (reports.reduce((acc, r) => acc + r.rating, 0) / (totalSubmissions || 1)).toFixed(1)

  return (
    <ReportContext.Provider
      value={{
        reports,
        submitReport,
        updateReportStatus,
        deleteReport,
        totalSubmissions,
        allergyReactionReports,
        pendingReports,
        resolvedReports,
        avgRating
      }}
    >
      {children}
    </ReportContext.Provider>
  )
}

export function useReports() {
  const context = useContext(ReportContext)
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider')
  }
  return context
}

export default ReportContext
