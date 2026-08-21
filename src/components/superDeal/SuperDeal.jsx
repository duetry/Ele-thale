

// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import { fetchSuperDeals, requestExpiredOffer } from "@/app/features/billBoard/billBoardSlice";
// import { fetchProductOffer } from "@/app/features/products/productSlice";

// import UnlockOfferModal from "../products/UnlockOfferModel";
// import { selectSelectedLocation, userTracking } from "@/app/features/adminPanel/adminPanelSlice";

// import { selectIsAuthenticated } from "@/app/features/auth/authSlice";
// import LoginPopup from "../LoginPopup";
// import {
//   postProductReaction,
//   selectReaction,
//   selectReactionLoading,
// } from "@/app/features/adminPanel/reactionSlice";

// /* =========================================================
//    LIVE COUNTDOWN HOOK — ticks every second
//    ========================================================= */
// function useCountdown(offerStartTime, offerEndTime) {
//   const [now, setNow] = useState(() => new Date());

//   useEffect(() => {
//     const id = setInterval(() => setNow(new Date()), 1000);
//     return () => clearInterval(id);
//   }, []);

//   const start = offerStartTime ? new Date(offerStartTime) : null;
//   const end   = offerEndTime   ? new Date(offerEndTime)   : null;

//   const pad = (n) => String(n).padStart(2, "0");

//   const toSegments = (ms) => {
//     if (ms <= 0) return [];
//     const totalSec = Math.floor(ms / 1000);
//     const d = Math.floor(totalSec / 86400);
//     const h = Math.floor((totalSec % 86400) / 3600);
//     const m = Math.floor((totalSec % 3600) / 60);
//     const s = totalSec % 60;
//     if (d > 0) return [
//       { num: String(d), unit: d === 1 ? "Day" : "Days" },
//       { num: pad(h), unit: "Hrs" },
//       { num: pad(m), unit: "Min" },
//       { num: pad(s), unit: "Sec" },
//     ];
//     if (h > 0) return [
//       { num: pad(h), unit: "Hrs" },
//       { num: pad(m), unit: "Min" },
//       { num: pad(s), unit: "Sec" },
//     ];
//     return [
//       { num: pad(m), unit: "Min" },
//       { num: pad(s), unit: "Sec" },
//     ];
//   };

//   if (end && now > end)     return { status: "expired",  label: "Offer Ended",        segments: [] };
//   if (start && now < start) return { status: "upcoming", label: "Offer Available in", segments: toSegments(start - now) };
//   if (end)                  return { status: "active",   label: "Offer Close  in",    segments: toSegments(end - now) };
//   return { status: "active", label: "", segments: [] };
// }

// /* =========================================================
//    COUNTDOWN BADGE COMPONENT
//    ========================================================= */
// function CountdownBadge({ offerStartTime, offerEndTime }) {
//   const { status, label, segments } = useCountdown(offerStartTime, offerEndTime);

//   if (status === "expired") {
//     return (
//       <div style={{
//         display: "flex", alignItems: "center", gap: 6,
//         padding: "7px 10px", marginTop: 10,
//         background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 10,
//       }}>
//         <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
//           stroke="#be123c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//           <circle cx="12" cy="12" r="10" />
//           <line x1="15" y1="9" x2="9" y2="15" />
//           <line x1="9" y1="9" x2="15" y2="15" />
//         </svg>
//         <span style={{ fontSize: 12, fontWeight: 700, color: "#be123c" }}>
//           This offer has ended
//         </span>
//       </div>
//     );
//   }

//   const isUpcoming  = status === "upcoming";
//   const bgColor     = isUpcoming ? "#fffbeb" : "#f0fdf4";
//   const borderColor = isUpcoming ? "#fde68a" : "#bbf7d0";
//   const labelColor  = isUpcoming ? "#92400e" : "#14532d";
//   const digitBg     = isUpcoming ? "#f59e0b" : "#16a34a";

//   return (
//     <div style={{
//       padding: "9px 10px", marginTop: 10,
//       background: bgColor, border: `1px solid ${borderColor}`, borderRadius: 10,
//     }}>
//       <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
//         <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
//           stroke={labelColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//           <circle cx="12" cy="12" r="10" />
//           <polyline points="12 6 12 12 16 14" />
//         </svg>
//         <span style={{ fontSize: 11, fontWeight: 700, color: labelColor, textTransform: "uppercase", letterSpacing: 0.4 }}>
//           {label}
//         </span>
//       </div>
//       <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
//         {segments.map((seg, i) => (
//           <React.Fragment key={i}>
//             <div style={{ textAlign: "center" }}>
//               <div style={{
//                 background: digitBg, color: "#fff",
//                 fontFamily: "monospace", fontSize: 16, fontWeight: 800,
//                 borderRadius: 7, padding: "4px 8px", minWidth: 34,
//                 letterSpacing: 1, textAlign: "center",
//                 boxShadow: `0 2px 8px ${digitBg}55`,
//               }}>
//                 {seg.num}
//               </div>
//               <div style={{
//                 fontSize: 9, fontWeight: 700, color: labelColor,
//                 marginTop: 3, textTransform: "uppercase", textAlign: "center",
//               }}>
//                 {seg.unit}
//               </div>
//             </div>
//             {i < segments.length - 1 && (
//               <span style={{
//                 fontSize: 16, fontWeight: 900,
//                 color: digitBg, marginBottom: 14, lineHeight: 1,
//               }}>:</span>
//             )}
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    LIKE / DISLIKE BUTTONS COMPONENT
//    ========================================================= */
// function LikeDislikeButtons({ productId, isAuthenticated, onLoginRequired }) {
//   const dispatch = useDispatch();

