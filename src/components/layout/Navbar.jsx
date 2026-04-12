// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   MapPin,
//   Sparkles,
//   Gift,
//   Menu,
//   X,
//   ShoppingBag
// } from 'lucide-react';

// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { useSelector } from 'react-redux';
// import Logo from "../../../public/Single Leaf Logo 2.svg";
// import godown from "../../../public/godown.png"
// import LocationPopup from './LocationPopup';
// import LoginPopup from '../LoginPopup';
// import { DEFAULT_LOCATION } from '../constants';
// import { selectIsAuthenticated, selectUser } from '@/app/features/auth/authSlice';

// export default function Navbar() {
//   const router = useRouter();

//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [showLocationPopup, setShowLocationPopup] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const user = useSelector(selectUser);


//   console.log("selectUser 12" , user?.role === "admin")
//   console.log("selectUser 12" , user?.role)

//   /* =========================
//      AUTH-GUARDED HANDLERS
//      ========================= */

//   const handleForyouClick = () => {
//     if (isAuthenticated) {
//       router.push('/');
//     } else {
//       setShowLogin(true);
//     }
//   };

//   const handleSpecialOfferClick = () => {
//     if (isAuthenticated) {
//       router.push('/specialOffer');
//     } else {
//       setShowLogin(true);
//     }
//   };

//   const handleProductsClick = () => {
//     if (isAuthenticated) {
//       router.push('/products');
//     } else {
//       setShowLogin(true);
//     }
//   };
//   const handleAdminClick = () => {
//     if (isAuthenticated) {
//       router.push('/admin');
//     } else {
//       setShowLogin(true);
//     }
//   };

//   /* =========================
//      LOAD SAVED LOCATION
//      ========================= */

//   useEffect(() => {
//     const saved = localStorage.getItem('userLocation');
//     if (saved) {
//       setSelectedLocation(JSON.parse(saved));
//     } else {
//       localStorage.setItem('userLocation', JSON.stringify(DEFAULT_LOCATION));
//       setSelectedLocation(DEFAULT_LOCATION);
//     }
//   }, []);

//   /* =========================
//      NAV CONFIG
//      ========================= */

//   const navItems = [
//     { name: 'For You', icon: Sparkles, onClick: handleForyouClick },
//     { name: 'Special Offers', icon: Gift, onClick: handleSpecialOfferClick },
//     // { name: 'Products', icon: ShoppingBag, onClick: handleProductsClick },
//   ...(user?.role === 'admin'
//     ? [{ name: 'Admin', icon: ShoppingBag, onClick: handleAdminClick }]
//     : []),  ];

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-gray-900 to-black backdrop-blur-md border-b border-amber-900/20 shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">

//           {/* Logo + Location */}
//           <div className="flex items-center gap-4">
//             <Image src={godown} alt="logo" style={{ width: 155 }} />
//             {/* <Image src={Logo} alt="logo" style={{ width: 155 }} /> */}

//             {/* Location (Desktop) */}
//             <div
//               onClick={() => setShowLocationPopup(true)}
//               className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer border border-amber-800/30"
//             >
//               <MapPin className="w-4 h-4 text-amber-400" />
//               <span className="text-sm text-gray-200">
//                 {selectedLocation?.area || 'Location'}
//               </span>
//             </div>
//           </div>

//           {/* Desktop Nav */}
//           <div className="hidden md:flex items-center space-x-2">
//             {navItems.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={item.onClick}
//                 className="relative group px-4 py-2 rounded-lg text-gray-200 hover:text-white transition flex items-center gap-2"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-amber-900/0 to-amber-800/0 group-hover:from-amber-900/20 group-hover:to-amber-800/20 rounded-lg" />
//                 <item.icon className="w-4 h-4 relative z-10 text-amber-400" />
//                 <span className="relative z-10 font-medium">
//                   {item.name}
//                 </span>
//               </button>
//             ))}
//           </div>

