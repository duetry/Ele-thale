// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Box } from '@mui/material';
// import { Users, Tag, Activity, Dice6, Store } from 'lucide-react';

// import UserDetailsTab from './UserDetailsTab';
// import CouponDetails from './CouponDetails';
// import UsertrackingTab from './UsertrackingTab';
// import AdminOffers from './AdminOffers';
// import ShopOwnerTab from './ShopOwnerTab';
// import ShopTab from './ShopTab';

// import { useSelector } from 'react-redux';
// import { selectUser } from '@/app/features/auth/authSlice';
// import { selectShops } from '@/app/features/adminPanel/shopSlice';

// import { useRouter } from 'next/navigation';

// const AdminPanel = () => {
//   const user = useSelector(selectUser);
//   const router = useRouter();

//   const [activeTab, setActiveTab] = useState('users');

//   // ✅ Auth Check
//   useEffect(() => {
//     if (!user || (user.usertype !== 'admin' && user.usertype !== 'SHOP_OWNER')) {
//       router.push('/');
//     }
//   }, [user, router]);

//   // ✅ Fix default tab based on role
//   useEffect(() => {
//     if (user?.usertype === 'SHOP_OWNER') {
//       setActiveTab('coupons');
//     } else if (user?.usertype === 'admin') {
//       setActiveTab('users');
//     }
//   }, [user]);

//   // Don't render anything if not authorized (prevents flash)
//   if (!user || (user.usertype !== 'admin' && user.usertype !== 'SHOP_OWNER')) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
//       <div className="max-w-7xl mx-auto px-2 py-20">

//         {/* Header */}
//         {/* <div className="mb-1">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">
//             Admin Dashboard
//           </h1>
//         </div> */}

//         {/* Tabs */}
//         <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 inline-flex gap-2 border border-gray-100">

//           {/* 👉 NON SHOP OWNER TABS */}
//           {user?.usertype !== 'SHOP_OWNER' && (
//             <>
//               <button
//                 onClick={() => setActiveTab('users')}
//                 className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${activeTab === 'users'
//                   ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//               >
//                 <Users className="w-4 h-4 mr-2" />
//                 User Details
//               </button>

//               <button
//                 onClick={() => setActiveTab('userTracking')}
//                 className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${activeTab === 'userTracking'
//                   ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//               >
//                 <Activity className="w-4 h-4 mr-2" />
//                 User Tracking
//               </button>

//               <button
//                 onClick={() => setActiveTab('shopOwner')}
//                 className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${activeTab === 'shopOwner'
//                   ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//               >
//                 <Dice6 className="w-4 h-4 mr-2" />
//                 Shops Owner
//               </button>

//               <button
//                 onClick={() => setActiveTab('shop')}
//                 className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${activeTab === 'shop'
//                   ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//               >
//                 <Store className="w-4 h-4 mr-2" />
//                 Shop
//               </button>

//               <button
//                 onClick={() => setActiveTab('adminOffers')}
//                 className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${activeTab === 'adminOffers'
//                   ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//               >
//                 <Dice6 className="w-4 h-4 mr-2" />
//                 Products
//               </button>
//             </>
//           )}

//           {/* 👉 ONLY SHOP OWNER */}
//           {user?.usertype === 'SHOP_OWNER' && (
//             <button
//               onClick={() => setActiveTab('coupons')}
//               className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${activeTab === 'coupons'
//                 ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
//                 : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//             >
//               <Tag className="w-4 h-4 mr-2" />
//               Coupons
//             </button>
//           )}

//         </div>

//         {/* Content */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">

//           {user?.usertype !== 'SHOP_OWNER' && activeTab === 'users' && <UserDetailsTab />}

//           {user?.usertype === 'SHOP_OWNER' && activeTab === 'coupons' && <CouponDetails />}

//           {user?.usertype !== 'SHOP_OWNER' && activeTab === 'userTracking' && <UsertrackingTab />}

