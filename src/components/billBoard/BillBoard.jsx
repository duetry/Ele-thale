

// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import { fetchBestOfferBillboards } from "@/app/features/billBoard/billBoardSlice";
// import { fetchProductOffer } from "@/app/features/products/productSlice";
// import UnlockOfferModal from "../products/UnlockOfferModel";
// import {
//   setSelectedLocation,
//   userTracking,
// } from "@/app/features/adminPanel/adminPanelSlice";
// import { selectIsAuthenticated } from "@/app/features/auth/authSlice";
// import LoginPopup from "../LoginPopup";

// export default function BillboardBanners() {
//   const dispatch = useDispatch();

//   const [mounted, setMounted] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [couponCode, setCouponCode] = useState(null);
//   const [currentBanner, setCurrentBanner] = useState(0);
//   const [showLogin, setShowLogin] = useState(false);
//   const [isBannerPaused, setIsBannerPaused] = useState(false);

//   const {
//     bestOfferBillboards,
//     bestOfferLoading,
//     bestOfferError,
//     bestOfferBanner,
//   } = useSelector((state) => state.billboards);

//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const selectedLocation = useSelector(setSelectedLocation);

//   const locationData = useSelector((state) => state?.products?.productOffer);

//   // Derived store info from locationData
//   const storeName = locationData?.Storename || "";
//   const storeAddress = locationData?.Storeaddress || "";
//   const storeTime = locationData?.StoreTime || "";
//   const storePhone = locationData?.Phoneno || "";
//   const storeEmail = locationData?.Email || "";
//   const storeImage = locationData?.Imageurl || locationData?.ImageUrl || "";
//   const storeRating = locationData?.Rating || "";
//   const isStoreActive = locationData?.Isactive === "true";
//   const isStoreDeleted = locationData?.Deleted === "true";

//   /* ------------------ MOUNT CHECK ------------------ */
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   /* ------------------ FETCH WHEN LOCATION CHANGES ------------------ */
//   useEffect(() => {
//     if (!selectedLocation?.LocationId) return;
//     dispatch(
//       fetchBestOfferBillboards({
//         LocationId: String(selectedLocation.LocationId),
//       }),
//     );
//   }, [selectedLocation, dispatch]);

//   /* ------------------ BANNER AUTO SLIDE ------------------ */
//   useEffect(() => {
//     if (!mounted || !bestOfferBanner?.length || isBannerPaused) return;

//     const interval = setInterval(() => {
//       setCurrentBanner((prev) =>
//         prev === bestOfferBanner.length - 1 ? 0 : prev + 1,
//       );
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [mounted, bestOfferBanner, isBannerPaused]);

//   /* ------------------ CLICK HANDLER ------------------ */
//   const handleUnlockOffer = (product) => {
//     if (!product?.Storeid) {
//       console.warn("Storeid missing for product:", product);
//       return;
//     }

//     if (isAuthenticated) {
//       dispatch(userTracking(product?.ProductName));

//       dispatch(fetchProductOffer(product.Storeid))
//         .unwrap()
//         .then((res) => {
//           setCouponCode(res?.data?.[0]);
//           setSelectedProduct(product);
//         })
//         .catch((err) => {
//           console.error("Offer API failed:", err);
//         });
//     } else {
//       setShowLogin(true);
//     }
//   };

//   /* ------------------ STATES ------------------ */
//   if (!mounted || bestOfferLoading) {
//     return (
//       <div style={{ width: "100%", marginTop: 60, padding: 20 }}>
//         <div
//           className="skeleton"
//           style={{
//             width: "100%",
//             height: 380,
//             borderRadius: 24,
//             marginBottom: 40,
//           }}
//         />
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//             gap: 20,
//           }}
//         >
//           {[...Array(8)].map((_, i) => (
//             <div
//               key={i}
//               style={{ padding: 16, borderRadius: 16, background: "#fff" }}
//             >
//               <div className="skeleton" style={{ height: 180 }} />
//               <div className="skeleton" style={{ height: 20, marginTop: 12 }} />
//               <div
//                 className="skeleton"
//                 style={{ height: 16, marginTop: 8, width: "70%" }}
//               />
//               <div
//                 className="skeleton"
//                 style={{ height: 30, marginTop: 16, width: "40%" }}
//               />
//               <div className="skeleton" style={{ height: 40, marginTop: 16 }} />
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (bestOfferError) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "100vh",
//           color: "red",
//         }}
//       >
//         {bestOfferError}
//       </div>
//     );
//   }

//   const sorted = bestOfferBillboards || [];

