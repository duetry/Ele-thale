'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Users, Tag, Activity, Dice6, Store } from 'lucide-react';

import UserDetailsTab from './UserDetailsTab';
import CouponDetails from './CouponDetails';
import UsertrackingTab from './UsertrackingTab';
import AdminOffers from './AdminOffers';
import ShopOwnerTab from './ShopOwnerTab';
import ShopTab from './ShopTab';

import { useSelector } from 'react-redux';
import { selectUser } from '@/app/features/auth/authSlice';
import { selectShops } from '@/app/features/adminPanel/shopSlice';

const AdminPanel = () => {
  const user = useSelector(selectUser);

  const [activeTab, setActiveTab] = useState('users');

  // ✅ Fix default tab based on role
  useEffect(() => {
    if (user?.usertype === 'SHOP_OWNER') {
      setActiveTab('coupons');
    } else {
      setActiveTab('users');
    }
  }, [user]);
 
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

          {/* 👉 NON SHOP OWNER TABS */}
          {user?.usertype !== 'SHOP_OWNER' && (
            <>
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

              <button
                onClick={() => setActiveTab('adminOffers')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                  activeTab === 'adminOffers'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Dice6 className="w-4 h-4 mr-2" />
                Products
              </button>

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
            </>
          )}

          {/* 👉 ONLY SHOP OWNER */}
          {user?.usertype === 'SHOP_OWNER' && (
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
          )}

        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">

          {user?.usertype !== 'SHOP_OWNER' && activeTab === 'users' && <UserDetailsTab />}

          {user?.usertype === 'SHOP_OWNER' && activeTab === 'coupons' && <CouponDetails />}

          {user?.usertype !== 'SHOP_OWNER' && activeTab === 'userTracking' && <UsertrackingTab />}

          {user?.usertype !== 'SHOP_OWNER' && activeTab === 'adminOffers' && <AdminOffers />}

          {user?.usertype !== 'SHOP_OWNER' && activeTab === 'shop' && <ShopTab />}

          {user?.usertype !== 'SHOP_OWNER' && activeTab === 'shopOwner' && <ShopOwnerTab />}

        </div>

      </div>
    </div>
  );
};

export default AdminPanel;