//   const reaction  = useSelector((state) => state.reactions.reactions?.[productId]);
//   const isLoading = useSelector((state) => state.reactions.loading?.[productId]);

//   const likeActive    = reaction === "like";
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
//           display: "flex", alignItems: "center", gap: 5,
//           padding: "6px 14px", borderRadius: 20,
//           border: `1.5px solid ${likeActive ? "#16a34a" : "#d1d5db"}`,
//           background: likeActive ? "#f0fdf4" : "#fff",
//           color: likeActive ? "#16a34a" : "#6b7280",
//           fontSize: 13, fontWeight: 600,
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
//           width="15" height="15" viewBox="0 0 24 24"
//           fill={likeActive ? "#16a34a" : "none"}
//           stroke={likeActive ? "#16a34a" : "currentColor"}
//           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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
//           display: "flex", alignItems: "center", gap: 5,
//           padding: "6px 14px", borderRadius: 20,
//           border: `1.5px solid ${dislikeActive ? "#be123c" : "#d1d5db"}`,
//           background: dislikeActive ? "#fff1f2" : "#fff",
//           color: dislikeActive ? "#be123c" : "#6b7280",
//           fontSize: 13, fontWeight: 600,
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
//           width="15" height="15" viewBox="0 0 24 24"
//           fill={dislikeActive ? "#be123c" : "none"}
//           stroke={dislikeActive ? "#be123c" : "currentColor"}
//           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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
//    REQUEST OFFER SUCCESS POPUP
//    ========================================================= */
// function RequestOfferSuccessPopup({ onClose }) {
//   useEffect(() => {
//     const timer = setTimeout(onClose, 10000);
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
//           Request Submitted! 🎉
//         </h2>
//         <p style={{ margin: "0 0 6px", fontSize: 14, color: "#4b5563", lineHeight: 1.65, animation: "floatUp 0.4s ease 0.25s both" }}>
//           You've successfully requested this offer
//         </p>
//         <p style={{ margin: "0 0 24px", fontSize: 13, color: "#9ca3af", lineHeight: 1.6, animation: "floatUp 0.4s ease 0.35s both" }}>
//           Keep an eye out — we have exciting offers dropping soon. Don't miss your chance to grab them! 👀
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
//           Explore More Offers 🚀
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
//    MAIN COMPONENT
//    ========================================================= */
// export default function SuperDeal() {
//   const dispatch = useDispatch();

//   const [mounted, setMounted]                     = useState(false);
//   const [selectedProduct, setSelectedProduct]     = useState(null);
//   const [couponCode, setCouponCode]               = useState(null);
//   const [currentBanner, setCurrentBanner]         = useState(0);
//   const [showLogin, setShowLogin]                 = useState(false);
//   const [isBannerPaused, setIsBannerPaused]       = useState(false);
//   const [showRequestSuccess, setShowRequestSuccess] = useState(false);

//   const {
//     superDealBillboards,
//     superDealLoading,
//     superDealError,
//     superDealBanner,
//   } = useSelector((state) => state.billboards);

//   const isAuthenticated  = useSelector(selectIsAuthenticated);
//   const selectedLocation = useSelector(selectSelectedLocation);
//   const locationData     = useSelector((state) => state?.products?.productOffer);

//   /* ── Mount ── */
//   useEffect(() => { setMounted(true); }, []);

//   /* ── Fetch on location change ── */
//   useEffect(() => {
//     if (!selectedLocation?.LocationId) return;
//     dispatch(fetchSuperDeals({ LocationId: String(selectedLocation.LocationId) }));
//   }, [selectedLocation, dispatch]);

//   /* ── Banner auto-slide ── */
//   useEffect(() => {
//     if (!mounted || !superDealBanner?.length || isBannerPaused) return;
//     const interval = setInterval(() => {
//       setCurrentBanner((prev) =>
//         prev === superDealBanner.length - 1 ? 0 : prev + 1
//       );
//     }, 4000);
//     return () => clearInterval(interval);
//   }, [mounted, superDealBanner, isBannerPaused]);

//   /* ── Unlock offer handler ── */
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
//         .catch((err) => console.error("Offer API failed:", err));
//     } else {
//       setShowLogin(true);
//     }
//   };

//   /* ── Request expired offer handler ── */
//   const handleRequestOffer = (product) => {
//     if (!isAuthenticated) {
//       setShowLogin(true);
//       return;
//     }
//     dispatch(requestExpiredOffer({ Productid: product.Productid }))
//       .unwrap()
//       .then(() => setShowRequestSuccess(true))
//       .catch((err) => console.error("Request offer failed:", err));
//   };

//   /* ── Loading skeleton ── */
//   if (!mounted || superDealLoading) {
//     return (
//       <div style={{ width: "100%", marginTop: 60, padding: 20 }}>
//         <div className="skeleton" style={{ width: "100%", height: 380, borderRadius: 24, marginBottom: 40 }} />
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
//           {[...Array(8)].map((_, i) => (
//             <div key={i} style={{ padding: 16, borderRadius: 16, background: "#fff" }}>
//               <div className="skeleton" style={{ height: 180 }} />
//               <div className="skeleton" style={{ height: 20, marginTop: 12 }} />
//               <div className="skeleton" style={{ height: 16, marginTop: 8, width: "70%" }} />
//               <div className="skeleton" style={{ height: 30, marginTop: 16, width: "40%" }} />
//               <div className="skeleton" style={{ height: 40, marginTop: 16 }} />
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   /* ── Error state ── */
//   if (superDealError) {
//     return (
//       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "red" }}>
//         {superDealError}
//       </div>
//     );
//   }

//   const sorted = superDealBillboards || [];

//   return (
//     <div style={{ width: "100%", background: "#fff", marginTop: 60 }}>
//       <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>

//         {/* ===================== BANNER CAROUSEL ===================== */}
//         {superDealBanner?.length > 0 && (
//           <div
//             style={{ position: "relative", overflow: "hidden", borderRadius: 24, marginBottom: 40, cursor: "pointer" }}
//             onMouseEnter={() => setIsBannerPaused(true)}
//             onMouseLeave={() => setIsBannerPaused(false)}
//           >
//             <div style={{
//               display: "flex",
//               transform: `translateX(-${currentBanner * 100}%)`,
//               transition: "transform 0.7s ease-in-out",
//             }}>
//               {superDealBanner.map((banner, index) => {
//                 const bannerProduct = {
//                   Productid:      banner.Productid || banner.id || `banner-${index}`,
//                   ProductName:    banner.ProductName || banner.title || "Special Offer",
//                   Storeid:        banner.Storeid || banner.storeId || locationData?.Storeid,
//                   Imageurl:       banner.Imageurl || banner.image,
//                   Price:          banner.Price,
//                   Finalprice:     banner.Finalprice,
//                   Brand:          banner.Brand,
//                   Type:           banner.Type,
//                   OfferStartTime: banner.OfferStartTime,
//                   OfferEndTime:   banner.OfferEndTime,
//                 };
//                 return (
//                   <div
//                     key={index}
//                     style={{ minWidth: "100%", height: 380, position: "relative" }}
//                     onClick={() => handleUnlockOffer(bannerProduct)}
//                   >
//                     <img
//                       src={banner.Imageurl || banner.image}
//                       alt={banner.ProductName || banner.title || "Super Deal Banner"}
//                       style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
//                     />
//                     <div
//                       style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.3s ease", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 24 }}
//                       onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.15)")}
//                       onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0)")}
//                     >
//                       <span style={{ background: "rgba(0,0,0,0.75)", color: "#fff", padding: "8px 20px", borderRadius: 24, fontSize: 13, fontWeight: 600 }}>
//                         🔓 Tap to Unlock Offer
//                       </span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Navigation Dots */}
//             <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 10 }}>
//               {superDealBanner.map((_, i) => (
//                 <span
//                   key={i}
//                   onClick={(e) => { e.stopPropagation(); setCurrentBanner(i); }}
//                   style={{
//                     width: 10, height: 10, borderRadius: "50%", cursor: "pointer",
//                     background: currentBanner === i ? "#fff" : "rgba(255,255,255,0.6)",
//                     border: "2px solid rgba(255,255,255,0.8)", transition: "all 0.2s ease",
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ===================== EMPTY STATE ===================== */}
//         {sorted.length === 0 && (
//           <div style={{
//             display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
//             padding: "80px 24px",
//             background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 60%, #f0fdf4 100%)",
//             borderRadius: 24, border: "1.5px dashed #86efac", textAlign: "center", minHeight: 340,
//           }}>
//             <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg, #bbf7d0, #86efac)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, boxShadow: "0 8px 32px rgba(34,197,94,0.18)" }}>
//               <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
//                 <line x1="7" y1="7" x2="7.01" y2="7" />
//               </svg>
//             </div>
//             <h2 style={{ fontSize: 22, fontWeight: 700, color: "#14532d", margin: "0 0 10px" }}>No Super Deals Available</h2>
//             <p style={{ fontSize: 15, color: "#4b7c5e", maxWidth: 380, lineHeight: 1.7, margin: "0 0 28px" }}>
//               We couldn't find any active super deals for your selected location. Switch to a nearby area — great offers might be just around the corner!
//             </p>
//             <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#ffffff", border: "1px solid #bbf7d0", borderRadius: 999, padding: "10px 22px", fontSize: 13, fontWeight: 600, color: "#16a34a", boxShadow: "0 2px 10px rgba(34,197,94,0.10)" }}>
//               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
//             {sorted.map((item) => {
//               const now       = new Date();
//               const startTime = item.OfferStartTime ? new Date(item.OfferStartTime) : null;
//               const endTime   = item.OfferEndTime   ? new Date(item.OfferEndTime)   : null;

//               const isExpired  = endTime   ? now > endTime   : false;
//               const isUpcoming = startTime ? now < startTime : false;
//               const isActive   = !isExpired && !isUpcoming;

//               const cardBg = isExpired ? "#fce4ec" : isUpcoming ? "#fffbeb" : "#c7f4c7";

//               // ── statusConfig (matches BillboardBanners pattern) ──
//               const statusConfig = isExpired
//                 ? {
//                     bg:    "linear-gradient(90deg, #fce4ec, #f8bbd0)",
//                     color: "#9f1239",
//                     icon:  "",
//                     label: "You Missed Out",
//                   }
//                 : isUpcoming
//                 ? {
//                     bg:    "linear-gradient(90deg, #fffbeb, #fef3c7)",
//                     color: "#92400e",
//                     icon:  "",
//                     label: "Get Ready to Claim",
//                   }
//                 : {
//                     bg:    "linear-gradient(90deg, #dcfce7, #bbf7d0)",
//                     color: "#14532d",
//                     icon:  "",
//                     label: "Don't Miss This",
//                   };

