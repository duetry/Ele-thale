

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
//       })
//     );
//   }, [selectedLocation, dispatch]);

//   /* ------------------ BANNER AUTO SLIDE ------------------ */
//   useEffect(() => {
//     if (!mounted || !bestOfferBanner?.length || isBannerPaused) return;

//     const interval = setInterval(() => {
//       setCurrentBanner((prev) =>
//         prev === bestOfferBanner.length - 1 ? 0 : prev + 1
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

//   /* ------------------ LOADING / ERROR STATES ------------------ */
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

//   /* ------------------ HELPERS ------------------ */
//   const getTimeRemaining = (date) => {
//     const now = new Date();
//     const diffMs = date - now;
//     if (diffMs <= 0) return null;
//     const totalMins = Math.floor(diffMs / 60000);
//     const days = Math.floor(totalMins / 1440);
//     const hours = Math.floor((totalMins % 1440) / 60);
//     const mins = totalMins % 60;
//     if (days > 0) return `${days} Day${days > 1 ? "s" : ""} Left 🔥`;
//     if (hours > 0) return `${hours} Hr${hours > 1 ? "s" : ""} Left ⏳`;
//     return `${mins} Min${mins > 1 ? "s" : ""} Left ⚡`;
//   };

//   const sorted = bestOfferBillboards || [];

//   return (
//     <div style={{ width: "100%", background: "#fff", marginTop: 60 }}>
//       <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>

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

//               const cardBg = isExpired
//                 ? "#fce4ec"
//                 : isUpcoming
//                 ? "#fffbeb"
//                 : "#c7f4c7";

//               /* ---- status bar config ---- */
//               const statusConfig = isExpired
//                 ? {
//                     bg: "linear-gradient(90deg, #fce4ec, #f8bbd0)",
//                     color: "#9f1239",
//                     icon: "😔",
//                     label: "You Missed Out",
//                   }
//                 : isUpcoming
//                 ? {
//                     bg: "linear-gradient(90deg, #fffbeb, #fef3c7)",
//                     color: "#92400e",
//                     icon: "🔔",
//                     label: "Get Ready to Claim",
//                   }
//                 : {
//                     bg: "linear-gradient(90deg, #dcfce7, #bbf7d0)",
//                     color: "#14532d",
//                     icon: "🔥",
//                     label: "Don't Miss This",
//                   };

//               return (
//                 <div
//                   key={item.Productid}
//                   onClick={() => isActive && handleUnlockOffer(item)}
//                   style={{
//                     background: cardBg,
//                     borderRadius: 16,
//                     boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
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
//                   {/* ===== STATUS BAR (top of card) ===== */}
//                   <div
//                     style={{
//                       width: "100%",
//                       padding: "9px 14px",
//                       background: statusConfig.bg,
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 7,
//                       borderRadius: "16px 16px 0 0",
//                     }}
//                   >
//                     <span style={{ fontSize: 15, lineHeight: 1 }}>
//                       {statusConfig.icon}
//                     </span>
//                     <span
//                       style={{
//                         fontSize: 12,
//                         fontWeight: 700,
//                         color: statusConfig.color,
//                         letterSpacing: 0.2,
//                         flex: 1,
//                       }}
//                     >
//                       {statusConfig.label}
//                     </span>


//                   </div>

//                   {/* ===== PRODUCT IMAGE ===== */}
//                   <div
//                     style={{
//                       width: "100%",
//                       aspectRatio: "1 / 1",
//                       overflow: "hidden",
//                       background: "#fff",
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

//                   {/* ===== TIME BADGE ===== */}
//                   <div style={{ padding: "0 12px", marginTop: 12, minHeight: 38 }}>
//                     {(isUpcoming || isActive || isExpired) && (
//                       <div
//                         style={{
//                           padding: "8px 10px",
//                           background: "#fff0f5",
//                           border: "1px solid #fbcfe8",
//                           borderRadius: 10,
//                           display: "flex",
//                           flexDirection: "column",
//                           gap: 5,
//                         }}
//                       >
//                         {/* Upcoming */}
//                         {isUpcoming && startTime && (
//                           <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#be185d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                               <circle cx="12" cy="12" r="10" />
//                               <polyline points="12 6 12 12 16 14" />
//                             </svg>
//                             <span style={{ fontSize: 11, color: "#be185d", fontWeight: 700 }}>
//                               Offer Available in
//                             </span>
//                           </div>
//                         )}

//                         {/* Active with end time */}
//                         {isActive && endTime && (
//                           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                             <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#be185d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                                 <circle cx="12" cy="12" r="10" />
//                                 <polyline points="12 6 12 12 16 14" />
//                               </svg>
//                               <span style={{ fontSize: 11, color: "#be185d", fontWeight: 700 }}>
//                                 Offer Close in
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

//                         {/* Expired */}
//                         {isExpired && (
//                           <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#be185d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                               <circle cx="12" cy="12" r="10" />
//                               <line x1="15" y1="9" x2="9" y2="15" />
//                               <line x1="9" y1="9" x2="15" y2="15" />
//                             </svg>
//                             <span style={{ fontSize: 11, color: "#be185d", fontWeight: 700 }}>
//                               This offer has ended
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   <div style={{ flex: 1 }} />

