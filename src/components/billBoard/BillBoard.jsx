'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  Store,
  MapPin,
  Clock,
  Sparkles,
  Flame,
  Bell,
  ChevronRight,
  ChevronLeft,
  Check,
  CheckCircle2,
  Heart,
  Share2,
  AlertCircle,
  X,
  Lock,
  ArrowRight,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import toast from 'react-hot-toast';

import {
  fetchBestOfferBillboards,
  notifyUpcomingOffer,
  requestExpiredOffer,
} from '@/app/features/billBoard/billBoardSlice';
import { fetchProductOffer } from '@/app/features/products/productSlice';
import {
  selectSelectedLocation,
  setSelectedLocation,
  selectLocationList,
  userTracking,
} from '@/app/features/adminPanel/adminPanelSlice';
import { selectIsAuthenticated } from '@/app/features/auth/authSlice';
import {
  postProductReaction,
  selectReaction,
} from '@/app/features/adminPanel/reactionSlice';

import UnlockOfferModal from '../products/UnlockOfferModel';
import LoginPopup from '../LoginPopup';

/* =========================================================
   API CONSTANTS & HELPERS
   ========================================================= */
const API_BASE = 'https://dxaoss4u5f.execute-api.us-east-1.amazonaws.com/ET_UAT';
const DEFAULT_LOCATION_ID = 'b2d85b75-684d-4cae-a990-aa317f7d27dd';
const FALLBACK_PRODUCT_IMG =
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=450&fit=crop';

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  const local = localStorage.getItem('authToken');
  if (local && local !== 'null' && local !== 'undefined') return local;
  const cookieMatch = document.cookie.match(/(?:^|;\s*)authToken=([^;]*)/);
  if (cookieMatch && cookieMatch[1]) return decodeURIComponent(cookieMatch[1]);
  return null;
};

