import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('stockai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('stockai_token');
      }
      return Promise.reject(error.response.data);
    }
    if (error.request) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
      });
    }
    return Promise.reject({ message: 'An unexpected error occurred.' });
  }
);

// ==================== Auth API ====================
export const authAPI = {
  register: (name, email, password) =>
    API.post('/auth/register', { name, email, password }),

  login: (email, password) =>
    API.post('/auth/login', { email, password }),

  getProfile: () =>
    API.get('/auth/me'),
};

// ==================== Stocks API ====================
export const stocksAPI = {
  getQuote: (symbol) =>
    API.get(`/stocks/quote/${symbol}`),

  getHistorical: (symbol, range = '1M') =>
    API.get(`/stocks/historical/${symbol}`),

  searchStocks: (query) =>
    API.get(`/stocks/search/${encodeURIComponent(query)}`),

  getMarketSummary: () =>
    API.get('/stocks/market-summary'),
};

// ==================== Predictions API ====================
export const predictionsAPI = {
  getPrediction: (symbol, days = 30) =>
    API.post(`/predict/${symbol}`, { days }),

  getPredictionHistory: (symbol) =>
    API.get(`/predict/history/${symbol}`),
};

// ==================== Watchlist API ====================
export const watchlistAPI = {
  getWatchlist: () =>
    API.get('/watchlist'),

  addToWatchlist: (symbol) =>
    API.post('/watchlist/add', { symbol }),

  removeFromWatchlist: (symbol) =>
    API.delete(`/watchlist/remove/${symbol}`),
};

export default API;