//                   {/* ===== BUTTON ===== */}
//                   {!isExpired && (
//                     <button
//                       disabled={!isActive}
//                       style={{
//                         width: "100%",
//                         marginTop: 14,
//                         padding: "10px 0",
//                         borderRadius: 12,
//                         border: "none",
//                         background: !isActive ? "#fce7f3" : "#fff0f5",
//                         fontSize: 14,
//                         fontWeight: 600,
//                         cursor: !isActive ? "not-allowed" : "pointer",
//                         color: !isActive ? "#9f1239" : "#be185d",
//                         transition: "all 0.2s ease",
//                       }}
//                       onMouseEnter={(e) => {
//                         if (isActive) {
//                           e.currentTarget.style.background = "#fce7f3";
//                           e.currentTarget.style.transform = "scale(1.02)";
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         if (isActive) {
//                           e.currentTarget.style.background = "#fff0f5";
//                           e.currentTarget.style.transform = "scale(1)";
//                         }
//                       }}
//                     >
//                       {isUpcoming ? "Coming Soon" : "Go to Store"}
//                     </button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* ===================== MODALS ===================== */}
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
// import {
//   postProductReaction,
//   selectReaction,
//   selectReactionLoading,
// } from "@/app/features/adminPanel/reactionSlice";

// /* =========================================================
//    LIKE / DISLIKE BUTTONS COMPONENT
//    ========================================================= */
// function LikeDislikeButtons({ productId, isAuthenticated, onLoginRequired }) {
//   const dispatch = useDispatch();

//   const reaction = useSelector(
//     (state) => state.reactions.reactions?.[productId]
//   );
//   const isLoading = useSelector(
//     (state) => state.reactions.loading?.[productId]
//   );

//   const likeActive = reaction === "like";
//   const dislikeActive = reaction === "dislike";

//   const handleReaction = (e, type) => {
//     e.stopPropagation();

//     if (!isAuthenticated) {
//       onLoginRequired();
//       return;
//     }

//     if (isLoading || reaction === type) return;

//     dispatch(postProductReaction({ Productid: productId, Reaction: type }));
//   };

//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
//       {/* ── Like Button ── */}
//       <button
//         onClick={(e) => handleReaction(e, "like")}
//         disabled={isLoading}
//         title="Like this offer"
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 5,
//           padding: "6px 14px",
//           borderRadius: 20,
//           border: `1.5px solid ${likeActive ? "#16a34a" : "#d1d5db"}`,
//           background: likeActive ? "#f0fdf4" : "#fff",
//           color: likeActive ? "#16a34a" : "#6b7280",
//           fontSize: 13,
//           fontWeight: 600,
//           cursor: isLoading ? "not-allowed" : "pointer",
//           transition: "all 0.2s ease",
//           transform: likeActive ? "scale(1.05)" : "scale(1)",
//           boxShadow: likeActive ? "0 2px 8px rgba(22,163,74,0.18)" : "none",
//           opacity: isLoading ? 0.7 : 1,
//         }}
//         onMouseEnter={(e) => {
//           if (!likeActive && !isLoading) {
//             e.currentTarget.style.borderColor = "#16a34a";
//             e.currentTarget.style.color = "#16a34a";
//             e.currentTarget.style.background = "#f0fdf4";
//           }
//         }}
//         onMouseLeave={(e) => {
//           if (!likeActive) {
//             e.currentTarget.style.borderColor = "#d1d5db";
//             e.currentTarget.style.color = "#6b7280";
//             e.currentTarget.style.background = "#fff";
//           }
//         }}
//       >
//         <svg
//           width="15"
//           height="15"
//           viewBox="0 0 24 24"
//           fill={likeActive ? "#16a34a" : "none"}
//           stroke={likeActive ? "#16a34a" : "currentColor"}
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           style={{ transition: "all 0.2s ease", flexShrink: 0 }}
//         >
//           <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
//           <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
//         </svg>
//         {isLoading && reaction !== "like" ? "..." : likeActive ? "Liked" : "Like"}
//       </button>

//       {/* ── Dislike Button ── */}
//       <button
//         onClick={(e) => handleReaction(e, "dislike")}
//         disabled={isLoading}
//         title="Dislike this offer"
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 5,
//           padding: "6px 14px",
//           borderRadius: 20,
//           border: `1.5px solid ${dislikeActive ? "#be123c" : "#d1d5db"}`,
//           background: dislikeActive ? "#fff1f2" : "#fff",
//           color: dislikeActive ? "#be123c" : "#6b7280",
//           fontSize: 13,
//           fontWeight: 600,
//           cursor: isLoading ? "not-allowed" : "pointer",
//           transition: "all 0.2s ease",
//           transform: dislikeActive ? "scale(1.05)" : "scale(1)",
//           boxShadow: dislikeActive ? "0 2px 8px rgba(190,18,60,0.18)" : "none",
//           opacity: isLoading ? 0.7 : 1,
//         }}
//         onMouseEnter={(e) => {
//           if (!dislikeActive && !isLoading) {
//             e.currentTarget.style.borderColor = "#be123c";
//             e.currentTarget.style.color = "#be123c";
//             e.currentTarget.style.background = "#fff1f2";
//           }
//         }}
//         onMouseLeave={(e) => {
//           if (!dislikeActive) {
//             e.currentTarget.style.borderColor = "#d1d5db";
//             e.currentTarget.style.color = "#6b7280";
//             e.currentTarget.style.background = "#fff";
//           }
//         }}
//       >
//         <svg
//           width="15"
//           height="15"
//           viewBox="0 0 24 24"
//           fill={dislikeActive ? "#be123c" : "none"}
//           stroke={dislikeActive ? "#be123c" : "currentColor"}
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           style={{ transition: "all 0.2s ease", flexShrink: 0 }}
//         >
//           <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
//           <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
//         </svg>
//         {isLoading && reaction !== "dislike"
//           ? "..."
//           : dislikeActive
//           ? "Disliked"
//           : "Dislike"}
//       </button>
//     </div>
//   );
// }

// /* =========================================================
//    MAIN COMPONENT
//    ========================================================= */
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
//       })
//     );
//   }, [selectedLocation, dispatch]);

//   /* ------------------ BANNER AUTO SLIDE ------------------ */
//   useEffect(() => {
//     if (!mounted || !bestOfferBanner?.length || isBannerPaused) return;

//     const interval = setInterval(() => {
//       setCurrentBanner((prev) =>
//         prev === bestOfferBanner.length - 1 ? 0 : prev + 1
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

//   /* ------------------ LOADING / ERROR STATES ------------------ */
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

//   /* ------------------ HELPERS ------------------ */
//   const getTimeRemaining = (date) => {
//     const now = new Date();
//     const diffMs = date - now;
//     if (diffMs <= 0) return null;
//     const totalMins = Math.floor(diffMs / 60000);
//     const days = Math.floor(totalMins / 1440);
//     const hours = Math.floor((totalMins % 1440) / 60);
//     const mins = totalMins % 60;
//     if (days > 0) return `${days} Day${days > 1 ? "s" : ""} Left 🔥`;
//     if (hours > 0) return `${hours} Hr${hours > 1 ? "s" : ""} Left ⏳`;
//     return `${mins} Min${mins > 1 ? "s" : ""} Left ⚡`;
//   };

//   const sorted = bestOfferBillboards || [];

//   return (
//     <div style={{ width: "100%", background: "#fff", marginTop: 60 }}>
//       <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>

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

//               const cardBg = isExpired
//                 ? "#fce4ec"
//                 : isUpcoming
//                 ? "#fffbeb"
//                 : "#c7f4c7";

//               const statusConfig = isExpired
//                 ? {
//                     bg: "linear-gradient(90deg, #fce4ec, #f8bbd0)",
//                     color: "#9f1239",
//                     icon: "😔",
//                     label: "You Missed Out",
//                   }
//                 : isUpcoming
//                 ? {
//                     bg: "linear-gradient(90deg, #fffbeb, #fef3c7)",
//                     color: "#92400e",
//                     icon: "🔔",
//                     label: "Get Ready to Claim",
//                   }
//                 : {
//                     bg: "linear-gradient(90deg, #dcfce7, #bbf7d0)",
//                     color: "#14532d",
//                     icon: "🔥",
//                     label: "Don't Miss This",
//                   };

//               return (
//                 <div
//                   key={item.Productid}
//                   onClick={() => isActive && handleUnlockOffer(item)}
//                   style={{
//                     background: cardBg,
//                     borderRadius: 16,
//                     boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
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
//                   {/* ===== STATUS BAR (top of card) ===== */}
//                   <div
//                     style={{
//                       width: "100%",
//                       padding: "9px 14px",
//                       background: statusConfig.bg,
//                       display: "flex",
//                       justifyContent: "center", 
//                       alignItems: "center",
//                          textTransform: "uppercase",
//                       borderRadius: "16px 16px 0 0",
//                     }}
//                   >
//                     <span style={{ fontSize: 15, lineHeight: 1 }}>
//                       {statusConfig.icon}
//                     </span>
//                     <span
//                       style={{
//                          fontSize: 25,
//                         fontWeight: 700,
//                         color: statusConfig.color,
//                          textAlign:"center",
//                         letterSpacing: 0.2,
//                         flex: 1,
//                       }}
//                     >
//                       {statusConfig.label}
//                     </span>
//                   </div>

//                   {/* ===== PRODUCT IMAGE ===== */}
//                   <div
//                     style={{
//                       width: "100%",
//                       aspectRatio: "1 / 1",
//                       overflow: "hidden",
//                       background: "#fff",
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

//                   {/* ===== TIME BADGE ===== */}
//                   <div style={{ padding: "0 12px", marginTop: 12, minHeight: 38 }}>
//                     {(isUpcoming || isActive || isExpired) && (
//                       <div
//                         style={{
//                           padding: "8px 10px",
//                           background: "#fff0f5",
//                           border: "1px solid #fbcfe8",
//                           borderRadius: 10,
//                           display: "flex",
//                           flexDirection: "column",
//                           gap: 5,
//                         }}
//                       >
//                         {/* Upcoming */}
//                         {isUpcoming && startTime && (
//                           <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#be185d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                               <circle cx="12" cy="12" r="10" />
//                               <polyline points="12 6 12 12 16 14" />
//                             </svg>
//                             <span style={{ fontSize: 11, color: "#be185d", fontWeight: 700 }}>
//                               Offer Available in
//                             </span>
//                           </div>
//                         )}

//                         {/* Active with end time */}
//                         {isActive && endTime && (
//                           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                             <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#be185d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                                 <circle cx="12" cy="12" r="10" />
//                                 <polyline points="12 6 12 12 16 14" />
//                               </svg>
//                               <span style={{ fontSize: 11, color: "#be185d", fontWeight: 700 }}>
//                                 Offer Close in
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

//                         {/* Expired */}
//                         {isExpired && (
//                           <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#be185d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                               <circle cx="12" cy="12" r="10" />
//                               <line x1="15" y1="9" x2="9" y2="15" />
//                               <line x1="9" y1="9" x2="15" y2="15" />
//                             </svg>
//                             <span style={{ fontSize: 11, color: "#be185d", fontWeight: 700 }}>
//                               This offer has ended
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {/* ===== LIKE / DISLIKE BUTTONS ===== */}
//                   <div style={{ padding: "0 12px" }}>
//                     <LikeDislikeButtons
//                       productId={item.Productid}
//                       isAuthenticated={isAuthenticated}
//                       onLoginRequired={() => setShowLogin(true)}
//                     />
//                   </div>

//                   <div style={{ flex: 1 }} />

//                   {/* ===== BUTTON ===== */}
//                   {!isExpired && (
//                     <button
//                       disabled={!isActive}
//                       style={{
//                         width: "100%",
//                         marginTop: 14,
//                         padding: "10px 0",
//                         borderRadius: 12,
//                         border: "none",
//                         background: !isActive ? "#fce7f3" : "#fff0f5",
//                         fontSize: 14,
//                         fontWeight: 600,
//                         cursor: !isActive ? "not-allowed" : "pointer",
//                         color: !isActive ? "#9f1239" : "#be185d",
//                         transition: "all 0.2s ease",
//                       }}
//                       onMouseEnter={(e) => {
//                         if (isActive) {
//                           e.currentTarget.style.background = "#fce7f3";
//                           e.currentTarget.style.transform = "scale(1.02)";
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         if (isActive) {
//                           e.currentTarget.style.background = "#fff0f5";
//                           e.currentTarget.style.transform = "scale(1)";
//                         }
//                       }}
//                     >
//                       {isUpcoming ? "Coming Soon" : "Go to Store"}
//                     </button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* ===================== MODALS ===================== */}
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
// import {
//   postProductReaction,
// } from "@/app/features/adminPanel/reactionSlice";

// /* =========================================================
//    LIKE / DISLIKE BUTTONS COMPONENT
//    ========================================================= */
// function LikeDislikeButtons({ productId, isAuthenticated, onLoginRequired }) {
//   const dispatch = useDispatch();

//   const reaction = useSelector(
//     (state) => state.reactions.reactions?.[productId]
//   );
//   const isLoading = useSelector(
//     (state) => state.reactions.loading?.[productId]
//   );

//   const likeActive = reaction === "like";
//   const dislikeActive = reaction === "dislike";

//   const handleReaction = (e, type) => {
//     e.stopPropagation();

//     if (!isAuthenticated) {
//       onLoginRequired();
//       return;
//     }

//     if (isLoading || reaction === type) return;

//     dispatch(postProductReaction({ Productid: productId, Reaction: type }));
//   };

//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
//       {/* ── Like Button ── */}
//       <button
//         onClick={(e) => handleReaction(e, "like")}
//         disabled={isLoading}
//         title="Like this offer"
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 5,
//           padding: "6px 14px",
//           borderRadius: 20,
//           border: `1.5px solid ${likeActive ? "#16a34a" : "#d1d5db"}`,
//           background: likeActive ? "#f0fdf4" : "#fff",
//           color: likeActive ? "#16a34a" : "#6b7280",
//           fontSize: 13,
//           fontWeight: 600,
//           cursor: isLoading ? "not-allowed" : "pointer",
//           transition: "all 0.2s ease",
//           transform: likeActive ? "scale(1.05)" : "scale(1)",
//           boxShadow: likeActive ? "0 2px 8px rgba(22,163,74,0.18)" : "none",
//           opacity: isLoading ? 0.7 : 1,
//         }}
//         onMouseEnter={(e) => {
//           if (!likeActive && !isLoading) {
//             e.currentTarget.style.borderColor = "#16a34a";
//             e.currentTarget.style.color = "#16a34a";
//             e.currentTarget.style.background = "#f0fdf4";
//           }
//         }}
//         onMouseLeave={(e) => {
//           if (!likeActive) {
//             e.currentTarget.style.borderColor = "#d1d5db";
//             e.currentTarget.style.color = "#6b7280";
//             e.currentTarget.style.background = "#fff";
//           }
//         }}
//       >
//         <svg
//           width="15"
//           height="15"
//           viewBox="0 0 24 24"
//           fill={likeActive ? "#16a34a" : "none"}
//           stroke={likeActive ? "#16a34a" : "currentColor"}
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           style={{ transition: "all 0.2s ease", flexShrink: 0 }}
//         >
//           <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
//           <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
//         </svg>
//         {isLoading && reaction !== "like" ? "..." : likeActive ? "Liked" : "Like"}
//       </button>

//       {/* ── Dislike Button ── */}
//       <button
//         onClick={(e) => handleReaction(e, "dislike")}
//         disabled={isLoading}
//         title="Dislike this offer"
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 5,
//           padding: "6px 14px",
//           borderRadius: 20,
//           border: `1.5px solid ${dislikeActive ? "#be123c" : "#d1d5db"}`,
//           background: dislikeActive ? "#fff1f2" : "#fff",
//           color: dislikeActive ? "#be123c" : "#6b7280",
//           fontSize: 13,
//           fontWeight: 600,
//           cursor: isLoading ? "not-allowed" : "pointer",
//           transition: "all 0.2s ease",
//           transform: dislikeActive ? "scale(1.05)" : "scale(1)",
//           boxShadow: dislikeActive ? "0 2px 8px rgba(190,18,60,0.18)" : "none",
//           opacity: isLoading ? 0.7 : 1,
//         }}
//         onMouseEnter={(e) => {
//           if (!dislikeActive && !isLoading) {
//             e.currentTarget.style.borderColor = "#be123c";
//             e.currentTarget.style.color = "#be123c";
//             e.currentTarget.style.background = "#fff1f2";
//           }
//         }}
//         onMouseLeave={(e) => {
//           if (!dislikeActive) {
//             e.currentTarget.style.borderColor = "#d1d5db";
//             e.currentTarget.style.color = "#6b7280";
//             e.currentTarget.style.background = "#fff";
//           }
//         }}
//       >
//         <svg
//           width="15"
//           height="15"
//           viewBox="0 0 24 24"
//           fill={dislikeActive ? "#be123c" : "none"}
//           stroke={dislikeActive ? "#be123c" : "currentColor"}
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           style={{ transition: "all 0.2s ease", flexShrink: 0 }}
//         >
//           <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
//           <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
//         </svg>
//         {isLoading && reaction !== "dislike"
//           ? "..."
//           : dislikeActive
//           ? "Disliked"
//           : "Dislike"}
//       </button>
//     </div>
//   );
// }

// /* =========================================================
//    SECTION HEADER COMPONENT
//    ========================================================= */
// function SectionHeader({ label, count, accent, bg, border }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: 12,
//         marginBottom: 20,
//         padding: "14px 24px",
//         background: bg,
//         border: `1.5px solid ${border}`,
//         borderRadius: 16,
//       }}
//     >
//       {/* Label */}
//       <span
//         style={{
//           fontSize: 20,
//           fontWeight: 800,
//           color: accent,
//           letterSpacing: "-0.3px",
//         }}
//       >
//         {label}
//       </span>


//     </div>
//   );
// }

// /* =========================================================
//    SINGLE OFFER CARD COMPONENT
//    ========================================================= */
// function OfferCard({ item, isAuthenticated, onUnlockOffer, onLoginRequired, getTimeRemaining }) {
//   const now = new Date();
//   const startTime = item.OfferStartTime ? new Date(item.OfferStartTime) : null;
//   const endTime = item.OfferEndTime ? new Date(item.OfferEndTime) : null;

//   const isExpired = endTime ? now > endTime : false;
//   const isUpcoming = startTime ? now < startTime : false;
//   const isActive = !isExpired && !isUpcoming;

//   const cardBg = isExpired
//     ? "#fce4ec"
//     : isUpcoming
//     ? "#fffbeb"
//     : "#c7f4c7";

//   const statusConfig = isExpired
//     ? {
//         bg: "linear-gradient(90deg, #fce4ec, #f8bbd0)",
//         color: "#9f1239",
//         icon: "",
//         label: "You Missed Out",
//       }
//     : isUpcoming
//     ? {
//         bg: "linear-gradient(90deg, #fffbeb, #fef3c7)",
//         color: "#92400e",
//         icon: "",
//         label: "Get Ready to Claim",
//       }
//     : {
//         bg: "linear-gradient(90deg, #dcfce7, #bbf7d0)",
//         color: "#14532d",
//         icon: "",
//         label: "Don't Miss This",
//       };

//   return (
//     <div
//       key={item.Productid}
//       onClick={() => isActive && onUnlockOffer(item)}
//       style={{
//         background: cardBg,
//         borderRadius: 16,
//         boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
//         cursor: !isActive ? "not-allowed" : "pointer",
//         opacity: !isActive ? 0.82 : 1,
//         position: "relative",
//         overflow: "hidden",
//         display: "flex",
//         flexDirection: "column",
//         transition: "transform 0.2s ease, box-shadow 0.2s ease",
//       }}
//       onMouseEnter={(e) => {
//         if (isActive) {
//           e.currentTarget.style.transform = "translateY(-4px)";
//           e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)";
//         }
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.transform = "translateY(0)";
//         e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
//       }}
//     >
    

//       {/* ===== PRODUCT IMAGE ===== */}
//       <div
//         style={{
//           width: "100%",
//           aspectRatio: "1 / 1",
//           overflow: "hidden",
//           background: "#fff",
//           flexShrink: 0,
//         }}
//       >
//         <img
//           src={item.Imageurl}
//           alt={item.ProductName}
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             filter: !isActive ? "grayscale(40%)" : "none",
//             transition: "transform 0.3s ease",
//           }}
//           onMouseEnter={(e) => {
//             if (isActive) e.currentTarget.style.transform = "scale(1.05)";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = "scale(1)";
//           }}
//         />
//       </div>

//       {/* ===== TIME BADGE ===== */}
//       <div style={{ padding: "0 12px", marginTop: 12, minHeight: 38 }}>
//         {(isUpcoming || isActive || isExpired) && (
//           <div
//             style={{
//               padding: "8px 10px",
//               background: "#fff0f5",
//               border: "1px solid #fbcfe8",
//               borderRadius: 10,
//               display: "flex",
//               flexDirection: "column",
//               gap: 5,
//             }}
//           >
//             {/* Upcoming */}
//             {isUpcoming && startTime && (
//               <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#be185d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                   <circle cx="12" cy="12" r="10" />
//                   <polyline points="12 6 12 12 16 14" />
//                 </svg>
//                 <span style={{ fontSize: 11, color: "#be185d", fontWeight: 700 }}>
//                   Offer Available in
//                 </span>
//               </div>
//             )}

//             {/* Active with end time */}
//             {isActive && endTime && (
//               <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#be185d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                     <circle cx="12" cy="12" r="10" />
//                     <polyline points="12 6 12 12 16 14" />
//                   </svg>
//                   <span style={{ fontSize: 11, color: "#be185d", fontWeight: 700 }}>
//                     Offer Close in
//                   </span>
//                 </div>
//                 {getTimeRemaining(endTime) && (
//                   <span
//                     style={{
//                       fontSize: 10,
//                       fontWeight: 700,
//                       color: "#fff",
//                       background: "#e91e8c",
//                       borderRadius: 999,
//                       padding: "2px 8px",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {getTimeRemaining(endTime)}
//                   </span>
//                 )}
//               </div>
//             )}

//             {/* Expired */}
//             {isExpired && (
//               <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#be185d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                   <circle cx="12" cy="12" r="10" />
//                   <line x1="15" y1="9" x2="9" y2="15" />
//                   <line x1="9" y1="9" x2="15" y2="15" />
//                 </svg>
//                 <span style={{ fontSize: 11, color: "#be185d", fontWeight: 700 }}>
//                   This offer has ended
//                 </span>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ===== LIKE / DISLIKE BUTTONS ===== */}
//       <div style={{ padding: "0 12px" }}>
//         <LikeDislikeButtons
//           productId={item.Productid}
//           isAuthenticated={isAuthenticated}
//           onLoginRequired={onLoginRequired}
//         />
//       </div>

//       <div style={{ flex: 1 }} />

//       {/* ===== BUTTON ===== */}
//       {!isExpired && (
//         <button
//           disabled={!isActive}
//           style={{
//             width: "100%",
//             marginTop: 14,
//             padding: "10px 0",
//             borderRadius: 12,
//             border: "none",
//             background: !isActive ? "#fce7f3" : "#fff0f5",
//             fontSize: 14,
//             fontWeight: 600,
//             cursor: !isActive ? "not-allowed" : "pointer",
//             color: !isActive ? "#9f1239" : "#be185d",
//             transition: "all 0.2s ease",
//           }}
//           onMouseEnter={(e) => {
//             if (isActive) {
//               e.currentTarget.style.background = "#fce7f3";
//               e.currentTarget.style.transform = "scale(1.02)";
//             }
//           }}
//           onMouseLeave={(e) => {
//             if (isActive) {
//               e.currentTarget.style.background = "#fff0f5";
//               e.currentTarget.style.transform = "scale(1)";
//             }
//           }}
//         >
//           {isUpcoming ? "" : "Go to Store"}
//         </button>
//       )}
//     </div>
//   );
// }

// /* =========================================================
//    MAIN COMPONENT
//    ========================================================= */
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
//     bestOfferLive,
//     bestOfferUpcoming,
//     bestOfferExpired,
//   } = useSelector((state) => state.billboards);

//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const selectedLocation = useSelector(setSelectedLocation);
//   const locationData = useSelector((state) => state?.products?.productOffer);

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
//       })
//     );
//   }, [selectedLocation, dispatch]);

//   /* ------------------ BANNER AUTO SLIDE ------------------ */
//   useEffect(() => {
//     if (!mounted || !bestOfferBanner?.length || isBannerPaused) return;

//     const interval = setInterval(() => {
//       setCurrentBanner((prev) =>
//         prev === bestOfferBanner.length - 1 ? 0 : prev + 1
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

//   /* ------------------ HELPERS ------------------ */
//   const getTimeRemaining = (date) => {
//     const now = new Date();
//     const diffMs = date - now;
//     if (diffMs <= 0) return null;
//     const totalMins = Math.floor(diffMs / 60000);
//     const days = Math.floor(totalMins / 1440);
//     const hours = Math.floor((totalMins % 1440) / 60);
//     const mins = totalMins % 60;
//     if (days > 0) return `${days} Day${days > 1 ? "s" : ""} Left 🔥`;
//     if (hours > 0) return `${hours} Hr${hours > 1 ? "s" : ""} Left ⏳`;
//     return `${mins} Min${mins > 1 ? "s" : ""} Left ⚡`;
//   };

//   // Determine if we have the new sectioned shape or old flat array
//   const hasNewShape =
//     bestOfferLive?.length > 0 ||
//     bestOfferUpcoming?.length > 0 ||
//     bestOfferExpired?.length > 0;

//   const sections = hasNewShape
//     ? [
//         {
//           key: "live",
//           items: bestOfferLive,
//           label: "Live Offers",
//           accent: "#16a34a",
//           bg: "#f0fdf4",
//           border: "#86efac",
//         },
//         {
//           key: "upcoming",
//           items: bestOfferUpcoming,
//           label: "Coming Soon",
//           accent: "#92400e",
//           bg: "#fffbeb",
//           border: "#fcd34d",
//         },
//         {
//           key: "expired",
//           items: bestOfferExpired,
//           label: "Expired Offers",
//           accent: "#9f1239",
//           bg: "#fff1f2",
//           border: "#fecdd3",
//         },
//       ].filter((s) => s.items.length > 0)
//     : null; // null = use flat bestOfferBillboards

//   const totalItems = hasNewShape
//     ? (bestOfferLive?.length || 0) +
//       (bestOfferUpcoming?.length || 0) +
//       (bestOfferExpired?.length || 0)
//     : bestOfferBillboards?.length || 0;

//   /* ------------------ LOADING / ERROR STATES ------------------ */
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

//   /* ------------------ CARD GRID RENDERER ------------------ */
//   const renderCardGrid = (items) => (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//         gap: 20,
//       }}
//     >
//       {items.map((item) => (
//         <OfferCard
//           key={item.Productid}
//           item={item}
//           isAuthenticated={isAuthenticated}
//           onUnlockOffer={handleUnlockOffer}
//           onLoginRequired={() => setShowLogin(true)}
//           getTimeRemaining={getTimeRemaining}
//         />
//       ))}
//     </div>
//   );

//   return (
//     <div style={{ width: "100%", background: "#fff", marginTop: 60 }}>
//       <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>

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
//                   ProductName: banner.ProductName || banner.title || "Special Offer",
//                   Storeid: banner.Storeid || banner.storeId || locationData?.Storeid,
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
//                       alt={banner.ProductName || banner.title || "Best Offer Banner"}
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
//                     background: currentBanner === i ? "#fff" : "rgba(255,255,255,0.6)",
//                     border: "2px solid rgba(255,255,255,0.8)",
//                     transition: "all 0.2s ease",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentBanner !== i) {
//                       e.currentTarget.style.background = "rgba(255,255,255,0.9)";
//                       e.currentTarget.style.transform = "scale(1.15)";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentBanner !== i) {
//                       e.currentTarget.style.background = "rgba(255,255,255,0.6)";
//                       e.currentTarget.style.transform = "scale(1)";
//                     }
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ===================== EMPTY STATE ===================== */}
//         {totalItems === 0 && (
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

//         {/* ===================== OFFER CARDS — SECTIONED (new shape) ===================== */}
//         {totalItems > 0 && hasNewShape && sections.map(({ key, items, label, accent, bg, border }) => (
//           <div key={key} style={{ marginBottom: 48 }}>
//             <SectionHeader
//               label={label}
//               count={items.length}
//               accent={accent}
//               bg={bg}
//               border={border}
//             />
//             {renderCardGrid(items)}
//           </div>
//         ))}

//         {/* ===================== OFFER CARDS — FLAT (old shape fallback) ===================== */}
//         {totalItems > 0 && !hasNewShape && renderCardGrid(bestOfferBillboards)}

//       </div>

//       {/* ===================== MODALS ===================== */}
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
// import {
//   postProductReaction,
// } from "@/app/features/adminPanel/reactionSlice";

// /* =========================================================
//    LIKE / DISLIKE BUTTONS COMPONENT
//    ========================================================= */
// function LikeDislikeButtons({ productId, isAuthenticated, onLoginRequired }) {
//   const dispatch = useDispatch();

//   const reaction = useSelector(
//     (state) => state.reactions.reactions?.[productId]
//   );
//   const isLoading = useSelector(
//     (state) => state.reactions.loading?.[productId]
//   );

//   const likeActive = reaction === "like";
//   const dislikeActive = reaction === "dislike";

//   const handleReaction = (e, type) => {
//     e.stopPropagation();

//     if (!isAuthenticated) {
//       onLoginRequired();
//       return;
//     }

//     if (isLoading || reaction === type) return;

//     dispatch(postProductReaction({ Productid: productId, Reaction: type }));
//   };

//   const btnStyle = (active, activeColor, activeBg) => ({
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 5,
//     padding: "6px 14px",
//     borderRadius: 20,
//     border: `1.5px solid ${active ? activeColor : "#d1d5db"}`,
//     background: active ? activeBg : "#fff",
//     color: active ? activeColor : "#6b7280",
//     fontSize: 13,
//     fontWeight: 600,
//     cursor: isLoading ? "not-allowed" : "pointer",
//     transition: "all 0.2s ease",
//     transform: active ? "scale(1.05)" : "scale(1)",
//     boxShadow: active ? `0 2px 8px ${activeColor}30` : "none",
//     opacity: isLoading ? 0.7 : 1,
//   });

//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//       {/* ── Like Button ── */}
//       <button
//         onClick={(e) => handleReaction(e, "like")}
//         disabled={isLoading}
//         title="Like this offer"
//         style={btnStyle(likeActive, "#16a34a", "#f0fdf4")}
//         onMouseEnter={(e) => {
//           if (!likeActive && !isLoading) {
//             e.currentTarget.style.borderColor = "#16a34a";
//             e.currentTarget.style.color = "#16a34a";
//             e.currentTarget.style.background = "#f0fdf4";
//           }
//         }}
//         onMouseLeave={(e) => {
//           if (!likeActive) {
//             e.currentTarget.style.borderColor = "#d1d5db";
//             e.currentTarget.style.color = "#6b7280";
//             e.currentTarget.style.background = "#fff";
//           }
//         }}
//       >
//         <svg
//           width="14"
//           height="14"
//           viewBox="0 0 24 24"
//           fill={likeActive ? "#16a34a" : "none"}
//           stroke={likeActive ? "#16a34a" : "currentColor"}
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           style={{ transition: "all 0.2s ease", flexShrink: 0 }}
//         >
//           <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
//           <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
//         </svg>
//         {isLoading && reaction !== "like" ? "..." : likeActive ? "Liked" : "Like"}
//       </button>

//       {/* ── Dislike Button ── */}
//       <button
//         onClick={(e) => handleReaction(e, "dislike")}
//         disabled={isLoading}
//         title="Dislike this offer"
//         style={btnStyle(dislikeActive, "#be123c", "#fff1f2")}
//         onMouseEnter={(e) => {
//           if (!dislikeActive && !isLoading) {
//             e.currentTarget.style.borderColor = "#be123c";
//             e.currentTarget.style.color = "#be123c";
//             e.currentTarget.style.background = "#fff1f2";
//           }
//         }}
//         onMouseLeave={(e) => {
//           if (!dislikeActive) {
//             e.currentTarget.style.borderColor = "#d1d5db";
//             e.currentTarget.style.color = "#6b7280";
//             e.currentTarget.style.background = "#fff";
//           }
//         }}
//       >
//         <svg
//           width="14"
//           height="14"
//           viewBox="0 0 24 24"
//           fill={dislikeActive ? "#be123c" : "none"}
//           stroke={dislikeActive ? "#be123c" : "currentColor"}
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           style={{ transition: "all 0.2s ease", flexShrink: 0 }}
//         >
//           <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
//           <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
//         </svg>
//         {isLoading && reaction !== "dislike" ? "..." : dislikeActive ? "Disliked" : "Dislike"}
//       </button>
//     </div>
//   );
// }

// /* =========================================================
//    SECTION HEADER COMPONENT
//    ========================================================= */
// function SectionHeader({ label, count, accent, bg, border }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: 12,
//         marginBottom: 20,
//         padding: "14px 24px",
//         background: bg,
//         border: `1.5px solid ${border}`,
//         borderRadius: 16,
//       }}
//     >
//       <span
//         style={{
//           fontSize: 20,
//           fontWeight: 800,
//           color: accent,
//           letterSpacing: "-0.3px",
//         }}
//       >
//         {label}
//       </span>
//     </div>
//   );
// }

// /* =========================================================
//    SINGLE OFFER CARD COMPONENT
//    ========================================================= */
// function OfferCard({ item, isAuthenticated, onUnlockOffer, onLoginRequired, getTimeRemaining }) {
//   const now = new Date();
//   const startTime = item.OfferStartTime ? new Date(item.OfferStartTime) : null;
//   const endTime = item.OfferEndTime ? new Date(item.OfferEndTime) : null;

//   const isExpired = endTime ? now > endTime : false;
//   const isUpcoming = startTime ? now < startTime : false;
//   const isActive = !isExpired && !isUpcoming;

//   const cardBg = isExpired
//     ? "#fce4ec"
//     : isUpcoming
//     ? "#fffbeb"
//     : "#c7f4c7";

//   return (
//     <div
//       key={item.Productid}
//       onClick={() => isActive && onUnlockOffer(item)}
//       style={{
//         background: cardBg,
//         borderRadius: 16,
//         boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
//         cursor: !isActive ? "not-allowed" : "pointer",
//         opacity: !isActive ? 0.82 : 1,
//         position: "relative",
//         overflow: "hidden",
//         display: "flex",
//         flexDirection: "column",
//         transition: "transform 0.2s ease, box-shadow 0.2s ease",
//       }}
//       onMouseEnter={(e) => {
//         if (isActive) {
//           e.currentTarget.style.transform = "translateY(-4px)";
//           e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)";
//         }
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.transform = "translateY(0)";
//         e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
//       }}
//     >
//       {/* ===== PRODUCT IMAGE ===== */}
//       <div
//         style={{
//           width: "100%",
//           aspectRatio: "1 / 1",
//           overflow: "hidden",
//           background: "#fff",
//           flexShrink: 0,
//         }}
//       >
//         <img
//           src={item.Imageurl}
//           alt={item.ProductName}
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             filter: !isActive ? "grayscale(40%)" : "none",
//             transition: "transform 0.3s ease",
//           }}
//           onMouseEnter={(e) => {
//             if (isActive) e.currentTarget.style.transform = "scale(1.05)";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = "scale(1)";
//           }}
//         />
//       </div>

//       {/* ===== COMBINED ROW: like/dislike first, then timer badge ===== */}
//       <div style={{ padding: "0 12px", marginTop: 12 }}>
//         <div
//           style={{
//             padding: "8px 10px",
//             background: "#fff0f5",
//             border: "1px solid #fbcfe8",
//             borderRadius: 10,
//             display: "flex",
//             alignItems: "center",
//             gap: 6,
//             flexWrap: "nowrap",
//           }}
//         >
//           {/* Like / Dislike — always first with full text */}
//           <LikeDislikeButtons
//             productId={item.Productid}
//             isAuthenticated={isAuthenticated}
//             onLoginRequired={onLoginRequired}
//           />

//           {/* Spacer pushes timer badge to right */}
//           <div style={{ flex: 1 }} />

//           {/* Active: clock icon + time until end */}
//           {isActive && endTime && getTimeRemaining(endTime) && (
//             <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//               <svg
//                 width="12"
//                 height="12"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#be185d"
//                 strokeWidth="2.2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 style={{ flexShrink: 0 }}
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <polyline points="12 6 12 12 16 14" />
//               </svg>
//               <span
//                 style={{
//                   fontSize: 10,
//                   fontWeight: 700,
//                   color: "#fff",
//                   background: "#e91e8c",
//                   borderRadius: 999,
//                   padding: "2px 8px",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {getTimeRemaining(endTime)}
//               </span>
//             </div>
//           )}

//           {/* Expired: X icon + "Offer ended" */}
//           {isExpired && (
//             <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//               <svg
//                 width="12"
//                 height="12"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#be185d"
//                 strokeWidth="2.2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 style={{ flexShrink: 0 }}
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <line x1="15" y1="9" x2="9" y2="15" />
//                 <line x1="9" y1="9" x2="15" y2="15" />
//               </svg>
//               <span
//                 style={{
//                   fontSize: 10,
//                   fontWeight: 700,
//                   color: "#9f1239",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 Offer ended
//               </span>
//             </div>
//           )}

//           {/* Upcoming: clock icon + time until start */}
//           {isUpcoming && startTime && getTimeRemaining(startTime) && (
//             <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//               <svg
//                 width="12"
//                 height="12"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#be185d"
//                 strokeWidth="2.2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 style={{ flexShrink: 0 }}
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <polyline points="12 6 12 12 16 14" />
//               </svg>
//               <span
//                 style={{
//                   fontSize: 10,
//                   fontWeight: 700,
//                   color: "#fff",
//                   background: "#e91e8c",
//                   borderRadius: 999,
//                   padding: "2px 8px",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {getTimeRemaining(startTime)}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>

//       <div style={{ flex: 1 }} />

//       {/* ===== BUTTON ===== */}
//       {!isExpired && (
//         <button
//           disabled={!isActive}
//           style={{
//             width: "100%",
//             marginTop: 14,
//             padding: "10px 0",
//             borderRadius: 12,
//             border: "none",
//             background: !isActive ? "#fce7f3" : "#fff0f5",
//             fontSize: 14,
//             fontWeight: 600,
//             cursor: !isActive ? "not-allowed" : "pointer",
//             color: !isActive ? "#9f1239" : "#be185d",
//             transition: "all 0.2s ease",
//           }}
//           onMouseEnter={(e) => {
//             if (isActive) {
//               e.currentTarget.style.background = "#fce7f3";
//               e.currentTarget.style.transform = "scale(1.02)";
//             }
//           }}
//           onMouseLeave={(e) => {
//             if (isActive) {
//               e.currentTarget.style.background = "#fff0f5";
//               e.currentTarget.style.transform = "scale(1)";
//             }
//           }}
//         >
//           {isUpcoming ? "Get Ready" : "Go to Store"}
//         </button>
//       )}
//     </div>
//   );
// }

// /* =========================================================
//    MAIN COMPONENT
//    ========================================================= */
// export default function BillboardBanners() {
//   const dispatch = useDispatch();

//   const [mounted, setMounted] = useState(false);
//   const [hasFetched, setHasFetched] = useState(false);
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
//     bestOfferLive,
//     bestOfferUpcoming,
//     bestOfferExpired,
//   } = useSelector((state) => state.billboards);

//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const selectedLocation = useSelector(setSelectedLocation);
//   const locationData = useSelector((state) => state?.products?.productOffer);

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
//       })
//     ).finally(() => {
//       setHasFetched(true);
//     });
//   }, [selectedLocation, dispatch]);

//   /* ------------------ BANNER AUTO SLIDE ------------------ */
//   useEffect(() => {
//     if (!mounted || !bestOfferBanner?.length || isBannerPaused) return;

//     const interval = setInterval(() => {
//       setCurrentBanner((prev) =>
//         prev === bestOfferBanner.length - 1 ? 0 : prev + 1
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

//   /* ------------------ HELPERS ------------------ */
//   const getTimeRemaining = (date) => {
//     const now = new Date();
//     const diffMs = date - now;
//     if (diffMs <= 0) return null;
//     const totalMins = Math.floor(diffMs / 60000);
//     const days = Math.floor(totalMins / 1440);
//     const hours = Math.floor((totalMins % 1440) / 60);
//     const mins = totalMins % 60;
//     if (days > 0) return `${days} Day${days > 1 ? "s" : ""} Left 🔥`;
//     if (hours > 0) return `${hours} Hr${hours > 1 ? "s" : ""} Left ⏳`;
//     return `${mins} Min${mins > 1 ? "s" : ""} Left ⚡`;
//   };

//   // Determine if we have the new sectioned shape or old flat array
//   const hasNewShape =
//     bestOfferLive?.length > 0 ||
//     bestOfferUpcoming?.length > 0 ||
//     bestOfferExpired?.length > 0;

//   const sections = hasNewShape
//     ? [
//         {
//           key: "live",
//           items: bestOfferLive,
//           label: "Live Offers",
//           accent: "#16a34a",
//           bg: "#f0fdf4",
//           border: "#86efac",
//         },
//         {
//           key: "upcoming",
//           items: bestOfferUpcoming,
//           label: "Coming Soon",
//           accent: "#92400e",
//           bg: "#fffbeb",
//           border: "#fcd34d",
//         },
//         {
//           key: "expired",
//           items: bestOfferExpired,
//           label: "Expired Offers",
//           accent: "#9f1239",
//           bg: "#fff1f2",
//           border: "#fecdd3",
//         },
//       ].filter((s) => s.items.length > 0)
//     : null;

//   const totalItems = hasNewShape
//     ? (bestOfferLive?.length || 0) +
//       (bestOfferUpcoming?.length || 0) +
//       (bestOfferExpired?.length || 0)
//     : bestOfferBillboards?.length || 0;

//   /* ------------------ LOADING / ERROR STATES ------------------ */
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

//   /* ------------------ CARD GRID RENDERER ------------------ */
//   const renderCardGrid = (items) => (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//         gap: 20,
//       }}
//     >
//       {items.map((item) => (
//         <OfferCard
//           key={item.Productid}
//           item={item}
//           isAuthenticated={isAuthenticated}
//           onUnlockOffer={handleUnlockOffer}
//           onLoginRequired={() => setShowLogin(true)}
//           getTimeRemaining={getTimeRemaining}
//         />
//       ))}
//     </div>
//   );

//   return (
//     <div style={{ width: "100%", background: "#fff", marginTop: 60 }}>
//       <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>

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
//                   ProductName: banner.ProductName || banner.title || "Special Offer",
//                   Storeid: banner.Storeid || banner.storeId || locationData?.Storeid,
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
//                       alt={banner.ProductName || banner.title || "Best Offer Banner"}
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
//                     background: currentBanner === i ? "#fff" : "rgba(255,255,255,0.6)",
//                     border: "2px solid rgba(255,255,255,0.8)",
//                     transition: "all 0.2s ease",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentBanner !== i) {
//                       e.currentTarget.style.background = "rgba(255,255,255,0.9)";
//                       e.currentTarget.style.transform = "scale(1.15)";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentBanner !== i) {
//                       e.currentTarget.style.background = "rgba(255,255,255,0.6)";
//                       e.currentTarget.style.transform = "scale(1)";
//                     }
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ===================== EMPTY STATE ===================== */}
//         {totalItems === 0 && hasFetched && !bestOfferLoading && (
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