//               return (
//                 <div
//                   key={item.Productid}
//                   onClick={() => isActive && handleUnlockOffer(item)}
//                   style={{
//                     background: cardBg, borderRadius: 16,
//                     boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
//                     cursor: !isActive ? "not-allowed" : "pointer",
//                     opacity: !isActive ? 0.82 : 1,
//                     position: "relative", overflow: "hidden",
//                     display: "flex", flexDirection: "column",
//                     transition: "transform 0.2s ease, box-shadow 0.2s ease",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (isActive) {
//                       e.currentTarget.style.transform = "translateY(-4px)";
//                       e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = "translateY(0)";
//                     e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
//                   }}
//                 >
//                   {/* ===== STATUS BAR (top of card) — same as BillboardBanners ===== */}
//                   {/* <div
//                     style={{
//                       width: "100%",
//                       padding: "9px 14px",
//                       background: statusConfig.bg,
//                       display: "flex",
//                         justifyContent: "center", 
//                       alignItems: "center",
//                       // gap: 7,
//                        textTransform: "uppercase",
//                       borderRadius: "16px 16px 0 0",
//                     }}
//                   >
//                     <span style={{ fontSize: 15, lineHeight: 1 }}>
//                       {statusConfig.icon}
//                     </span>
//                     <span
//                       style={{
//                         fontSize: 25,
//                         fontWeight: 700,
//                         color: statusConfig.color,
//                         textAlign:"center",
//                         letterSpacing: 0.2,
//                         flex: 1,
//                       }}
//                     >
//                       {statusConfig.label}
//                     </span>
//                   </div> */}

//                   {/* ===== PRODUCT IMAGE ===== */}
//                   <div style={{ width: "100%", aspectRatio: "1 / 1", overflow: "hidden", background: "#fff", flexShrink: 0 }}>
//                     <img
//                       src={item.Imageurl}
//                       alt={item.ProductName}
//                       style={{
//                         width: "100%", height: "100%", objectFit: "cover",
//                         filter: !isActive ? "grayscale(40%)" : "none",
//                         transition: "transform 0.3s ease",
//                       }}
//                       onMouseEnter={(e) => { if (isActive) e.currentTarget.style.transform = "scale(1.05)"; }}
//                       onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
//                     />
//                   </div>

//                   {/* ===== LIVE COUNTDOWN ===== */}
//                   <div style={{ padding: "0 12px" }}>
//                     <CountdownBadge
//                       offerStartTime={item.OfferStartTime}
//                       offerEndTime={item.OfferEndTime}
//                     />
//                   </div>

//                   {/* ===== LIKE / DISLIKE ===== */}
//                   <div style={{ padding: "0 12px" }}>
//                     <LikeDislikeButtons
//                       productId={item.Productid}
//                       isAuthenticated={isAuthenticated}
//                       onLoginRequired={() => setShowLogin(true)}
//                     />
//                   </div>
                

//                   <div style={{ flex: 1 }} />

//                   {/* ===== CTA BUTTON ===== */}
//                   {isExpired ? (
//                     <button
//                       onClick={(e) => { e.stopPropagation(); handleRequestOffer(item); }}
//                       style={{
//                         width: "100%", marginTop: 14, padding: "10px 0",
//                         borderRadius: 12, border: "1.5px solid #be123c",
//                         background: "#fff1f2", fontSize: 14, fontWeight: 600,
//                         cursor: "pointer", color: "#be123c", transition: "all 0.2s ease",
//                       }}
//                       onMouseEnter={(e) => { e.currentTarget.style.background = "#fecdd3"; }}
//                       onMouseLeave={(e) => { e.currentTarget.style.background = "#fff1f2"; }}
//                     >
//                       Request This Offer Again
//                     </button>
//                   ) : (
//                     <button
//                       disabled={!isActive}
//                       style={{
//                         width: "100%", marginTop: 14, padding: "10px 0",
//                         borderRadius: 12, border: "none",
//                         background: !isActive ? "#fce7f3" : "#fff0f5",
//                         fontSize: 14, fontWeight: 600,
//                         cursor: !isActive ? "not-allowed" : "pointer",
//                         color: !isActive ? "#9f1239" : "#be185d",
//                         transition: "all 0.2s ease",
//                       }}
//                       onMouseEnter={(e) => { if (isActive) { e.currentTarget.style.background = "#fce7f3"; e.currentTarget.style.transform = "scale(1.02)"; } }}
//                       onMouseLeave={(e) => { if (isActive) { e.currentTarget.style.background = "#fff0f5"; e.currentTarget.style.transform = "scale(1)"; } }}
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
//         onClose={() => { setSelectedProduct(null); setCouponCode(null); }}
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
//                 .then((res) => { setCouponCode(res?.data?.[0]); })
//                 .catch((err) => console.error("Offer API failed:", err));
//             }
//           }}
//         />
//       )}

//       {showRequestSuccess && (
//         <RequestOfferSuccessPopup onClose={() => setShowRequestSuccess(false)} />
//       )}
//     </div>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchSuperDeals, requestExpiredOffer, notifyUpcomingOffer } from "@/app/features/billBoard/billBoardSlice";
import { fetchProductOffer } from "@/app/features/products/productSlice";

import UnlockOfferModal from "../products/UnlockOfferModel";
import { selectSelectedLocation, userTracking } from "@/app/features/adminPanel/adminPanelSlice";

import { selectIsAuthenticated } from "@/app/features/auth/authSlice";
import LoginPopup from "../LoginPopup";
import {
  postProductReaction,
  selectReaction,
  selectReactionLoading,
} from "@/app/features/adminPanel/reactionSlice";

