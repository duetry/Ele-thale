// 'use client';
// import { useState, useMemo, useEffect } from 'react';
// import { Star, Filter, Search, Tag, TrendingUp } from 'lucide-react';
// import UnlockOfferModal from './UnlockOfferModel';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchCategories, fetchSubcategories } from '@/app/features/products/productSlice';

// export default function ProductsPage() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedSubCategory, setSelectedSubCategory] = useState('');
//   const [sortBy, setSortBy] = useState('featured');
//   const [hoveredCard, setHoveredCard] = useState(null);
//   const [hoveredCategory, setHoveredCategory] = useState(null);
//   const [hoveredSubCategory, setHoveredSubCategory] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);
// const dispatch = useDispatch();

// const {
//   categories,
//   loading: categoriesLoading,
//   error: categoriesError
// } = useSelector((state) => state.products);

// useEffect(() => {
//   dispatch(fetchCategories());
// }, [dispatch]);

// console.log("categories" , categories)

//   const categoryStructure = {
//     'Electronics': {
//       image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
//       subcategories: [
//         { name: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80' },
//         { name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80' },
//         { name: 'Tablets', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80' },
//         { name: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
//         { name: 'Cameras', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&q=80' },
//         { name: 'Smart Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80' },
//         { name: 'Gaming', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&q=80' }
//       ]
//     },
//     'Apparels': {
//       image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
//       subcategories: [
//         { name: 'Men\'s Clothing', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=300&q=80' },
//         { name: 'Women\'s Clothing', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80' },
//         { name: 'Kids Wear', image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=300&q=80' },
//         { name: 'Shoes', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300&q=80' },
//         { name: 'Bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80' },
//         { name: 'Accessories', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&q=80' },
//         { name: 'Sportswear', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&q=80' }
//       ]
//     }
//   };

