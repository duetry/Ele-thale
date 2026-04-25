// import React, { useState, useRef } from 'react';
// import { Star, Award, Phone, Clock, Mail, MapPin } from 'lucide-react';

// export default function UnlockOfferModal({ product, onClose, couponCode }) {
//   const [showStoreInfo, setShowStoreInfo] = useState(false);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const storeInfoRef = useRef(null);

//   if (!product) return null;

//   const handleUnlock = () => {
//     setShowStoreInfo(true);
//     setShowConfetti(true);
    
//     setTimeout(() => {
//       if (storeInfoRef.current) {
//         storeInfoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       }
//     }, 100);

//     setTimeout(() => {
//       setShowConfetti(false);
//     }, 3000);
//   };

//   const handleClose = () => {
//     setShowStoreInfo(false);
//     setShowConfetti(false);
//     onClose();
//   };

//   const handleNavigate = () => {
//     window.open('https://maps.app.goo.gl/ZqRXMxnQYiGiTs9o7?g_st=am', '_blank');
//   };

//   const handlePhoneCall = () => {
//     window.location.href = 'tel:+919500736052';
//   };

//   const handleCopy = () => {
//     navigator.clipboard.writeText(couponCode?.couponCode || '');
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div 
//       onClick={handleClose}
//       style={{ 
//         position: 'fixed', 
//         top: 0, 
//         left: 0, 
//         right: 0, 
//         bottom: 0, 
//         background: 'rgba(0,0,0,0.75)', 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'center', 
//         zIndex: 1000, 
//         padding: '20px', 
//         backdropFilter: 'blur(8px)',
//         animation: 'fadeIn 0.2s ease-out'
//       }}>
      
//       {/* Confetti Effect */}
//       {showConfetti && (
//         <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
//           {[...Array(100)].map((_, i) => {
//             const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#FF1744', '#00E676', '#FFC107', '#E040FB'];
//             const size = Math.random() * 10 + 5;
//             const angle = (Math.random() - 0.5) * 160;
//             const distance = 300 + Math.random() * 200;
//             const duration = 1.5 + Math.random() * 0.8;
            
//             return (
//               <div
//                 key={i}
//                 style={{
//                   position: 'absolute',
//                   width: `${size}px`,
//                   height: `${size}px`,
//                   background: colors[i % colors.length],
//                   top: '50%',
//                   left: '50%',
//                   borderRadius: Math.random() > 0.5 ? '50%' : '2px',
//                   animation: `confettiBurst ${duration}s ease-out forwards`,
//                   opacity: 0,
//                   transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
//                   '--angle': `${angle}deg`,
//                   '--distance': `${distance}px`,
//                   '--rotation': `${Math.random() * 720 - 360}deg`
//                 }}
//               />
//             );
//           })}
//         </div>
//       )}
      
//       <div 
//         onClick={(e) => e.stopPropagation()}
//         style={{ 
//           background: 'white', 
//           borderRadius: '24px', 
//           maxWidth: '480px', 
//           width: '100%', 
//           maxHeight: '90vh', 
//           overflow: 'auto', 
//           boxShadow: '0 25px 80px rgba(0,0,0,0.4)', 
//           animation: 'modalBounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
//           position: 'relative'
//         }}>
        
//         {/* Close Button */}
//         <button 
//           onClick={handleClose}
//           style={{ 
//             position: 'absolute', 
//             top: '16px', 
//             right: '16px', 
//             width: '40px', 
//             height: '40px', 
//             borderRadius: '50%', 
//             background: 'rgba(0,0,0,0.7)', 
//             border: 'none', 
//             color: 'white',
//             fontSize: '24px', 
//             cursor: 'pointer', 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'center', 
//             backdropFilter: 'blur(10px)',
//             zIndex: 10,
//             transition: 'all 0.2s',
//             fontWeight: '300'
//           }}
//           onMouseEnter={(e) => {
//             e.target.style.transform = 'scale(1.1) rotate(90deg)';
//             e.target.style.background = 'rgba(239, 68, 68, 0.9)';
//           }}
//           onMouseLeave={(e) => {
//             e.target.style.transform = 'scale(1) rotate(0deg)';
//             e.target.style.background = 'rgba(0,0,0,0.7)';
//           }}
//         >
//           ×
//         </button>

