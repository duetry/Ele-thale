import { NextResponse } from 'next/server';

/**
 * Google Places API (New & Standard) - Text Search
 * Proxied server-side to protect Google API Key from browser exposure.
 * Supports queries like "Mathi Bakes, Manapparai".
 * Supports Places API (New) and standard Places API, with fallback to OpenStreetMap Nominatim.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const query = body?.query?.trim();
    const biasLat = parseFloat(body?.biasLat);
    const biasLng = parseFloat(body?.biasLng);

    if (!query || query.length < 2) {
      return NextResponse.json({ places: [] });
    }

    const apiKey =
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_PLACES_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const centerLat = !isNaN(biasLat) && biasLat >= -90 && biasLat <= 90 ? biasLat : 10.6058;
    const centerLng = !isNaN(biasLng) && biasLng >= -180 && biasLng <= 180 ? biasLng : 78.4180;

    // 1. Try Google Places API (New) Text Search
    if (apiKey) {
      try {
        const payload = {
          textQuery: query,
          languageCode: 'en',
          regionCode: 'IN',
          locationBias: {
            circle: {
              center: {
                latitude: centerLat,
                longitude: centerLng,
              },
              radius: 50000.0, // 50km radius bias
            },
          },
        };

        const googleRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask':
              'places.id,places.displayName,places.formattedAddress,places.location,places.plusCode,places.types',
          },
          body: JSON.stringify(payload),
        });

        if (googleRes.ok) {
          const googleData = await googleRes.json();
          if (googleData.places && Array.isArray(googleData.places) && googleData.places.length > 0) {
            const places = googleData.places.map((p) => {
              const lat = p.location?.latitude ? parseFloat(p.location.latitude.toFixed(7)) : null;
              const lng = p.location?.longitude ? parseFloat(p.location.longitude.toFixed(7)) : null;

              return {
                id: p.id,
                name: p.displayName?.text || '',
                formattedAddress: p.formattedAddress || '',
                lat,
                lng,
                plusCode: p.plusCode?.compoundCode || p.plusCode?.globalCode || '',
                types: p.types || [],
                source: 'google',
              };
            });

            return NextResponse.json({
              success: true,
              places,
              source: 'google',
            });
          }
        }
      } catch (googleErr) {
        console.warn('Google Places (New) attempt:', googleErr.message);
      }

      // 2. Try Google Places API (Standard Text Search) if Places (New) is not enabled on this key
      try {
        const standardUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          query
        )}&location=${centerLat},${centerLng}&radius=50000&key=${apiKey}&language=en`;

        const standardRes = await fetch(standardUrl);
        if (standardRes.ok) {
          const standardData = await standardRes.json();
          if (
            standardData.status === 'OK' &&
            Array.isArray(standardData.results) &&
            standardData.results.length > 0
          ) {
            const places = standardData.results.map((p) => {
              const lat = p.geometry?.location?.lat
                ? parseFloat(p.geometry.location.lat.toFixed(7))
                : null;
              const lng = p.geometry?.location?.lng
                ? parseFloat(p.geometry.location.lng.toFixed(7))
                : null;

              return {
                id: p.place_id,
                name: p.name || '',
                formattedAddress: p.formatted_address || '',
                lat,
                lng,
                plusCode: p.plus_code?.compound_code || p.plus_code?.global_code || '',
                types: p.types || [],
                source: 'google',
              };
            });

            return NextResponse.json({
              success: true,
              places,
              source: 'google',
            });
          }
        }
      } catch (stdErr) {
        console.warn('Google Places (Standard) attempt:', stdErr.message);
      }
    }

    // 3. Fallback to OpenStreetMap Nominatim search
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&addressdetails=1&limit=8`;

      const osmRes = await fetch(nominatimUrl, {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'OfferSandhaiAdmin/1.0',
        },
      });

      if (osmRes.ok) {
        const osmData = await osmRes.json();
        if (Array.isArray(osmData)) {
          const places = osmData.map((item) => {
            const lat = parseFloat(parseFloat(item.lat).toFixed(7));
            const lng = parseFloat(parseFloat(item.lon).toFixed(7));
            return {
              id: `osm-${item.place_id}`,
              name: item.name || item.display_name?.split(',')[0]?.trim() || '',
              formattedAddress: item.display_name || '',
              lat,
              lng,
              plusCode: item.extratags?.plus_code || '',
              types: [item.type, item.class].filter(Boolean),
              source: 'osm',
            };
          });

          return NextResponse.json({
            success: true,
            places,
            source: 'osm',
            googleKeyConfigured: Boolean(apiKey),
          });
        }
      }
    } catch (osmErr) {
      console.error('Nominatim search fallback error:', osmErr);
    }

    return NextResponse.json({
      success: true,
      places: [],
      googleKeyConfigured: Boolean(apiKey),
    });
  } catch (error) {
    console.error('Places search handler error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during place search' },
      { status: 500 }
    );
  }
}
