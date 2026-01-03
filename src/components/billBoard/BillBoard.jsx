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

  /* ------------------ API CALL ------------------ */
  useEffect(() => {
    dispatch(fetchBestOfferBillboards());
  }, [dispatch]);

  /* ------------------ CLICK HANDLER ------------------ */
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

  /* ------------------ STATES ------------------ */
  if (bestOfferLoading) {
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

  if (!bestOfferBillboards?.length) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        No offers available
      </div>
    );
  }

  /* ------------------ SORT ------------------ */
  // const sorted = [...bestOfferBillboards].sort(
  //   (a, b) => Number(b.Discount) - Number(a.Discount)
  // );
const sorted = [...bestOfferBillboards].sort((a, b) => {
  const discountPercentA =
    a.Price && a.Finalprice
      ? ((a.Price - a.Finalprice) / a.Price) * 100
      : 0;

  const discountPercentB =
    b.Price && b.Finalprice
      ? ((b.Price - b.Finalprice) / b.Price) * 100
      : 0;

  return discountPercentB - discountPercentA;
});

  /* ------------------ UI ------------------ */
  return (
    <div className="w-full bg-white mt-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* 12-column Grid */}
        <div className="grid grid-cols-12 gap-6">
          {sorted.map((item, index) => {
            const isHero = index === 0;

            return (
              <div
                key={item.Productid}
                onClick={() => handleUnlockOffer(item)}
                className={`
                  rounded-2xl cursor-pointer overflow-hidden
                  border border-gray-200
                  bg-white
                  transition-all duration-500 ease-out
                  hover:-translate-y-1 hover:shadow-xl
                  ${
                    isHero
                      ? 'col-span-12'
                      : 'col-span-6 sm:col-span-4 lg:col-span-3'
                  }
                `}
              >
                {/* IMAGE CONTAINER */}
                <div
                  className={`
                    w-full
                    ${isHero ? 'aspect-[16/6]' : 'aspect-[3/5]'}
                    overflow-hidden
                    bg-[#e9f4fb]
                  `}
                >
                  <img
                    src={item.Imageurl}
                    alt={item.ProductName}
                    className={`
                      w-full h-full
                      ${isHero ? 'object-cover' : 'object-contain'}
                      transition-transform duration-700 ease-out
                      hover:scale-[1.03]
                    `}
                    loading="lazy"
                  />
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