//         {/* ===================== OFFER CARDS — SECTIONED (new shape) ===================== */}
//         {totalItems > 0 && hasNewShape && sections.map(({ key, items, label, accent, bg, border }) => (
//           <div key={key} style={{ marginBottom: 48 }}>
//             <SectionHeader
//               label={label}
//               count={items.length}
//               accent={accent}
//               bg={bg}
//               border={border}
//             />
//             {renderCardGrid(items)}
//           </div>
//         ))}

//         {/* ===================== OFFER CARDS — FLAT (old shape fallback) ===================== */}
//         {totalItems > 0 && !hasNewShape && renderCardGrid(bestOfferBillboards)}

//       </div>

//       {/* ===================== MODALS ===================== */}
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


// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import { fetchBestOfferBillboards, notifyUpcomingOffer } from "@/app/features/billBoard/billBoardSlice";
// import { fetchProductOffer } from "@/app/features/products/productSlice";
// import UnlockOfferModal from "../products/UnlockOfferModel";
// import {
//   setSelectedLocation,
//   userTracking,
// } from "@/app/features/adminPanel/adminPanelSlice";
// import { selectIsAuthenticated } from "@/app/features/auth/authSlice";
// import LoginPopup from "../LoginPopup";
// import {
//   postProductReaction,
// } from "@/app/features/adminPanel/reactionSlice";

