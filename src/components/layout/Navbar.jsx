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

// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   MapPin,
//   Gift,
//   Menu,
//   X,
//   ShoppingBag,
//   LogOut,
//   ChevronDown
// } from 'lucide-react';

// import { useRouter } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
// import LoginPopup from '../LoginPopup';
// import { clearAuth, selectIsAuthenticated, selectUser } from '@/app/features/auth/authSlice';
// import {

//   getLocationList,
//   setSelectedLocation,
//   selectSelectedLocation,
//   selectLocationList,
//   userTracking,
// } from '@/app/features/adminPanel/adminPanelSlice';
// import { fetchBestOfferBillboards } from '@/app/features/billBoard/billBoardSlice';
// import toast, { Toaster } from 'react-hot-toast';

// import { resetAdminState } from '@/app/features/adminPanel/adminPanelSlice';
// import { resetShops } from '@/app/features/adminPanel/shopSlice';
// import { resetShopOwners } from '@/app/features/adminPanel/shopOwnerSlice';

// export default function Navbar() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const [mounted, setMounted] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const user = useSelector(selectUser);
//   const locationData = useSelector(selectLocationList);
//   const selectedLocation = useSelector(selectSelectedLocation);

//   /* =========================
//      MOUNT CHECK (fixes hydration)
//      ========================= */
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   /* =========================
//      LOAD LOCATIONS + INITIAL FETCH
//      ========================= */
//   useEffect(() => {
//     const initLocation = async () => {
//       try {
//         const res = await dispatch(getLocationList()).unwrap();
//         const locations = res?.data || [];
//         const firstLocation = locations?.[0];

//         if (firstLocation?.LocationId) {
//           dispatch(setSelectedLocation(firstLocation));
//           dispatch(fetchBestOfferBillboards({ LocationId: String(firstLocation.LocationId) }));
//         } else {
//           dispatch(fetchBestOfferBillboards({}));
//         }
//       } catch {
//         dispatch(fetchBestOfferBillboards({}));
//       }
//     };

//     initLocation();
//   }, [dispatch, isAuthenticated]);

//   /* =========================
//      LOCATION CHANGE HANDLER
//      ========================= */
//   const handleLocationChange = (location) => {
//     dispatch(setSelectedLocation(location));
//     dispatch(fetchBestOfferBillboards({ LocationId: String(location.LocationId) }));
//     setLocationDropdownOpen(false);
//   };

//   /* =========================
//      AUTH-GUARDED HANDLERS
//      ========================= */
//   const handleSpecialOfferClick = () => {
//     if (isAuthenticated) {
//       router.push('/specialOffer');
//       dispatch(userTracking('specialOffer'));
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

//   const handleLogout = () => {
//     dispatch(clearAuth());
//     dispatch(resetAdminState());
//     dispatch(resetShops());
//     dispatch(resetShopOwners());
//     router.push('/');
//     toast.success('Logged out successfully 👋');
//   };

//   /* =========================
//      NAV CONFIG
//      ========================= */


//   console.log("user?.usertype", user?.usertype)
//   const navItems = [
//     ...(mounted && (user?.usertype === 'admin' || user?.usertype === 'SHOP_OWNER')
//       ? []
//       : [{ name: 'Special Offers', icon: Gift, onClick: handleSpecialOfferClick }]),
//     ...(mounted && (user?.usertype === 'admin' || user?.usertype === 'SHOP_OWNER')
//       ? [{ name: 'Admin', icon: ShoppingBag, onClick: handleAdminClick }]
//       : []),
//   ];

//   return (
//     <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
//       {/* ── TOP BAR (Amazon dark navy) ── */}
//       <div style={{ background: '#131921', borderBottom: '1px solid #3a3a3a' }}>
//         <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', height: 60, gap: 8 }}>

//           {/* Logo */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 8, flexShrink: 0 }}>
//             <span style={{ color: '#fff', fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px', lineHeight: 1 }}>
//               offer<span style={{ color: '#FF9900' }}>go</span>down
//             </span>
//           </div>

//           {/* Location Dropdown */}
//           {mounted && !(user?.usertype === 'admin' || user?.usertype === 'SHOP_OWNER') && (
//             <div style={{ position: 'relative', flexShrink: 0 }}>
//               <button
//                 id="navbar-location-btn"
//                 onClick={() => setLocationDropdownOpen((prev) => !prev)}
//                 style={{
//                   display: 'flex', alignItems: 'center', gap: 4,
//                   padding: '6px 8px', borderRadius: 3,
//                   border: '1px solid transparent',
//                   background: 'transparent', cursor: 'pointer',
//                   transition: 'border-color 0.15s',
//                 }}
//                 onMouseEnter={e => e.currentTarget.style.borderColor = '#fff'}
//                 onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
//               >
//                 <MapPin style={{ width: 14, height: 14, color: '#FF9900', flexShrink: 0 }} />
//                 <div style={{ textAlign: 'left' }}>
//                   <div style={{ fontSize: 11, color: '#ccc', lineHeight: 1.2 }}>Location to</div>
//                   <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                     {selectedLocation?.Name || 'Select Location'}
//                   </div>
//                 </div>
//                 <ChevronDown style={{ width: 12, height: 12, color: '#fff', marginLeft: 2, transition: 'transform 0.2s', transform: locationDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
//               </button>

//               {locationDropdownOpen && (
//                 <>
//                   <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setLocationDropdownOpen(false)} />
//                   <div style={{
//                     position: 'absolute', left: 0, top: '100%', marginTop: 4, zIndex: 20,
//                     minWidth: 200, background: '#fff', border: '1px solid #ddd',
//                     borderRadius: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden',
//                   }}>
//                     <div style={{ padding: '10px 16px', borderBottom: '1px solid #eee', background: '#f5f5f5' }}>
//                       <p style={{ fontSize: 12, fontWeight: 700, color: '#131921', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>Choose a location</p>
//                     </div>
//                     <div style={{ maxHeight: 240, overflowY: 'auto' }}>
//                       {(locationData || []).map((loc) => (
//                         <button
//                           key={loc.LocationId}
//                           onClick={() => handleLocationChange(loc)}
//                           style={{
//                             width: '100%', display: 'flex', alignItems: 'center', gap: 10,
//                             padding: '10px 16px', textAlign: 'left', border: 'none', cursor: 'pointer',
//                             background: selectedLocation?.LocationId === loc.LocationId ? '#fff3e0' : '#fff',
//                             borderLeft: selectedLocation?.LocationId === loc.LocationId ? '3px solid #FF9900' : '3px solid transparent',
//                             transition: 'all 0.15s',
//                           }}
//                           onMouseEnter={e => { if (selectedLocation?.LocationId !== loc.LocationId) e.currentTarget.style.background = '#f5f5f5'; }}
//                           onMouseLeave={e => { if (selectedLocation?.LocationId !== loc.LocationId) e.currentTarget.style.background = '#fff'; }}
//                         >
//                           <MapPin style={{ width: 14, height: 14, color: '#FF9900', flexShrink: 0 }} />
//                           <span style={{ fontSize: 13, fontWeight: 500, color: '#131921' }}>{loc.Name}</span>
//                           {selectedLocation?.LocationId === loc.LocationId && (
//                             <span style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#FF9900', flexShrink: 0 }} />
//                           )}
//                         </button>
//                       ))}
//                       {(!locationData || locationData.length === 0) && (
//                         <p style={{ padding: '12px 16px', fontSize: 13, color: '#888', textAlign: 'center', margin: 0 }}>No locations found</p>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* Spacer */}
//           <div style={{ flex: 1 }} />

//           {/* Desktop Nav Items */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//             {navItems.map((item) => (
//               <button
//                 id={`navbar-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
//                 key={item.name}
//                 onClick={item.onClick}
//                 style={{
//                   display: 'flex', alignItems: 'center', gap: 6,
//                   padding: '6px 10px', borderRadius: 3,
//                   border: '1px solid transparent', background: 'transparent',
//                   color: '#fff', cursor: 'pointer', transition: 'border-color 0.15s', flexShrink: 0,
//                 }}
//                 onMouseEnter={e => e.currentTarget.style.borderColor = '#fff'}
//                 onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
//               >
//                 <item.icon style={{ width: 16, height: 16, color: '#FF9900' }} />
//                 <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{item.name}</span>
//               </button>
//             ))}

//             {/* Logout */}
//             {mounted && isAuthenticated && (
//               <button
//                 id="navbar-logout-btn"
//                 onClick={handleLogout}
//                 style={{
//                   display: 'flex', alignItems: 'center', gap: 6,
//                   padding: '6px 12px', borderRadius: 3,
//                   border: '1px solid transparent', background: 'transparent',
//                   color: '#fff', cursor: 'pointer', transition: 'border-color 0.15s', flexShrink: 0,
//                 }}
//                 onMouseEnter={e => e.currentTarget.style.borderColor = '#FF9900'}
//                 onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
//               >
//                 <LogOut style={{ width: 16, height: 16, color: '#FF9900' }} />
//                 <span style={{ fontSize: 13, fontWeight: 600 }}>Logout</span>
//               </button>
//             )}
//           </div>

//           {/* Mobile Toggle */}
//           <button
//             id="navbar-mobile-menu-btn"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             style={{ display: 'none', color: '#fff', padding: 8, background: 'transparent', border: 'none', cursor: 'pointer' }}
//             className="md-hidden-toggle"
//           >
//             {mobileMenuOpen ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
//           </button>
//         </div>
//       </div>

//       {/* ── MOBILE MENU ── */}
//       {mobileMenuOpen && (
//         <div style={{ background: '#131921', borderTop: '1px solid #3a3a3a', padding: '12px 16px' }}>
//           {mounted && (
//             <div style={{ marginBottom: 12 }}>
//               <p style={{ fontSize: 11, fontWeight: 700, color: '#FF9900', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Location</p>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
//                 {(locationData || []).map((loc) => (
//                   <button
//                     key={loc.LocationId}
//                     onClick={() => { handleLocationChange(loc); setMobileMenuOpen(false); }}
//                     style={{
//                       display: 'flex', alignItems: 'center', gap: 6,
//                       padding: '8px 10px', borderRadius: 3,
//                       border: selectedLocation?.LocationId === loc.LocationId ? '1px solid #FF9900' : '1px solid #444',
//                       background: selectedLocation?.LocationId === loc.LocationId ? '#fff3e0' : '#232f3e',
//                       color: selectedLocation?.LocationId === loc.LocationId ? '#131921' : '#ccc',
//                       cursor: 'pointer', fontSize: 12, fontWeight: 500,
//                     }}
//                   >
//                     <MapPin style={{ width: 12, height: 12, flexShrink: 0 }} />
//                     <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc.Name}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//           <div style={{ borderTop: '1px solid #3a3a3a', paddingTop: 8 }}>
//             {navItems.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={() => { item.onClick(); setMobileMenuOpen(false); }}
//                 style={{
//                   width: '100%', display: 'flex', alignItems: 'center', gap: 10,
//                   padding: '10px 8px', border: 'none', background: 'transparent',
//                   color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500, borderRadius: 3,
//                 }}
//               >
//                 <item.icon style={{ width: 16, height: 16, color: '#FF9900' }} />
//                 <span>{item.name}</span>
//               </button>
//             ))}
//             {mounted && isAuthenticated && (
//               <button
//                 onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
//                 style={{
//                   width: '100%', display: 'flex', alignItems: 'center', gap: 10,
//                   padding: '10px 8px', border: 'none', background: 'transparent',
//                   color: '#ff6b6b', cursor: 'pointer', fontSize: 14, fontWeight: 500, borderRadius: 3,
//                 }}
//               >
//                 <LogOut style={{ width: 16, height: 16 }} />
//                 <span>Logout</span>
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── Popups ── */}
//       {showLogin && <LoginPopup close={() => setShowLogin(false)} />}

//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 2500,
//           style: {
//             background: '#232f3e',
//             color: '#fff',
//             border: '1px solid #FF9900',
//             borderRadius: 4,
//           },
//         }}
//       />
//     </nav>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   MapPin,
//   Gift,
//   Menu,
//   X,
//   ShoppingBag,
//   LogOut,
//   ChevronDown,
//   Zap
// } from 'lucide-react';

// import { useRouter } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
// import LoginPopup from '../LoginPopup';
// import { clearAuth, selectIsAuthenticated, selectUser } from '@/app/features/auth/authSlice';
// import {
//   getLocationList,
//   setSelectedLocation,
//   selectSelectedLocation,
//   selectLocationList,
//   userTracking,
// } from '@/app/features/adminPanel/adminPanelSlice';
// import { fetchBestOfferBillboards } from '@/app/features/billBoard/billBoardSlice';
// import toast, { Toaster } from 'react-hot-toast';

// import { resetAdminState } from '@/app/features/adminPanel/adminPanelSlice';
// import { resetShops } from '@/app/features/adminPanel/shopSlice';
// import { resetShopOwners } from '@/app/features/adminPanel/shopOwnerSlice';

// export default function Navbar() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const [mounted, setMounted] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const user = useSelector(selectUser);
//   const locationData = useSelector(selectLocationList);
//   const selectedLocation = useSelector(selectSelectedLocation);

