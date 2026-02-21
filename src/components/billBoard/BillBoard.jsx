// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { motion } from 'framer-motion';

// import { fetchBestOfferBillboards } from '@/app/features/billBoard/billBoardSlice';
// import { fetchProductOffer } from '@/app/features/products/productSlice';
// import UnlockOfferModal from '../products/UnlockOfferModel';
// import { userTracking } from '@/app/features/adminPanel/adminPanelSlice';

// export default function BillboardBanners() {
//   const dispatch = useDispatch();

//   const [mounted, setMounted] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [couponCode, setCouponCode] = useState(null);
//   const [currentBanner, setCurrentBanner] = useState(0);

//   const {
//     bestOfferBillboards,
//     bestOfferLoading,
//     bestOfferError,
//     bestOfferBanner
//   } = useSelector((state) => state.billboards);

//   /* ------------------ MOUNT CHECK ------------------ */
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   /* ------------------ API CALL ------------------ */
//   useEffect(() => {
//     dispatch(fetchBestOfferBillboards());
//   }, [dispatch]);

//   /* ------------------ BANNER AUTO SLIDE ------------------ */
//   useEffect(() => {
//     if (!mounted || !bestOfferBanner?.length) return;

//     const interval = setInterval(() => {
//       setCurrentBanner((prev) =>
//         prev === bestOfferBanner.length - 1 ? 0 : prev + 1
//       );
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [mounted, bestOfferBanner]);

//   /* ------------------ CLICK HANDLER ------------------ */
//   const handleUnlockOffer = (product) => {
//     dispatch(userTracking(product?.ProductName));

//     dispatch(fetchProductOffer(product.Storeid))
//       .unwrap()
//       .then((res) => {
//         setCouponCode(res?.data?.[0]);
//         setSelectedProduct(product);
//       })
//       .catch((err) => {
//         console.error('Offer API failed:', err);
//       });
//   };

//   /* ------------------ STATES ------------------ */
//   if (!mounted || bestOfferLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="h-12 w-12 rounded-full border-b-2 border-gray-900 animate-spin" />
//       </div>
//     );
//   }

//   if (bestOfferError) {
//     return (
//       <div className="flex justify-center items-center min-h-screen text-red-600">
//         {bestOfferError}
//       </div>
//     );
//   }

//   /* ------------------ SORT BY DISCOUNT % ------------------ */
//   const sorted = [...(bestOfferBillboards || [])].sort((a, b) => {
//     const discountA =
//       a.Price && a.Finalprice ? ((a.Price - a.Finalprice) / a.Price) * 100 : 0;
//     const discountB =
//       b.Price && b.Finalprice ? ((b.Price - b.Finalprice) / b.Price) * 100 : 0;

//     return discountB - discountA;
//   });

//   return (
//     <div className="w-full bg-white mt-16">
//       <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

//         {/* ===================== BANNER CAROUSEL ===================== */}
//         {bestOfferBanner?.length > 0 && (
//           <div className="relative w-full overflow-hidden rounded-3xl mb-14 shadow-lg">
//             <div
//               className="flex transition-transform duration-700 ease-in-out"
//               style={{ transform: `translateX(-${currentBanner * 100}%)` }}
//             >
//               {bestOfferBanner.map((banner, index) => (
//                 <div key={index} className="min-w-full h-[320px] sm:h-[420px]">
//                   <img
//                     src={banner.Imageurl}
//                     alt="Best Offer Banner"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* Dots */}
//             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
//               {bestOfferBanner.map((_, i) => (
//                 <span
//                   key={i}
//                   onClick={() => setCurrentBanner(i)}
//                   className={`h-2.5 w-2.5 rounded-full cursor-pointer ${
//                     currentBanner === i ? 'bg-white' : 'bg-white/50'
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ===================== OFFER CARDS ===================== */}
//         <div className="grid grid-cols-12 gap-6">
//           {sorted.map((item) => {
//             const discountPercent = Math.round(
//               ((item.Price - item.Finalprice) / item.Price) * 100
//             );

//             return (
//               <motion.div
//                 key={item.Productid}
//                 onClick={() => handleUnlockOffer(item)}
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 whileHover={{ scale: 1.03 }}
//                 transition={{ duration: 0.4, ease: 'easeOut' }}
//                 className="
//                   col-span-12 sm:col-span-6 lg:col-span-3
//                   cursor-pointer rounded-2xl
//                   bg-gradient-to-br from-green-50 to-emerald-50
//                   border border-green-200
//                   relative overflow-hidden
//                   hover:shadow-[0_0_25px_rgba(34,197,94,0.45)]
//                   h-[360px]
//                 "
//               >
//                 {/* Glow blob */}
//                 <div className="absolute -top-12 -right-12 h-28 w-28
//                   rounded-full bg-green-300/30 blur-2xl" />