//           {/* Mobile Toggle */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="text-gray-200 p-2"
//             >
//               {mobileMenuOpen ? <X /> : <Menu />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div className="md:hidden bg-slate-900/95 border-t border-amber-900/30">
//           <div className="px-4 py-4 space-y-3">

//             {/* Location */}
//             <div
//               onClick={() => {
//                 setShowLocationPopup(true);
//                 setMobileMenuOpen(false);
//               }}
//               className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-gray-200"
//             >
//               <MapPin className="w-4 h-4 text-amber-400" />
//               <span>{selectedLocation?.area || 'Select Location'}</span>
//             </div>

//             {/* Nav Items */}
//             {navItems.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={() => {
//                   item.onClick();
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-200 hover:bg-white/10"
//               >
//                 <item.icon className="w-4 h-4 text-amber-400" />
//                 <span>{item.name}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Popups */}
//       <LocationPopup
//         isOpen={showLocationPopup}
//         onClose={() => setShowLocationPopup(false)}
//         onSelect={setSelectedLocation}
//       />

//       {showLogin && <LoginPopup close={() => setShowLogin(false)} />}
//     </nav>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import {
  MapPin,
  Gift,
  Menu,
  X,
  ShoppingBag,
  LogOut,
  ChevronDown
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import LoginPopup from '../LoginPopup';
import { clearAuth, selectIsAuthenticated, selectUser } from '@/app/features/auth/authSlice';
import {
  
  getLocationList,
  setSelectedLocation,
  selectSelectedLocation,
  selectLocationList,
  userTracking,
} from '@/app/features/adminPanel/adminPanelSlice';
import { fetchBestOfferBillboards } from '@/app/features/billBoard/billBoardSlice';
import toast, { Toaster } from 'react-hot-toast';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const locationData = useSelector(selectLocationList);
  const selectedLocation = useSelector(selectSelectedLocation);

  /* =========================
     MOUNT CHECK (fixes hydration)
     ========================= */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* =========================
     LOAD LOCATIONS + INITIAL FETCH
     ========================= */
  useEffect(() => {
    const initLocation = async () => {
      try {
        const res = await dispatch(getLocationList()).unwrap();
        const locations = res?.data || [];
        const firstLocation = locations?.[0];

        if (firstLocation?.LocationId) {
          dispatch(setSelectedLocation(firstLocation));
          dispatch(fetchBestOfferBillboards({ LocationId: String(firstLocation.LocationId) }));
        } else {
          dispatch(fetchBestOfferBillboards({}));
        }
      } catch {
        dispatch(fetchBestOfferBillboards({}));
      }
    };

    initLocation();
  }, [dispatch]);

  /* =========================
     LOCATION CHANGE HANDLER
     ========================= */
  const handleLocationChange = (location) => {
    dispatch(setSelectedLocation(location));
    dispatch(fetchBestOfferBillboards({ LocationId: String(location.LocationId) }));
    setLocationDropdownOpen(false);
  };

  /* =========================
     AUTH-GUARDED HANDLERS
     ========================= */
  const handleSpecialOfferClick = () => {
    if (isAuthenticated) {
      router.push('/specialOffer');
      dispatch(userTracking('specialOffer'));
    } else {
      setShowLogin(true);
    }
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      router.push('/admin');
    } else {
      setShowLogin(true);
    }
  };

  const handleLogout = () => {
    dispatch(clearAuth());
    router.push('/');
    toast.success('Logged out successfully 👋');
  };

  /* =========================
     NAV CONFIG
     ========================= */


     console.log("user?.usertype" , user?.usertype)
