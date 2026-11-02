import React, { createContext, useContext, useState, useEffect } from 'react'
import { ordersApi } from '../services/api'

const CartContext = createContext()

const INITIAL_CART = [
  {
    cartItemId: 'item-1',
    productId: 'prod-001',
    name: 'Lakmé 9 to 5 Primer + Matte Perfect Cover Foundation',
    brand: 'Lakmé',
    price: 525,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    quantity: 1,
    shade: {
      id: 'sh-01',
      name: 'Warm Crème W120',
      code: 'W120',
      hex: '#F6D9C0',
      undertone: 'warm',
      finish: 'matte',
      coverage: 'medium'
    },
    sku: 'LAK-9TO5-001'
  },
  {
    cartItemId: 'item-2',
    productId: 'prod-004',
    name: 'Minimalist 10% Niacinamide + Zinc Daily Blemish Serum',
    brand: 'Minimalist',
    price: 599,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    quantity: 1,
    shade: null,
    sku: 'MIN-NIA-004'
  }
]

const INITIAL_ORDERS = [
  {
    id: 'ORD-IN-9842',
    orderNumber: 'SS-IN-984210',
    date: '2026-10-28T14:30:00Z',
    status: 'In Transit',
    trackingNumber: 'BD-9842881-IN',
    carrier: 'Blue Dart Luxury Express',
    estimatedDelivery: 'Tomorrow by 4:00 PM',
    items: [
      {
        name: 'L’Oréal Paris Revitalift 1.5% Hyaluronic Acid Hydrating Plump Serum',
        brand: "L'Oréal Paris",
        price: 999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1608248597359-25f0a7199c36?w=800&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 999,
    discount: 150,
    tax: 42,
    shipping: 0,
    total: 891,
    paymentMethod: 'UPI (ananya@okhdfcbank)',
    shippingAddress: 'B-402, Sun Villa, Near Akota Garden, Old Padra Road, Vadodara, Gujarat 390007'
  },
  {
    id: 'ORD-IN-7719',
    orderNumber: 'SS-IN-771904',
    date: '2026-10-12T11:15:00Z',
    status: 'Delivered',
    trackingNumber: 'DEL-7719042-IN',
    carrier: 'Delhivery Priority Air',
    estimatedDelivery: 'Delivered on Oct 14',
    items: [
      {
        name: 'Dot & Key Watermelon Hyaluronic Cooling Sunscreen SPF 50+',
        brand: 'Dot & Key',
        price: 495,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 990,
    discount: 0,
    tax: 48,
    shipping: 0,
    total: 1038,
    paymentMethod: 'HDFC Credit Card (ending in 4242)',
    shippingAddress: 'Flat 12B, Sea Crest Towers, Bandra West, Mumbai, Maharashtra 400050'
  }
]

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('shopsync_cart')
    return saved ? JSON.parse(saved) : INITIAL_CART
  })

  const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoError, setPromoError] = useState('')
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('shopsync_orders')
    return saved ? JSON.parse(saved) : INITIAL_ORDERS
  })

  useEffect(() => {
    localStorage.setItem('shopsync_cart', JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem('shopsync_orders', JSON.stringify(orders))
  }, [orders])

  const addToCart = (product, shade = null, quantity = 1) => {
    // If product is makeup or has shades, require shade selection!
    if ((product.category === 'makeup' || (product.shades && product.shades.length > 0)) && !shade) {
      return {
        success: false,
        error: 'Please select your shade before adding this makeup product to bag.'
      }
    }

    const cartItemId = `${product.id}-${shade ? shade.id : 'default'}`

    setCartItems(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId)
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [
          ...prev,
          {
            cartItemId,
            productId: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.images ? product.images[0] : '',
            quantity,
            shade,
            sku: product.sku,
            category: product.category
          }
        ]
      }
    })

    return { success: true }
  }

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId))
  }

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    setAppliedPromo(null)
  }

  const applyPromoCode = (code) => {
    setPromoError('')
    const cleanCode = code.trim().toUpperCase()
    if (cleanCode === 'SHOPSYNC15') {
      setAppliedPromo({ code: 'SHOPSYNC15', discountPercent: 15, label: '15% Off VIP Welcome' })
      return { success: true }
    } else if (cleanCode === 'WELCOME20') {
      setAppliedPromo({ code: 'WELCOME20', discountPercent: 20, label: '20% Off Launch Special' })
      return { success: true }
    } else {
      setPromoError('Invalid promo code. Try SHOPSYNC15 or WELCOME20')
      return { success: false, error: 'Invalid promo code' }
    }
  }

  const removePromoCode = () => {
    setAppliedPromo(null)
    setPromoError('')
  }

  // Calculations in INR
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const discountAmount = appliedPromo ? Math.round((subtotal * appliedPromo.discountPercent) / 100) : 0
  const discountedSubtotal = Math.max(0, subtotal - discountAmount)
  // Free Express Shipping across India for orders above ₹499
  const shippingFee = discountedSubtotal >= 499 || discountedSubtotal === 0 ? 0 : 49
  // 5% GST on beauty & cosmetics
  const taxRate = 0.05
  const estimatedTax = Math.round(discountedSubtotal * taxRate)
  const grandTotal = discountedSubtotal > 0 ? discountedSubtotal + shippingFee + estimatedTax : 0
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  // Checkout submission
  const createOrder = async (orderData) => {
    let orderNumber = 'SS-IN-' + Math.floor(100000 + Math.random() * 900000)
    let trackingNumber = 'BD-' + Math.floor(1000000 + Math.random() * 9000000) + '-IN'

    const payload = {
      customer_name: orderData.fullName || orderData.customerName || 'Ananya Sharma',
      customer_email: orderData.email || 'ananya.sharma@shopsync.in',
      shipping_address: orderData.shippingAddress || 'B-402, Sun Villa, Near Akota Garden, Old Padra Road, Vadodara, Gujarat 390007',
      payment_method: orderData.paymentMethod || 'UPI / Razorpay',
      discount_amount: discountAmount,
      shipping_amount: shippingFee,
      items: cartItems.map(item => ({
        product_id: item.productId,
        product_name: item.name,
        shade_id: item.shade ? item.shade.id : null,
        shade_name: item.shade ? item.shade.name : null,
        quantity: item.quantity,
        unit_price: item.price
      }))
    }

    try {
      const res = await ordersApi.create(payload)
      if (res?.order?.order_number) {
        orderNumber = res.order.order_number
        trackingNumber = res.order.tracking_number
      }
    } catch (e) {
      console.warn('Online order fallback to local store state:', e.message)
    }

    const newOrder = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      orderNumber,
      date: new Date().toISOString(),
      status: 'Order Placed',
      trackingNumber,
      carrier: 'FedEx Luxury Express',
      estimatedDelivery: '3 to 5 business days',
      items: [...cartItems],
      subtotal,
      discount: discountAmount,
      tax: estimatedTax,
      shipping: shippingFee,
      total: grandTotal,
      paymentMethod: orderData.paymentMethod || 'Credit Card',
      shippingAddress: orderData.shippingAddress || 'Default Address',
      contactEmail: orderData.email || 'customer@example.com'
    }

    setOrders(prev => [newOrder, ...prev])
    clearCart()
    return newOrder
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemCount,
        subtotal,
        discountAmount,
        appliedPromo,
        promoError,
        shippingFee,
        estimatedTax,
        grandTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode,
        orders,
        createOrder
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext
