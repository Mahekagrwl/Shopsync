/**
 * SHOPSYNC Master Indian Beauty Data Store
 * Top Indian & Global Beauty Brands with INR (₹) Pricing, Authentic Formulations,
 * Comprehensive Allergen Tracking, and Pan-India Addresses.
 */

export const CATEGORIES = [
  { id: 'makeup', name: 'Makeup', slug: 'makeup', icon: 'Palette', description: 'Flawless foundations, velvety lipsticks & radiant blushes' },
  { id: 'skincare', name: 'Skincare', slug: 'skincare', icon: 'Sparkles', description: 'Clinical actives, hydrating serums & barrier creams' },
  { id: 'haircare', name: 'Haircare', slug: 'haircare', icon: 'Wind', description: 'Traditional Ayurvedic oils, bond repair & clarifying shampoos' },
  { id: 'fragrance', name: 'Fragrance', slug: 'Heart', description: 'Oud, floral attars, luxury eau de parfums & mist' },
  { id: 'bodycare', name: 'Bodycare', slug: 'bodycare', icon: 'Shield', description: 'Botanical butters, brightening lotions & exfoliating scrubs' },
  { id: 'accessories', name: 'Beauty Tools & Accessories', slug: 'accessories', icon: 'Scissors', description: 'Precision beauty blenders, jade rollers & synthetic brush sets' },
]

export const BRANDS = [
  { id: 'lakme', name: 'Lakmé', origin: 'Mumbai, India', badge: 'India’s No. 1 Beauty' },
  { id: 'maybelline', name: 'Maybelline New York', origin: 'New York, USA', badge: 'Top Rated Foundation' },
  { id: 'loreal', name: "L'Oréal Paris", origin: 'Paris, France', badge: 'Dermatologist Validated' },
  { id: 'minimalist', name: 'Minimalist', origin: 'Jaipur, India', badge: 'Clean Clinical Actives' },
  { id: 'plum', name: 'Plum Goodness', origin: 'Thane, India', badge: '100% Vegan & Cruelty-Free' },
  { id: 'dot-and-key', name: 'Dot & Key', origin: 'Kolkata, India', badge: 'Fruit Powered Actives' },
  { id: 'mamaearth', name: 'Mamaearth', origin: 'Gurugram, India', badge: 'Toxin-Free Certified' },
  { id: 'sugar', name: 'SUGAR Cosmetics', origin: 'Mumbai, India', badge: 'Bold Indian Pigments' },
  { id: 'kay-beauty', name: 'Kay Beauty by Katrina', origin: 'Mumbai, India', badge: 'High Glam Couture' },
  { id: 'the-derma-co', name: 'The Derma Co', origin: 'Gurugram, India', badge: 'Derm Designed' },
  { id: 'cetaphil', name: 'Cetaphil', origin: 'Galderma Labs', badge: 'Sensitive Skin Doctor Recommended' },
  { id: 'neutrogena', name: 'Neutrogena', origin: 'Johnson & Johnson', badge: 'Hydro Boost Tech' },
  { id: 'mac', name: 'M·A·C Cosmetics', origin: 'Toronto, Canada', badge: 'Global Pro Artistry' }
]

