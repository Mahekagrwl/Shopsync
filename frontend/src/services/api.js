/**
 * ShopSync Central API Service
 * Fully integrated client connecting to Python FastAPI backend.
 * Provides fallback mock responses when backend is offline so UI remains resilient.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export async function apiClient(endpoint, options = {}) {
  const { data, headers = {}, ...customConfig } = options

  const token = localStorage.getItem('shopsync_token')

  const config = {
    method: data ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...customConfig,
  }

  if (data) {
    config.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const error = new Error(errorData.detail || `Request failed with status ${response.status}`)
      error.status = response.status
      error.data = errorData
      throw error
    }
    return await response.json()
  } catch (error) {
    console.warn(`[ShopSync API Request Notice] ${endpoint}:`, error.message)
    throw error
  }
}

// Health check endpoint for FastAPI backend
export async function checkBackendHealth() {
  const rootUrl = import.meta.env.VITE_API_ROOT_URL || 'http://localhost:8000'
  try {
    const res = await fetch(`${rootUrl}/health`)
    return await res.json()
  } catch (err) {
    return { status: 'offline', error: err.message }
  }
}

// 1. AUTH API
export const authApi = {
  login: (email, password) => apiClient('/auth/login', { data: { email, password } }),
  adminLogin: (email, password) => apiClient('/auth/admin/login', { data: { email, password } }),
  register: (userData) => apiClient('/auth/register', { data: userData }),
  getMe: (token) => apiClient(`/auth/me${token ? `?token=${token}` : ''}`),
  forgotPassword: (email) => apiClient('/auth/forgot-password', { data: { email } }),
}

// 2. PRODUCTS API
export const productsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v)
    })
    return apiClient(`/products${query.toString() ? `?${query.toString()}` : ''}`)
  },
  getById: (id) => apiClient(`/products/${id}`),
  create: (data) => apiClient('/products', { data, method: 'POST' }),
  update: (id, data) => apiClient(`/products/${id}`, { data, method: 'PUT' }),
  delete: (id) => apiClient(`/products/${id}`, { method: 'DELETE' }),
}

// 3. CATEGORIES & BRANDS API
export const categoriesApi = {
  getAll: () => apiClient('/categories'),
  create: (data) => apiClient('/categories', { data, method: 'POST' }),
}

export const brandsApi = {
  getAll: () => apiClient('/brands'),
  create: (data) => apiClient('/brands', { data, method: 'POST' }),
}

// 4. INVENTORY & EXPIRY API (Asia/Kolkata Business Date & Status)
export const inventoryApi = {
  getSummary: () => apiClient('/inventory'),
  createBatch: (data) => apiClient('/inventory/batches', { data, method: 'POST' }),
  adjustStock: (data) => apiClient('/inventory/adjust', { data, method: 'POST' }),
  getMovements: () => apiClient('/inventory/movements'),
}

export const expiryApi = {
  getBatches: (params = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v)
    })
    return apiClient(`/expiry/batches${query.toString() ? `?${query.toString()}` : ''}`)
  },
  getAlerts: () => apiClient('/expiry/alerts'),
  getSummary: () => apiClient('/expiry/summary'),
  applyClearance: (data) => apiClient('/expiry/clearance', { data, method: 'POST' }),
}

// 5. POS BILLING API
export const posApi = {
  lookup: (query) => apiClient(`/pos/lookup?query=${encodeURIComponent(query)}`),
  checkout: (transactionData) => apiClient('/pos/checkout', { data: transactionData, method: 'POST' }),
  getInvoices: () => apiClient('/pos/invoices'),
  getInvoice: (invoiceNumber) => apiClient(`/pos/invoices/${encodeURIComponent(invoiceNumber)}`),
}

// 6. ONLINE STOREFRONT ORDERS API
export const ordersApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v)
    })
    return apiClient(`/orders${query.toString() ? `?${query.toString()}` : ''}`)
  },
  create: (orderData) => apiClient('/orders', { data: orderData, method: 'POST' }),
  getById: (id) => apiClient(`/orders/${id}`),
  track: (orderNumber) => apiClient(`/orders/track/${encodeURIComponent(orderNumber)}`),
  updateStatus: (id, statusData) => apiClient(`/orders/${id}/status`, { data: statusData, method: 'PATCH' }),
}

// 7. SKINSAFE ALLERGY CHECKER API
export const skinsafeApi = {
  check: (data) => apiClient('/skinsafe/check', { data, method: 'POST' }),
  getAllergens: () => apiClient('/skinsafe/allergens'),
  getIngredients: () => apiClient('/skinsafe/ingredients'),
  getCustomerAllergies: (customerId) => apiClient(`/skinsafe/customer-allergies${customerId ? `?customer_id=${customerId}` : ''}`),
  updateCustomerAllergies: (allergies, customerId) => apiClient(`/skinsafe/customer-allergies${customerId ? `?customer_id=${customerId}` : ''}`, { data: { allergies }, method: 'POST' }),
}

// 8. AI ENGINE API
export const aiApi = {
  skinAnalysis: (data) => apiClient('/ai/skin-analysis', { data, method: 'POST' }),
  recommendations: (data) => apiClient('/ai/recommendations', { data, method: 'POST' }),
}

// 9. REVIEWS & FEEDBACK API
export const reviewsApi = {
  getAll: (productId) => apiClient(`/reviews${productId ? `?product_id=${productId}` : ''}`),
  create: (reviewData) => apiClient('/reviews', { data: reviewData, method: 'POST' }),
}

export const feedbackApi = {
  getAll: () => apiClient('/feedback'),
  create: (feedbackData) => apiClient('/feedback', { data: feedbackData, method: 'POST' }),
}

// 10. ANALYTICS API (Pandas backend)
export const analyticsApi = {
  getSales: () => apiClient('/analytics/sales'),
  getProfit: () => apiClient('/analytics/profit'),
  getForecast: () => apiClient('/analytics/forecast'),
  getSmartReorder: () => apiClient('/analytics/smart-reorder'),
}

// 11. NOTIFICATIONS API
export const notificationsApi = {
  getAll: () => apiClient('/notifications'),
  markRead: (id) => apiClient(`/notifications/${id}/read`, { method: 'PATCH' }),
  create: (data) => apiClient('/notifications', { data, method: 'POST' }),
}

export default apiClient
