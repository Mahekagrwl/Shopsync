import React, { createContext, useContext, useState, useEffect } from 'react'
import { ordersApi } from '../services/api'

const CartContext = createContext()

const INITIAL_CART = [
  {
    cartItemId: 'item-1',
    productId: 'prod-001',
    name: 'Silk Radiance Flawless Luminous Foundation',
    brand: 'Velour Atelier',
    price: 48.00,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    quantity: 1,
    shade: {
      id: 'sh-01',
      name: 'Porcelain Light',
      code: '100W',
      hex: '#F9E4D4',
      undertone: 'warm',
      finish: 'dewy',
      coverage: 'medium'
    },
    sku: 'VA-FND-001'
  },
  {
    cartItemId: 'item-2',
    productId: 'prod-002',
    name: 'Cellular Renewal Peptide Barrier Elixir',
    brand: 'AuraDerm Labs',
    price: 72.00,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    quantity: 1,
    shade: null,
    sku: 'AD-ELX-002'
  }
]

const INITIAL_ORDERS = [
  {
    id: 'ORD-9842',
    orderNumber: 'SS-984210',
    date: '2026-10-28T14:30:00Z',
    status: 'In Transit',
    trackingNumber: 'TRK-9842881-US',
    carrier: 'FedEx Luxury Express',
    estimatedDelivery: 'Tomorrow by 4:00 PM',
    items: [
      {
        name: 'Cellular Renewal Peptide Barrier Elixir',
        brand: 'AuraDerm Labs',
        price: 72.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 72.00,
    discount: 10.80,
    tax: 5.05,
    shipping: 0.00,
    total: 66.25,
    paymentMethod: 'Apple Pay (ending in 8841)',
    shippingAddress: '742 Evergreen Terrace, Apt 4B, San Francisco, CA 94107'
  },
  {
    id: 'ORD-7719',
    orderNumber: 'SS-771904',
    date: '2026-10-12T11:15:00Z',
    status: 'Delivered',
    trackingNumber: 'TRK-7719042-US',
    carrier: 'DHL Priority',
    estimatedDelivery: 'Delivered on Oct 14',
    items: [
      {
        name: 'Mineral Silk Fluid Broad Spectrum SPF 50+',
        brand: 'Sol Botanica',
        price: 42.00,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 84.00,
    discount: 0.00,
    tax: 6.93,
    shipping: 0.00,
    total: 90.93,
    paymentMethod: 'Visa (ending in 4242)',
    shippingAddress: '742 Evergreen Terrace, Apt 4B, San Francisco, CA 94107'
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

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const discountAmount = appliedPromo ? (subtotal * appliedPromo.discountPercent) / 100 : 0
  const discountedSubtotal = Math.max(0, subtotal - discountAmount)
  const shippingFee = discountedSubtotal > 50 || discountedSubtotal === 0 ? 0 : 5.99
  const taxRate = 0.0825
  const estimatedTax = discountedSubtotal * taxRate
  const grandTotal = discountedSubtotal > 0 ? discountedSubtotal + shippingFee + estimatedTax : 0
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  // Checkout submission
  const createOrder = async (orderData) => {
    let orderNumber = 'SS-' + Math.floor(100000 + Math.random() * 900000)
    let trackingNumber = 'TRK-' + Math.floor(1000000 + Math.random() * 9000000) + '-US'

    const payload = {
      customer_name: orderData.fullName || orderData.customerName || 'Camille Laurent',
      customer_email: orderData.email || 'camille.laurent@example.com',
      shipping_address: orderData.shippingAddress || '742 Evergreen Terrace',
      payment_method: orderData.paymentMethod || 'Credit Card',
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