//   /* =========================
//      MOUNT CHECK (fixes hydration)
//      ========================= */
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   /* =========================
//      LOAD LOCATIONS + INITIAL FETCH
//      ========================= */
//   useEffect(() => {
//     const initLocation = async () => {
//       try {
//         const res = await dispatch(getLocationList()).unwrap();
//         const locations = res?.data || [];
//         const firstLocation = locations?.[0];

//         if (firstLocation?.LocationId) {
//           dispatch(setSelectedLocation(firstLocation));
//           dispatch(fetchBestOfferBillboards({ LocationId: String(firstLocation.LocationId) }));
//         } else {
//           dispatch(fetchBestOfferBillboards({}));
//         }
//       } catch {
//         dispatch(fetchBestOfferBillboards({}));
//       }
//     };

//     initLocation();
//   }, [dispatch, isAuthenticated]);

//   /* =========================
//      LOCATION CHANGE HANDLER
//      ========================= */
//   const handleLocationChange = (location) => {
//     dispatch(setSelectedLocation(location));
//     dispatch(fetchBestOfferBillboards({ LocationId: String(location.LocationId) }));
//     setLocationDropdownOpen(false);
//   };

//   /* =========================
//      AUTH-GUARDED HANDLERS
//      ========================= */
//   const handleSpecialOfferClick = () => {
//     if (isAuthenticated) {
//       router.push('/specialOffer');
//       dispatch(userTracking('specialOffer'));
//     } else {
//       setShowLogin(true);
//     }
//   };

//   const handleLogout = () => {
//   dispatch(clearAuth());
//   dispatch(resetAdminState());
//   dispatch(resetShops());
//   dispatch(resetShopOwners());
//   router.push('/');
//   toast.success('Logged out successfully 👋');
// };
//   const handleAdminClick = () => {
//     if (isAuthenticated) {
//       router.push('/admin');
//     } else {
//       setShowLogin(true);
//     }
//   };

//   // ── NEW: Super Deal handler ──
//   const handleSuperDealClick = () => {
//     if (isAuthenticated) {
//       router.push('/superDeal');
//       dispatch(userTracking('superDeal'));
//     } else {
//       setShowLogin(true);
//     }
//   };

//   /* =========================
//      NAV CONFIG
//      ========================= */
//   console.log("user?.usertype", user?.usertype);

//   const navItems = [
//     ...(mounted && (user?.usertype === 'admin' || user?.usertype === 'SHOP_OWNER')
//       ? []
//       : [
//           { name: 'Special Offers', icon: Gift, onClick: handleSpecialOfferClick },
//           // ── NEW: Super Deal nav item (visible to regular users only) ──
//           { name: 'Super Deal', icon: Zap, onClick: handleSuperDealClick },
//         ]),
//     ...(mounted && (user?.usertype === 'admin' || user?.usertype === 'SHOP_OWNER')
//       ? [{ name: 'Admin', icon: ShoppingBag, onClick: handleAdminClick }]
//       : []),
//   ];

//   return (
//     <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
//       {/* ── TOP BAR (Amazon dark navy) ── */}
//       <div style={{ background: '#131921', borderBottom: '1px solid #3a3a3a' }}>
//         <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', height: 60, gap: 8 }}>

//           {/* Logo */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 8, flexShrink: 0 }}>
//             <span style={{ color: '#fff', fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px', lineHeight: 1 }}>
//               offer<span style={{ color: '#FF9900' }}>go</span>down
//             </span>
//           </div>

//           {/* Location Dropdown */}
//           {mounted && !(user?.usertype === 'admin' || user?.usertype === 'SHOP_OWNER') && (
//             <div style={{ position: 'relative', flexShrink: 0 }}>
//               <button
//                 id="navbar-location-btn"
//                 onClick={() => setLocationDropdownOpen((prev) => !prev)}
//                 style={{
//                   display: 'flex', alignItems: 'center', gap: 4,
//                   padding: '6px 8px', borderRadius: 3,
//                   border: '1px solid transparent',
//                   background: 'transparent', cursor: 'pointer',
//                   transition: 'border-color 0.15s',
//                 }}
//                 onMouseEnter={e => e.currentTarget.style.borderColor = '#fff'}
//                 onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
//               >
//                 <MapPin style={{ width: 14, height: 14, color: '#FF9900', flexShrink: 0 }} />
//                 <div style={{ textAlign: 'left' }}>
//                   <div style={{ fontSize: 11, color: '#ccc', lineHeight: 1.2 }}>Location to</div>
//                   <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                     {selectedLocation?.Name || 'Select Location'}
//                   </div>
//                 </div>
//                 <ChevronDown style={{ width: 12, height: 12, color: '#fff', marginLeft: 2, transition: 'transform 0.2s', transform: locationDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
//               </button>