//   const products = [
//     { ProductId: 1, Name: 'iPhone 15 Pro Max', Description: '6.7" Super Retina XDR display with ProMotion technology', Price: 1199.99, ImageUrl: 'https://images.unsplash.com/photo-1592286927505-2ff0099f04f6?w=600&q=80', Category: 'Electronics', SubCategory: 'Smartphones', IsForYou: true, IsBestOffer: true, Rating: 4.9, Remark: 'Trending', Discount: 15, StoreName: 'Tech Paradise', CreatedAt: '2024-12-01', StoreId: 101 },
//     { ProductId: 2, Name: 'MacBook Pro 16"', Description: 'M3 Max chip with 36GB RAM and 1TB SSD', Price: 2499.99, ImageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80', Category: 'Electronics', SubCategory: 'Laptops', IsForYou: false, IsBestOffer: true, Rating: 4.8, Remark: 'Best Seller', Discount: 10, StoreName: 'Tech Paradise', CreatedAt: '2024-12-05', StoreId: 101 },
//     { ProductId: 3, Name: 'Sony WH-1000XM5', Description: 'Premium noise cancelling wireless headphones', Price: 399.99, ImageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80', Category: 'Electronics', SubCategory: 'Headphones', IsForYou: true, IsBestOffer: true, Rating: 4.7, Remark: 'Hot Deal', Discount: 25, StoreName: 'Audio World', CreatedAt: '2024-11-28', StoreId: 102 },
//     { ProductId: 4, Name: 'iPad Pro 12.9"', Description: 'M2 chip with Liquid Retina XDR display', Price: 1099.99, ImageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80', Category: 'Electronics', SubCategory: 'Tablets', IsForYou: true, IsBestOffer: false, Rating: 4.8, Remark: 'New Arrival', Discount: 8, StoreName: 'Tech Paradise', CreatedAt: '2024-12-03', StoreId: 101 },
//     { ProductId: 5, Name: 'Canon EOS R5', Description: 'Professional mirrorless camera with 45MP sensor', Price: 3899.99, ImageUrl: 'https://images.unsplash.com/photo-1606980707186-2dc21e9b3c03?w=600&q=80', Category: 'Electronics', SubCategory: 'Cameras', IsForYou: false, IsBestOffer: true, Rating: 4.9, Remark: 'Professional', Discount: 12, StoreName: 'Camera Hub', CreatedAt: '2024-12-07', StoreId: 103 },
//     { ProductId: 6, Name: 'Apple Watch Series 9', Description: 'Advanced health and fitness features', Price: 429.99, ImageUrl: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80', Category: 'Electronics', SubCategory: 'Smart Watches', IsForYou: true, IsBestOffer: true, Rating: 4.7, Remark: 'Trending', Discount: 18, StoreName: 'Tech Paradise', CreatedAt: '2024-12-02', StoreId: 101 },
//     { ProductId: 7, Name: 'Classic Denim Jacket', Description: 'Premium quality denim with vintage wash finish', Price: 89.99, ImageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80', Category: 'Apparels', SubCategory: 'Men\'s Clothing', IsForYou: true, IsBestOffer: true, Rating: 4.6, Remark: 'Trending', Discount: 30, StoreName: 'Fashion Hub', CreatedAt: '2024-12-01', StoreId: 104 },
//     { ProductId: 8, Name: 'Elegant Evening Dress', Description: 'Silk blend cocktail dress with stunning embroidery', Price: 159.99, ImageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80', Category: 'Apparels', SubCategory: 'Women\'s Clothing', IsForYou: true, IsBestOffer: true, Rating: 4.8, Remark: 'Best Seller', Discount: 25, StoreName: 'Elegance Boutique', CreatedAt: '2024-12-05', StoreId: 105 },
//     { ProductId: 9, Name: 'Premium Leather Sneakers', Description: 'Handcrafted Italian leather with memory foam insole', Price: 129.99, ImageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80', Category: 'Apparels', SubCategory: 'Shoes', IsForYou: false, IsBestOffer: true, Rating: 4.7, Remark: 'Hot Deal', Discount: 35, StoreName: 'Shoe Palace', CreatedAt: '2024-11-28', StoreId: 106 },
//     { ProductId: 10, Name: 'Designer Backpack', Description: 'Water-resistant nylon with laptop compartment', Price: 79.99, ImageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', Category: 'Apparels', SubCategory: 'Bags', IsForYou: true, IsBestOffer: false, Rating: 4.5, Remark: 'New Arrival', Discount: 15, StoreName: 'Fashion Hub', CreatedAt: '2024-12-03', StoreId: 104 },
//     { ProductId: 11, Name: 'Kids Cotton T-Shirt Set', Description: 'Soft organic cotton, pack of 5 colorful tees', Price: 39.99, ImageUrl: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80', Category: 'Apparels', SubCategory: 'Kids Wear', IsForYou: true, IsBestOffer: true, Rating: 4.6, Remark: 'Value Pack', Discount: 20, StoreName: 'Kids Corner', CreatedAt: '2024-12-07', StoreId: 107 },
//     { ProductId: 12, Name: 'Sports Performance Jacket', Description: 'Moisture-wicking fabric with breathable mesh panels', Price: 69.99, ImageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80', Category: 'Apparels', SubCategory: 'Sportswear', IsForYou: false, IsBestOffer: true, Rating: 4.7, Remark: 'Hot Deal', Discount: 28, StoreName: 'Athletic Pro', CreatedAt: '2024-12-02', StoreId: 108 }
//   ];

//   const mainCategories = Object.keys(categoryStructure);

//   const currentSubCategories = useMemo(() => !selectedCategory ? [] : categoryStructure[selectedCategory]?.subcategories || [], [selectedCategory]);

//   const filteredProducts = useMemo(() => {
//     let f = products;
//     if (selectedCategory) f = f.filter(p => p.Category === selectedCategory);
//     if (selectedSubCategory) f = f.filter(p => p.SubCategory === selectedSubCategory);
//     if (searchQuery) f = f.filter(p => p.Name.toLowerCase().includes(searchQuery.toLowerCase()) || p.Description.toLowerCase().includes(searchQuery.toLowerCase()));

