import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../AuthContext'
import { API_ENDPOINTS } from '../config/api'

export default function Cart() {
  const [cart, setCart] = useState([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [savedAddress, setSavedAddress] = useState(null)
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(c)
    
    // Fetch saved address from profile
    axios.get(API_ENDPOINTS.PROFILE, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data.address && res.data.address.fullName) {
          setSavedAddress(res.data.address)
          setAddress(res.data.address)
        }
      })
      .catch(err => console.error(err))
  }, [token])

  const placeOrder = async () => {
    if (cart.length === 0) return alert('Cart is empty')
    
    // Validate address
    if (!address.fullName || !address.phone || !address.address || !address.city || !address.state || !address.pincode) {
      return alert('Please fill all address fields')
    }
    
    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(address.phone)) {
      return alert('Phone number must be exactly 10 digits')
    }
    
    // Validate pincode (6 digits)
    if (!/^\d{6}$/.test(address.pincode)) {
      return alert('Pincode must be exactly 6 digits')
    }
    
    const items = cart.map(c => ({ product: c.product, quantity: c.quantity }))
    try {
      await axios.post(API_ENDPOINTS.ORDERS, { 
        items, 
        shippingAddress: address 
      }, { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      localStorage.removeItem('cart')
      alert('Order placed successfully! Payment: Cash on Delivery (COD)')
      navigate('/orders')
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Error placing order')
    }
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    
    // For phone: only digits, max 10
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 10)
      setAddress({ ...address, [name]: digits })
    }
    // For pincode: only digits, max 6
    else if (name === 'pincode') {
      const digits = value.replace(/\D/g, '').slice(0, 6)
      setAddress({ ...address, [name]: digits })
    }
    else {
      setAddress({ ...address, [name]: value })
    }
  }

  const removeItem = (idx) => {
    const newCart = cart.filter((_, i) => i !== idx)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0)

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
        }}>🛒 My Cart</h2>
        
        {cart.length === 0 && (
          <div className="text-center py-5">
            <div style={{
              backgroundColor: 'white',
              borderRadius: '25px',
              padding: '60px 40px',
              maxWidth: '600px',
              margin: '0 auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🛒</div>
              <h4 className="fw-bold mb-3" style={{ 
                background: 'linear-gradient(135deg, #FFC107 0%, #FF6F00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '1.8rem'
              }}>Your cart is empty</h4>
              <p className="fw-semibold mb-4" style={{ color: '#718096', fontSize: '1.2rem' }}>Add some products to get started!</p>
              <button 
                className="btn btn-lg"
                onClick={() => navigate('/browse')}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  color: 'white',
                  padding: '12px 40px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)'
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)'
                }}
              >
                🏪 Browse Products
              </button>
            </div>
          </div>
        )}
      
        {cart.length > 0 && !showCheckout && (
          <div className="row">
            <div className="col-md-8">
              <div className="card mb-3" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                border: 'none',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div className="card-body p-4">
                  <h4 className="mb-4 fw-bold" style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>🛍️ Shopping Cart ({cart.length} items)</h4>
                  {cart.map((c, idx) => (
                    <div key={idx} className="row mb-3 pb-3 border-bottom" style={{
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div className="col-md-8">
                        <h5 className="fw-bold mb-1" style={{ color: '#2d3748' }}>{c.name}</h5>
                        <p className="text-muted mb-2">📦 Quantity: {c.quantity}</p>
                        <p className="text-muted mb-0" 
                        style={{ 
                          color: '#11998e', 
                          fontSize: '1.1rem',
                          fontWeight: 'bold'
                        }}>₹{c.price} each</p>
                      </div>
                      <div className="col-md-4 text-end">
                        <p className="fw-bold mb-2" style={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          fontSize: '1.3rem'
                        }}>${(c.price * c.quantity).toFixed(2)}</p>
                        <button 
                          className="btn btn-sm"
                          onClick={() => removeItem(idx)}
                          style={{
                            background: 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)',
                            border: 'none',
                            color: '#c53030',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            padding: '6px 16px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                        >
                          ❌ Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card sticky-top" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                border: 'none',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)',
                top: '20px'
              }}>
                <div className="card-body p-4">
                  <h4 className="mb-4 fw-bold" style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>📊 Order Summary</h4>
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: '#718096' }}>Subtotal ({cart.length} items):</span>
                    <span className="fw-bold" style={{ color: '#2d3748' }}>${total.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: '#718096' }}>Delivery:</span>
                    <span className="fw-bold" style={{ 
                      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>FREE 🎉</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-4">
                    <span className="fs-5 fw-bold" style={{ color: '#2d3748' }}>Total:</span>
                    <span className="fs-4 fw-bold" style={{ 
                      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>${total.toFixed(2)}</span>
                  </div>
                  <button 
                    className="btn btn-lg w-100" 
                    style={{ 
                      background: 'linear-gradient(135deg, #FFC107 0%, #FF6F00 100%)',
                      color: 'white',
                      border: 'none',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      borderRadius: '12px',
                      padding: '14px',
                      boxShadow: '0 6px 20px rgba(255, 193, 7, 0.4)',
                      transition: 'all 0.3s ease'
                    }} 
                    onClick={() => setShowCheckout(true)}
                    onMouseEnter={e => {
                      e.target.style.transform = 'translateY(-2px)'
                      e.target.style.boxShadow = '0 8px 25px rgba(255, 193, 7, 0.6)'
                    }}
                    onMouseLeave={e => {
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow = '0 6px 20px rgba(255, 193, 7, 0.4)'
                    }}
                  >
                    💳 Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {cart.length > 0 && showCheckout && (
          <div className="row">
            <div className="col-md-7">
              <div className="card" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '25px',
                border: 'none',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div className="card-body p-4">
                  <h4 className="mb-4 fw-bold" style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>📍 Shipping Address</h4>
                
                {savedAddress && !useNewAddress ? (
                  <>
                    <div className="alert alert-success">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="fw-bold mb-2">Using Saved Address:</h6>
                          <p className="mb-1"><strong>{savedAddress.fullName}</strong></p>
                          <p className="mb-1">{savedAddress.phone}</p>
                          <p className="mb-1">{savedAddress.address}</p>
                          <p className="mb-0">{savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}</p>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="btn btn-outline-primary" 
                      onClick={() => {
                        setUseNewAddress(true)
                        setAddress({
                          fullName: '',
                          phone: '',
                          address: '',
                          city: '',
                          state: '',
                          pincode: ''
                        })
                      }}
                    >
                      + Use Different Address
                    </button>
                  </>
                ) : (
                  <>
                    {savedAddress && (
                      <button 
                        className="btn btn-outline-secondary mb-3" 
                        onClick={() => {
                          setUseNewAddress(false)
                          setAddress(savedAddress)
                        }}
                      >
                        ← Use Saved Address
                      </button>
                    )}
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: '#2d3748' }}>👤 Full Name</label>
                      <input type="text" name="fullName" className="form-control" 
                        style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                        value={address.fullName} onChange={handleAddressChange} placeholder="Enter full name" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: '#2d3748' }}>📞 Phone Number</label>
                      <input type="tel" name="phone" className="form-control" 
                        style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                        value={address.phone} onChange={handleAddressChange} 
                        placeholder="Enter 10 digit mobile number"
                        maxLength="10"
                        pattern="\d{10}" />
                      <small className="text-muted">Must be exactly 10 digits</small>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: '#2d3748' }}>🏠 Address</label>
                      <textarea name="address" className="form-control" 
                        style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                        value={address.address} onChange={handleAddressChange} placeholder="House No, Street, Area" rows="2"></textarea>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold" style={{ color: '#2d3748' }}>🏙️ City</label>
                        <input type="text" name="city" className="form-control" 
                          style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                          value={address.city} onChange={handleAddressChange} placeholder="City" />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold" style={{ color: '#2d3748' }}>🗺️ State</label>
                        <input type="text" name="state" className="form-control" 
                          style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                          value={address.state} onChange={handleAddressChange} placeholder="State" />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: '#2d3748' }}>📮 Pincode</label>
                      <input type="text" name="pincode" className="form-control" 
                        style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                        value={address.pincode} onChange={handleAddressChange} 
                        placeholder="Enter 6 digit pincode"
                        maxLength="6"
                        pattern="\d{6}" />
                      <small className="text-muted">Must be exactly 6 digits</small>
                    </div>
                  </>
                )}
                
                <div className="alert mt-4" style={{
                  background: 'linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#2c5282'
                }}>
                  <strong>💳 Payment Method:</strong> Cash on Delivery (COD)
                </div>

                <button className="btn btn-lg w-100 mb-2" 
                  style={{ 
                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                    color: 'white',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    borderRadius: '12px',
                    padding: '14px',
                    boxShadow: '0 6px 20px rgba(17, 153, 142, 0.4)',
                    transition: 'all 0.3s ease'
                  }} 
                  onClick={placeOrder}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 8px 25px rgba(17, 153, 142, 0.6)'
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 6px 20px rgba(17, 153, 142, 0.4)'
                  }}
                >
                  ✅ Place Order
                </button>
                <button className="btn btn-outline-secondary w-100" 
                  style={{ borderRadius: '12px', padding: '12px', fontWeight: '600' }}
                  onClick={() => setShowCheckout(false)}>
                  ← Back to Cart
                </button>
              </div>
            </div>
          </div>
          
            <div className="col-md-5">
              <div className="card sticky-top" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                border: 'none',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)',
                top: '20px'
              }}>
                <div className="card-body">
                  <h5 className="fw-bold mb-3" style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>📊 Order Summary</h5>
                {cart.map((c, idx) => (
                  <div key={idx} className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                    <div>
                      <span style={{ color: '#212529' }}>{c.name}</span>
                      <small className="text-muted d-block">Qty: {c.quantity}</small>
                    </div>
                    <span className="fw-bold" style={{ color: '#212529' }}>${(c.price * c.quantity).toFixed(2)}</span>
                  </div>
                ))}
                  <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                    <span className="fs-5 fw-bold" style={{ color: '#2d3748' }}>Total:</span>
                    <span className="fs-4 fw-bold" style={{ 
                      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
