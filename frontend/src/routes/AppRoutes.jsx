import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import CustomerLayout from '../components/layout/CustomerLayout'
import AdminLayout from '../components/layout/AdminLayout'

// Customer Pages (30 Pages)
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

// Admin Pages (25 Pages)
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

// Shared
import NotFound from '../pages/NotFound'

export function AppRoutes() {
  return (
    <Routes>
      {/* Customer Storefront Routes */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<CustomerLogin />} />
        <Route path="signup" element={<CustomerSignup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="shop" element={<ShopAllPage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="product/:id" element={<ProductDetailsPage />} />
        <Route path="search" element={<SearchResultsPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="payment-status" element={<PaymentStatusPage />} />
        <Route path="order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="orders" element={<MyOrdersPage />} />
        <Route path="order-tracking" element={<OrderTrackingPage />} />
        <Route path="order-tracking/:orderId" element={<OrderTrackingPage />} />
        <Route path="profile" element={<CustomerProfilePage />} />
        <Route path="saved-addresses" element={<SavedAddressesPage />} />
        <Route path="reviews" element={<ProductReviewsPage />} />
        <Route path="feedback" element={<CustomerFeedbackPage />} />
        <Route path="ai-skin-analysis" element={<AISkinAnalysisPage />} />
        <Route path="ai-recommendations" element={<AIRecommendationsPage />} />
        <Route path="skinsafe" element={<SkinSafeCheckerPage />} />
        
        {/* Direct POS alias from customer nav */}
        <Route path="pos" element={<Navigate to="/admin/pos-billing" replace />} />
      </Route>

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Panel Routes */}
      <Route path="/admin" element={<AdminLayout />}>
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

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
