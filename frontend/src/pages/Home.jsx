import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../AuthContext'

export default function Home() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [wishlistIds, setWishlistIds] = useState([])
  const [reviews, setReviews] = useState([])
  const [userOrders, setUserOrders] = useState([])
  const { token, user } = useAuth()

  const fetchProducts = async () => {
    try {
      const params = {};
      if (search) params.q = search;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sortBy) params.sortBy = sortBy;
      
      const { data } = await axios.get('http://localhost:5000/api/products', { params })
      setProducts(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchProducts()
    if (user?.role === 'buyer') fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/wishlist', { headers: { Authorization: `Bearer ${token}` } })
      setWishlistIds(data.products.map(p => p._id))
    } catch (err) {
      console.error(err)
    }
  }

  const toggleWishlist = async (productId) => {
    try {
      if (wishlistIds.includes(productId)) {
        await axios.delete(`http://localhost:5000/api/wishlist/${productId}`, { headers: { Authorization: `Bearer ${token}` } })
        setWishlistIds(wishlistIds.filter(id => id !== productId))
        alert('Removed from wishlist')
      } else {
        await axios.post('http://localhost:5000/api/wishlist', { productId }, { headers: { Authorization: `Bearer ${token}` } })
        setWishlistIds([...wishlistIds, productId])
        alert('Added to wishlist')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSearch = () => fetchProducts()

  const handleClear = () => {
    setSearch('')
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    setSortBy('')
    // Fetch all products without filters
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
  }

  return (
    <div className="container-fluid py-4" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <div className="container">
        {/* Hero Section */}
        <div className="mb-5 text-center py-5" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 className="display-3 fw-bold mb-3" style={{ 
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              animation: 'fadeInDown 1s ease-in-out'
            }}>
              Welcome to E-Marketplace
            </h1>
            <p className="lead fs-4 mb-0" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
              Discover amazing products from trusted sellers worldwide
            </p>
          </div>
          {/* Animated Background Elements */}
          <div style={{ 
            position: 'absolute', 
            top: '-50px', 
            right: '-50px', 
            width: '200px', 
            height: '200px', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          <div style={{ 
            position: 'absolute', 
            bottom: '-30px', 
            left: '-30px', 
            width: '150px', 
            height: '150px', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '50%',
            animation: 'float 4s ease-in-out infinite'
          }}></div>
        </div>

        {/* Filter Section with Glass Morphism */}
        <div className="mb-5" style={{ 
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          padding: '30px',
          transition: 'all 0.3s ease'
        }}>
          <h4 className="mb-4 fw-bold" style={{ 
            color: '#667eea',
            fontSize: '1.8rem'
          }}>
            Find Your Perfect Product
          </h4>
          <div className="row">
            <div className="col-md-3 mb-3">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
                style={{ 
                  borderRadius: '15px',
                  border: '2px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
                onFocus={e => e.target.style.border = '2px solid #667eea'}
                onBlur={e => e.target.style.border = '2px solid #e0e0e0'}
              />
            </div>
            <div className="col-md-2 mb-3">
              <select
                className="form-select form-select-lg"
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ 
                  borderRadius: '15px',
                  border: '2px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
                <option value="Beauty">Beauty</option>
                <option value="Toys">Toys</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-md-2 mb-3">
              <input
                type="number"
                className="form-control form-control-lg"
                placeholder="Min Price"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                style={{ 
                  borderRadius: '15px',
                  border: '2px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              />
            </div>
            <div className="col-md-2 mb-3">
              <input
                type="number"
                className="form-control form-control-lg"
                placeholder="Max Price"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                style={{ 
                  borderRadius: '15px',
                  border: '2px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              />
            </div>
            <div className="col-md-2 mb-3">
              <select
                className="form-select form-select-lg"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{ 
                  borderRadius: '15px',
                  border: '2px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <option value="">Sort By</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            <div className="col-md-1 mb-3">
              <button 
                className="btn btn-lg w-100" 
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)'
                }}
                onClick={handleSearch}
                onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              >
                Search
              </button>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-12">
              <button 
                className="btn btn-outline-secondary" 
                onClick={handleClear}
                style={{ 
                  borderRadius: '15px',
                  transition: 'all 0.3s ease',
                  fontWeight: '600'
                }}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold" style={{ 
            color: '#2d3748',
            fontSize: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            Featured Products 
            <span style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '5px 15px',
              borderRadius: '20px',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}>
              {products.length}
            </span>
          </h3>
        </div>

      <div className="row">
        {products.map(p => (
          <div key={p._id} className="col-md-4 mb-4">
            <div 
              className="card h-100 position-relative" 
              style={{ 
                backgroundColor: '#FFFFFF',
                border: 'none',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-10px)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'
              }}
            >
              {user?.role === 'buyer' && (
                <button 
                  className="btn btn-sm position-absolute" 
                  style={{ 
                    top: '15px',
                    right: '15px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    fontSize: '1.8rem',
                    cursor: 'pointer',
                    zIndex: 10,
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleWishlist(p._id)
                  }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.2)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  title={wishlistIds.includes(p._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {wishlistIds.includes(p._id) ? '❤️' : '🤍'}
                </button>
              )}
              
              {p.image && (
                <div style={{ position: 'relative', overflow: 'hidden', height: '280px', background: '#f8f9fa' }}>
                  <img 
                    src={`http://localhost:5000${p.image}`} 
                    className="card-img-top" 
                    alt={p.name} 
                    style={{ 
                      height: '100%',
                      width: '100%',
                      objectFit: 'contain',
                      padding: '15px',
                      transition: 'transform 0.5s ease'
                    }} 
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                </div>
              )}
              
              <div className="card-body" style={{ padding: '20px' }}>
                {p.category && (
                  <span 
                    className="badge mb-2" 
                    style={{ 
                      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                      color: 'white',
                      padding: '8px 15px',
                      fontSize: '0.85rem',
                      borderRadius: '20px',
                      fontWeight: '600'
                    }}
                  >
                    {p.category}
                  </span>
                )}
                <h5 className="card-title fw-bold mt-2" style={{ color: '#2d3748', fontSize: '1.3rem', minHeight: '60px' }}>
                  {p.name}
                </h5>
                <p className="card-text small" style={{ color: '#718096', lineHeight: '1.6' }}>
                  {p.description?.substring(0, 80)}...
                </p>
                
                {/* Rating */}
                <div className="mb-3">
                  {p.rating > 0 ? (
                    <div className="d-flex align-items-center">
                      <span style={{ color: '#FFC107', fontSize: '1.3rem', textShadow: '0 2px 4px rgba(255,193,7,0.3)' }}>
                        {'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5 - Math.round(p.rating))}
                      </span>
                      <span className="ms-2 small fw-semibold" style={{ color: '#718096' }}>
                        ({p.numReviews} reviews)
                      </span>
                    </div>
                  ) : (
                    <span className="small" style={{ color: '#cbd5e0' }}>⭐ No reviews yet</span>
                  )}
                </div>

                {/* Stock Badge */}
                <div className="mb-3">
                  <span 
                    className="badge" 
                    style={{ 
                      backgroundColor: p.stock > 10 ? '#48bb78' : p.stock > 0 ? '#ed8936' : '#f56565',
                      color: 'white',
                      padding: '6px 12px',
                      fontSize: '0.85rem',
                      borderRadius: '10px'
                    }}
                  >
                    {p.stock > 0 ? `📦 ${p.stock} in stock` : '❌ Out of Stock'}
                  </span>
                  {p.stock <= 5 && p.stock > 0 && (
                    <span className="badge ms-2" style={{ 
                      backgroundColor: '#fed7d7',
                      color: '#c53030',
                      padding: '6px 12px',
                      fontSize: '0.85rem',
                      borderRadius: '10px',
                      animation: 'pulse 2s infinite'
                    }}>
                      🔥 Low Stock!
                    </span>
                  )}
                </div>

                {/* Price and Button */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="fs-3 fw-bold" style={{ 
                    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    ₹{p.price}
                  </span>
                  <Link 
                    to={`/products/${p._id}`} 
                    className="btn"
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 24px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={e => {
                      e.target.style.transform = 'translateX(5px)'
                      e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)'
                    }}
                    onMouseLeave={e => {
                      e.target.style.transform = 'translateX(0)'
                      e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
                    }}
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🔍</div>
          <h4 className="fw-bold mb-3" style={{ color: '#4a5568' }}>No products found</h4>
          <p style={{ color: '#718096', fontSize: '1.1rem' }}>Try adjusting your filters or search terms</p>
        </div>
      )}
      
      {/* Add CSS animations */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
      </div>
    </div>
  )
}