//               {locationDropdownOpen && (
//                 <>
//                   <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setLocationDropdownOpen(false)} />
//                   <div style={{
//                     position: 'absolute', left: 0, top: '100%', marginTop: 4, zIndex: 20,
//                     minWidth: 200, background: '#fff', border: '1px solid #ddd',
//                     borderRadius: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden',
//                   }}>
//                     <div style={{ padding: '10px 16px', borderBottom: '1px solid #eee', background: '#f5f5f5' }}>
//                       <p style={{ fontSize: 12, fontWeight: 700, color: '#131921', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>Choose a location</p>
//                     </div>
//                     <div style={{ maxHeight: 240, overflowY: 'auto' }}>
//                       {(locationData || []).map((loc) => (
//                         <button
//                           key={loc.LocationId}
//                           onClick={() => handleLocationChange(loc)}
//                           style={{
//                             width: '100%', display: 'flex', alignItems: 'center', gap: 10,
//                             padding: '10px 16px', textAlign: 'left', border: 'none', cursor: 'pointer',
//                             background: selectedLocation?.LocationId === loc.LocationId ? '#fff3e0' : '#fff',
//                             borderLeft: selectedLocation?.LocationId === loc.LocationId ? '3px solid #FF9900' : '3px solid transparent',
//                             transition: 'all 0.15s',
//                           }}
//                           onMouseEnter={e => { if (selectedLocation?.LocationId !== loc.LocationId) e.currentTarget.style.background = '#f5f5f5'; }}
//                           onMouseLeave={e => { if (selectedLocation?.LocationId !== loc.LocationId) e.currentTarget.style.background = '#fff'; }}
//                         >
//                           <MapPin style={{ width: 14, height: 14, color: '#FF9900', flexShrink: 0 }} />
//                           <span style={{ fontSize: 13, fontWeight: 500, color: '#131921' }}>{loc.Name}</span>
//                           {selectedLocation?.LocationId === loc.LocationId && (
//                             <span style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#FF9900', flexShrink: 0 }} />
//                           )}
//                         </button>
//                       ))}
//                       {(!locationData || locationData.length === 0) && (
//                         <p style={{ padding: '12px 16px', fontSize: 13, color: '#888', textAlign: 'center', margin: 0 }}>No locations found</p>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* Spacer */}
//           <div style={{ flex: 1 }} />

//           {/* Desktop Nav Items */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//             {navItems.map((item) => (
//               <button
//                 id={`navbar-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
//                 key={item.name}
//                 onClick={item.onClick}
//                 style={{
//                   display: 'flex', alignItems: 'center', gap: 6,
//                   padding: '6px 10px', borderRadius: 3,
//                   border: '1px solid transparent', background: 'transparent',
//                   color: '#fff', cursor: 'pointer', transition: 'border-color 0.15s', flexShrink: 0,
//                 }}
//                 onMouseEnter={e => e.currentTarget.style.borderColor = '#fff'}
//                 onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
//               >
//                 <item.icon style={{ width: 16, height: 16, color: '#FF9900' }} />
//                 <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{item.name}</span>
//               </button>
//             ))}

//             {/* Logout */}
//             {mounted && isAuthenticated && (
//               <button
//                 id="navbar-logout-btn"
//                 onClick={handleLogout}
//                 style={{
//                   display: 'flex', alignItems: 'center', gap: 6,
//                   padding: '6px 12px', borderRadius: 3,
//                   border: '1px solid transparent', background: 'transparent',
//                   color: '#fff', cursor: 'pointer', transition: 'border-color 0.15s', flexShrink: 0,
//                 }}
//                 onMouseEnter={e => e.currentTarget.style.borderColor = '#FF9900'}
//                 onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
//               >
//                 <LogOut style={{ width: 16, height: 16, color: '#FF9900' }} />
//                 <span style={{ fontSize: 13, fontWeight: 600 }}>Logout</span>
//               </button>
//             )}
//           </div>

//           {/* Mobile Toggle */}
//           <button
//             id="navbar-mobile-menu-btn"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             style={{ display: 'none', color: '#fff', padding: 8, background: 'transparent', border: 'none', cursor: 'pointer' }}
//             className="md-hidden-toggle"
//           >
//             {mobileMenuOpen ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
//           </button>
//         </div>
//       </div>