// /* =========================================================
//    NOTIFY SUCCESS POPUP COMPONENT
//    ========================================================= */
// function NotifySuccessPopup({ onClose }) {
//   useEffect(() => {
//     // Auto-close after 6 seconds to match the progress bar animation
//     const timer = setTimeout(onClose, 6000); 
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div
//       onClick={onClose}
//       style={{
//         position: "fixed", inset: 0, zIndex: 9999,
//         background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
//         display: "flex", alignItems: "center", justifyContent: "center",
//         padding: 20, animation: "fadeInBg 0.3s ease",
//       }}
//     >
//       <style>{`
//         @keyframes fadeInBg { from { opacity: 0 } to { opacity: 1 } }
//         @keyframes popIn {
//           0%  { opacity: 0; transform: scale(0.8) translateY(30px) }
//           70% { transform: scale(1.04) translateY(-4px) }
//           100%{ opacity: 1; transform: scale(1) translateY(0) }
//         }
//         @keyframes floatUp {
//           0%   { opacity: 0; transform: translateY(10px) }
//           100% { opacity: 1; transform: translateY(0) }
//         }
//         @keyframes ping {
//           0%   { transform: scale(1);   opacity: 0.8 }
//           100% { transform: scale(2.2); opacity: 0 }
//         }
//         @keyframes shimmer {
//           0%   { background-position: -200% center }
//           100% { background-position: 200% center }
//         }
//         @keyframes shrink {
//           from { width: 100% }
//           to   { width: 0% }
//         }
//       `}</style>