//         {/* Product Image with Gradient Overlay */}
//         <div style={{ position: 'relative', height: '200px', overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
//           <img 
//             src={product.Imageurl} 
//             alt={product.Name}
//             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//           />
//           <div style={{ 
//             position: 'absolute', 
//             top: 0, 
//             left: 0, 
//             right: 0, 
//             bottom: 0, 
//             background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)' 
//           }} />
//           <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px' }}>
//             <div style={{ color: 'white', fontSize: '22px', fontWeight: '700', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
//               {product.Name}
//             </div>
//             <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
//               <Star size={14} fill="#FCD34D" color="#FCD34D" />
//               <span style={{ fontWeight: '600' }}>{product.Rating}</span>
//               <span style={{ opacity: 0.8 }}>• {product.StoreName}</span>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div style={{ padding: '24px' }}>
          
//           {/* Exclusive Coupon Card */}
//           <div style={{ 
//             background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)', 
//             padding: '24px', 
//             borderRadius: '16px', 
//             marginBottom: '24px', 
//             boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
//             position: 'relative',
//             overflow: 'hidden'
//           }}>
//             {/* Decorative circles */}
//             <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
//             <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            
//             <div style={{ position: 'relative', zIndex: 1 }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
//                 <div style={{ background: 'rgba(255,255,255,0.3)', padding: '8px', borderRadius: '12px' }}>
//                   <Award size={24} color="white" />
//                 </div>
//                 <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>
//                   Exclusive Offer! 🎉
//                 </div>
//               </div>
              
//               <div style={{ 
//                 background: 'white', 
//                 padding: '16px', 
//                 borderRadius: '12px', 
//                 marginBottom: '16px',
//                 boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
//               }}>
//                 <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '8px', fontWeight: '600', letterSpacing: '0.5px' }}>
//                   YOUR COUPON CODE
//                 </div>
//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
//                   <div style={{ 
//                     fontFamily: 'monospace', 
//                     fontSize: '24px', 
//                     fontWeight: '700', 
//                     color: '#1F2937', 
//                     letterSpacing: '3px'
//                   }}>
//                     {couponCode?.couponCode || 'SAVE50'}
//                   </div>
//                   <button 
//                     onClick={handleCopy}
//                     style={{ 
//                       padding: '10px 18px', 
//                       background: copied ? '#10B981' : '#1F2937', 
//                       color: 'white', 
//                       border: 'none', 
//                       borderRadius: '8px', 
//                       fontSize: '13px', 
//                       fontWeight: '600', 
//                       cursor: 'pointer',
//                       transition: 'all 0.2s',
//                       minWidth: '70px'
//                     }}
//                     onMouseEnter={(e) => !copied && (e.target.style.background = '#374151')}
//                     onMouseLeave={(e) => !copied && (e.target.style.background = '#1F2937')}
//                   >
//                     {copied ? '✓ Copied' : 'Copy'}
//                   </button>
//                 </div>
//               </div>

//               <div style={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 justifyContent: 'space-between',
//                 color: 'white'
//               }}>
//                 <div>
//                   <div style={{ fontSize: '32px', fontWeight: '800' }}>
//                     ₹{product.Discount} OFF
//                   </div>
//                   <div style={{ fontSize: '14px', opacity: 0.9 }}>
//                     Save ₹{product?.Discount} instantly!
//                   </div>
//                 </div>
//                 <div style={{ fontSize: '48px' }}>🎁</div>
//               </div>
//             </div>
//           </div>

//           {/* Product Description */}
//           <div style={{ marginBottom: '20px' }}>
//             <div style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.6' }}>
//               {product.Description}
//             </div>
//           </div>