//       {/* ── MOBILE MENU ── */}
//       {mobileMenuOpen && (
//         <div style={{ background: '#131921', borderTop: '1px solid #3a3a3a', padding: '12px 16px' }}>
//           {mounted && (
//             <div style={{ marginBottom: 12 }}>
//               <p style={{ fontSize: 11, fontWeight: 700, color: '#FF9900', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Location</p>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
//                 {(locationData || []).map((loc) => (
//                   <button
//                     key={loc.LocationId}
//                     onClick={() => { handleLocationChange(loc); setMobileMenuOpen(false); }}
//                     style={{
//                       display: 'flex', alignItems: 'center', gap: 6,
//                       padding: '8px 10px', borderRadius: 3,
//                       border: selectedLocation?.LocationId === loc.LocationId ? '1px solid #FF9900' : '1px solid #444',
//                       background: selectedLocation?.LocationId === loc.LocationId ? '#fff3e0' : '#232f3e',
//                       color: selectedLocation?.LocationId === loc.LocationId ? '#131921' : '#ccc',
//                       cursor: 'pointer', fontSize: 12, fontWeight: 500,
//                     }}
//                   >
//                     <MapPin style={{ width: 12, height: 12, flexShrink: 0 }} />
//                     <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc.Name}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//           <div style={{ borderTop: '1px solid #3a3a3a', paddingTop: 8 }}>
//             {navItems.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={() => { item.onClick(); setMobileMenuOpen(false); }}
//                 style={{
//                   width: '100%', display: 'flex', alignItems: 'center', gap: 10,
//                   padding: '10px 8px', border: 'none', background: 'transparent',
//                   color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500, borderRadius: 3,
//                 }}
//               >
//                 <item.icon style={{ width: 16, height: 16, color: '#FF9900' }} />
//                 <span>{item.name}</span>
//               </button>
//             ))}
//             {mounted && isAuthenticated && (
//               <button
//                 onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
//                 style={{
//                   width: '100%', display: 'flex', alignItems: 'center', gap: 10,
//                   padding: '10px 8px', border: 'none', background: 'transparent',
//                   color: '#ff6b6b', cursor: 'pointer', fontSize: 14, fontWeight: 500, borderRadius: 3,
//                 }}
//               >
//                 <LogOut style={{ width: 16, height: 16 }} />
//                 <span>Logout</span>
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── Popups ── */}
//       {showLogin && <LoginPopup close={() => setShowLogin(false)} />}

//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 2500,
//           style: {
//             background: '#232f3e',
//             color: '#fff',
//             border: '1px solid #FF9900',
//             borderRadius: 4,
//           },
//         }}
//       />
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
  ChevronDown,
  Zap,
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
import { fetchBestOfferBillboards, fetchSuperDeals } from '@/app/features/billBoard/billBoardSlice';
import toast, { Toaster } from 'react-hot-toast';
import { resetAdminState } from '@/app/features/adminPanel/adminPanelSlice';
import { resetShops } from '@/app/features/adminPanel/shopSlice';
import { resetShopOwners } from '@/app/features/adminPanel/shopOwnerSlice';

