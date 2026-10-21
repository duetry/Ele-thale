import { NextResponse } from 'next/server';

/**
 * Validates whether a given URL is a legitimate Google Maps hostname.
 * Prevents SSRF attacks against internal network endpoints.
 */
function isAllowedGoogleHost(hostname) {
  if (!hostname) return false;
  const lower = hostname.toLowerCase();

  const exactHosts = [
    'maps.app.goo.gl',
    'goo.gl',
    'maps.google.com',
    'google.com',
    'www.google.com',
    'google.co.in',
    'www.google.co.in',
  ];

  if (exactHosts.includes(lower)) return true;

  // Allow subdomains like maps.google.co.in or maps.google.com
  if (lower.endsWith('.google.com') || lower.endsWith('.google.co.in') || lower.endsWith('.goo.gl')) {
    return true;
  }

  return false;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const rawInput = body?.url?.trim();

    if (!rawInput) {
      return NextResponse.json({ error: 'URL or coordinates are required' }, { status: 400 });
    }

    // Direct plain coordinate check (e.g. "10.6058, 78.4180" or "10.6058,78.4180")
    const plainCoordsMatch = rawInput.match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/);
    if (plainCoordsMatch) {
      const lat = parseFloat(plainCoordsMatch[1]);
      const lng = parseFloat(plainCoordsMatch[2]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return NextResponse.json({
          success: true,
          placeName: '',
          formattedAddress: '',
          lat: parseFloat(lat.toFixed(7)),
          lng: parseFloat(lng.toFixed(7)),
          placeId: null,
          resolvedUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        });
      }
    }

    // Ensure valid URL
    let parsedUrl;
    try {
      parsedUrl = new URL(rawInput.startsWith('http') ? rawInput : `https://${rawInput}`);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL or coordinates provided' },
        { status: 400 }
      );
    }

    // SSRF Check: ensure hostname is Google Maps
    if (!isAllowedGoogleHost(parsedUrl.hostname)) {
      return NextResponse.json(
        { error: 'Only official Google Maps URLs (google.com/maps, maps.app.goo.gl, etc.) are allowed' },
        { status: 400 }
      );
    }

    let finalUrl = parsedUrl.toString();
    let placeName = '';
    let formattedAddress = '';
    let lat = null;
    let lng = null;
    let placeId = null;

    // Follow redirect if short URL (maps.app.goo.gl or goo.gl)
    if (parsedUrl.hostname.includes('goo.gl')) {
      try {
        const headRes = await fetch(finalUrl, {
          method: 'GET',
          redirect: 'follow',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
          },
        });

        // Validate redirected hostname as well
        const redirectedUrl = new URL(headRes.url);
        if (isAllowedGoogleHost(redirectedUrl.hostname)) {
          finalUrl = headRes.url;
        }

        const html = await headRes.text();

        // Extract title or og:title from HTML
        const titleMatch =
          html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
          html.match(/<title>([^<]+)<\/title>/i);

        if (titleMatch) {
          const rawTitle = titleMatch[1]
            .replace(/\s*·\s*Google Maps/i, '')
            .replace(/\s*-\s*Google Maps/i, '')
            .trim();
          if (rawTitle && !rawTitle.toLowerCase().includes('google maps')) {
            placeName = rawTitle;
          }
        }

        // Try extracting place address if available in og:description
        const descMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
        if (descMatch && descMatch[1] && !descMatch[1].toLowerCase().includes('google maps')) {
          formattedAddress = descMatch[1].trim();
        }
      } catch (err) {
        console.error('Error resolving short Google Maps URL:', err);
      }
    }

    // 1. Extract Place Name from URL path if not found from HTML title
    if (!placeName) {
      const placeMatch =
        finalUrl.match(/\/place\/([^/@?]+)/) ||
        finalUrl.match(/\/search\/([^/@?]+)/);

      if (placeMatch) {
        placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')).trim();
      } else {
        const qMatch = finalUrl.match(/[?&]q=([^&]+)/);
        if (qMatch) {
          const decodedQ = decodeURIComponent(qMatch[1].replace(/\+/g, ' ')).trim();
          if (!/^-?\d+\.\d+,-?\d+\.\d+$/.test(decodedQ)) {
            placeName = decodedQ;
          }
        }
      }
    }

    // 2. Extract Place ID if present
    const placeIdParam = finalUrl.match(/[?&](?:place_id|ftid)=([a-zA-Z0-9_-]+)/);
    if (placeIdParam) {
      placeId = placeIdParam[1];
    } else {
      const hexPlaceMatch = finalUrl.match(/!1s(0x[0-9a-fA-F]+:0x[0-9a-fA-F]+)/);
      if (hexPlaceMatch) {
        placeId = hexPlaceMatch[1];
      }
    }

    // 3. Extract Coordinates according to strict priority:
    // Priority A: Explicit !3dlat!4dlng pin parameter (exact pin in Google place URLs)
    const pinDataMatch = finalUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (pinDataMatch) {
      lat = parseFloat(pinDataMatch[1]);
      lng = parseFloat(pinDataMatch[2]);
    }

    // Priority B: Query parameter coordinates: ?q=lat,lng or &ll=lat,lng
    if (lat === null || lng === null) {
      const qCoordMatch = finalUrl.match(/[?&](?:q|query|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (qCoordMatch) {
        lat = parseFloat(qCoordMatch[1]);
        lng = parseFloat(qCoordMatch[2]);
      }
    }

    // Priority C: Direct coordinate pair inside URL parameters
    if (lat === null || lng === null) {
      const plainCoords = finalUrl.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
      if (plainCoords) {
        lat = parseFloat(plainCoords[1]);
        lng = parseFloat(plainCoords[2]);
      }
    }

    // Priority D: Viewport camera center @lat,lng (fallback only when explicit pin coords are missing)
    if (lat === null || lng === null) {
      const atMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atMatch) {
        lat = parseFloat(atMatch[1]);
        lng = parseFloat(atMatch[2]);
      }
    }

    const apiKey =
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_PLACES_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // 4. If coordinates or details missing but we have placeName / placeId and a Google API Key:
    if (apiKey && (lat === null || lng === null || !placeName || !formattedAddress)) {
      try {
        if (placeId && placeId.startsWith('ChIJ')) {
          // A. Try Google Places API (New) - Place Details
          try {
            const detailRes = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
              headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'id,displayName,formattedAddress,location',
              },
            });
            if (detailRes.ok) {
              const detailData = await detailRes.json();
              if (detailData.displayName?.text) placeName = detailData.displayName.text;
              if (detailData.formattedAddress) formattedAddress = detailData.formattedAddress;
              if (detailData.location?.latitude && (lat === null || lng === null)) {
                lat = detailData.location.latitude;
                lng = detailData.location.longitude;
              }
            }
          } catch (e) {
            console.warn('Places (New) detail fetch attempt:', e.message);
          }

          // B. Try standard Place Details API if needed
          if (lat === null || lng === null || !placeName) {
            try {
              const stdDetailRes = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=en`
              );
              if (stdDetailRes.ok) {
                const stdData = await stdDetailRes.json();
                if (stdData.status === 'OK' && stdData.result) {
                  const res = stdData.result;
                  if (res.name) placeName = res.name;
                  if (res.formatted_address) formattedAddress = res.formatted_address;
                  if (res.geometry?.location && (lat === null || lng === null)) {
                    lat = res.geometry.location.lat;
                    lng = res.geometry.location.lng;
                  }
                }
              }
            } catch (e) {
              console.warn('Standard Place Details attempt:', e.message);
            }
          }
        } else if (placeName && (lat === null || lng === null)) {
          // A. Try Google Places Text Search (New) by name
          try {
            const searchRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location',
              },
              body: JSON.stringify({
                textQuery: placeName,
                languageCode: 'en',
                regionCode: 'IN',
              }),
            });
            if (searchRes.ok) {
              const searchData = await searchRes.json();
              const firstPlace = searchData.places?.[0];
              if (firstPlace) {
                if (!placeId) placeId = firstPlace.id;
                if (firstPlace.displayName?.text) placeName = firstPlace.displayName.text;
                if (firstPlace.formattedAddress) formattedAddress = firstPlace.formattedAddress;
                if (firstPlace.location?.latitude) {
                  lat = firstPlace.location.latitude;
                  lng = firstPlace.location.longitude;
                }
              }
            }
          } catch (e) {
            console.warn('Places (New) Text Search attempt:', e.message);
          }

          // B. Try standard Places Text Search API if needed
          if (lat === null || lng === null) {
            try {
              const stdSearchRes = await fetch(
                `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
                  placeName
                )}&key=${apiKey}&language=en`
              );
              if (stdSearchRes.ok) {
                const stdData = await stdSearchRes.json();
                const firstResult = stdData.results?.[0];
                if (firstResult) {
                  if (!placeId) placeId = firstResult.place_id;
                  if (firstResult.name) placeName = firstResult.name;
                  if (firstResult.formatted_address) formattedAddress = firstResult.formatted_address;
                  if (firstResult.geometry?.location) {
                    lat = firstResult.geometry.location.lat;
                    lng = firstResult.geometry.location.lng;
                  }
                }
              }
            } catch (e) {
              console.warn('Standard Places Text Search attempt:', e.message);
            }
          }
        }
      } catch (placeErr) {
        console.error('Error fetching place details in resolve-maps-url:', placeErr);
      }
    }

    // Validate coordinates range
    const validLat = lat !== null && !isNaN(lat) && lat >= -90 && lat <= 90 ? parseFloat(lat.toFixed(7)) : null;
    const validLng = lng !== null && !isNaN(lng) && lng >= -180 && lng <= 180 ? parseFloat(lng.toFixed(7)) : null;

    return NextResponse.json({
      success: true,
      placeName: placeName || '',
      formattedAddress: formattedAddress || '',
      lat: validLat,
      lng: validLng,
      placeId: placeId || null,
      resolvedUrl: finalUrl,
    });
  } catch (error) {
    console.error('Resolve maps URL error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to resolve Google Maps link' },
      { status: 500 }
    );
  }
}
