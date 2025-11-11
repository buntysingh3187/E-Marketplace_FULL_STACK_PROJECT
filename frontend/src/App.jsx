import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import AuthProvider, { useAuth } from './AuthContext'
import ProtectedRoute from './ProtectedRoute'
import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import MyOrders from './pages/MyOrders'
import SellerDashboard from './pages/SellerDashboard'
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'
import Wishlist from './pages/Wishlist'

function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path
  
  const navLinkStyle = (path) => ({
    fontWeight: isActive(path) ? 'bold' : '500',
    borderBottom: isActive(path) ? '3px solid #FFC107' : 'none',
    paddingBottom: '8px',
    transition: 'all 0.3s ease',
    color: isActive(path) ? '#FFC107' : 'white'
  })
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark mb-0" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      zIndex: 1050,
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    }}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" style={{ 
          fontSize: '1.8rem',
          background: 'linear-gradient(135deg, #FFC107 0%, #FF6F00 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: 'none',
          fontWeight: '800'
        }}>
          E-Marketplace
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!user ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login" style={navLinkStyle('/login')}>Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register" style={navLinkStyle('/register')}>Register</Link></li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/browse" style={navLinkStyle('/browse')}>Browse Products</Link></li>
                {user.role === 'buyer' && (
                  <>
                    <li className="nav-item"><Link className="nav-link" to="/cart" style={navLinkStyle('/cart')}>Cart</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/wishlist" style={navLinkStyle('/wishlist')}>Wishlist</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/orders" style={navLinkStyle('/orders')}>My Orders</Link></li>
                  </>
                )}
                {user.role === 'seller' && (
                  <li className="nav-item"><Link className="nav-link" to="/seller" style={navLinkStyle('/seller')}>Dashboard</Link></li>
                )}
                <li className="nav-item dropdown" style={{ position: 'relative', zIndex: 1050 }}>
                  <a className="nav-link dropdown-toggle" href="#" id="profileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontWeight: '600' }}>
                    Hi, {user.name}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown" style={{ 
                    zIndex: 1051,
                    borderRadius: '15px',
                    border: 'none',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    padding: '10px'
                  }}>
                    <li>
                      <Link 
                        className="dropdown-item" 
                        to="/profile" 
                        style={{ 
                          borderRadius: '10px', 
                          padding: '10px 15px',
                          transition: 'all 0.2s ease',
                          fontWeight: '500'
                        }}
                        onMouseEnter={e => {
                          e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          e.target.style.color = 'white'
                          e.target.style.transform = 'translateX(5px)'
                        }}
                        onMouseLeave={e => {
                          e.target.style.background = 'transparent'
                          e.target.style.color = '#2d3748'
                          e.target.style.transform = 'translateX(0)'
                        }}
                      >
                        👤 My Profile
                      </Link>
                    </li>
                    <li>
                      <Link 
                        className="dropdown-item" 
                        to="/change-password" 
                        style={{ 
                          borderRadius: '10px', 
                          padding: '10px 15px',
                          transition: 'all 0.2s ease',
                          fontWeight: '500'
                        }}
                        onMouseEnter={e => {
                          e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          e.target.style.color = 'white'
                          e.target.style.transform = 'translateX(5px)'
                        }}
                        onMouseLeave={e => {
                          e.target.style.background = 'transparent'
                          e.target.style.color = '#2d3748'
                          e.target.style.transform = 'translateX(0)'
                        }}
                      >
                        🔒 Change Password
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" style={{ margin: '10px 0' }} /></li>
                    <li>
                      <button 
                        className="dropdown-item" 
                        onClick={logout} 
                        style={{ 
                          borderRadius: '10px', 
                          padding: '10px 15px',
                          color: '#e53e3e',
                          transition: 'all 0.2s ease',
                          fontWeight: '500',
                          border: 'none',
                          background: 'transparent',
                          width: '100%',
                          textAlign: 'left'
                        }}
                        onMouseEnter={e => {
                          e.target.style.background = 'linear-gradient(135deg, #feb2b2 0%, #fc8181 100%)'
                          e.target.style.color = 'white'
                          e.target.style.transform = 'translateX(5px)'
                        }}
                        onMouseLeave={e => {
                          e.target.style.background = 'transparent'
                          e.target.style.color = '#e53e3e'
                          e.target.style.transform = 'translateX(0)'
                        }}
                      >
                        🚪 Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/browse" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/seller" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}
