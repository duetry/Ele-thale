'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import MapIcon from '@mui/icons-material/Map';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import PlaceIcon from '@mui/icons-material/Place';

const TILE_SERVERS = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
    name: 'OpenStreetMap',
  },
  googleRoadmap: {
    url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps',
    name: 'Google Maps (Roadmap)',
  },
  googleSatellite: {
    url: 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps Hybrid',
    name: 'Satellite',
  },
};

// Google Open Location Code (Plus Code) encoder
const PLUS_CODE_ALPHABET = '23456789CFGHJMPQRVWX';

function encodePlusCode(lat, lng) {
  let latitude = Math.min(Math.max(parseFloat(lat), -90), 90);
  let longitude = Math.min(Math.max(parseFloat(lng), -180), 180);

  if (latitude === 90) latitude = 89.9999999;
  if (longitude === 180) longitude = 179.9999999;

  let latVal = latitude + 90;
  let lngVal = longitude + 180;

  let code = '';
  const gridSizes = [20, 1, 0.05, 0.0025, 0.000125];

  for (let i = 0; i < 4; i++) {
    const size = gridSizes[i];
    const latDigit = Math.floor(latVal / size);
    const lngDigit = Math.floor(lngVal / size);
    code += PLUS_CODE_ALPHABET[latDigit] + PLUS_CODE_ALPHABET[lngDigit];
    latVal -= latDigit * size;
    lngVal -= lngDigit * size;
    if (i === 1) code += '+';
  }

  const size = gridSizes[4];
  const latDigit = Math.floor(latVal / size);
  const lngDigit = Math.floor(lngVal / size);
  code += PLUS_CODE_ALPHABET[latDigit] + PLUS_CODE_ALPHABET[lngDigit];

  return code;
}

function getShortPlusCode(fullCode) {
  if (!fullCode || fullCode.length < 8) return fullCode || '';
  return fullCode.length >= 11 ? fullCode.slice(4) : fullCode;
}

