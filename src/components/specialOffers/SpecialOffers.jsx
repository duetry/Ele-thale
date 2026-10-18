'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Store,
  Clock,
  Search,
  Phone,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertCircle,
  LogIn,
} from 'lucide-react';
import { selectSelectedLocation } from '@/app/features/adminPanel/adminPanelSlice';
import { selectIsAuthenticated } from '@/app/features/auth/authSlice';
import LoginPopup from '@/components/LoginPopup';

/* =========================================================
   API CONFIGURATION & CONSTANTS
   ========================================================= */
const API_BASE = 'https://dxaoss4u5f.execute-api.us-east-1.amazonaws.com/ET_UAT';
const DEFAULT_LOCATION_ID = 'b2d85b75-684d-4cae-a990-aa317f7d27dd';
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=300&fit=crop';

/* =========================================================
   AUTH STORAGE HELPER (SSR SAFE)
   ========================================================= */
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  const local = localStorage.getItem('authToken');
  if (local && local !== 'null' && local !== 'undefined') return local;
  const cookieMatch = document.cookie.match(/(?:^|;\s*)authToken=([^;]*)/);
  if (cookieMatch && cookieMatch[1]) return decodeURIComponent(cookieMatch[1]);
  return null;
};

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/* =========================================================
   HAVERSINE DISTANCE UTILITY
   ========================================================= */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function formatDistance(dist) {
  if (dist === null || dist === undefined || isNaN(dist)) return null;
  if (dist < 1) {
    return `${Math.round(dist * 1000)} m away`;
  }
  if (dist < 10) {
    return `${dist.toFixed(1)} km away`;
  }
  return `${Math.round(dist)} km away`;
}

/* =========================================================
   TIME & OPEN/CLOSED STATUS CALCULATOR
   ========================================================= */
const timeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const cleanStr = String(timeStr).trim().toLowerCase();
  const isPM = cleanStr.includes('pm');
  const isAM = cleanStr.includes('am');
  const numericParts = cleanStr.replace(/[a-z\s]/g, '').trim();
  const parts = numericParts.split(':');
  if (parts.length < 2) return null;
  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return null;
  if (isPM && hours < 12) hours += 12;
  else if (isAM && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const format12HourTime = (timeStr) => {
  if (!timeStr) return '';
  const cleanStr = String(timeStr).trim();
  const lower = cleanStr.toLowerCase();
  if (lower.includes('am') || lower.includes('pm')) {
    return cleanStr.toUpperCase();
  }
  const parts = lower.split(':');
  if (parts.length < 2) return cleanStr;
  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return cleanStr;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${displayHours}:${displayMinutes} ${period}`;
};

const getShopOpenStatus = (startTime, endTime) => {
  const openMins = timeToMinutes(startTime);
  const closeMins = timeToMinutes(endTime);
  if (openMins === null || closeMins === null) {
    return { isOpen: true, text: 'Open' };
  }

  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();

  let isOpen = false;
  if (closeMins > openMins) {
    isOpen = currentMins >= openMins && currentMins < closeMins;
  } else {
    // Handles overnight store hours (e.g. 9:00 PM to 5:00 AM)
    isOpen = currentMins >= openMins || currentMins < closeMins;
  }

  const formattedStart = format12HourTime(startTime);
  const formattedEnd = format12HourTime(endTime);

  return {
    isOpen,
    text: isOpen
      ? `Open • Closes ${formattedEnd}`
      : `Closed • Opens ${formattedStart}`,
  };
};

/* =========================================================
   PHONE NUMBER VALIDATOR
   ========================================================= */
const getValidPhone = (shop) => {
  const phone = shop.Phoneno || shop.PhoneNo || shop.Phone || shop.phone;
  if (!phone) return null;
  const str = String(phone).trim().toLowerCase();
  if (['null', 'n/a', 'undefined', 'none', ''].includes(str)) return null;
  const cleanDigits = str.replace(/[^\d+]/g, '');
  if (cleanDigits.replace(/[^\d]/g, '').length < 5) return null;
  return cleanDigits;
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */
export default function SpecialOffers() {
  const router = useRouter();
  const dispatch = useDispatch();

  const selectedLocation = useSelector(selectSelectedLocation);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [stores, setStores] = useState([]);
  const [storesLoading, setStoresLoading] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const categoryScrollRef = useRef(null);

  /* ------------------ 1. HTML5 BROWSER GEOLOCATION ------------------ */
  useEffect(() => {
    let isMounted = true;
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (isMounted && pos?.coords) {
            setUserLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          }
        },
        (err) => {
          // Fallback to low-accuracy network provider if high accuracy times out indoors
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              if (isMounted && pos?.coords) {
                setUserLocation({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                });
              }
            },
            (err2) => {
              console.warn('Geolocation low accuracy error:', err2);
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
          );
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
      );
    }

    return () => {
      isMounted = false;
    };
  }, []);

  /* ------------------ 2. FETCH CATEGORIES ON MOUNT ------------------ */
  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await fetch(`${API_BASE}/Categories`, {
          method: 'GET',
          headers: getHeaders(),
        });

        const data = await res.json();
        if (res.ok && isMounted) {
          const list = Array.isArray(data) ? data : data?.data || [];
          setCategories(list);
          // Auto-select the first category on initial load
          if (list.length > 0) {
            setSelectedCategoryId((prev) => (prev !== null ? prev : list[0]?.Categoryid));
          }
        } else if (isMounted) {
          // If token missing or endpoint requires auth
          const fallbackList = [
            { Categoryid: 'all', Categoryname: 'All Shops' },
            { Categoryid: 'grocery', Categoryname: 'Groceries' },
            { Categoryid: 'fashion', Categoryname: 'Fashion' },
            { Categoryid: 'electronics', Categoryname: 'Electronics' },
            { Categoryid: 'food', Categoryname: 'Restaurants' },
            { Categoryid: 'health', Categoryname: 'Pharmacy' },
          ];
          setCategories(fallbackList);
          setSelectedCategoryId((prev) => (prev !== null ? prev : fallbackList[0].Categoryid));
        }
      } catch (err) {
        console.warn('Error loading categories:', err);
      } finally {
        if (isMounted) {
          setCategoriesLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ------------------ 3. SEARCH DEBOUNCE (400ms) ------------------ */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

  /* ------------------ 4. FETCH SHOPS (GET_ShopSearch) ------------------ */
  useEffect(() => {
    const activeLocationId =
      selectedLocation?.LocationId || DEFAULT_LOCATION_ID;

    // Wait until either search is active or a category is selected
    if (!debouncedSearch && !selectedCategoryId) {
      return;
    }

    const abortController = new AbortController();

    const fetchShops = async () => {
      try {
        setStoresLoading(true);

        let url = `${API_BASE}/GET_ShopSearch?LocationId=${encodeURIComponent(
          activeLocationId
        )}`;

        // When searching: append SearchShop (do NOT append Categoryid)
        // When not searching: append Categoryid
        if (debouncedSearch) {
          url += `&SearchShop=${encodeURIComponent(debouncedSearch)}`;
        } else if (selectedCategoryId && selectedCategoryId !== 'all') {
          url += `&Categoryid=${encodeURIComponent(selectedCategoryId)}`;
        }

        const res = await fetch(url, {
          method: 'GET',
          headers: getHeaders(),
          signal: abortController.signal,
        });

        const data = await res.json();
        if (res.ok) {
          // Safely extract shop array from response
          const raw =
            data?.data?.stores ||
            data?.data ||
            data?.stores ||
            data?.shops ||
            [];
          setStores(Array.isArray(raw) ? raw : []);
        } else {
          setStores([]);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Error fetching shop search:', err);
          setStores([]);
        }
      } finally {
        setStoresLoading(false);
      }
    };

    fetchShops();

    return () => {
      abortController.abort();
    };
  }, [debouncedSearch, selectedCategoryId, selectedLocation?.LocationId]);

  /* ------------------ 5. ASCENDING DISTANCE SORTING ------------------ */
  const sortedStores = useMemo(() => {
    return [...stores].sort((a, b) => {
      const latA = parseFloat(a.Latitude || a.latitude);
      const lngA = parseFloat(a.Longitude || a.longitude);
      const latB = parseFloat(b.Latitude || b.latitude);
      const lngB = parseFloat(b.Longitude || b.longitude);

      const hasCoordsA =
        !isNaN(latA) && !isNaN(lngA) && latA !== 0 && lngA !== 0;
      const hasCoordsB =
        !isNaN(latB) && !isNaN(lngB) && latB !== 0 && lngB !== 0;

      const distA =
        userLocation && hasCoordsA
          ? haversineDistance(userLocation.lat, userLocation.lng, latA, lngA)
          : a.Kilometer !== undefined &&
            a.Kilometer !== null &&
            a.Kilometer !== '' &&
            !isNaN(Number(a.Kilometer))
          ? Number(a.Kilometer)
          : a.Distance && !isNaN(parseFloat(a.Distance))
          ? parseFloat(a.Distance)
          : Infinity;

      const distB =
        userLocation && hasCoordsB
          ? haversineDistance(userLocation.lat, userLocation.lng, latB, lngB)
          : b.Kilometer !== undefined &&
            b.Kilometer !== null &&
            b.Kilometer !== '' &&
            !isNaN(Number(b.Kilometer))
          ? Number(b.Kilometer)
          : b.Distance && !isNaN(parseFloat(b.Distance))
          ? parseFloat(b.Distance)
          : Infinity;

      return (isNaN(distA) ? Infinity : distA) - (isNaN(distB) ? Infinity : distB);
    });
  }, [stores, userLocation]);

  /* ------------------ 6. DISTANCE TEXT CALCULATOR ------------------ */
  const getStoreDistanceText = (shop) => {
    const storeLat = parseFloat(shop.Latitude || shop.latitude);
    const storeLng = parseFloat(shop.Longitude || shop.longitude);
    const hasStoreCoords =
      !isNaN(storeLat) && !isNaN(storeLng) && storeLat !== 0 && storeLng !== 0;

    if (userLocation && hasStoreCoords) {
      const km = haversineDistance(
        userLocation.lat,
        userLocation.lng,
        storeLat,
        storeLng
      );
      return formatDistance(km);
    }
    if (
      shop.Kilometer !== undefined &&
      shop.Kilometer !== null &&
      shop.Kilometer !== ''
    ) {
      const km = Number(shop.Kilometer);
      if (!isNaN(km)) return formatDistance(km);
    }
    if (
      shop.Distance !== undefined &&
      shop.Distance !== null &&
      shop.Distance !== ''
    ) {
      if (
        typeof shop.Distance === 'string' &&
        (shop.Distance.includes('km') || shop.Distance.includes('m away'))
      ) {
        return shop.Distance;
      }
      const num = parseFloat(shop.Distance);
      if (!isNaN(num)) return formatDistance(num);
    }
    return null;
  };

  /* ------------------ 7. CARD CLICK -> GOOGLE MAPS ------------------ */
  const handleCardClick = (shop) => {
    if (shop.StoreLocation && String(shop.StoreLocation).startsWith('http')) {
      window.open(shop.StoreLocation, '_blank', 'noopener,noreferrer');
      return;
    }
    const lat = shop.Latitude || shop.latitude;
    const lng = shop.Longitude || shop.longitude;
    let query = '';
    if (lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
      query = `${lat},${lng}`;
    } else {
      query =
        shop.Storeaddress ||
        shop.Storename ||
        shop.StoreName ||
        selectedLocation?.Name ||
        'Manapparai';
    }
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query
    )}`;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };

  /* ------------------ 8. PHONE CALL HANDLER ------------------ */
  const handlePhoneCall = (e, phone) => {
    e.stopPropagation();
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  };

  const isSearching = searchInput.trim().length > 0;
  const activeLocationName =
    selectedLocation?.Name || selectedLocation?.name || 'Manapparai';

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#F8FAFC',
        paddingTop: 88,
        paddingBottom: 100,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 16px' }}>

        {/* ── HEADER ── */}
        <header style={{ marginBottom: 20 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: '#1E293B',
              letterSpacing: '-0.5px',
              margin: '0 0 6px',
            }}
          >
            Nearby Shops
          </h1>
          <p
            style={{
              fontSize: 14,
              color: '#64748B',
              fontWeight: 500,
              margin: 0,
            }}
          >
            Find the best shops near you
          </p>
        </header>

        {/* ── SEARCH INPUT BAR ── */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8',
              width: 20,
              height: 20,
              pointerEvents: 'none',
            }}
          />
          <input
            id="nearby-shops-search-input"
            type="text"
            placeholder="Search for products"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 44px 14px 48px',
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 14,
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
              color: '#1E293B',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#6F42F5';
              e.target.style.boxShadow = '0 0 0 4px rgba(111, 66, 245, 0.12)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E2E8F0';
              e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
            }}
          />
          {searchInput && (
            <button
              id="nearby-shops-search-clear"
              onClick={() => setSearchInput('')}
              aria-label="Clear search"
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#E2E8F0';
                e.currentTarget.style.color = '#1E293B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#F1F5F9';
                e.currentTarget.style.color = '#64748B';
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* ── CATEGORY CHIPS (Visible ONLY when search input is EMPTY) ── */}
        {!isSearching && (
          <div
            ref={categoryScrollRef}
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 12,
              marginBottom: 12,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {categoriesLoading && categories.length === 0 ? (
              // Skeleton loading for category chips
              Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    height: 38,
                    width: 100 + (idx % 3) * 20,
                    borderRadius: 999,
                    background: '#E2E8F0',
                    animation: 'pulse 1.5s infinite',
                    flexShrink: 0,
                  }}
                />
              ))
            ) : (
              categories.map((cat) => {
                const isSelected = selectedCategoryId === cat.Categoryid;
                return (
                  <button
                    id={`category-chip-${cat.Categoryid}`}
                    key={cat.Categoryid}
                    onClick={() => setSelectedCategoryId(cat.Categoryid)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 999,
                      border: isSelected
                        ? '1px solid #6F42F5'
                        : '1px solid #E2E8F0',
                      background: isSelected ? '#6F42F5' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#64748B',
                      fontSize: 13,
                      fontWeight: isSelected ? 700 : 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected
                        ? '0 4px 14px rgba(111, 66, 245, 0.25)'
                        : '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = '#F8FAFC';
                        e.currentTarget.style.borderColor = '#CBD5E1';
                        e.currentTarget.style.color = '#334155';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.color = '#64748B';
                      }
                    }}
                  >
                    {cat.Categoryname}
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* ── SEARCH ACTIVE BANNER ── */}
        {isSearching && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F3F0FF',
              border: '1px solid #E4DCFF',
              borderRadius: 16,
              padding: '12px 16px',
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: '#E4DCFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
                flexShrink: 0,
              }}
            >
              <Search size={20} color="#6F42F5" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#1E293B',
                  margin: '0 0 2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                Results for &quot;{searchInput.trim()}&quot;
              </p>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#64748B',
                  margin: 0,
                }}
              >
                Showing shops across all categories
              </p>
            </div>
          </div>
        )}

        {/* ── INFO BAR ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            padding: '0 4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin style={{ color: '#6F42F5', width: 17, height: 17, flexShrink: 0 }} />
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#1E293B',
              }}
            >
              Shops near {activeLocationName}
            </span>
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: '#6F42F5',
            }}
          >
            {sortedStores.length}{' '}
            {sortedStores.length === 1 ? 'Result' : 'Results'}
          </span>
        </div>

        {/* ── NOT AUTHENTICATED HINT (if visitor isn't logged in) ── */}
        {!isAuthenticated && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 14,
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 13, color: '#92400E', fontWeight: 500 }}>
                Log in to unlock all local deals and save favorite stores!
              </p>
            </div>
            <button
              onClick={() => setShowLogin(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: '#D97706',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <LogIn size={13} />
              <span>Log In</span>
            </button>
          </div>
        )}

        {/* ── SHOPS LIST / STATES ── */}
        {storesLoading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 0',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                border: '3px solid #E2E8F0',
                borderTopColor: '#6F42F5',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <p
              style={{
                fontSize: 13,
                color: '#64748B',
                fontWeight: 600,
                margin: 0,
              }}
            >
              Searching stores...
            </p>
          </div>
        ) : sortedStores.length === 0 ? (
          /* Empty State */
          <div
            style={{
              textAlign: 'center',
              padding: '60px 24px',
              background: '#FFFFFF',
              borderRadius: 20,
              border: '1.5px dashed #CBD5E1',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            <Store
              style={{
                width: 48,
                height: 48,
                color: '#94A3B8',
                margin: '0 auto 16px',
              }}
            />
            <h2
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: '#1E293B',
                margin: '0 0 6px',
              }}
            >
              No Shops Found
            </h2>
            <p
              style={{
                fontSize: 13,
                color: '#64748B',
                maxWidth: 420,
                margin: '0 auto 16px',
                lineHeight: 1.5,
              }}
            >
              Try selecting a different category or refining your search keywords.
            </p>
            {isSearching && (
              <button
                onClick={() => setSearchInput('')}
                style={{
                  background: '#6F42F5',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(111, 66, 245, 0.25)',
                }}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          /* Store Cards Grid / Stack */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sortedStores.map((shop, index) => {
              const shopId = shop.Storeid || shop.StoreId || shop.id || index;
              const shopName =
                shop.Storename || shop.StoreName || 'Local Store';
              const shopImage =
                shop.Imageurl ||
                shop.ImageUrl ||
                shop.image ||
                shop.imageUrl ||
                FALLBACK_IMAGE;

              const status = getShopOpenStatus(
                shop.StartTime || shop.Starttime || '9:00 AM',
                shop.EndTime || shop.Endtime || '9:00 PM'
              );

              const distanceText = getStoreDistanceText(shop);
              const validPhone = getValidPhone(shop);

              return (
                <article
                  id={`shop-card-${shopId}`}
                  key={shopId}
                  onClick={() => handleCardClick(shop)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#FFFFFF',
                    padding: 16,
                    borderRadius: 18,
                    border: '1px solid #F1F5F9',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 10px 24px rgba(0,0,0,0.06)';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 3px 10px rgba(0,0,0,0.03)';
                    e.currentTarget.style.borderColor = '#F1F5F9';
                  }}
                >
                  {/* Shop Thumbnail */}
                  <div
                    style={{
                      width: 86,
                      height: 86,
                      borderRadius: 14,
                      overflow: 'hidden',
                      background: '#F1F5F9',
                      marginRight: 16,
                      flexShrink: 0,
                      position: 'relative',
                    }}
                  >
                    <img
                      src={shopImage}
                      alt={shopName}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>

                  {/* Middle Column: Shop Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Store Name */}
                    <h2
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#0F172A',
                        margin: '0 0 6px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {shopName}
                    </h2>

                    {/* Open/Closed Badge & Store Hours */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        flexWrap: 'wrap',
                      }}
                    >
                      {/* Status Pill */}
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          background: status.isOpen ? '#ECFDF5' : '#FEF2F2',
                          color: status.isOpen ? '#065F46' : '#991B1B',
                          border: `1px solid ${
                            status.isOpen ? '#A7F3D0' : '#FECACA'
                          }`,
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          lineHeight: 1.2,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: status.isOpen ? '#10B981' : '#EF4444',
                            display: 'inline-block',
                          }}
                        />
                        {status.text}
                      </span>

                      {/* Store Address / Subcategory hint if available */}
                      {shop.Storeaddress && (
                        <span
                          style={{
                            fontSize: 12,
                            color: '#64748B',
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: 180,
                          }}
                        >
                          {shop.Storeaddress}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Distance & Actions */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: 10,
                      marginLeft: 12,
                      flexShrink: 0,
                    }}
                  >
                    {/* Distance Badge */}
                    {distanceText && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          color: '#475569',
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        <MapPin
                          size={14}
                          style={{ color: '#6F42F5', flexShrink: 0 }}
                        />
                        <span>{distanceText}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      {/* Call Button (only if valid phone exists) */}
                      {validPhone && (
                        <button
                          id={`shop-call-btn-${shopId}`}
                          onClick={(e) => handlePhoneCall(e, validPhone)}
                          aria-label={`Call ${shopName}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            background: '#FFFFFF',
                            border: '1.5px solid #6F42F5',
                            color: '#6F42F5',
                            padding: '6px 14px',
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#6F42F5';
                            e.currentTarget.style.color = '#FFFFFF';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#FFFFFF';
                            e.currentTarget.style.color = '#6F42F5';
                          }}
                        >
                          <Phone size={12} />
                          <span>Call</span>
                        </button>
                      )}

                      {/* External Map Icon or Chevron */}
                      <div
                        title="Open in Google Maps"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: '#F8FAFC',
                          color: '#94A3B8',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#F3F0FF';
                          e.currentTarget.style.color = '#6F42F5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#F8FAFC';
                          e.currentTarget.style.color = '#94A3B8';
                        }}
                      >
                        <ExternalLink size={16} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Popups */}
      {showLogin && <LoginPopup close={() => setShowLogin(false)} />}

      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </main>
  );
}