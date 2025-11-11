import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../AuthContext'
import { API_ENDPOINTS } from '../config/api'

export default function Profile() {
  const { user, token } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({
    name: '',
    address: {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    }
  })

  useEffect(() => {
    fetchProfile()
  }, [token])

  const fetchProfile = () => {
    setLoading(true)
    axios.get(API_ENDPOINTS.PROFILE, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setProfile(res.data)
        setForm({
          name: res.data.name,
          address: res.data.address || {
            fullName: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            pincode: ''
          }
        })
        setLoading(false)
      })
      .catch(err => {
        console.error('Profile fetch error:', err)
        console.error('Error response:', err.response)
        // Fallback to user data from context if API fails
        if (user) {
          setProfile({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            address: null
          })
          setForm({
            name: user.name,
            address: {
              fullName: '',
              phone: '',
              address: '',
              city: '',
              state: '',
              pincode: ''
            }
          })
        }
        setLoading(false)
      })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    
    // Validate phone number (10 digits)
    if (form.address.phone && !/^\d{10}$/.test(form.address.phone)) {
      alert('Phone number must be exactly 10 digits')
      return
    }
    
    // Validate pincode (6 digits)
    if (form.address.pincode && !/^\d{6}$/.test(form.address.pincode)) {
      alert('Pincode must be exactly 6 digits')
      return
    }
    
    try {
      const updateData = {
        name: form.name,
        address: form.address
      }
      
      await axios.put(API_ENDPOINTS.PROFILE, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Profile updated successfully!')
      setEditMode(false)
      fetchProfile()
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Error updating profile')
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        paddingTop: '3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-center">
          <div className="spinner-border" role="status" style={{ 
            width: '3rem', 
            height: '3rem',
            color: '#667eea'
          }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 fs-5 fw-bold" style={{ color: '#2d3748' }}>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      paddingTop: '3rem'
    }}>
      <div className="container">
        <div className="alert alert-danger" style={{ borderRadius: '15px' }}>Failed to load profile</div>
      </div>
    </div>
  )

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
        }}>👤 My Profile</h2>
      
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              border: 'none',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <div style={{ 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    margin: '0 auto',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                  }}>
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <h4 className="fw-bold mb-2" style={{ color: '#2d3748' }}>{profile.name}</h4>
                <p style={{ color: '#718096', marginBottom: '1rem' }}>📧 {profile.email}</p>
                <span className="badge" style={{ 
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  color: 'white',
                  fontSize: '1rem',
                  padding: '0.6rem 1.4rem',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(17, 153, 142, 0.3)'
                }}>
                  {profile.role === 'buyer' ? '🛒 Buyer' : '💼 Seller'}
                </span>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              border: 'none',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold" style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>📋 Profile Information</h4>
                  {!editMode && (
                    <button className="btn" 
                      style={{ 
                        background: 'linear-gradient(135deg, #FFC107 0%, #FF6F00 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '10px 24px',
                        boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => setEditMode(true)}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    >
                      ✏️ Edit Profile
                    </button>
                  )}
                </div>

                {!editMode ? (
                  <>
                    <div className="mb-4 p-3" style={{ backgroundColor: '#f7fafc', borderRadius: '12px' }}>
                      <label className="fw-bold text-muted small">👤 NAME</label>
                      <p className="fs-5 mb-0" style={{ color: '#2d3748' }}>{profile.name}</p>
                    </div>
                    <div className="mb-4 p-3" style={{ backgroundColor: '#f7fafc', borderRadius: '12px' }}>
                      <label className="fw-bold text-muted small">📧 EMAIL</label>
                      <p className="fs-5 mb-0" style={{ color: '#2d3748' }}>{profile.email}</p>
                    </div>
                    
                    <hr style={{ margin: '2rem 0' }} />
                    <h5 className="mb-3 fw-bold" style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>📍 Saved Address</h5>
                    {profile.address && profile.address.fullName ? (
                      <div className="p-4" style={{ 
                        background: 'linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%)',
                        borderRadius: '15px'
                      }}>
                        <p className="mb-2 fw-bold" style={{ color: '#2d3748' }}>{profile.address.fullName}</p>
                        <p className="mb-2" style={{ color: '#4a5568' }}>📞 {profile.address.phone}</p>
                        <p className="mb-2" style={{ color: '#4a5568' }}>{profile.address.address}</p>
                        <p className="mb-0" style={{ color: '#4a5568' }}>{profile.address.city}, {profile.address.state} - {profile.address.pincode}</p>
                      </div>
                    ) : (
                      <p style={{ color: '#718096' }}>📭 No address saved yet.</p>
                    )}
                  </>
                ) : (
                  <form onSubmit={handleUpdate}>
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: '#2d3748' }}>👤 Name</label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>

                    <hr style={{ margin: '2rem 0' }} />
                    <h5 className="mb-3 fw-bold" style={{ color: '#2d3748' }}>📍 Shipping Address</h5>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: '#2d3748' }}>Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                        value={form.address.fullName}
                        onChange={e => setForm({ ...form, address: { ...form.address, fullName: e.target.value } })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: '#2d3748' }}>Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                        value={form.address.phone}
                        onChange={e => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                          setForm({ ...form, address: { ...form.address, phone: value } })
                        }}
                        placeholder="Enter 10 digit mobile number"
                        maxLength="10"
                        pattern="\d{10}"
                      />
                      <small className="text-muted">Must be exactly 10 digits</small>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: '#2d3748' }}>Address</label>
                      <textarea
                        className="form-control"
                        style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                        value={form.address.address}
                        onChange={e => setForm({ ...form, address: { ...form.address, address: e.target.value } })}
                        placeholder="House No, Street, Area"
                        rows="2"
                      ></textarea>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold" style={{ color: '#2d3748' }}>City</label>
                        <input
                          type="text"
                          className="form-control"
                          style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                          value={form.address.city}
                          onChange={e => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
                          placeholder="City"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold" style={{ color: '#2d3748' }}>State</label>
                        <input
                          type="text"
                          className="form-control"
                          style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                          value={form.address.state}
                          onChange={e => setForm({ ...form, address: { ...form.address, state: e.target.value } })}
                          placeholder="State"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold" style={{ color: '#2d3748' }}>Pincode</label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                        value={form.address.pincode}
                        onChange={e => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                          setForm({ ...form, address: { ...form.address, pincode: value } })
                        }}
                        placeholder="Enter 6 digit pincode"
                        maxLength="6"
                        pattern="\d{6}"
                      />
                      <small className="text-muted">Must be exactly 6 digits</small>
                    </div>

                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-lg" 
                        style={{ 
                          background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                          color: 'white',
                          fontWeight: 'bold',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '12px 30px',
                          boxShadow: '0 6px 20px rgba(17, 153, 142, 0.4)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={e => {
                          e.target.style.transform = 'translateY(-2px)'
                          e.target.style.boxShadow = '0 8px 25px rgba(17, 153, 142, 0.6)'
                        }}
                        onMouseLeave={e => {
                          e.target.style.transform = 'translateY(0)'
                          e.target.style.boxShadow = '0 6px 20px rgba(17, 153, 142, 0.4)'
                        }}
                      >
                        ✅ Save Changes
                      </button>
                      <button type="button" className="btn btn-lg btn-outline-secondary" 
                        style={{ borderRadius: '12px', padding: '12px 30px', fontWeight: '600' }}
                        onClick={() => { setEditMode(false); fetchProfile() }}>
                        ❌ Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
