import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const rawUrl = body?.url?.trim();

    if (!rawUrl) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    let finalUrl = rawUrl;
    let placeName = '';
    let lat = null;
    let lng = null;

    // Follow redirect if short Google Maps URL (maps.app.goo.gl or goo.gl/maps)
    if (finalUrl.includes('goo.gl') || finalUrl.includes('maps.app.goo.gl')) {
      try {
        const headRes = await fetch(finalUrl, {
          method: 'GET',
          redirect: 'follow',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });
        finalUrl = headRes.url;
        const html = await headRes.text();

        const titleMatch =
          html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
          html.match(/<title>([^<]+)<\/title>/i);

        if (titleMatch) {
          const rawTitle = titleMatch[1].replace(/\s*-\s*Google Maps/i, '').trim();
          if (rawTitle && !rawTitle.toLowerCase().includes('google maps')) {
            placeName = rawTitle;
          }
        }
      } catch (err) {
        console.error('Error resolving short URL:', err);
      }
    }

    // 1. Extract place name from URL if not already found
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
          // Avoid coordinate-only q values
          if (!/^-?\d+\.\d+,-?\d+\.\d+$/.test(decodedQ)) {
            placeName = decodedQ;
          }
        }
      }
    }

    // 2. Extract coordinates (@lat,lng or !3dlat!4dlng or ?q=lat,lng or plain coords)
    const atMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      lat = parseFloat(atMatch[1]);
      lng = parseFloat(atMatch[2]);
    }

    if (!lat || !lng) {
      const dataMatch = finalUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
      if (dataMatch) {
        lat = parseFloat(dataMatch[1]);
        lng = parseFloat(dataMatch[2]);
      }
    }

    if (!lat || !lng) {
      const qCoordMatch = finalUrl.match(/[?&](?:q|query|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (qCoordMatch) {
        lat = parseFloat(qCoordMatch[1]);
        lng = parseFloat(qCoordMatch[2]);
      }
    }

    if (!lat || !lng) {
      const plainCoords = finalUrl.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
      if (plainCoords) {
        lat = parseFloat(plainCoords[1]);
        lng = parseFloat(plainCoords[2]);
      }
    }

    return NextResponse.json({
      success: true,
      placeName: placeName || '',
      lat: lat !== null && !isNaN(lat) ? parseFloat(lat.toFixed(7)) : null,
      lng: lng !== null && !isNaN(lng) ? parseFloat(lng.toFixed(7)) : null,
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
