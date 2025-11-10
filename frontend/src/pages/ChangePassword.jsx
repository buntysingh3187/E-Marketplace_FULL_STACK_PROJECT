import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ChangePassword() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (form.newPassword !== form.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    
    if (form.newPassword.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }
    
    try {
      await axios.put('http://localhost:5000/api/auth/profile', {
        password: form.newPassword,
        currentPassword: form.currentPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Password changed successfully!')
      navigate('/profile')
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Error changing password')
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      paddingTop: '3rem',
      paddingBottom: '3rem',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '25px',
              border: 'none',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
                  <h2 className="fw-bold" style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>Change Password</h2>
                </div>
                
                <div className="alert mb-4" style={{
                  background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#9b2c2c'
                }}>
                  <strong>⚠️ Security Notice:</strong> After changing your password, you'll need to login again with the new password.
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2d3748' }}>🔑 Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                      value={form.currentPassword}
                      onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2d3748' }}>🔒 New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                      value={form.newPassword}
                      onChange={e => setForm({ ...form, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      required
                      minLength="6"
                    />
                    <small style={{ color: '#718096', marginTop: '4px', display: 'block' }}>Password must be at least 6 characters</small>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{ color: '#2d3748' }}>✅ Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                      value={form.confirmPassword}
                      onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-lg w-100 mb-3" 
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontWeight: 'bold',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px',
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
                    🚀 Update Password
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-lg w-100 btn-outline-secondary" 
                    style={{ borderRadius: '12px', padding: '12px', fontWeight: '600' }}
                    onClick={() => navigate('/profile')}
                  >
                    ← Cancel
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