const verifyCouponCode = async (productId) => {
  const token = getAuthToken();
  const response = await fetch(
    `${API_BASE}/GET_CouponCode?productId=${productId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  if (!response.ok) {
    throw new Error('Failed to verify coupon');
  }
  return await response.json();
};

/* =========================================================
   HAVERSINE DISTANCE FORMULA (Earth radius 6371 km)
   ========================================================= */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(distKm) {
  if (distKm === null || distKm === undefined || isNaN(distKm)) return null;
  if (distKm < 1) {
    return `${Math.round(distKm * 1000)} m away`;
  }
  if (distKm < 10) {
    return `${distKm.toFixed(1)} km away`;
  }
  return `${Math.round(distKm)} km away`;
}

/* =========================================================
   GEOLOCATION HOOK
   ========================================================= */
function useUserLocation() {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  const fetchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (pos?.coords) {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLocationError(false);
          setLocationDenied(false);
          if (typeof window !== 'undefined') {
            localStorage.setItem('locationPopupHandled', 'true');
          }
        }
      },
      (err) => {
        // Fallback with low accuracy
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (pos?.coords) {
              setUserLocation({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              });
              setLocationError(false);
              setLocationDenied(false);
              if (typeof window !== 'undefined') {
                localStorage.setItem('locationPopupHandled', 'true');
              }
            }
          },
          (lowErr) => {
            setLocationError(true);
            if (lowErr.code === 1 || err.code === 1) {
              setLocationDenied(true);
            }
            if (typeof window !== 'undefined') {
              localStorage.setItem('locationPopupHandled', 'true');
            }
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator?.geolocation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocationError(true);
      return;
    }

    const hasHandled = localStorage.getItem('locationPopupHandled');

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          if (result.state === 'granted') {
            localStorage.setItem('locationPopupHandled', 'true');
            fetchLocation();
          } else if (result.state === 'denied') {
            setLocationDenied(true);
            setLocationError(true);
            localStorage.setItem('locationPopupHandled', 'true');
          } else {
            // 'prompt'
            if (!hasHandled) {
              setShowLocationPopup(true);
            } else {
              setLocationError(true);
            }
          }

          result.onchange = () => {
            if (result.state === 'granted') {
              setLocationDenied(false);
              setLocationError(false);
              setShowLocationPopup(false);
              fetchLocation();
            } else if (result.state === 'denied') {
              setLocationDenied(true);
              setLocationError(true);
              setShowLocationPopup(false);
            }
          };
        })
        .catch(() => {
          if (!hasHandled) setShowLocationPopup(true);
          else fetchLocation();
        });
    } else {
      if (!hasHandled) setShowLocationPopup(true);
      else fetchLocation();
    }
  }, [fetchLocation]);

  const requestLocation = (e) => {
    e?.stopPropagation?.();
    if (locationDenied) {
      alert(
        'Location permission is currently blocked in your browser settings.\n\nPlease enable location in your browser site permissions and refresh the page to view live distance!'
      );
      return;
    }
    setShowLocationPopup(true);
  };

  const confirmLocation = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('locationPopupHandled', 'true');
    }
    setShowLocationPopup(false);
    fetchLocation();
  };

  const dismissLocation = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('locationPopupHandled', 'true');
    }
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
   BROKEN HEART ICON COMPONENT
   ========================================================= */
const BrokenHeartIcon = ({ size = 16, color = 'currentColor', fill = 'none' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5c-1.7-2.6-5.5-3-7.5-1-2 2-2 6 2.5 10.5l5 4.5 5-4.5c4.5-4.5 4.5-8.5 2.5-10.5-2-2-5.8-1.6-7.5 1" />
    <path d="M12 5l-1.5 3 2.5 3-2 3.5 1 2.5" />
  </svg>
);

/* =========================================================
   DISTANCE BADGE COMPONENT
   ========================================================= */
function DistanceBadge({
  productLat,
  productLng,
  apiKilometer,
  userLocation,
  locationDenied,
  onRequestLocation,
}) {
  let km = null;

  if (userLocation && productLat && productLng) {
    km = haversineDistance(
      userLocation.lat,
      userLocation.lng,
      Number(productLat),
      Number(productLng)
    );
  } else if (apiKilometer !== undefined && apiKilometer !== null && apiKilometer !== '') {
    km = Number(apiKilometer);
  }

  // If no location available & no apiKilometer
  if (km === null || isNaN(km)) {
    return (
      <button
        onClick={onRequestLocation}
        title="Click to enable location and view exact distance"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 10px',
          borderRadius: 999,
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          color: '#64748b',
          fontSize: 11,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#cbd5e1';
          e.currentTarget.style.background = '#f1f5f9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.background = '#f8fafc';
        }}
      >
        <MapPin size={12} color="#94a3b8" />
        <span>{locationDenied ? 'Location off' : 'Enable location'}</span>
      </button>
    );
  }

  const label = formatDistance(km);

  // Exact Badge Styles required:
  // < 2 km: Green badge (bg #f0fdf4, border #bbf7d0, text #15803d)
  // < 10 km: Amber badge (bg #fffbeb, border #fde68a, text #92400e)
  // >= 10 km: Blue badge (bg #f0f9ff, border #bae6fd, text #0369a1)
  let badgeBg = '#f0f9ff';
  let badgeBorder = '#bae6fd';
  let badgeText = '#0369a1';

  if (km < 2) {
    badgeBg = '#f0fdf4';
    badgeBorder = '#bbf7d0';
    badgeText = '#15803d';
  } else if (km < 10) {
    badgeBg = '#fffbeb';
    badgeBorder = '#fde68a';
    badgeText = '#92400e';
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '4px 10px',
        borderRadius: 999,
        background: badgeBg,
        border: `1px solid ${badgeBorder}`,
        color: badgeText,
        fontSize: 11,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      <MapPin size={12} strokeWidth={2.4} color={badgeText} />
      <span>{label}</span>
    </div>
  );
}

/* =========================================================
   TIME & STATUS BADGE COMPONENT
   ========================================================= */
function TimeStatusBadge({ sectionKey, startTime, endTime }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000); // refresh every 30s
    return () => clearInterval(timer);
  }, []);

  const sTime = startTime ? new Date(startTime) : null;
  const eTime = endTime ? new Date(endTime) : null;

  if (sectionKey === 'expired' || (eTime && now > eTime)) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '4px 10px',
          borderRadius: 999,
          background: '#fff1f2',
          border: '1px solid #fecdd3',
          color: '#9f1239',
          fontSize: 11,
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#ef4444',
          }}
        />
        <span>Offer Ended</span>
      </div>
    );
  }

  if (sectionKey === 'upcoming' || (sTime && now < sTime)) {
    const diffMs = sTime - now;
    if (diffMs > 0) {
      const totalMins = Math.floor(diffMs / 60000);
      const days = Math.floor(totalMins / 1440);
      const hours = Math.floor((totalMins % 1440) / 60);
      const mins = totalMins % 60;

      let timerText = '';
      if (days > 0) timerText = `${days} Day${days > 1 ? 's' : ''} Left ⏳`;
      else if (hours > 0) timerText = `${hours} Hr${hours > 1 ? 's' : ''} Left ⏳`;
      else timerText = `${Math.max(1, mins)} Min${mins > 1 ? 's' : ''} Left ⏳`;

      return (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 10px',
            borderRadius: 999,
            background: '#fffbeb',
            border: '1px solid #fde68a',
            color: '#92400e',
            fontSize: 11,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          <Clock size={12} strokeWidth={2.4} color="#d97706" />
          <span>{timerText}</span>
        </div>
      );
    }
  }

  // Live Offer status
  if (eTime) {
    const diffMs = eTime - now;
    if (diffMs > 0) {
      const totalMins = Math.floor(diffMs / 60000);
      const days = Math.floor(totalMins / 1440);
      const hours = Math.floor((totalMins % 1440) / 60);
      const mins = totalMins % 60;

      let timerText = '';
      if (days > 0) timerText = `${days} Days Left 🔥`;
      else if (hours > 0) timerText = `${hours} Hrs Left ⏳`;
      else timerText = `${Math.max(1, mins)} Mins Left ⚡`;

      return (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 10px',
            borderRadius: 999,
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#15803d',
            fontSize: 11,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          <span>{timerText}</span>
        </div>
      );
    }
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '4px 10px',
        borderRadius: 999,
        background: '#f0fdf4',
        border: '1px solid #86efac',
        color: '#16a34a',
        fontSize: 11,
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#16a34a',
        }}
      />
      <span>Live Deal 🔥</span>
    </div>
  );
}

/* =========================================================
   LIKE & DISLIKE BUTTONS
   ========================================================= */
function LikeDislikeButtons({
  productId,
  isAuthenticated,
  onLoginRequired,
}) {
  const dispatch = useDispatch();
  const reduxReaction = useSelector(selectReaction(productId));

  // Optimistic reaction state
  const [localReaction, setLocalReaction] = useState(reduxReaction || null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (reduxReaction !== undefined) {
      setLocalReaction(reduxReaction);
    }
  }, [reduxReaction]);

  const handleToggleReaction = async (type) => {
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }

    if (submitting) return;

    // Toggle logic: if already clicked same, keep or toggle
    const nextReaction = localReaction === type ? null : type;
    setLocalReaction(nextReaction);

    if (nextReaction) {
      setSubmitting(true);
      try {
        await dispatch(
          postProductReaction({ Productid: productId, Reaction: nextReaction })
        ).unwrap();
      } catch (err) {
        console.error('Reaction post error:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const isLiked = localReaction === 'like';
  const isDisliked = localReaction === 'dislike';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {/* Heart (Like) button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleToggleReaction('like');
        }}
        title="Like offer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: 10,
          border: `1.5px solid ${isLiked ? '#fda4af' : '#e2e8f0'}`,
          background: isLiked ? '#fff1f2' : '#ffffff',
          color: isLiked ? '#e11d48' : '#64748b',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          if (!isLiked) {
            e.currentTarget.style.borderColor = '#fda4af';
            e.currentTarget.style.background = '#fff5f5';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLiked) {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.background = '#ffffff';
          }
        }}
      >
        <Heart
          size={18}
          color={isLiked ? '#e11d48' : '#64748b'}
          fill={isLiked ? '#e11d48' : 'none'}
        />
      </button>

      {/* Heart-broken (Dislike) button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleToggleReaction('dislike');
        }}
        title="Dislike offer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: 10,
          border: `1.5px solid ${isDisliked ? '#cbd5e1' : '#e2e8f0'}`,
          background: isDisliked ? '#f1f5f9' : '#ffffff',
          color: isDisliked ? '#334155' : '#64748b',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          if (!isDisliked) {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.background = '#f8fafc';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisliked) {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.background = '#ffffff';
          }
        }}
      >
        <BrokenHeartIcon
          size={18}
          color={isDisliked ? '#334155' : '#64748b'}
          fill={isDisliked ? '#94a3b8' : 'none'}
        />
      </button>
    </div>
  );
}

/* =========================================================
   OFFER CARD COMPONENT
   ========================================================= */
function OfferCard({
  item,
  sectionKey,
  userLocation,
  locationDenied,
  onRequestLocation,
  onGoToStore,
  onNotifyMe,
  onRequestAgain,
  notifiedMap,
}) {
  const isLive = sectionKey === 'live';
  const isUpcoming = sectionKey === 'upcoming';
  const isExpired = sectionKey === 'expired';

  const isNotified = Boolean(notifiedMap[item.Productid]);

  const price = item.Price || item.price;
  const finalPrice = item.Finalprice || item.finalPrice || item.finalprice;
  const productName = item.ProductName || item.productName || item.title || 'Exclusive Offer';

  return (
    <div
      onClick={() => {
        if (isLive) onGoToStore(item);
      }}
      style={{
        background: '#ffffff',
        borderRadius: 18,
        border: '1px solid #e2e8f0',
        boxShadow:
          '0 4px 12px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: isLive ? 'pointer' : 'default',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
      }}
      onMouseEnter={(e) => {
        if (isLive) {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow =
            '0 14px 28px -4px rgba(15, 23, 42, 0.10), 0 6px 12px -2px rgba(15, 23, 42, 0.05)';
          e.currentTarget.style.borderColor = '#86efac';
        }
      }}
      onMouseLeave={(e) => {
        if (isLive) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow =
            '0 4px 12px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)';
          e.currentTarget.style.borderColor = '#e2e8f0';
        }
      }}
    >
      {/* ── 1. Top: Preserved Aspect Ratio Product Image ── */}
      <div
        style={{
          width: '100%',
          aspectRatio: '16 / 9',
          overflow: 'hidden',
          background: '#f8fafc',
          position: 'relative',
        }}
      >
        <img
          src={item.Imageurl || FALLBACK_PRODUCT_IMG}
          alt={productName}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_PRODUCT_IMG;
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.35s ease',
            filter: isExpired ? 'grayscale(45%)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (!isExpired) e.currentTarget.style.transform = 'scale(1.06)';
          }}
          onMouseLeave={(e) => {
            if (!isExpired) e.currentTarget.style.transform = 'scale(1)';
          }}
        />

        {/* Brand or Category overlay if present */}
        {item.Brand && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(4px)',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.4px',
            }}
          >
            {item.Brand}
          </div>
        )}
      </div>

      {/* ── 2. Badges Row: Distance Badge + Time/Status Badge ── */}
      <div
        style={{
          padding: '12px 14px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        <DistanceBadge
          productLat={item.Latitude}
          productLng={item.Longitude}
          apiKilometer={item.Kilometer}
          userLocation={userLocation}
          locationDenied={locationDenied}
          onRequestLocation={onRequestLocation}
        />

        <TimeStatusBadge
          sectionKey={sectionKey}
          startTime={item.OfferStartTime}
          endTime={item.OfferEndTime}
        />
      </div>

      {/* ── Product Title & Price Details ── */}
      <div style={{ padding: '0 14px 12px', flex: 1 }}>
        <h3
          style={{
            margin: '0 0 6px',
            fontSize: 15,
            fontWeight: 700,
            color: '#1e293b',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {productName}
        </h3>

        {(price || finalPrice) && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            {finalPrice && (
              <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                ₹{finalPrice}
              </span>
            )}
            {price && price !== finalPrice && (
              <span
                style={{
                  fontSize: 13,
                  color: '#94a3b8',
                  textDecoration: 'line-through',
                  fontWeight: 500,
                }}
              >
                ₹{price}
              </span>
            )}
            {price && finalPrice && Number(price) > Number(finalPrice) && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#16a34a',
                  background: '#f0fdf4',
                  padding: '2px 6px',
                  borderRadius: 4,
                }}
              >
                {Math.round(((Number(price) - Number(finalPrice)) / Number(price)) * 100)}% OFF
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── 3. Dashed Divider Line ── */}
      <div
        style={{
          borderTop: '1.5px dashed #e2e8f0',
          margin: '0 14px',
        }}
      />

      {/* ── 4. Bottom Row: Reactions Left + Contextual CTA Right ── */}
      <div
        style={{
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          background: '#ffffff',
        }}
      >
        {/* Left: Like & Dislike Buttons */}
        <LikeDislikeButtons
          productId={item.Productid}
          isAuthenticated={item._isAuthenticated}
          onLoginRequired={item._onLoginRequired}
        />

        {/* Right: Contextual CTA */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          {/* Live: "Go to Store" solid green button (#16a34a) with storefront icon and right arrow */}
          {isLive && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onGoToStore(item);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                padding: '9px 16px',
                borderRadius: 999,
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: '0 3px 10px rgba(22, 163, 74, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#15803d';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#16a34a';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Store size={15} strokeWidth={2.4} />
              <span>Go to Store</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#ffffff',
                  color: '#16a34a',
                  marginLeft: 2,
                }}
              >
                <ArrowRight size={10} strokeWidth={3.5} />
              </span>
            </button>
          )}

          {/* Coming Soon: "Notify Me" soft yellow button (#FEF3C7, text #D97706) */}
          {isUpcoming && (
            <button
              type="button"
              disabled={isNotified}
              onClick={(e) => {
                e.stopPropagation();
                onNotifyMe(item);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '9px 18px',
                borderRadius: 999,
                background: isNotified ? '#ecfdf5' : '#fef3c7',
                color: isNotified ? '#059669' : '#d97706',
                border: isNotified ? '1px solid #a7f3d0' : '1px solid #fde68a',
                fontSize: 13,
                fontWeight: 700,
                cursor: isNotified ? 'default' : 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: isNotified ? 'none' : '0 2px 8px rgba(217, 119, 6, 0.15)',
              }}
              onMouseEnter={(e) => {
                if (!isNotified) {
                  e.currentTarget.style.background = '#fde68a';
                }
              }}
              onMouseLeave={(e) => {
                if (!isNotified) {
                  e.currentTarget.style.background = '#fef3c7';
                }
              }}
            >
              {isNotified ? (
                <>
                  <Check size={15} strokeWidth={2.8} />
                  <span>Notified</span>
                </>
              ) : (
                <>
                  <Bell size={15} strokeWidth={2.4} />
                  <span>Notify Me</span>
                </>
              )}
            </button>
          )}

          {/* Expired Offers: "Request Again" solid red button (#ef4444) */}
          {isExpired && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRequestAgain(item);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '9px 16px',
                borderRadius: 999,
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: '0 3px 10px rgba(239, 68, 68, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#dc2626';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ef4444';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Sparkles size={14} strokeWidth={2.4} />
              <span>Request Again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SECTION HEADER COMPONENT
   ========================================================= */
function SectionHeader({ title, count, icon: Icon, bg, border, text }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        borderRadius: 16,
        background: bg,
        border: `1.5px solid ${border}`,
        marginBottom: 24,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 10,
            background: '#ffffff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          }}
        >
          <Icon size={18} color={text} strokeWidth={2.4} />
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: text,
            letterSpacing: '-0.2px',
          }}
        >
          {title}
        </h2>
      </div>

      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3px 12px',
          borderRadius: 999,
          background: '#ffffff',
          color: text,
          fontSize: 12,
          fontWeight: 800,
          border: `1px solid ${border}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        {count} {count === 1 ? 'Offer' : 'Offers'}
      </span>
    </div>
  );
}

