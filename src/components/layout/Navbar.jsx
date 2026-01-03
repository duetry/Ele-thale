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
  Sparkles,
  Gift,
  Menu,
  X,
  ShoppingBag
} from 'lucide-react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Logo from "../../../public/Single Leaf Logo 2.svg";
import godown from "../../../public/godown.png"
import LocationPopup from './LocationPopup';
import LoginPopup from '../LoginPopup';
import { DEFAULT_LOCATION } from '../constants';
import { selectIsAuthenticated, selectUser } from '@/app/features/auth/authSlice';

export default function Navbar() {
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);


  console.log("selectUser 12" , user?.role === "admin")
  console.log("selectUser 12" , user?.role)

  /* =========================
     AUTH-GUARDED HANDLERS
     ========================= */

  const handleForyouClick = () => {
    if (isAuthenticated) {
      router.push('/');
    } else {
      setShowLogin(true);
    }
  };

  const handleSpecialOfferClick = () => {
    if (isAuthenticated) {
      router.push('/specialOffer');
    } else {
      setShowLogin(true);
    }
  };

  const handleProductsClick = () => {
    if (isAuthenticated) {
      router.push('/products');
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

  /* =========================
     LOAD SAVED LOCATION
     ========================= */

  useEffect(() => {
    const saved = localStorage.getItem('userLocation');
    if (saved) {
      setSelectedLocation(JSON.parse(saved));
    } else {
      localStorage.setItem('userLocation', JSON.stringify(DEFAULT_LOCATION));
      setSelectedLocation(DEFAULT_LOCATION);
    }
  }, []);

  /* =========================
     NAV CONFIG
     ========================= */

  const navItems = [
    { name: 'For You', icon: Sparkles, onClick: handleForyouClick },
    { name: 'Special Offers', icon: Gift, onClick: handleSpecialOfferClick },
    // { name: 'Products', icon: ShoppingBag, onClick: handleProductsClick },
  ...(user?.role === 'admin'
    ? [{ name: 'Admin', icon: ShoppingBag, onClick: handleAdminClick }]
    : []),  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md border-b border-orange-500/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo + Location */}
          <div className="flex items-center gap-6">
            {/* Logo with white background for visibility */}
              <Image 
                src={godown} 
                alt="OfferGodown Logo" 
                style={{ width: 140, height: 'auto' }} 
                className="object-contain"
              />

            {/* Location (Desktop) */}
            <div
              onClick={() => setShowLocationPopup(true)}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/10 hover:from-orange-500/20 hover:to-orange-600/20 cursor-pointer border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <MapPin className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-gray-100">
                {selectedLocation?.area || 'Location'}
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
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
                <span className="relative z-10 font-semibold text-sm">
                  {item.name}
                </span>
              </button>
            ))}
          </div>

          {/* Mobile Toggle */}
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/98 backdrop-blur-lg border-t border-orange-500/20 shadow-xl">
          <div className="px-4 py-4 space-y-2">

            {/* Location */}
            <div
              onClick={() => {
                setShowLocationPopup(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 text-gray-100 active:scale-95 transition-transform"
            >
              <MapPin className="w-5 h-5 text-orange-400" />
              <span className="font-medium">{selectedLocation?.area || 'Select Location'}</span>
            </div>

            {/* Nav Items */}
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
          </div>
        </div>
      )}

      {/* Popups */}
      <LocationPopup
        isOpen={showLocationPopup}
        onClose={() => setShowLocationPopup(false)}
        onSelect={setSelectedLocation}
      />

      {showLogin && <LoginPopup close={() => setShowLogin(false)} />}
    </nav>
  );
}