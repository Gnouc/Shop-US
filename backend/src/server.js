const app = require('./app');
const { port, nodeEnv } = require('./config/env');

const server = app.listen(port, () => {
  console.log('=================================');
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📦 Environment: ${nodeEnv}`);
  console.log(`🔗 API: http://localhost:${port}/api`);
  console.log('=================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
