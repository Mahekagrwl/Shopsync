import React, { createContext, useContext, useState, useEffect } from 'react'
import { BEAUTY_PRODUCTS } from '../data/mockBeautyData'
import { posApi } from '../services/api'

const POSContext = createContext()

const INITIAL_INVOICES = [
  {
    invoiceNumber: 'INV-IN-2026-0891',
    timestamp: '2026-10-31T16:42:00Z',
    cashierName: 'Mahek Merchant',
    terminalId: 'POS-01-VADODARA',
    customerName: 'Pooja Shah',
    items: [
      { name: 'Lakmé 9 to 5 Primer + Matte Foundation (W120)', quantity: 1, price: 525 },
      { name: 'SUGAR Cosmetics Matte As Hell Crayon (01 Scarlett)', quantity: 1, price: 849 }
    ],
    subtotal: 1374,
    discount: 137,
    tax: 62,
    total: 1299,
    paymentMethod: 'UPI / QR Code (PhonePe)',
    status: 'Paid'
  },
  {
    invoiceNumber: 'INV-IN-2026-0890',
    timestamp: '2026-10-31T15:20:00Z',
    cashierName: 'Mahek Merchant',
    terminalId: 'POS-01-VADODARA',
    customerName: 'Walk-in Boutique Client',
    items: [
      { name: 'Minimalist 10% Niacinamide + Zinc Serum', quantity: 2, price: 599 }
    ],
    subtotal: 1198,
    discount: 0,
    tax: 60,
    total: 1258,
    paymentMethod: 'Cash (Received ₹1,500.00, Change ₹242.00)',
    status: 'Paid'
  }
]

export function POSProvider({ children }) {
  const [posCart, setPosCart] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('shopsync_pos_invoices')
    return saved ? JSON.parse(saved) : INITIAL_INVOICES
  })
  const [terminalSession, setTerminalSession] = useState({
    terminalId: 'POS-01-VADODARA',
    storeLocation: 'Vadodara Flagship Boutique (Alkapuri)',
    cashierName: 'Mahek Merchant',
    openedAt: '2026-11-01T08:00:00Z',
    startingCash: 5000,
    totalCashSales: 18450,
    totalCardSales: 42800,
    status: 'Active Register Session'
  })

  useEffect(() => {
    localStorage.setItem('shopsync_pos_invoices', JSON.stringify(invoices))
  }, [invoices])

  const addToPosCart = (product, shade = null) => {
    const key = `${product.id}-${shade ? shade.id : 'std'}`
    setPosCart(prev => {
      const existing = prev.find(item => item.key === key)
      if (existing) {
        return prev.map(item =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [
          ...prev,
          {
            key,
            productId: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            shade,
            sku: product.sku,
            barcode: product.barcode,
            quantity: 1,
            image: product.images ? product.images[0] : ''
          }
        ]
      }
    })
  }

  const updatePosQty = (key, qty) => {
    if (qty <= 0) {
      setPosCart(prev => prev.filter(item => item.key !== key))
    } else {
      setPosCart(prev =>
        prev.map(item => (item.key === key ? { ...item, quantity: qty } : item))
      )
    }
  }

  const removePosItem = (key) => {
    setPosCart(prev => prev.filter(item => item.key !== key))
  }

  const clearPosCart = () => {
    setPosCart([])
    setDiscountPercent(0)
    setSelectedCustomer(null)
  }

  // POS calculations
  const subtotal = posCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = (subtotal * discountPercent) / 100
  const taxableSubtotal = Math.max(0, subtotal - discountAmount)
  const tax = taxableSubtotal * 0.0825
  const total = taxableSubtotal + tax

  // Process POS checkout
  const completePosSale = async (paymentMethod, cashTendered = 0) => {
    const invoiceNum = 'INV-2026-' + Math.floor(1000 + Math.random() * 9000)
    const changeDue = Math.max(0, cashTendered - total)

    const payload = {
      customer_id: selectedCustomer?.id || null,
      customer_name: selectedCustomer ? selectedCustomer.name : 'Walk-in Client',
      terminal_id: terminalSession.terminalId,
      cashier_name: terminalSession.cashierName,
      discount_percentage: discountPercent,
      tender_type: paymentMethod === 'cash' ? 'Cash' : paymentMethod,
      items: posCart.map(i => ({
        product_id: i.productId,
        product_name: i.name,
        shade_id: i.shade ? i.shade.id : null,
        shade_name: i.shade ? i.shade.name : null,
        quantity: i.quantity,
        unit_price: i.price
      }))
    }

    let backendInvoiceNumber = invoiceNum
    try {
      const res = await posApi.checkout(payload)
      if (res?.invoice?.invoice_number) {
        backendInvoiceNumber = res.invoice.invoice_number
      }
    } catch (e) {
      console.warn('POS transaction fallback to local register state:', e.message)
    }

    const newInvoice = {
      invoiceNumber: backendInvoiceNumber,
      timestamp: new Date().toISOString(),
      cashierName: terminalSession.cashierName,
      terminalId: terminalSession.terminalId,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Client',
      items: posCart.map(i => ({
        name: `${i.name}${i.shade ? ` (${i.shade.name})` : ''}`,
        quantity: i.quantity,
        price: i.price
      })),
      subtotal,
      discount: discountAmount,
      tax,
      total,
      paymentMethod: paymentMethod === 'cash'
        ? `Cash (Received $${cashTendered.toFixed(2)}, Change $${changeDue.toFixed(2)})`
        : paymentMethod,
      status: 'Paid'
    }

    setInvoices(prev => [newInvoice, ...prev])
    clearPosCart()
    return newInvoice
  }

  return (
    <POSContext.Provider
      value={{
        posCart,
        addToPosCart,
        updatePosQty,
        removePosItem,
        clearPosCart,
        selectedCustomer,
        setSelectedCustomer,
        discountPercent,
        setDiscountPercent,
        subtotal,
        discountAmount,
        tax,
        total,
        terminalSession,
        invoices,
        completePosSale
      }}
    >
      {children}
    </POSContext.Provider>
  )
}

export function usePOS() {
  const context = useContext(POSContext)
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider')
  }
  return context
}

export default POSContext