//   return (
//     <div style={{ width: "100%", background: "#fff", marginTop: 60 }}>
//       <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>
//         {/* ===================== STORE INFO BANNER ===================== */}  

//         {/* ===================== BANNER CAROUSEL ===================== */}
//         {bestOfferBanner?.length > 0 && (
//           <div
//             style={{
//               position: "relative",
//               overflow: "hidden",
//               borderRadius: 24,
//               marginBottom: 40,
//               cursor: "pointer",
//             }}
//             onMouseEnter={() => setIsBannerPaused(true)}
//             onMouseLeave={() => setIsBannerPaused(false)}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 transform: `translateX(-${currentBanner * 100}%)`,
//                 transition: "transform 0.7s ease-in-out",
//               }}
//             >
//               {bestOfferBanner.map((banner, index) => {
//                 const bannerProduct = {
//                   Productid: banner.Productid || banner.id || `banner-${index}`,
//                   ProductName:
//                     banner.ProductName || banner.title || "Special Offer",
//                   Storeid:
//                     banner.Storeid || banner.storeId || locationData?.Storeid,
//                   Imageurl: banner.Imageurl || banner.image,
//                   Price: banner.Price,
//                   Finalprice: banner.Finalprice,
//                   Brand: banner.Brand,
//                   Type: banner.Type,
//                   OfferStartTime: banner.OfferStartTime,
//                   OfferEndTime: banner.OfferEndTime,
//                 };

//                 return (
//                   <div
//                     key={index}
//                     style={{
//                       minWidth: "100%",
//                       height: 380,
//                       position: "relative",
//                     }}
//                     onClick={() => handleUnlockOffer(bannerProduct)}
//                   >
//                     <img
//                       src={banner.Imageurl || banner.image}
//                       alt={
//                         banner.ProductName ||
//                         banner.title ||
//                         "Best Offer Banner"
//                       }
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                         pointerEvents: "none",
//                         transition: "transform 0.3s ease",
//                       }}
//                     />
//                     <div
//                       style={{
//                         position: "absolute",
//                         inset: 0,
//                         background: "rgba(0,0,0,0)",
//                         transition: "background 0.3s ease",
//                         display: "flex",
//                         alignItems: "flex-end",
//                         justifyContent: "center",
//                         paddingBottom: 24,
//                       }}
//                       onMouseEnter={(e) =>
//                         (e.currentTarget.style.background = "rgba(0,0,0,0.15)")
//                       }
//                       onMouseLeave={(e) =>
//                         (e.currentTarget.style.background = "rgba(0,0,0,0)")
//                       }
//                     >
//                       <span
//                         style={{
//                           background: "rgba(0,0,0,0.75)",
//                           color: "#fff",
//                           padding: "8px 20px",
//                           borderRadius: 24,
//                           fontSize: 13,
//                           fontWeight: 600,
//                           opacity: 0,
//                           transform: "translateY(8px)",
//                           transition: "all 0.2s ease",
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.opacity = "1";
//                           e.currentTarget.style.transform = "translateY(0)";
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.opacity = "0";
//                           e.currentTarget.style.transform = "translateY(8px)";
//                         }}
//                       >
//                         🔓 Tap to Unlock Offer
//                       </span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Navigation Dots */}
//             <div
//               style={{
//                 position: "absolute",
//                 bottom: 16,
//                 left: "50%",
//                 transform: "translateX(-50%)",
//                 display: "flex",
//                 gap: 8,
//                 zIndex: 10,
//               }}
//             >
//               {bestOfferBanner.map((_, i) => (
//                 <span
//                   key={i}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setCurrentBanner(i);
//                   }}
//                   style={{
//                     width: 10,
//                     height: 10,
//                     borderRadius: "50%",
//                     cursor: "pointer",
//                     background:
//                       currentBanner === i ? "#fff" : "rgba(255,255,255,0.6)",
//                     border: "2px solid rgba(255,255,255,0.8)",
//                     transition: "all 0.2s ease",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentBanner !== i) {
//                       e.currentTarget.style.background =
//                         "rgba(255,255,255,0.9)";
//                       e.currentTarget.style.transform = "scale(1.15)";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentBanner !== i) {
//                       e.currentTarget.style.background =
//                         "rgba(255,255,255,0.6)";
//                       e.currentTarget.style.transform = "scale(1)";
//                     }
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ===================== EMPTY STATE ===================== */}
//         {sorted.length === 0 && (
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               padding: "80px 24px",
//               background:
//                 "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 60%, #f0fdf4 100%)",
//               borderRadius: 24,
//               border: "1.5px dashed #86efac",
//               textAlign: "center",
//               minHeight: 340,
//             }}
//           >
//             <div
//               style={{
//                 width: 88,
//                 height: 88,
//                 borderRadius: "50%",
//                 background: "linear-gradient(135deg, #bbf7d0, #86efac)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginBottom: 28,
//                 boxShadow: "0 8px 32px rgba(34,197,94,0.18)",
//               }}
//             >
//               <svg
//                 width="42"
//                 height="42"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#16a34a"
//                 strokeWidth="1.7"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
//                 <line x1="7" y1="7" x2="7.01" y2="7" />
//                 <line x1="12" y1="17" x2="17" y2="12" />
//               </svg>
//             </div>
//             <h2
//               style={{
//                 fontSize: 22,
//                 fontWeight: 700,
//                 color: "#14532d",
//                 margin: "0 0 10px",
//                 letterSpacing: "-0.3px",
//               }}
//             >
//               No Special Offers Available
//             </h2>
//             <p
//               style={{
//                 fontSize: 15,
//                 color: "#4b7c5e",
//                 maxWidth: 380,
//                 lineHeight: 1.7,
//                 margin: "0 0 28px",
//               }}
//             >
//               We couldn't find any active deals for your selected location.
//               Switch to a nearby area — great offers might be just around the
//               corner!
//             </p>
//             <div
//               style={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: 8,
//                 background: "#ffffff",
//                 border: "1px solid #bbf7d0",
//                 borderRadius: 999,
//                 padding: "10px 22px",
//                 fontSize: 13,
//                 fontWeight: 600,
//                 color: "#16a34a",
//                 boxShadow: "0 2px 10px rgba(34,197,94,0.10)",
//               }}
//             >
//               <svg
//                 width="15"
//                 height="15"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#16a34a"
//                 strokeWidth="2.2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <line x1="12" y1="8" x2="12" y2="12" />
//                 <line x1="12" y1="16" x2="12.01" y2="16" />
//               </svg>
//               Try selecting a different location
//             </div>
//           </div>
//         )}

