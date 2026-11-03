import React, { createContext, useContext, useState, useEffect } from 'react'
import { BEAUTY_PRODUCTS, CATEGORIES, BRANDS } from '../data/mockBeautyData'
import { productsApi } from '../services/api'

const ProductContext = createContext()

const STORAGE_KEY = 'shopsync_inventory_products'
const MOVEMENTS_KEY = 'shopsync_stock_movements'

export function ProductProvider({ children }) {
  // Central product state initialized from storage or default data
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Ensure cache contains complete categories, no legacy broken images, and authenticated foundation photos
        const hasAllCategories = parsed.some(p => p.category === 'bodycare') && parsed.some(p => p.category === 'accessories')
        const hasBrokenImage = parsed.some(p => p.images && p.images.some(img => img.includes('photo-1608248597359-25f0a7199c36')))
        const hasTargetFoundationImages = parsed.some(p => p.id === 'prod-001' && p.images && p.images.some(img => img.includes('photo-1557205465'))) && parsed.some(p => p.id === 'prod-002' && p.images && p.images.some(img => img.includes('photo-1627384113')))
        if (Array.isArray(parsed) && parsed.length >= 20 && hasAllCategories && !hasBrokenImage && hasTargetFoundationImages) {
          return parsed
        }
      }
    } catch (e) {
      console.warn('Error reading stored products:', e)
    }
    // Seed fresh master dataset
    return BEAUTY_PRODUCTS
  })

  // Stock movement history
  const [stockMovements, setStockMovements] = useState(() => {
    try {
      const saved = localStorage.getItem(MOVEMENTS_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Persist products on any change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(stockMovements))
  }, [stockMovements])

  // Try fetching live products from backend if online
  useEffect(() => {
    let isMounted = true
    const syncBackend = async () => {
      try {
        const res = await productsApi.getAll()
        if (res && res.products && res.products.length > 0 && isMounted) {
          // Merge with local state to preserve frontend product catalog integrity and stocks
          setProducts(prev => {
            return prev.map(p => {
              const remote = res.products.find(r => r.id === p.id)
              if (!remote) return p
              return {
                ...remote,
                ...p,
                stockQuantity: p.stockQuantity ?? remote.stock
              }
            })
          })
        }
      } catch {
        // Backend offline or unreachable, local central state continues seamlessly
      }
    }
    syncBackend()
    return () => { isMounted = false }
  }, [])

  // 1. Get single product with live stock
  const getProduct = (productId) => {
    return products.find(p => p.id === productId) || null
  }

  // 2. Validate available stock before adding to cart or checking out
  const validateStock = (productId, shadeId = null, requestedQty = 1) => {
    const prod = getProduct(productId)
    if (!prod) {
      return { valid: false, error: 'Product not found in atelier catalog.' }
    }

    const available = prod.stockQuantity ?? 0
    if (available <= 0 || !prod.inStock) {
      return {
        valid: false,
        available: 0,
        error: `"${prod.name}" is currently sold out.`
      }
    }

    if (requestedQty > available) {
      return {
        valid: false,
        available,
        error: `Only ${available} unit${available === 1 ? '' : 's'} of "${prod.name}" available in stock.`
      }
    }

    return { valid: true, available }
  }

  // 3. Central Atomic Stock Deduction (Shared by Online Storefront & Seller POS)
  const deductStock = (items, transactionType = 'online_order', referenceId = '') => {
    // First, validate all items to ensure none exceed available stock
    for (const item of items) {
      const pId = item.productId || item.product_id || item.id
      const qty = item.quantity || 1
      const validation = validateStock(pId, item.shade?.id || item.shade_id, qty)
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        }
      }
    }

    // Apply deductions atomically
    const newMovements = []
    setProducts(prev => {
      return prev.map(product => {
        const itemToDeduct = items.find(
          i => (i.productId || i.product_id || i.id) === product.id
        )

        if (itemToDeduct) {
          const qty = itemToDeduct.quantity || 1
          const newQty = Math.max(0, (product.stockQuantity ?? 0) - qty)

          newMovements.push({
            id: 'mov-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            productId: product.id,
            productName: product.name,
            quantity: -qty,
            previousStock: product.stockQuantity ?? 0,
            remainingStock: newQty,
            movementType: transactionType, // 'online_order' or 'pos_sale'
            referenceId,
            timestamp: new Date().toISOString()
          })

          return {
            ...product,
            stockQuantity: newQty,
            inStock: newQty > 0
          }
        }
        return product
      })
    })

    if (newMovements.length > 0) {
      setStockMovements(prev => [...newMovements, ...prev])
    }

    return { success: true }
  }

  // 4. Stock Restoration on Cancellation or Refund
  const restoreStock = (items, reason = 'cancelled_order', referenceId = '') => {
    const newMovements = []
    setProducts(prev => {
      return prev.map(product => {
        const itemToRestore = items.find(
          i => (i.productId || i.product_id || i.id) === product.id
        )

        if (itemToRestore) {
          const qty = itemToRestore.quantity || 1
          const newQty = (product.stockQuantity ?? 0) + qty

          newMovements.push({
            id: 'mov-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            productId: product.id,
            productName: product.name,
            quantity: +qty,
            previousStock: product.stockQuantity ?? 0,
            remainingStock: newQty,
            movementType: reason, // 'cancelled_order' or 'pos_refund'
            referenceId,
            timestamp: new Date().toISOString()
          })

          return {
            ...product,
            stockQuantity: newQty,
            inStock: true
          }
        }
        return product
      })
    })

    if (newMovements.length > 0) {
      setStockMovements(prev => [...newMovements, ...prev])
    }

    return { success: true }
  }

  // 5. Admin / Seller Stock Adjustment
  const adjustProductStock = (productId, newQuantity, reason = 'inventory_audit') => {
    setProducts(prev => {
      return prev.map(p => {
        if (p.id === productId) {
          const prevQty = p.stockQuantity ?? 0
          const diff = newQuantity - prevQty

          setStockMovements(m => [
            {
              id: 'mov-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
              productId: p.id,
              productName: p.name,
              quantity: diff,
              previousStock: prevQty,
              remainingStock: newQuantity,
              movementType: reason,
              timestamp: new Date().toISOString()
            },
            ...m
          ])

          return {
            ...p,
            stockQuantity: Math.max(0, newQuantity),
            inStock: newQuantity > 0
          }
        }
        return p
      })
    })
    return { success: true }
  }

  // 6. Reset to default initial stock
  const resetInventoryToDefault = () => {
    setProducts(BEAUTY_PRODUCTS)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(MOVEMENTS_KEY)
    setStockMovements([])
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        categories: CATEGORIES,
        brands: BRANDS,
        getProduct,
        validateStock,
        deductStock,
        restoreStock,
        adjustProductStock,
        stockMovements,
        resetInventoryToDefault
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

export default ProductContext