/* =========================================================
   NOTIFY SUCCESS MODAL (Auto-close after 6 seconds)
   ========================================================= */
function NotifySuccessModal({ onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 24,
          padding: '36px 32px 28px',
          maxWidth: 420,
          width: '100%',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Animated shrinking progress bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: 4,
            background: 'linear-gradient(90deg, #f59e0b, #10b981)',
            width: '100%',
            animation: 'shrinkProgress 6s linear forwards',
          }}
        />

        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
          }}
        >
          <X size={16} />
        </button>

        {/* Animated Bell Icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25)',
          }}
        >
          <Bell size={34} color="#d97706" strokeWidth={2.2} />
        </div>

        <h3
          style={{
            margin: '0 0 10px',
            fontSize: 22,
            fontWeight: 800,
            color: '#0f172a',
          }}
        >
          You&apos;re on the list!
        </h3>

        <p
          style={{
            margin: '0 0 24px',
            fontSize: 14,
            color: '#64748b',
            lineHeight: 1.6,
          }}
        >
          We&apos;ll notify you as soon as this offer goes live so you don&apos;t miss
          out on the biggest discount!
        </p>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 14,
            border: 'none',
            background: '#f59e0b',
            color: '#ffffff',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
          }}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   REQUEST SUCCESS MODAL
   ========================================================= */
function RequestSuccessModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 24,
          padding: '36px 32px 28px',
          maxWidth: 420,
          width: '100%',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
          }}
        >
          <X size={16} />
        </button>

        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.25)',
          }}
        >
          <CheckCircle2 size={36} color="#ef4444" strokeWidth={2.4} />
        </div>

        <h3
          style={{
            margin: '0 0 10px',
            fontSize: 22,
            fontWeight: 800,
            color: '#0f172a',
          }}
        >
          Request Submitted!
        </h3>

        <p
          style={{
            margin: '0 0 24px',
            fontSize: 14,
            color: '#64748b',
            lineHeight: 1.6,
          }}
        >
          We have forwarded your request to the store merchant to reactivate this
          deal. We&apos;ll notify you if it comes back!
        </p>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 14,
            border: 'none',
            background: '#ef4444',
            color: '#ffffff',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   LOCATION PERMISSION POPUP
   ========================================================= */