//       <div
//         onClick={(e) => e.stopPropagation()}
//         style={{
//           background: "#fff", borderRadius: 24,
//           padding: "36px 32px 28px", maxWidth: 400, width: "100%",
//           boxShadow: "0 32px 80px rgba(0,0,0,0.22)",
//           animation: "popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards",
//           textAlign: "center", position: "relative", overflow: "hidden",
//         }}
//       >
//         <div style={{
//           position: "absolute", top: 0, left: 0, right: 0, height: 5,
//           background: "linear-gradient(90deg, #e91e8c, #f59e0b, #16a34a, #e91e8c)",
//           backgroundSize: "200% auto",
//           animation: "shimmer 2.5s linear infinite",
//         }} />

//         <button
//           onClick={onClose}
//           style={{
//             position: "absolute", top: 14, right: 14,
//             background: "#f3f4f6", border: "none", borderRadius: "50%",
//             width: 30, height: 30, cursor: "pointer",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             fontSize: 16, color: "#6b7280",
//           }}
//         >×</button>

//         <div style={{ position: "relative", display: "inline-flex", marginBottom: 20 }}>
//           <div style={{
//             position: "absolute", inset: 0, borderRadius: "50%",
//             background: "rgba(233,30,140,0.2)",
//             animation: "ping 1.4s ease-out infinite",
//           }} />
//           <div style={{
//             width: 72, height: 72, borderRadius: "50%",
//             background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
//             border: "2px solid #f9a8d4",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             fontSize: 32, position: "relative",
//           }}>🔔</div>
//         </div>

//         <h2 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 800, color: "#1f2937", lineHeight: 1.3, animation: "floatUp 0.4s ease 0.15s both" }}>
//           You're on the list! 🔔
//         </h2>
//         <p style={{ margin: "0 0 6px", fontSize: 14, color: "#4b5563", lineHeight: 1.65, animation: "floatUp 0.4s ease 0.25s both" }}>
//           We'll notify you as soon as this offer goes live.
//         </p>
//         <p style={{ margin: "0 0 24px", fontSize: 13, color: "#9ca3af", lineHeight: 1.6, animation: "floatUp 0.4s ease 0.35s both" }}>
//           Sit back and relax. Don't miss your chance to grab the best deals when they drop! 👀
//         </p>

//         <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, animation: "floatUp 0.4s ease 0.4s both" }}>
//           <div style={{ flex: 1, height: 1, background: "#f3f4f6" }} />
//           <span style={{ fontSize: 11, color: "#d1d5db", fontWeight: 600, letterSpacing: 1 }}>WHILE YOU WAIT</span>
//           <div style={{ flex: 1, height: 1, background: "#f3f4f6" }} />
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 24, animation: "floatUp 0.4s ease 0.45s both" }}>
//           {[{ icon: "⚡", label: "Flash Deals" }, { icon: "🏷️", label: "Best Prices" }, { icon: "🎁", label: "Surprises" }].map(({ icon, label }) => (
//             <div key={label} style={{ textAlign: "center" }}>
//               <div style={{
//                 width: 44, height: 44, borderRadius: 12,
//                 background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 fontSize: 20, margin: "0 auto 6px",
//               }}>{icon}</div>
//               <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>{label}</span>
//             </div>
//           ))}
//         </div>

//         <button
//           onClick={onClose}
//           style={{
//             width: "100%", padding: "12px 0", borderRadius: 14, border: "none",
//             background: "linear-gradient(135deg, #e91e8c, #be185d)",
//             color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
//             letterSpacing: 0.3, boxShadow: "0 4px 18px rgba(233,30,140,0.35)",
//             animation: "floatUp 0.4s ease 0.5s both",
//             transition: "transform 0.15s ease, box-shadow 0.15s ease",
//           }}
//           onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(233,30,140,0.45)"; }}
//           onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(233,30,140,0.35)"; }}
//         >
//           Got it! 👍
//         </button>

//         <div style={{ marginTop: 16, height: 3, borderRadius: 99, background: "#f3f4f6", overflow: "hidden" }}>
//           <div style={{
//             height: "100%", borderRadius: 99,
//             background: "linear-gradient(90deg, #e91e8c, #f59e0b)",
//             animation: "shrink 6s linear forwards",
//           }} />
//         </div>
//         <p style={{ margin: "6px 0 0", fontSize: 11, color: "#d1d5db" }}>Closes automatically in 6s</p>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    LIKE / DISLIKE BUTTONS COMPONENT
//    ========================================================= */
// function LikeDislikeButtons({ productId, isAuthenticated, onLoginRequired }) {
//   const dispatch = useDispatch();

//   const reaction = useSelector(
//     (state) => state.reactions.reactions?.[productId]
//   );
//   const isLoading = useSelector(
//     (state) => state.reactions.loading?.[productId]
//   );

//   const likeActive = reaction === "like";
//   const dislikeActive = reaction === "dislike";

//   const handleReaction = (e, type) => {
//     e.stopPropagation();

//     if (!isAuthenticated) {
//       onLoginRequired();
//       return;
//     }

//     if (isLoading || reaction === type) return;

//     dispatch(postProductReaction({ Productid: productId, Reaction: type }));
//   };

//   const btnStyle = (active, activeColor, activeBg) => ({
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 5,
//     padding: "6px 14px",
//     borderRadius: 20,
//     border: `1.5px solid ${active ? activeColor : "#d1d5db"}`,
//     background: active ? activeBg : "#fff",
//     color: active ? activeColor : "#6b7280",
//     fontSize: 13,
//     fontWeight: 600,
//     cursor: isLoading ? "not-allowed" : "pointer",
//     transition: "all 0.2s ease",
//     transform: active ? "scale(1.05)" : "scale(1)",
//     boxShadow: active ? `0 2px 8px ${activeColor}30` : "none",
//     opacity: isLoading ? 0.7 : 1,
//   });

//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//       {/* ── Like Button ── */}
//       <button
//         onClick={(e) => handleReaction(e, "like")}
//         disabled={isLoading}
//         title="Like this offer"
//         style={btnStyle(likeActive, "#16a34a", "#f0fdf4")}
//         onMouseEnter={(e) => {
//           if (!likeActive && !isLoading) {
//             e.currentTarget.style.borderColor = "#16a34a";
//             e.currentTarget.style.color = "#16a34a";
//             e.currentTarget.style.background = "#f0fdf4";
//           }
//         }}
//         onMouseLeave={(e) => {
//           if (!likeActive) {
//             e.currentTarget.style.borderColor = "#d1d5db";
//             e.currentTarget.style.color = "#6b7280";
//             e.currentTarget.style.background = "#fff";
//           }
//         }}
//       >
//         <svg
//           width="14"
//           height="14"
//           viewBox="0 0 24 24"
//           fill={likeActive ? "#16a34a" : "none"}
//           stroke={likeActive ? "#16a34a" : "currentColor"}
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           style={{ transition: "all 0.2s ease", flexShrink: 0 }}
//         >
//           <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
//           <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
//         </svg>
//         {isLoading && reaction !== "like" ? "..." : likeActive ? "Liked" : "Like"}
//       </button>

//       {/* ── Dislike Button ── */}
//       <button
//         onClick={(e) => handleReaction(e, "dislike")}
//         disabled={isLoading}
//         title="Dislike this offer"
//         style={btnStyle(dislikeActive, "#be123c", "#fff1f2")}
//         onMouseEnter={(e) => {
//           if (!dislikeActive && !isLoading) {
//             e.currentTarget.style.borderColor = "#be123c";
//             e.currentTarget.style.color = "#be123c";
//             e.currentTarget.style.background = "#fff1f2";
//           }
//         }}
//         onMouseLeave={(e) => {
//           if (!dislikeActive) {
//             e.currentTarget.style.borderColor = "#d1d5db";
//             e.currentTarget.style.color = "#6b7280";
//             e.currentTarget.style.background = "#fff";
//           }
//         }}
//       >
//         <svg
//           width="14"
//           height="14"
//           viewBox="0 0 24 24"
//           fill={dislikeActive ? "#be123c" : "none"}
//           stroke={dislikeActive ? "#be123c" : "currentColor"}
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           style={{ transition: "all 0.2s ease", flexShrink: 0 }}
//         >
//           <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
//           <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
//         </svg>
//         {isLoading && reaction !== "dislike" ? "..." : dislikeActive ? "Disliked" : "Dislike"}
//       </button>
//     </div>
//   );
// }

// /* =========================================================
//    SECTION HEADER COMPONENT
//    ========================================================= */
// function SectionHeader({ label, count, accent, bg, border }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: 12,
//         marginBottom: 20,
//         padding: "14px 24px",
//         background: bg,
//         border: `1.5px solid ${border}`,
//         borderRadius: 16,
//       }}
//     >
//       <span
//         style={{
//           fontSize: 20,
//           fontWeight: 800,
//           color: accent,
//           letterSpacing: "-0.3px",
//         }}
//       >
//         {label}
//       </span>
//     </div>
//   );
// }

// /* =========================================================
//    SINGLE OFFER CARD COMPONENT
//    ========================================================= */
// // Added onNotifySuccess to props
// function OfferCard({ item, isAuthenticated, onUnlockOffer, onLoginRequired, getTimeRemaining, onNotifySuccess }) {
//   const dispatch = useDispatch();
  
//   const [notifyLoading, setNotifyLoading] = useState(false);
//   const [notified, setNotified] = useState(false);
//   // Removed showNotifyPopup state from here

//   const now = new Date();
//   const startTime = item.OfferStartTime ? new Date(item.OfferStartTime) : null;
//   const endTime = item.OfferEndTime ? new Date(item.OfferEndTime) : null;

//   const isExpired = endTime ? now > endTime : false;
//   const isUpcoming = startTime ? now < startTime : false;
//   const isActive = !isExpired && !isUpcoming;

//   const cardBg = isExpired
//     ? "#fce4ec"
//     : isUpcoming
//     ? "#fffbeb"
//     : "#c7f4c7";

//   const handleNotify = async (e) => {
//     e.stopPropagation();
//     if (notifyLoading || notified) return;

//     if (!isAuthenticated) {
//       onLoginRequired();
//       return;
//     }

//     setNotifyLoading(true);
//     try {
//       await dispatch(notifyUpcomingOffer({ Productid: item.Productid })).unwrap();
//       setNotified(true);
//       // Trigger the popup in the parent component
//       if (onNotifySuccess) onNotifySuccess(); 
//     } catch (err) {
//       console.error("Notify failed:", err);
//     } finally {
//       setNotifyLoading(false);
//     }
//   };

