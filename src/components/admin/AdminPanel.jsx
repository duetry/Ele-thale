'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  Activity,
  Store,
  Layers,
  Zap,
  FileText,
  Heart,
  Search,
  Menu,
  X,
  LogOut,
  UserCheck,
} from 'lucide-react';

import UserDetailsTab from './UserDetailsTab';
import CouponDetails from './CouponDetails';
import UsertrackingTab from './UsertrackingTab';
import AdminOffers from './AdminOffers';
import ShopOwnerTab from './ShopOwnerTab';
import CategoryTab from './CategoryTab';
import ShopTab from './ShopTab';
import FlashDealTab from './FlashDealTab';
import ReactionsTab from './ReactionsTab';
import FindOffersTab from './FindOffersTab';
import NotifiedTab from './NotifiedTab';

import { useSelector, useDispatch } from 'react-redux';
import { clearAuth, selectUser } from '@/app/features/auth/authSlice';
import { resetAdminState } from '@/app/features/adminPanel/adminPanelSlice';
import { resetShops } from '@/app/features/adminPanel/shopSlice';
import { resetShopOwners } from '@/app/features/adminPanel/shopOwnerSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const user = useSelector(selectUser);
  const router = useRouter();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('adminOffers');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Auth Check - Strict Admin Only
  useEffect(() => {
    if (!user || user.usertype !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  // Don't render anything if not admin
  if (!user || user.usertype !== 'admin') {
    return null;
  }

  const handleLogout = () => {
    dispatch(clearAuth());
    dispatch(resetAdminState());
    dispatch(resetShops());
    dispatch(resetShopOwners());
    router.push('/');
    toast.success('Logged out successfully 👋');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Details', icon: Users },
    { id: 'userTracking', label: 'User Tracking', icon: Activity },
    { id: 'shopOwner', label: 'Shops Owner', icon: Store },
    { id: 'category', label: 'Categories', icon: Layers },
    { id: 'shop', label: 'Shop', icon: Store },
    { id: 'adminOffers', label: 'Products', icon: Package },
    { id: 'flashDeal', label: 'Flash Deal', icon: Zap },
    { id: 'notified', label: 'Requested', icon: FileText },
    { id: 'reactions', label: 'Reactions', icon: Heart },
    { id: 'findOffers', label: 'Find Offers', icon: Search },
  ];

  const activeMenuItem = menuItems.find((item) => item.id === activeTab) || menuItems[0];

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col md:flex-row text-gray-800 antialiased">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── DARK SIDEBAR NAVIGATION ── */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0b1329] text-gray-300 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo Brand Section */}
          <div className="p-6 pb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#ff5722] font-black text-2xl tracking-tight">
                Offer Sandhai
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1.5 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer: Red Logout Link Only (Admin profile card removed as requested) */}
          <div className="p-4 border-t border-slate-800/80">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5 rotate-180 text-red-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="bg-white border-b border-gray-200/80 sticky top-0 z-30 px-4 md:px-8 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              title="Toggle sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              {activeMenuItem?.label || 'Products'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Top Right Admin Badge */}
            <div className="border border-blue-200 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-lg flex items-center gap-2 text-xs md:text-sm font-semibold shadow-xs">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Admin</span>
            </div>

            {/* Top Right Logout Button */}
            <button
              onClick={handleLogout}
              className="border border-red-500 text-red-500 hover:bg-red-50 px-4 py-1.5 rounded-lg flex items-center gap-2 text-xs md:text-sm font-semibold transition-colors shadow-xs"
            >
              <LogOut className="w-4 h-4 rotate-180" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-auto">
          {(activeTab === 'dashboard' || activeTab === 'adminOffers') && <AdminOffers />}
          {activeTab === 'users' && <UserDetailsTab />}
          {activeTab === 'userTracking' && <UsertrackingTab />}
          {activeTab === 'category' && <CategoryTab />}
          {activeTab === 'shop' && <ShopTab />}
          {activeTab === 'shopOwner' && <ShopOwnerTab />}
          {activeTab === 'flashDeal' && <FlashDealTab />}
          {activeTab === 'reactions' && <ReactionsTab />}
          {activeTab === 'notified' && <NotifiedTab />}
          {activeTab === 'findOffers' && <FindOffersTab />}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;