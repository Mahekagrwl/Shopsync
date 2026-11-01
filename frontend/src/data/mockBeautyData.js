/**
 * ShopSync Master Beauty Data Store
 * Realistic, high-fidelity beauty products, shade variants, categories, brands, and mock stores.
 */

export const CATEGORIES = [
  { id: 'skincare', name: 'Skincare', slug: 'skincare', icon: 'Sparkles', description: 'Clinically proven serums, moisturizers & treatments' },
  { id: 'makeup', name: 'Makeup', slug: 'makeup', icon: 'Palette', description: 'Complexion perfecting, velvety eyes & couture lips' },
  { id: 'face-makeup', name: 'Face Makeup', slug: 'face-makeup', icon: 'Smile', parent: 'makeup', description: 'Foundations, concealers, blushes & setting powders' },
  { id: 'eye-makeup', name: 'Eye Makeup', slug: 'eye-makeup', icon: 'Eye', parent: 'makeup', description: 'Pigmented eyeshadow palettes, precise liners & mascaras' },
  { id: 'lip-makeup', name: 'Lip Makeup', slug: 'lip-makeup', icon: 'Heart', parent: 'makeup', description: 'Hydrating lip oils, satin lipsticks & precision liners' },
  { id: 'haircare', name: 'Haircare', slug: 'haircare', icon: 'Wind', description: 'Bond-repairing masks, clarifying shampoos & elixirs' },
  { id: 'body-care', name: 'Body Care', slug: 'body-care', icon: 'Shield', description: 'Botanical body oils, restorative creams & gentle polishes' },
  { id: 'sunscreen', name: 'Sunscreen', slug: 'sunscreen', icon: 'Sun', description: 'Broad spectrum SPF 50+, invisible mineral & chemical shields' },
  { id: 'accessories', name: 'Beauty Accessories', slug: 'accessories', icon: 'Scissors', description: 'Precision tools, rose quartz rollers & vegan brushes' },
]

export const BRANDS = [
  { id: 'lumina-botanics', name: 'Lumina Botanics', origin: 'Paris, France', badge: 'Clean Luxury' },
  { id: 'velour-atelier', name: 'Velour Atelier', origin: 'Milan, Italy', badge: 'High Pigment' },
  { id: 'aura-derm', name: 'AuraDerm Labs', origin: 'Seoul, Korea', badge: 'Clinical AI' },
  { id: 'celestial-glow', name: 'Celestial Glow', origin: 'Tokyo, Japan', badge: 'Bio-Fermented' },
  { id: 'sol-botanica', name: 'Sol Botanica', origin: 'Sydney, Australia', badge: 'Mineral SPF' },
]

export const BEAUTY_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Silk Radiance Flawless Luminous Foundation',
    brand: 'Velour Atelier',
    category: 'makeup',
    subcategory: 'face-makeup',
    price: 48.00,
    comparePrice: 58.00,
    rating: 4.9,
    reviewsCount: 342,
    inStock: true,
    stockQuantity: 84,
    sku: 'VA-FND-001',
    barcode: '890123450012',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A breathable, 24-hour weightless foundation that infuses skin with moisture while delivering customizable medium-to-full radiant coverage. Infused with micro-pearls and hyaluronic acid.',
    ingredients: 'Aqua/Water/Eau, Cyclopentasiloxane, Dimethicone, Glycerin, Sodium Hyaluronate, Niacinamide, Camellia Sinensis Leaf Extract, Tocopheryl Acetate, Titanium Dioxide, Iron Oxides.',
    allergyTags: ['Paraben-Free', 'Fragrance-Free', 'Cruelty-Free', 'Vegan', 'Non-Comedogenic'],
    shades: [
      { id: 'sh-01', name: 'Porcelain Light', code: '100W', hex: '#F9E4D4', undertone: 'warm', finish: 'dewy', coverage: 'medium', inStock: true },
      { id: 'sh-02', name: 'Ivory Petal', code: '110C', hex: '#F5DAC8', undertone: 'cool', finish: 'dewy', coverage: 'medium', inStock: true },
      { id: 'sh-03', name: 'Golden Sand', code: '210W', hex: '#EAC3A2', undertone: 'warm', finish: 'dewy', coverage: 'medium', inStock: true },
      { id: 'sh-04', name: 'Neutral Almond', code: '230N', hex: '#D8A880', undertone: 'neutral', finish: 'natural', coverage: 'medium', inStock: true },
      { id: 'sh-05', name: 'Honey Amber', code: '320W', hex: '#BE8358', undertone: 'warm', finish: 'natural', coverage: 'full', inStock: true },
      { id: 'sh-06', name: 'Espresso Velvet', code: '450N', hex: '#633B26', undertone: 'neutral', finish: 'matte', coverage: 'full', inStock: true },
    ]
  },
  {
    id: 'prod-002',
    name: 'Cellular Renewal Peptide Barrier Elixir',
    brand: 'AuraDerm Labs',
    category: 'skincare',
    subcategory: 'skincare',
    price: 72.00,
    comparePrice: 85.00,
    rating: 4.95,
    reviewsCount: 512,
    inStock: true,
    stockQuantity: 42,
    sku: 'AD-ELX-002',
    barcode: '890123450029',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248597359-25f0a7199c36?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A micro-encapsulated biomimetic serum designed to restore compromised moisture barriers in 72 hours. Blended with 5 multi-weight ceramides, copper peptides, and snow mushroom ferment.',
    ingredients: 'Centella Asiatica Leaf Water, Ceramide NP, Ceramide AP, Copper Tripeptide-1, Tremella Fuciformis Sporocarp Extract, Panthenol, Beta-Glucan, Squalane, Allantoin.',
    allergyTags: ['Fragrance-Free', 'Essential Oil-Free', 'Gluten-Free', 'Sulfate-Free', 'Hypoallergenic'],
    shades: []
  },
  {
    id: 'prod-003',
    name: 'Velvet Cloud Cashmere Matte Lipstick',
    brand: 'Velour Atelier',
    category: 'makeup',
    subcategory: 'lip-makeup',
    price: 32.00,
    comparePrice: 38.00,
    rating: 4.8,
    reviewsCount: 189,
    inStock: true,
    stockQuantity: 65,
    sku: 'VA-LIP-003',
    barcode: '890123450036',
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599732434712-4c220f86235d?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'An ultra-comfortable blur-matte lipstick formulated with meadowfoam seed oil and smoothing microspheres for a blurred petal-soft finish without parching.',
    ingredients: 'Dimethicone, Polyglyceryl-2 Triisostearate, Limnanthes Alba (Meadowfoam) Seed Oil, Butyrospermum Parkii Butter, Mica, Red 7 Lake, Iron Oxides, Tocopherol.',
    allergyTags: ['Cruelty-Free', 'Paraben-Free', 'Mineral Oil-Free'],
    shades: [
      { id: 'lip-01', name: 'Plum Couture', code: '01PC', hex: '#542B43', undertone: 'cool', finish: 'matte', coverage: 'full', inStock: true },
      { id: 'lip-02', name: 'Dusty Petal Rose', code: '02DR', hex: '#D9A6AC', undertone: 'neutral', finish: 'natural', coverage: 'medium', inStock: true },
      { id: 'lip-03', name: 'Nude Cashmere', code: '03NC', hex: '#C2897A', undertone: 'warm', finish: 'matte', coverage: 'full', inStock: true },
      { id: 'lip-04', name: 'French Scarlet', code: '04FS', hex: '#A31D24', undertone: 'warm', finish: 'matte', coverage: 'full', inStock: true }
    ]
  },
  {
    id: 'prod-004',
    name: 'Mineral Silk Fluid Broad Spectrum SPF 50+',
    brand: 'Sol Botanica',
    category: 'sunscreen',
    subcategory: 'sunscreen',
    price: 42.00,
    comparePrice: 48.00,
    rating: 4.88,
    reviewsCount: 278,
    inStock: true,
    stockQuantity: 95,
    sku: 'SB-SPF-004',
    barcode: '890123450043',
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80'
    ],
    description: '100% non-nano zinc oxide mineral shield that sinks instantly into skin leaving zero white cast, a velvety satin finish, and invisible blue light defense.',
    ingredients: 'Zinc Oxide 12.5%, Water/Aqua, Caprylic/Capric Triglyceride, Squalane, Ectoin, Niacinamide, Camellia Sinensis Seed Oil, Bisabolol, Silica, Iron Oxides.',
    allergyTags: ['Reef-Safe', 'Fragrance-Free', 'Non-Nano', 'Chemical-Filter-Free', 'Silicone-Free'],
    shades: []
  },
  {
    id: 'prod-005',
    name: 'Celestial Constellation 12-Pan Eyeshadow Palette',
    brand: 'Velour Atelier',
    category: 'makeup',
    subcategory: 'eye-makeup',
    price: 64.00,
    comparePrice: 75.00,
    rating: 4.92,
    reviewsCount: 146,
    inStock: true,
    stockQuantity: 38,
    sku: 'VA-EYE-005',
    barcode: '890123450050',
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583241800698-e8ab01c85b27?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Twelve rich velvety shades spanning ethereal champagne metallics, plum velvet mattes, and sparkling duo-chromes infused with crushed tourmaline.',
    ingredients: 'Talc, Synthetic Fluorphlogopite, Mica, Octyldodecyl Stearoyl Stearate, Calcium Sodium Borosilicate, Silica, Magnesium Myristate, Tin Oxide, Carmine.',
    allergyTags: ['Cruelty-Free', 'Paraben-Free'],
    shades: [
      { id: 'eye-01', name: 'Celestial Edition', code: 'PAL-01', hex: '#542B43', undertone: 'neutral', finish: 'dewy', coverage: 'full', inStock: true }
    ]
  },
  {
    id: 'prod-006',
    name: 'Caviar Molecular Bond Repair Hair Mask',
    brand: 'Celestial Glow',
    category: 'haircare',
    subcategory: 'haircare',
    price: 54.00,
    comparePrice: 62.00,
    rating: 4.87,
    reviewsCount: 220,
    inStock: true,
    stockQuantity: 52,
    sku: 'CG-HAR-006',
    barcode: '890123450067',
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A 5-minute intensive restorative hair reconstructor that repairs broken disulfide bonds, tames frizz by 94%, and deposits weightless glossy hydration.',
    ingredients: 'Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Hydrolyzed Pea Protein, Caviar Extract, Argania Spinosa Kernel Oil, Panthenol, Keratin Amino Acids.',
    allergyTags: ['Sulfate-Free', 'Paraben-Free', 'Color-Safe', 'Phthalate-Free'],
    shades: []
  },
  {
    id: 'prod-007',
    name: 'Botanical Resculpting Rose Quartz Facial Roller',
    brand: 'Lumina Botanics',
    category: 'accessories',
    subcategory: 'accessories',
    price: 28.00,
    comparePrice: 35.00,
    rating: 4.79,
    reviewsCount: 94,
    inStock: true,
    stockQuantity: 110,
    sku: 'LB-ACC-007',
    barcode: '890123450074',
    isBestSeller: false,
    isNewArrival: false,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Hand-carved authentic grade-A Madagascar rose quartz roller designed to lymphatic drain, soothe puffiness, and enhance serum absorption.',
    ingredients: '100% Natural Madagascar Rose Quartz, Zinc Alloy Gold-Tone Hardware.',
    allergyTags: ['Hypoallergenic', 'Non-Toxic', 'Plastic-Free'],
    shades: []
  },
  {
    id: 'prod-008',
    name: 'Nectarine Blossom Nourishing Body Soufflé',
    brand: 'Lumina Botanics',
    category: 'body-care',
    subcategory: 'body-care',
    price: 38.00,
    comparePrice: 44.00,
    rating: 4.84,
    reviewsCount: 167,
    inStock: true,
    stockQuantity: 47,
    sku: 'LB-BDY-008',
    barcode: '890123450081',
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1608248597359-25f0a7199c36?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Whipped triple-butter body cream infused with cold-pressed marula oil, bakuchiol, and radiant golden mica for satin hydration that lasts 48 hours.',
    ingredients: 'Aqua, Butyrospermum Parkii (Shea) Butter, Sclerocarya Birrea Seed Oil, Theobroma Cacao Seed Butter, Bakuchiol, Niacinamide, Glycerin, Sodium Hyaluronate.',
    allergyTags: ['Vegan', 'Cruelty-Free', 'Paraben-Free'],
    shades: []
  }
]