//           {/* Price Section */}
//           <div style={{ 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'space-between',
//             padding: '16px',
//             background: '#F9FAFB',
//             borderRadius: '12px',
//             marginBottom: '20px'
//           }}>
//             <div>
//               <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Final Price</div>
//               <div style={{ fontSize: '32px', fontWeight: '800', color: '#1F2937' }}>
//                 ₹{product.Finalprice.toFixed(2)}
//               </div>
//             </div>
//             {product.Discount > 0 && (
//               <div style={{ textAlign: 'right' }}>
//                 <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Original Price</div>
//                 <div style={{ fontSize: '20px', color: '#9CA3AF', textDecoration: 'line-through' }}>
//                   ₹{product.Price.toFixed(2)}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Unlock Button */}
//           <button 
//             onClick={handleUnlock}
//             disabled={showStoreInfo}
//             style={{ 
//               width: '100%', 
//               padding: '16px', 
//               background: showStoreInfo ? '#9CA3AF' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)', 
//               color: 'white', 
//               border: 'none', 
//               borderRadius: '14px', 
//               fontSize: '17px', 
//               fontWeight: '700', 
//               cursor: showStoreInfo ? 'not-allowed' : 'pointer', 
//               boxShadow: showStoreInfo ? 'none' : '0 8px 20px rgba(16, 185, 129, 0.4)', 
//               transition: 'all 0.3s',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: '8px'
//             }}
//             onMouseEnter={(e) => !showStoreInfo && (e.target.style.transform = 'translateY(-2px)')}
//             onMouseLeave={(e) => !showStoreInfo && (e.target.style.transform = 'translateY(0)')}
//           >
//             {showStoreInfo ? '✓ Offer Unlocked!' : '🎁 Unlock Store Details'}
//           </button>

//           {/* Store Information */}
//           {showStoreInfo && (
//             <div 
//               ref={storeInfoRef} 
//               style={{ 
//                 marginTop: '24px', 
//                 padding: '24px', 
//                 background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', 
//                 borderRadius: '16px', 
//                 border: '2px solid #BAE6FD',
//                 animation: 'slideDown 0.5s ease-out'
//               }}>
              
//               {/* Store Image */}
//               <div style={{ 
//                 marginBottom: '20px', 
//                 borderRadius: '12px', 
//                 overflow: 'hidden', 
//                 height: '160px', 
//                 boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
//               }}>
//                 <img 
//                   src="/store.webp" 
//                   alt="Store"
//                   style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=160&fit=crop';
//                   }}
//                 />
//               </div>
              
//               <h3 style={{ 
//                 fontSize: '20px', 
//                 fontWeight: '700', 
//                 color: '#1F2937', 
//                 marginBottom: '20px', 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 gap: '8px' 
//               }}>
//                 <MapPin size={20} color="#0EA5E9" />
//                 Store Information
//               </h3>

//               {/* Store Name */}
//               <div style={{ 
//                 fontSize: '18px', 
//                 fontWeight: '600', 
//                 color: '#1F2937', 
//                 marginBottom: '16px',
//                 padding: '12px',
//                 background: 'white',
//                 borderRadius: '10px'
//               }}>
//                 {product.StoreName}
//               </div>

//               {/* Contact Info with clickable phone */}
//               <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
//                 <button
//                   onClick={handlePhoneCall}
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '12px',
//                     padding: '14px',
//                     background: 'white',
//                     border: '2px solid #10B981',
//                     borderRadius: '10px',
//                     fontSize: '15px',
//                     color: '#1F2937',
//                     cursor: 'pointer',
//                     transition: 'all 0.2s',
//                     fontWeight: '500'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.background = '#10B981';
//                     e.target.style.color = 'white';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.background = 'white';
//                     e.target.style.color = '#1F2937';
//                   }}
//                 >
//                   <Phone size={18} />
//                   <span>+91 9500736052</span>
//                 </button>
                
