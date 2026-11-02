import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProductProvider } from './context/ProductContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { SkinSafeProvider } from './context/SkinSafeContext'
import { POSProvider } from './context/POSContext'
import { ReportProvider } from './context/ReportContext'
import CustomCursor from './components/common/CustomCursor'
import AppRoutes from './routes/AppRoutes'

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              <SkinSafeProvider>
                <POSProvider>
                  <ReportProvider>
                    <CustomCursor />
                    <AppRoutes />
                  </ReportProvider>
                </POSProvider>
              </SkinSafeProvider>
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