//         {/* ===================== OFFER CARDS ===================== */}
//         {sorted.length > 0 && (
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//               gap: 20,
//             }}
//           >
//             {sorted.map((item) => {
//               const now = new Date();
//               const startTime = item.OfferStartTime
//                 ? new Date(item.OfferStartTime)
//                 : null;
//               const endTime = item.OfferEndTime
//                 ? new Date(item.OfferEndTime)
//                 : null;

//               const isExpired = endTime ? now > endTime : false;
//               const isUpcoming = startTime ? now < startTime : false;
//               const isActive = !isExpired && !isUpcoming;

//               const showStartTime = isUpcoming && startTime;
//               const showEndTime = isActive && endTime;

//               const discountPercent = Math.round(
//                 ((item.Price - item.Finalprice) / item.Price) * 100,
//               );

//               const cardBg = isExpired
//                 ? "#fce4ec"
//                 : isUpcoming
//                   ? "#fffbeb"
//                   : "#c7f4c7";
//               const accentColor = isExpired
//                 ? "#9f1239"
//                 : isUpcoming
//                   ? "#d97706"
//                   : "#16a34a";
//               const timeBadgeBg = "#fff0f5";
//               const timeBadgeBorder = "#fbcfe8";
//               const timeBadgeText = "#be185d";

//               // const getTimeRemaining = (date) => {
//               //   const diffMs = date - now;
//               //   if (diffMs <= 0) return null;
//               //   const totalMins = Math.floor(diffMs / 60000);
//               //   const days = Math.floor(totalMins / 1440);
//               //   const hours = Math.floor((totalMins % 1440) / 60);
//               //   const mins = totalMins % 60;
//               //   if (days > 0) return `${days}d ${hours}h left`;
//               //   if (hours > 0) return `${hours}h ${mins}m left`;
//               //   return `${mins}m left`;
//               // };


//               const getTimeRemaining = (date) => {
//   const diffMs = date - now;

//   if (diffMs <= 0) return null;

//   const totalMins = Math.floor(diffMs / 60000);

//   const days = Math.floor(totalMins / 1440);
//   const hours = Math.floor((totalMins % 1440) / 60);
//   const mins = totalMins % 60;

//   if (days > 0) {
//     return `${days} Day${days > 1 ? "s" : ""} Left 🔥`;
//   }

//   if (hours > 0) {
//     return `${hours} Hr${hours > 1 ? "s" : ""} Left ⏳`;
//   }

//   return `${mins} Min${mins > 1 ? "s" : ""} Left ⚡`;
// };

