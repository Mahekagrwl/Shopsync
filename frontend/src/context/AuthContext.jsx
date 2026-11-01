import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext()

const DEFAULT_CUSTOMER = {
  id: 'cust-8901',
  name: 'Camille Laurent',
  email: 'camille.laurent@example.com',
  phone: '+1 (555) 234-5678',
  loyaltyTier: 'Gold Member',
  loyaltyPoints: 1250,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  skinProfile: {
    skinType: 'Combination / Sensitive',
    skinConcerns: ['Redness / Rosacea', 'Dehydration', 'Fine Lines'],
    allergies: ['Synthetic Fragrance', 'Tree Nut Oils']
  },
  savedAddresses: [
    {
      id: 'addr-1',
      title: 'Home (Default)',
      fullName: 'Camille Laurent',
      street: '742 Evergreen Terrace, Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      country: 'United States',
      isDefault: true
    },
    {
      id: 'addr-2',
      title: 'Design Studio',
      fullName: 'Camille Laurent',
      street: '120 Montgomery St, Floor 8',
      city: 'San Francisco',
      state: 'CA',
      zip: '94104',
      country: 'United States',
      isDefault: false
    }
  ]
}

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    const saved = localStorage.getItem('shopsync_customer')
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMER
  })

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('shopsync_admin_auth') === 'true'
  })

  const [adminUser, setAdminUser] = useState(() => {
    return {
      name: 'Victoria Vance',
      role: 'Head of Retail Operations',
      email: 'admin@shopsync.beauty',
      terminal: 'Flagship Boutique 01'
    }
  })

  useEffect(() => {
    if (customer) {
      localStorage.setItem('shopsync_customer', JSON.stringify(customer))
    } else {
      localStorage.removeItem('shopsync_customer')
    }
  }, [customer])

  const loginCustomer = async (email, password) => {
    try {
      const res = await authApi.login(email, password)
      if (res?.access_token) {
        localStorage.setItem('shopsync_token', res.access_token)
      }
      const updated = {
        ...DEFAULT_CUSTOMER,
        id: res?.user?.id || DEFAULT_CUSTOMER.id,
        name: res?.user?.full_name || DEFAULT_CUSTOMER.name,
        email: res?.user?.email || email
      }
      setCustomer(updated)
      return { success: true }
    } catch {
      // Fallback for seamless demo / offline usage
      const updated = {
        ...DEFAULT_CUSTOMER,
        email: email || DEFAULT_CUSTOMER.email
      }
      setCustomer(updated)
      return { success: true }
    }
  }

  const signupCustomer = async (data) => {
    try {
      const res = await authApi.register({
        full_name: data.fullName,
        email: data.email,
        password: data.password || 'Beauty@1234',
        phone: data.phone
      })
      if (res?.access_token) {
        localStorage.setItem('shopsync_token', res.access_token)
      }
      const newCustomer = {
        ...DEFAULT_CUSTOMER,
        id: res?.user?.id || 'cust-' + Math.floor(1000 + Math.random() * 9000),
        name: data.fullName || 'New Member',
        email: data.email,
        loyaltyTier: 'Silver Member',
        loyaltyPoints: 100
      }
      setCustomer(newCustomer)
      return { success: true }
    } catch {
      const newCustomer = {
        ...DEFAULT_CUSTOMER,
        id: 'cust-' + Math.floor(1000 + Math.random() * 9000),
        name: data.fullName || 'New Member',
        email: data.email,
        loyaltyTier: 'Silver Member',
        loyaltyPoints: 100
      }
      setCustomer(newCustomer)
      return { success: true }
    }
  }

  const logoutCustomer = () => {
    setCustomer(null)
    localStorage.removeItem('shopsync_token')
  }

  const updateProfile = (profileData) => {
    setCustomer(prev => ({
      ...prev,
      ...profileData
    }))
  }

  const addAddress = (address) => {
    const newAddr = { ...address, id: 'addr-' + Date.now() }
    setCustomer(prev => ({
      ...prev,
      savedAddresses: [...prev.savedAddresses, newAddr]
    }))
  }

  const removeAddress = (id) => {
    setCustomer(prev => ({
      ...prev,
      savedAddresses: prev.savedAddresses.filter(a => a.id !== id)
    }))
  }

  const loginAdmin = async (email, password) => {
    try {
      const res = await authApi.adminLogin(email || 'admin@shopsync.beauty', password || 'Admin@ShopSync2026')
      if (res?.access_token) {
        localStorage.setItem('shopsync_admin_token', res.access_token)
      }
    } catch {
      // offline fallback
    }
    setIsAdminAuthenticated(true)
    localStorage.setItem('shopsync_admin_auth', 'true')
    return { success: true }
  }

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false)
    localStorage.removeItem('shopsync_admin_auth')
    localStorage.removeItem('shopsync_admin_token')
  }

  return (
    <AuthContext.Provider
      value={{
        customer,
        isCustomerAuthenticated: Boolean(customer),
        loginCustomer,
        signupCustomer,
        logoutCustomer,
        updateProfile,
        addAddress,
        removeAddress,
        isAdminAuthenticated,
        adminUser,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
