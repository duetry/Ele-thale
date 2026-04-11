'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Users, Tag, Activity, Dice6, Store } from 'lucide-react';

import UserDetailsTab from './UserDetailsTab';
import CouponDetails from './CouponDetails';
import UsertrackingTab from './UsertrackingTab';
import AdminOffers from './AdminOffers';
import ShopOwnerTab from './ShopOwnerTab';
import ShopTab from './ShopTab'; // ✅ NEW

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 inline-flex gap-2 border border-gray-100">

          {/* Users */}
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            User Details
          </button>

          {/* Coupons */}
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
              activeTab === 'coupons'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Tag className="w-4 h-4 mr-2" />
            Coupons
          </button>

          {/* User Tracking */}
          <button
            onClick={() => setActiveTab('userTracking')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
              activeTab === 'userTracking'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Activity className="w-4 h-4 mr-2" />
            User Tracking
          </button>

          {/* Admin Offers */}
          <button
            onClick={() => setActiveTab('adminOffers')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
              activeTab === 'adminOffers'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Dice6 className="w-4 h-4 mr-2" />
            Admin offers
          </button>

          {/* ✅ NEW Shop Tab */}
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
              activeTab === 'shop'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Store className="w-4 h-4 mr-2" />
            Shop
          </button>

          {/* Existing Shop Owner */}
          <button
            onClick={() => setActiveTab('shopOwner')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
              activeTab === 'shopOwner'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Dice6 className="w-4 h-4 mr-2" />
            Shops Owner
          </button>

        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          {activeTab === 'users' && <UserDetailsTab />}
          {activeTab === 'coupons' && <CouponDetails />}
          {activeTab === 'userTracking' && <UsertrackingTab />}
          {activeTab === 'adminOffers' && <AdminOffers />}
          {activeTab === 'shop' && <ShopTab />} {/* ✅ NEW */}
          {activeTab === 'shopOwner' && <ShopOwnerTab />}
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;