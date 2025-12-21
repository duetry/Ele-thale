import React, { useState, useRef } from 'react';
import { Star, Award, Phone, Clock, Mail, MapPin } from 'lucide-react';

export default function UnlockOfferModal({ product, onClose, couponCode }) {
  const [showStoreInfo, setShowStoreInfo] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const storeInfoRef = useRef(null);

  if (!product) return null;

  const handleUnlock = () => {
    setShowStoreInfo(true);
    setShowConfetti(true);
    
    setTimeout(() => {
      if (storeInfoRef.current) {
        storeInfoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const handleClose = () => {
    setShowStoreInfo(false);
    setShowConfetti(false);
    onClose();
  };

  const handleNavigate = () => {
    window.open('https://maps.app.goo.gl/ZqRXMxnQYiGiTs9o7?g_st=am', '_blank');
  };

  const handlePhoneCall = () => {
    window.location.href = 'tel:+919500736052';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode?.couponCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      onClick={handleClose}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: 'rgba(0,0,0,0.75)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 1000, 
        padding: '20px', 
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease-out'
      }}>
      
      {/* Confetti Effect */}
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
          {[...Array(100)].map((_, i) => {
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#FF1744', '#00E676', '#FFC107', '#E040FB'];
            const size = Math.random() * 10 + 5;
            const angle = (Math.random() - 0.5) * 160;
            const distance = 300 + Math.random() * 200;
            const duration = 1.5 + Math.random() * 0.8;
            
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: `${size}px`,
                  height: `${size}px`,
                  background: colors[i % colors.length],
                  top: '50%',
                  left: '50%',
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  animation: `confettiBurst ${duration}s ease-out forwards`,
                  opacity: 0,
                  transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
                  '--angle': `${angle}deg`,
                  '--distance': `${distance}px`,
                  '--rotation': `${Math.random() * 720 - 360}deg`
                }}
              />
            );
          })}
        </div>
      )}
      
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          background: 'white', 
          borderRadius: '24px', 
          maxWidth: '480px', 
          width: '100%', 
          maxHeight: '90vh', 
          overflow: 'auto', 
          boxShadow: '0 25px 80px rgba(0,0,0,0.4)', 
          animation: 'modalBounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          position: 'relative'
        }}>
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          style={{ 
            position: 'absolute', 
            top: '16px', 
            right: '16px', 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: 'rgba(0,0,0,0.7)', 
            border: 'none', 
            color: 'white',
            fontSize: '24px', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backdropFilter: 'blur(10px)',
            zIndex: 10,
            transition: 'all 0.2s',
            fontWeight: '300'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1) rotate(90deg)';
            e.target.style.background = 'rgba(239, 68, 68, 0.9)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1) rotate(0deg)';
            e.target.style.background = 'rgba(0,0,0,0.7)';
          }}
        >
          ×
        </button>

        {/* Product Image with Gradient Overlay */}
        <div style={{ position: 'relative', height: '200px', overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
          <img 
            src={product.Imageurl} 
            alt={product.Name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)' 
          }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px' }}>
            <div style={{ color: 'white', fontSize: '22px', fontWeight: '700', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              {product.Name}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={14} fill="#FCD34D" color="#FCD34D" />
              <span style={{ fontWeight: '600' }}>{product.Rating}</span>
              <span style={{ opacity: 0.8 }}>• {product.StoreName}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          
          {/* Exclusive Coupon Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)', 
            padding: '24px', 
            borderRadius: '16px', 
            marginBottom: '24px', 
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.3)', padding: '8px', borderRadius: '12px' }}>
                  <Award size={24} color="white" />
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>
                  Exclusive Offer! 🎉
                </div>
              </div>
              
              <div style={{ 
                background: 'white', 
                padding: '16px', 
                borderRadius: '12px', 
                marginBottom: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '8px', fontWeight: '600', letterSpacing: '0.5px' }}>
                  YOUR COUPON CODE
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '24px', 
                    fontWeight: '700', 
                    color: '#1F2937', 
                    letterSpacing: '3px'
                  }}>
                    {couponCode?.couponCode || 'SAVE50'}
                  </div>
                  <button 
                    onClick={handleCopy}
                    style={{ 
                      padding: '10px 18px', 
                      background: copied ? '#10B981' : '#1F2937', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      minWidth: '70px'
                    }}
                    onMouseEnter={(e) => !copied && (e.target.style.background = '#374151')}
                    onMouseLeave={(e) => !copied && (e.target.style.background = '#1F2937')}
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                color: 'white'
              }}>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: '800' }}>
                    ₹{product.Discount} OFF
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>
                    Save ₹{product?.Discount} instantly!
                  </div>
                </div>
                <div style={{ fontSize: '48px' }}>🎁</div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.6' }}>
              {product.Description}
            </div>
          </div>

          {/* Price Section */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '16px',
            background: '#F9FAFB',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Final Price</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#1F2937' }}>
                ₹{product.Finalprice.toFixed(2)}
              </div>
            </div>
            {product.Discount > 0 && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Original Price</div>
                <div style={{ fontSize: '20px', color: '#9CA3AF', textDecoration: 'line-through' }}>
                  ₹{product.Price.toFixed(2)}
                </div>
              </div>
            )}
          </div>

          {/* Unlock Button */}
          <button 
            onClick={handleUnlock}
            disabled={showStoreInfo}
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: showStoreInfo ? '#9CA3AF' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '14px', 
              fontSize: '17px', 
              fontWeight: '700', 
              cursor: showStoreInfo ? 'not-allowed' : 'pointer', 
              boxShadow: showStoreInfo ? 'none' : '0 8px 20px rgba(16, 185, 129, 0.4)', 
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => !showStoreInfo && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !showStoreInfo && (e.target.style.transform = 'translateY(0)')}
          >
            {showStoreInfo ? '✓ Offer Unlocked!' : '🎁 Unlock Store Details'}
          </button>

          {/* Store Information */}
          {showStoreInfo && (
            <div 
              ref={storeInfoRef} 
              style={{ 
                marginTop: '24px', 
                padding: '24px', 
                background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', 
                borderRadius: '16px', 
                border: '2px solid #BAE6FD',
                animation: 'slideDown 0.5s ease-out'
              }}>
              
              {/* Store Image */}
              <div style={{ 
                marginBottom: '20px', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                height: '160px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
              }}>
                <img 
                  src="/store.webp" 
                  alt="Store"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=160&fit=crop';
                  }}
                />
              </div>
              
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: '#1F2937', 
                marginBottom: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}>
                <MapPin size={20} color="#0EA5E9" />
                Store Information
              </h3>

              {/* Store Name */}
              <div style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1F2937', 
                marginBottom: '16px',
                padding: '12px',
                background: 'white',
                borderRadius: '10px'
              }}>
                {product.StoreName}
              </div>

              {/* Contact Info with clickable phone */}
              <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={handlePhoneCall}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    background: 'white',
                    border: '2px solid #10B981',
                    borderRadius: '10px',
                    fontSize: '15px',
                    color: '#1F2937',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#10B981';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.color = '#1F2937';
                  }}
                >
                  <Phone size={18} />
                  <span>+91 9500736052</span>
                </button>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  padding: '14px',
                  background: 'white',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#4B5563'
                }}>
                  <Clock size={18} color="#F59E0B" />
                  <span>9:00 AM - 9:00 PM</span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  padding: '14px',
                  background: 'white',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#4B5563'
                }}>
                  <Mail size={18} color="#0EA5E9" />
                  <span>ramarajandft@gmail.com.com</span>
                </div>
              </div>

              {/* Location */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#1F2937', 
                  marginBottom: '10px' 
                }}>
                  📍 Location
                </div>
                <div style={{ 
                  background: 'white', 
                  padding: '14px', 
                  borderRadius: '10px', 
                  fontSize: '14px', 
                  color: '#4B5563',
                  lineHeight: '1.6',
                  marginBottom: '12px'
                }}>
                  JC69+477, Veerachi S St, Manapparai,<br/>
                  Tamil Nadu 621307
                </div>
                
                <button 
                  onClick={handleNavigate}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    background: '#4285F4', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '10px', 
                    fontSize: '15px', 
                    fontWeight: '600', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px', 
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#3367D6';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#4285F4';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  🗺️ Navigate with Google Maps
                </button>
              </div>

              {/* Active Offer Badge */}
              <div style={{ 
                background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)', 
                padding: '16px', 
                borderRadius: '10px', 
                border: '2px solid #6EE7B7',
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '700', 
                  color: '#065F46', 
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}>
                  ✅ Offer Active Now!
                </div>
                <div style={{ fontSize: '13px', color: '#047857' }}>
                  Show this coupon at checkout to claim your discount
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalBounceIn {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(50px);
          }
          50% {
            transform: scale(1.05) translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes confettiBurst {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(
              calc(-50% + var(--distance) * cos(var(--angle))), 
              calc(-50% - var(--distance) * sin(var(--angle)))
            ) rotate(var(--rotation));
          }
        }

        @media (max-width: 640px) {
          div[style*="maxWidth: '480px'"] {
            margin: 10px;
          }
        }
      `}</style>
    </div>
  );
}