//               const formatDateTime = (date) => {
//                 return date.toLocaleString("en-IN", {
//                   day: "2-digit",
//                   month: "short",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   hour12: true,
//                 });
//               };

//               return (
//                 <div
//                   key={item.Productid}
//                   onClick={() => isActive && handleUnlockOffer(item)}
//                   style={{
//                     background: cardBg,
//                     borderRadius: 16,
//                     boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
//                     // padding: 16,
//                     cursor: !isActive ? "not-allowed" : "pointer",
//                     opacity: !isActive ? 0.82 : 1,
//                     position: "relative",
//                     overflow: "hidden",
//                     display: "flex",
//                     flexDirection: "column",
//                     transition: "transform 0.2s ease, box-shadow 0.2s ease",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (isActive) {
//                       e.currentTarget.style.transform = "translateY(-4px)";
//                       e.currentTarget.style.boxShadow =
//                         "0 12px 28px rgba(0,0,0,0.12)";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = "translateY(0)";
//                     e.currentTarget.style.boxShadow =
//                       "0 8px 20px rgba(0,0,0,0.08)";
//                   }}
//                 >
//                   {/* Expired ribbon */}
//                   {isExpired && (
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: 16,
//                         right: -28,
//                         background: "#9f1239",
//                         color: "#fff",
//                         fontSize: 11,
//                         fontWeight: 700,
//                         padding: "4px 36px",
//                         transform: "rotate(45deg)",
//                         letterSpacing: 1,
//                         zIndex: 2,
//                         boxShadow: "0 2px 6px rgba(159,18,57,0.35)",
//                       }}
//                     >
//                       EXPIRED
//                     </div>
//                   )}

//                   {/* Upcoming ribbon */}
//                   {isUpcoming && (
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: 16,
//                         right: -32,
//                         background: "#d97706",
//                         color: "#fff",
//                         fontSize: 11,
//                         fontWeight: 700,
//                         padding: "4px 40px",
//                         transform: "rotate(45deg)",
//                         letterSpacing: 1,
//                         zIndex: 2,
//                         boxShadow: "0 2px 6px rgba(217,119,6,0.35)",
//                       }}
//                     >
//                       UPCOMING
//                     </div>
//                   )}

//                   {/* Product image */}
//                   <div
//                     style={{
//                       width: "100%",
//                       aspectRatio: "1 / 1",
//                       overflow: "hidden",
//                       background: "#fff",
//                       borderRadius: 10,
//                       flexShrink: 0,
//                     }}
//                   >
//                     <img
//                       src={item.Imageurl}
//                       alt={item.ProductName}
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                         filter: !isActive ? "grayscale(40%)" : "none",
//                         transition: "transform 0.3s ease",
//                       }}
//                       onMouseEnter={(e) => {
//                         if (isActive)
//                           e.currentTarget.style.transform = "scale(1.05)";
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.transform = "scale(1)";
//                       }}
//                     />
//                   </div>

//                   {/* <h3
//                     style={{
//                       fontSize: 16,
//                       fontWeight: 600,
//                       marginTop: 12,
//                       color: "black",
//                       margin: "12px 0 0",
//                     }}
//                   >
//                     {item.ProductName}
//                   </h3>

//                   <p
//                     style={{
//                       fontSize: 14,
//                       color: "#666",
//                       marginTop: 4,
//                       marginBottom: 0,
//                     }}
//                   >
//                     {item.Brand} • {item.Type}
//                   </p>

//                   {storeName && (
//                     <p
//                       style={{
//                         fontSize: 12,
//                         color: "#16a34a",
//                         marginTop: 2,
//                         fontWeight: 600,
//                         marginBottom: 0,
//                       }}
//                     >
//                       🏪 {storeName}
//                     </p>
//                   )} */}

//                   {/* Time badge */}
//                   <div style={{ marginTop: 12, minHeight: 38 }}>
//                     {(showStartTime || showEndTime || isExpired) && (
//                       <div
//                         style={{
//                           padding: "8px 10px",
//                           background: timeBadgeBg,
//                           border: `1px solid ${timeBadgeBorder}`,
//                           borderRadius: 10,
//                           display: "flex",
//                           flexDirection: "column",
//                           gap: 5,
//                         }}
//                       >
//                         {showStartTime && (
//                           <div
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 6,
//                             }}
//                           >
//                             <svg
//                               width="12"
//                               height="12"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               stroke={timeBadgeText}
//                               strokeWidth="2.2"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             >
//                               <circle cx="12" cy="12" r="10" />
//                               <polyline points="12 6 12 12 16 14" />
//                             </svg>
//                             <span
//                               style={{
//                                 fontSize: 11,
//                                 color: timeBadgeText,
//                                 fontWeight: 500,
//                               }}
//                             >
//                               <span style={{ fontWeight: 700 }}>Time’s Running Out — Shop Now</span>{" "}
//                               {/* {formatDateTime(startTime)} */}
//                             </span>
//                           </div>
//                         )}

//                         {showEndTime && (
//                           <div
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "space-between",
//                             }}
//                           >
//                             <div
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 6,
//                               }}
//                             >
//                               <svg
//                                 width="12"
//                                 height="12"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke={timeBadgeText}
//                                 strokeWidth="2.2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               >
//                                 <circle cx="12" cy="12" r="10" />
//                                 <polyline points="12 6 12 12 16 14" />
//                               </svg>
//                               <span
//                                 style={{
//                                   fontSize: 11,
//                                   color: timeBadgeText,
//                                   fontWeight: 500,
//                                 }}
//                               >
//                                 <span style={{ fontWeight: 700 }}>Time's Running Out — Shop Now</span>{" "}
//                                 {/* {formatDateTime(endTime)} */}
//                               </span>
//                             </div>
//                             {getTimeRemaining(endTime) && (
//                               <span
//                                 style={{
//                                   fontSize: 10,
//                                   fontWeight: 700,
//                                   color: "#fff",
//                                   background: "#e91e8c",
//                                   borderRadius: 999,
//                                   padding: "2px 8px",
//                                   whiteSpace: "nowrap",
//                                 }}
//                               >
//                                 {getTimeRemaining(endTime)}
//                               </span>
//                             )}
//                           </div>
//                         )}

//                         {isExpired && (
//                           <div
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 6,
//                             }}
//                           >
//                             <svg
//                               width="12"
//                               height="12"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               stroke="#be185d"
//                               strokeWidth="2.2"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             >
//                               <circle cx="12" cy="12" r="10" />
//                               <line x1="15" y1="9" x2="9" y2="15" />
//                               <line x1="9" y1="9" x2="15" y2="15" />
//                             </svg>
//                             <span
//                               style={{
//                                 fontSize: 11,
//                                 color: "#be185d",
//                                 fontWeight: 700,
//                               }}
//                             >
//                               This offer has ended
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   <div style={{ flex: 1 }} />
//                   {/* <div style={{ marginTop: 14 }}>
//                     <div
//                       style={{ display: "flex", alignItems: "center", gap: 6 }}
//                     >
//                       <div
//                         style={{
//                           textDecoration: "line-through",
//                           color: "#999",
//                           fontSize: 16,
//                         }}
//                       >
//                         ₹{item.Price}
//                       </div>
//                       <div
//                         style={{
//                           color: accentColor,
//                           fontSize: 15,
//                           fontWeight: 700,
//                         }}
//                       >
//                         -{discountPercent}%
//                       </div>
//                     </div>
//                     <div
//                       style={{
//                         fontSize: 28,
//                         fontWeight: 700,
//                         color: isExpired ? "#9f1239" : "black",
//                       }}
//                     >
//                       ₹{item.Finalprice}
//                     </div>
//                   </div> */}

//                  {!isExpired &&  <button
//                     disabled={!isActive}
//                     style={{
//                       width: "100%",
//                       marginTop: 14,
//                       padding: "10px 0",
//                       borderRadius: 12,
//                       border: "none",
//                       background: !isActive ? "#fce7f3" : "#fff0f5",
//                       fontSize: 14,
//                       fontWeight: 600,
//                       cursor: !isActive ? "not-allowed" : "pointer",
//                       color: !isActive ? "#9f1239" : "#be185d",
//                       transition: "all 0.2s ease",
//                     }}
//                     onMouseEnter={(e) => {
//                       if (isActive) {
//                         e.currentTarget.style.background = "#fce7f3";
//                         e.currentTarget.style.transform = "scale(1.02)";
//                       }
//                     }}
//                     onMouseLeave={(e) => {
//                       if (isActive) {
//                         e.currentTarget.style.background = "#fff0f5";
//                         e.currentTarget.style.transform = "scale(1)";
//                       }
//                     }}
//                   >
//                     {isExpired
//                       ? "Offer Expired"
//                       : isUpcoming
//                         ? "Coming Soon"
//                         : "View Store"}
//                   </button>}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       <UnlockOfferModal
//         product={selectedProduct}
//         couponCode={couponCode}
//         onClose={() => {
//           setSelectedProduct(null);
//           setCouponCode(null);
//         }}
//       />

