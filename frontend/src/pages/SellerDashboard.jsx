import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../AuthContext'
import { Link } from 'react-router-dom'
import { API_ENDPOINTS } from '../config/api'

export default function SellerDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '', image: null })
  const [editId, setEditId] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const { token } = useAuth()

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(API_ENDPOINTS.SELLER_PRODUCTS, { headers: { Authorization: `Bearer ${token}` } })
      setProducts(data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(API_ENDPOINTS.SELLER_ORDERS, { headers: { Authorization: `Bearer ${token}` } })
      setOrders(data)
    } catch (err) {
      console.error(err)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API_ENDPOINTS.ORDERS}/${orderId}/status`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSuccessMsg(`Order status updated to ${newStatus}!`)
      fetchOrders()
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      console.error('Update order error:', err)
      const errorMsg = err.response?.data?.message || 'Error updating order status'
      alert(errorMsg)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchOrders()
  }, [token])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setForm(prev => ({ ...prev, image: e.target.files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price) return alert('Name and Price required')

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('description', form.description)
    formData.append('price', form.price)
    formData.append('category', form.category)
    formData.append('stock', form.stock)
    if (form.image) formData.append('image', form.image)

    try {
      if (editId) {
        await axios.put(`${API_ENDPOINTS.PRODUCTS}/${editId}`, formData, { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        })
        setSuccessMsg('Product updated successfully!')
        setEditId(null)
      } else {
        await axios.post(API_ENDPOINTS.PRODUCTS, formData, { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        })
        setSuccessMsg('Product added successfully!')
      }
      setForm({ name: '', description: '', price: '', category: '', stock: '', image: null })
      fetchProducts()
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      console.error('Save product error:', err)
      const errorMsg = err.response?.data?.message || 'Error saving product'
      alert(errorMsg)
    }
  }

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock, image: null })
    setEditId(p._id)
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await axios.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      setSuccessMsg('Product deleted successfully!')
      fetchProducts()
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      console.error(err)
      alert('Error deleting product')
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      paddingTop: '2rem',
      paddingBottom: '3rem',
      overflowX: 'hidden'
    }}>
      <div className="container" style={{ maxWidth: '1400px' }}>
        {/* Header */}
        <div className="mb-5 text-center">
          <h2 className="fw-bold mb-2" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '3rem'
          }}>💼 Seller Dashboard</h2>
          <p style={{ color: '#718096', fontSize: '1.2rem' }}>Manage your products and orders</p>
        </div>
        
        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <div className="card border-0" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
              color: 'white',
              padding: '2rem'
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="fw-bold mb-1">{products.length}</h3>
                  <p className="mb-0 opacity-75">Total Products</p>
                </div>
                <div style={{ fontSize: '3rem', opacity: 0.3 }}>📦</div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card border-0" style={{
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(17, 153, 142, 0.3)',
              color: 'white',
              padding: '2rem'
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="fw-bold mb-1">{orders.length}</h3>
                  <p className="mb-0 opacity-75">Total Orders</p>
                </div>
                <div style={{ fontSize: '3rem', opacity: 0.3 }}>🛒</div>
              </div>
            </div>
          </div>
        </div>
      
        {successMsg && (
          <div className="alert fade show mb-4" role="alert"
            style={{
              background: 'linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)',
              border: 'none',
              borderRadius: '15px',
              color: '#22543d',
              padding: '1rem 1.5rem'
            }}
          >
            <strong>✅ Success!</strong> {successMsg}
            <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}
              style={{ filter: 'brightness(0.6)' }}
            ></button>
          </div>
        )}
      
        {/* Add/Edit Product Form - Full Width */}
        <div className="mb-5">
          <div className="card border-0" style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            boxShadow: editId ? '0 20px 60px rgba(255, 193, 7, 0.3)' : '0 20px 60px rgba(102, 126, 234, 0.2)',
            backdropFilter: 'blur(10px)',
            border: editId ? '2px solid #FFC107' : '2px solid transparent'
          }}>
            <div className="card-body p-5">
              <div className="row align-items-center mb-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-3">
                    <div style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: editId ? 'linear-gradient(135deg, #FFC107 0%, #FF6F00 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      flexShrink: 0
                    }}>
                      {editId ? '✏️' : '➕'}
                    </div>
                    <div>
                      <h3 className="fw-bold mb-1" style={{ 
                        color: '#2d3748',
                        fontSize: '2rem'
                      }}>{editId ? 'Edit Product' : 'Add New Product'}</h3>
                      <p className="mb-0" style={{ color: '#718096' }}>
                        {editId ? 'Update your product details' : 'Fill in the details to add a new product'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 text-end">
                  {editId && (
                    <span className="badge" style={{ 
                      background: 'linear-gradient(135deg, #FFC107 0%, #FF6F00 100%)',
                      color: 'white',
                      fontSize: '1rem',
                      padding: '0.6rem 1.5rem',
                      borderRadius: '25px'
                    }}>
                      📝 Editing Mode
                    </span>
                  )}
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2d3748', fontSize: '1.05rem' }}>📦 Product Name</label>
                    <input type="text" name="name" className="form-control form-control-lg" 
                      style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                      value={form.name} onChange={handleFormChange} 
                      placeholder="Enter product name"
                      required />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2d3748', fontSize: '1.05rem' }}>💰 Price (₹)</label>
                    <input type="number" name="price" className="form-control form-control-lg" 
                      style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                      value={form.price} onChange={handleFormChange} 
                      placeholder="0.00"
                      required step="0.01" />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2d3748', fontSize: '1.05rem' }}>📊 Stock</label>
                    <input type="number" name="stock" className="form-control form-control-lg" 
                      style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                      value={form.stock} onChange={handleFormChange} 
                      placeholder="Quantity"
                      required />
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2d3748', fontSize: '1.05rem' }}>📁 Category</label>
                    <select name="category" className="form-select form-select-lg" 
                      style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                      value={form.category} onChange={handleFormChange}>
                      <option value="">Select Category</option>
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
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2d3748', fontSize: '1.05rem' }}>🖼️ Product Image</label>
                    <input type="file" name="image" className="form-control form-control-lg" 
                      style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                      onChange={handleFileChange} accept="image/*" />
                    {!editId && <small className="text-muted">Optional - You can add later</small>}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#2d3748', fontSize: '1.05rem' }}>📝 Description</label>
                  <textarea name="description" className="form-control form-control-lg" 
                    style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                    value={form.description} onChange={handleFormChange} 
                    placeholder="Describe your product..."
                    rows="4"></textarea>
                </div>
                
                <div className="d-flex gap-3 justify-content-end">
                  {editId && (
                    <button type="button" className="btn btn-lg btn-outline-secondary" 
                      style={{ 
                        borderRadius: '12px', 
                        padding: '12px 30px', 
                        fontWeight: '600',
                        border: '2px solid #e2e8f0'
                      }}
                      onClick={() => { 
                        setEditId(null); 
                        setForm({ name: '', description: '', price: '', category: '', stock: '', image: null }) 
                      }}>
                      ❌ Cancel
                    </button>
                  )}
                  <button type="submit" className="btn btn-lg" 
                    style={{ 
                      background: editId ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      fontWeight: 'bold',
                      borderRadius: '12px',
                      padding: '12px 40px',
                      boxShadow: editId ? '0 6px 20px rgba(17, 153, 142, 0.4)' : '0 6px 20px rgba(102, 126, 234, 0.4)',
                      transition: 'all 0.3s ease',
                      fontSize: '1.1rem'
                    }}
                    onMouseEnter={e => {
                      e.target.style.transform = 'translateY(-2px)'
                      e.target.style.boxShadow = editId ? '0 8px 25px rgba(17, 153, 142, 0.6)' : '0 8px 25px rgba(102, 126, 234, 0.6)'
                    }}
                    onMouseLeave={e => {
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow = editId ? '0 6px 20px rgba(17, 153, 142, 0.4)' : '0 6px 20px rgba(102, 126, 234, 0.4)'
                    }}
                  >
                    {editId ? '✓ Update Product' : '➕ Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold" style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '2rem'
            }}>📦 My Products ({products.length})</h3>
          </div>
          
          <div className="card border-0" style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            overflow: 'hidden'
          }}>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
                    <tr>
                      <th style={{ fontWeight: 'bold', padding: '1.2rem', border: 'none' }}>Product</th>
                      <th style={{ fontWeight: 'bold', padding: '1.2rem', border: 'none' }}>Price</th>
                      <th style={{ fontWeight: 'bold', padding: '1.2rem', border: 'none' }}>Category</th>
                      <th style={{ fontWeight: 'bold', padding: '1.2rem', border: 'none' }}>Stock</th>
                      <th style={{ fontWeight: 'bold', padding: '1.2rem', border: 'none', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} style={{ color: '#4a5568' }}>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>{p.name}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          fontWeight: 'bold'
                        }}>₹{p.price}</span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className="badge" style={{
                          background: 'linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%)',
                          color: '#2c5282',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '20px'
                        }}>{p.category}</span>
                      </td>
                      <td style={{ padding: '1rem' }}>{p.stock}</td>
                      <td style={{ padding: '1rem' }}>
                        <button className="btn btn-sm me-2" 
                          style={{ 
                            background: 'linear-gradient(135deg, #FFC107 0%, #FF6F00 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 16px',
                            fontWeight: 'bold'
                          }} 
                          onClick={() => handleEdit(p)}>✏️ Edit</button>
                        <button className="btn btn-sm" 
                          style={{ 
                            background: 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)',
                            color: '#c53030',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 16px',
                            fontWeight: 'bold'
                          }} 
                          onClick={() => handleDelete(p._id)}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>

        {/* Orders Section */}
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold" style={{ 
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '2rem'
            }}>📋 Orders Received ({orders.length})</h3>
          </div>
          {orders.length === 0 && (
            <div className="text-center py-5" style={{
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '20px',
              border: '2px dashed #e2e8f0'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
              <p style={{ color: '#718096', fontSize: '1.2rem' }}>No orders received yet</p>
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
                  background: 'linear-gradient(135deg, #17A2B8 0%, #138496 100%)',
                  color: 'white',
                  fontSize: '1rem',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>{o.status}</span>
              </div>
              <p className="mb-2"><strong style={{ color: '#2d3748' }}>📅 Date:</strong> <span style={{ color: '#718096' }}>{new Date(o.createdAt).toLocaleDateString()}</span></p>
              <p className="mb-2" style={{ color: '#4a5568' }}>👤 Buyer: <strong>{o.buyer?.name}</strong> ({o.buyer?.email})</p>
              <p className="mb-3"><strong style={{ color: '#2d3748' }}>💳 Payment:</strong> <span style={{ color: '#718096' }}>{o.paymentMethod || 'COD'}</span></p>
              
              {o.shippingAddress && (
                <div className="alert p-3 mb-3" style={{
                  background: 'linear-gradient(135deg, #fef5e7 0%, #fdebd0 100%)',
                  border: 'none',
                  borderRadius: '12px'
                }}>
                  <h6 className="fw-bold mb-2" style={{ color: '#2d3748' }}>📍 Delivery Address:</h6>
                  <p className="mb-1" style={{ color: '#4a5568' }}><strong>{o.shippingAddress.fullName}</strong></p>
                  <p className="mb-1" style={{ color: '#4a5568' }}>📞 {o.shippingAddress.phone}</p>
                  <p className="mb-1" style={{ color: '#4a5568' }}>{o.shippingAddress.address}</p>
                  <p className="mb-0" style={{ color: '#4a5568' }}>{o.shippingAddress.city}, {o.shippingAddress.state} - {o.shippingAddress.pincode}</p>
                </div>
              )}

              <h6 className="fw-bold mb-2" style={{ color: '#2d3748' }}>🛍️ Items:</h6>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {o.items.map((it, idx) => (
                  <li key={idx} className="mb-2 p-2" style={{ 
                    color: '#4a5568',
                    backgroundColor: '#f7fafc',
                    borderRadius: '8px',
                    borderLeft: '4px solid #667eea'
                  }}>
                    <strong>{it.product?.name || 'Unknown'}</strong> × {it.quantity} - <span style={{ color: '#11998e', fontWeight: 'bold' }}>₹{it.price}</span>
                  </li>
                ))}
              </ul>
              <p className="fw-bold mb-3" style={{ 
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '1.3rem'
              }}>💰 Total: ${o.total}</p>

              <div className="d-flex gap-2 flex-wrap">
                {o.status === 'pending' && (
                  <button className="btn" 
                    style={{ 
                      background: 'linear-gradient(135deg, #FFC107 0%, #FF6F00 100%)',
                      color: 'white',
                      border: 'none',
                      fontWeight: 'bold',
                      borderRadius: '10px',
                      padding: '8px 20px'
                    }} 
                    onClick={() => updateOrderStatus(o._id, 'confirmed')}>
                    ✅ Confirm Order
                  </button>
                )}
                {o.status === 'confirmed' && (
                  <button className="btn" 
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '8px 20px'
                    }} 
                    onClick={() => updateOrderStatus(o._id, 'shipped')}>
                    🚚 Mark as Shipped
                  </button>
                )}
                {o.status === 'shipped' && (
                  <button className="btn" 
                    style={{ 
                      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '8px 20px'
                    }} 
                    onClick={() => updateOrderStatus(o._id, 'delivered')}>
                    ✅ Mark as Delivered
                  </button>
                )}
                {o.status !== 'cancelled' && o.status !== 'delivered' && (
                  <button className="btn" 
                    style={{ 
                      background: 'linear-gradient(135deg, #fed7d7 0%, #fc8181 100%)',
                      color: '#c53030',
                      border: 'none',
                      fontWeight: 'bold',
                      borderRadius: '10px',
                      padding: '8px 20px'
                    }} 
                    onClick={() => updateOrderStatus(o._id, 'cancelled')}>
                    ❌ Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}
