require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  upload: {
    path: process.env.UPLOAD_PATH || 'uploads/products',
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  },
};
