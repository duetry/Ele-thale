'use client';

import React, { useState, useEffect, useRef } from 'react';
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

const TILE_SERVERS = {
  googleRoadmap: {
    url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps',
    name: 'Google Maps (Shops & Details)',
  },
  googleSatellite: {
    url: 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps Hybrid',
    name: 'Satellite',
  },
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
    name: 'OpenStreetMap',
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
  onLocationSelect,
  label = "Store Location Picker",
  mapHeight = "360px",
}) => {
  const mapRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const currentTileLayerRef = useRef(null);
  const markerInstance = useRef(null);

  const [searchQuery, setSearchQuery] = useState(address || '');
  const [mapType, setMapType] = useState('googleRoadmap');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync search input when address prop changes
  useEffect(() => {
    if (address && address !== searchQuery) {
      setSearchQuery(address);
    }
  }, [address]);

  // Load Leaflet & setup initial map with Google Maps Tile Layer
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

        // Add Google Maps Roadmap tiles by default
        const tileConfig = TILE_SERVERS.googleRoadmap;
        const initialLayer = L.tileLayer(tileConfig.url, {
          maxZoom: tileConfig.maxZoom,
          subdomains: tileConfig.subdomains,
          attribution: tileConfig.attribution,
        }).addTo(map);

        currentTileLayerRef.current = initialLayer;

        const customMarker = L.marker([initialLat, initialLng], {
          draggable: true,
        }).addTo(map);

        // Handle marker drag
        customMarker.on('dragend', async () => {
          const pos = customMarker.getLatLng();
          const lat = parseFloat(pos.lat.toFixed(7));
          const lng = parseFloat(pos.lng.toFixed(7));
          await reverseGeocode(lat, lng);
        });

        // Handle map click
        map.on('click', async (e) => {
          const lat = parseFloat(e.latlng.lat.toFixed(7));
          const lng = parseFloat(e.latlng.lng.toFixed(7));
          customMarker.setLatLng([lat, lng]);
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

  // Update map view when latitude/longitude props change externally
  useEffect(() => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lng) && leafletMapInstance.current && markerInstance.current) {
      markerInstance.current.setLatLng([lat, lng]);
      leafletMapInstance.current.setView([lat, lng], Math.max(leafletMapInstance.current.getZoom(), 16));
    }
  }, [latitude, longitude]);

  // Reverse geocode lat,lng to get detailed Plus Code address & direct map redirect link
  const reverseGeocode = async (lat, lng) => {
    setLoadingGeo(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      const data = await response.json();
      const addr = data?.address || {};

      // 1. Calculate Plus Code (e.g. JC3J+GWG)
      const fullPlusCode = data?.extratags?.plus_code || encodePlusCode(lat, lng);
      const shortPlus = getShortPlusCode(fullPlusCode);

      // 2. Extract detailed address components (road, area, town/village, state, pincode)
      const road = addr.road || addr.pedestrian || addr.street || addr.footway || '';
      const area = addr.suburb || addr.neighbourhood || addr.residential || addr.quarter || '';
      const cityOrTown = addr.town || addr.city || addr.village || addr.municipality || addr.county || '';
      const state = addr.state || 'Tamil Nadu';
      const postcode = addr.postcode || '621306';

      // 3. Assemble exact structured address: "JC3J+GWG, Viralimalai - Manapparai Rd, Anna Nagar, Kannudayanpatti, Tamil Nadu 621312"
      const addressParts = [
        shortPlus,
        road,
        area,
        cityOrTown,
        state,
        postcode
      ].filter(Boolean);

      const exactAddress = addressParts.join(', ');
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

      setSearchQuery(exactAddress);

      if (onLocationSelect) {
        onLocationSelect({
          lat,
          lng,
          address: exactAddress,
          plusCode: shortPlus,
          fullPlusCode: fullPlusCode,
          googleMapsUrl: googleMapsUrl,
        });
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      const fullPlusCode = encodePlusCode(lat, lng);
      const shortPlus = getShortPlusCode(fullPlusCode);
      const fallbackAddress = `${shortPlus}, Lat: ${lat}, Lng: ${lng}`;
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

      if (onLocationSelect) {
        onLocationSelect({
          lat,
          lng,
          address: searchQuery || fallbackAddress,
          plusCode: shortPlus,
          googleMapsUrl: googleMapsUrl,
        });
      }
    } finally {
      setLoadingGeo(false);
    }
  };

  // Check if string contains coordinates like "10.6058, 78.4180" or Google Maps URL
  const parseCoordinatesOrUrl = (str) => {
    if (!str) return null;

    const coordMatch = str.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }

    const gmapMatch = str.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (gmapMatch) {
      const lat = parseFloat(gmapMatch[1]);
      const lng = parseFloat(gmapMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }

    return null;
  };

  // Search places via Nominatim Geocoding API or parse Lat,Lng input directly
  const handleSearchPlaces = async (queryStr) => {
    const q = queryStr !== undefined ? queryStr : searchQuery;
    if (!q || q.trim().length < 2) return;

    const directCoords = parseCoordinatesOrUrl(q);
    if (directCoords) {
      const lat = parseFloat(directCoords.lat.toFixed(7));
      const lng = parseFloat(directCoords.lng.toFixed(7));

      if (leafletMapInstance.current && markerInstance.current) {
        markerInstance.current.setLatLng([lat, lng]);
        leafletMapInstance.current.setView([lat, lng], 17);
      }
      setShowSuggestions(false);
      await reverseGeocode(lat, lng);
      return;
    }

    setLoadingSearch(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=1&limit=8`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      const data = await res.json();
      setSuggestions(data || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Geocoding search error:', err);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Auto-search suggestions as user types (debounced)
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      if (searchQuery !== address) {
        handleSearchPlaces(searchQuery);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Select place from search dropdown
  const handleSelectSuggestion = (place) => {
    const lat = parseFloat(parseFloat(place.lat).toFixed(7));
    const lng = parseFloat(parseFloat(place.lon).toFixed(7));

    setShowSuggestions(false);

    if (leafletMapInstance.current && markerInstance.current) {
      markerInstance.current.setLatLng([lat, lng]);
      leafletMapInstance.current.setView([lat, lng], 17);
    }

    reverseGeocode(lat, lng);
  };

  // Fetch Current Device Location (GPS)
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

        await reverseGeocode(lat, lng);
      },
      (err) => {
        console.error('GPS Geolocation error:', err);
        alert('Could not retrieve your location. Please ensure location permissions are enabled.');
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
      {/* Header controls: Label & Map Type Switcher */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <MapIcon sx={{ fontSize: 18, color: '#6366f1' }} />
          {label}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Map Layer Switcher: Google Maps vs Satellite vs OSM */}
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
            <ToggleButton value="googleRoadmap" title="Google Maps (Details, Shops & Tamil/English Labels)">
              🗺️ Google Maps
            </ToggleButton>
            <ToggleButton value="googleSatellite" title="Google Satellite View">
              🛰️ Satellite
            </ToggleButton>
            <ToggleButton value="osm" title="OpenStreetMap Layer">
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

          <Tooltip title="Test exact location redirect in Google Maps">
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

      {/* Address / Shop Search Bar */}
      <Box sx={{ position: 'relative', mb: 1.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search shop, area, or paste Lat,Lng (e.g. JC3J+GWG, Anna Nagar, Manapparai)..."
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
                <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
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
                    title="Search place on map"
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

        {/* Autocomplete Dropdown List */}
        {showSuggestions && suggestions.length > 0 && (
          <Paper
            elevation={6}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 9999,
              mt: 0.5,
              maxHeight: 240,
              overflowY: 'auto',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            }}
          >
            <List density="compact" disablePadding>
              {suggestions.map((item, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => handleSelectSuggestion(item)}
                  sx={{
                    py: 1.2,
                    px: 1.5,
                    borderBottom: index < suggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                    '&:hover': { backgroundColor: '#f8fafc' },
                  }}
                >
                  <ListItemText
                    primary={item.display_name}
                    primaryTypographyProps={{
                      fontSize: '13px',
                      color: '#1e293b',
                      fontWeight: 600,
                    }}
                    secondary={`Lat: ${parseFloat(item.lat).toFixed(5)}, Lng: ${parseFloat(item.lon).toFixed(5)}`}
                    secondaryTypographyProps={{ fontSize: '11px', color: '#64748b' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      {/* Map View Container rendering Google Maps Tiles */}
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
              Loading Google Maps tiles...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Exact Plus Code & Direct Google Maps Redirect Link Badge */}
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
              Lat: {latitude || '—'}, Lng: {longitude || '—'}
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
            🎯 <strong>Exact Address</strong>: {searchQuery}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default LocationMapPicker;
