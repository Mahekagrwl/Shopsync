import React, { useState } from 'react'
import {
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Star,
  Send,
  AlertTriangle,
  ShieldAlert,
  Info,
  Check,
  Package,
  FileText
} from 'lucide-react'
import { BEAUTY_PRODUCTS } from '../../data/mockBeautyData'
import { useReports } from '../../context/ReportContext'
import { useAuth } from '../../context/AuthContext'

const ISSUE_CATEGORIES = [
  'Skin irritation / Rash',
  'Redness / Erythema',
  'Severe itching',
  'Extreme dryness / Flaking',
  'Acne / Breakouts',
  'Burning or stinging sensation',
  'Swelling / Puffy eyes',
  'Product texture / Separation issue',
  'Unpleasant fragrance / Odor',
  'Packaging leak / Defective pump',
  'General Positive Feedback / Review'
]

const SUSPECTED_INGREDIENTS = [
  'Synthetic Fragrance / Parfum',
  'Parabens (Preservatives)',
  'Tree Nut / Almond Oil',
  'Salicylic Acid (BHA)',
  'High-Strength Niacinamide (10%)',
  'Glycolic Acid (AHA)',
  'Sulfates (SLS / SLES)',
  'Essential Oils (Citrus/Lavender)',
  'Chemical Sunscreen Filters',
  'Silicones / Dimethicone',
  'Unsure / Not Listed'
]