export const BEAUTY_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Lakmé 9 to 5 Primer + Matte Perfect Cover Foundation',
    brand: 'Lakmé',
    category: 'makeup',
    subcategory: 'face-makeup',
    price: 525,
    comparePrice: 599,
    rating: 4.8,
    reviewsCount: 1420,
    inStock: true,
    stockQuantity: 180,
    sku: 'LAK-9TO5-001',
    barcode: '890103078901',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Built-in primer with SPF 20 for seamless Indian weather wear. Gives high medium buildable coverage that glides easily and leaves an even natural matte finish lasting 16 hours.',
    ingredients: 'Aqua, Cyclopentasiloxane, Titanium Dioxide, Dimethicone, Ethylhexyl Methoxycinnamate, Niacinamide, Silica, Tocopheryl Acetate, Iron Oxides (CI 77491, CI 77492, CI 77499).',
    allergyTags: ['Paraben-Free', 'Non-Comedogenic', 'Dermatologically Tested', 'SPF 20'],
    shades: [
      { id: 'sh-01', name: 'Warm Crème W120', code: 'W120', hex: '#F6D9C0', undertone: 'warm', finish: 'matte', coverage: 'medium', inStock: true },
      { id: 'sh-02', name: 'Natural Almond N140', code: 'N140', hex: '#EAC3A2', undertone: 'neutral', finish: 'matte', coverage: 'medium', inStock: true },
      { id: 'sh-03', name: 'Warm Honey W200', code: 'W200', hex: '#D7A783', undertone: 'warm', finish: 'matte', coverage: 'full', inStock: true },
      { id: 'sh-04', name: 'Golden Sand W240', code: 'W240', hex: '#C6936E', undertone: 'warm', finish: 'matte', coverage: 'full', inStock: true }
    ]
  },
  {
    id: 'prod-002',
    name: 'Maybelline New York Fit Me Matte + Poreless Liquid Foundation (Shade 128 Warm Nude)',
    brand: 'Maybelline New York',
    category: 'makeup',
    subcategory: 'face-makeup',
    price: 649,
    comparePrice: 699,
    rating: 4.9,
    reviewsCount: 3820,
    inStock: true,
    stockQuantity: 95,
    sku: 'MAY-FIT-128',
    barcode: '890103078902',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248597359-25f0a7199c36?w=800&auto=format&fit=crop&q=80'
    ],
    description: "India's highest selling foundation. Formulated with aerogel and clay micro-powders that control shine, blur pores, and adapt to warm Indian skin undertones.",
    ingredients: 'Aqua/Water, Cyclohexasiloxane, Nylon-12, Isododecane, Alcohol Denat., Cyclopentasiloxane, PEG-10 Dimethicone, Cetyl PEG/PPG-10/1 Dimethicone, HDI/Trimethylol Hexyllactone Crosspolymer, Titanium Dioxide, Iron Oxides.',
    allergyTags: ['Oil-Free', 'Dermatologist-Tested', 'Allergy-Tested', 'Non-Comedogenic'],
    shades: [
      { id: 'sh-05', name: '128 Warm Nude', code: '128', hex: '#E7BD9C', undertone: 'warm', finish: 'matte', coverage: 'medium', inStock: true },
      { id: 'sh-06', name: '220 Natural Beige', code: '220', hex: '#D6A885', undertone: 'warm', finish: 'matte', coverage: 'medium', inStock: true },
      { id: 'sh-07', name: '310 Sun Beige', code: '310', hex: '#BA835C', undertone: 'neutral', finish: 'matte', coverage: 'full', inStock: true }
    ]
  },
  {
    id: 'prod-003',
    name: 'L’Oréal Paris Revitalift 1.5% Hyaluronic Acid Hydrating Plump Serum',
    brand: "L'Oréal Paris",
    category: 'skincare',
    subcategory: 'skincare',
    price: 999,
    comparePrice: 1099,
    rating: 4.92,
    reviewsCount: 2190,
    inStock: true,
    stockQuantity: 140,
    sku: 'LOR-REV-003',
    barcode: '890103078903',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1608248597359-25f0a7199c36?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Our highest concentration of Pure Hyaluronic Acid (0.5% Macro + 1.0% Micro HA) that instantly hydrates and plumps skin by +42% in 1 hour. Fragrance-free and safe for sensitive skin.',
    ingredients: 'Aqua/Water, Glycerin, Hydroxyethylpiperazine Ethane Sulfonic Acid, Sodium Hyaluronate, PEG-60 Hydrogenated Castor Oil, Secale Cereale Seed Extract, Calcium Pantothenate, Dipeptide Diaminobutyroyl Benzylamide Diacetate, Ascorbyl Glucoside.',
    allergyTags: ['Fragrance-Free', 'Paraben-Free', 'Mineral Oil-Free', 'Synthetic Dye-Free'],
    shades: []
  },
  {
    id: 'prod-004',
    name: 'Minimalist 10% Niacinamide + Zinc Daily Blemish Serum',
    brand: 'Minimalist',
    category: 'skincare',
    subcategory: 'skincare',
    price: 599,
    comparePrice: 649,
    rating: 4.88,
    reviewsCount: 2840,
    inStock: true,
    stockQuantity: 210,
    sku: 'MIN-NIA-004',
    barcode: '890103078904',
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Clinically proven pure 10% Vitamin B3 with 1% Zinc PCA and Aloe Juice. Fades stubborn dark spots, reduces excess sebum production, and evens out hyperpigmentation.',
    ingredients: 'Aloe Barbadensis Leaf Juice, Niacinamide, Dimethyl Isosorbide, Propanediol, Ethoxydiglycol, Zinc PCA, Phenoxyethanol, Ethylhexylglycerin, Hydroxyethylcellulose, Pullulan.',
    allergyTags: ['Fragrance-Free', 'Essential Oil-Free', 'Non-Comedogenic', 'Clean Clinical'],
    shades: []
  },
  {
    id: 'prod-005',
    name: 'Plum Green Tea Pore Cleansing Face Wash with Glycolic Acid',
    brand: 'Plum Goodness',
    category: 'skincare',
    subcategory: 'skincare',
    price: 345,
    comparePrice: 395,
    rating: 4.75,
    reviewsCount: 1640,
    inStock: true,
    stockQuantity: 115,
    sku: 'PLU-GNT-005',
    barcode: '890103078905',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Soap-free, non-drying foaming face wash enriched with green tea antioxidants and gentle glycolic acid cellulose beads that combat active acne without stripping moisture.',
    ingredients: 'Aqua, Camellia Sinensis (Green Tea) Leaf Extract, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycolic Acid, Glycerin, Cellulose Beads, Phenoxyethanol.',
    allergyTags: ['100% Vegan', 'Cruelty-Free', 'Paraben-Free', 'Phthalate-Free'],
    shades: []
  },
  {
    id: 'prod-006',
    name: 'Dot & Key Watermelon Hyaluronic Cooling Sunscreen SPF 50+ PA+++',
    brand: 'Dot & Key',
    category: 'skincare',
    subcategory: 'skincare',
    price: 495,
    comparePrice: 545,
    rating: 4.85,
    reviewsCount: 1890,
    inStock: true,
    stockQuantity: 160,
    sku: 'DOT-WML-006',
    barcode: '890103078906',
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Zero white cast, ultra-lightweight watery fluid sunscreen powered by fresh watermelon extract and hyaluronic acid. Shields against UVA/UVB and blue light with an instant cooling effect.',
    ingredients: 'Aqua, Ethylhexyl Methoxycinnamate, Zinc Oxide, Citrullus Lanatus (Watermelon) Fruit Extract, Sodium Hyaluronate, Butyl Methoxydibenzoylmethane, Dimethicone, Tocopherol.',
    allergyTags: ['Zero White Cast', 'Reef Safe', 'Broad Spectrum', 'Alcohol-Free'],
    shades: []
  },
  {
    id: 'prod-007',
    name: 'Mamaearth Onion Hair Oil with Redensyl for Hair Fall Control',
    brand: 'Mamaearth',
    category: 'haircare',
    subcategory: 'haircare',
    price: 419,
    comparePrice: 499,
    rating: 4.68,
    reviewsCount: 3120,
    inStock: true,
    stockQuantity: 130,
    sku: 'MAM-ONI-007',
    barcode: '890103078907',
    isBestSeller: false,
    isNewArrival: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Enriched with sulfur-rich onion seed oil, Redensyl, bhringraj, and almond oil. Nourishes follicles, curbs scalp itching, and stimulates healthy hair density.',
    ingredients: 'Helianthus Annuus (Sunflower) Seed Oil, Allium Cepa (Onion) Seed Oil, Redensyl, Prunus Amygdalus Dulcis (Almond) Oil, Eclipta Alba (Bhringraj) Oil, Castor Oil, Vitamin E.',
    allergyTags: ['Mineral Oil-Free', 'Silicone-Free', 'Dermatologically Tested', 'Contains Nut Oil (Almond)'],
    shades: []
  },
  {
    id: 'prod-008',
    name: 'SUGAR Cosmetics Matte As Hell Crayon Lipstick (01 Scarlett O’Hara)',
    brand: 'SUGAR Cosmetics',
    category: 'makeup',
    subcategory: 'lip-makeup',
    price: 849,
    comparePrice: 899,
    rating: 4.89,
    reviewsCount: 1540,
    inStock: true,
    stockQuantity: 88,
    sku: 'SUG-MAH-008',
    barcode: '890103078908',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A cult-favourite bold red matte lip crayon engineered for intense coverage in a single stroke. Transfer-proof, feather-light, and packaged with its own custom sharpener.',
    ingredients: 'Dimethicone, Diisostearyl Malate, Synthetic Wax, Polyethylene, Cera Microcristallina, Caprylyl Methicone, Tocopheryl Acetate, CI 15850, CI 77491.',
    allergyTags: ['Cruelty-Free', 'Wax-Infused', 'Non-Toxic Pigments'],
    shades: [
      { id: 'sh-08', name: '01 Scarlett O’Hara (Red)', code: '01', hex: '#A81C28', undertone: 'cool', finish: 'matte', coverage: 'full', inStock: true },
      { id: 'sh-09', name: '07 Viola (Mauve Nude)', code: '07', hex: '#8C5464', undertone: 'neutral', finish: 'matte', coverage: 'full', inStock: true },
      { id: 'sh-10', name: '10 Cherry Darling (Deep Berry)', code: '10', hex: '#631B2D', undertone: 'warm', finish: 'matte', coverage: 'full', inStock: true }
    ]
  },
  {
    id: 'prod-009',
    name: 'Kay Beauty Matte HD Setting Compact Powder by Katrina Kaif',
    brand: 'Kay Beauty',
    category: 'makeup',
    subcategory: 'face-makeup',
    price: 799,
    comparePrice: 899,
    rating: 4.82,
    reviewsCount: 970,
    inStock: true,
    stockQuantity: 74,
    sku: 'KAY-MAT-009',
    barcode: '890103078909',
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Enriched with Avocado Butter & Mango Butter for zero cakiness. Gives a high-definition soft-focus blur that locks in foundation and controls humidity shine all day.',
    ingredients: 'Talc, Mica, Silica, Dimethicone, Persea Gratissima (Avocado) Butter, Mangifera Indica (Mango) Seed Butter, Zinc Stearate, Phenoxyethanol, Iron Oxides.',
    allergyTags: ['Cruelty-Free', 'Hydrating Butter Infused', 'Paraben-Free'],
    shades: [
      { id: 'sh-11', name: '110Y Light Yellow', code: '110Y', hex: '#F7DFBE', undertone: 'warm', finish: 'matte', coverage: 'sheer', inStock: true },
      { id: 'sh-12', name: '130N Medium Olive', code: '130N', hex: '#DEC2A0', undertone: 'neutral', finish: 'matte', coverage: 'sheer', inStock: true }
    ]
  },
  {
    id: 'prod-010',
    name: 'The Derma Co 2% Salicylic Acid Face Serum for Active Acne',
    brand: 'The Derma Co',
    category: 'skincare',
    subcategory: 'skincare',
    price: 499,
    comparePrice: 549,
    rating: 4.78,
    reviewsCount: 1410,
    inStock: true,
    stockQuantity: 110,
    sku: 'TDC-SAL-010',
    barcode: '890103078910',
    isBestSeller: false,
    isNewArrival: false,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Formulated with 2% Salicylic Acid, Witch Hazel, and Willow Bark extract. Penetrates deep into congested pores to eliminate whiteheads, blackheads, and hormonal pimples.',
    ingredients: 'Aqua, Ethoxydiglycol, Salicylic Acid, Hamamelis Virginiana (Witch Hazel) Extract, Salix Alba (Willow) Bark Extract, Hydroxyethylcellulose, Zinc PCA, Phenoxyethanol.',
    allergyTags: ['BHA Exfoliant', 'Fragrance-Free', 'Alcohol-Free', 'Derm Tested'],
    shades: []
  },
  {
    id: 'prod-011',
    name: 'Cetaphil Gentle Skin Cleanser for Sensitive Skin',
    brand: 'Cetaphil',
    category: 'skincare',
    subcategory: 'skincare',
    price: 399,
    comparePrice: 425,
    rating: 4.94,
    reviewsCount: 5120,
    inStock: true,
    stockQuantity: 240,
    sku: 'CET-GEN-011',
    barcode: '890103078911',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Doctor recommended creamy cleanser with hydrating Vitamin B3 (Niacinamide), Provitamin B5 (Panthenol), and Glycerin. Defends against 5 signs of skin sensitivity.',
    ingredients: 'Water, Cetyl Alcohol, Propylene Glycol, Sodium Lauryl Sulfate, Stearyl Alcohol, Methylparaben, Propylparaben, Butylparaben.',
    allergyTags: ['Soap-Free', 'Hypoallergenic', 'Dermatologist Recommended', 'Fragrance-Free'],
    shades: []
  },
  {
    id: 'prod-012',
    name: 'Royal Velvet Oud & Rose Eau de Parfum (100ml)',
    brand: 'SHOPSYNC Haute Parfumerie',
    category: 'fragrance',
    subcategory: 'fragrance',
    price: 1850,
    comparePrice: 2200,
    rating: 4.95,
    reviewsCount: 310,
    inStock: true,
    stockQuantity: 45,
    sku: 'SS-OUD-012',
    barcode: '890103078912',
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'An opulent royal Indian oriental blend of Damascus Rose, aged Assam Agarwood (Oud), saffron threads, and warm amber cashmere. Long lasting sillage for up to 18 hours.',
    ingredients: 'Alcohol Denat., Parfum/Fragrance, Aqua, Benzyl Salicylate, Linalool, Alpha-Isomethyl Ionone, Citronellol, Geraniol, Coumarin.',
    allergyTags: ['Long-Lasting EDP', 'Cruelty-Free', 'Artisanal Blend', 'Contains Fragrance'],
    shades: []
  }
]