const MOBILE_BREAKPOINT = 768;

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // ✅ JS-driven responsive

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const locationData = useSelector(selectLocationList);
  const selectedLocation = useSelector(selectSelectedLocation);

  /* =========================
     MOUNT + RESIZE LISTENER
     ========================= */
  useEffect(() => {
    setMounted(true);

    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile(); // run on mount

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false);
  }, [isMobile]);

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
          dispatch(fetchSuperDeals({ LocationId: String(firstLocation.LocationId) }));
        } else {
          dispatch(fetchBestOfferBillboards({}));
          dispatch(fetchSuperDeals({}));
        }
      } catch {
        dispatch(fetchBestOfferBillboards({}));
        dispatch(fetchSuperDeals({}));
      }
    };

    initLocation();
  }, [dispatch, isAuthenticated]);

  /* =========================
     LOCATION CHANGE HANDLER
     ========================= */
  const handleLocationChange = (location) => {
    dispatch(setSelectedLocation(location));
    dispatch(fetchBestOfferBillboards({ LocationId: String(location.LocationId) }));
    dispatch(fetchSuperDeals({ LocationId: String(location.LocationId) }));
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

  const handleLogout = () => {
    dispatch(clearAuth());
    dispatch(resetAdminState());
    dispatch(resetShops());
    dispatch(resetShopOwners());
    router.push('/');
    toast.success('Logged out successfully 👋');
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      router.push('/admin');
    } else {
      setShowLogin(true);
    }
  };

  const handleSuperDealClick = () => {
    if (isAuthenticated) {
      router.push('/superDeal');
      dispatch(userTracking('superDeal'));
    } else {
      setShowLogin(true);
    }
  };

  /* =========================
     NAV ITEMS CONFIG
     ========================= */
  const isAdminOrOwner = mounted && (user?.usertype === 'admin' || user?.usertype === 'SHOP_OWNER');

  const navItems = [
    ...(!isAdminOrOwner
      ? [
        { name: 'Super Deal', icon: Zap, onClick: handleSuperDealClick },
          { name: 'Nearby Offers', icon: Gift, onClick: handleSpecialOfferClick },
        ]
      : []),
    ...(isAdminOrOwner
      ? [{ name: 'Admin', icon: ShoppingBag, onClick: handleAdminClick }]
      : []),
  ];

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>

      {/* ── TOP BAR ── */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto', padding: '0 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70, gap: 16,
        }}>

          {/* Left: Location Dropdown (Desktop) */}
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-start' }}>
            {mounted && !isAdminOrOwner && !isMobile && (
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  id="navbar-location-btn"
                  onClick={() => setLocationDropdownOpen((prev) => !prev)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px', borderRadius: 12,
                    border: '1px solid #e5e7eb', background: '#fbfbfb',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.background = '#f3f4f6';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.background = '#fbfbfb';
                  }}
                >
                  <MapPin style={{ width: 16, height: 16, color: '#8B5CF6', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1f2937' }}>
                    {selectedLocation?.Name || 'Select Location'}
                  </span>
                  <ChevronDown style={{
                    width: 14, height: 14, color: '#4b5563', marginLeft: 2,
                    transition: 'transform 0.2s',
                    transform: locationDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }} />
                </button>

                {locationDropdownOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setLocationDropdownOpen(false)} />
                    <div style={{
                      position: 'absolute', left: 0, top: '100%', marginTop: 8, zIndex: 20,
                      minWidth: 220, background: '#fff', border: '1px solid #e5e7eb',
                      borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden',
                    }}>
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', background: '#f9fafb' }}>
                        <p style={{ fontSize: 11, fontWeight: 800, color: '#374151', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Choose a location
                        </p>
                      </div>
                      <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                        {(locationData || []).map((loc) => (
                          <button
                            key={loc.LocationId}
                            onClick={() => handleLocationChange(loc)}
                            style={{
                              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                              padding: '10px 16px', textAlign: 'left', border: 'none', cursor: 'pointer',
                              background: selectedLocation?.LocationId === loc.LocationId ? '#f3e8ff' : '#fff',
                              borderLeft: selectedLocation?.LocationId === loc.LocationId ? '3px solid #8B5CF6' : '3px solid transparent',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { if (selectedLocation?.LocationId !== loc.LocationId) e.currentTarget.style.background = '#f9fafb'; }}
                            onMouseLeave={e => { if (selectedLocation?.LocationId !== loc.LocationId) e.currentTarget.style.background = '#fff'; }}
                          >
                            <MapPin style={{ width: 14, height: 14, color: '#8B5CF6', flexShrink: 0 }} />
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{loc.Name}</span>
                            {selectedLocation?.LocationId === loc.LocationId && (
                              <span style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#8B5CF6', flexShrink: 0 }} />
                            )}
                          </button>
                        ))}
                        {(!locationData || locationData.length === 0) && (
                          <p style={{ padding: '12px 16px', fontSize: 13, color: '#888', textAlign: 'center', margin: 0 }}>
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

          {/* Center: Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div 
              onClick={() => router.push('/')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <svg width="26" height="26" viewBox="0 0 100 100" style={{ marginRight: 0, flexShrink: 0 }}>
                <defs>
                  <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="36" stroke="url(#logo-gradient)" strokeWidth="18" fill="none" />
              </svg>
              <span style={{ 
                fontSize: '22px', 
                fontWeight: '800', 
                color: '#ef4444', 
                fontFamily: "'Poppins', 'Inter', sans-serif",
                letterSpacing: '-0.5px'
              }}>
                ffer Sandhai
              </span>
            </div>
          </div>

          {/* Right: Desktop Nav & Logout (or hamburger on mobile) */}
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end', gap: 12 }}>
            {/* Desktop Nav */}
            {!isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {navItems.map((item) => (
                  <button
                    id={`navbar-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
                    key={item.name}
                    onClick={item.onClick}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', borderRadius: 8,
                      border: '1px solid transparent', background: 'transparent',
                      color: '#4b5563', cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0,
                      fontWeight: 600,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#f3f4f6';
                      e.currentTarget.style.color = '#1f2937';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#4b5563';
                    }}
                  >
                    <item.icon style={{ width: 16, height: 16, color: '#8B5CF6' }} />
                    <span style={{ fontSize: 13, whiteSpace: 'nowrap' }}>{item.name}</span>
                  </button>
                ))}

                {mounted && isAuthenticated && (
                  <button
                    id="navbar-logout-btn"
                    onClick={handleLogout}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 16px', borderRadius: 8,
                      border: '1px solid #EF4444', background: 'transparent',
                      color: '#EF4444', cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0,
                      fontWeight: 600,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#FEF2F2';
                      e.currentTarget.style.borderColor = '#DC2626';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = '#EF4444';
                    }}
                  >
                    <LogOut style={{ width: 16, height: 16, color: '#EF4444' }} />
                    <span style={{ fontSize: 13 }}>Logout</span>
                  </button>
                )}
              </div>
            )}

            {/* Mobile Hamburger */}
            {isMobile && (
              <button
                id="navbar-mobile-menu-btn"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 40, height: 40, borderRadius: 8,
                  background: mobileMenuOpen ? '#f3f4f6' : 'transparent',
                  border: '1px solid',
                  borderColor: mobileMenuOpen ? '#e5e7eb' : 'transparent',
                  color: '#1f2937', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                {mobileMenuOpen
                  ? <X style={{ width: 22, height: 22, color: '#8B5CF6' }} />
                  : <Menu style={{ width: 22, height: 22, color: '#1f2937' }} />
                }
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ── MOBILE DROPDOWN MENU ── */}
      {isMobile && mobileMenuOpen && (
        <div style={{
          background: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          padding: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        }}>

          {/* Location section */}
          {mounted && !isAdminOrOwner && (
            <div style={{ marginBottom: 16 }}>
              <p style={{
                fontSize: 11, fontWeight: 800, color: '#8B5CF6',
                textTransform: 'uppercase', letterSpacing: 0.5,
                margin: '0 0 8px',
              }}>
                📍 Location
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {(locationData || []).map((loc) => {
                  const isSelected = selectedLocation?.LocationId === loc.LocationId;
                  return (
                    <button
                      key={loc.LocationId}
                      onClick={() => { handleLocationChange(loc); setMobileMenuOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '8px 10px', borderRadius: 8,
                        border: isSelected ? '1px solid #8B5CF6' : '1px solid #e5e7eb',
                        background: isSelected ? '#f3e8ff' : '#fbfbfb',
                        color: isSelected ? '#8B5CF6' : '#4b5563',
                        cursor: 'pointer', fontSize: 12, fontWeight: 600,
                        transition: 'all 0.15s',
                      }}
                    >
                      <MapPin style={{ width: 12, height: 12, flexShrink: 0, color: isSelected ? '#8B5CF6' : '#9ca3af' }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {loc.Name}
                      </span>
                      {isSelected && (
                        <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#8B5CF6', flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
                {(!locationData || locationData.length === 0) && (
                  <p style={{ fontSize: 12, color: '#888', margin: 0, gridColumn: '1 / -1' }}>No locations found</p>
                )}
              </div>
            </div>
          )}

          {/* Divider */}
          <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: 8 }} />

          {/* Nav items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => { item.onClick(); setMobileMenuOpen(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 10px', borderRadius: 8,
                  border: 'none', background: 'transparent',
                  color: '#4b5563', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <item.icon style={{ width: 17, height: 17, color: '#8B5CF6', flexShrink: 0 }} />
                <span>{item.name}</span>
              </button>
            ))}

            {/* Logout */}
            {mounted && isAuthenticated && (
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 10px', borderRadius: 8,
                  border: 'none', background: 'transparent',
                  color: '#EF4444', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                  transition: 'all 0.15s',
                  marginTop: 4, borderTop: '1px solid #e5e7eb',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut style={{ width: 17, height: 17, flexShrink: 0, color: '#EF4444' }} />
                <span>Logout</span>
              </button>
            )}
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
            background: '#ffffff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
        }}
      />
    </nav>
  );
}