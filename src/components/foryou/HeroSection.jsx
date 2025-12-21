'use client';

import { useState, useEffect, useRef } from 'react';
import LoginPopup from '../LoginPopup';
import { selectIsAuthenticated } from '@/app/features/auth/authSlice';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation'; 


export default function HeroSection() {
  const [currentImageSet, setCurrentImageSet] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const intervalRef = useRef(null);
  const router = useRouter();
  // 🎨 CHANGE CONTENT HERE - Easy customization
  const heroContent = {
    // Left side content
    badge: 'BESTSELLERS ON OFFER!',
    mainHeading: 'UPTO 30% OFF',
    subHeading: 'Grab yours before they\'re gone!',
    buttonText: 'Shop Now',
    buttonLink: '#offers',
    
    // ⏱️ Image rotation interval in milliseconds (default: 5000ms = 5 seconds)
    imageChangeInterval: 5000,
    
    // Product images - Multiple sets for rotation
    imageSets: [
      // Set 1
      [
        { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80', alt: 'Product 1' },
        { url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80', alt: 'Product 2' },
        { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80', alt: 'Product 3' },
        { url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80', alt: 'Product 4' },
        { url: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&q=80', alt: 'Product 5' },
        { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80', alt: 'Product 6' },
        { url: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=400&q=80', alt: 'Product 7' },
      ],
      // Set 2
      [
        { url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80', alt: 'Product 8' },
        { url: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&q=80', alt: 'Product 9' },
        { url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80', alt: 'Product 10' },
        { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80', alt: 'Product 11' },
        { url: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&q=80', alt: 'Product 12' },
        { url: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=400&q=80', alt: 'Product 13' },
        { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', alt: 'Product 14' },
      ],
      // Set 3
      [
        { url: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&q=80', alt: 'Product 15' },
        { url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80', alt: 'Product 16' },
        { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80', alt: 'Product 17' },
        { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80', alt: 'Product 18' },
        { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80', alt: 'Product 19' },
        { url: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=400&q=80', alt: 'Product 20' },
        { url: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400&q=80', alt: 'Product 21' },
      ],
    ],
  };

  // Image rotation logic with smooth animation
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentImageSet((prev) => (prev + 1) % heroContent.imageSets.length);
        setIsTransitioning(false);
      }, 300); // Half of transition duration
    }, heroContent.imageChangeInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [heroContent.imageChangeInterval, heroContent.imageSets.length]);

  const currentImages = heroContent.imageSets[currentImageSet];

  const sectionStyle = {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #FFF4E6 0%, #FFECD2 50%, #FCE4CC 100%)',
    padding: '100px 20px 60px',
    overflow: 'hidden',
  };

  const containerStyle = {
    maxWidth: '1400px',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '60px',
    alignItems: 'center',
    margin: '0 auto',
  };

  const contentStyle = {
    padding: '40px',
  };

  const badgeWrapperStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '30px',
  };

  const badgeStyle = {
    display: 'inline-block',
    background: 'linear-gradient(90deg, #D97706 0%, #B45309 100%)',
    color: 'white',
    padding: '12px 28px',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(217, 119, 6, 0.4)',
  };

  const badgeShineStyle = {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
  };

  const sparkleStyle = {
    width: '28px',
    height: '28px',
    display: 'inline-block',
  };

  const headingStyle = {
    fontSize: '120px',
    fontWeight: '900',
    lineHeight: '1',
    color: '#1F2937',
    margin: '20px 0',
    letterSpacing: '-2px',
  };

  const subHeadingStyle = {
    fontSize: '28px',
    color: '#374151',
    margin: '20px 0 40px',
    fontWeight: '400',
  };

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    background: 'linear-gradient(90deg, #1F2937 0%, #111827 100%)',
    color: 'white',
    padding: '18px 40px',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    cursor: 'pointer',
    border: 'none',
  };

  const gridStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px',
  };

  const row1Style = {
    display: 'flex',
    gap: '20px',
    height: '320px',
  };

  const row2Style = {
    display: 'flex',
    gap: '20px',
    height: '240px',
  };

  const cardTallStyle = {
    position: 'relative',
    overflow: 'hidden',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    flex: '0 0 280px',
    opacity: isTransitioning ? 0 : 1,
    transform: isTransitioning ? 'scale(0.95) translateY(10px)' : 'scale(1) translateY(0)',
    transitionProperty: 'opacity, transform, box-shadow',
    transitionDuration: '0.6s',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const cardSmallStyle = {
    position: 'relative',
    overflow: 'hidden',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    flex: '1',
    minWidth: '0',
    opacity: isTransitioning ? 0 : 1,
    transform: isTransitioning ? 'scale(0.95) translateY(10px)' : 'scale(1) translateY(0)',
    transitionProperty: 'opacity, transform, box-shadow',
    transitionDuration: '0.6s',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'opacity 0.6s ease-in-out, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: isTransitioning ? 0.3 : 1,
    transform: isTransitioning ? 'scale(1.05)' : 'scale(1)',
  };



   const isAuthenticated = useSelector(selectIsAuthenticated);

     const handleShopClick = () => {
    if (isAuthenticated) {
      router.push('/products');
    } else {
      setShowLogin(true);
    }
  };
  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        {/* Left Content */}
        <div style={contentStyle}>
          <div>
            <div style={badgeWrapperStyle}>
              {/* Animated sparkle icon before badge */}
              <span style={sparkleStyle} className="sparkle-icon">✨</span>
              
              <span style={badgeStyle} className="animated-badge">
                <span style={badgeShineStyle} className="badge-shine"></span>
                {heroContent.badge}
              </span>
              
              {/* Animated sparkle icon after badge */}
              <span style={sparkleStyle} className="sparkle-icon sparkle-delayed">✨</span>
            </div>
          </div>
          
          <h1 style={headingStyle}>
            {heroContent.mainHeading}
          </h1>
          
          <p style={subHeadingStyle}>
            {heroContent.subHeading}
          </p>
          
          <div style={{ marginTop: '40px' }}  onClick={handleShopClick}>
            <button  style={buttonStyle}>
              {heroContent.buttonText}
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Product Grid */}
        <div style={gridStyle}>
          <div style={row1Style}>
            <div style={cardTallStyle}>
              <img 
                key={`img-0-${currentImageSet}`}
                src={currentImages[0].url} 
                alt={currentImages[0].alt} 
                style={imgStyle}
                loading="lazy"
              />
            </div>
            <div style={cardSmallStyle}>
              <img 
                key={`img-1-${currentImageSet}`}
                src={currentImages[1].url} 
                alt={currentImages[1].alt} 
                style={imgStyle}
                loading="lazy"
              />
            </div>
            <div style={cardSmallStyle}>
              <img 
                key={`img-2-${currentImageSet}`}
                src={currentImages[2].url} 
                alt={currentImages[2].alt} 
                style={imgStyle}
                loading="lazy"
              />
            </div>
          </div>
          
          <div style={row2Style}>
            <div style={cardSmallStyle}>
              <img 
                key={`img-3-${currentImageSet}`}
                src={currentImages[3].url} 
                alt={currentImages[3].alt} 
                style={imgStyle}
                loading="lazy"
              />
            </div>
            <div style={cardSmallStyle}>
              <img 
                key={`img-4-${currentImageSet}`}
                src={currentImages[4].url} 
                alt={currentImages[4].alt} 
                style={imgStyle}
                loading="lazy"
              />
            </div>
            <div style={cardSmallStyle}>
              <img 
                key={`img-5-${currentImageSet}`}
                src={currentImages[5].url} 
                alt={currentImages[5].alt} 
                style={imgStyle}
                loading="lazy"
              />
            </div>
            <div style={cardSmallStyle}>
              <img 
                key={`img-6-${currentImageSet}`}
                src={currentImages[6].url} 
                alt={currentImages[6].alt} 
                style={imgStyle}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>



  { showLogin &&   <LoginPopup close={() => setShowLogin(false)}/>}
    </section>
  );
}