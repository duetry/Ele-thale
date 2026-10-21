import { NextResponse } from 'next/server';

/**
 * Reverse Geocode Route
 * Proxied server-side to protect Google API Key.
 * Converts lat, lng coordinates into clean street address, town/city, and postal code.
 * Rules:
 * - Never includes or overwrites business name.
 * - Prioritizes Google Geocoding API if key configured.
 * - Falls back to OpenStreetMap Nominatim.
 * - Preserves coordinates exact precision.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const lat = parseFloat(body?.lat);
    const lng = parseFloat(body?.lng);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: 'Valid latitude (-90 to 90) and longitude (-180 to 180) are required' },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_PLACES_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // 1. Google Geocoding API if key is present
    if (apiKey) {
      try {
        const googleGeoUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=en`;
        const res = await fetch(googleGeoUrl);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'OK' && data.results && data.results.length > 0) {
            const result = data.results[0];
            const components = result.address_components || [];

            let cityOrTown = '';
            let state = '';
            let postcode = '';

            for (const comp of components) {
              const types = comp.types || [];
              if (types.includes('locality') || types.includes('administrative_area_level_2')) {
                if (!cityOrTown) cityOrTown = comp.long_name;
              }
              if (types.includes('administrative_area_level_1')) {
                state = comp.long_name;
              }
              if (types.includes('postal_code')) {
                postcode = comp.long_name;
              }
            }

            return NextResponse.json({
              success: true,
              formattedAddress: result.formatted_address || '',
              cityOrTown,
              state: state || 'Tamil Nadu',
              postcode,
              plusCode: data.plus_code?.compound_code || data.plus_code?.global_code || '',
              lat,
              lng,
              source: 'google',
            });
          }
        }
      } catch (err) {
        console.error('Google reverse geocoding error:', err);
      }
    }

    // 2. OpenStreetMap Nominatim Fallback
    try {
      const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
      const osmRes = await fetch(osmUrl, {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'OfferSandhaiAdmin/1.0',
        },
      });

      if (osmRes.ok) {
        const data = await osmRes.json();
        const addr = data?.address || {};

        const road = addr.road || addr.pedestrian || addr.street || addr.footway || '';
        const area = addr.suburb || addr.neighbourhood || addr.residential || addr.quarter || '';
        const cityOrTown =
          addr.town || addr.city || addr.village || addr.municipality || addr.county || '';
        const state = addr.state || 'Tamil Nadu';
        const postcode = addr.postcode || '';

        const cleanParts = [road, area, cityOrTown, state, postcode].filter(Boolean);
        const formattedAddress = cleanParts.length > 0 ? cleanParts.join(', ') : data.display_name || '';

        return NextResponse.json({
          success: true,
          formattedAddress,
          cityOrTown,
          state,
          postcode,
          plusCode: data?.extratags?.plus_code || '',
          lat,
          lng,
          source: 'osm',
        });
      }
    } catch (osmErr) {
      console.error('Nominatim reverse geocode error:', osmErr);
    }

    return NextResponse.json({
      success: true,
      formattedAddress: `Lat: ${lat.toFixed(7)}, Lng: ${lng.toFixed(7)}`,
      cityOrTown: '',
      state: 'Tamil Nadu',
      postcode: '',
      lat,
      lng,
      source: 'coords_only',
    });
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error during reverse geocoding' },
      { status: 500 }
    );
  }
}