//                 <div style={{ 
//                   display: 'flex', 
//                   alignItems: 'center', 
//                   gap: '12px',
//                   padding: '14px',
//                   background: 'white',
//                   borderRadius: '10px',
//                   fontSize: '14px',
//                   color: '#4B5563'
//                 }}>
//                   <Clock size={18} color="#F59E0B" />
//                   <span>9:00 AM - 9:00 PM</span>
//                 </div>
                
//                 <div style={{ 
//                   display: 'flex', 
//                   alignItems: 'center', 
//                   gap: '12px',
//                   padding: '14px',
//                   background: 'white',
//                   borderRadius: '10px',
//                   fontSize: '14px',
//                   color: '#4B5563'
//                 }}>
//                   <Mail size={18} color="#0EA5E9" />
//                   <span>ramarajandft@gmail.com.com</span>
//                 </div>
//               </div>

//               {/* Location */}
//               <div style={{ marginBottom: '16px' }}>
//                 <div style={{ 
//                   fontSize: '14px', 
//                   fontWeight: '600', 
//                   color: '#1F2937', 
//                   marginBottom: '10px' 
//                 }}>
//                   📍 Location
//                 </div>
//                 <div style={{ 
//                   background: 'white', 
//                   padding: '14px', 
//                   borderRadius: '10px', 
//                   fontSize: '14px', 
//                   color: '#4B5563',
//                   lineHeight: '1.6',
//                   marginBottom: '12px'
//                 }}>
//                   JC69+477, Veerachi S St, Manapparai,<br/>
//                   Tamil Nadu 621307
//                 </div>
                
//                 <button 
//                   onClick={handleNavigate}
//                   style={{ 
//                     width: '100%', 
//                     padding: '14px', 
//                     background: '#4285F4', 
//                     color: 'white', 
//                     border: 'none', 
//                     borderRadius: '10px', 
//                     fontSize: '15px', 
//                     fontWeight: '600', 
//                     cursor: 'pointer', 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     justifyContent: 'center', 
//                     gap: '8px', 
//                     transition: 'all 0.2s',
//                     boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.background = '#3367D6';
//                     e.target.style.transform = 'translateY(-2px)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.background = '#4285F4';
//                     e.target.style.transform = 'translateY(0)';
//                   }}
//                 >
//                   🗺️ Navigate with Google Maps
//                 </button>
//               </div>

//               {/* Active Offer Badge */}
//               <div style={{ 
//                 background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)', 
//                 padding: '16px', 
//                 borderRadius: '10px', 
//                 border: '2px solid #6EE7B7',
//                 textAlign: 'center'
//               }}>
//                 <div style={{ 
//                   fontSize: '14px', 
//                   fontWeight: '700', 
//                   color: '#065F46', 
//                   marginBottom: '4px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   gap: '6px'
//                 }}>
//                   ✅ Offer Active Now!
//                 </div>
//                 <div style={{ fontSize: '13px', color: '#047857' }}>
//                   Show this coupon at checkout to claim your discount
//                 </div>
//               </div>

//             </div>
//           )}
//         </div>
//       </div>

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }

//         @keyframes modalBounceIn {
//           0% {
//             opacity: 0;
//             transform: scale(0.8) translateY(50px);
//           }
//           50% {
//             transform: scale(1.05) translateY(-10px);
//           }
//           100% {
//             opacity: 1;
//             transform: scale(1) translateY(0);
//           }
//         }
        
//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes confettiBurst {
//           0% {
//             opacity: 1;
//             transform: translate(-50%, -50%) rotate(0deg);
//           }
//           100% {
//             opacity: 0;
//             transform: translate(
//               calc(-50% + var(--distance) * cos(var(--angle))), 
//               calc(-50% - var(--distance) * sin(var(--angle)))
//             ) rotate(var(--rotation));
//           }
//         }