//     switch (sortBy) {
//       case 'price-low': return [...f].sort((a, b) => a.Price - b.Price);
//       case 'price-high': return [...f].sort((a, b) => b.Price - a.Price);
//       case 'rating': return [...f].sort((a, b) => b.Rating - a.Rating);
//       case 'discount': return [...f].sort((a, b) => b.Discount - a.Discount);
//       default: return f;
//     }
//   }, [selectedCategory, selectedSubCategory, searchQuery, sortBy]);



//   return (
//     <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)' }}>
//       <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        
//         <div style={{ textAlign: 'center', marginBottom: '50px' }}>
//           <div style={{ fontSize: '48px', fontWeight: '800', background: 'linear-gradient(135deg, #1F2937 0%, #4B5563 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '12px' }}>
//             Discover Our Collection
//           </div>
//           <div style={{ fontSize: '18px', color: '#6B7280' }}>Premium Electronics & Fashion for Every Lifestyle</div>
//         </div>

//         <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', background: 'white', borderRadius: '50px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '40px' }}>
//           <Search size={24} color="#6B7280" />
//           <input 
//             type="text"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             style={{ flex: 1, border: 'none', background: 'none', fontSize: '16px', outline: 'none', color: '#1F2937' }}
//           />
//         </div>

//         <div style={{ marginBottom: '40px' }}>
//           <div style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
//             <Filter size={24} />
//             Shop by Category
//           </div>

//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
//             {mainCategories.map(cat => {
//               const sel = selectedCategory === cat;
//               const hov = hoveredCategory === cat;
//               return (
//                 <div key={cat}>
//                   <div 
//                     onClick={() => {
//                       console.log("cat" , cat)
//                       setSelectedCategory(cat);
//                       setSelectedSubCategory('');
//                         dispatch(fetchSubcategories(cat?.Categoryid));

//                     }}
//                     onMouseEnter={() => setHoveredCategory(cat)}
//                     onMouseLeave={() => setHoveredCategory(null)}
//                     style={{ position: 'relative', height: '180px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', border: sel ? '3px solid #1F2937' : '3px solid transparent', boxShadow: hov ? '0 10px 30px rgba(0,0,0,0.15)' : '0 4px 15px rgba(0,0,0,0.08)', transform: hov ? 'translateY(-4px)' : 'translateY(0)', transition: 'all 0.3s ease' }}>
                    
//                     <img src={categoryStructure[cat].image} alt={cat} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: sel ? 'brightness(0.8)' : 'brightness(0.6)' }} />
                    
//                     <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))', display: 'flex', alignItems: 'flex-end', padding: '20px' }}>
//                       <div style={{ color: 'white', fontSize: '24px', fontWeight: '700' }}>{cat}</div>
//                     </div>

