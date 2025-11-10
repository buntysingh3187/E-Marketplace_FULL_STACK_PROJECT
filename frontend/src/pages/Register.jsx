import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('buyer')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password) {
      setError('All fields required')
      return
    }
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role })
      alert('Registration successful! Please login.')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Error')
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 0'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">
            <div 
              className="card border-0" 
              style={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '25px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                overflow: 'hidden'
              }}
            >
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div style={{ fontSize: '4rem', marginBottom: '15px' }}>📝</div>
                  <h2 className="fw-bold mb-2" style={{ color: '#2d3748', fontSize: '2.2rem' }}>Create Account</h2>
                  <p style={{ color: '#718096', fontSize: '1.05rem' }}>Join our marketplace today!</p>
                </div>
                
                {error && (
                  <div className="alert alert-danger" style={{ 
                    borderRadius: '15px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)',
                    color: '#742a2a'
                  }}>
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2d3748', fontSize: '1.05rem' }}>
                      👤 Full Name
                    </label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="Enter your name"
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        padding: '12px 20px'
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2d3748', fontSize: '1.05rem' }}>
                      📧 Email Address
                    </label>
                    <input 
                      type="email" 
                      className="form-control form-control-lg" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      placeholder="Enter your email"
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        padding: '12px 20px'
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2d3748', fontSize: '1.05rem' }}>
                      🔒 Password
                    </label>
                    <input 
                      type="password" 
                      className="form-control form-control-lg" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      placeholder="Create a password"
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        padding: '12px 20px'
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{ color: '#2d3748', fontSize: '1.05rem' }}>
                      🎭 Account Type
                    </label>
                    <select 
                      className="form-select form-select-lg" 
                      value={role} 
                      onChange={e => setRole(e.target.value)}
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        padding: '12px 20px'
                      }}
                    >
                      <option value="buyer">🛒 Buyer - Browse and Buy Products</option>
                      <option value="seller">💼 Seller - Sell Your Products</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-lg w-100 mb-4 fw-bold" 
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px',
                      fontSize: '1.1rem',
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
                    🚀 Register Now
                  </button>
                  <div className="text-center">
                    <Link 
                      to="/login" 
                      className="text-decoration-none fw-semibold" 
                      style={{ color: '#667eea', fontSize: '1.05rem' }}
                    >
                      Already have an account? <span style={{ fontWeight: 'bold' }}>Login here →</span>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