//         @media (max-width: 640px) {
//           div[style*="maxWidth: '480px'"] {
//             margin: 10px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// import React, { useRef } from 'react';
// import { Phone, Clock, Mail, MapPin } from 'lucide-react';

// export default function UnlockOfferModal({ product, couponCode, onClose }) {
//   const storeInfoRef = useRef(null);

//   console.log('product', product);
//   console.log('couponCode', couponCode);

//   const handleNavigate = () => {
//     window.open(
//       couponCode?.StoreLocation ||
//         'https://maps.app.goo.gl/ZqRXMxnQYiGiTs9o7?g_st=am',
//       '_blank'
//     );
//   };

//   const handlePhoneCall = () => {
//     window.location.href = `tel:${
//       couponCode?.Phoneno || '+919500736052'
//     }`;
//   };

//   const handleClose = (e) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   if (!product) return null;

//   return (
//     <div
//       onClick={handleClose}
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         background: 'rgba(0,0,0,0.75)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         zIndex: 1000,
//         padding: '20px',
//         backdropFilter: 'blur(8px)',
//         animation: 'fadeIn 0.2s ease-out',
//       }}
//     >
//       <div
//         onClick={(e) => e.stopPropagation()}
//         style={{
//           background: 'white',
//           borderRadius: '24px',
//           maxWidth: '480px',
//           width: '100%',
//           maxHeight: '90vh',
//           overflow: 'auto',
//           boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
//           animation:
//             'modalBounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
//           position: 'relative',
//         }}
//       >
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           style={{
//             position: 'absolute',
//             top: '16px',
//             right: '16px',
//             width: '40px',
//             height: '40px',
//             borderRadius: '50%',
//             background: 'rgba(0,0,0,0.7)',
//             border: 'none',
//             color: 'white',
//             fontSize: '24px',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             backdropFilter: 'blur(10px)',
//             zIndex: 10,
//             transition: 'all 0.2s',
//             fontWeight: '300',
//           }}
//         >
//           ×
//         </button>

//         {/* Store Info */}
//         <div
//           ref={storeInfoRef}
//           style={{
//             padding: '24px',
//             background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
//             borderRadius: '16px',
//             border: '2px solid #BAE6FD',
//             margin: '24px',
//             animation: 'slideDown 0.5s ease-out',
//           }}
//         >
//           {/* Store Image */}
//           <div
//             style={{
//               marginBottom: '20px',
//               borderRadius: '12px',
//               overflow: 'hidden',
//               height: '160px',
//               boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//             }}
//           >
//             <img
//               src={
//                 couponCode?.Imageurl ||
//                 product?.Imageurl ||
//                 '/store.webp'
//               }
//               alt="Store"
//               style={{
//                 width: '100%',
//                 height: '100%',
//                 objectFit: 'cover',
//               }}
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src =
//                   'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=160&fit=crop';
//               }}
//             />
//           </div>

//           <h3
//             style={{
//               fontSize: '20px',
//               fontWeight: '700',
//               color: '#1F2937',
//               marginBottom: '20px',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px',
//             }}
//           >
//             <MapPin size={20} color="#0EA5E9" />
//             Store Information
//           </h3>
//   <div style={{ marginBottom: '16px' }}>
//             <div
//               style={{
//                 fontSize: '14px',
//                 fontWeight: '600',
//                 color: '#1F2937',
//                 marginBottom: '10px',
//               }}
//             >
//               📍 Location
//             </div>

//             <div
//               style={{
//                 background: 'white',
//                 padding: '14px',
//                 borderRadius: '10px',
//                 fontSize: '14px',
//                 color: '#4B5563',
//                 lineHeight: '1.6',
//                 marginBottom: '12px',
//               }}
//             >
//               {couponCode?.Storeaddress || (
//                 <>
//                   JC69+477, Veerachi S St, Manapparai,
//                   <br />
//                   Tamil Nadu 621307
//                 </>
//               )}
//             </div>

//             <button
//               onClick={handleNavigate}
//               style={{
//                 width: '100%',
//                 padding: '14px',
//                 background: '#4285F4',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '10px',
//                 fontSize: '15px',
//                 fontWeight: '600',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 gap: '8px',
//                 transition: 'all 0.2s',
//                 boxShadow:
//                   '0 4px 12px rgba(66, 133, 244, 0.3)',
//               }}
//             >
//               🗺️ Navigate with Google Maps
//             </button>
//           </div>

//           {/* Store Name */}
//           <div
//             style={{
//               fontSize: '18px',
//               fontWeight: '600',
//               color: '#1F2937',
//               marginBottom: '16px',
//               padding: '12px',
//               background: 'white',
//               borderRadius: '10px',
//             }}
//           >
//             {couponCode?.Storename || product?.Brand || 'Store'}
//           </div>

//           {/* Contact Info */}
//           <div
//             style={{
//               marginBottom: '20px',
//               display: 'flex',
//               flexDirection: 'column',
//               gap: '12px',
//             }}
//           >
//             <button
//               onClick={handlePhoneCall}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '12px',
//                 padding: '14px',
//                 background: 'white',
//                 border: '2px solid #10B981',
//                 borderRadius: '10px',
//                 fontSize: '15px',
//                 color: '#1F2937',
//                 cursor: 'pointer',
//                 transition: 'all 0.2s',
//                 fontWeight: '500',
//               }}
//             >
//               <Phone size={18} />
//               <span>
//                 {couponCode?.Phoneno || '+91 9500736052'}
//               </span>
//             </button>

//             <div
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '12px',
//                 padding: '14px',
//                 background: 'white',
//                 borderRadius: '10px',
//                 fontSize: '14px',
//                 color: '#4B5563',
//               }}
//             >
//               <Clock size={18} color="#F59E0B" />
//               <span>9:00 AM - 9:00 PM</span>
//             </div>

//             <div
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '12px',
//                 padding: '14px',
//                 background: 'white',
//                 borderRadius: '10px',
//                 fontSize: '14px',
//                 color: '#4B5563',
//               }}
//             >
//               <Mail size={18} color="#0EA5E9" />
//               <span>
//                 {couponCode?.Email ||
//                   'ramarajandft@gmail.com'}
//               </span>
//             </div>
//           </div>

//           {/* Location */}
        
        
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useRef, useState, useEffect } from 'react';
import { Phone, Clock, Mail, MapPin, Tag, Loader } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { unlockCoupon } from '@/app/features/adminPanel/adminPanelSlice';

/* ─────────────────────────────────────────────
   POPPER CANVAS — full-screen confetti burst
   ───────────────────────────────────────────── */
function PopperCanvas({ originRef, active, onDone }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    // Burst from the centre of the trigger button
    let ox = canvas.width  / 2;
    let oy = canvas.height / 2;
    if (originRef?.current) {
      const r = originRef.current.getBoundingClientRect();
      ox = r.left + r.width  / 2;
      oy = r.top  + r.height / 2;
    }

    const COLORS = ['#FF6B9D','#FF922B','#FFD43B','#69DB7C','#74C0FC','#E599F7','#FF8787','#63E6BE','#FFA94D'];
    const SHAPES = ['circle', 'rect', 'triangle'];

    const particles = Array.from({ length: 100 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 7 + Math.random() * 11;
      return {
        x: ox, y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (5 + Math.random() * 5),
        gravity: 0.38,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.013,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.28,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 5 + Math.random() * 9,
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (const p of particles) {
        if (p.alpha <= 0) continue;
        alive = true;

        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.alpha       -= p.decay;
        p.rotation    += p.rotationSpeed;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle   = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      if (alive) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onDone?.();
      }
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */
export default function UnlockOfferModal({ product, couponCode, onClose }) {
  const storeInfoRef  = useRef(null);
  const unlockBtnRef  = useRef(null);        // 👈 ref for popper origin
  const dispatch      = useDispatch();

  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockedData,  setUnlockedData]  = useState(null);
  const [unlockError,   setUnlockError]   = useState(null);
  const [popperActive,  setPopperActive]  = useState(false); // 👈 confetti trigger
  const [buttonPop,     setButtonPop]     = useState(false); // 👈 button scale pulse

  // Reset local state whenever a new product/coupon is shown
  useEffect(() => {
    setUnlockedData(null);
    setUnlockError(null);
    setUnlockLoading(false);
    setPopperActive(false);
  }, [product?.Productid, couponCode?.CouponCode]);

  const handleNavigate = () => {
    window.open(
      couponCode?.StoreLocation || 'https://maps.app.goo.gl/ZqRXMxnQYiGiTs9o7?g_st=am',
      '_blank'
    );
  };

  const handlePhoneCall = () => {
    window.location.href = `tel:${couponCode?.Phoneno || '+919500736052'}`;
  };

  const handleClose = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleUnlock = async () => {
    if (!product?.Productid) return;

    // 🎉 Fire popper + button pulse
    setButtonPop(true);
    setPopperActive(true);
    setTimeout(() => setButtonPop(false), 300);

    setUnlockLoading(true);
    setUnlockError(null);
    try {
      const result = await dispatch(
        unlockCoupon({ productId: product.Productid })
      ).unwrap();
      setUnlockedData(result);
    } catch (err) {
      setUnlockError(err || 'Failed to unlock coupon');
    } finally {
      setUnlockLoading(false);
    }
  };

  if (!product) return null;

  return (
    <>
      {/* 🎉 Confetti canvas — sits above everything */}
      <PopperCanvas
        originRef={unlockBtnRef}
        active={popperActive}
        onDone={() => setPopperActive(false)}
      />

      <div
        onClick={handleClose}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'white', borderRadius: '24px',
            maxWidth: '480px', width: '100%', maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
            animation: 'modalBounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            position: 'relative',
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.7)', border: 'none',
              color: 'white', fontSize: '24px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(10px)', zIndex: 10,
              transition: 'all 0.2s', fontWeight: '300',
            }}
          >
            ×
          </button>

          {/* Store Card */}
          <div
            ref={storeInfoRef}
            style={{
              padding: '24px',
              background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
              borderRadius: '16px', border: '2px solid #BAE6FD',
              margin: '24px',
              animation: 'slideDown 0.5s ease-out',
            }}
          >
            {/* Store Image */}
            <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', height: '160px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <img
                src={couponCode?.Imageurl || product?.Imageurl || '/store.webp'}
                alt="Store"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=160&fit=crop';
                }}
              />
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1F2937', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} color="#0EA5E9" />
              Store Information
            </h3>

            {/* Store Name */}
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '16px', padding: '12px', background: 'white', borderRadius: '10px' }}>
              {couponCode?.Storename || product?.Brand || 'Store'}
            </div>

            {/* Contact Info */}
            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={handlePhoneCall}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px', background: 'white',
                  border: '2px solid #10B981', borderRadius: '10px',
                  fontSize: '15px', color: '#1F2937', cursor: 'pointer',
                  transition: 'all 0.2s', fontWeight: '500',
                }}
              >
                <Phone size={18} />
                <span>{couponCode?.Phoneno || '+91 9500736052'}</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: 'white', borderRadius: '10px', fontSize: '14px', color: '#4B5563' }}>
                <Clock size={18} color="#F59E0B" />
               <span>
  {couponCode?.StoreTime ||
    `${couponCode?.StartTime} - ${couponCode?.EndTime}` ||
    'N/A'}