import { MapPin, Heart, Share2, Store, Clock, Gift, ArrowRight, Grid, List, ChevronRight, Star, Bell } from "lucide-react";
import toast from "react-hot-toast";

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
  let isBlocked = false;

  if (locationError) {
    if (apiKilometer !== undefined && apiKilometer !== null) {
      const km = Number(apiKilometer);
      label = formatDistance(km);
    } else {
      isBlocked = locationDenied;
      label = locationDenied ? "Location blocked" : "Enable location";
    }
  } else if (!userLocation) {
    isLocating = true;
    label = "Locating…";
  } else {
    const km = haversineDistance(userLocation.lat, userLocation.lng, productLat, productLng);
    label = formatDistance(km);
  }

  return (
    <div
      onClick={(e) => {
        if (locationError) {
          e.stopPropagation();
          requestLocation(e);
        }
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: "1px solid #f3f4f6",
        cursor: locationError ? "pointer" : "default",
        background: "#ffffff",
        transition: "background 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (locationError) e.currentTarget.style.background = "#f9fafb";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#ffffff";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#f5f3ff",
          flexShrink: 0
        }}>
          <MapPin
            style={{
              width: 14,
              height: 14,
              color: isLocating || isBlocked ? "#9ca3af" : "#db2777",
            }}
          />
        </span>
        {isLocating || isBlocked ? (
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1f2937" }}>
            {label}
          </span>
        ) : (
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1f2937" }}>
            {label}{" "}
            <span style={{ fontWeight: 500, color: "#6b7280" }}>
              from your location
            </span>
          </span>
        )}
      </div>
      <ChevronRight style={{ width: 14, height: 14, color: "#9ca3af" }} />
    </div>
  );
}

/* =========================================================
   LIVE COUNTDOWN HOOK — ticks every second
   ========================================================= */
function useCountdown(offerStartTime, offerEndTime) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const start = offerStartTime ? new Date(offerStartTime) : null;
  const end   = offerEndTime   ? new Date(offerEndTime)   : null;
  const pad   = (n) => String(n).padStart(2, "0");

  const toSegments = (ms) => {
    if (ms <= 0) return [];
    const totalSec = Math.floor(ms / 1000);
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (d > 0) return [
      { num: String(d), unit: d === 1 ? "Day" : "Days" },
      { num: pad(h), unit: "Hrs" },
      { num: pad(m), unit: "Min" },
      { num: pad(s), unit: "Sec" },
    ];
    if (h > 0) return [
      { num: pad(h), unit: "Hrs" },
      { num: pad(m), unit: "Min" },
      { num: pad(s), unit: "Sec" },
    ];
    return [
      { num: pad(m), unit: "Min" },
      { num: pad(s), unit: "Sec" },
    ];
  };

  if (end && now > end)     return { status: "expired",  label: "Offer Ended",        segments: [] };
  if (start && now < start) return { status: "upcoming", label: "Offer Available in", segments: toSegments(start - now) };
  if (end)                  return { status: "active",   label: "Offer Close  in",    segments: toSegments(end - now) };
  return { status: "active", label: "", segments: [] };
}

/* =========================================================
   COUNTDOWN BADGE COMPONENT
   ========================================================= */
