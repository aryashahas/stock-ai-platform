const { Server } = require('socket.io');

let io = null;

const BASE_PRICES = {
  AAPL: 175.0,
  GOOGL: 140.0,
  MSFT: 375.0,
  AMZN: 150.0,
  TSLA: 240.0,
};

const currentPrices = { ...BASE_PRICES };

/**
 * Initialize Socket.IO with the HTTP server.
 * @param {http.Server} server - The HTTP server instance.
 * @returns {Server} The Socket.IO server instance.
 */
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.emit('welcome', {
      message: 'Connected to Stock AI real-time feed',
      timestamp: new Date().toISOString(),
    });

    socket.on('subscribe', (symbol) => {
      if (typeof symbol !== 'string') return;
      const upperSymbol = symbol.toUpperCase();
      socket.join(upperSymbol);
      console.log(`[Socket] Client ${socket.id} subscribed to ${upperSymbol}`);
    });

    socket.on('unsubscribe', (symbol) => {
      if (typeof symbol !== 'string') return;
      const upperSymbol = symbol.toUpperCase();
      socket.leave(upperSymbol);
      console.log(`[Socket] Client ${socket.id} unsubscribed from ${upperSymbol}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Client disconnected: ${socket.id} (${reason})`);
    });

    socket.on('error', (error) => {
      console.error(`[Socket] Error from ${socket.id}: ${error.message}`);
    });
  });

  console.log('[Socket] Socket.IO initialized');
  return io;
};

/**
 * Emit a stock update to all clients subscribed to the symbol room
 * and broadcast to all connected clients.
 * @param {string} symbol - Stock ticker symbol.
 * @param {object} data - Stock data payload.
 */
const emitStockUpdate = (symbol, data) => {
  if (!io) {
    console.warn('[Socket] Socket.IO not initialized. Cannot emit stock update.');
    return;
  }

  io.to(symbol).emit('stockUpdate', { symbol, ...data });
  io.emit('marketTick', { symbol, ...data });
};

/**
 * Generate a realistic random price fluctuation.
 * @param {number} currentPrice - The current price.
 * @returns {object} Updated price data.
 */
const generatePriceFluctuation = (currentPrice) => {
  const volatility = 0.002;
  const changePercent = (Math.random() - 0.5) * 2 * volatility * 100;
  const change = currentPrice * (changePercent / 100);
  const newPrice = Math.max(1, currentPrice + change);
  const volume = Math.floor(Math.random() * 1000000) + 500000;

  return {
    price: parseFloat(newPrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(4)),
    volume,
    high: parseFloat((newPrice * (1 + Math.random() * 0.005)).toFixed(2)),
    low: parseFloat((newPrice * (1 - Math.random() * 0.005)).toFixed(2)),
    timestamp: new Date().toISOString(),
  };
};

/**
 * Start a simulated real-time stock feed.
 * Emits price updates every 5 seconds for all tracked symbols.
 */
let feedInterval = null;

const startStockFeed = () => {
  if (feedInterval) {
    clearInterval(feedInterval);
  }

  console.log('[Socket] Starting real-time stock feed simulation');

  feedInterval = setInterval(() => {
    const symbols = Object.keys(currentPrices);

    symbols.forEach((symbol) => {
      const fluctuation = generatePriceFluctuation(currentPrices[symbol]);
      currentPrices[symbol] = fluctuation.price;

      emitStockUpdate(symbol, fluctuation);
    });
  }, 5000);

  return feedInterval;
};

/**
 * Stop the stock feed simulation.
 */
const stopStockFeed = () => {
  if (feedInterval) {
    clearInterval(feedInterval);
    feedInterval = null;
    console.log('[Socket] Stock feed simulation stopped');
  }
};

/**
 * Get the Socket.IO instance.
 * @returns {Server|null}
 */
const getIO = () => io;

module.exports = {
  initializeSocket,
  emitStockUpdate,
  startStockFeed,
  stopStockFeed,
  getIO,
};