//                 {/* ================= PRICE HERO (50%) ================= */}
//                 <div className="h-1/2 flex flex-col items-center justify-center relative">
//                   <div className="absolute top-4 right-4 rounded-full
//                     bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow">
//                     {discountPercent}% OFF
//                   </div>

//                   <motion.div
//                     initial={{ scale: 0.95, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     transition={{ type: 'spring', stiffness: 160 }}
//                     className="text-center"
//                   >
//                     <p className="text-4xl font-extrabold text-emerald-700">
//                       ₹{item.Finalprice}
//                     </p>
//                     <p className="text-sm text-gray-400 line-through mt-1">
//                       ₹{item.Price}
//                     </p>
//                   </motion.div>
//                 </div>

//                 {/* ================= DETAILS (50%) ================= */}
//                 <div className="h-1/2 px-6 pb-6 flex flex-col justify-between">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800">
//                       {item.ProductName}
//                     </h3>
//                     <p className="text-sm text-gray-600 mt-1">
//                       {item.Brand} • {item.Type}
//                     </p>
//                   </div>

//                   {/* <motion.button
//                     whileHover={{ scale: 1.08 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="
//                       w-full rounded-xl
//                       bg-white/80 backdrop-blur
//                       px-4 py-2 text-sm font-semibold
//                       text-green-700 shadow
//                       hover:bg-white
//                     "
//                   >
//                     View Store
//                   </motion.button> */}
// <motion.button
//   animate={{ opacity: [1, 0.4, 1] }}
//   transition={{
//     duration: 1.2,
//     repeat: Infinity,
//     ease: "easeInOut",
//   }}
//   whileHover={{ scale: 1.08, opacity: 1 }}
//   whileTap={{ scale: 0.95 }}
//   className="
//     w-full rounded-xl
//     bg-white/80 backdrop-blur
//     px-4 py-2 text-sm font-semibold
//     text-green-700 shadow
//   "
// >
//   View Store
// </motion.button>

//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       </div>

//       {/* ===================== MODAL ===================== */}
//       <UnlockOfferModal
//         product={selectedProduct}
//         couponCode={couponCode}
//         onClose={() => {
//           setSelectedProduct(null);
//           setCouponCode(null);
//         }}
//       />
//     </div>
//   );
// }


'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchBestOfferBillboards } from '@/app/features/billBoard/billBoardSlice';
import { fetchProductOffer } from '@/app/features/products/productSlice';
import UnlockOfferModal from '../products/UnlockOfferModel';
import { userTracking } from '@/app/features/adminPanel/adminPanelSlice';
import { selectIsAuthenticated } from '@/app/features/auth/authSlice';
import LoginPopup from '../LoginPopup';

