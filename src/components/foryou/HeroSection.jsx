'use client';

import { useState, useEffect, useRef } from 'react';
import LoginPopup from '../LoginPopup';
import { selectIsAuthenticated } from '@/app/features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  fetchForyou,
  fetchProductOffer,
} from '@/app/features/products/productSlice';
import UnlockOfferModal from '../products/UnlockOfferModel';

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [couponCode, setCouponCode] = useState(null);
  const [loginForUnlockOffer, setLoginForUnlockOffer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const intervalRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const foryouDetail =
    useSelector((state) => state.products.foryouDetail) || [];

  /* ---------------- MOBILE DETECTION ---------------- */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    dispatch(fetchForyou());
  }, [dispatch]);

  /* ---------------- IMAGE ROTATION ---------------- */
  useEffect(() => {
    if (!foryouDetail.length) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === foryouDetail.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [foryouDetail.length]);

  const currentImage = foryouDetail[currentIndex];

  const handleUnlockOffer = (product) => {
    if (isAuthenticated) {
      dispatch(fetchProductOffer(product.Storeid))
        .unwrap()
        .then((res) => {
          setCouponCode(res?.data?.[0]);
          setSelectedProduct(product);
        });
    } else {
      setLoginForUnlockOffer(true);
      setSelectedProduct(product);
      setShowLogin(true);
    }
  };

  /* ---------------- FULL IMAGE STYLES ---------------- */
  const sectionStyle = {
    minHeight: '100vh',
    width: '100%',
    background:
      'linear-gradient(135deg, #FFF4E6 0%, #FFECD2 50%, #FCE4CC 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? '16px' : '40px',
        marginTop:'2rem'
  };

  const imageWrapperStyle = {
    width: '100%',
    height: isMobile ? '300px' : '80vh',
    maxWidth: '1400px',
    background: '#fff',
    borderRadius: '20px',
    overflow: 'hidden',
    cursor: 'pointer',
    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'inherit', // 🔥 fills space properly

  };

  return (
    <section style={sectionStyle}>
      {currentImage && (
        <div
          style={imageWrapperStyle}
          onClick={() => handleUnlockOffer(currentImage)}
        >
          <img
            src={currentImage.Imageurl}
            alt={currentImage.ProductName}
            style={imageStyle}
          />
        </div>
      )}

      {/* LOGIN POPUP */}
      {showLogin && (
        <LoginPopup
          close={() => setShowLogin(false)}
          onLoginSuccess={() => {
            if (loginForUnlockOffer && selectedProduct) {
              dispatch(fetchProductOffer(selectedProduct.Storeid))
                .unwrap()
                .then((res) => setCouponCode(res?.data?.[0]));
            }
            setLoginForUnlockOffer(false);
          }}
        />
      )}

      {/* UNLOCK OFFER MODAL */}
      {selectedProduct && couponCode && (
        <UnlockOfferModal
          product={selectedProduct}
          couponCode={couponCode}
          onClose={() => {
            setSelectedProduct(null);
            setCouponCode(null);
          }}
        />
      )}
    </section>
  );
}
