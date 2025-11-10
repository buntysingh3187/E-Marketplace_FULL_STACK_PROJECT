import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../AuthContext'
import { Link } from 'react-router-dom'

export default function SellerDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '', image: null })
  const [editId, setEditId] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const { token } = useAuth()

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products/seller', { headers: { Authorization: `Bearer ${token}` } })
      setProducts(data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/orders/seller', { headers: { Authorization: `Bearer ${token}` } })
      setOrders(data)
    } catch (err) {
      console.error(err)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, 
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
        await axios.put(`http://localhost:5000/api/products/${editId}`, formData, { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        })
        setSuccessMsg('Product updated successfully!')
        setEditId(null)
      } else {
        await axios.post('http://localhost:5000/api/products', formData, { 
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
      await axios.delete(`http://localhost:5000/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } })
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
      paddingBottom: '3rem'
    }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '2.8rem'
          }}>💼 Seller Dashboard</h2>
          <Link to="/browse" className="btn btn-lg" 
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
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
            🏪 Browse All Products
          </Link>
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
      
        <div className="row mb-5">
          <div className="col-md-6">
            <div className="card" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              border: editId ? '3px solid #FFC107' : 'none',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold" style={{ 
                    background: editId ? 'linear-gradient(135deg, #FFC107 0%, #FF6F00 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>{editId ? '✏️ Edit Product' : '➕ Add Product'}</h4>
                  {editId && (
                    <span className="badge" style={{ 
                      background: 'linear-gradient(135deg, #FFC107 0%, #FF6F00 100%)',
                      color: 'white',
                      fontSize: '0.9rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px'
                    }}>
                      Editing Mode
                    </span>
                  )}
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2d3748' }}>📦 Name</label>
                    <input type="text" name="name" className="form-control" 
                      style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                      value={form.name} onChange={handleFormChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2d3748' }}>📝 Description</label>
                    <textarea name="description" className="form-control" 
                      style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                      value={form.description} onChange={handleFormChange} rows="3"></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2d3748' }}>💰 Price</label>
                    <input type="number" name="price" className="form-control" 
                      style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                      value={form.price} onChange={handleFormChange} required step="0.01" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2d3748' }}>📁 Category</label>
                    <select name="category" className="form-select" 
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
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: '#2d3748' }}>📊 Stock</label>
                    <input type="number" name="stock" className="form-control" 
                      style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                      value={form.stock} onChange={handleFormChange} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{ color: '#2d3748' }}>🖼️ Image {editId && <small className="text-muted">(Leave empty to keep current image)</small>}</label>
                    <input type="file" className="form-control" 
                      style={{ borderRadius: '12px', border: '2px solid #e2e8f0', padding: '12px' }}
                      onChange={handleFileChange} accept="image/*" />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-lg" 
                      style={{ 
                        background: editId ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : 'linear-gradient(135deg, #FFC107 0%, #FF6F00 100%)',
                        color: 'white',
                        border: 'none',
                        fontWeight: 'bold',
                        borderRadius: '12px',
                        padding: '12px 30px',
                        boxShadow: editId ? '0 6px 20px rgba(17, 153, 142, 0.4)' : '0 6px 20px rgba(255, 193, 7, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={e => {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = editId ? '0 8px 25px rgba(17, 153, 142, 0.6)' : '0 8px 25px rgba(255, 193, 7, 0.6)'
                      }}
                      onMouseLeave={e => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = editId ? '0 6px 20px rgba(17, 153, 142, 0.4)' : '0 6px 20px rgba(255, 193, 7, 0.4)'
                      }}
                    >
                      {editId ? '✓ Update Product' : '+ Add Product'}
                    </button>
                    {editId && (
                      <button type="button" className="btn btn-lg btn-outline-secondary" 
                        style={{ borderRadius: '12px', padding: '12px 24px', fontWeight: '600' }}
                        onClick={() => { setEditId(null); setForm({ name: '', description: '', price: '', category: '', stock: '', image: null }) }}>
                        ❌ Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <h4 className="mt-4 mb-3 fw-bold" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>📦 My Products</h4>
        <div className="card" style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          border: 'none',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr style={{ color: '#2d3748', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ fontWeight: 'bold', padding: '1rem' }}>Name</th>
                    <th style={{ fontWeight: 'bold', padding: '1rem' }}>Price</th>
                    <th style={{ fontWeight: 'bold', padding: '1rem' }}>Category</th>
                    <th style={{ fontWeight: 'bold', padding: '1rem' }}>Stock</th>
                    <th style={{ fontWeight: 'bold', padding: '1rem' }}>Actions</th>
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

        <h4 className="mt-5 mb-3 fw-bold" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>📋 Orders Received</h4>
        {orders.length === 0 && <p style={{ color: '#718096' }}>📭 No orders yet.</p>}
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
  )
}