//   return (
//     <div
//       key={item.Productid}
//       onClick={() => isActive && onUnlockOffer(item)}
//       style={{
//         background: cardBg,
//         borderRadius: 16,
//         boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
//         cursor: !isActive ? "not-allowed" : "pointer",
//         opacity: !isActive ? 0.82 : 1,
//         position: "relative",
//         overflow: "hidden",
//         display: "flex",
//         flexDirection: "column",
//         transition: "transform 0.2s ease, box-shadow 0.2s ease",
//       }}
//       onMouseEnter={(e) => {
//         if (isActive) {
//           e.currentTarget.style.transform = "translateY(-4px)";
//           e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)";
//         }
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.transform = "translateY(0)";
//         e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
//       }}
//     >
//       {/* ===== PRODUCT IMAGE ===== */}
//       <div
//         style={{
//           width: "100%",
//           aspectRatio: "1 / 1",
//           overflow: "hidden",
//           background: "#fff",
//           flexShrink: 0,
//         }}
//       >
//         <img
//           src={item.Imageurl}
//           alt={item.ProductName}
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             filter: !isActive ? "grayscale(40%)" : "none",
//             transition: "transform 0.3s ease",
//           }}
//           onMouseEnter={(e) => {
//             if (isActive) e.currentTarget.style.transform = "scale(1.05)";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = "scale(1)";
//           }}
//         />
//       </div>

//       {/* ===== COMBINED ROW: like/dislike first, then timer badge ===== */}
//       <div style={{ padding: "0 12px", marginTop: 12 }}>
//         <div
//           style={{
//             padding: "8px 10px",
//             background: "#fff0f5",
//             border: "1px solid #fbcfe8",
//             borderRadius: 10,
//             display: "flex",
//             alignItems: "center",
//             gap: 6,
//             flexWrap: "nowrap",
//           }}
//         >
//           {/* Like / Dislike — always first with full text */}
//           <LikeDislikeButtons
//             productId={item.Productid}
//             isAuthenticated={isAuthenticated}
//             onLoginRequired={onLoginRequired}
//           />

//           {/* Spacer pushes timer badge to right */}
//           <div style={{ flex: 1 }} />

//           {/* Active: clock icon + time until end */}
//           {isActive && endTime && getTimeRemaining(endTime) && (
//             <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//               <svg
//                 width="12"
//                 height="12"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#be185d"
//                 strokeWidth="2.2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 style={{ flexShrink: 0 }}
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <polyline points="12 6 12 12 16 14" />
//               </svg>
//               <span
//                 style={{
//                   fontSize: 10,
//                   fontWeight: 700,
//                   color: "#fff",
//                   background: "#e91e8c",
//                   borderRadius: 999,
//                   padding: "2px 8px",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {getTimeRemaining(endTime)}
//               </span>
//             </div>
//           )}

//           {/* Expired: X icon + "Offer ended" */}
//           {isExpired && (
//             <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//               <svg
//                 width="12"
//                 height="12"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#be185d"
//                 strokeWidth="2.2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 style={{ flexShrink: 0 }}
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <line x1="15" y1="9" x2="9" y2="15" />
//                 <line x1="9" y1="9" x2="15" y2="15" />
//               </svg>
//               <span
//                 style={{
//                   fontSize: 10,
//                   fontWeight: 700,
//                   color: "#9f1239",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 Offer ended
//               </span>
//             </div>
//           )}

//           {/* Upcoming: clock icon + time until start */}
//           {isUpcoming && startTime && getTimeRemaining(startTime) && (
//             <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//               <svg
//                 width="12"
//                 height="12"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#be185d"
//                 strokeWidth="2.2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 style={{ flexShrink: 0 }}
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <polyline points="12 6 12 12 16 14" />
//               </svg>
//               <span
//                 style={{
//                   fontSize: 10,
//                   fontWeight: 700,
//                   color: "#fff",
//                   background: "#e91e8c",
//                   borderRadius: 999,
//                   padding: "2px 8px",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {getTimeRemaining(startTime)}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>

//       <div style={{ flex: 1 }} />

//       {/* ===== BUTTON ===== */}
//       {!isExpired && (
//         isUpcoming ? (
//           <button
//             onClick={handleNotify}
//             disabled={notifyLoading || notified}
//             style={{
//               width: "100%",
//               marginTop: 14,
//               padding: "10px 0",
//               borderRadius: 12,
//               border: "none",
//               background: notified ? "#dcfce7" : "#fff0f5",
//               fontSize: 14,
//               fontWeight: 600,
//               cursor: notifyLoading || notified ? "not-allowed" : "pointer",
//               color: notified ? "#16a34a" : "#be185d",
//               transition: "all 0.2s ease",
//             }}
//             onMouseEnter={(e) => {
//               if (!notified && !notifyLoading) {
//                 e.currentTarget.style.background = "#fce7f3";
//                 e.currentTarget.style.transform = "scale(1.02)";
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (!notified && !notifyLoading) {
//                 e.currentTarget.style.background = "#fff0f5";
//                 e.currentTarget.style.transform = "scale(1)";
//               }
//             }}
//           >
//             {notifyLoading ? "Notifying..." : notified ? "✓ Notified" : "🔔 Notify Me"}
//           </button>
//         ) : (
//           <button
//             disabled={!isActive}
//             style={{
//               width: "100%",
//               marginTop: 14,
//               padding: "10px 0",
//               borderRadius: 12,
//               border: "none",
//               background: !isActive ? "#fce7f3" : "#fff0f5",
//               fontSize: 14,
//               fontWeight: 600,
//               cursor: !isActive ? "not-allowed" : "pointer",
//               color: !isActive ? "#9f1239" : "#be185d",
//               transition: "all 0.2s ease",
//             }}
//             onMouseEnter={(e) => {
//               if (isActive) {
//                 e.currentTarget.style.background = "#fce7f3";
//                 e.currentTarget.style.transform = "scale(1.02)";
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (isActive) {
//                 e.currentTarget.style.background = "#fff0f5";
//                 e.currentTarget.style.transform = "scale(1)";
//               }
//             }}
//           >
//             Go to Store
//           </button>
//         )
//       )}
//     </div>
//   );
// }

// /* =========================================================
//    MAIN COMPONENT
//    ========================================================= */
// export default function BillboardBanners() {
//   const dispatch = useDispatch();

//   const [mounted, setMounted] = useState(false);
//   const [hasFetched, setHasFetched] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [couponCode, setCouponCode] = useState(null);
//   const [currentBanner, setCurrentBanner] = useState(0);
//   const [showLogin, setShowLogin] = useState(false);
//   const [isBannerPaused, setIsBannerPaused] = useState(false);
  
//   // Added state to control the popup at the root level
//   const [showNotifyPopup, setShowNotifyPopup] = useState(false);

//   const {
//     bestOfferBillboards,
//     bestOfferLoading,
//     bestOfferError,
//     bestOfferBanner,
//     bestOfferLive,
//     bestOfferUpcoming,
//     bestOfferExpired,
//   } = useSelector((state) => state.billboards);

//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const selectedLocation = useSelector(setSelectedLocation);
//   const locationData = useSelector((state) => state?.products?.productOffer);

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
//       })
//     ).finally(() => {
//       setHasFetched(true);
//     });
//   }, [selectedLocation, dispatch]);

//   /* ------------------ BANNER AUTO SLIDE ------------------ */
//   useEffect(() => {
//     if (!mounted || !bestOfferBanner?.length || isBannerPaused) return;

//     const interval = setInterval(() => {
//       setCurrentBanner((prev) =>
//         prev === bestOfferBanner.length - 1 ? 0 : prev + 1
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

//   /* ------------------ HELPERS ------------------ */
//   const getTimeRemaining = (date) => {
//     const now = new Date();
//     const diffMs = date - now;
//     if (diffMs <= 0) return null;
//     const totalMins = Math.floor(diffMs / 60000);
//     const days = Math.floor(totalMins / 1440);
//     const hours = Math.floor((totalMins % 1440) / 60);
//     const mins = totalMins % 60;
//     if (days > 0) return `${days} Day${days > 1 ? "s" : ""} Left 🔥`;
//     if (hours > 0) return `${hours} Hr${hours > 1 ? "s" : ""} Left ⏳`;
//     return `${mins} Min${mins > 1 ? "s" : ""} Left ⚡`;
//   };

//   // Determine if we have the new sectioned shape or old flat array
//   const hasNewShape =
//     bestOfferLive?.length > 0 ||
//     bestOfferUpcoming?.length > 0 ||
//     bestOfferExpired?.length > 0;

//   const sections = hasNewShape
//     ? [
//         {
//           key: "live",
//           items: bestOfferLive,
//           label: "Live Offers",
//           accent: "#16a34a",
//           bg: "#f0fdf4",
//           border: "#86efac",
//         },
//         {
//           key: "upcoming",
//           items: bestOfferUpcoming,
//           label: "Coming Soon",
//           accent: "#92400e",
//           bg: "#fffbeb",
//           border: "#fcd34d",
//         },
//         {
//           key: "expired",
//           items: bestOfferExpired,
//           label: "Expired Offers",
//           accent: "#9f1239",
//           bg: "#fff1f2",
//           border: "#fecdd3",
//         },
//       ].filter((s) => s.items.length > 0)
//     : null;

//   const totalItems = hasNewShape
//     ? (bestOfferLive?.length || 0) +
//       (bestOfferUpcoming?.length || 0) +
//       (bestOfferExpired?.length || 0)
//     : bestOfferBillboards?.length || 0;

//   /* ------------------ LOADING / ERROR STATES ------------------ */
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

//   /* ------------------ CARD GRID RENDERER ------------------ */
//   const renderCardGrid = (items) => (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//         gap: 20,
//       }}
//     >
//       {items.map((item) => (
//         <OfferCard
//           key={item.Productid}
//           item={item}
//           isAuthenticated={isAuthenticated}
//           onUnlockOffer={handleUnlockOffer}
//           onLoginRequired={() => setShowLogin(true)}
//           getTimeRemaining={getTimeRemaining}
//           onNotifySuccess={() => setShowNotifyPopup(true)} // Pass callback to trigger popup
//         />
//       ))}
//     </div>
//   );

//   return (
//     <div style={{ width: "100%", background: "#fff", marginTop: 60 }}>
//       <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>

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
//                   ProductName: banner.ProductName || banner.title || "Special Offer",
//                   Storeid: banner.Storeid || banner.storeId || locationData?.Storeid,
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
//                       alt={banner.ProductName || banner.title || "Best Offer Banner"}
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
//                     background: currentBanner === i ? "#fff" : "rgba(255,255,255,0.6)",
//                     border: "2px solid rgba(255,255,255,0.8)",
//                     transition: "all 0.2s ease",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentBanner !== i) {
//                       e.currentTarget.style.background = "rgba(255,255,255,0.9)";
//                       e.currentTarget.style.transform = "scale(1.15)";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentBanner !== i) {
//                       e.currentTarget.style.background = "rgba(255,255,255,0.6)";
//                       e.currentTarget.style.transform = "scale(1)";
//                     }
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ===================== EMPTY STATE ===================== */}
//         {totalItems === 0 && hasFetched && !bestOfferLoading && (
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

//         {/* ===================== OFFER CARDS — SECTIONED (new shape) ===================== */}
//         {totalItems > 0 && hasNewShape && sections.map(({ key, items, label, accent, bg, border }) => (
//           <div key={key} style={{ marginBottom: 48 }}>
//             <SectionHeader
//               label={label}
//               count={items.length}
//               accent={accent}
//               bg={bg}
//               border={border}
//             />
//             {renderCardGrid(items)}
//           </div>
//         ))}

//         {/* ===================== OFFER CARDS — FLAT (old shape fallback) ===================== */}
//         {totalItems > 0 && !hasNewShape && renderCardGrid(bestOfferBillboards)}

//       </div>

//       {/* ===================== MODALS ===================== */}
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

//       {/* ===================== NOTIFY SUCCESS POPUP (Rendered at root level) ===================== */}
//       {showNotifyPopup && (
//         <NotifySuccessPopup onClose={() => setShowNotifyPopup(false)} />
//       )}
//     </div>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchBestOfferBillboards, notifyUpcomingOffer } from "@/app/features/billBoard/billBoardSlice";
import { fetchProductOffer } from "@/app/features/products/productSlice";
import UnlockOfferModal from "../products/UnlockOfferModel";
import {
  setSelectedLocation,
  userTracking,
} from "@/app/features/adminPanel/adminPanelSlice";
import { selectIsAuthenticated } from "@/app/features/auth/authSlice";
import LoginPopup from "../LoginPopup";
import {
  postProductReaction,
} from "@/app/features/adminPanel/reactionSlice";

/* =========================================================
   HAVERSINE DISTANCE UTILITY
   ========================================================= */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  if (km < 10) return `${km.toFixed(1)} km away`;
  return `${Math.round(km)} km away`;
}

