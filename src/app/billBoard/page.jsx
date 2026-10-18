import BillboardBanners from '@/components/billBoard/BillBoard';
import React from 'react';

export const metadata = {
  title: 'Nearby Offers | Offer Sandhai',
  description: 'Explore live, upcoming, and exclusive offers near you with real-time distance and store details.',
};

export default function BillboardPage() {
  return <BillboardBanners />;
}