//           {user?.usertype !== 'SHOP_OWNER' && activeTab === 'adminOffers' && <AdminOffers />}

//           {user?.usertype !== 'SHOP_OWNER' && activeTab === 'shop' && <ShopTab />}

//           {user?.usertype !== 'SHOP_OWNER' && activeTab === 'shopOwner' && <ShopOwnerTab />}

//         </div>

//       </div>
//     </div>
//   );
// };

// export default AdminPanel;


// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Box } from '@mui/material';
// import { Users, Tag, Activity, Dice6, Store, Zap } from 'lucide-react';

// import UserDetailsTab from './UserDetailsTab';
// import CouponDetails from './CouponDetails';
// import UsertrackingTab from './UsertrackingTab';
// import AdminOffers from './AdminOffers';
// import ShopOwnerTab from './ShopOwnerTab';
// import ShopTab from './ShopTab';
// import FlashDealTab from './FlashDealTab';

// import { useSelector } from 'react-redux';
// import { selectUser } from '@/app/features/auth/authSlice';
// import { selectShops } from '@/app/features/adminPanel/shopSlice';

// import { useRouter } from 'next/navigation';

// const AdminPanel = () => {
//   const user = useSelector(selectUser);
//   const router = useRouter();

//   const [activeTab, setActiveTab] = useState('users');

//   // ✅ Auth Check
//   useEffect(() => {
//     if (!user || (user.usertype !== 'admin' && user.usertype !== 'SHOP_OWNER')) {
//       router.push('/');
//     }
//   }, [user, router]);

//   // ✅ Fix default tab based on role
//   useEffect(() => {
//     if (user?.usertype === 'SHOP_OWNER') {
//       setActiveTab('coupons');
//     } else if (user?.usertype === 'admin') {
//       setActiveTab('users');
//     }
//   }, [user]);

//   // Don't render anything if not authorized (prevents flash)
//   if (!user || (user.usertype !== 'admin' && user.usertype !== 'SHOP_OWNER')) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
//       <div className="max-w-7xl mx-auto px-2 py-20">

//         {/* Header */}
//         {/* <div className="mb-1">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">
//             Admin Dashboard
//           </h1>
//         </div> */}

//         {/* Tabs */}
//         <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 inline-flex gap-2 border border-gray-100 flex-wrap">

//           {/* 👉 NON SHOP OWNER TABS */}
//           {user?.usertype !== 'SHOP_OWNER' && (
//             <>
//               <button
//                 onClick={() => setActiveTab('users')}
//                 className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
//                   activeTab === 'users'
//                     ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
//                     : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 <Users className="w-4 h-4 mr-2" />
//                 User Details
//               </button>

//               <button
//                 onClick={() => setActiveTab('userTracking')}
//                 className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
//                   activeTab === 'userTracking'
//                     ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
//                     : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 <Activity className="w-4 h-4 mr-2" />
//                 User Tracking
//               </button>

//               <button
//                 onClick={() => setActiveTab('shopOwner')}
//                 className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
//                   activeTab === 'shopOwner'
//                     ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
//                     : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 <Dice6 className="w-4 h-4 mr-2" />
//                 Shops Owner
//               </button>

//               <button
//                 onClick={() => setActiveTab('shop')}
//                 className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
//                   activeTab === 'shop'
//                     ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
//                     : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 <Store className="w-4 h-4 mr-2" />
//                 Shop
//               </button>

//               <button
//                 onClick={() => setActiveTab('adminOffers')}
//                 className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
//                   activeTab === 'adminOffers'
//                     ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
//                     : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 <Dice6 className="w-4 h-4 mr-2" />
//                 Products
//               </button>

//               {/* ✅ NEW FLASH DEAL BUTTON */}
//               <button
//                 onClick={() => setActiveTab('flashDeal')}
//                 className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
//                   activeTab === 'flashDeal'
//                     ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
//                     : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 <Zap className="w-4 h-4 mr-2" />
//                 Flash Deal
//               </button>
//             </>
//           )}