//                     {sel && (
//                       <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#10B981', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
//                         ✓ Selected
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {currentSubCategories.length > 0 && (
//             <div style={{ marginTop: '30px' }}>
//               <div style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '16px' }}>
//                 {selectedCategory} - Choose Subcategory
//               </div>

//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
//                 {currentSubCategories.map(sub => {
//                   const sel = selectedSubCategory === sub.name;
//                   const hov = hoveredSubCategory === sub.name;
//                   return (
//                     <div 
//                       key={sub.name}
//                       onClick={() => setSelectedSubCategory(sub.name)}
//                       onMouseEnter={() => setHoveredSubCategory(sub.name)}
//                       onMouseLeave={() => setHoveredSubCategory(null)}
//                       style={{ position: 'relative', height: '140px', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', border: sel ? '2px solid #D97706' : '2px solid #E5E7EB', boxShadow: hov ? '0 6px 20px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)', transform: hov ? 'translateY(-3px)' : 'translateY(0)', transition: 'all 0.3s ease' }}>
                      
//                       <img src={sub.image} alt={sub.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: sel ? 'brightness(0.8)' : 'brightness(0.7)' }} />
                      
//                       <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', display: 'flex', alignItems: 'flex-end', padding: '12px' }}>
//                         <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>{sub.name}</div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </div>

//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
//           {filteredProducts.map(product => {
//             const h = hoveredCard === product.ProductId;
//             return (
//               <div 
//                 key={product.ProductId}
//                 onMouseEnter={() => setHoveredCard(product.ProductId)}
//                 onMouseLeave={() => setHoveredCard(null)}
//                 style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: h ? '0 12px 40px rgba(0,0,0,0.12)' : '0 4px 15px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', transform: h ? 'translateY(-6px)' : 'translateY(0)', cursor: 'pointer' }}>
                
//                 <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
//                   <img src={product.ImageUrl} alt={product.Name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', transform: h ? 'scale(1.1)' : 'scale(1)' }} />
                  
//                   <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                     {product.IsBestOffer && <div style={{ background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'inline-block', boxShadow: '0 2px 8px rgba(220,38,38,0.3)' }}>🔥 {product.Discount}% OFF</div>}
//                     {product.IsForYou && <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'inline-block', boxShadow: '0 2px 8px rgba(124,58,237,0.3)' }}>✨ For You</div>}
//                   </div>

//                   {product.Remark && (
//                     <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
//                       <TrendingUp size={14} />
//                       {product.Remark}
//                     </div>
//                   )}

//                   <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', opacity: h ? 1 : 0, transition: 'opacity 0.3s' }}>
//                     <button 
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelectedProduct(product);
//                       }}
//                       style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'all 0.2s' }}>
//                       Unlock Offer
//                     </button>
//                   </div>
//                 </div>

//                 <div style={{ padding: '20px' }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px', color: '#6B7280' }}>
//                     <Tag size={14} />
//                     {product.Category} • {product.SubCategory}
//                   </div>

//                   <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '8px' }}>{product.StoreName}</div>

//                   <div style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', marginBottom: '8px', lineHeight: '1.3' }}>{product.Name}</div>

//                   <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px', lineHeight: '1.5', height: '40px', overflow: 'hidden' }}>{product.Description}</div>

//                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
//                     <Star size={16} fill="#F59E0B" color="#F59E0B" />
//                     <span style={{ fontWeight: '600', fontSize: '14px', color: '#1F2937' }}>{product.Rating}</span>
//                   </div>

//                   <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
//                     <div style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937' }}>${product.Price.toFixed(2)}</div>
//                     {product.Discount > 0 && <div style={{ fontSize: '16px', color: '#9CA3AF', textDecoration: 'line-through' }}>${(product.Price / (1 - product.Discount / 100)).toFixed(2)}</div>}
//                   </div>

//                   <div style={{ display: 'flex', gap: '12px' }}>
//                     <button 
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelectedProduct(product);
//                       }}
//                       style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: h ? '0 4px 12px rgba(0,0,0,0.2)' : 'none', transform: h ? 'translateY(-1px)' : 'translateY(0)' }}>
//                       Unlock Offer
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {filteredProducts.length === 0 && (
//           <div style={{ textAlign: 'center', padding: '80px 20px', color: '#6B7280' }}>
//             <div style={{ fontSize: '60px', marginBottom: '16px' }}>📦</div>
//             <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#1F2937' }}>No products found</div>
//             <div>Try adjusting your filters or search terms</div>
//           </div>
//         )}

//         {/* Unlock Offer Modal */}
//         <UnlockOfferModal 
//           product={selectedProduct} 
//           onClose={() => setSelectedProduct(null)} 
//         />
//       </div>
//     </div>
//   );
// }




'use client';
import { useState, useMemo, useEffect } from 'react';
import { Star, Filter, Search, Tag, TrendingUp, Loader2 } from 'lucide-react';
import UnlockOfferModal from './UnlockOfferModel';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchSubcategories, fetchProducts, fetchProductOffer } from '@/app/features/products/productSlice';

export default function ProductsPage() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [couponCode, setCouponCode] = useState(null);
  const dispatch = useDispatch();

  const {
    categories,
    categoriesLoading,
    subcategories,
    subcategoriesLoading,
    products,
    productsLoading,
    filters
  } = useSelector((state) => state.products);

  const { searchQuery, selectedCategory, selectedSubCategory, sortBy } = filters;

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch products on mount (without filters initially)
  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  // Fetch products when filters change
  useEffect(() => {
    const categoryId = selectedCategory || null;
    const subcategoryId = selectedSubCategory || null;
    
    dispatch(fetchProducts({
      categoryId,
      subcategoryId,
      search: searchQuery,
      sortBy
    }));
  }, [selectedCategory, selectedSubCategory, searchQuery, sortBy, dispatch]);

  // Get current subcategories for selected category
  const currentSubCategories = useMemo(() => {
    if (!selectedCategory || !subcategories[selectedCategory]) return [];
    return subcategories[selectedCategory].data || [];
  }, [selectedCategory, subcategories]);

  // Handle category selection
  const handleCategoryClick = (category) => {
    dispatch({ type: 'products/setSelectedCategory', payload: category.Categoryid });
    
    // Fetch subcategories for this category
    dispatch(fetchSubcategories(category.Categoryid));
  };

  // Handle subcategory selection
  const handleSubCategoryClick = (subCategoryId) => {
    dispatch({ type: 'products/setSelectedSubCategory', payload: subCategoryId });
  };

  // Handle search
  const handleSearchChange = (e) => {
    dispatch({ type: 'products/setSearchQuery', payload: e.target.value });
  };

  // Handle sort
  const handleSortChange = (value) => {
    dispatch({ type: 'products/setSortBy', payload: value });
  };



  console.log("products" , products)
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)', marginTop:"6rem" }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ fontSize: '48px', fontWeight: '800', background: 'linear-gradient(135deg, #1F2937 0%, #4B5563 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '12px' }}>
            Discover Our Collection
          </div>
          <div style={{ fontSize: '18px', color: '#6B7280' }}>Premium Electronics & Fashion for Every Lifestyle</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', background: 'white', borderRadius: '50px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '40px' }}>
          <Search size={24} color="#6B7280" />
          <input 
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ flex: 1, border: 'none', background: 'none', fontSize: '16px', outline: 'none', color: '#1F2937' }}
          />
        </div>

        {/* Sort Dropdown */}
        {/* <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <select 
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', cursor: 'pointer', outline: 'none' }}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
            <option value="discount">Discount</option>
          </select>
        </div> */}

        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Filter size={24} />
            Shop by Category
          </div>

          {categoriesLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px' }}>
              <Loader2 size={40} color="#6B7280" className="animate-spin" />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              {categories.map(cat => {
                const sel = selectedCategory === cat.Categoryid;
                const hov = hoveredCategory === cat.Categoryid;
                return (
                  <div key={cat.Categoryid}>
                    <div 
                      onClick={() => handleCategoryClick(cat)}
                      onMouseEnter={() => setHoveredCategory(cat.Categoryid)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      style={{ position: 'relative', height: '180px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', border: sel ? '3px solid #1F2937' : '3px solid transparent', boxShadow: hov ? '0 10px 30px rgba(0,0,0,0.15)' : '0 4px 15px rgba(0,0,0,0.08)', transform: hov ? 'translateY(-4px)' : 'translateY(0)', transition: 'all 0.3s ease' }}>
                      
                      <img src={cat.Imageurl} alt={cat.Categoryname} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: sel ? 'brightness(0.8)' : 'brightness(0.6)' }} />
                      
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))', display: 'flex', alignItems: 'flex-end', padding: '20px' }}>
                        <div style={{ color: 'white', fontSize: '24px', fontWeight: '700' }}>{cat.Categoryname}</div>
                      </div>

                      {sel && (
                        <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#10B981', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ✓ Selected
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {currentSubCategories.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '16px' }}>
                {categories.find(c => c.Categoryid === selectedCategory)?.Categoryname} - Choose Subcategory
              </div>

              {subcategoriesLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
                  <Loader2 size={32} color="#6B7280" className="animate-spin" />
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                  {currentSubCategories.map(sub => {
                    const sel = selectedSubCategory === sub.Subcategoryid;
                    const hov = hoveredSubCategory === sub.Subcategoryid;
                    return (
                      <div 
                        key={sub.Subcategoryid}
                        onClick={() => handleSubCategoryClick(sub.Subcategoryid)}
                        onMouseEnter={() => setHoveredSubCategory(sub.Subcategoryid)}
                        onMouseLeave={() => setHoveredSubCategory(null)}
                        style={{ position: 'relative', height: '140px', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', border: sel ? '2px solid #D97706' : '2px solid #E5E7EB', boxShadow: hov ? '0 6px 20px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)', transform: hov ? 'translateY(-3px)' : 'translateY(0)', transition: 'all 0.3s ease' }}>
                        
                        <img src={sub.Imageurl} alt={sub.Subcategoryname} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: sel ? 'brightness(0.8)' : 'brightness(0.7)' }} />
                        
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', display: 'flex', alignItems: 'flex-end', padding: '12px' }}>
                          <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>{sub.Subcategoryname}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {productsLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px' }}>
            <Loader2 size={48} color="#6B7280" className="animate-spin" />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {products && products.map(product => {
              const h = hoveredCard === product.Productid;
              const originalPrice = product.Discountprice ? (product.Price / (1 - product.Discountprice / 100)).toFixed(2) : null;
              
              return (
                <div 
                  key={product.Productid}
                  onMouseEnter={() => setHoveredCard(product.Productid)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: h ? '0 12px 40px rgba(0,0,0,0.12)' : '0 4px 15px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', transform: h ? 'translateY(-6px)' : 'translateY(0)', cursor: 'pointer' }}>
                  
                  <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                    <img src={product.Imageurl} alt={product.Productname} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', transform: h ? 'scale(1.1)' : 'scale(1)' }} />
                    
                    <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {product.Isbestoffer === 'true' && product.Discountprice && (
                        <div style={{ background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'inline-block', boxShadow: '0 2px 8px rgba(220,38,38,0.3)' }}>
                          🔥 {product.Discountprice}% OFF
                        </div>
                      )}
                      {product.Isforyou === 'true' && (
                        <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'inline-block', boxShadow: '0 2px 8px rgba(124,58,237,0.3)' }}>
                          ✨ For You
                        </div>
                      )}
                    </div>

                    {product.Remark && (
                      <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <TrendingUp size={14} />
                        {product.Remark}
                      </div>
                    )}

                    {/* <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', opacity: h ? 1 : 0, transition: 'opacity 0.3s' }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                        style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'all 0.2s' }}>
                        Unlock Offer
                      </button>
                    </div> */}
                  </div>

                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px', color: '#6B7280' }}>
                      <Tag size={14} />
                      {product.Categoryname} {product.Subcategoryname && `• ₹{product.Subcategoryname}`}
                    </div>

                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '8px' }}>{product.Storename}</div>

                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', marginBottom: '8px', lineHeight: '1.3' }}>{product.Productname}</div>

                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px', lineHeight: '1.5', height: '40px', overflow: 'hidden' }}>{product.Description}</div>

                    {product.Rating && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                        <Star size={16} fill="#F59E0B" color="#F59E0B" />
                        <span style={{ fontWeight: '600', fontSize: '14px', color: '#1F2937' }}>{product.Rating}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937' }}>₹{parseFloat(product.Price).toFixed(2)}</div>
                      {originalPrice && product.Discountprice > 0 && (
                        <div style={{ fontSize: '16px', color: '#9CA3AF', textDecoration: 'line-through' }}>₹{originalPrice}</div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        onClick={(e) => {

                          console.log("product" , product)
                             e.stopPropagation();

    dispatch(fetchProductOffer(product.Productid))
      .unwrap()
      .then((res) => {
        setCouponCode(res)
        setSelectedProduct(product); // send data to popup
        setShowOffer(true);           // open popup
      })
      .catch((err) => {
        console.error('Offer API failed:', err);
      });
  }}
                    
                        style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: h ? '0 4px 12px rgba(0,0,0,0.2)' : 'none', transform: h ? 'translateY(-1px)' : 'translateY(0)' }}>
                        Unlock Offer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!productsLoading && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#6B7280' }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>📦</div>
            <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#1F2937' }}>No products found</div>
            <div>Try adjusting your filters or search terms</div>
          </div>
        )}

        {/* Unlock Offer Modal */}
        <UnlockOfferModal 
          product={selectedProduct} 
          couponCode={couponCode} 
          onClose={() => setSelectedProduct(null)} 
        />
      </div>
    </div>
  );
}