/* =========================================================
   USER LOCATION HOOK
   ========================================================= */
function useUserLocation() {
  const [userLocation, setUserLocation]         = useState(null);
  const [locationError, setLocationError]       = useState(false);
  const [locationDenied, setLocationDenied]     = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  // On mount, check permission state first
  useEffect(() => {
    if (!navigator?.geolocation) {
      setLocationError(true);
      return;
    }

    const hasHandledPopup = typeof window !== "undefined" && localStorage.getItem("locationPopupHandled");

    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          // Already granted — fetch silently
          if (typeof window !== "undefined") localStorage.setItem("locationPopupHandled", "true");
          fetchLocation();
        } else if (result.state === "denied") {
          setLocationDenied(true);
          setLocationError(true);
          if (typeof window !== "undefined") localStorage.setItem("locationPopupHandled", "true");
        } else {
          // "prompt" state — show custom popup ONLY if user hasn't already allowed or declined/dismissed it
          if (!hasHandledPopup) {
            setShowLocationPopup(true);
          } else {
            setLocationError(true);
          }
        }

        result.onchange = () => {
          if (result.state === "granted") {
            setLocationDenied(false);
            setLocationError(false);
            setShowLocationPopup(false);
            if (typeof window !== "undefined") localStorage.setItem("locationPopupHandled", "true");
            fetchLocation();
          } else if (result.state === "denied") {
            setLocationDenied(true);
            setLocationError(true);
            setShowLocationPopup(false);
            if (typeof window !== "undefined") localStorage.setItem("locationPopupHandled", "true");
          }
        };
      });
    } else {
      // Permissions API not available — show popup ONLY if not handled yet
      if (!hasHandledPopup) {
        setShowLocationPopup(true);
      } else {
        setLocationError(true);
      }
    }
  }, []);

  const fetchLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationError(false);
        setLocationDenied(false);
        if (typeof window !== "undefined") localStorage.setItem("locationPopupHandled", "true");
      },
      (err) => {
        setLocationError(true);
        if (err.code === 1) { // PERMISSION_DENIED
          setLocationDenied(true);
        }
        if (typeof window !== "undefined") localStorage.setItem("locationPopupHandled", "true");
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  };

  const requestLocation = (e) => {
    e?.stopPropagation();
    if (!navigator.geolocation) return;

    if (locationDenied) {
      alert(
        "Location permission is blocked.\n\nTo enable it:\n• Chrome: Click the lock icon in the address bar → Site settings → Location → Allow\n• Safari: Settings → Privacy → Location Services → Allow\n\nThen refresh the page."
      );
      return;
    }

    setShowLocationPopup(true);
  };

  const confirmLocation = () => {
    if (typeof window !== "undefined") localStorage.setItem("locationPopupHandled", "true");
    setShowLocationPopup(false);
    fetchLocation();
  };

  const dismissLocation = () => {
    if (typeof window !== "undefined") localStorage.setItem("locationPopupHandled", "true");
    setShowLocationPopup(false);
    setLocationError(true);
  };

  return {
    userLocation,
    locationError,
    locationDenied,
    showLocationPopup,
    requestLocation,
    confirmLocation,
    dismissLocation,
  };
}

/* =========================================================
   LOCATION PERMISSION POPUP
   ========================================================= */
function LocationPermissionPopup({ onConfirm, onDismiss }) {
  return (
    <div
      onClick={onDismiss}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, animation: "lpFadeIn 0.25s ease",
      }}
    >
      <style>{`
        @keyframes lpFadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes lpPopIn   {
          0%   { opacity: 0; transform: scale(0.88) translateY(24px) }
          70%  { transform: scale(1.02) translateY(-3px) }
          100% { opacity: 1; transform: scale(1) translateY(0) }
        }
        @keyframes lpPulse {
          0%, 100% { transform: scale(1);   opacity: 1 }
          50%       { transform: scale(1.12); opacity: 0.85 }
        }
        @keyframes lpRing {
          0%   { transform: scale(1);   opacity: 0.6 }
          100% { transform: scale(2);   opacity: 0 }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 24,
          padding: "36px 32px 28px", maxWidth: 380, width: "100%",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
          animation: "lpPopIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
          textAlign: "center", position: "relative", overflow: "hidden",
        }}
      >
        {/* Top accent bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 4,
          background: "linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6)",
        }} />

        {/* Close button */}
        <button
          onClick={onDismiss}
          style={{
            position: "absolute", top: 14, right: 14,
            background: "#f3f4f6", border: "none", borderRadius: "50%",
            width: 30, height: 30, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, color: "#6b7280", lineHeight: 1,
          }}
        >×</button>

        {/* Animated icon */}
        <div style={{ position: "relative", display: "inline-flex", marginBottom: 22 }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "rgba(59,130,246,0.15)",
            animation: "lpRing 1.8s ease-out infinite",
          }} />
          <div style={{
            width: 76, height: 76, borderRadius: "50%",
            background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
            border: "2px solid #bfdbfe",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
            animation: "lpPulse 2.4s ease-in-out infinite",
          }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none"
              stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
        </div>

        <h2 style={{
          margin: "0 0 10px", fontSize: 20, fontWeight: 800,
          color: "#111827", lineHeight: 1.3,
        }}>
          Enable Location
        </h2>

        <p style={{
          margin: "0 0 6px", fontSize: 14, color: "#4b5563", lineHeight: 1.65,
        }}>
          We use your location to show nearby deals and how far each offer is from you.
        </p>

        <p style={{
          margin: "0 0 24px", fontSize: 12, color: "#9ca3af", lineHeight: 1.6,
        }}>
          Your location is never stored or shared.
        </p>

        {/* Feature pills */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 8,
          flexWrap: "wrap", marginBottom: 24,
        }}>
          {[
            { icon: "📍", text: "Nearby deals" },
            { icon: "📏", text: "Distance info" },
            { icon: "⚡", text: "Faster discovery" },
          ].map(({ icon, text }) => (
            <div key={text} style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "#eff6ff", border: "1px solid #bfdbfe",
              borderRadius: 20, padding: "5px 12px",
              fontSize: 12, color: "#1d4ed8", fontWeight: 600,
            }}>
              <span style={{ fontSize: 13 }}>{icon}</span> {text}
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <button
          onClick={onConfirm}
          style={{
            width: "100%", padding: "13px 0", borderRadius: 14, border: "none",
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "#fff", fontSize: 15, fontWeight: 700,
            cursor: "pointer", marginBottom: 10,
            boxShadow: "0 4px 18px rgba(59,130,246,0.35)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 6px 24px rgba(59,130,246,0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 18px rgba(59,130,246,0.35)";
          }}
        >
          📍 Allow Location Access
        </button>

        <button
          onClick={onDismiss}
          style={{
            width: "100%", padding: "11px 0", borderRadius: 14,
            border: "1.5px solid #e5e7eb", background: "transparent",
            color: "#6b7280", fontSize: 14, fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.15s ease, color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f9fafb";
            e.currentTarget.style.color = "#374151";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#6b7280";
          }}
        >
          Maybe later
        </button>

        <p style={{ margin: "14px 0 0", fontSize: 11, color: "#d1d5db" }}>
          You can change this anytime in your browser settings
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   DISTANCE BADGE COMPONENT
   ========================================================= */
function DistanceBadge({ productLat, productLng, apiKilometer, userLocation, locationError, locationDenied, requestLocation }) {
  if (!productLat || !productLng) return null;

  let label = "";
  let isLocating = false;
  let isError = false;

  if (locationError) {
    if (apiKilometer !== undefined && apiKilometer !== null) {
      const km = Number(apiKilometer);
      label = formatDistance(km);
    } else {
      isError = true;
      label = locationDenied ? "Location blocked" : "Enable location";
    }
  } else if (!userLocation) {
    isLocating = true;
    label = "Locating…";
  } else {
    const km = haversineDistance(userLocation.lat, userLocation.lng, productLat, productLng);
    label = formatDistance(km);
  }

  const showFromYourLocation = !isLocating && !isError && label;

  return (
    <div
      onClick={isError ? requestLocation : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        cursor: isError ? "pointer" : "default",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "4px 10px",
          borderRadius: 999,
          background: "#f3f0ff",
          color: "#6366f1",
          fontSize: 11,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6366f1"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            animation: isLocating ? "spin 1.5s linear infinite" : "none",
            flexShrink: 0
          }}
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        {label}
      </div>
      {showFromYourLocation && (
        <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 500, whiteSpace: "nowrap" }}>
          from your location
        </span>
      )}
    </div>
  );
}

/* =========================================================
   NOTIFY SUCCESS POPUP COMPONENT
   ========================================================= */
function NotifySuccessPopup({ onClose }) {
  useEffect(() => {
    // Auto-close after 6 seconds to match the progress bar animation
    const timer = setTimeout(onClose, 6000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, animation: "fadeInBg 0.3s ease",
      }}
    >
      <style>{`
        @keyframes fadeInBg { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn {
          0%  { opacity: 0; transform: scale(0.8) translateY(30px) }
          70% { transform: scale(1.04) translateY(-4px) }
          100%{ opacity: 1; transform: scale(1) translateY(0) }
        }
        @keyframes floatUp {
          0%   { opacity: 0; transform: translateY(10px) }
          100% { opacity: 1; transform: translateY(0) }
        }
        @keyframes ping {
          0%   { transform: scale(1);   opacity: 0.8 }
          100% { transform: scale(2.2); opacity: 0 }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center }
          100% { background-position: 200% center }
        }
        @keyframes shrink {
          from { width: 100% }
          to   { width: 0% }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 24,
          padding: "36px 32px 28px", maxWidth: 400, width: "100%",
          boxShadow: "0 32px 80px rgba(0,0,0,0.22)",
          animation: "popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards",
          textAlign: "center", position: "relative", overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 5,
          background: "linear-gradient(90deg, #e91e8c, #f59e0b, #16a34a, #e91e8c)",
          backgroundSize: "200% auto",
          animation: "shimmer 2.5s linear infinite",
        }} />

        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 14,
            background: "#f3f4f6", border: "none", borderRadius: "50%",
            width: 30, height: 30, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, color: "#6b7280",
          }}
        >×</button>

        <div style={{ position: "relative", display: "inline-flex", marginBottom: 20 }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "rgba(233,30,140,0.2)",
            animation: "ping 1.4s ease-out infinite",
          }} />
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
            border: "2px solid #f9a8d4",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, position: "relative",
          }}>🔔</div>
        </div>

        <h2 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 800, color: "#1f2937", lineHeight: 1.3, animation: "floatUp 0.4s ease 0.15s both" }}>
          You're on the list! 🔔
        </h2>
        <p style={{ margin: "0 0 6px", fontSize: 14, color: "#4b5563", lineHeight: 1.65, animation: "floatUp 0.4s ease 0.25s both" }}>
          We'll notify you as soon as this offer goes live.
        </p>
        <p style={{ margin: "0 0 24px", fontSize: 13, color: "#9ca3af", lineHeight: 1.6, animation: "floatUp 0.4s ease 0.35s both" }}>
          Sit back and relax. Don't miss your chance to grab the best deals when they drop! 👀
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, animation: "floatUp 0.4s ease 0.4s both" }}>
          <div style={{ flex: 1, height: 1, background: "#f3f4f6" }} />
          <span style={{ fontSize: 11, color: "#d1d5db", fontWeight: 600, letterSpacing: 1 }}>WHILE YOU WAIT</span>
          <div style={{ flex: 1, height: 1, background: "#f3f4f6" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 24, animation: "floatUp 0.4s ease 0.45s both" }}>
          {[{ icon: "⚡", label: "Flash Deals" }, { icon: "🏷️", label: "Best Prices" }, { icon: "🎁", label: "Surprises" }].map(({ icon, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, margin: "0 auto 6px",
              }}>{icon}</div>
              <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "12px 0", borderRadius: 14, border: "none",
            background: "linear-gradient(135deg, #e91e8c, #be185d)",
            color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
            letterSpacing: 0.3, boxShadow: "0 4px 18px rgba(233,30,140,0.35)",
            animation: "floatUp 0.4s ease 0.5s both",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(233,30,140,0.45)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(233,30,140,0.35)"; }}
        >
          Got it! 👍
        </button>

        <div style={{ marginTop: 16, height: 3, borderRadius: 99, background: "#f3f4f6", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: "linear-gradient(90deg, #e91e8c, #f59e0b)",
            animation: "shrink 6s linear forwards",
          }} />
        </div>
        <p style={{ margin: "6px 0 0", fontSize: 11, color: "#d1d5db" }}>Closes automatically in 6s</p>
      </div>
    </div>
  );
}