const navItems = [
  { name: 'Special Offers', icon: Gift, onClick: handleSpecialOfferClick },
  ...(mounted && (user?.usertype === 'admin' || user?.usertype === 'SHOP_OWNER')
    ? [{ name: 'Admin', icon: ShoppingBag, onClick: handleAdminClick }]
    : []),
];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md border-b border-orange-500/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* ── Logo + Location ── */}
          <div className="flex items-center gap-4">
            <span className="text-white font-bold text-lg">Offer go down</span>

            {/* Location Dropdown */}
            {mounted && (
              <div className="relative">
                <button
                  onClick={() => setLocationDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/10 hover:from-orange-500/20 hover:to-orange-600/20 border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-100 max-w-[120px] truncate">
                    {selectedLocation?.Name || 'Select Location'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-orange-400 transition-transform duration-200 ${
                      locationDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {locationDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setLocationDropdownOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-2 z-20 min-w-[180px] bg-slate-800 border border-orange-500/20 rounded-2xl shadow-2xl overflow-hidden">
                      <div className="px-4 py-2.5 border-b border-slate-700">
                        <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                          Select Location
                        </p>
                      </div>
                      <div className="py-1 max-h-60 overflow-y-auto">
                        {(locationData || []).map((loc) => (
                          <button
                            key={loc.LocationId}
                            onClick={() => handleLocationChange(loc)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150 hover:bg-orange-500/10 ${
                              selectedLocation?.LocationId === loc.LocationId
                                ? 'bg-orange-500/15 text-orange-300'
                                : 'text-gray-200'
                            }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                selectedLocation?.LocationId === loc.LocationId
                                  ? 'bg-orange-500/30'
                                  : 'bg-slate-700'
                              }`}
                            >
                              <MapPin
                                className={`w-3.5 h-3.5 ${
                                  selectedLocation?.LocationId === loc.LocationId
                                    ? 'text-orange-400'
                                    : 'text-gray-400'
                                }`}
                              />
                            </div>
                            <span className="text-sm font-medium">{loc.Name}</span>
                            {selectedLocation?.LocationId === loc.LocationId && (
                              <span className="ml-auto w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                            )}
                          </button>
                        ))}
                        {(!locationData || locationData.length === 0) && (
                          <p className="px-4 py-3 text-sm text-gray-500 text-center">
                            No locations found
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={item.onClick}
                className="relative group px-5 py-2.5 rounded-xl text-gray-200 hover:text-white transition-all duration-300 flex items-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/0 via-orange-500/0 to-orange-600/0 group-hover:from-orange-600/20 group-hover:via-orange-500/30 group-hover:to-orange-600/20 rounded-xl transition-all duration-300" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                </div>
                <item.icon className="w-5 h-5 relative z-10 text-orange-400 group-hover:text-orange-300 transition-colors" />
                <span className="relative z-10 font-semibold text-sm">{item.name}</span>
              </button>
            ))}

            {/* Only render after mount to avoid hydration mismatch */}
            {mounted && isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-xl text-red-400 hover:text-red-300 flex items-center gap-2 border border-red-500/30 hover:border-red-500/50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold text-sm">Logout</span>
              </button>
            )}
          </div>

          {/* ── Mobile Toggle ── */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-200 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/98 backdrop-blur-lg border-t border-orange-500/20 shadow-xl">
          <div className="px-4 py-4 space-y-2">

            {/* Mobile Location Grid */}
            {mounted && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider px-1 mb-2">
                  Location
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(locationData || []).map((loc) => (
                    <button
                      key={loc.LocationId}
                      onClick={() => {
                        handleLocationChange(loc);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                        selectedLocation?.LocationId === loc.LocationId
                          ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                          : 'bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-700'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{loc.Name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-slate-700/50 pt-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.onClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-200 hover:bg-white/10 active:scale-95 transition-all duration-200 border border-transparent hover:border-orange-500/20"
                >
                  <item.icon className="w-5 h-5 text-orange-400" />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}

              {mounted && isAuthenticated && (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 active:scale-95 transition-all duration-200 border border-red-500/30"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Popups ── */}
      {showLogin && <LoginPopup close={() => setShowLogin(false)} />}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: '#0f172a',
            color: '#fff',
            border: '1px solid #f97316',
          },
        }}
      />
    </nav>
  );
}