const LocationMapPicker = ({
  latitude,
  longitude,
  address,
  shopName = '',
  onLocationSelect,
  label = "Store Location Picker",
  mapHeight = "360px",
}) => {
  const mapRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const currentTileLayerRef = useRef(null);
  const markerInstance = useRef(null);

  // Request counter to safely discard stale async geocoding responses
  const activeReverseReqId = useRef(0);

  const shopNameRef = useRef(shopName);
  useEffect(() => {
    shopNameRef.current = shopName;
  }, [shopName]);

  const [searchQuery, setSearchQuery] = useState(address || '');
  const [mapType, setMapType] = useState('googleRoadmap');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchSource, setSearchSource] = useState(null);

  // Keep search input synced when address prop changes from outside (e.g. form reset or prefill)
  const lastPropAddressRef = useRef(address);
  useEffect(() => {
    if (address && address !== lastPropAddressRef.current) {
      lastPropAddressRef.current = address;
      setSearchQuery(address);
    }
  }, [address]);

  // Reverse geocode coordinates to get structured street address without altering shop name
  const reverseGeocode = useCallback(async (lat, lng) => {
    const currentReqId = ++activeReverseReqId.current;
    setLoadingGeo(true);

    try {
      const res = await fetch('/api/reverse-geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng }),
      });

      if (!res.ok) throw new Error('Reverse geocode failed');
      const data = await res.json();

      // Guard against race conditions: ignore if another request started later
      if (currentReqId !== activeReverseReqId.current) return;

      const formattedAddress = data.formattedAddress || '';
      const fullPlusCode = data.plusCode || encodePlusCode(lat, lng);
      const shortPlus = getShortPlusCode(fullPlusCode);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

      if (formattedAddress) {
        setSearchQuery(formattedAddress);
      }

      if (onLocationSelect) {
        onLocationSelect({
          lat,
          lng,
          address: formattedAddress,
          plusCode: shortPlus,
          fullPlusCode: fullPlusCode,
          googleMapsUrl,
          cityOrTown: data.cityOrTown || '',
          state: data.state || '',
          postcode: data.postcode || '',
          isDirectSelection: false, // Map click/drag: do not overwrite Storename
        });
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      if (currentReqId !== activeReverseReqId.current) return;

      const fullPlusCode = encodePlusCode(lat, lng);
      const shortPlus = getShortPlusCode(fullPlusCode);
      const fallbackAddress = `Lat: ${lat.toFixed(7)}, Lng: ${lng.toFixed(7)}`;
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

      if (onLocationSelect) {
        onLocationSelect({
          lat,
          lng,
          address: searchQuery || fallbackAddress,
          plusCode: shortPlus,
          googleMapsUrl,
          isDirectSelection: false,
        });
      }
    } finally {
      if (currentReqId === activeReverseReqId.current) {
        setLoadingGeo(false);
      }
    }
  }, [onLocationSelect, searchQuery]);

  // Load Leaflet and setup interactive map
  useEffect(() => {
    let isMounted = true;

    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;

      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const L = await import('leaflet');
      if (!isMounted) return;

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const initialLat = parseFloat(latitude) || 10.6058; // Manapparai default
      const initialLng = parseFloat(longitude) || 78.4180;

      if (mapRef.current && !leafletMapInstance.current) {
        const map = L.map(mapRef.current, {
          center: [initialLat, initialLng],
          zoom: parseFloat(latitude) && parseFloat(longitude) ? 17 : 14,
          zoomControl: true,
        });

        const tileConfig = TILE_SERVERS[mapType] || TILE_SERVERS.googleRoadmap;
        const initialLayer = L.tileLayer(tileConfig.url, {
          maxZoom: tileConfig.maxZoom,
          subdomains: tileConfig.subdomains,
          attribution: tileConfig.attribution,
        }).addTo(map);

        currentTileLayerRef.current = initialLayer;

        const customMarker = L.marker([initialLat, initialLng], {
          draggable: true,
        }).addTo(map);

        // Marker drag handler: immediately update form coords, then reverse-geocode address
        customMarker.on('dragend', async () => {
          const pos = customMarker.getLatLng();
          const lat = parseFloat(pos.lat.toFixed(7));
          const lng = parseFloat(pos.lng.toFixed(7));

          // Send exact coords immediately to the form
          if (onLocationSelect) {
            onLocationSelect({
              lat,
              lng,
              isDirectSelection: false,
            });
          }

          await reverseGeocode(lat, lng);
        });

        // Map click handler: place marker at clicked location, update coords immediately
        map.on('click', async (e) => {
          const lat = parseFloat(e.latlng.lat.toFixed(7));
          const lng = parseFloat(e.latlng.lng.toFixed(7));
          customMarker.setLatLng([lat, lng]);

          if (onLocationSelect) {
            onLocationSelect({
              lat,
              lng,
              isDirectSelection: false,
            });
          }

          await reverseGeocode(lat, lng);
        });

        leafletMapInstance.current = map;
        markerInstance.current = customMarker;
        setMapReady(true);
      }
    };

    loadLeaflet();

    return () => {
      isMounted = false;
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
        leafletMapInstance.current = null;
        markerInstance.current = null;
        currentTileLayerRef.current = null;
      }
    };
  }, []);

  // Handle switching map layers (Google Maps / Satellite / OSM)
  const handleMapTypeChange = async (event, newType) => {
    if (!newType || newType === mapType || !leafletMapInstance.current) return;
    setMapType(newType);

    const L = await import('leaflet');
    const tileConfig = TILE_SERVERS[newType];

    if (currentTileLayerRef.current) {
      leafletMapInstance.current.removeLayer(currentTileLayerRef.current);
    }

    const newLayer = L.tileLayer(tileConfig.url, {
      maxZoom: tileConfig.maxZoom,
      subdomains: tileConfig.subdomains,
      attribution: tileConfig.attribution,
    }).addTo(leafletMapInstance.current);

    currentTileLayerRef.current = newLayer;
  };

  // Sync marker position when latitude or longitude props change externally (e.g. edit mode initialization)
  useEffect(() => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lng) && leafletMapInstance.current && markerInstance.current) {
      const currentPos = markerInstance.current.getLatLng();
      if (Math.abs(currentPos.lat - lat) > 0.000001 || Math.abs(currentPos.lng - lng) > 0.000001) {
        markerInstance.current.setLatLng([lat, lng]);
        leafletMapInstance.current.setView([lat, lng], Math.max(leafletMapInstance.current.getZoom(), 16));
      }
    }
  }, [latitude, longitude]);

  // Check if search query contains coordinates or a Google Maps URL
  const checkCoordinatesOrUrl = async (str) => {
    if (!str) return null;
    const trimmed = str.trim();

    // Check for coordinates or Google Maps links
    const isUrl = trimmed.includes('http://') || trimmed.includes('https://') || trimmed.includes('google.com/maps') || trimmed.includes('goo.gl');
    const isCoordPair = /^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/.test(trimmed);

    if (isUrl || isCoordPair) {
      try {
        const res = await fetch('/api/resolve-maps-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: trimmed }),
        });
        const data = await res.json();
        if (data && data.lat !== null && data.lng !== null) {
          return {
            lat: data.lat,
            lng: data.lng,
            placeName: data.placeName || '',
            formattedAddress: data.formattedAddress || '',
            resolvedUrl: data.resolvedUrl || trimmed,
            placeId: data.placeId || null,
          };
        }
      } catch (err) {
        console.error('Error resolving URL or coordinates in picker:', err);
      }
    }

    return null;
  };

  // Execute Search: Google Places API (New) via /api/places-search
  const handleSearchPlaces = async (queryStr) => {
    const q = queryStr !== undefined ? queryStr : searchQuery;
    if (!q || q.trim().length < 2) return;

    setLoadingSearch(true);
    try {
      // 1. First check if user pasted a URL or coordinate pair
      const directData = await checkCoordinatesOrUrl(q);
      if (directData && directData.lat && directData.lng) {
        const lat = directData.lat;
        const lng = directData.lng;

        if (leafletMapInstance.current && markerInstance.current) {
          markerInstance.current.setLatLng([lat, lng]);
          leafletMapInstance.current.setView([lat, lng], 17);
        }
        setShowSuggestions(false);

        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        if (onLocationSelect) {
          onLocationSelect({
            lat,
            lng,
            address: directData.formattedAddress || searchQuery,
            placeName: directData.placeName || '',
            placeId: directData.placeId,
            googleMapsUrl,
            isDirectSelection: true,
          });
        }
        return;
      }

      // 2. Perform search using Google Places API (New) backend endpoint
      const currentLat = parseFloat(latitude) || 10.6058;
      const currentLng = parseFloat(longitude) || 78.4180;

      const res = await fetch('/api/places-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          biasLat: currentLat,
          biasLng: currentLng,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.places || []);
        setSearchSource(data.source || 'google');
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error('Places search error:', err);
      setSuggestions([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Auto-search suggestions as user types (debounced at 400ms)
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    // Don't auto-search if query matches the current address prop
    if (searchQuery === address) {
      return;
    }

    const timer = setTimeout(() => {
      handleSearchPlaces(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle selecting a place from the Google Places / OSM dropdown
  const handleSelectSuggestion = (place) => {
    if (!place || place.lat === null || place.lng === null) return;

    const lat = parseFloat(place.lat.toFixed(7));
    const lng = parseFloat(place.lng.toFixed(7));
    const placeAddress = place.formattedAddress || place.name || '';
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    setShowSuggestions(false);
    setSearchQuery(placeAddress);

    // Pin marker to exact Google Places coordinates
    if (leafletMapInstance.current && markerInstance.current) {
      markerInstance.current.setLatLng([lat, lng]);
      leafletMapInstance.current.setView([lat, lng], 17);
    }

    // Direct selection: preserve business name and exact coordinates, do not trigger reverse geocode overwrite
    if (onLocationSelect) {
      onLocationSelect({
        lat,
        lng,
        address: placeAddress,
        placeName: place.name || '',
        placeId: place.id || null,
        googleMapsUrl,
        isDirectSelection: true,
      });
    }
  };

  // GPS Current Location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLoadingGeo(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(7));
        const lng = parseFloat(pos.coords.longitude.toFixed(7));

        if (leafletMapInstance.current && markerInstance.current) {
          markerInstance.current.setLatLng([lat, lng]);
          leafletMapInstance.current.setView([lat, lng], 17);
        }

        if (onLocationSelect) {
          onLocationSelect({
            lat,
            lng,
            isDirectSelection: false,
          });
        }

        await reverseGeocode(lat, lng);
      },
      (err) => {
        console.error('GPS Geolocation error:', err);
        alert('Could not retrieve your location. Please check browser permissions.');
        setLoadingGeo(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Open in official Google Maps
  const handleOpenGoogleMaps = () => {
    const lat = parseFloat(latitude) || 10.6058;
    const lng = parseFloat(longitude) || 78.4180;
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  // Copy Direct Google Maps Link
  const handleCopyLink = () => {
    const lat = parseFloat(latitude) || 10.6058;
    const lng = parseFloat(longitude) || 78.4180;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const currentPlusCode = latitude && longitude ? encodePlusCode(latitude, longitude) : '';
  const currentShortPlus = getShortPlusCode(currentPlusCode);

  return (
    <Box sx={{ width: '100%', mb: 1 }}>
      {/* Header controls: Title & Map Type Switcher */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <MapIcon sx={{ fontSize: 18, color: '#6366f1' }} />
          {label}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ToggleButtonGroup
            value={mapType}
            exclusive
            onChange={handleMapTypeChange}
            size="small"
            sx={{
              height: '32px',
              '& .MuiToggleButton-root': {
                fontSize: '11px',
                fontWeight: 600,
                px: 1.2,
                py: 0.2,
                textTransform: 'none',
                borderColor: '#cbd5e1',
                color: '#475569',
                '&.Mui-selected': {
                  backgroundColor: '#6366f1',
                  color: '#ffffff',
                  fontWeight: 700,
                  '&:hover': { backgroundColor: '#4f46e5' },
                },
              },
            }}
          >
            <ToggleButton value="googleRoadmap" title="Google Maps Roadmap">
              🗺️ Google Maps
            </ToggleButton>
            <ToggleButton value="googleSatellite" title="Google Satellite View">
              🛰️ Satellite
            </ToggleButton>
            <ToggleButton value="osm" title="OpenStreetMap Layer (Terms Compliant)">
              🌐 OSM
            </ToggleButton>
          </ToggleButtonGroup>

          <Tooltip title="Use current GPS location">
            <Button
              size="small"
              variant="outlined"
              startIcon={<MyLocationIcon sx={{ fontSize: 14 }} />}
              onClick={handleGetCurrentLocation}
              disabled={loadingGeo}
              sx={{
                height: '32px',
                fontSize: '12px',
                textTransform: 'none',
                borderRadius: '8px',
                borderColor: '#cbd5e1',
                color: '#475569',
                '&:hover': { borderColor: '#6366f1', color: '#6366f1' },
              }}
            >
              {loadingGeo ? 'Locating...' : 'My Location'}
            </Button>
          </Tooltip>

          <Tooltip title="Open pin in Google Maps">
            <IconButton
              size="small"
              onClick={handleOpenGoogleMaps}
              sx={{
                height: '32px',
                width: '32px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                color: '#ea4335',
                '&:hover': { backgroundColor: '#fef2f2', borderColor: '#ea4335' },
              }}
            >
              <OpenInNewIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Business & Address Search Bar (Google Places API New) */}
      <Box sx={{ position: 'relative', mb: 1.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search business name (e.g. Mathi Bakes, Manapparai), address, or paste link..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearchPlaces();
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#6366f1', fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {loadingSearch || loadingGeo ? (
                  <CircularProgress size={18} />
                ) : (
                  <IconButton
                    size="small"
                    onClick={() => handleSearchPlaces()}
                    title="Search business"
                    sx={{ color: '#6366f1' }}
                  >
                    <SearchIcon size="small" />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: '#ffffff',
            },
          }}
        />

        {/* Autocomplete Dropdown List powered by Google Places API (New) */}
        {showSuggestions && (
          suggestions.length > 0 ? (
            <Paper
              elevation={8}
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 9999,
                mt: 0.5,
                maxHeight: 280,
                overflowY: 'auto',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
              }}
            >
              <Box sx={{ px: 2, py: 1, backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {searchSource === 'google' ? 'Google Places Search Results' : 'Search Results'}
                </Typography>
                <Chip
                  label={searchSource === 'google' ? 'Google Places API' : 'OpenStreetMap'}
                  size="small"
                  sx={{
                    height: '20px',
                    fontSize: '10px',
                    fontWeight: 700,
                    backgroundColor: searchSource === 'google' ? '#e0f2fe' : '#f1f5f9',
                    color: searchSource === 'google' ? '#0369a1' : '#475569',
                  }}
                />
              </Box>

              <List density="compact" disablePadding>
                {suggestions.map((item, index) => (
                  <ListItem
                    button
                    key={item.id || index}
                    onClick={() => handleSelectSuggestion(item)}
                    sx={{
                      py: 1.2,
                      px: 2,
                      borderBottom: index < suggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                      '&:hover': { backgroundColor: '#f0fdf4' },
                    }}
                  >
                    <PlaceIcon sx={{ fontSize: 18, color: '#ef4444', mr: 1.5, mt: 0.3, alignSelf: 'flex-start' }} />
                    <ListItemText
                      primary={item.name || item.formattedAddress}
                      primaryTypographyProps={{
                        fontSize: '13px',
                        color: '#0f172a',
                        fontWeight: 700,
                      }}
                      secondary={item.formattedAddress && item.name ? item.formattedAddress : `Coordinates: ${item.lat}, ${item.lng}`}
                      secondaryTypographyProps={{ fontSize: '11px', color: '#64748b', mt: 0.3 }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          ) : (
            !loadingSearch && searchQuery && searchQuery.trim().length >= 2 && (
              <Paper
                elevation={6}
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 9999,
                  mt: 0.5,
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  p: 2,
                  textAlign: 'center',
                  background: '#ffffff',
                }}
              >
                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                  No exact match found for &quot;{searchQuery}&quot;
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 1.5 }}>
                  You can click directly on the map to pin the location, or search in Google Maps and paste the link below.
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                  onClick={() => {
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`,
                      '_blank'
                    );
                    setShowSuggestions(false);
                  }}
                  sx={{
                    textTransform: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #ea4335, #db4437)',
                    color: '#fff',
                    px: 2,
                    '&:hover': { background: '#c5221f' },
                  }}
                >
                  Search &quot;{searchQuery}&quot; on Google Maps ↗
                </Button>
              </Paper>
            )
          )
        )}
      </Box>

      {/* Map View Container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: mapHeight,
          borderRadius: '14px',
          overflow: 'hidden',
          border: '2px solid #6366f1',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)',
          '& .leaflet-container': {
            width: '100%',
            height: '100%',
            zIndex: 1,
          },
        }}
      >
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {!mapReady && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8fafc',
              zIndex: 2,
            }}
          >
            <CircularProgress size={30} />
            <Typography variant="body2" sx={{ ml: 1.5, color: '#475569', fontWeight: 600 }}>
              Loading map...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Selected Coordinates & Direct Google Maps Link Card */}
      <Paper
        elevation={0}
        sx={{
          mt: 1.5,
          p: 1.5,
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: 0.8,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`Plus Code: ${currentShortPlus || '—'}`}
              size="small"
              sx={{ background: '#ede9fe', color: '#6366f1', fontWeight: 700, fontSize: '12px' }}
            />
            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
              Lat: {latitude ? parseFloat(latitude).toFixed(7) : '—'}, Lng: {longitude ? parseFloat(longitude).toFixed(7) : '—'}
            </Typography>
          </Box>

          <Button
            size="small"
            variant="text"
            startIcon={copiedLink ? <CheckIcon sx={{ color: '#16a34a' }} /> : <ContentCopyIcon />}
            onClick={handleCopyLink}
            sx={{
              fontSize: '11px',
              textTransform: 'none',
              fontWeight: 600,
              color: copiedLink ? '#16a34a' : '#6366f1',
            }}
          >
            {copiedLink ? 'Link Copied!' : 'Copy Redirect Link'}
          </Button>
        </Box>

        {searchQuery && (
          <Typography variant="caption" sx={{ color: '#334155', fontWeight: 500, lineHeight: 1.4 }}>
            🎯 <strong>Selected Location</strong>: {searchQuery}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default LocationMapPicker;
