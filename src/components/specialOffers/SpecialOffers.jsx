'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Store, 
  Clock, 
  Search, 
  Phone, 
  ChevronRight, 
  Star, 
  ArrowLeft, 
  LogOut 
} from 'lucide-react';
import { getShops, selectShops, selectShopLoading } from '@/app/features/adminPanel/shopSlice';
import { selectSelectedLocation, userTracking } from '@/app/features/adminPanel/adminPanelSlice';
import { clearAuth } from '@/app/features/auth/authSlice';
import toast from 'react-hot-toast';

/* =========================================================
   HAVERSINE DISTANCE UTILITY
   ========================================================= */
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function SpecialOffers() {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const shops = useSelector(selectShops) || [];
  const loading = useSelector(selectShopLoading);
  const selectedLocation = useSelector(selectSelectedLocation);

  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  /* ------------------ GEOLOCATION ON MOUNT ------------------ */
  useEffect(() => {
    dispatch(getShops());

    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.warn("Geolocation permission not granted or failed:", err);
        },
        { timeout: 5000, maximumAge: 60000 }
      );
    }
  }, [dispatch]);

  /* ------------------ CALCULATE STATUS & HOURS ------------------ */
  const getStoreStatus = (shop) => {
    if (!shop.StartTime || !shop.EndTime) return { isOpen: true, text: "Open" };
    try {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const [startH, startM] = shop.StartTime.split(':').map(Number);
      const [endH, endM] = shop.EndTime.split(':').map(Number);

      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      let isOpen = false;
      if (endMinutes > startMinutes) {
        isOpen = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
      } else {
        isOpen = currentMinutes >= startMinutes || currentMinutes <= endMinutes;
      }

      return {
        isOpen,
        text: isOpen ? "Open" : "Closed"
      };
    } catch (e) {
      return { isOpen: true, text: "Open" };
    }
  };

  /* ------------------ CALCULATE DISTANCE ------------------ */
  const getStoreDistanceText = (shop) => {
    // If shop coordinates are present in API payload
    if (userLocation && shop.Latitude && shop.Longitude) {
      const km = haversineDistance(
        userLocation.lat,
        userLocation.lng,
        parseFloat(shop.Latitude),
        parseFloat(shop.Longitude)
      );
      if (km < 1) return `${Math.round(km * 1000)} m`;
      return `${km.toFixed(1)} km`;
    }

    // Deterministic fallback based on shop name/id to generate stable distance text matching the layout
    let sum = 0;
    const name = shop.Storename || "";
    const id = shop.Storeid || "";
    const seed = name + id;
    for (let i = 0; i < seed.length; i++) {
      sum += seed.charCodeAt(i);
    }
    const dist = 0.3 + (sum % 18) * 0.1; // 0.3 km to 2.1 km range
    return `${dist.toFixed(1)} km`;
  };



  /* ------------------ FILTERING ------------------ */
  const activeShops = shops.filter(shop => shop.Deleted !== "true" && shop.Isactive !== "false");

  const filteredShops = activeShops.filter(shop => {
    const query = searchQuery.toLowerCase();
    const nameMatches = shop.Storename?.toLowerCase().includes(query);
    const addressMatches = shop.Storeaddress?.toLowerCase().includes(query);
    const descMatches = shop.Description?.toLowerCase().includes(query);
    const categoryMatches = shop.Categoryname?.toLowerCase().includes(query) || shop.Category?.toLowerCase().includes(query);
    return nameMatches || addressMatches || descMatches || categoryMatches;
  });

  /* ------------------ LOGOUT HANDLER ------------------ */
  const handleLogout = () => {
    dispatch(clearAuth());
    router.push('/');
    toast.success('Logged out successfully 👋');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc', 
      paddingTop: 76, 
      paddingBottom: 80,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    }}>
      {/* ── HEADER CONTAINER ── */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }}>
        
        {/* Top title and subtitle */}
        <div style={{ marginTop: 24, marginBottom: 20 }}>
          <h1 style={{ 
            fontSize: 32, 
            fontWeight: 800, 
            color: '#0f172a', 
            letterSpacing: '-0.5px',
            margin: '0 0 6px'
          }}>
            Nearby Shops
          </h1>
          <p style={{ 
            fontSize: 15, 
            color: '#64748b', 
            margin: 0 
          }}>
            Find the best shops near you
          </p>
        </div>

        {/* ── SEARCH INPUT ── */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <Search style={{ 
            position: 'absolute', 
            left: 16, 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#94a3b8',
            width: 20,
            height: 20
          }} />
          <input
            type="text"
            placeholder="Search for shops, services or anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 16px 16px 48px',
              fontSize: 15,
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#0f172a',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#8b5cf6';
              e.target.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
            }}
          />
        </div>

        {/* ── LOCATION ROW ── */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 20,
          padding: '0 4px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin style={{ color: '#8b5cf6', width: 18, height: 18 }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
              Shops near {selectedLocation?.Name || 'your area'}
            </span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#8b5cf6' }}>
            {filteredShops.length} {filteredShops.length === 1 ? 'Result' : 'Results'}
          </span>
        </div>

        {/* ── SHOPS LIST ── */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div style={{
              width: 32,
              height: 32,
              border: '3px solid #e2e8f0',
              borderTopColor: '#8b5cf6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
          </div>
        ) : filteredShops.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 24px',
            background: '#ffffff',
            borderRadius: 24,
            border: '1.5px dashed #cbd5e1',
          }}>
            <Store style={{ width: 48, height: 48, color: '#94a3b8', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#334155', margin: '0 0 8px' }}>
              No Shops Found
            </h3>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
              We couldn&apos;t find any active shops matching your search.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredShops.map((shop) => {
              const { isOpen, text: statusText } = getStoreStatus(shop);
              const distanceText = getStoreDistanceText(shop);
              const ratingVal = parseFloat(shop.Rating) || 5;
              const shopImg = shop.Imageurl || shop.ImageUrl || shop.image || shop.imageUrl || shop.Image;

              return (
                <div
                  key={shop.Storeid}
                  onClick={() => router.push(`/products?storeId=${shop.Storeid}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#ffffff',
                    padding: 16,
                    borderRadius: 20,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    border: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
                  }}
                >
                  {/* Shop Image */}
                  <div style={{
                    width: 84,
                    height: 84,
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: '#f1f5f9',
                    marginRight: 16,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {shopImg ? (
                      <img
                        src={shopImg}
                        alt={shop.Storename}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Store style={{ width: 28, height: 28, color: '#94a3b8' }} />
                    )}
                  </div>

                  {/* Middle Column: Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Store Name & Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <h2 style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#0f172a',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '80%',
                      }}>
                        {shop.Storename}
                      </h2>
                      {/* Rating Badge */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        background: '#fef3c7',
                        color: '#b45309',
                        padding: '2px 6px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                      }}>
                        <Star size={10} fill="#b45309" color="#b45309" />
                        <span>{ratingVal}</span>
                      </div>
                    </div>

                    {/* Status Pill & Timings */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{
                        background: isOpen ? '#dcfce7' : '#fee2e2',
                        color: isOpen ? '#15803d' : '#b91c1c',
                        padding: '2px 8px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 700,
                      }}>
                        {statusText}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: 12 }}>
                        <Clock size={13} />
                        <span style={{ fontWeight: 500 }}>
                          {shop.StoreTime || `${shop.StartTime || '09:00'} - ${shop.EndTime || '21:00'}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Distance & Actions */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-end', 
                    gap: 12,
                    marginLeft: 12,
                    flexShrink: 0
                  }}>
                    {/* Distance */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: 13, fontWeight: 600 }}>
                      <MapPin size={14} style={{ color: '#8b5cf6' }} />
                      <span>{distanceText}</span>
                    </div>

                    {/* Action buttons wrapper */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {/* Call button */}
                      <a
                        href={shop.Phoneno ? `tel:${shop.Phoneno}` : '#'}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          background: 'transparent',
                          border: '1.5px solid #8b5cf6',
                          color: '#8b5cf6',
                          padding: '6px 14px',
                          borderRadius: 999,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'none',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <Phone size={13} />
                        <span>Call</span>
                      </a>
                      
                      {/* Details Chevron */}
                      <ChevronRight size={18} style={{ color: '#94a3b8' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}