function LocationPermissionPopup({ onConfirm, onDismiss }) {
  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 24,
          padding: '36px 30px 28px',
          maxWidth: 390,
          width: '100%',
          boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #16a34a, #3b82f6)',
          }}
        />

        <button
          onClick={onDismiss}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: 30,
            height: 30,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
          }}
        >
          <X size={15} />
        </button>

        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '2px solid #bfdbfe',
          }}
        >
          <MapPin size={32} color="#3b82f6" strokeWidth={2.2} />
        </div>

        <h3
          style={{
            margin: '0 0 10px',
            fontSize: 20,
            fontWeight: 800,
            color: '#0f172a',
          }}
        >
          Enable Location Access
        </h3>

        <p
          style={{
            margin: '0 0 20px',
            fontSize: 14,
            color: '#64748b',
            lineHeight: 1.6,
          }}
        >
          We use your location to calculate real-time distance to nearby shops and
          uncover the best localized deals around you.
        </p>

        <button
          onClick={onConfirm}
          style={{
            width: '100%',
            padding: '13px 0',
            borderRadius: 14,
            border: 'none',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            color: '#ffffff',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: 10,
            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
          }}
        >
          📍 Allow Location Access
        </button>

        <button
          onClick={onDismiss}
          style={{
            width: '100%',
            padding: '11px 0',
            borderRadius: 14,
            border: '1.5px solid #e2e8f0',
            background: 'transparent',
            color: '#64748b',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT: BillboardBanners (Nearby Offers)
   ========================================================= */
export default function BillboardBanners() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isBannerPaused, setIsBannerPaused] = useState(false);

  // Modals & Popups
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [couponCode, setCouponCode] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [pendingActionProduct, setPendingActionProduct] = useState(null);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Map of notified product IDs to keep track in session
  const [notifiedMap, setNotifiedMap] = useState({});

  // Geolocation
  const {
    userLocation,
    locationDenied,
    showLocationPopup,
    requestLocation,
    confirmLocation,
    dismissLocation,
  } = useUserLocation();

  // Redux state
  const {
    bestOfferBillboards,
    bestOfferBanner,
    bestOfferLive,
    bestOfferUpcoming,
    bestOfferExpired,
    bestOfferLoading,
    bestOfferError,
  } = useSelector((state) => state.billboards);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const selectedLocation = useSelector(selectSelectedLocation);
  const locationList = useSelector(selectLocationList);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  /* ── 1. Fetch Offers when Location changes ── */
  useEffect(() => {
    const locId = selectedLocation?.LocationId || DEFAULT_LOCATION_ID;
    dispatch(fetchBestOfferBillboards({ LocationId: String(locId) }));
  }, [selectedLocation, dispatch]);

  /* ── 2. Hero Banner Auto-slide every 4 seconds ── */
  useEffect(() => {
    if (!mounted || !bestOfferBanner?.length || isBannerPaused) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) =>
        prev === bestOfferBanner.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [mounted, bestOfferBanner, isBannerPaused]);

  /* ── 3. Categorize cards into 3 distinct sections (Live, Upcoming, Expired) ── */
  const { liveOffers, upcomingOffers, expiredOffers } = useMemo(() => {
    // If backend already categorized them
    if (
      bestOfferLive?.length > 0 ||
      bestOfferUpcoming?.length > 0 ||
      bestOfferExpired?.length > 0
    ) {
      return {
        liveOffers: bestOfferLive || [],
        upcomingOffers: bestOfferUpcoming || [],
        expiredOffers: bestOfferExpired || [],
      };
    }

    // Flat array fallback: categorize dynamically using start & end times
    const all = Array.isArray(bestOfferBillboards) ? bestOfferBillboards : [];
    const now = new Date();

    const live = [];
    const upcoming = [];
    const expired = [];

    all.forEach((item) => {
      const startTime = item.OfferStartTime ? new Date(item.OfferStartTime) : null;
      const endTime = item.OfferEndTime ? new Date(item.OfferEndTime) : null;

      if (endTime && now > endTime) {
        expired.push(item);
      } else if (startTime && now < startTime) {
        upcoming.push(item);
      } else {
        live.push(item);
      }
    });

    return {
      liveOffers: live,
      upcomingOffers: upcoming,
      expiredOffers: expired,
    };
  }, [bestOfferBillboards, bestOfferLive, bestOfferUpcoming, bestOfferExpired]);

  const totalOffersCount =
    liveOffers.length + upcomingOffers.length + expiredOffers.length;

  /* ── 4. Interaction Handlers ── */

  // A. "Go to Store" (Live Offer)
  const handleGoToStore = async (product) => {
    if (!isAuthenticated) {
      setPendingActionProduct(product);
      setShowLogin(true);
      return;
    }

    // 1. User tracking
    dispatch(
      userTracking(product?.ProductName || product?.title || 'Nearby Offer')
    );

    // 2. Fetch store details for the modal
    if (product?.Storeid) {
      dispatch(fetchProductOffer(product.Storeid));
    }

    // 3. Verify if already unlocked
    try {
      const res = await verifyCouponCode(product.Productid);
      const isUnlocked =
        res?.couponCreated === true ||
        Boolean(res?.CouponCode) ||
        Boolean(res?.data?.[0]?.CouponCode);

      const couponObj = isUnlocked ? res?.data?.[0] || res : null;
      setSelectedProduct(product);
      setCouponCode(couponObj);
    } catch (err) {
      console.error('Coupon verification error:', err);
      setSelectedProduct(product);
      setCouponCode(null);
    }
  };

  // B. "Notify Me" (Coming Soon)
  const handleNotifyMe = async (product) => {
    if (!isAuthenticated) {
      setPendingActionProduct(product);
      setShowLogin(true);
      return;
    }

    try {
      await dispatch(
        notifyUpcomingOffer({ Productid: product.Productid })
      ).unwrap();
      setNotifiedMap((prev) => ({ ...prev, [product.Productid]: true }));
      setShowNotifyModal(true);
    } catch (err) {
      console.error('Notify request error:', err);
      // Still show success modal optimistically as per mobile app behavior
      setNotifiedMap((prev) => ({ ...prev, [product.Productid]: true }));
      setShowNotifyModal(true);
    }
  };

  // C. "Request Again" (Expired Offer)
  const handleRequestAgain = async (product) => {
    if (!isAuthenticated) {
      setPendingActionProduct(product);
      setShowLogin(true);
      return;
    }

    try {
      await dispatch(
        requestExpiredOffer({ Productid: product.Productid })
      ).unwrap();
      setShowRequestModal(true);
    } catch (err) {
      console.error('Request offer error:', err);
      setShowRequestModal(true);
    }
  };

  // Banner Click Handler
  const handleBannerClick = (banner) => {
    const bannerProduct = {
      Productid: banner.Productid || banner.id,
      ProductName: banner.ProductName || banner.title || 'Special Offer',
      Storeid: banner.Storeid || banner.storeId,
      Imageurl: banner.Imageurl || banner.image,
      Price: banner.Price,
      Finalprice: banner.Finalprice,
      Brand: banner.Brand,
      Type: banner.Type,
      OfferStartTime: banner.OfferStartTime,
      OfferEndTime: banner.OfferEndTime,
    };
    handleGoToStore(bannerProduct);
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#f8fafc',
        paddingTop: 85,
        paddingBottom: 80,
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px' }}>
        {/* ===================== HERO BANNER CAROUSEL ===================== */}
        {bestOfferBanner?.length > 0 && (
          <div
            style={{
              position: 'relative',
              borderRadius: 24,
              overflow: 'hidden',
              marginBottom: 44,
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.08)',
              background: '#0f172a',
            }}
            onMouseEnter={() => setIsBannerPaused(true)}
            onMouseLeave={() => setIsBannerPaused(false)}
          >
            <div
              style={{
                display: 'flex',
                transform: `translateX(-${currentBanner * 100}%)`,
                transition: 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              {bestOfferBanner.map((banner, idx) => (
                <div
                  key={banner.Productid || idx}
                  onClick={() => handleBannerClick(banner)}
                  style={{
                    minWidth: '100%',
                    height: 380,
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={banner.Imageurl || banner.image}
                    alt={banner.ProductName || 'Banner'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  {/* Gradient Overlay & Unlock Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      paddingBottom: 32,
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(8px)',
                        color: '#0f172a',
                        padding: '10px 24px',
                        borderRadius: 999,
                        fontSize: 14,
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                        transition: 'transform 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <Lock size={15} color="#16a34a" strokeWidth={2.4} />
                      <span>Tap to Unlock Offer</span>
                      <ArrowRight size={14} color="#16a34a" strokeWidth={2.4} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Arrow Controls */}
            {bestOfferBanner.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentBanner((prev) =>
                      prev === 0 ? bestOfferBanner.length - 1 : prev - 1
                    );
                  }}
                  style={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(4px)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0f172a',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 10,
                  }}
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentBanner((prev) =>
                      prev === bestOfferBanner.length - 1 ? 0 : prev + 1
                    );
                  }}
                  style={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(4px)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0f172a',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 10,
                  }}
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Dot Pagination */}
            {bestOfferBanner.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 14,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
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
                      width: currentBanner === i ? 24 : 8,
                      height: 8,
                      borderRadius: 999,
                      background:
                        currentBanner === i ? '#ffffff' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== LOADING STATE ===================== */}
        {(!mounted || bestOfferLoading) && (
          <div style={{ padding: '20px 0' }}>
            <div
              style={{
                width: '100%',
                height: 340,
                borderRadius: 24,
                background:
                  'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeletonPulse 1.5s infinite',
                marginBottom: 40,
              }}
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 24,
              }}
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: '#ffffff',
                    borderRadius: 18,
                    padding: 16,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 9',
                      borderRadius: 12,
                      background: '#e2e8f0',
                      marginBottom: 16,
                    }}
                  />
                  <div
                    style={{
                      width: '60%',
                      height: 18,
                      background: '#e2e8f0',
                      borderRadius: 6,
                      marginBottom: 10,
                    }}
                  />
                  <div
                    style={{
                      width: '40%',
                      height: 14,
                      background: '#e2e8f0',
                      borderRadius: 6,
                      marginBottom: 16,
                    }}
                  />
                  <div
                    style={{
                      width: '100%',
                      height: 38,
                      background: '#e2e8f0',
                      borderRadius: 999,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== ERROR STATE ===================== */}
        {bestOfferError && (
          <div
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              background: '#fff1f2',
              borderRadius: 24,
              border: '1px solid #fecdd3',
              marginBottom: 40,
            }}
          >
            <AlertCircle
              size={48}
              color="#ef4444"
              style={{ margin: '0 auto 16px' }}
            />
            <h3 style={{ margin: '0 0 8px', fontSize: 20, color: '#9f1239' }}>
              Failed to load nearby offers
            </h3>
            <p style={{ margin: '0 0 20px', color: '#be123c', fontSize: 14 }}>
              {bestOfferError}
            </p>
            <button
              onClick={() => {
                const locId = selectedLocation?.LocationId || DEFAULT_LOCATION_ID;
                dispatch(fetchBestOfferBillboards({ LocationId: String(locId) }));
              }}
              style={{
                padding: '10px 24px',
                borderRadius: 12,
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* ===================== EMPTY STATE ===================== */}
        {!bestOfferLoading && !bestOfferError && totalOffersCount === 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 24px',
              background:
                'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 60%, #f0fdf4 100%)',
              borderRadius: 24,
              border: '1.5px dashed #86efac',
              textAlign: 'center',
              minHeight: 380,
            }}
          >
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #bbf7d0, #86efac)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                boxShadow: '0 8px 32px rgba(34,197,94,0.18)',
              }}
            >
              <Store size={42} color="#16a34a" strokeWidth={1.8} />
            </div>

            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: '#14532d',
                margin: '0 0 10px',
                letterSpacing: '-0.3px',
              }}
            >
              No Nearby Offers Available
            </h2>

            <p
              style={{
                fontSize: 15,
                color: '#4b7c5e',
                maxWidth: 420,
                lineHeight: 1.7,
                margin: '0 0 28px',
              }}
            >
              We couldn&apos;t find any active offers for your selected location.
              Switch to a nearby area — great offers might be just around the corner!
            </p>

            <button
              onClick={() => {
                const navbarBtn = document.getElementById('navbar-location-btn');
                if (navbarBtn) {
                  navbarBtn.scrollIntoView({ behavior: 'smooth' });
                  navbarBtn.click();
                } else if (locationList?.length > 1) {
                  // Switch to another location
                  const nextLoc = locationList.find(
                    (l) => l.LocationId !== selectedLocation?.LocationId
                  );
                  if (nextLoc) dispatch(setSelectedLocation(nextLoc));
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#ffffff',
                border: '1.5px solid #86efac',
                borderRadius: 999,
                padding: '12px 26px',
                fontSize: 14,
                fontWeight: 700,
                color: '#16a34a',
                boxShadow: '0 4px 14px rgba(34, 197, 94, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f0fdf4';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <MapPin size={16} color="#16a34a" />
              <span>Try selecting a different location</span>
            </button>
          </div>
        )}

        {/* ===================== SECTION 1: LIVE OFFERS ===================== */}
        {!bestOfferLoading && liveOffers.length > 0 && (
          <div style={{ marginBottom: 54 }}>
            <SectionHeader
              title="Live Offers"
              count={liveOffers.length}
              icon={Flame}
              bg="#f0fdf4"
              border="#86efac"
              text="#16a34a"
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 24,
              }}
            >
              {liveOffers.map((item) => (
                <OfferCard
                  key={item.Productid}
                  item={{
                    ...item,
                    _isAuthenticated: isAuthenticated,
                    _onLoginRequired: () => setShowLogin(true),
                  }}
                  sectionKey="live"
                  userLocation={userLocation}
                  locationDenied={locationDenied}
                  onRequestLocation={requestLocation}
                  onGoToStore={handleGoToStore}
                  onNotifyMe={handleNotifyMe}
                  onRequestAgain={handleRequestAgain}
                  notifiedMap={notifiedMap}
                />
              ))}
            </div>
          </div>
        )}

        {/* ===================== SECTION 2: COMING SOON ===================== */}
        {!bestOfferLoading && upcomingOffers.length > 0 && (
          <div style={{ marginBottom: 54 }}>
            <SectionHeader
              title="Coming Soon"
              count={upcomingOffers.length}
              icon={Clock}
              bg="#fffbeb"
              border="#fcd34d"
              text="#92400e"
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 24,
              }}
            >
              {upcomingOffers.map((item) => (
                <OfferCard
                  key={item.Productid}
                  item={{
                    ...item,
                    _isAuthenticated: isAuthenticated,
                    _onLoginRequired: () => setShowLogin(true),
                  }}
                  sectionKey="upcoming"
                  userLocation={userLocation}
                  locationDenied={locationDenied}
                  onRequestLocation={requestLocation}
                  onGoToStore={handleGoToStore}
                  onNotifyMe={handleNotifyMe}
                  onRequestAgain={handleRequestAgain}
                  notifiedMap={notifiedMap}
                />
              ))}
            </div>
          </div>
        )}

        {/* ===================== SECTION 3: EXPIRED OFFERS ===================== */}
        {!bestOfferLoading && expiredOffers.length > 0 && (
          <div style={{ marginBottom: 54 }}>
            <SectionHeader
              title="Expired Offers"
              count={expiredOffers.length}
              icon={AlertCircle}
              bg="#fff1f2"
              border="#fecdd3"
              text="#9f1239"
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 24,
              }}
            >
              {expiredOffers.map((item) => (
                <OfferCard
                  key={item.Productid}
                  item={{
                    ...item,
                    _isAuthenticated: isAuthenticated,
                    _onLoginRequired: () => setShowLogin(true),
                  }}
                  sectionKey="expired"
                  userLocation={userLocation}
                  locationDenied={locationDenied}
                  onRequestLocation={requestLocation}
                  onGoToStore={handleGoToStore}
                  onNotifyMe={handleNotifyMe}
                  onRequestAgain={handleRequestAgain}
                  notifiedMap={notifiedMap}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===================== POPUPS & MODALS ===================== */}

      {/* 1. Unlock Offer / Coupon Modal */}
      {selectedProduct && (
        <UnlockOfferModal
          product={selectedProduct}
          couponCode={couponCode}
          onClose={() => {
            setSelectedProduct(null);
            setCouponCode(null);
          }}
        />
      )}

      {/* 2. Login Popup */}
      {showLogin && (
        <LoginPopup
          close={() => {
            setShowLogin(false);
            setPendingActionProduct(null);
          }}
          onLoginSuccess={() => {
            setShowLogin(false);
            if (pendingActionProduct) {
              handleGoToStore(pendingActionProduct);
              setPendingActionProduct(null);
            }
          }}
        />
      )}

      {/* 3. Notify Success Modal (auto-close after 6 seconds) */}
      {showNotifyModal && (
        <NotifySuccessModal onClose={() => setShowNotifyModal(false)} />
      )}

      {/* 4. Request Again Confirmation Modal */}
      {showRequestModal && (
        <RequestSuccessModal onClose={() => setShowRequestModal(false)} />
      )}

      {/* 5. Location Permission Modal */}
      {showLocationPopup && (
        <LocationPermissionPopup
          onConfirm={confirmLocation}
          onDismiss={dismissLocation}
        />
      )}

      {/* Animations styling */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shrinkProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes skeletonPulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}