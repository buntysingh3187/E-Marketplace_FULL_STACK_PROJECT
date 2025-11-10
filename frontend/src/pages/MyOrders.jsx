import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../AuthContext'

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        console.log('Orders fetched:', res.data)
        setOrders(res.data)
      })
      .catch(err => console.error('Error fetching orders:', err))
  }, [token])

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#FFC107'
      case 'confirmed': return '#007BFF'
      case 'shipped': return '#17A2B8'
      case 'delivered': return '#28a745'
      case 'cancelled': return '#dc3545'
      default: return '#6c757d'
    }
  }

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Order Placed'
      case 'confirmed': return 'Confirmed'
      case 'shipped': return 'Shipped'
      case 'delivered': return 'Delivered'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      paddingTop: '2rem',
      paddingBottom: '3rem'
    }}>
      <div className="container">
        <h2 className="mb-4 fw-bold text-center" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '2.8rem'
        }}>📦 My Orders</h2>
        
        {orders.length === 0 && (
          <div className="text-center py-5">
            <div style={{
              backgroundColor: 'white',
              borderRadius: '25px',
              padding: '60px 40px',
              maxWidth: '600px',
              margin: '0 auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📦</div>
              <h4 className="fw-bold mb-3" style={{ 
                background: 'linear-gradient(135deg, #FFC107 0%, #FF6F00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '1.8rem'
              }}>No orders yet</h4>
              <p className="fw-semibold mb-4" style={{ color: '#718096', fontSize: '1.2rem' }}>Start shopping to place your first order!</p>
            </div>
          </div>
        )}
        {orders.map(o => (
          <div key={o._id} className="card mb-4" style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            border: 'none',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-5px)'
            e.currentTarget.style.boxShadow = '0 25px 70px rgba(0,0,0,0.15)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.1)'
          }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="fw-bold" style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Order #{o._id.slice(-8)}</h5>
                <span className="badge" style={{ 
                  background: `linear-gradient(135deg, ${getStatusColor(o.status)} 0%, ${getStatusColor(o.status)} 100%)`,
                  color: 'white',
                  fontSize: '1rem',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  {getStatusText(o.status)}
                </span>
              </div>
              <p className="mb-2"><strong style={{ color: '#2d3748' }}>📅 Date:</strong> <span style={{ color: '#718096' }}>{new Date(o.createdAt).toLocaleDateString()}</span></p>
              <p className="fw-bold mb-3" style={{ 
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '1.3rem'
              }}>💰 Total: ${o.total}</p>
              <p className="mb-3"><strong style={{ color: '#2d3748' }}>💳 Payment Method:</strong> <span style={{ color: '#718096' }}>{o.paymentMethod || 'COD'}</span></p>
            
              {o.shippingAddress && (
                <div className="alert p-3 mb-3" style={{
                  background: 'linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%)',
                  border: 'none',
                  borderRadius: '12px'
                }}>
                  <h6 className="fw-bold mb-2" style={{ color: '#2d3748' }}>📍 Shipping Address:</h6>
                  <p className="mb-1" style={{ color: '#4a5568' }}><strong>{o.shippingAddress.fullName}</strong></p>
                  <p className="mb-1" style={{ color: '#4a5568' }}>📞 {o.shippingAddress.phone}</p>
                  <p className="mb-1" style={{ color: '#4a5568' }}>{o.shippingAddress.address}</p>
                  <p className="mb-0" style={{ color: '#4a5568' }}>{o.shippingAddress.city}, {o.shippingAddress.state} - {o.shippingAddress.pincode}</p>
                </div>
              )}

              <h6 className="mt-3 mb-2 fw-bold" style={{ color: '#2d3748' }}>🛍️ Items:</h6>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {o.items && o.items.map((it, idx) => {
                  // Get product ID - handle both populated and non-populated cases
                  const productId = it.product?._id || it.product
                  const productName = it.product?.name || 'Product'
                  
                  console.log('Order Item:', it)
                  console.log('Product ID:', productId)
                  console.log('Product Name:', productName)
                  
                  return (
                    <li key={idx} className="mb-2 p-3 d-flex justify-content-between align-items-center" style={{ 
                      color: '#4a5568',
                      backgroundColor: '#f7fafc',
                      borderRadius: '12px',
                      borderLeft: '4px solid #667eea'
                    }}>
                      <div>
                        <strong style={{ color: '#2d3748' }}>{productName}</strong>
                        <div className="small mt-1">
                          <span style={{ color: '#718096' }}>Quantity: {it.quantity}</span>
                          <span className="mx-2">•</span>
                          <span style={{ color: '#11998e', fontWeight: 'bold' }}>₹{it.price}</span>
                        </div>
                      </div>
                      {o.status === 'delivered' && productId && (
                        <button 
                          className="btn btn-sm"
                          onClick={() => {
                            console.log('Navigating to product:', productId)
                            navigate(`/products/${productId}?review=true`)
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #FFC107 0%, #FF6F00 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 16px',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            transition: 'all 0.3s ease',
                            whiteSpace: 'nowrap'
                          }}
                          onMouseEnter={e => {
                            e.target.style.transform = 'scale(1.05)'
                            e.target.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.4)'
                          }}
                          onMouseLeave={e => {
                            e.target.style.transform = 'scale(1)'
                            e.target.style.boxShadow = 'none'
                          }}
                        >
                          ✍️ Write Review
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>

              {/* Order tracking */}
              <div className="mt-4 p-4" style={{ 
                background: 'linear-gradient(135deg, #faf5ff 0%, #e9d8fd 100%)',
                borderRadius: '15px'
              }}>
                <h6 className="mb-4 fw-bold" style={{ color: '#2d3748' }}>🚚 Order Tracking</h6>
                <div className="d-flex justify-content-between align-items-center" style={{ position: 'relative' }}>
                  <div className="text-center" style={{ flex: 1, zIndex: 1 }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%', 
                      background: ['pending', 'confirmed', 'shipped', 'delivered'].includes(o.status) ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
                      margin: '0 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}>✓</div>
                    <small className="fw-bold d-block mt-2" style={{ color: '#2d3748' }}>Placed</small>
                  </div>
                  <div className="text-center" style={{ flex: 1, zIndex: 1 }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%', 
                      background: ['confirmed', 'shipped', 'delivered'].includes(o.status) ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
                      margin: '0 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      boxShadow: ['confirmed', 'shipped', 'delivered'].includes(o.status) ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                    }}>{['confirmed', 'shipped', 'delivered'].includes(o.status) ? '✓' : ''}</div>
                    <small className="fw-bold d-block mt-2" style={{ color: '#2d3748' }}>Confirmed</small>
                  </div>
                  <div className="text-center" style={{ flex: 1, zIndex: 1 }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%', 
                      background: ['shipped', 'delivered'].includes(o.status) ? 'linear-gradient(135deg, #FFC107 0%, #FF6F00 100%)' : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
                      margin: '0 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      boxShadow: ['shipped', 'delivered'].includes(o.status) ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                    }}>{['shipped', 'delivered'].includes(o.status) ? '✓' : ''}</div>
                    <small className="fw-bold d-block mt-2" style={{ color: '#2d3748' }}>Shipped</small>
                  </div>
                  <div className="text-center" style={{ flex: 1, zIndex: 1 }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%', 
                      background: o.status === 'delivered' ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
                      margin: '0 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      boxShadow: o.status === 'delivered' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                    }}>{o.status === 'delivered' ? '✓' : ''}</div>
                    <small className="fw-bold d-block mt-2" style={{ color: '#2d3748' }}>Delivered</small>
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '25px',
                    left: '10%',
                    right: '10%',
                    height: '4px',
                    background: 'linear-gradient(90deg, #e2e8f0 0%, #cbd5e0 100%)',
                    zIndex: 0,
                    borderRadius: '2px'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
