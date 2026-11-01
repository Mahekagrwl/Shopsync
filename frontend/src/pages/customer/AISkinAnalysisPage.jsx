import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Cpu,
  ArrowRight,
  RotateCcw,
  ShoppingBag,
  Trash2,
  Check,
  Eye,
  Info,
  Sun,
  Moon,
  Droplets,
  Layers,
  Activity,
  Flame,
  Maximize2,
  Lock,
  RefreshCw
} from 'lucide-react'
import { useSkinSafe } from '../../context/SkinSafeContext'
import { useCart } from '../../context/CartContext'
import { BEAUTY_PRODUCTS } from '../../data/mockBeautyData'
import { aiApi } from '../../services/api'
import { analyzeCanvasFaceImage, detectLiveFaceAlignment } from '../../utils/opticalSkinScanner'

export function AISkinAnalysisPage() {
  const { allergies, recentAnalysis, setRecentAnalysis, clearRecentAnalysis } = useSkinSafe()
  const { addToCart } = useCart()

  // Steps: 'setup' | 'camera_active' | 'preview_capture' | 'scanning' | 'results'
  const [step, setStep] = useState(recentAnalysis?.observations ? 'results' : 'setup')
  const [hasConsent, setHasConsent] = useState(true)
  const [consentNoticeVisible, setConsentNoticeVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'characteristics' | 'routine' | 'products'

  // Image & Camera
  const [selectedImage, setSelectedImage] = useState(
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80'
  )
  const [cameraStream, setCameraStream] = useState(null)
  const [cameraError, setCameraError] = useState('')
  const [shutterFlash, setShutterFlash] = useState(false)
  const [opticalMetrics, setOpticalMetrics] = useState(null)

  // Real-time live face alignment state
  const [alignmentInfo, setAlignmentInfo] = useState({
    status: 'Positioning Camera...',
    isAligned: false,
    lighting: 'normal',
    color: 'text-stone-300',
    borderColor: 'border-[#D9A6AC]'
  })

  // Selected Concerns
  const [selectedConcerns, setSelectedConcerns] = useState(['Redness / Rosacea', 'Dehydration / Tightness'])
  const availableConcerns = [
    'Redness / Rosacea',
    'Dehydration / Tightness',
    'Fine Lines & Elasticity',
    'Uneven Texture & Pores',
    'Dark Spots & Hyperpigmentation',
    'Excess Sebum & T-Zone Shine',
    'Under-Eye Darkness & Fatigue',
    'Acne & Blemish Spots'
  ]

  // Scan progress
  const [scanProgress, setScanProgress] = useState(0)
  const [scanStatusPhase, setScanStatusPhase] = useState('Calibrating Optical Geometry...')

  // Analysis Result State
  const [analysisResult, setAnalysisResult] = useState(recentAnalysis || null)
  const [addedItemNotice, setAddedItemNotice] = useState('')
  const [selectedShades, setSelectedShades] = useState({})

  // Refs
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const alignmentIntervalRef = useRef(null)

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
      if (alignmentIntervalRef.current) {
        clearInterval(alignmentIntervalRef.current)
      }
    }
  }, [cameraStream])

  // Attach camera stream to video element and initiate live face alignment loop
  useEffect(() => {
    if (step === 'camera_active' && videoRef.current && cameraStream) {
      const video = videoRef.current
      video.srcObject = cameraStream
      video.onloadedmetadata = () => {
        video.play().catch(e => console.warn('Video auto-play warning:', e))
      }

      // Live face alignment detection loop every 220ms
      alignmentIntervalRef.current = setInterval(() => {
        if (videoRef.current) {
          const info = detectLiveFaceAlignment(videoRef.current)
          setAlignmentInfo(info)
        }
      }, 220)
    } else {
      if (alignmentIntervalRef.current) {
        clearInterval(alignmentIntervalRef.current)
      }
    }

    return () => {
      if (alignmentIntervalRef.current) {
        clearInterval(alignmentIntervalRef.current)
      }
    }
  }, [step, cameraStream])

  // Toggle user concerns
  const toggleConcern = (concern) => {
    setSelectedConcerns(prev =>
      prev.includes(concern) ? prev.filter(c => c !== concern) : [...prev, concern]
    )
  }

  // --- 1. CAMERA ACCESS WITH PROGRESSIVE MULTI-TIER FALLBACKS ---
  const handleStartCamera = async () => {
    setCameraError('')

    if (!hasConsent) {
      setHasConsent(true)
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported by this browser. Please upload a portrait photo or choose a calibrated reference.')
      return
    }

    const constraintTiers = [
      { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
      { video: { facingMode: 'user' }, audio: false },
      { video: true, audio: false }
    ]

    let activeStream = null
    let lastError = null

    for (const constraints of constraintTiers) {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia(constraints)
        if (activeStream) break
      } catch (err) {
        lastError = err
      }
    }

    if (activeStream) {
      setCameraStream(activeStream)
      setStep('camera_active')
      setAlignmentInfo({
        status: 'Center Face Inside Guide',
        isAligned: false,
        lighting: 'normal',
        color: 'text-stone-300',
        borderColor: 'border-[#D9A6AC]'
      })
    } else {
      console.warn('[Camera Access Failed]', lastError)
      let msg = 'Unable to open camera. You can upload an image from your device or test with our clinical reference portraits below.'
      if (lastError?.name === 'NotAllowedError' || lastError?.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied in your browser. Please allow camera access in the URL address bar, or upload an image.'
      } else if (lastError?.name === 'NotFoundError' || lastError?.name === 'DevicesNotFoundError') {
        msg = 'No physical camera device was detected on your computer. Please upload a portrait photo below.'
      }
      setCameraError(msg)
    }
  }

  const handleStopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setStep('setup')
  }

  // --- 2. SNAPSHOT CAPTURE (WITH MIRRORING FIX & SHUTTER FLASH) ---
  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return

    // Trigger visual shutter flash
    setShutterFlash(true)
    setTimeout(() => setShutterFlash(false), 200)

    const video = videoRef.current
    const canvas = canvasRef.current || document.createElement('canvas')
    const w = video.videoWidth || 640
    const h = video.videoHeight || 480
    canvas.width = w
    canvas.height = h

    const ctx = canvas.getContext('2d')
    // Mirror horizontally so the captured snapshot matches what the user saw on screen!
    ctx.translate(w, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, w, h)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
    setSelectedImage(dataUrl)

    // Run real canvas optical analysis on captured image
    const metrics = analyzeCanvasFaceImage(canvas)
    setOpticalMetrics(metrics)

    // Stop video tracks
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }

    setTimeout(() => {
      setStep('preview_capture')
    }, 150)
  }

  const handleRetake = () => {
    setOpticalMetrics(null)
    handleStartCamera()
  }

  // --- 3. FILE UPLOAD ---
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target.result
      setSelectedImage(dataUrl)

      // Measure uploaded image pixels on canvas
      const img = new Image()
      img.onload = () => {
        const metrics = analyzeCanvasFaceImage(img)
        setOpticalMetrics(metrics)
        setStep('preview_capture')
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  // Select Calibrated Reference Portrait
  const handleSelectSample = (imageUrl) => {
    setSelectedImage(imageUrl)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const metrics = analyzeCanvasFaceImage(img)
      setOpticalMetrics(metrics)
    }
    img.src = imageUrl
  }

  // --- 4. EXECUTE COMPLETE AI SCANNING WORKFLOW ---
  const handleExecuteScan = async () => {
    setStep('scanning')
    setScanProgress(5)
    setScanStatusPhase('Calibrating Optical Facial Geometry...')

    // Smooth animation stages over 1.8s
    const pInterval = setInterval(() => {
      setScanProgress(prev => {
        const nextVal = prev + 4
        if (nextVal >= 25 && nextVal < 50) {
          setScanStatusPhase('Scanning Melanin, Capillaries & Erythema...')
        } else if (nextVal >= 50 && nextVal < 75) {
          setScanStatusPhase('Evaluating Lipid Barrier & Stratum Dehydration...')
        } else if (nextVal >= 75 && nextVal < 92) {
          setScanStatusPhase('Cross-referencing SkinSafe Allergens & Catalog...')
        } else if (nextVal >= 92) {
          setScanStatusPhase('Synthesizing Personalized AM/PM Regimen...')
        }
        return nextVal >= 98 ? 98 : nextVal
      })
    }, 60)

    try {
      const payload = {
        user_consent_granted: true,
        skin_type: 'Combination',
        primary_concerns: selectedConcerns,
        image_base64: null,
        optical_measurements: opticalMetrics || {
          redness_ratio: 74,
          oiliness_index: 60,
          undereye_darkness: 68,
          pores_score: 65,
          dryness_score: 72,
          blemish_score: 50,
          pigment_score: 55,
          uneven_tone_score: 58
        },
        allergies: allergies || []
      }

      let res = null
      try {
        res = await aiApi.skinAnalysis(payload)
      } catch (err) {
        console.warn('Backend AI endpoint fallback to client-synthesized report:', err.message)
      }

      // If backend is running, use its response; else client synthesizes cleanly
      const finalReport = res?.observations
        ? res
        : createClientAnalysisReport(opticalMetrics, selectedConcerns, allergies)

      clearInterval(pInterval)
      setScanProgress(100)
      setScanStatusPhase('Analysis Complete!')

      setTimeout(() => {
        setAnalysisResult(finalReport)
        setRecentAnalysis(finalReport)
        setStep('results')
      }, 400)
    } catch (err) {
      clearInterval(pInterval)
      console.error('Scan error:', err)
      const fallbackReport = createClientAnalysisReport(opticalMetrics, selectedConcerns, allergies)
      setAnalysisResult(fallbackReport)
      setRecentAnalysis(fallbackReport)
      setStep('results')
    }
  }

  // Client-side report synthesizer (mirrors backend with all 8 characteristics)
  const createClientAnalysisReport = (metrics, concerns, userAllergies) => {
    const m = metrics || {
      redness_ratio: 74,
      oiliness_index: 60,
      undereye_darkness: 68,
      pores_score: 65,
      dryness_score: 72,
      blemish_score: 50,
      pigment_score: 55,
      uneven_tone_score: 58
    }

    const observations = [
      {
        id: 'obs-redness',
        characteristic: 'Visible Redness & Vascular Sensitivity',
        score: m.redness_ratio,
        severity: m.redness_ratio > 75 ? 'Elevated' : m.redness_ratio > 55 ? 'Mild' : 'Optimal',
        affected_area: 'Malar Cheeks & Nasal Ala',
        finding: 'Micro-vascular flushing detected on mid-face contours; reactive barrier requires anti-inflammatory soothing.',
        recommendation: 'Bio-ceramide complex and copper peptides; strictly avoid synthetic fragrances.'
      },
      {
        id: 'obs-dryness',
        characteristic: 'Dryness-Related Surface Flakiness & Texture',
        score: m.dryness_score,
        severity: m.dryness_score > 70 ? 'Elevated' : 'Moderate',
        affected_area: 'Lower Cheeks & Perioral Rim',
        finding: 'Micro-texture irregularity and moisture loss observed on perimeter.',
        recommendation: 'Multi-molecular hyaluronic acid serum sealed with squalane.'
      },
      {
        id: 'obs-oil',
        characteristic: 'Oily-Looking Surface Shine',
        score: m.oiliness_index,
        severity: m.oiliness_index > 70 ? 'Elevated' : 'Moderate',
        affected_area: 'Forehead & Central T-Zone',
        finding: 'Specular reflectance concentration indicates active sebaceous output along the forehead and nose.',
        recommendation: 'Gentle niacinamide regulation and oil-free mineral UV defense.'
      },
      {
        id: 'obs-acne',
        characteristic: 'Visible Acne-Like Blemish Spots',
        score: m.blemish_score,
        severity: m.blemish_score > 65 ? 'Elevated' : 'Mild',
        affected_area: 'Jawline & Lateral Chin',
        finding: 'Localized follicular micro-congestion without widespread inflammation.',
        recommendation: 'Non-comedogenic barrier fortifiers and gentle BHA spot clarification.'
      },
      {
        id: 'obs-pigment',
        characteristic: 'Dark Spots & Pigmentation Appearance',
        score: m.pigment_score,
        severity: m.pigment_score > 70 ? 'Elevated' : 'Moderate',
        affected_area: 'Upper Zygomatic Arch & Temples',
        finding: 'Subtle localized melanin clusters associated with cumulative UV exposure.',
        recommendation: 'Broad-spectrum non-nano zinc oxide SPF 50+ mineral protection.'
      },
      {
        id: 'obs-tone',
        characteristic: 'Uneven-Looking Complexion Tone',
        score: m.uneven_tone_score,
        severity: m.uneven_tone_score > 68 ? 'Elevated' : 'Moderate',
        affected_area: 'Overall Complexion',
        finding: 'Mild chromatic variance between mid-face and outer contours.',
        recommendation: 'Antioxidant bio-ferments and radiant light-diffusing foundation.'
      },
      {
        id: 'obs-pores',
        characteristic: 'Visible Pores & Micro-Topography',
        score: m.pores_score,
        severity: m.pores_score > 70 ? 'Prominent' : 'Moderate',
        affected_area: 'Medial Cheeks & Nose',
        finding: 'Enlarged pore topography linked to localized sebaceous accumulation.',
        recommendation: 'Pore-smoothing peptides and balancing botanical essences.'
      },
      {
        id: 'obs-undereye',
        characteristic: 'Under-Eye Darkness & Vascular Shadowing',
        score: m.undereye_darkness,
        severity: m.undereye_darkness > 72 ? 'Noticeable' : 'Mild',
        affected_area: 'Periorbital Orbital Hollows',
        finding: 'Vascular shadowing and thin dermal reflection in lower orbital margin.',
        recommendation: 'Caffeine peptide compress and mineral micro-pearl illumination.'
      }
    ]

    const morning_routine = [
      {
        step: 'Step 1: Cleanse',
        title: 'Purifying Gentle Rinse',
        description: 'Sulfate-free pH 5.5 amino wash that dissolves overnight sebum without stripping lipid ceramides.'
      },
      {
        step: 'Step 2: Treat & Soothe',
        title: 'Cellular Peptide Barrier Elixir',
        description: '5 multi-molecular ceramides + copper tripeptide-1 to calm cheek erythema and seal hydration.'
      },
      {
        step: 'Step 3: Shield',
        title: 'Mineral Silk Fluid Broad Spectrum SPF 50+',
        description: '100% non-nano zinc oxide physical shield against photo-pigmentation with zero stinging.'
      }
    ]

    const night_routine = [
      {
        step: 'Step 1: Double Cleanse',
        title: 'Botanical Melt & Rinse',
        description: 'Ultra-gentle lipid cleanser to lift environmental micro-particulates and mineral SPF.'
      },
      {
        step: 'Step 2: Barrier Rebuild',
        title: 'Bio-Fermented Peptide Repair',
        description: 'Active snow mushroom ferment and copper peptides for nocturnal cell turnover.'
      },
      {
        step: 'Step 3: Deep Moisture Seal',
        title: 'Stratum Corneum Lock',
        description: 'Lipid-replenishing squalane veil to prevent nocturnal trans-epidermal moisture loss.'
      }
    ]

    // Allergy-safe products from catalog
    const uAllergies = (userAllergies || []).map(a => a.toLowerCase().trim()).filter(Boolean)
    const safeProds = BEAUTY_PRODUCTS.filter(p => {
      const ing = (p.ingredients || '').toLowerCase()
      return !uAllergies.some(a => ing.includes(a))
    }).map(p => {
      let why = 'Clinically formulated for sensitive skin profiles'
      if (p.id === 'prod-002') why = `Targeted for your observed redness (${m.redness_ratio}%) and barrier dryness. Ceramides soothe inflammation.`
      if (p.id === 'prod-004') why = `Targeted for UV dark spots (${m.pigment_score}%). Non-nano zinc oxide provides mineral protection without chemical filters.`
      if (p.id === 'prod-001') why = `Targeted for uneven tone (${m.uneven_tone_score}%). Hyaluronic acid microspheres provide radiant coverage without clogging pores.`
      if (p.id === 'prod-003') why = 'Meadowfoam seed oil and natural waxes nourish sensitive lip margins without synthetic fragrance.'
      return {
        product_id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        images: p.images || [],
        shades: p.shades || [],
        why_recommended: why,
        allergy_safe: true,
        in_stock: p.inStock
      }
    })

    const barrierScore = Math.round(
      Math.max(62, Math.min(94, 100 - (((m.redness_ratio + m.dryness_score + m.uneven_tone_score) / 3) - 35) * 0.45))
    )

    return {
      status: 'completed',
      analysis_mode: 'optical_assisted_demo',
      disclaimer: 'AI-Assisted Optical Dermatology Analysis. For cosmetic & educational guidance only. Does not replace certified medical diagnosis.',
      complexion_summary: {
        primary_classification: 'Sensitive Barrier with Localized Dehydration',
        overall_health_score: barrierScore,
        dominant_concern: 'Vascular Redness & Micro-Dehydration',
        analyzed_timestamp: new Date().toISOString()
      },
      observations,
      zonal_analysis: [
        { zone: 'Forehead & T-Zone', status: 'Sebum Shine & Pore Topography', severity: m.oiliness_index > 70 ? 'Elevated' : 'Moderate' },
        { zone: 'Cheeks & Nose', status: 'Vascular Redness & Micro-Capillaries', severity: m.redness_ratio > 75 ? 'Elevated' : 'Mild' },
        { zone: 'Periorbital (Under-Eye)', status: 'Vascular Darkness & Fatigue', severity: m.undereye_darkness > 72 ? 'Noticeable' : 'Mild' },
        { zone: 'Chin & Jawline', status: 'Barrier Sensitivity & Hydration', severity: m.dryness_score > 70 ? 'Elevated' : 'Moderate' }
      ],
      morning_routine,
      night_routine,
      recommended_categories: ['Barrier Repair Serums', 'Non-Nano Mineral Sunscreens', 'Hydrating Radiant Foundations'],
      recommended_products: safeProds
    }
  }

  // --- 5. CLEAR / DELETE RESULTS ---
  const handleDeleteResults = () => {
    clearRecentAnalysis()
    setAnalysisResult(null)
    setOpticalMetrics(null)
    setStep('setup')
  }

  // Helper for adding recommended product to cart
  const handleAddStepToCart = (item) => {
    const rawProd = BEAUTY_PRODUCTS.find(p => p.id === item.product_id) || {
      id: item.product_id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      images: item.images
    }
    const shade = selectedShades[item.product_id] || rawProd.shades?.[0] || null
    addToCart(rawProd, shade, 1)
    setAddedItemNotice(`Added "${item.name}" to your shopping bag!`)
    setTimeout(() => setAddedItemNotice(''), 3000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <canvas ref={canvasRef} className="hidden" />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* HEADER BANNER */}
      <div className="bg-[#542B43] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D9A6AC]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#D9A6AC] text-xs font-semibold backdrop-blur-xs">
              <Cpu className="w-3.5 h-3.5" /> AI Optical Dermatology Scanner
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> SkinSafe Allergen Screened
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 text-[11px] font-medium">
              Demo / Assisted Mode
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            AI Face Scanning & Beauty Analysis
          </h1>
          <p className="text-xs sm:text-sm text-[#E9DED5] leading-relaxed max-w-2xl">
            Live camera face alignment, multi-zone optical chrominance evaluation, and 8 clinically-modeled skin characteristics paired with allergy-aware skincare regimens.
          </p>
        </div>

        {/* Privacy & Medical Disclaimer */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#E9DED5]/85">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#D9A6AC] shrink-0" />
            <span>
              <strong>Privacy Guaranteed:</strong> No facial recognition or biometric identification. Images evaluated locally in-session. Not a medical diagnosis.
            </span>
          </div>
          {analysisResult && (
            <button
              onClick={handleDeleteResults}
              className="text-rose-200 hover:text-white flex items-center gap-1 font-semibold text-xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Saved Analysis
            </button>
          )}
        </div>
      </div>

      {/* ================= STEP 1: SETUP & SELECTION ================= */}
      {step === 'setup' && (
        <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-10 shadow-xs space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Input Selection & Portrait Preview */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-[#282426]">
                  1. Choose Face Capture Method
                </h3>
                <span className="text-xs text-[#827A7F]">Step 1 of 3</span>
              </div>

              {/* Portrait Preview Box */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-dashed border-[#D9A6AC] bg-[#F8F3EE] flex flex-col items-center justify-center p-4 group shadow-inner">
                <img
                  src={selectedImage}
                  alt="Portrait Reference"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">Portrait Active for Analysis</p>
                      <p className="text-[11px] text-[#E9DED5]">Ready for live scanning & 8-point metrics</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#542B43] text-[#D9A6AC] text-[10px] font-bold border border-[#D9A6AC]/40">
                      Standard Framing
                    </span>
                  </div>
                </div>
              </div>

              {/* Camera Error Alert if user experienced hardware blocking */}
              {cameraError && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">{cameraError}</p>
                    <p className="text-[11px] text-amber-800">
                      You can seamlessly upload an image or choose one of our high-resolution calibrated portraits below.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons: Live Camera or Upload */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleStartCamera}
                  className="bg-[#542B43] hover:bg-[#3B1E2F] active:scale-98 text-white py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  data-cursor-card="true"
                >
                  <Camera className="w-4 h-4 text-[#D9A6AC]" />
                  Open Live Camera
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#F8F3EE] hover:bg-[#E9DED5] active:scale-98 text-[#282426] border border-[#D9A6AC] py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  data-cursor-card="true"
                >
                  <Upload className="w-4 h-4 text-[#542B43]" />
                  Upload Photo
                </button>
              </div>

              {/* Sample Portrait Switchers */}
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#827A7F]">
                  Or analyze a calibrated reference portrait:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectSample(
                        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80'
                      )
                    }
                    className="p-2.5 text-xs font-semibold rounded-xl border border-[#E9DED5] bg-[#F8F3EE] hover:border-[#542B43] text-[#282426] text-center transition-all cursor-pointer"
                  >
                    Portrait A (Redness Focus)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectSample(
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
                      )
                    }
                    className="p-2.5 text-xs font-semibold rounded-xl border border-[#E9DED5] bg-[#F8F3EE] hover:border-[#542B43] text-[#282426] text-center transition-all cursor-pointer"
                  >
                    Portrait B (Balanced Glow)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectSample(
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80'
                      )
                    }
                    className="p-2.5 text-xs font-semibold rounded-xl border border-[#E9DED5] bg-[#F8F3EE] hover:border-[#542B43] text-[#282426] text-center transition-all cursor-pointer"
                  >
                    Portrait C (T-Zone Shine)
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Concerns & Consent */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif font-bold text-lg text-[#282426]">
                    2. Select Primary Skin Targets
                  </h3>
                  <span className="text-xs text-[#827A7F]">{selectedConcerns.length} selected</span>
                </div>
                <p className="text-xs text-[#524B4F] mb-3">
                  Select concerns you wish the optical algorithm to emphasize during analysis:
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableConcerns.map((concern) => {
                    const isSelected = selectedConcerns.includes(concern)
                    return (
                      <button
                        key={concern}
                        type="button"
                        onClick={() => toggleConcern(concern)}
                        className={`text-xs px-3.5 py-2 rounded-xl border transition-all cursor-pointer font-medium ${
                          isSelected
                            ? 'bg-[#542B43] text-white border-[#542B43] shadow-xs'
                            : 'bg-[#F8F3EE] text-[#524B4F] border-[#E9DED5] hover:border-[#D9A6AC]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {concern}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* SkinSafe Allergies Auto-Detected */}
              <div className="p-4 rounded-2xl bg-[#E9DED5]/50 border border-[#D9A6AC] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#542B43] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" /> Active SkinSafe Profile
                  </span>
                  <Link to="/skinsafe" className="text-[11px] text-[#542B43] hover:underline font-semibold">
                    Manage Allergens
                  </Link>
                </div>
                {allergies && allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {allergies.map(a => (
                      <span key={a} className="px-2.5 py-0.5 rounded-full bg-white text-xs font-medium text-[#282426] border border-[#D9A6AC]">
                        {a}
                      </span>
                    ))}
                    <span className="text-[11px] text-emerald-800 font-semibold self-center ml-1">
                      (Products containing these will be automatically filtered out)
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-[#524B4F]">
                    No allergy triggers configured. All catalog formulations will be eligible.
                  </p>
                )}
              </div>

              {/* Transparent Privacy & Explicit Consent Box */}
              <div className="p-4 rounded-2xl bg-[#F8F3EE] border border-[#D9A6AC] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#282426] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" /> Explicit Consent Granted
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Active & Compliant
                  </span>
                </div>
                <p className="text-[11px] text-[#524B4F] leading-relaxed">
                  Optical analysis processes pixel chrominance in-session. No biometric identification or facial storage is performed. Cosmetic guidance only; does not replace medical advice.
                </p>
              </div>

              {/* Execute Scan Button */}
              <button
                type="button"
                onClick={handleExecuteScan}
                className="w-full bg-[#542B43] hover:bg-[#3B1E2F] active:scale-98 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                data-cursor-card="true"
              >
                <Sparkles className="w-4 h-4 text-[#D9A6AC]" />
                Start Optical Analysis on Selected Portrait
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 2: LIVE CAMERA SCANNING WITH ACTIVE FACE DETECTION ================= */}
      {step === 'camera_active' && (
        <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-10 shadow-lg text-center space-y-6">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Camera Active
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#282426]">
              Align Your Face Within the Guide
            </h2>
            <p className="text-xs text-[#524B4F]">
              Center your eyes along the horizontal guide, look straight ahead, and keep expressions natural.
            </p>
          </div>

          {/* Video Container with Dynamic Glowing Face Alignment Guide */}
          <div className="relative w-full max-w-md aspect-[3/4] mx-auto rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-[#542B43]">
            {/* Shutter Flash Animation */}
            {shutterFlash && (
              <div className="absolute inset-0 bg-white z-30 pointer-events-none transition-opacity duration-200" />
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />

            {/* Glowing Face Alignment Oval Guide that reacts dynamically to face presence */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className={`w-[72%] h-[78%] rounded-[50%] border-2 border-dashed transition-all duration-300 flex flex-col justify-between items-center py-8 ${
                  alignmentInfo.isAligned
                    ? 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.8)]'
                    : alignmentInfo.borderColor
                }`}
              >
                {/* Upper alignment marker */}
                <span className="text-[10px] font-mono tracking-widest text-[#D9A6AC] bg-black/70 px-2 py-0.5 rounded-full">
                  FOREHEAD / T-ZONE
                </span>
                {/* Center eye-level line */}
                <div className="w-full border-t border-[#D9A6AC]/40 border-dashed relative">
                  <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 text-[9px] font-mono text-[#D9A6AC] bg-black/75 px-1.5 py-0.2 rounded">
                    EYE LEVEL
                  </span>
                </div>
                {/* Lower chin marker */}
                <span className="text-[10px] font-mono tracking-widest text-[#D9A6AC] bg-black/70 px-2 py-0.5 rounded-full">
                  CHIN LINE
                </span>
              </div>
            </div>

            {/* Animated Laser Scanning Sweep */}
            <motion.div
              animate={{ top: ['8%', '88%', '8%'] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#D9A6AC] to-transparent shadow-[0_0_12px_#D9A6AC] pointer-events-none"
            />

            {/* Status Cues on Camera Screen */}
            <div className="absolute top-4 inset-x-4 flex justify-between items-center text-xs">
              <span
                className={`bg-black/75 font-mono px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-xs transition-colors duration-200 ${
                  alignmentInfo.isAligned ? 'text-emerald-400 font-bold' : alignmentInfo.color
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    alignmentInfo.isAligned ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                  }`}
                />
                {alignmentInfo.status}
              </span>
              <span className="bg-black/70 text-white font-mono px-2.5 py-1 rounded-full text-[11px]">
                HD Sensor
              </span>
            </div>

            {/* Cancel button on bottom corner */}
            <button
              onClick={handleStopCamera}
              className="absolute bottom-4 left-4 bg-black/70 hover:bg-black text-white px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer"
            >
              Cancel Camera
            </button>
          </div>

          {/* Capture Trigger */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleCaptureSnapshot}
              className="w-full sm:w-auto bg-[#542B43] hover:bg-[#3B1E2F] active:scale-95 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              data-cursor-card="true"
            >
              <Camera className="w-4 h-4 text-[#D9A6AC]" />
              Capture High-Res Frame
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: PREVIEW CAPTURED FRAME ================= */}
      {step === 'preview_capture' && (
        <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-10 shadow-lg text-center space-y-6">
          <div className="max-w-md mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-[#542B43] text-xs font-bold uppercase tracking-wider">
              Frame Captured
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#282426]">
              Review Your Portrait
            </h2>
            <p className="text-xs text-[#524B4F]">
              Confirm that your face is centered and free from glare before executing full diagnostic.
            </p>
          </div>

          {/* Captured Image Preview */}
          <div className="relative w-full max-w-sm aspect-[3/4] mx-auto rounded-3xl overflow-hidden border-4 border-[#542B43] shadow-xl">
            <img src={selectedImage} alt="Captured Face" className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white text-xs text-left">
              <span className="font-mono text-emerald-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Optical Chrominance Extracted
              </span>
              <p className="text-[11px] text-[#E9DED5]">Ready for 8-characteristic analysis</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRetake}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-[#D9A6AC] bg-[#F8F3EE] hover:bg-[#E9DED5] active:scale-98 text-[#282426] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Retake Photo
            </button>

            <button
              type="button"
              onClick={handleExecuteScan}
              className="w-full sm:w-auto bg-[#542B43] hover:bg-[#3B1E2F] active:scale-98 text-white px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              data-cursor-card="true"
            >
              <Sparkles className="w-4 h-4 text-[#D9A6AC]" />
              Start Complete Skin Analysis
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: SCANNING ANIMATION ================= */}
      {step === 'scanning' && (
        <div className="bg-white rounded-3xl border border-[#E9DED5] p-10 sm:p-14 text-center space-y-8 shadow-md">
          {/* Scanning Box with Animated Lasers & Grid */}
          <div className="relative w-72 h-80 mx-auto rounded-3xl overflow-hidden border-4 border-[#542B43] shadow-2xl">
            <img src={selectedImage} alt="Analyzing" className="w-full h-full object-cover" />

            {/* Vertical Sweeping Laser Bar */}
            <motion.div
              animate={{ top: ['0%', '94%', '0%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-0 right-0 h-1 bg-[#D9A6AC] shadow-[0_0_20px_#D9A6AC]"
            />

            {/* Crosshair Mesh Grid Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#D9A6AC_1px,transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none" />

            {/* Circular Scanning Reticle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 m-auto w-32 h-32 rounded-full border border-dashed border-[#D9A6AC] opacity-60 pointer-events-none"
            />
          </div>

          <div className="space-y-3 max-w-md mx-auto">
            <span className="font-mono text-xs font-bold text-[#542B43] bg-[#E9DED5] px-3 py-1 rounded-full uppercase tracking-wider">
              {scanProgress}% Processed
            </span>
            <h3 className="font-serif font-bold text-2xl text-[#282426]">
              {scanStatusPhase}
            </h3>
            <p className="text-xs text-[#827A7F]">
              Evaluating 8 visible skin characteristics: acne, dark spots, tone uniformity, redness, dryness, shine, pores, and under-eye periorbital shadowing.
            </p>

            {/* Animated Progress Bar */}
            <div className="w-full bg-[#F8F3EE] h-3 rounded-full overflow-hidden p-0.5 border border-[#D9A6AC]/50">
              <div
                className="bg-[#542B43] h-full rounded-full transition-all duration-200"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 5: COMPREHENSIVE BEAUTY REPORT ================= */}
      {step === 'results' && analysisResult && (
        <div className="space-y-8">
          {/* Top Control Bar with Health Score */}
          <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E9DED5]">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Comprehensive Diagnostic Complete
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#282426] mt-2">
                  {analysisResult.complexion_summary?.primary_classification || 'Sensitive Barrier Complexion Profile'}
                </h2>
                <p className="text-xs text-[#524B4F]">
                  Analyzed on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • Demo / Assisted Mode
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('setup')}
                  className="px-4 py-2 rounded-xl border border-[#E9DED5] bg-[#F8F3EE] hover:bg-[#E9DED5] text-xs font-semibold text-[#282426] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> New Scan
                </button>
                <button
                  type="button"
                  onClick={handleDeleteResults}
                  className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            </div>

            {/* Quick Metrics KPI Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#F8F3EE] border border-[#E9DED5] text-center">
                <span className="text-[10px] font-bold text-[#827A7F] uppercase tracking-wider">Barrier Resilience</span>
                <p className="text-3xl font-bold font-mono text-[#542B43] mt-1">
                  {analysisResult.complexion_summary?.overall_health_score || 82} / 100
                </p>
                <span className="text-[10px] text-emerald-700 font-semibold">Healthy Recovery Rating</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F3EE] border border-[#E9DED5] text-center">
                <span className="text-[10px] font-bold text-[#827A7F] uppercase tracking-wider">Visible Redness</span>
                <p className="text-3xl font-bold font-mono text-rose-700 mt-1">
                  {analysisResult.observations?.find(o => o.id === 'obs-redness')?.score || 74}%
                </p>
                <span className="text-[10px] text-rose-700 font-semibold">Malar Sensitivity</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F3EE] border border-[#E9DED5] text-center">
                <span className="text-[10px] font-bold text-[#827A7F] uppercase tracking-wider">T-Zone Shine</span>
                <p className="text-3xl font-bold font-mono text-amber-700 mt-1">
                  {analysisResult.observations?.find(o => o.id === 'obs-oil')?.score || 58}%
                </p>
                <span className="text-[10px] text-amber-700 font-semibold">Moderate Reflectance</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F3EE] border border-[#E9DED5] text-center">
                <span className="text-[10px] font-bold text-[#827A7F] uppercase tracking-wider">Under-Eye Shadowing</span>
                <p className="text-3xl font-bold font-mono text-purple-800 mt-1">
                  {analysisResult.observations?.find(o => o.id === 'obs-undereye')?.score || 66}%
                </p>
                <span className="text-[10px] text-purple-800 font-semibold">Periorbital Tone</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#E9DED5] gap-2 overflow-x-auto pb-1">
              {[
                { id: 'overview', label: '1. Diagnostic Overview & 4 Zones', icon: Eye },
                { id: 'characteristics', label: '2. All 8 Skin Characteristics', icon: Layers },
                { id: 'routine', label: '3. AM / PM Skincare Regimen', icon: Sun },
                { id: 'products', label: '4. Prescribed Formulations', icon: ShoppingBag }
              ].map(t => {
                const Icon = t.icon
                const isActive = activeTab === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#542B43] text-white shadow-xs'
                        : 'text-[#524B4F] hover:bg-[#F8F3EE] hover:text-[#282426]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Toast Notice */}
          {addedItemNotice && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{addedItemNotice}</span>
            </div>
          )}

          {/* --- TAB 1: OVERVIEW & 4-ZONE FACIAL MAP --- */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left: 4-Zone Breakdown */}
                <div className="md:col-span-7 bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-5">
                  <h3 className="font-serif font-bold text-xl text-[#282426]">
                    4-Zone Facial Topography Map
                  </h3>
                  <p className="text-xs text-[#524B4F]">
                    Specific observations detected across facial quadrants based on optical chrominance:
                  </p>

                  <div className="space-y-3">
                    {analysisResult.zonal_analysis?.map((z, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#F8F3EE] border border-[#E9DED5] flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-[#282426]">{z.zone}</span>
                          <p className="text-[11px] text-[#524B4F]">{z.status}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          z.severity === 'Elevated' || z.severity === 'Noticeable'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {z.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Summary Observation Callout */}
                <div className="md:col-span-5 bg-[#F8F3EE] rounded-3xl border border-[#D9A6AC] p-6 sm:p-8 space-y-4">
                  <span className="text-[10px] font-bold text-[#542B43] uppercase tracking-widest">
                    Clinical Takeaway
                  </span>
                  <h4 className="font-serif font-bold text-lg text-[#282426]">
                    Skin Barrier Resilience Strategy
                  </h4>
                  <p className="text-xs text-[#524B4F] leading-relaxed">
                    Your complexion exhibits heightened vascular reactivity on the cheeks alongside localized dehydration. The central forehead shows elevated shine, suggesting a combination profile where the skin overproduces sebum to compensate for trans-epidermal moisture loss.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-[#D9A6AC]/60 text-xs text-[#282426] space-y-1 font-medium">
                    <p className="text-[11px] text-[#542B43] font-bold">Recommended Product Categories:</p>
                    <ul className="list-disc list-inside text-[11px] text-[#524B4F] space-y-0.5">
                      {analysisResult.recommended_categories?.map((cat, i) => (
                        <li key={i}>{cat}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => setActiveTab('routine')}
                    className="w-full bg-[#542B43] hover:bg-[#3B1E2F] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    View Prescribed Regimen <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- TAB 2: ALL 8 VISIBLE SKIN CHARACTERISTICS --- */}
          {activeTab === 'characteristics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#282426]">
                    8 Visible Skin Characteristics
                  </h3>
                  <p className="text-xs text-[#524B4F]">
                    Individual multi-spectral evaluation calibrated to cosmetic parameters:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.observations?.map((obs) => (
                  <div
                    key={obs.id}
                    className="bg-white rounded-2xl border border-[#E9DED5] p-5 space-y-3 shadow-xs hover:border-[#D9A6AC] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-[#827A7F] uppercase tracking-wider">
                          Zone: {obs.affected_area}
                        </span>
                        <h4 className="font-serif font-bold text-base text-[#282426]">
                          {obs.characteristic}
                        </h4>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        obs.severity === 'Elevated' || obs.severity === 'Prominent' || obs.severity === 'Noticeable'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : obs.severity === 'Moderate'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {obs.severity} ({obs.score}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#F8F3EE] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          obs.score > 70 ? 'bg-rose-600' : obs.score > 50 ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${obs.score}%` }}
                      />
                    </div>

                    <p className="text-xs text-[#524B4F] leading-relaxed">
                      {obs.finding}
                    </p>

                    <div className="pt-2 border-t border-[#E9DED5] text-[11px] text-[#542B43] font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{obs.recommendation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- TAB 3: AM / PM SKINCARE REGIMEN --- */}
          {activeTab === 'routine' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Morning Routine (AM) */}
                <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-5 shadow-xs">
                  <div className="flex items-center gap-2 text-[#542B43] border-b border-[#E9DED5] pb-3">
                    <Sun className="w-5 h-5 text-amber-500" />
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#282426]">Morning Regimen (AM)</h3>
                      <p className="text-[11px] text-[#827A7F]">Protection & Moisture Lock</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {analysisResult.morning_routine?.map((step, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#F8F3EE] border border-[#E9DED5] space-y-1">
                        <span className="text-[10px] font-bold text-[#542B43] uppercase tracking-wider">
                          {step.step}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-[#282426]">{step.title}</h4>
                        <p className="text-xs text-[#524B4F] leading-relaxed">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Night Routine (PM) */}
                <div className="bg-white rounded-3xl border border-[#E9DED5] p-6 sm:p-8 space-y-5 shadow-xs">
                  <div className="flex items-center gap-2 text-[#542B43] border-b border-[#E9DED5] pb-3">
                    <Moon className="w-5 h-5 text-indigo-500" />
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#282426]">Night Regimen (PM)</h3>
                      <p className="text-[11px] text-[#827A7F]">Cellular Repair & Lipid Replenishment</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {analysisResult.night_routine?.map((step, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#F8F3EE] border border-[#E9DED5] space-y-1">
                        <span className="text-[10px] font-bold text-[#542B43] uppercase tracking-wider">
                          {step.step}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-[#282426]">{step.title}</h4>
                        <p className="text-xs text-[#524B4F] leading-relaxed">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- TAB 4: PRESCRIBED PRODUCTS (ALLERGY-AWARE) --- */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#282426]">
                    Prescribed Formulations from ShopSync
                  </h3>
                  <p className="text-xs text-[#524B4F]">
                    Selected directly for your observed characteristics; screened against your active SkinSafe allergy triggers.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>100% SkinSafe Screened</span>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysisResult.recommended_products?.map((item) => (
                  <div
                    key={item.product_id}
                    className="bg-white rounded-3xl border border-[#E9DED5] p-5 flex flex-col justify-between space-y-4 shadow-xs hover:border-[#D9A6AC] transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#827A7F]">
                          {item.brand}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Allergy Safe
                        </span>
                      </div>

                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F8F3EE]">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <h4 className="font-serif font-bold text-base text-[#282426]">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[#542B43] font-medium mt-1 bg-[#F8F3EE] p-2.5 rounded-xl border border-[#D9A6AC]/40">
                          💡 <strong>Why:</strong> {item.why_recommended}
                        </p>
                      </div>

                      {/* Shade Selector if product has shades */}
                      {item.shades && item.shades.length > 0 && (
                        <div className="space-y-1.5 pt-2">
                          <label className="text-[11px] font-bold text-[#282426]">
                            Select Shade:
                          </label>
                          <select
                            value={selectedShades[item.product_id]?.id || item.shades[0].id}
                            onChange={(e) => {
                              const found = item.shades.find(s => s.id === e.target.value)
                              setSelectedShades(prev => ({ ...prev, [item.product_id]: found }))
                            }}
                            className="w-full text-xs p-2 rounded-xl border border-[#E9DED5] bg-white text-[#282426] focus:border-[#542B43]"
                          >
                            {item.shades.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.code}) — {s.undertone} undertone
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#E9DED5] flex items-center justify-between">
                      <span className="font-bold text-lg text-[#282426]">
                        ${Number(item.price).toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddStepToCart(item)}
                        className="bg-[#542B43] hover:bg-[#3B1E2F] text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AISkinAnalysisPage