export const COMMON_ALLERGENS = [
  { id: 'fragrance', name: 'Synthetic Fragrance / Parfum', count: '4 Products', severity: 'High' },
  { id: 'parabens', name: 'Parabens (Methyl/Propyl)', count: '1 Product', severity: 'High' },
  { id: 'sulfates', name: 'Sulfates (SLS / SLES)', count: '2 Products', severity: 'Medium' },
  { id: 'nut-oils', name: 'Tree Nut & Almond Oils', count: '1 Product (Hair Oil)', severity: 'Medium' },
  { id: 'essential-oils', name: 'Citrus & Herbal Extracts', count: '2 Products', severity: 'Low' },
  { id: 'salicylic', name: 'Salicylic Acid / BHA Actives', count: '1 Product', severity: 'Medium' }
]

export const INDIAN_ADDRESSES = [
  {
    id: 'addr-in-1',
    title: 'Vadodara Residence (Default)',
    fullName: 'Ananya Sharma',
    phone: '+91 98251 45890',
    street: 'B-402, Sun Villa, Near Akota Garden, Old Padra Road',
    city: 'Vadodara',
    state: 'Gujarat',
    pinCode: '390007',
    country: 'India',
    isDefault: true
  },
  {
    id: 'addr-in-2',
    title: 'Mumbai Studio',
    fullName: 'Ananya Sharma',
    phone: '+91 98251 45890',
    street: 'Flat 12B, Sea Crest Towers, Bandra West, Off Carter Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400050',
    country: 'India',
    isDefault: false
  },
  {
    id: 'addr-in-3',
    title: 'Bengaluru Tech Office',
    fullName: 'Ananya Sharma',
    phone: '+91 98251 45890',
    street: '4th Floor, Salarpuria Symphony, Koramangala 4th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560034',
    country: 'India',
    isDefault: false
  }
]