export default function BillboardBanners() {
  const dispatch = useDispatch();

  const [mounted, setMounted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [couponCode, setCouponCode] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  const {
    bestOfferBillboards,
    bestOfferLoading,
    bestOfferError,
    bestOfferBanner
  } = useSelector((state) => state.billboards);

  /* ------------------ MOUNT CHECK ------------------ */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ------------------ API CALL ------------------ */
  useEffect(() => {
    dispatch(fetchBestOfferBillboards());
  }, [dispatch]);

  /* ------------------ BANNER AUTO SLIDE ------------------ */
  useEffect(() => {
    if (!mounted || !bestOfferBanner?.length) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) =>
        prev === bestOfferBanner.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [mounted, bestOfferBanner]);

    const isAuthenticated = useSelector(selectIsAuthenticated);
  /* ------------------ CLICK HANDLER ------------------ */
const handleUnlockOffer = (product) => {

  if (isAuthenticated) {
    dispatch(userTracking(product?.ProductName));

    dispatch(fetchProductOffer(product.Storeid))
      .unwrap()
      .then((res) => {
        setCouponCode(res?.data?.[0]);
        setSelectedProduct(product);
      })
      .catch((err) => {
        console.error('Offer API failed:', err);
      });

      // setSelectedProduct(product);   // ✅ store product
  } else {
    setShowLogin(true);
  }

};


  /* ------------------ STATES ------------------ */
if (!mounted || bestOfferLoading) {
  return (
    <div style={{ width: '100%', marginTop: 60, padding: 20 }}>
      
      {/* Banner Skeleton */}
      <div
        className="skeleton"
        style={{
          width: '100%',
          height: 380,
          borderRadius: 24,
          marginBottom: 40
        }}
      />

      {/* Cards Skeleton Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20
        }}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              padding: 16,
              borderRadius: 16,
              background: '#fff'
            }}
          >
            <div className="skeleton" style={{ height: 180 }} />
            <div className="skeleton" style={{ height: 20, marginTop: 12 }} />
            <div className="skeleton" style={{ height: 16, marginTop: 8, width: '70%' }} />
            <div className="skeleton" style={{ height: 30, marginTop: 16, width: '40%' }} />
            <div className="skeleton" style={{ height: 40, marginTop: 16 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

  if (bestOfferError) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        color: 'red'
      }}>
        {bestOfferError}
      </div>
    );
  }

  /* ------------------ SORT BY DISCOUNT % ------------------ */
  const sorted = [...(bestOfferBillboards || [])].sort((a, b) => {
    const discountA =
      a.Price && a.Finalprice ? ((a.Price - a.Finalprice) / a.Price) * 100 : 0;
    const discountB =
      b.Price && b.Finalprice ? ((b.Price - b.Finalprice) / b.Price) * 100 : 0;

    return discountB - discountA;
  });

  return (
    <div style={{ width: '100%', background: '#fff', marginTop: 60 }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: 20
      }}>

        {/* ===================== BANNER CAROUSEL ===================== */}
        {bestOfferBanner?.length > 0 && (
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 24,
            marginBottom: 40
          }}>
            <div
              style={{
                display: 'flex',
                transform: `translateX(-${currentBanner * 100}%)`,
                transition: 'transform 0.7s ease-in-out'
              }}
            >
              {bestOfferBanner.map((banner, index) => (
                <div key={index} style={{ minWidth: '100%', height: 380 }}>
                  <img
                    src={banner.Imageurl}
                    alt="Best Offer Banner"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Dots */}
            <div style={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 8
            }}>
              {bestOfferBanner.map((_, i) => (
                <span
                  key={i}
                  onClick={() => setCurrentBanner(i)}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: currentBanner === i ? '#fff' : 'rgba(255,255,255,0.6)',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ===================== OFFER CARDS ===================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20
        }}>
          {sorted.map((item) => {
            const discountPercent = Math.round(
              ((item.Price - item.Finalprice) / item.Price) * 100
            );

            return (
              <div
                key={item.Productid}
                onClick={() => handleUnlockOffer(item)}
                style={{
                  background: '#c7f4c7',
                  borderRadius: 16,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                  padding: 16,
                  cursor: 'pointer'
                }}
              >
                {/* Image */}
          <div
  style={{
    width: "100%",
    aspectRatio: "1 / 1",   // perfect square
    overflow: "hidden",
    background: "#fff"
  }}
>
  <img
    src={item.Imageurl}
    alt={item.ProductName}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }}
  />
</div>

                {/* Name */}
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginTop: 12,
                   color:'black'
                }}>
                  {item.ProductName}
                </h3>

                {/* Brand */}
                <p style={{
                  fontSize: 14,
                  color: '#666',
                  marginTop: 4
                }}>
                  {item.Brand} • {item.Type}
                </p>

                {/* Rating */}
                {/* <div style={{
                  marginTop: 8,
                  fontSize: 14,
                  color: '#f4b400'
                }}>
                  ★★★★★ <span style={{ color: '#777' }}>(97)</span>
                </div> */}

                {/* Price */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 16
                }}>
                  <div>
                    <div style={{display:"flex"}}>
 <div style={{
                      textDecoration: 'line-through',
                      color: '#999',
                      fontSize: 18
                    }}>
                      ₹{item.Price}
                    </div>
                      <div style={{
                      color: 'green',
                      fontSize: 18,
                      fontWeight: 600,
                      marginLeft:"0.5rem"
                    }}>
                      -{discountPercent}%
                    </div>
                    </div>
                   
                    <div style={{
                      fontSize: 30,
                      fontWeight: 700,
                       color:'black'
                    }}>
                      ₹{item.Finalprice}
                    </div>
                  
                  </div>

                  {/* <div style={{
                    width: 44,
                    height: 44,
                    background: '#2563eb',
                    color: '#fff',
                    borderRadius: 12,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 18
                  }}>
                    🛒
                  </div> */}
                </div>

                {/* CTA */}
                <button
                  style={{
                    width: '100%',
                    marginTop: 16,
                    padding: '10px 0',
                    borderRadius: 12,
                    border: 'none',
                    background: '#f1f5f9',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    color:'black'
                  }}
                >
                  View Store
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================== MODAL ===================== */}
      <UnlockOfferModal
        product={selectedProduct}
        couponCode={couponCode}
        onClose={() => {
          setSelectedProduct(null);
          setCouponCode(null);
        }}
      />


    {showLogin && (
  <LoginPopup
    close={() => setShowLogin(false)}
    onLoginSuccess={() => {
      setShowLogin(false);

      if (selectedProduct) {
        dispatch(userTracking(selectedProduct?.ProductName));

        dispatch(fetchProductOffer(selectedProduct.Storeid))
          .unwrap()
          .then((res) => {
            setCouponCode(res?.data?.[0]);
          })
          .catch((err) => {
            console.error('Offer API failed:', err);
          });
      }
    }}
  />
)}

    </div>
  );
}

