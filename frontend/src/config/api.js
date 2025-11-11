// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_URL}/api/auth/login`,
  REGISTER: `${API_URL}/api/auth/register`,
  PROFILE: `${API_URL}/api/auth/profile`,
  
  // Products
  PRODUCTS: `${API_URL}/api/products`,
  SELLER_PRODUCTS: `${API_URL}/api/products/seller`,
  
  // Orders
  ORDERS: `${API_URL}/api/orders`,
  MY_ORDERS: `${API_URL}/api/orders/my`,
  SELLER_ORDERS: `${API_URL}/api/orders/seller`,
  
  // Reviews
  REVIEWS: `${API_URL}/api/reviews`,
  
  // Wishlist
  WISHLIST: `${API_URL}/api/wishlist`,
};

export default API_URL;
