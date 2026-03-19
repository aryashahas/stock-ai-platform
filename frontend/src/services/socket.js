import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log('[Socket] Connected:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('[Socket] Disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.log('[Socket] Connection error:', error.message);
});

/**
 * Subscribe to real-time stock price updates
 * @param {string} symbol - Stock symbol (e.g., "AAPL")
 * @param {function} callback - Callback function receiving price data
 */
export const subscribeToStock = (symbol, callback) => {
  socket.emit('subscribe', { symbol: symbol.toUpperCase() });
  socket.on(`stock:${symbol.toUpperCase()}`, callback);
};

/**
 * Unsubscribe from stock price updates
 * @param {string} symbol - Stock symbol
 */
export const unsubscribeFromStock = (symbol) => {
  socket.emit('unsubscribe', { symbol: symbol.toUpperCase() });
  socket.off(`stock:${symbol.toUpperCase()}`);
};

/**
 * Subscribe to market-wide updates
 * @param {function} callback - Callback function receiving market data
 */
export const subscribeToMarket = (callback) => {
  socket.emit('subscribe', { channel: 'market' });
  socket.on('market:update', callback);
};

/**
 * Unsubscribe from market updates
 */
export const unsubscribeFromMarket = () => {
  socket.emit('unsubscribe', { channel: 'market' });
  socket.off('market:update');
};

export default socket;
