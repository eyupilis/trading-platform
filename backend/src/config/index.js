require('dotenv').config();

module.exports = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // External APIs
  tradingView: {
    apiKey: process.env.TRADINGVIEW_API_KEY,
    baseUrl: process.env.TRADINGVIEW_API_URL,
  },
  
  investing: {
    apiKey: process.env.INVESTING_API_KEY,
    baseUrl: process.env.INVESTING_API_URL,
  },
  
  // Firebase configuration
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  
  // Cache configuration
  cache: {
    ttl: 60 * 5, // 5 minutes
  },
  
  // Websocket configuration
  websocket: {
    pingInterval: 30000, // 30 seconds
    pingTimeout: 5000, // 5 seconds
  },
};
