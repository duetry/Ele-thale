'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Ticket, ArrowRight, Flame, Copy, Check, Calendar, Phone, ShoppingBag } from 'lucide-react';
import { getCouponByUser, selectCouponCodes, selectCouponLoading } from '@/app/features/adminPanel/adminPanelSlice';
import { selectUserId } from '@/app/features/auth/authSlice';
import toast from 'react-hot-toast';

export default function MyCouponsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const rawCouponsData = useSelector(selectCouponCodes);
  const isLoading = useSelector(selectCouponLoading);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    dispatch(getCouponByUser({ userId }));
  }, [dispatch, userId]);

  const couponsList = Array.isArray(rawCouponsData)
    ? rawCouponsData
    : Array.isArray(rawCouponsData?.coupons)
    ? rawCouponsData.coupons
    : Array.isArray(rawCouponsData?.data)
    ? rawCouponsData.data
    : [];

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success('Coupon code copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (couponsList.length === 0) {
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
          >
            <Flame size={16} fill="#ffffff" />
            <span>Explore Super Deals</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Ticket className="w-8 h-8 text-purple-600" />
            My Coupons ({couponsList.length})
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage and present your unlocked discount codes to the merchant
          </p>
        </div>

        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm shrink-0"
        >
          <Flame size={16} fill="#ffffff" />
          <span>Explore More Deals</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {couponsList.map((item, index) => {
          const couponId = item.CouponId || item.coupon_id || item.id || index;
          const couponCode = item.CouponCode || item.coupon_code || item.code || 'N/A';
          const productName = item.ProductName || item.product_name || item.title || item.name || 'Product';
          const isUsed = String(item.IsUsed ?? item.is_used ?? item.is_validated ?? 'false') === 'true';
          const phoneNo = item.PhoneNo || item.phone_no;
          const dateFormatted = formatDate(item.CreatedAt || item.created_at);

          return (
            <div
              key={couponId}
              className={`bg-white rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-md relative overflow-hidden ${
                isUsed ? 'border-slate-200 opacity-75' : 'border-purple-100 ring-1 ring-purple-500/10'
              }`}
            >
              {/* Top Accent Bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  isUsed ? 'bg-slate-300' : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                }`}
              />

              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                    <ShoppingBag className="w-5 h-5 text-purple-600 shrink-0" />
                    <span className="line-clamp-1">{productName}</span>
                  </div>
                  {isUsed ? (
                    <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      Used
                    </span>
                  ) : (
                    <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                      Active
                    </span>
                  )}
                </div>

                {phoneNo && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Registered Phone: {phoneNo}</span>
                  </div>
                )}

                {/* Coupon Code Dashed Box */}
                <div className="bg-purple-50/70 border-2 border-dashed border-purple-200 rounded-xl p-4 my-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                      Coupon Code
                    </span>
                    <span className="text-xl font-black font-mono text-purple-900 tracking-wider">
                      {couponCode}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(couponCode, couponId)}
                    className="p-2.5 bg-white text-purple-700 rounded-lg hover:bg-purple-100 transition-colors shadow-xs flex items-center gap-1 text-xs font-bold"
                    title="Copy Code"
                  >
                    {copiedId === couponId ? (
                      <>
                        <Check size={16} className="text-green-600" />
                        <span className="text-green-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {dateFormatted && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 pt-3 border-t border-slate-100">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Unlocked on {dateFormatted}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

