import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../AuthContext'

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = () => {
    axios.get('http://localhost:5000/api/wishlist', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setWishlist(res.data))
      .catch(err => console.error(err))
  }

  const removeFromWishlist = (productId) => {
    axios.delete(`http://localhost:5000/api/wishlist/${productId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setWishlist(res.data)
        alert('Removed from wishlist')
      })
      .catch(err => console.error(err))
  }

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push({ product: product._id, name: product.name, price: product.price, quantity: 1 })
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Added to cart!')
  }

  if (!wishlist) return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: '#667eea', width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', paddingTop: '40px', paddingBottom: '60px' }}>
      <div className="container">
        <h2 className="mb-5 fw-bold" style={{ 
          color: '#2d3748',
          fontSize: '2.8rem',
          textAlign: 'center'
        }}>
          ❤️ My Wishlist
        </h2>
      
      {wishlist.products.length === 0 ? (
        <div className="text-center py-5">
          <div 
            style={{ 
              background: 'white',
              borderRadius: '25px',
              padding: '60px 40px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>💔</div>
            <h4 className="fw-bold mb-3" style={{ color: '#667eea', fontSize: '2rem' }}>
              Your wishlist is empty
            </h4>
            <p className="fw-semibold mb-4" style={{ color: '#4a5568', fontSize: '1.2rem' }}>
              Start saving your favorite products!
            </p>
            <Link 
              to="/browse" 
              className="btn btn-lg" 
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '15px',
                padding: '15px 40px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                border: 'none',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
              }}
            >
              🏪 Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="row">
          {wishlist.products.map(p => (
            <div key={p._id} className="col-md-4 mb-4">
              <div 
                className="card h-100" 
                style={{ 
                  backgroundColor: '#FFFFFF',
                  border: 'none',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
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
                {p.image && (
                  <div style={{ position: 'relative', overflow: 'hidden', height: '250px' }}>
                    <img 
                      src={`http://localhost:5000${p.image}`} 
                      className="card-img-top" 
                      alt={p.name} 
                      style={{ 
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
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
                  <h5 className="card-title fw-bold" style={{ color: '#2d3748', minHeight: '60px' }}>{p.name}</h5>
                  <p className="card-text small" style={{ color: '#718096' }}>{p.description?.substring(0, 60)}...</p>
                  <div className="mb-2">
                    {p.rating > 0 ? (
                      <div className="d-flex align-items-center">
                        <span style={{ color: '#FFC107', fontSize: '1.2rem' }}>
                          {'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5 - Math.round(p.rating))}
                        </span>
                        <span className="ms-2 small">({p.numReviews})</span>
                      </div>
                    ) : (
                      <span className="small text-muted">No reviews yet</span>
                    )}
                  </div>
                  <p className="fs-4 fw-bold mb-3" style={{ 
                    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    ₹{p.price}
                  </p>
                  <div className="d-flex gap-2">
                    <Link 
                      to={`/products/${p._id}`} 
                      className="btn btn-sm flex-grow-1" 
                      style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRadius: '10px',
                        border: 'none',
                        padding: '10px'
                      }}
                    >
                      👁️ View
                    </Link>
                    <button 
                      className="btn btn-sm flex-grow-1" 
                      style={{ 
                        background: 'linear-gradient(135deg, #FFC107 0%, #FF6F00 100%)',
                        color: '#212529',
                        borderRadius: '10px',
                        border: 'none',
                        padding: '10px',
                        fontWeight: '600'
                      }} 
                      onClick={() => addToCart(p)}
                    >
                      🛒 Add
                    </button>
                    <button 
                      className="btn btn-sm" 
                      style={{ 
                        backgroundColor: '#fed7d7',
                        color: '#c53030',
                        borderRadius: '10px',
                        border: 'none',
                        padding: '10px',
                        fontWeight: '600'
                      }} 
                      onClick={() => removeFromWishlist(p._id)}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