export function CustomerFeedbackPage() {
  const { submitReport } = useReports()
  const { customer } = useAuth()

  const [selectedProduct, setSelectedProduct] = useState(BEAUTY_PRODUCTS[0]?.name || '')
  const [orderId, setOrderId] = useState('ORD-IN-984210')
  const [category, setCategory] = useState(ISSUE_CATEGORIES[0])
  const [rating, setRating] = useState(5)
  const [hasAllergyReaction, setHasAllergyReaction] = useState('No')
  const [suspectedIngredient, setSuspectedIngredient] = useState(SUSPECTED_INGREDIENTS[0])
  const [severity, setSeverity] = useState('Mild')
  const [medicalAttention, setMedicalAttention] = useState('No')
  const [fullName, setFullName] = useState(customer?.name || 'Ananya Sharma')
  const [email, setEmail] = useState(customer?.email || 'ananya.sharma@shopsync.in')
  const [phone, setPhone] = useState(customer?.phone || '+91 98251 45890')
  const [city, setCity] = useState('Vadodara, Gujarat')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [lastReportId, setLastReportId] = useState('')

  const prodObj = BEAUTY_PRODUCTS.find(p => p.name === selectedProduct) || BEAUTY_PRODUCTS[0]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!description.trim() || !email.trim()) return

    const newRep = submitReport({
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      city,
      orderId,
      productName: selectedProduct,
      brand: prodObj?.brand || 'Atelier Brand',
      rating,
      category,
      hasAllergyReaction: hasAllergyReaction === 'Yes',
      suspectedIngredient: hasAllergyReaction === 'Yes' ? suspectedIngredient : 'None Specified',
      severity: hasAllergyReaction === 'Yes' ? severity : 'None',
      medicalAttention: hasAllergyReaction === 'Yes' ? medicalAttention : 'No',
      description
    })

    setLastReportId(newRep.id)
    setSubmitted(true)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FFF9F5] min-h-screen">
      {/* Header */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#FFF9F5] via-[#F4C6D5]/30 to-[#FFF9F5] border border-[#F4C6D5] space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D985A5]/20 text-[#352137] text-xs font-bold uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5 text-[#D985A5]" />
          <span>Customer Voice & Safety Care</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#352137]">
          Customer Feedback & Adverse Reaction Reporting
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          At SHOPSYNC, your health and beauty safety are our foremost priorities. Whether you loved your purchase or experienced unexpected sensitivity, our dermatological safety team reviews every report within 24 hours.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl border-2 border-emerald-300 p-8 sm:p-12 text-center space-y-6 shadow-md">
          <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-2xl text-[#352137]">
              Incident Report #{lastReportId} Logged Successfully
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Thank you, {fullName}. Your report has been dispatched to the SHOPSYNC Store Owner and Atelier Safety Lead. A client concierge will follow up regarding your feedback or replacement.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#F4C6D5] max-w-md mx-auto text-left text-xs space-y-1.5 text-stone-700">
            <p><strong>Product:</strong> {selectedProduct}</p>
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Reaction Flagged:</strong> {hasAllergyReaction === 'Yes' ? '⚠️ Yes (Sensitivity Reported)' : 'No (General Feedback)'}</p>
            <p><strong>Status:</strong> <span className="text-amber-700 font-bold">New & Pending Review</span></p>
          </div>

          <button
            onClick={() => {
              setSubmitted(false)
              setDescription('')
            }}
            className="bg-[#352137] hover:bg-[#542B43] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
          >
            Submit Another Report
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#F4C6D5] p-6 sm:p-10 space-y-8 shadow-xs text-xs">
          {/* Section A: Customer Details */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#352137] flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-[#352137] text-white flex items-center justify-center text-xs">1</span>
              <span>Your Information & Contact</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold uppercase text-stone-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-stone-600 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-stone-600 mb-1">
                  Indian Phone Number (+91) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-stone-600 mb-1">
                  City / State *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                />
              </div>
            </div>
          </div>

          {/* Section B: Product & Order Details */}
          <div className="space-y-4 pt-4 border-t border-[#F4C6D5]/60">
            <h3 className="font-serif text-lg font-bold text-[#352137] flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-[#352137] text-white flex items-center justify-center text-xs">2</span>
              <span>Product & Experience Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold uppercase text-stone-600 mb-1">
                  Select Beauty Product *
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                >
                  {BEAUTY_PRODUCTS.map(p => (
                    <option key={p.id} value={p.name}>
                      {p.brand} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-stone-600 mb-1">
                  Order ID / Receipt # *
                </label>
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="ORD-IN-984210"
                  className="w-full rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-stone-600 mb-1">
                  Issue Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#F4C6D5] bg-[#FFF9F5] p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                >
                  {ISSUE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rating Stars */}
            <div>
              <label className="block font-semibold uppercase text-stone-600 mb-1">
                Product Experience Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-stone-600 ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>
          </div>

          {/* Section C: Mandatory Reaction / Sensitivity Check */}
          <div className="space-y-4 pt-4 border-t border-[#F4C6D5]/60 bg-[#F4C6D5]/15 p-6 rounded-2xl border border-[#F4C6D5]">
            <h3 className="font-serif text-lg font-bold text-[#352137] flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-[#D985A5] text-[#352137] flex items-center justify-center text-xs font-bold">3</span>
              <span className="text-[#352137]">Allergy & Sensitivity Investigation</span>
            </h3>

            <div>
              <label className="block font-bold text-sm text-[#352137] mb-2">
                Did you experience any allergy, irritation, or sensitivity after using this product? *
              </label>
              <div className="flex gap-4">
                {['No', 'Yes', 'Not Sure'].map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      hasAllergyReaction === opt
                        ? opt === 'Yes'
                          ? 'bg-rose-100 border-rose-400 text-rose-800 shadow-xs'
                          : 'bg-[#352137] border-[#352137] text-white shadow-xs'
                        : 'bg-white border-[#F4C6D5] text-stone-700 hover:bg-[#FFF9F5]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="allergyOption"
                      value={opt}
                      checked={hasAllergyReaction === opt}
                      onChange={(e) => setHasAllergyReaction(e.target.value)}
                      className="hidden"
                    />
                    <span>{opt === 'Yes' ? '⚠️ Yes' : opt === 'Not Sure' ? '🤔 Not Sure' : '✓ No'}</span>
                  </label>
                ))}
              </div>
            </div>

            {hasAllergyReaction === 'Yes' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#F4C6D5]/40">
                <div>
                  <label className="block font-semibold uppercase text-stone-600 mb-1">
                    Suspected Allergen / Ingredient
                  </label>
                  <select
                    value={suspectedIngredient}
                    onChange={(e) => setSuspectedIngredient(e.target.value)}
                    className="w-full rounded-xl border border-[#F4C6D5] bg-white p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                  >
                    {SUSPECTED_INGREDIENTS.map(ing => (
                      <option key={ing} value={ing}>
                        {ing}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-600 mb-1">
                    Symptom Severity
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full rounded-xl border border-[#F4C6D5] bg-white p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                  >
                    <option value="Mild">Mild (Temporary itching/redness &lt; 2 hrs)</option>
                    <option value="Moderate">Moderate (Persistent stinging/bumps 1-2 days)</option>
                    <option value="Severe">Severe (Swelling/Hives/Peeling)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-600 mb-1">
                    Medical Attention Sought?
                  </label>
                  <select
                    value={medicalAttention}
                    onChange={(e) => setMedicalAttention(e.target.value)}
                    className="w-full rounded-xl border border-[#F4C6D5] bg-white p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D985A5]"
                  >
                    <option value="No">No medical visit needed</option>
                    <option value="Dermatologist">Consulted Dermatologist</option>
                    <option value="General Physician">Visited General Physician</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Section D: Full Description & Notes */}
          <div className="space-y-2">
            <label className="block font-semibold uppercase text-stone-600">
              Detailed Description & Timeline of Symptoms *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe how you applied the product, any symptoms experienced, other products used alongside, and how long after application symptoms appeared..."
              className="w-full rounded-2xl border border-[#F4C6D5] bg-[#FFF9F5] p-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#D985A5] leading-relaxed"
            />
          </div>

          {/* Non-Medical Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-[11px] text-amber-900 leading-relaxed">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Non-Medical Safety Disclosure:</strong> This feedback form is designed for boutique quality control, allergen tracking, and customer resolution. It does not constitute medical emergency services. If you experience severe swelling, anaphylaxis, or difficulty breathing, please seek immediate medical care at your nearest clinic or hospital.
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#352137] hover:bg-[#542B43] text-white py-4 px-6 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Send className="w-4 h-4 text-[#F4C6D5]" />
            <span>Transmit Incident Report to Atelier Care Team</span>
          </button>
        </form>
      )}
    </div>
  )
}

export default CustomerFeedbackPage