export const COMMON_ALLERGENS = [
  { id: 'fragrance', name: 'Synthetic Fragrance', count: '14 Products', severity: 'High' },
  { id: 'parabens', name: 'Parabens (Methyl/Propyl)', count: '0 Products (100% Free)', severity: 'High' },
  { id: 'sulfates', name: 'Sulfates (SLS / SLES)', count: '0 Products (100% Free)', severity: 'Medium' },
  { id: 'nut-oils', name: 'Tree Nut Oils (Almond/Macadamia)', count: '3 Products', severity: 'Medium' },
  { id: 'essential-oils', name: 'Citrus & Lavender Essential Oils', count: '5 Products', severity: 'Low' },
  { id: 'chemical-sunscreen', name: 'Oxybenzone & Octinoxate', count: '0 Products (Reef Safe)', severity: 'High' }
]

export const MOCK_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Elena Rostova',
    rating: 5,
    date: 'October 24, 2026',
    verified: true,
    shade: 'Porcelain Light 100W',
    comment: 'The shade match from the AI recommendation was shockingly accurate. No oxidation during a 14-hour shift, and my skin actually felt calmer when I washed it off.',
    productName: 'Silk Radiance Foundation'
  },
  {
    id: 'rev-2',
    author: 'Marcus Vance',
    rating: 5,
    date: 'October 19, 2026',
    verified: true,
    shade: 'Plum Couture',
    comment: 'Bought this for my partner at the boutique counter through their POS. The packaging is heavyweight luxury and the velvet formulation is breathtaking.',
    productName: 'Velvet Cloud Cashmere Lipstick'
  },
  {
    id: 'rev-3',
    author: 'Dr. Sophia Lin',
    rating: 5,
    date: 'September 28, 2026',
    verified: true,
    shade: null,
    comment: 'As a dermatologist, I love checking the SkinSafe ingredient checker before recommending products to my patients with rosacea. AuraDerm Barrier Elixir is top tier.',
    productName: 'Cellular Renewal Peptide Barrier Elixir'
  }
]
