'use client';
import React, { useState, useEffect } from 'react';
import { Star, Heart, ShoppingCart, Store, Clock, ChevronLeft, ChevronRight, Zap, Timer } from 'lucide-react';

const OffersPage = () => {
  const [filter, setFilter] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // Banner data - ADD YOUR IMAGE URLs HERE
  const banners = [
    {
      id: 1,
      imageUrl: "https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/a64908ba9bf2fe36.jpg?q=60",
      title: "Festival Sale",
      link: "/festival-offers"
    },
    {
      id: 2,
      imageUrl: "https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/d29d9bf5532f8ce2.jpeg?q=60",
      title: "Special Offers",
      link: "/special-offers"
    },
    {
      id: 3,
      imageUrl: "https://img.freepik.com/premium-vector/vector-illustration-merry-christmas-sale-banner_35365794.jpg",
      title: "Christmas Sale",
      link: "/christmas-offers"
    }
  ];

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const products = [
    { ProductId: 1, Name: 'iPhone 15 Pro Max', Description: '6.7" Super Retina XDR display with ProMotion technology', Price: 1199.99, ImageUrl: 'https://images.unsplash.com/photo-1592286927505-2ff0099f04f6?w=600&q=80', Category: 'Electronics', SubCategory: 'Smartphones', IsForYou: true, IsBestOffer: true, Rating: 4.9, Remark: 'Trending', Discount: 15, StoreName: 'Tech Paradise', CreatedAt: '2024-12-01', StoreId: 101 },
    { ProductId: 2, Name: 'MacBook Pro 16"', Description: 'M3 Max chip with 36GB RAM and 1TB SSD', Price: 2499.99, ImageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80', Category: 'Electronics', SubCategory: 'Laptops', IsForYou: false, IsBestOffer: true, Rating: 4.8, Remark: 'Best Seller', Discount: 10, StoreName: 'Tech Paradise', CreatedAt: '2024-12-05', StoreId: 101 },
    { ProductId: 3, Name: 'Sony WH-1000XM5', Description: 'Premium noise cancelling wireless headphones', Price: 399.99, ImageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80', Category: 'Electronics', SubCategory: 'Headphones', IsForYou: true, IsBestOffer: true, Rating: 4.7, Remark: 'Hot Deal', Discount: 25, StoreName: 'Audio World', CreatedAt: '2024-11-28', StoreId: 102 },
    { ProductId: 4, Name: 'iPad Pro 12.9"', Description: 'M2 chip with Liquid Retina XDR display', Price: 1099.99, ImageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80', Category: 'Electronics', SubCategory: 'Tablets', IsForYou: true, IsBestOffer: false, Rating: 4.8, Remark: 'New Arrival', Discount: 8, StoreName: 'Tech Paradise', CreatedAt: '2024-12-03', StoreId: 101 },
    { ProductId: 5, Name: 'Samsung Galaxy S24 Ultra', Description: '6.8" Dynamic AMOLED display with S Pen', Price: 1299.99, ImageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80', Category: 'Electronics', SubCategory: 'Smartphones', IsForYou: false, IsBestOffer: true, Rating: 4.8, Remark: 'Hot Deal', Discount: 12, StoreName: 'Mobile Hub', CreatedAt: '2024-11-30', StoreId: 103 },
    { ProductId: 6, Name: 'AirPods Pro 2nd Gen', Description: 'Active noise cancellation with spatial audio', Price: 249.99, ImageUrl: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600&q=80', Category: 'Electronics', SubCategory: 'Headphones', IsForYou: true, IsBestOffer: true, Rating: 4.7, Remark: 'Best Seller', Discount: 20, StoreName: 'Audio World', CreatedAt: '2024-12-02', StoreId: 102 }
  ];

  const categories = ['all', 'Smartphones', 'Laptops', 'Tablets', 'Headphones'];

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(product => product.SubCategory === filter);

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount / 100)).toFixed(2);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif" }}>
      {/* Banner Carousel */}
      <div className="relative overflow-hidden bg-slate-100" style={{ height: '500px' }}>
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-full object-contain bg-slate-900"
            />
          </div>
        ))}
        
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-4 rounded-full shadow-xl z-10 transition-all"
        >
          <ChevronLeft size={32} className="text-slate-900" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-4 rounded-full shadow-xl z-10 transition-all"
        >
          <ChevronRight size={32} className="text-slate-900" />
        </button>
        
        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-12' : 'bg-white bg-opacity-50 w-3'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 24 Hours Flash Sale - Light & Elegant Design */}
      <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
        {/* Subtle Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12">
          {/* Flash Sale Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white bg-opacity-80 backdrop-blur-lg border border-slate-200 px-8 py-4 rounded-full mb-6 shadow-lg">
              <Zap className="text-amber-500" size={28} fill="currentColor" />
              <span className="text-slate-800 text-2xl md:text-3xl font-bold tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Flash Sale
              </span>
              <Zap className="text-amber-500" size={28} fill="currentColor" />
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-3">
              Deal Ends In
            </h2>
          </div>

          {/* Countdown Timer - Elegant Cards */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto mb-10">
            {/* Hours */}
            <div className="group">
              <div className="relative bg-white bg-opacity-90 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50 rounded-3xl"></div>
                <div className="relative">
                  <div className="text-6xl md:text-8xl font-bold text-slate-800 mb-3">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-sm md:text-base font-semibold text-slate-500 uppercase tracking-wider">
                    Hours
                  </div>
                </div>
              </div>
            </div>

            {/* Minutes */}
            <div className="group">
              <div className="relative bg-white bg-opacity-90 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-50 rounded-3xl"></div>
                <div className="relative">
                  <div className="text-6xl md:text-8xl font-bold text-slate-800 mb-3">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-sm md:text-base font-semibold text-slate-500 uppercase tracking-wider">
                    Minutes
                  </div>
                </div>
              </div>
            </div>

            {/* Seconds */}
            <div className="group">
              <div className="relative bg-white bg-opacity-90 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-50 rounded-3xl"></div>
                <div className="relative">
                  <div className="text-6xl md:text-8xl font-bold text-slate-800 mb-3">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-sm md:text-base font-semibold text-slate-500 uppercase tracking-wider">
                    Seconds
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <p className="text-xl md:text-2xl font-semibold text-slate-700 mb-6">
              Exclusive deals waiting for you ✨
            </p>
            
            <button className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-900 hover:to-slate-800 text-white px-12 py-5 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <span>Shop Flash Deals</span>
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>

            <div className="mt-8 flex items-center justify-center gap-8 text-slate-600 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>Live Now</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer size={16} />
                <span>Limited Time</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-amber-500" fill="currentColor" />
                <span>Premium Deals</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products List - Horizontal Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {products.map((product) => {
            const discountedPrice = calculateDiscountedPrice(product.Price, product.Discount);
            
            return (
              <div
                key={product.ProductId}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Product Image */}
                  <div className="relative md:w-80 h-64 md:h-auto overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={product.ImageUrl}
                      alt={product.Name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <div className="absolute top-3 right-3 bg-amber-400 text-slate-900 px-4 py-2 rounded-xl font-bold shadow-lg text-lg">
                      {product.Discount}% OFF
                    </div>
                    
                    <button
                      onClick={() => toggleFavorite(product.ProductId)}
                      className="absolute bottom-3 right-3 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <Heart
                        size={24}
                        className={favorites.includes(product.ProductId) ? 'fill-red-500 text-red-500' : 'text-slate-400'}
                      />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Store size={16} />
                          <span className="font-medium">{product.StoreName}</span>
                        </div>
                        <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full">
                          {product.Remark}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                        {product.Name}
                      </h3>
                      
                      <p className="text-base text-slate-600 mb-4 leading-relaxed">
                        {product.Description}
                      </p>
                      
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg">
                          <Star size={18} className="fill-amber-400 text-amber-400" />
                          <span className="text-base font-bold text-slate-900">{product.Rating}</span>
                        </div>
                        <span className="text-sm text-slate-500">•</span>
                        <span className="text-sm text-slate-600 font-medium">{product.SubCategory}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                      <div>
                        <div className="flex items-baseline gap-3 mb-1">
                          <div className="text-4xl font-bold text-slate-900">${discountedPrice}</div>
                          <div className="text-xl text-slate-400 line-through">${product.Price}</div>
                        </div>
                        <div className="text-sm text-emerald-600 font-semibold">
                          You save ${(product.Price - discountedPrice).toFixed(2)} ({product.Discount}% off)
                        </div>
                      </div>
                      
                      <button className="w-full sm:w-auto bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-900 hover:to-slate-800 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg text-lg">
                        <ShoppingCart size={22} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OffersPage;