</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: 'white', borderRadius: '10px', fontSize: '14px', color: '#4B5563' }}>
                <Mail size={18} color="#0EA5E9" />
                <span>{couponCode?.Email || 'ramarajandft@gmail.com'}</span>
              </div>
            </div>

            {/* Location */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937', marginBottom: '10px' }}>
                📍 Location
              </div>
              <div style={{ background: 'white', padding: '14px', borderRadius: '10px', fontSize: '14px', color: '#4B5563', lineHeight: '1.6', marginBottom: '12px' }}>
              {couponCode?.Storeaddress || 'Address not available'}
              </div>

              {/* ① MAP BUTTON — always visible */}
              <button
                onClick={handleNavigate}
                style={{
                  width: '100%', padding: '14px', background: '#4285F4',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#3367D6'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#4285F4'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                🗺️ Navigate with Google Maps
              </button>
            </div>

            {/* ── UNLOCK SECTION — below the map button ── */}
            <div style={{ borderTop: '1.5px dashed #BAE6FD', paddingTop: '20px' }}>
              {!unlockedData ? (
                <>
                  {/* ② UNLOCK BUTTON — below map */}
                  <button
                    ref={unlockBtnRef}
                    onClick={handleUnlock}
                    disabled={unlockLoading}
                    style={{
                      width: '100%', padding: '16px',
                      background: unlockLoading
                        ? '#9CA3AF'
                        : 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                      color: 'white', border: 'none', borderRadius: '12px',
                      fontSize: '16px', fontWeight: '700',
                      cursor: unlockLoading ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '10px', transition: 'transform 0.15s ease, box-shadow 0.2s ease',
                      boxShadow: unlockLoading ? 'none' : '0 4px 16px rgba(245,158,11,0.35)',
                      transform: buttonPop ? 'scale(0.96)' : 'scale(1)',
                      position: 'relative', overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => { if (!unlockLoading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { if (!unlockLoading) e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    {/* Ripple ring on click */}
                    {buttonPop && (
                      <span
                        style={{
                          position: 'absolute', top: '50%', left: '50%',
                          width: '10px', height: '10px',
                          background: 'rgba(255,255,255,0.55)',
                          borderRadius: '50%', pointerEvents: 'none',
                          animation: 'ripplePop 0.45s ease-out forwards',
                        }}
                      />
                    )}

                    {unlockLoading ? (
                      <>
                        <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        Unlocking…
                      </>
                    ) : (
                      <>🎟️ Unlock Coupon</>
                    )}
                  </button>

                  {unlockError && (
                    <p style={{ marginTop: '10px', fontSize: '13px', color: '#EF4444', textAlign: 'center' }}>
                      ⚠️ {unlockError}
                    </p>
                  )}
                </>
              ) : (
                /* Success state — coupon revealed */
                <div
                  style={{
                    background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                    border: '2px dashed #10B981', borderRadius: '12px',
                    padding: '20px', textAlign: 'center',
                    animation: 'slideDown 0.3s ease-out',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Tag size={20} color="#10B981" />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#065F46' }}>Your Coupon Code</span>
                  </div>
                  <div
                    style={{
                      fontSize: '28px', fontWeight: '800', letterSpacing: '4px',
                      color: '#047857', background: 'white',
                      padding: '12px 20px', borderRadius: '8px',
                      border: '1.5px solid #6EE7B7', marginBottom: '10px',
                      userSelect: 'all',
                    }}
                  >
                    {unlockedData?.CouponCode || unlockedData?.couponCode || 'UNLOCKED'}
                  </div>
                  {unlockedData?.DiscountValue && (
                    <p style={{ fontSize: '13px', color: '#065F46', margin: 0 }}>
                      💰 Save {unlockedData.DiscountValue}
                      {unlockedData?.DiscountType === 'percentage' ? '%' : '₹'} on your purchase
                    </p>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin        { to { transform: rotate(360deg); } }
        @keyframes fadeIn      { from { opacity: 0; }              to { opacity: 1; } }
        @keyframes slideDown   { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalBounceIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes ripplePop {
          0%   { width: 10px;  height: 10px;  opacity: 0.75; transform: translate(-50%, -50%) scale(1); }
          100% { width: 420px; height: 420px; opacity: 0;    transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  );
}