/* =========================================================
   LIKE / DISLIKE BUTTONS COMPONENT
   ========================================================= */
function LikeDislikeButtons({ productId, isAuthenticated, onLoginRequired }) {
  const dispatch = useDispatch();

  const reaction = useSelector(
    (state) => state.reactions.reactions?.[productId]
  );
  const isLoading = useSelector(
    (state) => state.reactions.loading?.[productId]
  );

  const likeActive = reaction === "like";
  const dislikeActive = reaction === "dislike";

  const handleReaction = (e, type) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }

    if (isLoading || reaction === type) return;

    dispatch(postProductReaction({ Productid: productId, Reaction: type }));
  };

  return (
    <>
      {/* ── Like Button ── */}
      <button
        onClick={(e) => handleReaction(e, "like")}
        disabled={isLoading}
        title="Like this offer"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          background: "none",
          border: "none",
          color: likeActive ? "#dc2626" : "#4b5563",
          fontWeight: 600,
          fontSize: 13,
          cursor: isLoading ? "not-allowed" : "pointer",
          padding: "6px 0",
          transition: "transform 0.1s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#dc2626";
        }}
        onMouseLeave={(e) => {
          if (!likeActive) e.currentTarget.style.color = "#4b5563";
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={likeActive ? "#dc2626" : "none"}
          stroke={likeActive ? "#dc2626" : "currentColor"}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "all 0.2s ease" }}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span>{isLoading && reaction !== "like" ? "..." : "Like"}</span>
      </button>

      {/* Vertical Separator */}
      <div style={{ width: 1, height: 20, background: "#e2e8f0" }} />

      {/* ── Dislike Button ── */}
      <button
        onClick={(e) => handleReaction(e, "dislike")}
        disabled={isLoading}
        title="Dislike this offer"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          background: "none",
          border: "none",
          color: dislikeActive ? "#6b7280" : "#4b5563",
          fontWeight: 600,
          fontSize: 13,
          cursor: isLoading ? "not-allowed" : "pointer",
          padding: "6px 0",
          transition: "transform 0.1s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#6b7280";
        }}
        onMouseLeave={(e) => {
          if (!dislikeActive) e.currentTarget.style.color = "#4b5563";
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={dislikeActive ? "#6b7280" : "none"}
          stroke={dislikeActive ? "#6b7280" : "currentColor"}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "all 0.2s ease" }}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          <path d="M12 5.67l-1 2.5 2 2-2 3 1.5 2.5" fill="none" stroke={dislikeActive ? "#fff" : "currentColor"} strokeWidth="1.5" />
        </svg>
        <span>{isLoading && reaction !== "dislike" ? "..." : "Dislike"}</span>
      </button>
    </>
  );
}

/* =========================================================
   SECTION HEADER COMPONENT
   ========================================================= */
function SectionHeader({ label, count, accent, bg, border }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 10,
        marginBottom: 24,
        padding: "12px 20px",
        background: bg,
        border: `1.5px solid ${border}`,
        borderRadius: 12,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill={accent} stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" stroke="#fff" strokeWidth="2.5" />
      </svg>
      <span
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: accent,
          letterSpacing: "-0.3px",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   SINGLE OFFER CARD COMPONENT
   ========================================================= */
// Added onNotifySuccess to props, plus location props for the distance badge
function OfferCard({
  item,
  isAuthenticated,
  onUnlockOffer,
  onLoginRequired,
  getTimeRemaining,
  onNotifySuccess,
  userLocation,
  locationError,
  locationDenied,
  requestLocation,
}) {
  const dispatch = useDispatch();
  
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notified, setNotified] = useState(false);

  const now = new Date();
  const startTime = item.OfferStartTime ? new Date(item.OfferStartTime) : null;
  const endTime = item.OfferEndTime ? new Date(item.OfferEndTime) : null;

  const isExpired = endTime ? now > endTime : false;
  const isUpcoming = startTime ? now < startTime : false;
  const isActive = !isExpired && !isUpcoming;

  const handleNotify = async (e) => {
    e.stopPropagation();
    if (notifyLoading || notified) return;

    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }

    setNotifyLoading(true);
    try {
      await dispatch(notifyUpcomingOffer({ Productid: item.Productid })).unwrap();
      setNotified(true);
      if (onNotifySuccess) onNotifySuccess(); 
    } catch (err) {
      console.error("Notify failed:", err);
    } finally {
      setNotifyLoading(false);
    }
  };

  return (
    <div
      key={item.Productid}
      onClick={() => isActive && onUnlockOffer(item)}
      style={{
        background: "#ffffff",
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        cursor: !isActive ? "not-allowed" : "pointer",
        opacity: !isActive ? 0.85 : 1,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (isActive) {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)";
      }}
    >
      {/* ===== PRODUCT IMAGE ===== */}
      <div
        style={{
          width: "100%",
          aspectRatio: "1.7 / 1",
          overflow: "hidden",
          background: "#f8fafc",
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
            if (isActive) e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        />
      </div>

      {/* ===== COMBINED ROW: location on left, timer on right ===== */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 14px",
          borderTop: "1px solid #f1f5f9",
          borderBottom: "1px solid #f1f5f9",
          background: "#ffffff",
        }}
      >
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-start", overflow: "hidden" }}>
          <DistanceBadge
            productLat={item.Latitude}
            productLng={item.Longitude}
            apiKilometer={item.Kilometer}
            userLocation={userLocation}
            locationError={locationError}
            locationDenied={locationDenied}
            requestLocation={requestLocation}
          />
        </div>

        <div style={{ width: 1, height: 20, background: "#e2e8f0", margin: "0 10px", flexShrink: 0 }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", flexShrink: 0 }}>
          {isActive && endTime && getTimeRemaining(endTime) && (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ea580c"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#ea580c",
                  whiteSpace: "nowrap",
                }}
              >
                {getTimeRemaining(endTime)}
              </span>
            </div>
          )}

          {isExpired && (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#ef4444",
                  whiteSpace: "nowrap",
                }}
              >
                Offer Ended
              </span>
            </div>
          )}

          {isUpcoming && startTime && getTimeRemaining(startTime) && (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ea580c"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#ea580c",
                  whiteSpace: "nowrap",
                }}
              >
                {getTimeRemaining(startTime)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* ===== ACTIONS ROW ===== */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", gap: 8, background: "#ffffff" }}>
        <LikeDislikeButtons
          productId={item.Productid}
          isAuthenticated={isAuthenticated}
          onLoginRequired={onLoginRequired}
        />

        <div style={{ width: 1, height: 20, background: "#e2e8f0", flexShrink: 0 }} />

        <div style={{ flex: 2.2, display: "flex", justifyContent: "stretch" }}>
          {!isExpired && (
            isUpcoming ? (
              <button
                onClick={handleNotify}
                disabled={notifyLoading || notified}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: "none",
                  background: notified ? "#dcfce7" : "#fdf2f8",
                  fontSize: 12,
                  fontWeight: 700,
                  color: notified ? "#16a34a" : "#db2777",
                  cursor: notifyLoading || notified ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  transition: "all 0.2s ease",
                }}
              >
                <span>{notifyLoading ? "..." : notified ? "Notified" : "Notify Me"}</span>
              </button>
            ) : (
              <button
                disabled={!isActive}
                onClick={() => isActive && onUnlockOffer(item)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: "none",
                  background: "#16a34a",
                  color: "#ffffff",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#15803d";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#16a34a";
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                  <path d="M3 9l2.44-4.88A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.12L21 9" />
                  <path d="M12 3v6" />
                </svg>
                <span style={{ whiteSpace: "nowrap" }}>Go to Store</span>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#ffffff",
                  marginLeft: 2,
                  flexShrink: 0
                }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </button>
            )
          )}
          {isExpired && (
            <button
              disabled
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 999,
                border: "none",
                background: "#f1f5f9",
                color: "#94a3b8",
                fontSize: 12,
                fontWeight: 700,
                cursor: "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Expired
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */
export default function BillboardBanners() {
  const dispatch = useDispatch();

  const [mounted, setMounted] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [couponCode, setCouponCode] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [isBannerPaused, setIsBannerPaused] = useState(false);
  
  // Added state to control the popup at the root level
  const [showNotifyPopup, setShowNotifyPopup] = useState(false);

  // Location hook — powers the distance badge on each card, same as SuperDeal
  const {
    userLocation,
    locationError,
    locationDenied,
    showLocationPopup,
    requestLocation,
    confirmLocation,
    dismissLocation,
  } = useUserLocation();

  const {
    bestOfferBillboards,
    bestOfferLoading,
    bestOfferError,
    bestOfferBanner,
    bestOfferLive,
    bestOfferUpcoming,
    bestOfferExpired,
  } = useSelector((state) => state.billboards);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const selectedLocation = useSelector(setSelectedLocation);
  const locationData = useSelector((state) => state?.products?.productOffer);

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
    ).finally(() => {
      setHasFetched(true);
    });
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

  // Determine if we have the new sectioned shape or old flat array
  const hasNewShape =
    bestOfferLive?.length > 0 ||
    bestOfferUpcoming?.length > 0 ||
    bestOfferExpired?.length > 0;

  const sections = hasNewShape
    ? [
        {
          key: "live",
          items: bestOfferLive,
          label: "Live Offers",
          accent: "#16a34a",
          bg: "#f0fdf4",
          border: "#86efac",
        },
        {
          key: "upcoming",
          items: bestOfferUpcoming,
          label: "Coming Soon",
          accent: "#92400e",
          bg: "#fffbeb",
          border: "#fcd34d",
        },
        {
          key: "expired",
          items: bestOfferExpired,
          label: "Expired Offers",
          accent: "#9f1239",
          bg: "#fff1f2",
          border: "#fecdd3",
        },
      ].filter((s) => s.items.length > 0)
    : null;

  const totalItems = hasNewShape
    ? (bestOfferLive?.length || 0) +
      (bestOfferUpcoming?.length || 0) +
      (bestOfferExpired?.length || 0)
    : bestOfferBillboards?.length || 0;

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

  /* ------------------ CARD GRID RENDERER ------------------ */
  const renderCardGrid = (items) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: 20,
      }}
    >
      {items.map((item) => (
        <OfferCard
          key={item.Productid}
          item={item}
          isAuthenticated={isAuthenticated}
          onUnlockOffer={handleUnlockOffer}
          onLoginRequired={() => setShowLogin(true)}
          getTimeRemaining={getTimeRemaining}
          onNotifySuccess={() => setShowNotifyPopup(true)}
          userLocation={userLocation}
          locationError={locationError}
          locationDenied={locationDenied}
          requestLocation={requestLocation}
        />
      ))}
    </div>
  );

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
                  ProductName: banner.ProductName || banner.title || "Special Offer",
                  Storeid: banner.Storeid || banner.storeId || locationData?.Storeid,
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
                      alt={banner.ProductName || banner.title || "Best Offer Banner"}
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
                    background: currentBanner === i ? "#fff" : "rgba(255,255,255,0.6)",
                    border: "2px solid rgba(255,255,255,0.8)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (currentBanner !== i) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.9)";
                      e.currentTarget.style.transform = "scale(1.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentBanner !== i) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.6)";
                      e.currentTarget.style.transform = "scale(1)";
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ===================== EMPTY STATE ===================== */}
        {totalItems === 0 && hasFetched && !bestOfferLoading && (
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
              No Nearby Offers Available
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

        {/* ===================== OFFER CARDS — SECTIONED (new shape) ===================== */}
        {totalItems > 0 && hasNewShape && sections.map(({ key, items, label, accent, bg, border }) => (
          <div key={key} style={{ marginBottom: 48 }}>
            <SectionHeader
              label={label}
              count={items.length}
              accent={accent}
              bg={bg}
              border={border}
            />
            {renderCardGrid(items)}
          </div>
        ))}

        {/* ===================== OFFER CARDS — FLAT (old shape fallback) ===================== */}
        {totalItems > 0 && !hasNewShape && renderCardGrid(bestOfferBillboards)}

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

      {/* ===================== NOTIFY SUCCESS POPUP (Rendered at root level) ===================== */}
      {showNotifyPopup && (
        <NotifySuccessPopup onClose={() => setShowNotifyPopup(false)} />
      )}

      {/* ===================== LOCATION PERMISSION POPUP ===================== */}
      {showLocationPopup && (
        <LocationPermissionPopup
          onConfirm={confirmLocation}
          onDismiss={dismissLocation}
        />
      )}
    </div>
  );
}