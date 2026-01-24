'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import { fetchBestOfferBillboards } from '@/app/features/billBoard/billBoardSlice';
import { fetchProductOffer } from '@/app/features/products/productSlice';
import UnlockOfferModal from '../products/UnlockOfferModel';
import { userTracking } from '@/app/features/adminPanel/adminPanelSlice';

export default function BillboardBanners() {
  const dispatch = useDispatch();

  const [mounted, setMounted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [couponCode, setCouponCode] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  const {
    bestOfferBillboards,
    bestOfferLoading,
    bestOfferError,
    bestOfferBanner
  } = useSelector((state) => state.billboards);

  /* ------------------ MOUNT CHECK ------------------ */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ------------------ API CALL ------------------ */
  useEffect(() => {
    dispatch(fetchBestOfferBillboards());
  }, [dispatch]);

  /* ------------------ BANNER AUTO SLIDE ------------------ */
  useEffect(() => {
    if (!mounted || !bestOfferBanner?.length) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) =>
        prev === bestOfferBanner.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [mounted, bestOfferBanner]);

  /* ------------------ CLICK HANDLER ------------------ */
  const handleUnlockOffer = (product) => {
    dispatch(userTracking(product?.ProductName));

    dispatch(fetchProductOffer(product.Storeid))
      .unwrap()
      .then((res) => {
        setCouponCode(res?.data?.[0]);
        setSelectedProduct(product);
      })
      .catch((err) => {
        console.error('Offer API failed:', err);
      });
  };

  /* ------------------ STATES ------------------ */
  if (!mounted || bestOfferLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-12 w-12 rounded-full border-b-2 border-gray-900 animate-spin" />
      </div>
    );
  }

  if (bestOfferError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        {bestOfferError}
      </div>
    );
  }

  /* ------------------ SORT BY DISCOUNT % ------------------ */
  const sorted = [...(bestOfferBillboards || [])].sort((a, b) => {
    const discountA =
      a.Price && a.Finalprice ? ((a.Price - a.Finalprice) / a.Price) * 100 : 0;
    const discountB =
      b.Price && b.Finalprice ? ((b.Price - b.Finalprice) / b.Price) * 100 : 0;

    return discountB - discountA;
  });

  return (
    <div className="w-full bg-white mt-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ===================== BANNER CAROUSEL ===================== */}
        {bestOfferBanner?.length > 0 && (
          <div className="relative w-full overflow-hidden rounded-3xl mb-14 shadow-lg">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              {bestOfferBanner.map((banner, index) => (
                <div key={index} className="min-w-full h-[320px] sm:h-[420px]">
                  <img
                    src={banner.Imageurl}
                    alt="Best Offer Banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {bestOfferBanner.map((_, i) => (
                <span
                  key={i}
                  onClick={() => setCurrentBanner(i)}
                  className={`h-2.5 w-2.5 rounded-full cursor-pointer ${
                    currentBanner === i ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ===================== OFFER CARDS ===================== */}
        <div className="grid grid-cols-12 gap-6">
          {sorted.map((item) => {
            const discountPercent = Math.round(
              ((item.Price - item.Finalprice) / item.Price) * 100
            );

            return (
              <motion.div
                key={item.Productid}
                onClick={() => handleUnlockOffer(item)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="
                  col-span-12 sm:col-span-6 lg:col-span-3
                  cursor-pointer rounded-2xl
                  bg-gradient-to-br from-green-50 to-emerald-50
                  border border-green-200
                  relative overflow-hidden
                  hover:shadow-[0_0_25px_rgba(34,197,94,0.45)]
                  h-[360px]
                "
              >
                {/* Glow blob */}
                <div className="absolute -top-12 -right-12 h-28 w-28
                  rounded-full bg-green-300/30 blur-2xl" />

                {/* ================= PRICE HERO (50%) ================= */}
                <div className="h-1/2 flex flex-col items-center justify-center relative">
                  <div className="absolute top-4 right-4 rounded-full
                    bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow">
                    {discountPercent}% OFF
                  </div>

                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 160 }}
                    className="text-center"
                  >
                    <p className="text-4xl font-extrabold text-emerald-700">
                      ₹{item.Finalprice}
                    </p>
                    <p className="text-sm text-gray-400 line-through mt-1">
                      ₹{item.Price}
                    </p>
                  </motion.div>
                </div>

                {/* ================= DETAILS (50%) ================= */}
                <div className="h-1/2 px-6 pb-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.ProductName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.Brand} • {item.Type}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="
                      w-full rounded-xl
                      bg-white/80 backdrop-blur
                      px-4 py-2 text-sm font-semibold
                      text-green-700 shadow
                      hover:bg-white
                    "
                  >
                    Unlock Offer
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ===================== MODAL ===================== */}
      <UnlockOfferModal
        product={selectedProduct}
        couponCode={couponCode}
        onClose={() => {
          setSelectedProduct(null);
          setCouponCode(null);
        }}
      />
    </div>
  );
}