export const MOCK_REVIEWS = [
  {
    id: 'rev-in-1',
    author: 'Priya Patel',
    city: 'Ahmedabad, Gujarat',
    rating: 5,
    date: '28 October 2026',
    verified: true,
    shade: '128 Warm Nude',
    comment: 'The Maybelline 128 foundation match suggested by SHOPSYNC AI was spot-on for my warm Gujarati undertone! Lasted through a humid festive evening without any greasiness.',
    productName: 'Maybelline Fit Me Matte + Poreless (Shade 128)'
  },
  {
    id: 'rev-in-2',
    author: 'Rhea Deshmukh',
    city: 'Mumbai, Maharashtra',
    rating: 5,
    date: '22 October 2026',
    verified: true,
    shade: '01 Scarlett O’Hara',
    comment: 'The fastest delivery in Mumbai! Ordered at 10 AM, received in Bandra by 4 PM. The SUGAR Matte As Hell crayon stays put through coffee and lunch.',
    productName: 'SUGAR Matte As Hell Crayon Lipstick'
  },
  {
    id: 'rev-in-3',
    author: 'Dr. Meera Nambiar',
    city: 'Bengaluru, Karnataka',
    rating: 5,
    date: '15 October 2026',
    verified: true,
    shade: null,
    comment: 'As a dermatologist, I love that SHOPSYNC flags ingredient conflicts and allergens during checkout. Minimalist 10% Niacinamide is clean, effective, and perfectly priced at ₹599.',
    productName: 'Minimalist 10% Niacinamide + Zinc Serum'
  }
]
