import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{ 
        position: 'absolute', 
        top: '10%', 
        right: '10%', 
        width: '300px', 
        height: '300px', 
        background: 'rgba(255,255,255,0.1)', 
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite'
      }}></div>
      <div style={{ 
        position: 'absolute', 
        bottom: '15%', 
        left: '5%', 
        width: '200px', 
        height: '200px', 
        background: 'rgba(255,255,255,0.1)', 
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      
      <div className="container text-center text-white" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div style={{ animation: 'fadeInDown 1s ease-in-out' }}>
              <h1 className="display-2 fw-bold mb-4" style={{ 
                textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                fontSize: '4rem'
              }}>
                🛍️ Welcome to E-Marketplace
              </h1>
              <p className="lead mb-5" style={{ 
                fontSize: '1.5rem',
                color: '#f0f0f0',
                textShadow: '1px 1px 3px rgba(0,0,0,0.2)'
              }}>
                Your one-stop destination for buying and selling products online
              </p>
            </div>
            
            <div className="d-grid gap-4 d-sm-flex justify-content-sm-center mb-5">
              <Link 
                to="/browse" 
                className="btn btn-lg px-5 py-4 shadow-lg fw-bold" 
                style={{ 
                  background: 'linear-gradient(135deg, #FFC107 0%, #FF6F00 100%)',
                  color: '#212529',
                  fontSize: '1.3rem',
                  border: 'none',
                  borderRadius: '15px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(255, 193, 7, 0.5)'
                }}
                onMouseEnter={e => {
                  e.target.style.transform = 'translateY(-5px) scale(1.05)'
                  e.target.style.boxShadow = '0 12px 35px rgba(255, 193, 7, 0.7)'
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(0) scale(1)'
                  e.target.style.boxShadow = '0 8px 25px rgba(255, 193, 7, 0.5)'
                }}
              >
                🚀 Browse Products Now
              </Link>
            </div>

            <div className="row mt-5 pt-5">
              <div className="col-md-4 mb-4">
                <div 
                  className="card border-0 h-100" 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    transition: 'all 0.4s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-10px)'
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'
                  }}
                >
                  <div className="card-body p-5">
                    <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>🛒</div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#2d3748' }}>Easy Shopping</h3>
                    <p style={{ color: '#4a5568', fontSize: '1.05rem', lineHeight: '1.7' }}>
                      Browse thousands of products and shop with ease
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div 
                  className="card border-0 h-100" 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    transition: 'all 0.4s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-10px)'
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'
                  }}
                >
                  <div className="card-body p-5">
                    <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>💼</div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#2d3748' }}>Sell Your Products</h3>
                    <p style={{ color: '#4a5568', fontSize: '1.05rem', lineHeight: '1.7' }}>
                      Start selling and reach customers worldwide
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div 
                  className="card border-0 h-100" 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    transition: 'all 0.4s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-10px)'
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'
                  }}
                >
                  <div className="card-body p-5">
                    <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>🔒</div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#2d3748' }}>Secure Platform</h3>
                    <p style={{ color: '#4a5568', fontSize: '1.05rem', lineHeight: '1.7' }}>
                      Safe and secure transactions every time
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
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
            transform: translateY(-30px);
          }
        }
      `}</style>
    </div>
  )
}
