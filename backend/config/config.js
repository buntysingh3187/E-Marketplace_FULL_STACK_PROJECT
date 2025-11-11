require('dotenv').config();

module.exports = {
  // Database
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/emarket',
  
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Security
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_change_this',
  
  // CORS - Parse multiple origins separated by comma
  corsOrigin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:5173'],
  
  // Frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // JWT Token Expiry
  jwtExpiresIn: '7d',
  
  // File Upload
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
};
