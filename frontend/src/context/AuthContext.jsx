import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'
import { INDIAN_ADDRESSES } from '../data/mockBeautyData'

const AuthContext = createContext()

export const DEMO_CUSTOMER = {
  id: 'cust-in-8901',
  name: 'Ananya Sharma',
  email: 'ananya.sharma@shopsync.in',
  role: 'customer',
  phone: '+91 98251 45890',
  loyaltyTier: 'Gold Member',
  loyaltyPoints: 1250,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  skinProfile: {
    skinType: 'Combination / Sensitive',
    skinConcerns: ['Redness / Rosacea', 'Dehydration', 'Fine Lines'],
    allergies: ['Synthetic Fragrance / Parfum', 'Tree Nut & Almond Oils']
  },
  savedAddresses: INDIAN_ADDRESSES
}

export const DEMO_SELLER = {
  id: 'seller-001',
  name: 'Rohan Mehta',
  email: 'seller@shopsync.in',
  role: 'seller',
  phone: '+91 98251 74677',
  gstin: '24AAACS9182K1ZU',
  terminal: 'Vadodara Flagship Boutique (Alkapuri)',
  storeLocation: 'Alkapuri, Vadodara, Gujarat 390007',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
}

export const DEMO_ADMIN = {
  id: 'admin-1',
  name: 'Victoria Vance',
  email: 'admin@shopsync.beauty',
  role: 'admin',
  phone: '+91 98251 99999',
  gstin: '24AAACS9182K1ZU',
  terminal: 'HQ Retail Controller (Vadodara Flagship)',
  storeLocation: 'Alkapuri, Vadodara, Gujarat 390007',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
}

