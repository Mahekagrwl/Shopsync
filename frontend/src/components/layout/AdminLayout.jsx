import React, { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Store,
  Package,
  PlusCircle,
  FolderTree,
  Tag,
  Palette,
  Boxes,
  Layers,
  Calendar,
  FileText,
  ShoppingBag,
  Users,
  FlaskConical,
  ShieldAlert,
  TrendingUp,
  DollarSign,
  LineChart,
  RefreshCw,
  Star,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import PageTransition from '../common/PageTransition'

const NAV_GROUPS = [
  {
    group: 'Operations',
    items: [
      { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'POS Billing Register', path: '/admin/pos-billing', icon: Store, badge: 'Live POS' },
    ]
  },
  {
    group: 'Catalog & Formulations',
    items: [
      { name: 'Product Catalog', path: '/admin/products', icon: Package },
      { name: 'Add Formulation', path: '/admin/products/new', icon: PlusCircle },
      { name: 'Categories', path: '/admin/categories', icon: FolderTree },
      { name: 'Atelier Brands', path: '/admin/brands', icon: Tag },
      { name: 'Product Variants', path: '/admin/variants', icon: Layers },
      { name: 'Makeup Shades', path: '/admin/shades', icon: Palette },
    ]
  },
  {
    group: 'Inventory & Batching',
    items: [
      { name: 'Stock Levels', path: '/admin/inventory', icon: Boxes },
      { name: 'Lot & Batch Control', path: '/admin/batches', icon: Layers },
      { name: 'Expiry Tracking', path: '/admin/expiry', icon: Calendar, alertCount: 3 },
    ]
  },
  {
    group: 'Orders & Fulfillment',
    items: [
      { name: 'Invoices & Receipts', path: '/admin/invoices', icon: FileText },
      { name: 'Online Orders', path: '/admin/orders', icon: ShoppingBag },
      { name: 'Client Profiles', path: '/admin/customers', icon: Users },
    ]
  },
  {
    group: 'Safety & Clean Beauty',
    items: [
      { name: 'Ingredient Master', path: '/admin/ingredients', icon: FlaskConical },
      { name: 'Allergy Sensitivities', path: '/admin/allergies', icon: ShieldAlert },
    ]
  },
  {
    group: 'AI Analytics & Intelligence',
    items: [
      { name: 'Sales Performance', path: '/admin/sales-analytics', icon: TrendingUp },
      { name: 'Profit Margins', path: '/admin/profit-analytics', icon: DollarSign },
      { name: 'Demand Forecasting', path: '/admin/demand-forecasting', icon: LineChart },
      { name: 'Smart Reordering', path: '/admin/smart-reordering', icon: RefreshCw },
    ]
  },
  {
    group: 'Customer & Store Care',
    items: [
      { name: 'Product Reviews', path: '/admin/reviews', icon: Star },
      { name: 'Client Feedback', path: '/admin/feedback', icon: MessageSquare },
      { name: 'Notifications', path: '/admin/notifications', icon: Bell, alertCount: 4 },
      { name: 'Terminal Settings', path: '/admin/settings', icon: Settings },
    ]
  }
]

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { adminUser, logoutAdmin, isAdminAuthenticated } = useAuth()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const [profileDropdown, setProfileDropdown] = useState(false)
  const [notifDropdown, setNotifDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = () => {
    logoutAdmin()
    navigate('/admin/login')
  }

  return (
    <div className="flex h-screen bg-[#F8F3EE] text-[#282426] overflow-hidden">
      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:flex flex-col bg-[#282426] text-white border-r border-[#524B4F]/40 transition-all duration-300 z-30 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#524B4F]/40 bg-[#1F1C1D]">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 truncate">
            <img
              src="/logo.jpg"
              alt="ShopSync"
              className="h-8 w-8 rounded-lg object-cover shadow-sm border border-[#542B43] shrink-0"
            />
            {sidebarOpen && (
              <div>
                <span className="font-serif font-bold text-sm tracking-tight text-white block leading-tight">
                  ShopSync <span className="text-[#D9A6AC]">Atelier</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#D9A6AC]/80 font-mono block">
                  POS & Enterprise
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 text-xs"
            title="Toggle Sidebar"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {sidebarOpen && (
                <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#827A7F] block">
                  {group.group}
                </span>
              )}
              {group.items.map((item) => {
                const isActive = location.pathname === item.path
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#542B43] text-white font-semibold shadow-xs'
                        : 'text-[#E9DED5]/80 hover:bg-[#3B1E2F]/60 hover:text-white'
                    }`}
                    title={!sidebarOpen ? item.name : undefined}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="h-4 w-4 shrink-0" />
                      {sidebarOpen && <span className="truncate">{item.name}</span>}
                    </div>

                    {sidebarOpen && item.badge && (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {item.badge}
                      </span>
                    )}

                    {sidebarOpen && item.alertCount && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-600 text-white">
                        {item.alertCount}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        {/* Bottom Switch to Storefront */}
        <div className="p-3 border-t border-[#524B4F]/40 bg-[#1F1C1D]">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#E9DED5] transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            {sidebarOpen && <span>View Customer Store</span>}
          </Link>
        </div>
      </aside>

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-[#E9DED5] px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebar(!mobileSidebar)}
              className="md:hidden p-2 rounded-lg text-[#282426] hover:bg-[#F8F3EE]"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <div className="relative w-64 sm:w-80 hidden sm:block">
              <input
                type="text"
                placeholder="Search SKU, customer, batch, or receipt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-xl border border-[#E9DED5] bg-[#F8F3EE] py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-[#542B43]"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Demo data badge */}
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F8F3EE] text-[#542B43] border border-[#D9A6AC]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SaaS Live Preview
            </span>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdown(!notifDropdown)}
                className="relative p-2 rounded-xl hover:bg-[#F8F3EE] text-[#282426] transition-colors"
                aria-label="Admin Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-600" />
              </button>

              {notifDropdown && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white border border-[#E9DED5] shadow-xl p-3 z-50 text-xs space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E9DED5]">
                    <span className="font-bold text-[#282426]">Atelier System Alerts</span>
                    <span className="text-[10px] text-[#542B43] font-semibold">3 Unread</span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="p-2 bg-amber-50 rounded-lg border border-amber-200">
                      <span className="font-bold text-amber-900 block">Stock Warning: Elixir Batch #4</span>
                      <p className="text-[#524B4F]">Only 8 units remain at Flagship POS.</p>
                    </div>
                    <div className="p-2 bg-rose-50 rounded-lg border border-rose-200">
                      <span className="font-bold text-rose-900 block">Lot Expiry Warning</span>
                      <p className="text-[#524B4F]">Batch CG-006 expires in 45 days.</p>
                    </div>
                  </div>
                  <Link
                    to="/admin/notifications"
                    onClick={() => setNotifDropdown(false)}
                    className="block text-center pt-2 text-[11px] font-semibold text-[#542B43] hover:underline"
                  >
                    View All Notifications
                  </Link>
                </div>
              )}
            </div>

            {/* Admin User Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F8F3EE] transition-colors text-left"
              >
                <div className="h-8 w-8 rounded-lg bg-[#542B43] text-white flex items-center justify-center font-serif font-bold text-xs">
                  VV
                </div>
                <div className="hidden sm:block text-xs">
                  <p className="font-semibold text-[#282426] leading-tight">{adminUser.name}</p>
                  <p className="text-[10px] text-stone-400">{adminUser.role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {profileDropdown && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-white border border-[#E9DED5] shadow-xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-[#E9DED5]">
                    <p className="font-bold text-[#282426]">{adminUser.name}</p>
                    <p className="text-[10px] text-stone-400 font-mono">{adminUser.terminal}</p>
                  </div>
                  <Link
                    to="/admin/settings"
                    onClick={() => setProfileDropdown(false)}
                    className="block px-4 py-2 hover:bg-[#F8F3EE] text-[#282426]"
                  >
                    Terminal Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-1.5 border-t border-[#E9DED5] mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Main Admin Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8F3EE]">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileSidebar(false)} />
          <div className="relative w-72 bg-[#282426] text-white h-full overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-700">
              <div className="flex items-center gap-2">
                <img src="/logo.jpg" alt="ShopSync" className="h-7 w-7 rounded-lg object-cover" />
                <span className="font-serif font-bold text-base text-white">ShopSync Admin</span>
              </div>
              <button onClick={() => setMobileSidebar(false)} className="text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            {NAV_GROUPS.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  {group.group}
                </span>
                {group.items.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileSidebar(false)}
                    className="block px-3 py-2 rounded-xl text-xs text-stone-300 hover:bg-[#542B43] hover:text-white"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLayout
