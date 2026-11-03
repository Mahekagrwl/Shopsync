import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import CustomerLayout from '../components/layout/CustomerLayout'
import AdminLayout from '../components/layout/AdminLayout'

// Route Protection Guard
import ProtectedRoute from '../components/common/ProtectedRoute'

// Brand & Role Pages (Phase 1 & 2)
import BrandLandingPage from '../pages/customer/BrandLandingPage'
import RoleSelectionPage from '../pages/customer/RoleSelectionPage'

// Customer Pages (Storefront & Protected)
import HomePage from '../pages/customer/HomePage'
import CustomerLogin from '../pages/customer/CustomerLogin'
import CustomerSignup from '../pages/customer/CustomerSignup'
import ForgotPassword from '../pages/customer/ForgotPassword'
import ShopAllPage from '../pages/customer/ShopAllPage'
import CategoryPage from '../pages/customer/CategoryPage'
import ProductDetailsPage from '../pages/customer/ProductDetailsPage'
import SearchResultsPage from '../pages/customer/SearchResultsPage'
import WishlistPage from '../pages/customer/WishlistPage'
import CartPage from '../pages/customer/CartPage'
import CheckoutPage from '../pages/customer/CheckoutPage'
import PaymentStatusPage from '../pages/customer/PaymentStatusPage'
import OrderConfirmationPage from '../pages/customer/OrderConfirmationPage'
import MyOrdersPage from '../pages/customer/MyOrdersPage'
import OrderTrackingPage from '../pages/customer/OrderTrackingPage'
import CustomerProfilePage from '../pages/customer/CustomerProfilePage'
import SavedAddressesPage from '../pages/customer/SavedAddressesPage'
import ProductReviewsPage from '../pages/customer/ProductReviewsPage'
import CustomerFeedbackPage from '../pages/customer/CustomerFeedbackPage'
import AISkinAnalysisPage from '../pages/customer/AISkinAnalysisPage'
import AIRecommendationsPage from '../pages/customer/AIRecommendationsPage'
import SkinSafeCheckerPage from '../pages/customer/SkinSafeCheckerPage'

// Admin / Store Owner Pages
import AdminLoginPage from '../pages/admin/AdminLoginPage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import ProductManagementPage from '../pages/admin/ProductManagementPage'
import AddEditProductPage from '../pages/admin/AddEditProductPage'
import CategoriesPage from '../pages/admin/CategoriesPage'
import BrandsPage from '../pages/admin/BrandsPage'
import ProductVariantsPage from '../pages/admin/ProductVariantsPage'
import MakeupShadesPage from '../pages/admin/MakeupShadesPage'
import InventoryManagementPage from '../pages/admin/InventoryManagementPage'
import BatchManagementPage from '../pages/admin/BatchManagementPage'
import ExpiryManagementPage from '../pages/admin/ExpiryManagementPage'
import POSBillingPage from '../pages/admin/POSBillingPage'
import InvoiceManagementPage from '../pages/admin/InvoiceManagementPage'
import OnlineOrderManagementPage from '../pages/admin/OnlineOrderManagementPage'
import CustomerManagementPage from '../pages/admin/CustomerManagementPage'
import IngredientManagementPage from '../pages/admin/IngredientManagementPage'
import AllergyManagementPage from '../pages/admin/AllergyManagementPage'
import SalesAnalyticsPage from '../pages/admin/SalesAnalyticsPage'
import ProfitAnalyticsPage from '../pages/admin/ProfitAnalyticsPage'
import DemandForecastingPage from '../pages/admin/DemandForecastingPage'
import SmartReorderingPage from '../pages/admin/SmartReorderingPage'
import ProductReviewsAdminPage from '../pages/admin/ProductReviewsAdminPage'
import CustomerFeedbackAdminPage from '../pages/admin/CustomerFeedbackAdminPage'
import NotificationsPage from '../pages/admin/NotificationsPage'
import SettingsPage from '../pages/admin/SettingsPage'

// Shared Fallback
import NotFound from '../pages/NotFound'

export function AppRoutes() {
  return (
    <Routes>
      {/* 1. Standalone Brand Introduction Landing Page (Phase 1: Strictly 100vh, 2 Buttons) */}
      <Route path="/" element={<BrandLandingPage />} />

      {/* 2. Standalone Role Selection Gateway (Phase 2: Customer vs Seller) */}
      <Route path="/role-select" element={<RoleSelectionPage />} />

      {/* 3. Customer Storefront Layout (Phase 3: Complete E-Commerce Experience) */}
      <Route element={<CustomerLayout />}>
        {/* Public Storefront Routes */}
        <Route path="store" element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="shop" element={<ShopAllPage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="product/:id" element={<ProductDetailsPage />} />
        <Route path="search" element={<SearchResultsPage />} />
        <Route path="login" element={<CustomerLogin />} />
        <Route path="signup" element={<CustomerSignup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

        {/* Customer Protected Routes (Requires login with customer role) */}
        <Route
          path="wishlist"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="cart"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment-status"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <PaymentStatusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="order-confirmation"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <OrderConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="order-tracking"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <OrderTrackingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="order-tracking/:orderId"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <OrderTrackingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="saved-addresses"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <SavedAddressesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="reviews"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <ProductReviewsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="feedback"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerFeedbackPage />
            </ProtectedRoute>
          }
        />

        {/* AI Studio Routes: Accessible ONLY to Authenticated Customers */}
        <Route
          path="ai-skin-analysis"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <AISkinAnalysisPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="ai-recommendations"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <AIRecommendationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="skinsafe"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <SkinSafeCheckerPage />
            </ProtectedRoute>
          }
        />

        {/* Direct POS alias from customer nav */}
        <Route path="pos" element={<Navigate to="/admin/pos-billing" replace />} />
      </Route>

      {/* 2. Admin / Store Owner Standalone Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/seller/login" element={<AdminLoginPage />} />

      {/* 3. Store Owner / Admin Protected Panel Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['seller', 'admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="products" element={<ProductManagementPage />} />
        <Route path="products/new" element={<AddEditProductPage />} />
        <Route path="products/edit/:id" element={<AddEditProductPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="brands" element={<BrandsPage />} />
        <Route path="variants" element={<ProductVariantsPage />} />
        <Route path="shades" element={<MakeupShadesPage />} />
        <Route path="inventory" element={<InventoryManagementPage />} />
        <Route path="batches" element={<BatchManagementPage />} />
        <Route path="expiry" element={<ExpiryManagementPage />} />
        <Route path="pos-billing" element={<POSBillingPage />} />
        <Route path="pos" element={<Navigate to="/admin/pos-billing" replace />} />
        <Route path="invoices" element={<InvoiceManagementPage />} />
        <Route path="orders" element={<OnlineOrderManagementPage />} />
        <Route path="customers" element={<CustomerManagementPage />} />
        <Route path="ingredients" element={<IngredientManagementPage />} />
        <Route path="allergies" element={<AllergyManagementPage />} />
        <Route path="sales-analytics" element={<SalesAnalyticsPage />} />
        <Route path="profit-analytics" element={<ProfitAnalyticsPage />} />
        <Route path="demand-forecasting" element={<DemandForecastingPage />} />
        <Route path="smart-reordering" element={<SmartReorderingPage />} />
        <Route path="reviews" element={<ProductReviewsAdminPage />} />
        <Route path="feedback" element={<CustomerFeedbackAdminPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 4. 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
