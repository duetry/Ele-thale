'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Ticket, ArrowRight, Flame } from 'lucide-react';

export default function MyCouponsPage() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      paddingTop: 80,
      paddingBottom: 80,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        maxWidth: 440,
        width: '100%',
        padding: '32px 24px',
        margin: '0 16px',
        background: '#ffffff',
        borderRadius: 24,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
        border: '1px solid #f1f5f9',
        textAlign: 'center',
      }}>
        {/* Animated Ticket Container */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: '#f3e8ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <Ticket style={{ width: 36, height: 36, color: '#8b5cf6' }} />
        </div>

        <h2 style={{
          fontSize: 22,
          fontWeight: 800,
          color: '#0f172a',
          margin: '0 0 10px',
          letterSpacing: '-0.3px',
        }}>
          No Coupons Unlocked Yet
        </h2>
        
        <p style={{
          fontSize: 14,
          color: '#64748b',
          lineHeight: 1.6,
          margin: '0 0 28px',
        }}>
          Explore active deals in your area and unlock coupon codes to get massive discounts on your favorite products!
        </p>

        {/* CTA Button */}
        <button
          onClick={() => router.push('/')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 16,
            padding: '14px 0',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(139, 92, 246, 0.3)';
          }}
        >
          <Flame size={16} fill="#ffffff" />
          <span>Explore Super Deals</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
