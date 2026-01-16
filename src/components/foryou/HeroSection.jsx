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

  const handleShopClick = () => {
    if (isAuthenticated) router.push('/specialOffer');
    else {
      setLoginForUnlockOffer(false);
      setShowLogin(true);
    }
  };

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

  /* ---------------- RESPONSIVE STYLES ---------------- */
  const sectionStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    background:
      'linear-gradient(135deg, #FFF4E6 0%, #FFECD2 50%, #FCE4CC 100%)',
    padding: isMobile ? '60px 16px' : '100px 20px 60px',
  };

  const containerStyle = {
    maxWidth: '1400px',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1.2fr',
    gap: isMobile ? '30px' : '60px',
    alignItems: 'center',
  };

  const contentStyle = {
    padding: isMobile ? '0' : '40px',
    textAlign: isMobile ? 'center' : 'left',
  };

  const headingStyle = {
    fontSize: isMobile ? 'clamp(48px, 12vw, 72px)' : '120px',
    fontWeight: 900,
    lineHeight: 1,
    margin: '20px 0',
    color: '#1F2937',
  };

  const subHeadingStyle = {
    fontSize: isMobile ? '18px' : '28px',
    marginBottom: '32px',
    color: '#374151',
  };

  const buttonStyle = {
    background: 'linear-gradient(90deg, #1F2937, #111827)',
    color: '#fff',
    padding: '16px 36px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
  };

  const fullImageWrapper = {
    width: isMobile ? '100%' : '50vw',
    height: isMobile ? '280px' : '70vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '16px',
    background: '#fff',
    cursor: 'pointer',
  };

  const fullImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: '16px',
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        {/* LEFT */}
        <div style={contentStyle}>
          <h1 style={headingStyle}>UPTO 30% OFF</h1>
          <p style={subHeadingStyle}>
            Grab yours before they&apos;re gone!
          </p>
          <button style={buttonStyle} onClick={handleShopClick}>
            Shop Now
          </button>
        </div>

        {/* RIGHT */}
        {currentImage && (
          <div
            style={fullImageWrapper}
            onClick={() => handleUnlockOffer(currentImage)}
          >
            <img
              src={currentImage.Imageurl}
              alt={currentImage.ProductName}
              style={fullImageStyle}
            />
          </div>
        )}
      </div>

      {/* LOGIN */}
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

      {/* MODAL */}
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
