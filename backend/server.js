const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const http = require('http');
const helmet = require('helmet');
const cors = require('cors');

const connectDB = require('./config/db');
const { initializeSocket, startStockFeed, stopStockFeed } = require('./config/socket');
const { generalLimiter } = require('./middleware/rateLimit');

const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stocks');
const predictionRoutes = require('./routes/prediction');
const watchlistRoutes = require('./routes/watchlist');
const newsRoutes = require('./routes/news');
const chatRoutes = require('./routes/chat');

const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(generalLimiter);

// ---------------------------------------------------------------------------
// Health-check endpoint
// ---------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Stock AI Platform API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/predict', predictionRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/chat', chatRoutes);

// ---------------------------------------------------------------------------
// 404 handler
// ---------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------
app.use((err, req, res, _next) => {
  console.error('[Server] Unhandled error:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ---------------------------------------------------------------------------
// Server startup
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const start = async () => {
  try {
    await connectDB();

    const io = initializeSocket(server);

    startStockFeed();

    server.listen(PORT, () => {
      console.log(`\n========================================`);
      console.log(`  Stock AI Platform Backend`);
      console.log(`  Mode:    ${process.env.NODE_ENV || 'development'}`);
      console.log(`  Port:    ${PORT}`);
      console.log(`  API:     http://localhost:${PORT}/api`);
      console.log(`  Health:  http://localhost:${PORT}/api/health`);
      console.log(`  Socket:  ws://localhost:${PORT}`);
      console.log(`========================================\n`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error.message);
    process.exit(1);
  }
};

// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------
const gracefulShutdown = (signal) => {
  console.log(`\n[Server] Received ${signal}. Starting graceful shutdown...`);

  stopStockFeed();

  server.close(async () => {
    console.log('[Server] HTTP server closed.');

    try {
      const mongoose = require('mongoose');
      await mongoose.connection.close();
      console.log('[Server] MongoDB connection closed.');
    } catch (error) {
      console.error('[Server] Error closing MongoDB connection:', error.message);
    }

    console.log('[Server] Graceful shutdown complete.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('[Server] Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Server] Uncaught Exception:', error.message);
  gracefulShutdown('uncaughtException');
});

start();

module.exports = app;