export function AuthProvider({ children }) {
  // Current authenticated user (null if visitor has not logged in)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('shopsync_auth_user') || sessionStorage.getItem('shopsync_auth_user')
      if (savedUser) return JSON.parse(savedUser)
    } catch {
      // storage parsing error fallback
    }
    return null
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('shopsync_token') || sessionStorage.getItem('shopsync_token') || null
  })

  // Sync session storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('shopsync_auth_user', JSON.stringify(user))
      // Backwards-compatible key for legacy components
      if (user.role === 'customer') {
        localStorage.setItem('shopsync_customer', JSON.stringify(user))
      } else {
        localStorage.setItem('shopsync_admin_auth', 'true')
      }
    } else {
      localStorage.removeItem('shopsync_auth_user')
      sessionStorage.removeItem('shopsync_auth_user')
      localStorage.removeItem('shopsync_customer')
      localStorage.removeItem('shopsync_admin_auth')
    }
  }, [user])

  // Computed state
  const isAuthenticated = Boolean(user && (token || user.id))
  const role = user?.role || null
  const isCustomer = user?.role === 'customer'
  const isSeller = user?.role === 'seller' || user?.role === 'admin'
  const isAdmin = user?.role === 'admin'

  // Compatibility aliases
  const customer = isCustomer ? user : null
  const isCustomerAuthenticated = isCustomer && isAuthenticated
  const isAdminAuthenticated = isSeller && isAuthenticated
  const adminUser = isSeller ? user : DEMO_SELLER

  /**
   * Universal Login
   * Authenticates against FastAPI backend with graceful fallback for offline/demo
   */
  const login = async (email, password, remember = true) => {
    const storage = remember ? localStorage : sessionStorage
    const lowerEmail = email.trim().toLowerCase()

    try {
      // Direct call to FastAPI backend
      const res = await authApi.login(lowerEmail, password)
      if (res?.access_token) {
        setToken(res.access_token)
        storage.setItem('shopsync_token', res.access_token)
      }

      const assignedRole = res?.user?.role || (
        lowerEmail.includes('seller') ? 'seller' :
        lowerEmail.includes('admin') || lowerEmail.includes('victoria') ? 'admin' : 'customer'
      )

      const authenticatedUser = {
        id: res?.user?.id || (assignedRole === 'seller' ? 'seller-001' : assignedRole === 'admin' ? 'admin-1' : 'cust-8901'),
        name: res?.user?.full_name || (assignedRole === 'seller' ? 'Rohan Mehta' : assignedRole === 'admin' ? 'Victoria Vance' : 'Ananya Sharma'),
        email: res?.user?.email || lowerEmail,
        role: assignedRole,
        phone: res?.user?.phone || '+91 98251 45890',
        avatar: res?.user?.avatar_url || (assignedRole === 'seller' ? DEMO_SELLER.avatar : assignedRole === 'admin' ? DEMO_ADMIN.avatar : DEMO_CUSTOMER.avatar),
        loyaltyTier: assignedRole === 'customer' ? 'Gold Member' : undefined,
        loyaltyPoints: assignedRole === 'customer' ? 1250 : undefined,
        skinProfile: assignedRole === 'customer' ? DEMO_CUSTOMER.skinProfile : undefined,
        savedAddresses: assignedRole === 'customer' ? DEMO_CUSTOMER.savedAddresses : undefined,
        terminal: assignedRole !== 'customer' ? 'Vadodara Flagship Boutique (Alkapuri)' : undefined,
        storeLocation: assignedRole !== 'customer' ? 'Alkapuri, Vadodara, Gujarat 390007' : undefined
      }

      setUser(authenticatedUser)
      storage.setItem('shopsync_auth_user', JSON.stringify(authenticatedUser))
      return { success: true, user: authenticatedUser }
    } catch {
      // Offline / Demo fallback
      let matchedRole = 'customer'
      let demoProfile = { ...DEMO_CUSTOMER }

      if (lowerEmail.includes('seller') || lowerEmail.includes('rohan')) {
        matchedRole = 'seller'
        demoProfile = { ...DEMO_SELLER }
      } else if (lowerEmail.includes('admin') || lowerEmail.includes('victoria')) {
        matchedRole = 'admin'
        demoProfile = { ...DEMO_ADMIN }
      } else {
        matchedRole = 'customer'
        demoProfile = {
          ...DEMO_CUSTOMER,
          email: lowerEmail,
          name: lowerEmail.split('@')[0].replace('.', ' ').toUpperCase()
        }
      }

      const dummyToken = `demo-token-${Date.now()}`
      setToken(dummyToken)
      storage.setItem('shopsync_token', dummyToken)

      const fallbackUser = {
        ...demoProfile,
        role: matchedRole
      }
      setUser(fallbackUser)
      storage.setItem('shopsync_auth_user', JSON.stringify(fallbackUser))
      return { success: true, user: fallbackUser }
    }
  }

  /**
   * Universal Register
   * Accepts full_name, email, password, and chosen role ('customer' or 'seller')
   * Strictly disallows self-assigning 'admin'
   */
  const register = async ({ fullName, email, password, role = 'customer', phone = '' }) => {
    const assignedRole = role.toLowerCase() === 'seller' ? 'seller' : 'customer'
    const lowerEmail = email.trim().toLowerCase()

    try {
      const res = await authApi.register({
        full_name: fullName.trim(),
        email: lowerEmail,
        password: password || 'Beauty@1234',
        role: assignedRole,
        phone: phone || '+91 98251 00000'
      })

      if (res?.access_token) {
        setToken(res.access_token)
        localStorage.setItem('shopsync_token', res.access_token)
      }

      const newUser = {
        id: res?.user?.id || `${assignedRole.slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
        name: fullName.trim(),
        email: lowerEmail,
        role: assignedRole,
        phone: phone || '+91 98251 00000',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
        loyaltyTier: assignedRole === 'customer' ? 'Silver Member' : undefined,
        loyaltyPoints: assignedRole === 'customer' ? 100 : undefined,
        skinProfile: assignedRole === 'customer' ? { skinType: 'Normal', skinConcerns: [], allergies: [] } : undefined,
        savedAddresses: assignedRole === 'customer' ? INDIAN_ADDRESSES : undefined,
        terminal: assignedRole === 'seller' ? 'Vadodara Flagship Boutique (Alkapuri)' : undefined,
        storeLocation: assignedRole === 'seller' ? 'Alkapuri, Vadodara, Gujarat 390007' : undefined
      }

      setUser(newUser)
      localStorage.setItem('shopsync_auth_user', JSON.stringify(newUser))
      return { success: true, user: newUser }
    } catch {
      // Local fallback
      const newUser = {
        id: `${assignedRole.slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
        name: fullName.trim(),
        email: lowerEmail,
        role: assignedRole,
        phone: phone || '+91 98251 00000',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
        loyaltyTier: assignedRole === 'customer' ? 'Silver Member' : undefined,
        loyaltyPoints: assignedRole === 'customer' ? 100 : undefined,
        skinProfile: assignedRole === 'customer' ? { skinType: 'Normal', skinConcerns: [], allergies: [] } : undefined,
        savedAddresses: assignedRole === 'customer' ? INDIAN_ADDRESSES : undefined,
        terminal: assignedRole === 'seller' ? 'Vadodara Flagship Boutique (Alkapuri)' : undefined,
        storeLocation: assignedRole === 'seller' ? 'Alkapuri, Vadodara, Gujarat 390007' : undefined
      }

      const dummyToken = `demo-token-${Date.now()}`
      setToken(dummyToken)
      localStorage.setItem('shopsync_token', dummyToken)
      setUser(newUser)
      localStorage.setItem('shopsync_auth_user', JSON.stringify(newUser))
      return { success: true, user: newUser }
    }
  }

  /**
   * One-click demo session provider
   */
  const loginAsDemo = (demoRole = 'customer') => {
    let demoUser
    if (demoRole === 'seller') {
      demoUser = { ...DEMO_SELLER }
    } else if (demoRole === 'admin') {
      demoUser = { ...DEMO_ADMIN }
    } else {
      demoUser = { ...DEMO_CUSTOMER }
    }

    const dummyToken = `demo-token-${demoRole}-${Date.now()}`
    setToken(dummyToken)
    setUser(demoUser)
    localStorage.setItem('shopsync_token', dummyToken)
    localStorage.setItem('shopsync_auth_user', JSON.stringify(demoUser))
    return demoUser
  }

  /**
   * Universal Logout
   * Completely purges user profile, tokens, and storage
   */
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('shopsync_token')
    sessionStorage.removeItem('shopsync_token')
    localStorage.removeItem('shopsync_auth_user')
    sessionStorage.removeItem('shopsync_auth_user')
    localStorage.removeItem('shopsync_customer')
    localStorage.removeItem('shopsync_admin_auth')
    localStorage.removeItem('shopsync_admin_token')
  }

  // Compatibility wrappers for existing components
  const loginCustomer = (email, password) => login(email, password)
  const signupCustomer = (data) => register(data)
  const logoutCustomer = () => logout()
  const loginAdmin = (email, password) => login(email || 'seller@shopsync.in', password || 'Seller@ShopSync2026')
  const logoutAdmin = () => logout()

  // Profile operations
  const updateProfile = (profileData) => {
    setUser(prev => {
      if (!prev) return null
      const updated = { ...prev, ...profileData }
      localStorage.setItem('shopsync_auth_user', JSON.stringify(updated))
      return updated
    })
  }

  const addAddress = (address) => {
    const newAddr = { ...address, id: 'addr-' + Date.now() }
    setUser(prev => {
      if (!prev) return null
      const currentAddresses = prev.savedAddresses || []
      const updated = {
        ...prev,
        savedAddresses: [...currentAddresses, newAddr]
      }
      localStorage.setItem('shopsync_auth_user', JSON.stringify(updated))
      return updated
    })
  }

  const removeAddress = (id) => {
    setUser(prev => {
      if (!prev) return null
      const currentAddresses = prev.savedAddresses || []
      const updated = {
        ...prev,
        savedAddresses: currentAddresses.filter(a => a.id !== id)
      }
      localStorage.setItem('shopsync_auth_user', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        role,
        isCustomer,
        isSeller,
        isAdmin,
        login,
        register,
        logout,
        loginAsDemo,
        updateProfile,
        addAddress,
        removeAddress,
        // Compatibility props
        customer,
        isCustomerAuthenticated,
        loginCustomer,
        signupCustomer,
        logoutCustomer,
        adminUser,
        isAdminAuthenticated,
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
