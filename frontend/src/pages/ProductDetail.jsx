import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../AuthContext'
import { API_ENDPOINTS, API_URL } from '../config/api'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [reviews, setReviews] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [userOrders, setUserOrders] = useState([])
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [wishlistIds, setWishlistIds] = useState([])
  const { user, token } = useAuth()

  useEffect(() => {
    axios.get(`${API_ENDPOINTS.PRODUCTS}/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err))
    
    fetchReviews()
    
    if (user?.role === 'buyer') {
      fetchUserOrders()
      fetchWishlist()
    }

    // Check if review=true parameter exists, then open review form
    if (searchParams.get('review') === 'true' && user?.role === 'buyer') {
      setShowReviewForm(true)
      // Scroll to reviews section after a short delay
      setTimeout(() => {
        const reviewsSection = document.querySelector('.reviews-section')
        if (reviewsSection) {
          reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 500)
    }
  }, [id, searchParams, user])

  const fetchReviews = () => {
    axios.get(`${API_ENDPOINTS.REVIEWS}/product/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err))
  }

  const fetchUserOrders = () => {
    axios.get(API_ENDPOINTS.MY_ORDERS, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        console.log('All orders:', res.data)
        const deliveredOrders = res.data.filter(order => {
          const hasProduct = order.status === 'delivered' && 
            order.items.some(item => {
              const itemProductId = item.product?._id || item.product
              console.log('Checking item product:', itemProductId, 'against current product:', id)
              return itemProductId === id
            })
          return hasProduct
        })
        console.log('Filtered delivered orders for this product:', deliveredOrders)
        setUserOrders(deliveredOrders)
      })
      .catch(err => console.error('Error fetching orders:', err))
  }

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get(API_ENDPOINTS.WISHLIST, { headers: { Authorization: `Bearer ${token}` } })
      setWishlistIds(data.products.map(p => p._id))
    } catch (err) {
      console.error(err)
    }
  }

  const toggleWishlist = async () => {
    try {
      if (wishlistIds.includes(id)) {
        await axios.delete(`${API_ENDPOINTS.WISHLIST}/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        setWishlistIds(wishlistIds.filter(pid => pid !== id))
        alert('Removed from wishlist')
      } else {
        await axios.post(API_ENDPOINTS.WISHLIST, { productId: id }, { headers: { Authorization: `Bearer ${token}` } })
        setWishlistIds([...wishlistIds, id])
        alert('Added to wishlist')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const submitReview = () => {
    if (!selectedOrderId) {
      alert('Please select an order')
      return
    }
    axios.post(API_ENDPOINTS.REVIEWS, 
      { productId: id, orderId: selectedOrderId, rating, comment },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => {
        alert('Review submitted successfully!')
        setShowReviewForm(false)
        setComment('')
        setRating(5)
        setSelectedOrderId('')
        fetchReviews()
        // Refresh product to update rating
        axios.get(`${API_ENDPOINTS.PRODUCTS}/${id}`)
          .then(res => setProduct(res.data))
      })
      .catch(err => {
        alert(err.response?.data?.error || 'Failed to submit review')
      })
  }

  const addToCart = () => {
    if (qty > 10) {
      alert('Maximum 10 units allowed per order!')
      return
    }
    if (qty > product.stock) {
      alert(`Only ${product.stock} units available!`)
      return
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push({ product: product._id, name: product.name, price: product.price, quantity: qty })
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Added to cart!')
  }

  const buyNow = () => {
    if (qty > 10) {
      alert('Maximum 10 units allowed per order!')
      return
    }
    if (qty > product.stock) {
      alert(`Only ${product.stock} units available!`)
      return
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push({ product: product._id, name: product.name, price: product.price, quantity: qty })
    localStorage.setItem('cart', JSON.stringify(cart))
    navigate('/cart')
  }

  if (!product) return (
    <div className="container py-5 text-center">
      <div className="spinner-border" style={{ color: '#667eea', width: '3rem', height: '3rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )

  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', paddingTop: '40px', paddingBottom: '60px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb" style={{ backgroundColor: 'transparent' }}>
            <li className="breadcrumb-item"><a href="/browse" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>Browse</a></li>
            <li className="breadcrumb-item active" aria-current="page" style={{ color: '#4a5568', fontWeight: '600' }}>{product.name}</li>
          </ol>
        </nav>

        <div className="row g-4">
          {/* Left Column - Image + Actions */}
          <div className="col-lg-6">
            {/* Product Image Section */}
            <div 
              className="position-relative mb-4" 
              style={{ 
                background: 'white',
                borderRadius: '25px',
                padding: '20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                overflow: 'hidden',
                minHeight: '450px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {user?.role === 'buyer' && (
                <button 
                  className="btn position-absolute" 
                  style={{ 
                    top: '15px',
                    right: '15px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    zIndex: 10,
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={toggleWishlist}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  title={wishlistIds.includes(id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {wishlistIds.includes(id) ? '❤️' : '🤍'}
                </button>
              )}
              {product.image && (
                <img 
                  src={`${API_URL}${product.image}`} 
                  className="img-fluid" 
                  alt={product.name} 
                  style={{ 
                    borderRadius: '15px',
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease'
                  }} 
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
              )}
            </div>

            {/* Stock, Quantity and Buttons - Below Image */}
            <div 
              style={{ 
                background: 'white',
                borderRadius: '25px',
                padding: '25px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
              }}
            >
              {/* Stock Availability */}
              <div 
                className="mb-3 p-3" 
                style={{ 
                  background: product.stock > 0 
                    ? 'linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%)' 
                    : 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)',
                  borderRadius: '12px',
                  border: product.stock > 0 ? '2px solid #38b2ac' : '2px solid #fc8181'
                }}
              >
                <h6 className="mb-1 fw-bold" style={{ color: '#2d3748', fontSize: '1.05rem' }}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </h6>
                {product.stock > 0 ? (
                  <div>
                    <p className="mb-0 fw-semibold" style={{ color: product.stock > 10 ? '#38a169' : '#ed8936', fontSize: '1rem' }}>
                      {product.stock} units available
                    </p>
                    {product.stock <= 5 && (
                      <p className="mb-0 mt-1" style={{ 
                        color: '#c53030',
                        fontWeight: 'bold',
                        fontSize: '0.95rem'
                      }}>
                        Hurry! Only {product.stock} left in stock!
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mb-0" style={{ color: '#742a2a', fontSize: '1rem' }}>
                    This product is currently unavailable
                  </p>
                )}
              </div>

              {/* Quantity Selector and Buttons */}
              {user && user.role === 'buyer' && product.stock > 0 && (
                <div>
                  <div className="mb-3">
                    <label className="fw-bold mb-2" style={{ color: '#2d3748', fontSize: '1.1rem' }}>
                      Quantity
                    </label>
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={Math.min(product.stock, 10)}
                        value={qty}
                        onChange={e => {
                          const val = Number(e.target.value)
                          if (val <= 10) setQty(val)
                        }}
                        className="form-control form-control-lg"
                        style={{ 
                          width: '120px',
                          borderRadius: '12px',
                          border: '2px solid #e2e8f0',
                          fontSize: '1.3rem',
                          fontWeight: 'bold',
                          textAlign: 'center'
                        }}
                      />
                      <small style={{ color: '#718096', fontSize: '0.9rem' }}>
                        Max: 10 per order
                      </small>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-lg flex-grow-1" 
                      style={{ 
                        background: 'linear-gradient(135deg, #FFC107 0%, #FF6F00 100%)',
                        color: '#212529',
                        border: 'none',
                        borderRadius: '15px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        padding: '14px',
                        boxShadow: '0 4px 15px rgba(255, 193, 7, 0.4)',
                        transition: 'all 0.3s ease'
                      }} 
                      onClick={addToCart}
                      onMouseEnter={e => {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 6px 20px rgba(255, 193, 7, 0.6)'
                      }}
                      onMouseLeave={e => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = '0 4px 15px rgba(255, 193, 7, 0.4)'
                      }}
                    >
                      Add to Cart
                    </button>
                    <button 
                      className="btn btn-lg flex-grow-1" 
                      style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '15px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        padding: '14px',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                        transition: 'all 0.3s ease'
                      }} 
                      onClick={buyNow}
                      onMouseEnter={e => {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)'
                      }}
                      onMouseLeave={e => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              )}

              {user && user.role === 'buyer' && product.stock === 0 && (
                <div 
                  className="alert mb-0" 
                  style={{ 
                    background: 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)',
                    border: '2px solid #fc8181',
                    borderRadius: '12px',
                    color: '#742a2a',
                    padding: '14px',
                    fontSize: '1rem'
                  }}
                >
                  <strong>Sorry!</strong> This product is currently out of stock.
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Product Details Only */}
          <div className="col-lg-6">
            <div 
              style={{ 
                background: 'white',
                borderRadius: '25px',
                padding: '30px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                height: '100%'
              }}
            >
              {/* Category Badge */}
              <span 
                className="badge mb-3" 
                style={{ 
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  color: 'white',
                  fontSize: '0.9rem',
                  padding: '8px 18px',
                  borderRadius: '18px',
                  fontWeight: '600'
                }}
              >
                {product.category}
              </span>

              {/* Product Name */}
              <h1 className="fw-bold mb-3" style={{ 
                color: '#2d3748', 
                fontSize: '2.2rem',
                lineHeight: '1.3'
              }}>
                {product.name}
              </h1>
              
              {/* Rating Display */}
              <div className="mb-4 pb-3" style={{ borderBottom: '2px solid #e2e8f0' }}>
                {product.rating > 0 ? (
                  <div className="d-flex align-items-center">
                    <span style={{ color: '#FFC107', fontSize: '1.5rem' }}>
                      {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
                    </span>
                    <span className="ms-3 fw-semibold" style={{ color: '#4a5568', fontSize: '1rem' }}>
                      {product.rating.toFixed(1)} ({product.numReviews} reviews)
                    </span>
                  </div>
                ) : (
                  <span style={{ color: '#a0aec0' }}>No reviews yet</span>
                )}
              </div>
              
              {/* Price */}
              <div className="mb-4 pb-3" style={{ borderBottom: '2px solid #e2e8f0' }}>
                <span className="fw-bold" style={{ 
                  fontSize: '2.8rem',
                  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  ₹{product.price}
                </span>
              </div>

              {/* Description */}
              <p className="mb-0" style={{ color: '#4a5568', fontSize: '1.1rem', lineHeight: '1.7' }}>
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div 
          className="mt-5 reviews-section" 
          style={{ 
            background: 'white',
            borderRadius: '25px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }}
        >
          <div className="d-flex align-items-center mb-4" style={{ gap: '15px' }}>
            <h3 className="fw-bold mb-0" style={{ 
              color: '#2d3748',
              fontSize: '1.8rem'
            }}>
              Customer Reviews
            </h3>
            <span style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '6px 14px',
              borderRadius: '15px',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}>
              {reviews.length}
            </span>
          </div>
          
          {/* Write Review Button for Buyers with Delivered Orders */}
          {user?.role === 'buyer' && userOrders.length > 0 && (
            <div className="mb-4">
              <button 
                className="btn" 
                style={{ 
                  background: showReviewForm 
                    ? 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)' 
                    : 'linear-gradient(135deg, #FFC107 0%, #FF6F00 100%)',
                  color: showReviewForm ? 'white' : '#212529',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  padding: '10px 24px',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setShowReviewForm(!showReviewForm)}
                onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <div 
              className="mb-4" 
              style={{ 
                background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
                border: '2px solid #667eea',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.15)'
              }}
            >
              <h5 className="fw-bold mb-3" style={{ 
                color: '#2d3748',
                fontSize: '1.3rem'
              }}>
                Write Your Review
              </h5>
                
              <div className="mb-3">
                <label className="form-label fw-bold" style={{ color: '#2d3748', fontSize: '0.95rem' }}>
                  Select Your Order
                </label>
                <select 
                  className="form-select"
                  value={selectedOrderId}
                  onChange={e => setSelectedOrderId(e.target.value)}
                  style={{
                    borderRadius: '10px',
                    border: '2px solid #cbd5e0',
                    padding: '10px'
                  }}
                >
                  <option value="">Choose an order...</option>
                  {userOrders.map(order => {
                    const shortName = product?.name.length > 25 ? product.name.substring(0, 25) + '...' : product?.name
                    return (
                      <option key={order._id} value={order._id}>
                        {shortName} - {new Date(order.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </option>
                    )
                  })}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold" style={{ color: '#2d3748', fontSize: '0.95rem' }}>
                  Rating
                </label>
                <div className="d-flex gap-2 align-items-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className="btn"
                      style={{ 
                        fontSize: '2rem', 
                        border: 'none', 
                        backgroundColor: 'transparent',
                        color: star <= rating ? '#FFC107' : '#e0e0e0',
                        cursor: 'pointer',
                        padding: '0',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => setRating(star)}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.15)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ms-2 fw-bold" style={{ 
                    fontSize: '1.1rem',
                    color: '#667eea'
                  }}>
                    {rating} / 5
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold" style={{ color: '#2d3748', fontSize: '0.95rem' }}>
                  Your Review
                </label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Share your experience with this product..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  required
                  style={{
                    borderRadius: '10px',
                    border: '2px solid #cbd5e0',
                    padding: '12px',
                    fontSize: '0.95rem',
                    resize: 'none'
                  }}
                ></textarea>
                <small style={{ color: '#718096' }}>
                  {comment.length} characters
                </small>
              </div>

              <button 
                className="btn" 
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  padding: '10px 28px',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onClick={submitReview}
                disabled={!selectedOrderId || !comment.trim()}
                onMouseEnter={e => {
                  if (!e.target.disabled) {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)'
                  }
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)'
                }}
              >
                Submit Review
              </button>
            </div>
          )}

          {/* Display Reviews */}
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <div className="text-center py-4">
                <p className="fw-semibold" style={{ color: '#718096' }}>
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            ) : (
              reviews.map(review => (
                <div 
                  key={review._id} 
                  className="card mb-3" 
                  style={{ 
                    backgroundColor: '#f7fafc',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateX(3px)'
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.15)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateX(0)'
                    e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.08)'
                  }}
                >
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="fw-bold mb-1" style={{ color: '#2d3748', fontSize: '1rem' }}>
                          {review.buyer.name}
                        </h6>
                        <small style={{ color: '#718096', fontSize: '0.85rem' }}>
                          {new Date(review.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </small>
                      </div>
                      <div style={{ 
                        color: '#FFC107', 
                        fontSize: '1.1rem'
                      }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p className="mb-0" style={{ 
                      color: '#4a5568',
                      fontSize: '0.95rem',
                      lineHeight: '1.6'
                    }}>
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add CSS animations */}
        <style>{`
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