//       {showLogin && (
//         <LoginPopup
//           close={() => setShowLogin(false)}
//           onLoginSuccess={() => {
//             setShowLogin(false);
//             if (selectedProduct) {
//               dispatch(userTracking(selectedProduct?.ProductName));
//               dispatch(fetchProductOffer(selectedProduct.Storeid))
//                 .unwrap()
//                 .then((res) => {
//                   setCouponCode(res?.data?.[0]);
//                 })
//                 .catch((err) => {
//                   console.error("Offer API failed:", err);
//                 });
//             }
//           }}
//         />
//       )}
//     </div>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchBestOfferBillboards } from "@/app/features/billBoard/billBoardSlice";
import { fetchProductOffer } from "@/app/features/products/productSlice";
import UnlockOfferModal from "../products/UnlockOfferModel";
import {
  setSelectedLocation,
  userTracking,
} from "@/app/features/adminPanel/adminPanelSlice";
import { selectIsAuthenticated } from "@/app/features/auth/authSlice";
import LoginPopup from "../LoginPopup";

export default function BillboardBanners() {
  const dispatch = useDispatch();

  const [mounted, setMounted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [couponCode, setCouponCode] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [isBannerPaused, setIsBannerPaused] = useState(false);

  const {
    bestOfferBillboards,
    bestOfferLoading,
    bestOfferError,
    bestOfferBanner,
  } = useSelector((state) => state.billboards);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const selectedLocation = useSelector(setSelectedLocation);

  const locationData = useSelector((state) => state?.products?.productOffer);

  const storeName = locationData?.Storename || "";
  const storeAddress = locationData?.Storeaddress || "";
  const storeTime = locationData?.StoreTime || "";
  const storePhone = locationData?.Phoneno || "";
  const storeEmail = locationData?.Email || "";
  const storeImage = locationData?.Imageurl || locationData?.ImageUrl || "";
  const storeRating = locationData?.Rating || "";
  const isStoreActive = locationData?.Isactive === "true";
  const isStoreDeleted = locationData?.Deleted === "true";

  /* ------------------ MOUNT CHECK ------------------ */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ------------------ FETCH WHEN LOCATION CHANGES ------------------ */
  useEffect(() => {
    if (!selectedLocation?.LocationId) return;
    dispatch(
      fetchBestOfferBillboards({
        LocationId: String(selectedLocation.LocationId),
      })
    );
  }, [selectedLocation, dispatch]);

  /* ------------------ BANNER AUTO SLIDE ------------------ */
  useEffect(() => {
    if (!mounted || !bestOfferBanner?.length || isBannerPaused) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) =>
        prev === bestOfferBanner.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [mounted, bestOfferBanner, isBannerPaused]);

  /* ------------------ CLICK HANDLER ------------------ */
  const handleUnlockOffer = (product) => {
    if (!product?.Storeid) {
      console.warn("Storeid missing for product:", product);
      return;
    }

    if (isAuthenticated) {
      dispatch(userTracking(product?.ProductName));

      dispatch(fetchProductOffer(product.Storeid))
        .unwrap()
        .then((res) => {
          setCouponCode(res?.data?.[0]);
          setSelectedProduct(product);
        })
        .catch((err) => {
          console.error("Offer API failed:", err);
        });
    } else {
      setShowLogin(true);
    }
  };

  /* ------------------ LOADING / ERROR STATES ------------------ */
  if (!mounted || bestOfferLoading) {
    return (
      <div style={{ width: "100%", marginTop: 60, padding: 20 }}>
        <div
          className="skeleton"
          style={{
            width: "100%",
            height: 380,
            borderRadius: 24,
            marginBottom: 40,
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{ padding: 16, borderRadius: 16, background: "#fff" }}
            >
              <div className="skeleton" style={{ height: 180 }} />
              <div className="skeleton" style={{ height: 20, marginTop: 12 }} />
              <div
                className="skeleton"
                style={{ height: 16, marginTop: 8, width: "70%" }}
              />
              <div
                className="skeleton"
                style={{ height: 30, marginTop: 16, width: "40%" }}
              />
              <div className="skeleton" style={{ height: 40, marginTop: 16 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (bestOfferError) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          color: "red",
        }}
      >
        {bestOfferError}
      </div>
    );
  }

  /* ------------------ HELPERS ------------------ */
  const getTimeRemaining = (date) => {
    const now = new Date();
    const diffMs = date - now;
    if (diffMs <= 0) return null;
    const totalMins = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMins / 1440);
    const hours = Math.floor((totalMins % 1440) / 60);
    const mins = totalMins % 60;
    if (days > 0) return `${days} Day${days > 1 ? "s" : ""} Left 🔥`;
    if (hours > 0) return `${hours} Hr${hours > 1 ? "s" : ""} Left ⏳`;
    return `${mins} Min${mins > 1 ? "s" : ""} Left ⚡`;
  };

  const sorted = bestOfferBillboards || [];

  return (
    <div style={{ width: "100%", background: "#fff", marginTop: 60 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>

        {/* ===================== BANNER CAROUSEL ===================== */}
        {bestOfferBanner?.length > 0 && (
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 24,
              marginBottom: 40,
              cursor: "pointer",
            }}
            onMouseEnter={() => setIsBannerPaused(true)}
            onMouseLeave={() => setIsBannerPaused(false)}
          >
            <div
              style={{
                display: "flex",
                transform: `translateX(-${currentBanner * 100}%)`,
                transition: "transform 0.7s ease-in-out",
              }}
            >
              {bestOfferBanner.map((banner, index) => {
                const bannerProduct = {
                  Productid: banner.Productid || banner.id || `banner-${index}`,
                  ProductName:
                    banner.ProductName || banner.title || "Special Offer",
                  Storeid:
                    banner.Storeid || banner.storeId || locationData?.Storeid,
                  Imageurl: banner.Imageurl || banner.image,
                  Price: banner.Price,
                  Finalprice: banner.Finalprice,
                  Brand: banner.Brand,
                  Type: banner.Type,
                  OfferStartTime: banner.OfferStartTime,
                  OfferEndTime: banner.OfferEndTime,
                };

                return (
                  <div
                    key={index}
                    style={{
                      minWidth: "100%",
                      height: 380,
                      position: "relative",
                    }}
                    onClick={() => handleUnlockOffer(bannerProduct)}
                  >
                    <img
                      src={banner.Imageurl || banner.image}
                      alt={
                        banner.ProductName ||
                        banner.title ||
                        "Best Offer Banner"
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        pointerEvents: "none",
                        transition: "transform 0.3s ease",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0)",
                        transition: "background 0.3s ease",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        paddingBottom: 24,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(0,0,0,0.15)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "rgba(0,0,0,0)")
                      }
                    >
                      <span
                        style={{
                          background: "rgba(0,0,0,0.75)",
                          color: "#fff",
                          padding: "8px 20px",
                          borderRadius: 24,
                          fontSize: 13,
                          fontWeight: 600,
                          opacity: 0,
                          transform: "translateY(8px)",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = "1";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = "0";
                          e.currentTarget.style.transform = "translateY(8px)";
                        }}
                      >
                        🔓 Tap to Unlock Offer
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Dots */}
            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 8,
                zIndex: 10,
              }}
            >
              {bestOfferBanner.map((_, i) => (
                <span
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentBanner(i);
                  }}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    cursor: "pointer",
                    background:
                      currentBanner === i ? "#fff" : "rgba(255,255,255,0.6)",
                    border: "2px solid rgba(255,255,255,0.8)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (currentBanner !== i) {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.9)";
                      e.currentTarget.style.transform = "scale(1.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentBanner !== i) {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.6)";
                      e.currentTarget.style.transform = "scale(1)";
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ===================== EMPTY STATE ===================== */}
        {sorted.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 24px",
              background:
                "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 60%, #f0fdf4 100%)",
              borderRadius: 24,
              border: "1.5px dashed #86efac",
              textAlign: "center",
              minHeight: 340,
            }}
          >
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #bbf7d0, #86efac)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 28,
                boxShadow: "0 8px 32px rgba(34,197,94,0.18)",
              }}
            >
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
                <line x1="12" y1="17" x2="17" y2="12" />
              </svg>
            </div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#14532d",
                margin: "0 0 10px",
                letterSpacing: "-0.3px",
              }}
            >
              No Special Offers Available
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "#4b7c5e",
                maxWidth: 380,
                lineHeight: 1.7,
                margin: "0 0 28px",
              }}
            >
              We couldn't find any active deals for your selected location.
              Switch to a nearby area — great offers might be just around the
              corner!
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#ffffff",
                border: "1px solid #bbf7d0",
                borderRadius: 999,
                padding: "10px 22px",
                fontSize: 13,
                fontWeight: 600,
                color: "#16a34a",
                boxShadow: "0 2px 10px rgba(34,197,94,0.10)",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Try selecting a different location
            </div>
          </div>
        )}

        {/* ===================== OFFER CARDS ===================== */}
        {sorted.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {sorted.map((item) => {
              const now = new Date();
              const startTime = item.OfferStartTime
                ? new Date(item.OfferStartTime)
                : null;
              const endTime = item.OfferEndTime
                ? new Date(item.OfferEndTime)
                : null;

              const isExpired = endTime ? now > endTime : false;
              const isUpcoming = startTime ? now < startTime : false;
              const isActive = !isExpired && !isUpcoming;

              const cardBg = isExpired
                ? "#fce4ec"
                : isUpcoming
                ? "#fffbeb"
                : "#c7f4c7";

              /* ---- status bar config ---- */
              const statusConfig = isExpired
                ? {
                    bg: "linear-gradient(90deg, #fce4ec, #f8bbd0)",
                    color: "#9f1239",
                    icon: "😔",
                    label: "You Missed Out",
                  }
                : isUpcoming
                ? {
                    bg: "linear-gradient(90deg, #fffbeb, #fef3c7)",
                    color: "#92400e",
                    icon: "🔔",
                    label: "Get Ready to Claim",
                  }
                : {
                    bg: "linear-gradient(90deg, #dcfce7, #bbf7d0)",
                    color: "#14532d",
                    icon: "🔥",
                    label: "Don't Miss This",
                  };

              return (
                <div
                  key={item.Productid}
                  onClick={() => isActive && handleUnlockOffer(item)}
                  style={{
                    background: cardBg,
                    borderRadius: 16,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                    cursor: !isActive ? "not-allowed" : "pointer",
                    opacity: !isActive ? 0.82 : 1,
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (isActive) {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 28px rgba(0,0,0,0.12)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(0,0,0,0.08)";
                  }}
                >
                  {/* ===== STATUS BAR (top of card) ===== */}
                  <div
                    style={{
                      width: "100%",
                      padding: "9px 14px",
                      background: statusConfig.bg,
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      borderRadius: "16px 16px 0 0",
                    }}
                  >
                    <span style={{ fontSize: 15, lineHeight: 1 }}>
                      {statusConfig.icon}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: statusConfig.color,
                        letterSpacing: 0.2,
                        flex: 1,
                      }}
                    >
                      {statusConfig.label}
                    </span>


                  </div>

                  {/* ===== PRODUCT IMAGE ===== */}
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1 / 1",
                      overflow: "hidden",
                      background: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={item.Imageurl}
                      alt={item.ProductName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: !isActive ? "grayscale(40%)" : "none",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (isActive)
                          e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />
                  </div>

                  {/* ===== TIME BADGE ===== */}
                  <div style={{ padding: "0 12px", marginTop: 12, minHeight: 38 }}>
                    {(isUpcoming || isActive || isExpired) && (
                      <div
                        style={{
                          padding: "8px 10px",
                          background: "#fff0f5",
                          border: "1px solid #fbcfe8",
                          borderRadius: 10,
                          display: "flex",
                          flexDirection: "column",
                          gap: 5,
                        }}
                      >
                        {/* Upcoming */}
                        {isUpcoming && startTime && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#be185d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span style={{ fontSize: 11, color: "#be185d", fontWeight: 700 }}>
                              Offer Available in
                            </span>
                          </div>
                        )}

                        {/* Active with end time */}
                        {isActive && endTime && (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#be185d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              <span style={{ fontSize: 11, color: "#be185d", fontWeight: 700 }}>
                                Offer Close in
                              </span>
                            </div>
                            {getTimeRemaining(endTime) && (
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  color: "#fff",
                                  background: "#e91e8c",
                                  borderRadius: 999,
                                  padding: "2px 8px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {getTimeRemaining(endTime)}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Expired */}
                        {isExpired && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#be185d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="15" y1="9" x2="9" y2="15" />
                              <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                            <span style={{ fontSize: 11, color: "#be185d", fontWeight: 700 }}>
                              This offer has ended
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1 }} />

                  {/* ===== BUTTON ===== */}
                  {!isExpired && (
                    <button
                      disabled={!isActive}
                      style={{
                        width: "100%",
                        marginTop: 14,
                        padding: "10px 0",
                        borderRadius: 12,
                        border: "none",
                        background: !isActive ? "#fce7f3" : "#fff0f5",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: !isActive ? "not-allowed" : "pointer",
                        color: !isActive ? "#9f1239" : "#be185d",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (isActive) {
                          e.currentTarget.style.background = "#fce7f3";
                          e.currentTarget.style.transform = "scale(1.02)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isActive) {
                          e.currentTarget.style.background = "#fff0f5";
                          e.currentTarget.style.transform = "scale(1)";
                        }
                      }}
                    >
                      {isUpcoming ? "Coming Soon" : "Go to Store"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===================== MODALS ===================== */}
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
                  console.error("Offer API failed:", err);
                });
            }
          }}
        />
      )}
    </div>
  );
}