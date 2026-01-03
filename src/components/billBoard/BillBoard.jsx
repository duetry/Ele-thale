'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBestOfferBillboards } from '@/app/features/billBoard/billBoardSlice';
import { fetchProductOffer } from '@/app/features/products/productSlice';
import UnlockOfferModal from '../products/UnlockOfferModel';

export default function BillboardBanners() {
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [couponCode, setCouponCode] = useState(null);

  const {
    bestOfferBillboards,
    bestOfferLoading,
    bestOfferError,
  } = useSelector((state) => state.billboards);

  useEffect(() => {
    dispatch(fetchBestOfferBillboards());
  }, [dispatch]);

  // Handle unlock offer - API call and open modal
  const handleUnlockOffer = (product) => {
    dispatch(fetchProductOffer(product.Productid))
      .unwrap()
      .then((res) => {
        setCouponCode(res);
        setSelectedProduct(product);
      })
      .catch((err) => {
        console.error('Offer API failed:', err);
      });
  };

  /* ------------------ LOADING & ERROR STATES ------------------ */

  if (bestOfferLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (bestOfferError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">Something went wrong</p>
          <p className="text-sm mt-2">{bestOfferError}</p>
        </div>
      </div>
    );
  }

  if (!bestOfferBillboards?.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">No offers available</p>
      </div>
    );
  }

  /* ------------------ DATA PREP ------------------ */

  // Sort by highest discount
  const sorted = [...bestOfferBillboards].sort(
    (a, b) => Number(b.Discount) - Number(a.Discount)
  );

  /* ------------------ RENDER ------------------ */

  return (
    <div className="w-full bg-white" style={{marginTop:"4rem"}}>
      {/* Container with padding */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        
        {/* Masonry Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {sorted.map((item, index) => {
            // Make first item span 2 columns and 2 rows on larger screens
            const isHero = index === 0;
            
            return (
              <div
                key={item.Productid}
                onClick={() => handleUnlockOffer(item)}
                className={`
                  relative overflow-hidden rounded-lg sm:rounded-xl cursor-pointer
                  transition-all duration-300 ease-in-out
                  hover:scale-[1.02] hover:shadow-2xl
                  group
                  ${isHero ? 'col-span-2 row-span-2' : 'col-span-1'}
                  ${isHero ? 'h-[400px] sm:h-[500px] lg:h-[600px]' : 'h-[180px] sm:h-[220px] lg:h-[280px]'}
                `}
              >
                {/* Image */}
                <img
                  src={item.Imageurl}
                  alt={item.ProductName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay gradient - appears on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Discount badge - always visible */}
                {item.Discount && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                    {item.Discount}% OFF
                  </div>
                )}

                {/* Product info - appears on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-sm sm:text-base lg:text-xl font-bold mb-1 line-clamp-1">
                    {item.ProductName}
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90 mb-2 line-clamp-1">
                    {item.Brand}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg lg:text-2xl font-bold">
                      ₹{item.Finalprice}
                    </span>
                    <span className="text-xs sm:text-sm line-through opacity-70">
                      ₹{item.Price}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unlock Offer Modal */}
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