function CountdownBadge({ offerStartTime, offerEndTime }) {
  const { status, label, segments } = useCountdown(offerStartTime, offerEndTime);

  if (status === "expired") {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 12px",
        background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10,
        color: "#166534", fontSize: 12, fontWeight: 700
      }}>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#be123c",
          color: "#ffffff",
          flexShrink: 0
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <span>This offer has ended</span>
      </div>
    );
  }

  const isUpcoming  = status === "upcoming";
  const labelText = isUpcoming ? "Offer Available in" : "Offer Closes in";
  const badgeColor  = isUpcoming ? "#d97706" : "#16a34a"; // Amber for upcoming, green for active

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, color: badgeColor, fontSize: 11, fontWeight: 800, letterSpacing: "0.5px" }}>
        <Clock style={{ width: 12, height: 12 }} />
        <span>{labelText.toUpperCase()}</span>
      </div>

      {/* Row with segments and gift icon */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {segments.map((seg, i) => (
            <React.Fragment key={i}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  background: badgeColor,
                  color: "#ffffff",
                  fontFamily: "monospace",
                  fontSize: 14,
                  fontWeight: 800,
                  borderRadius: 6,
                  width: 32,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 2px 6px ${badgeColor}33`,
                }}>
                  {seg.num}
                </div>
                <span style={{ fontSize: 8, fontWeight: 700, color: "#9ca3af", marginTop: 3, letterSpacing: "0.2px" }}>
                  {seg.unit.toUpperCase()}
                </span>
              </div>
              {i < segments.length - 1 && (
                <span style={{ fontSize: 14, fontWeight: 900, color: badgeColor, marginBottom: 12, lineHeight: 1 }}>:</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Gift icon box */}
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          border: "1.5px solid #e8f5e9",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isUpcoming ? "#d97706" : "#16a34a",
          opacity: 0.8
        }}>
          <Gift style={{ width: 20, height: 20, strokeWidth: 1.5 }} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   LIKE / DISLIKE BUTTONS COMPONENT
   ========================================================= */
const DislikeIcon = ({ style, ...props }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    {...props}
  >
    <path d="M12 5c-1.7-2.6-5.5-3-7.5-1-2 2-2 6 2.5 10.5l5 4.5 5-4.5c4.5-4.5 4.5-8.5 2.5-10.5-2-2-5.8-1.6-7.5 1" />
    <path d="M12 5l-1.5 3 2.5 3-2 3.5 1 2.5" />
  </svg>
);

function LikeDislikeButtons({ productId, isAuthenticated, onLoginRequired }) {
  const dispatch = useDispatch();

  const reaction  = useSelector((state) => state.reactions.reactions?.[productId]);
  const isLoading = useSelector((state) => state.reactions.loading?.[productId]);

  const likeActive    = reaction === "like";
  const dislikeActive = reaction === "dislike";

  const handleReaction = (e, type) => {
    e.stopPropagation();
    if (!isAuthenticated) { onLoginRequired(); return; }
    if (isLoading || reaction === type) return;
    dispatch(postProductReaction({ Productid: productId, Reaction: type }));
  };

  return (
    <>
      {/* Like Button */}
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
          padding: "10px 14px",
          borderRadius: 12,
          border: `1.5px solid ${likeActive ? "#0d9488" : "#14b8a6"}`,
          background: likeActive ? "#f0fdf4" : "#ffffff",
          color: likeActive ? "#0d9488" : "#374151",
          fontSize: 13,
          fontWeight: 700,
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (!likeActive && !isLoading) {
            e.currentTarget.style.background = "#f0fdf4";
          }
        }}
        onMouseLeave={(e) => {
          if (!likeActive) {
            e.currentTarget.style.background = "#ffffff";
          }
        }}
      >
        <Heart
          fill={likeActive ? "#0d9488" : "none"}
          stroke="#0d9488"
          style={{ width: 15, height: 15 }}
        />
        <span>Like</span>
      </button>

      {/* Dislike Button */}
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
          padding: "10px 14px",
          borderRadius: 12,
          border: `1.5px solid ${dislikeActive ? "#be123c" : "#f43f5e"}`,
          background: dislikeActive ? "#fff1f2" : "#ffffff",
          color: dislikeActive ? "#be123c" : "#374151",
          fontSize: 13,
          fontWeight: 700,
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (!dislikeActive && !isLoading) {
            e.currentTarget.style.background = "#fff1f2";
          }
        }}
        onMouseLeave={(e) => {
          if (!dislikeActive) {
            e.currentTarget.style.background = "#ffffff";
          }
        }}
      >
        <DislikeIcon style={{ width: 15, height: 15, color: "#f43f5e" }} />
        <span>Dislike</span>
      </button>
    </>
  );
}

/* =========================================================
   REQUEST OFFER SUCCESS POPUP
   ========================================================= */
function RequestOfferSuccessPopup({ onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 10000);
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
          Request Submitted! 🎉
        </h2>
        <p style={{ margin: "0 0 6px", fontSize: 14, color: "#4b5563", lineHeight: 1.65, animation: "floatUp 0.4s ease 0.25s both" }}>
          You've successfully requested this offer
        </p>
        <p style={{ margin: "0 0 24px", fontSize: 13, color: "#9ca3af", lineHeight: 1.6, animation: "floatUp 0.4s ease 0.35s both" }}>
          Keep an eye out — we have exciting offers dropping soon. Don't miss your chance to grab them! 👀
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
          Explore More Offers 🚀
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
   NOTIFY SUCCESS POPUP (for "Notify Me" on upcoming offers)
   ========================================================= */
function NotifySuccessPopup({ onClose }) {
  useEffect(() => {
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
   SINGLE SUPER DEAL CARD (extracted so each card can hold
   its own notify-me state)
   ========================================================= */
function SuperDealCard({
  item,
  isAuthenticated,
  userLocation,
  locationError,
  locationDenied,
  requestLocation,
  onUnlockOffer,
  onLoginRequired,
  onRequestOffer,
  onNotifySuccess,
  viewMode,
  isMobile,
}) {
  const dispatch = useDispatch();
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notified, setNotified] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const now       = new Date();
  const startTime = item.OfferStartTime ? new Date(item.OfferStartTime) : null;
  const endTime   = item.OfferEndTime   ? new Date(item.OfferEndTime)   : null;

  const isExpired  = endTime   ? now > endTime   : false;
  const isUpcoming = startTime ? now < startTime : false;
  const isActive   = !isExpired && !isUpcoming;

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

  const handleWishlist = (e) => {
    e.stopPropagation();
    setWishlisted(!wishlisted);
    toast.success(!wishlisted ? 'Added to Wishlist! ❤️' : 'Removed from Wishlist! 🤍');
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/superDeal` : '';
    const shareData = {
      title: item.ProductName || 'Super Deal',
      text: `Check out this super deal: ${item.ProductName}!`,
      url: shareUrl
    };
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch((err) => console.log(err));
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Deal link copied to clipboard! 📋');
    }
  };

  const isList = viewMode === 'list' && !isMobile;

  return (
    <div
      key={item.Productid}
      onClick={() => isActive && onUnlockOffer(item)}
      style={{
        display: "flex",
        flexDirection: isList ? "row" : "column",
        background: "#ffffff",
        borderRadius: 20,
        border: "1px solid #f0f0f0",
        boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
        cursor: !isActive ? "not-allowed" : "pointer",
        opacity: !isActive ? 0.85 : 1,
        position: "relative",
        overflow: "hidden",
        maxWidth: isList ? "100%" : "440px",
        width: "100%",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        if (isActive) {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.04)";
      }}
    >
      {/* Banner Image */}
      <div style={{
        width: isList ? "300px" : "100%",
        height: "auto",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0
      }}>
        <img
          src={item.Imageurl}
          alt={item.ProductName}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            filter: !isActive ? "grayscale(40%)" : "none",
            transition: "transform 0.4s ease",
          }}
          onMouseEnter={(e) => { if (isActive) e.currentTarget.style.transform = "scale(1.04)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        />
      </div>

      {/* Content container */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        
        {/* Distance badge row */}
        <DistanceBadge
          productLat={item.Latitude}
          productLng={item.Longitude}
          apiKilometer={item.Kilometer}
          userLocation={userLocation}
          locationError={locationError}
          locationDenied={locationDenied}
          requestLocation={requestLocation}
        />

        {/* Core body */}
        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 12, flex: 1, justifyContent: "center" }}>
          
          {/* Countdown badge */}
          <CountdownBadge
            offerStartTime={item.OfferStartTime}
            offerEndTime={item.OfferEndTime}
          />

          {/* Action row (Like, Dislike, CTA) */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <LikeDislikeButtons
              productId={item.Productid}
              isAuthenticated={isAuthenticated}
              onLoginRequired={onLoginRequired}
            />

            {/* CTA Button Slot */}
            {isExpired ? (
              <button
                onClick={(e) => { e.stopPropagation(); onRequestOffer(item); }}
                style={{
                  flex: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 16px",
                  borderRadius: 14,
                  border: "1px solid #fecdd3",
                  background: "#fff1f2",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "#be123c",
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#fecdd3"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#fff1f2"}
              >
                <Bell style={{ width: 15, height: 15 }} />
                <span>Request This Offer Again</span>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#be123c",
                  color: "#ffffff",
                  marginLeft: "auto",
                  flexShrink: 0
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </button>
            ) : isUpcoming ? (
              <button
                onClick={handleNotify}
                disabled={notifyLoading || notified}
                style={{
                  flex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: notified ? "1px solid #86efac" : "1px solid #fbcfe8",
                  background: notified ? "#e8f5e9" : "#fff0f5",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: notifyLoading || notified ? "not-allowed" : "pointer",
                  color: notified ? "#16a34a" : "#be185d",
                  transition: "all 0.2s ease",
                }}
              >
                <span>{notifyLoading ? "..." : notified ? "✓ Notified" : "🔔 Notify"}</span>
              </button>
            ) : (
              <button
                disabled={!isActive}
                style={{
                  flex: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #86efac",
                  background: "#e8f5e9",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "#15803d",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#c8e6c9"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#e8f5e9"}
              >
                <Store style={{ width: 15, height: 15 }} />
                <span>Go to Store</span>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#15803d",
                  color: "#ffffff",
                  marginLeft: "auto"
                }}>
                  <ArrowRight style={{ width: 10, height: 10 }} />
                </span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */
export default function SuperDeal() {
  const dispatch = useDispatch();

  const [mounted, setMounted]                       = useState(false);
  const [selectedProduct, setSelectedProduct]       = useState(null);
  const [couponCode, setCouponCode]                 = useState(null);
  const [currentBanner, setCurrentBanner]           = useState(0);
  const [showLogin, setShowLogin]                   = useState(false);
  const [isBannerPaused, setIsBannerPaused]         = useState(false);
  const [showRequestSuccess, setShowRequestSuccess] = useState(false);
  const [showNotifyPopup, setShowNotifyPopup]       = useState(false);

  // Redesign state variables
  const [sortBy, setSortBy]                         = useState("Ending Soon");
  const [viewMode, setViewMode]                     = useState("grid");
  const [isMobile, setIsMobile]                     = useState(false);

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
    superDealBillboards,
    superDealLoading,
    superDealError,
    superDealBanner,
  } = useSelector((state) => state.billboards);

  const isAuthenticated  = useSelector(selectIsAuthenticated);
  const selectedLocation = useSelector(selectSelectedLocation);
  const locationData     = useSelector((state) => state?.products?.productOffer);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!selectedLocation?.LocationId) return;
    dispatch(fetchSuperDeals({ LocationId: String(selectedLocation.LocationId) }));
  }, [selectedLocation, dispatch]);

  useEffect(() => {
    if (!mounted || !superDealBanner?.length || isBannerPaused) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) =>
        prev === superDealBanner.length - 1 ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [mounted, superDealBanner, isBannerPaused]);

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
        .catch((err) => console.error("Offer API failed:", err));
    } else {
      setShowLogin(true);
    }
  };

  const handleRequestOffer = (product) => {
    if (!isAuthenticated) { setShowLogin(true); return; }
    dispatch(requestExpiredOffer({ Productid: product.Productid }))
      .unwrap()
      .then(() => setShowRequestSuccess(true))
      .catch((err) => console.error("Request offer failed:", err));
  };

  if (!mounted || superDealLoading) {
    return (
      <div style={{ width: "100%", marginTop: 80, padding: 20 }}>
        <div className="skeleton" style={{ width: "100%", height: 380, borderRadius: 24, marginBottom: 40 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ padding: 16, borderRadius: 16, background: "#fff" }}>
              <div className="skeleton" style={{ height: 180 }} />
              <div className="skeleton" style={{ height: 20, marginTop: 12 }} />
              <div className="skeleton" style={{ height: 16, marginTop: 8, width: "70%" }} />
              <div className="skeleton" style={{ height: 30, marginTop: 16, width: "40%" }} />
              <div className="skeleton" style={{ height: 40, marginTop: 16 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (superDealError) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "red" }}>
        {superDealError}
      </div>
    );
  }

  const getSortedDeals = () => {
    let deals = [...(superDealBillboards || [])];
    
    const dealsWithDistance = deals.map(deal => {
      let distance = Infinity;
      if (userLocation && deal.Latitude && deal.Longitude) {
        distance = haversineDistance(userLocation.lat, userLocation.lng, deal.Latitude, deal.Longitude);
      } else if (deal.Kilometer !== undefined && deal.Kilometer !== null) {
        distance = Number(deal.Kilometer);
      }
      return { ...deal, Kilometer: distance };
    });

    if (sortBy === "Ending Soon") {
      dealsWithDistance.sort((a, b) => {
        const aTime = a.OfferEndTime ? new Date(a.OfferEndTime).getTime() : Infinity;
        const bTime = b.OfferEndTime ? new Date(b.OfferEndTime).getTime() : Infinity;
        return aTime - bTime;
      });
    } else if (sortBy === "Distance: Low to High") {
      dealsWithDistance.sort((a, b) => {
        const aDist = a.Kilometer !== undefined ? a.Kilometer : Infinity;
        const bDist = b.Kilometer !== undefined ? b.Kilometer : Infinity;
        return aDist - bDist;
      });
    }
    
    return dealsWithDistance;
  };

  const sorted = getSortedDeals();

  return (
    <div style={{ width: "100%", background: "#f9fafb", minHeight: "100vh", paddingTop: 90, paddingBottom: 40 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 20px" }}>

        {/* ===================== BANNER CAROUSEL ===================== */}
        {superDealBanner?.length > 0 && (
          <div
            style={{ position: "relative", overflow: "hidden", borderRadius: 24, marginBottom: 40, cursor: "pointer" }}
            onMouseEnter={() => setIsBannerPaused(true)}
            onMouseLeave={() => setIsBannerPaused(false)}
          >
            <div style={{
              display: "flex",
              transform: `translateX(-${currentBanner * 100}%)`,
              transition: "transform 0.7s ease-in-out",
            }}>
              {superDealBanner.map((banner, index) => {
                const bannerProduct = {
                  Productid:      banner.Productid || banner.id || `banner-${index}`,
                  ProductName:    banner.ProductName || banner.title || "Special Offer",
                  Storeid:        banner.Storeid || banner.storeId || locationData?.Storeid,
                  Imageurl:       banner.Imageurl || banner.image,
                  Price:          banner.Price,
                  Finalprice:     banner.Finalprice,
                  Brand:          banner.Brand,
                  Type:           banner.Type,
                  OfferStartTime: banner.OfferStartTime,
                  OfferEndTime:   banner.OfferEndTime,
                  Latitude:       banner.Latitude,
                  Longitude:      banner.Longitude,
                };
                return (
                  <div
                    key={index}
                    style={{ minWidth: "100%", height: 380, position: "relative" }}
                    onClick={() => handleUnlockOffer(bannerProduct)}
                  >
                    <img
                      src={banner.Imageurl || banner.image}
                      alt={banner.ProductName || banner.title || "Super Deal Banner"}
                      style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
                    />
                    <div
                      style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.3s ease", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 24 }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.15)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0)")}
                    >
                      <span style={{ background: "rgba(0,0,0,0.75)", color: "#fff", padding: "8px 20px", borderRadius: 24, fontSize: 13, fontWeight: 600 }}>
                        🔓 Tap to Unlock Offer
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 10 }}>
              {superDealBanner.map((_, i) => (
                <span
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentBanner(i); }}
                  style={{
                    width: 10, height: 10, borderRadius: "50%", cursor: "pointer",
                    background: currentBanner === i ? "#fff" : "rgba(255,255,255,0.6)",
                    border: "2px solid rgba(255,255,255,0.8)", transition: "all 0.2s ease",
                  }}
                />
              ))}
            </div>
          </div>
        )}



        {/* ===================== EMPTY STATE ===================== */}
        {sorted.length === 0 && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "80px 24px",
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 60%, #f0fdf4 100%)",
            borderRadius: 24, border: "1.5px dashed #86efac", textAlign: "center", minHeight: 340,
          }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg, #bbf7d0, #86efac)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, boxShadow: "0 8px 32px rgba(34,197,94,0.18)" }}>
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#14532d", margin: "0 0 10px" }}>No Super Deals Available</h2>
            <p style={{ fontSize: 15, color: "#4b7c5e", maxWidth: 380, lineHeight: 1.7, margin: "0 0 28px" }}>
              We couldn't find any active super deals for your selected location. Switch to a nearby area — great offers might be just around the corner!
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#ffffff", border: "1px solid #bbf7d0", borderRadius: 999, padding: "10px 22px", fontSize: 13, fontWeight: 600, color: "#16a34a", boxShadow: "0 2px 10px rgba(34,197,94,0.10)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
          <div style={{
            display: viewMode === "list" && !isMobile ? "flex" : "grid",
            flexDirection: viewMode === "list" && !isMobile ? "column" : "unset",
            gridTemplateColumns: viewMode === "list" && !isMobile ? "unset" : isMobile ? "1fr" : "repeat(3, 1fr)",
            gridAutoRows: "1fr",
            justifyItems: "center",
            gap: 24
          }}>
            {sorted.map((item) => (
              <SuperDealCard
                key={item.Productid}
                item={item}
                isAuthenticated={isAuthenticated}
                userLocation={userLocation}
                locationError={locationError}
                locationDenied={locationDenied}
                requestLocation={requestLocation}
                onUnlockOffer={handleUnlockOffer}
                onLoginRequired={() => setShowLogin(true)}
                onRequestOffer={handleRequestOffer}
                onNotifySuccess={() => setShowNotifyPopup(true)}
                viewMode={viewMode}
                isMobile={isMobile}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===================== MODALS ===================== */}
      <UnlockOfferModal
        product={selectedProduct}
        couponCode={couponCode}
        onClose={() => { setSelectedProduct(null); setCouponCode(null); }}
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
                .then((res) => { setCouponCode(res?.data?.[0]); })
                .catch((err) => console.error("Offer API failed:", err));
            }
          }}
        />
      )}

      {showRequestSuccess && (
        <RequestOfferSuccessPopup onClose={() => setShowRequestSuccess(false)} />
      )}

      {/* ===================== NOTIFY SUCCESS POPUP ===================== */}
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