//           {/* 👉 ONLY SHOP OWNER */}
//           {user?.usertype === 'SHOP_OWNER' && (
//             <button
//               onClick={() => setActiveTab('coupons')}
//               className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
//                 activeTab === 'coupons'
//                   ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
//                   : 'text-gray-600 hover:bg-gray-50'
//               }`}
//             >
//               <Tag className="w-4 h-4 mr-2" />
//               Coupons
//             </button>
//           )}

//         </div>

//         {/* Content */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">

//           {user?.usertype !== 'SHOP_OWNER' && activeTab === 'users' && (
//             <UserDetailsTab />
//           )}

//           {user?.usertype === 'SHOP_OWNER' && activeTab === 'coupons' && (
//             <CouponDetails />
//           )}

//           {user?.usertype !== 'SHOP_OWNER' && activeTab === 'userTracking' && (
//             <UsertrackingTab />
//           )}

//           {user?.usertype !== 'SHOP_OWNER' && activeTab === 'adminOffers' && (
//             <AdminOffers />
//           )}

//           {user?.usertype !== 'SHOP_OWNER' && activeTab === 'shop' && (
//             <ShopTab />
//           )}

//           {user?.usertype !== 'SHOP_OWNER' && activeTab === 'shopOwner' && (
//             <ShopOwnerTab />
//           )}

//           {/* ✅ FLASH DEAL CONTENT */}
//           {user?.usertype !== 'SHOP_OWNER' && activeTab === 'flashDeal' && (
//             <FlashDealTab />
//           )}

//         </div>

//       </div>
//     </div>
//   );
// };

// export default AdminPanel;

'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Users, Tag, Activity, Dice6, Store, Zap, Heart } from 'lucide-react'; // ✅ Added Heart

import UserDetailsTab from './UserDetailsTab';
import CouponDetails from './CouponDetails';
import UsertrackingTab from './UsertrackingTab';
import AdminOffers from './AdminOffers';
import ShopOwnerTab from './ShopOwnerTab';
import ShopTab from './ShopTab';
import FlashDealTab from './FlashDealTab';
import ReactionsTab from './ReactionsTab'; // ✅ NEW

import { useSelector } from 'react-redux';
import { selectUser } from '@/app/features/auth/authSlice';
import { selectShops } from '@/app/features/adminPanel/shopSlice';

import { useRouter } from 'next/navigation';

const AdminPanel = () => {
  const user = useSelector(selectUser);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('users');

  // ✅ Auth Check
  useEffect(() => {
    if (!user || (user.usertype !== 'admin' && user.usertype !== 'SHOP_OWNER')) {
      router.push('/');
    }
  }, [user, router]);

  // ✅ Fix default tab based on role
  useEffect(() => {
    if (user?.usertype === 'SHOP_OWNER') {
      setActiveTab('coupons');
    } else if (user?.usertype === 'admin') {
      setActiveTab('users');
    }
  }, [user]);

  // Don't render anything if not authorized (prevents flash)
  if (!user || (user.usertype !== 'admin' && user.usertype !== 'SHOP_OWNER')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-2 py-20">

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 inline-flex gap-2 border border-gray-100 flex-wrap">

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
                onClick={() => setActiveTab('flashDeal')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                  activeTab === 'flashDeal'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Zap className="w-4 h-4 mr-2" />
                Flash Deal
              </button>

              {/* ✅ NEW REACTIONS TAB BUTTON */}
              <button
                onClick={() => setActiveTab('reactions')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                  activeTab === 'reactions'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Heart className="w-4 h-4 mr-2" />
                Reactions
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
          {user?.usertype !== 'SHOP_OWNER' && activeTab === 'flashDeal' && <FlashDealTab />}

          {/* ✅ NEW REACTIONS CONTENT */}
          {user?.usertype !== 'SHOP_OWNER' && activeTab === 'reactions' && <ReactionsTab />}

        </div>

      </div>
    </div>
  );
};

export default AdminPanel;