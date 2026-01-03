'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Users, Tag } from 'lucide-react';
import UserDetailsTab from './UserDetailsTab';
import CouponDetails from './CouponDetails';

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
          <p className="text-gray-600">Manage users, coupons, and analytics</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 inline-flex gap-2 border border-gray-100">
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
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          {activeTab === 'users' ? <UserDetailsTab /> : <CouponDetails />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;