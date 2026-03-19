const express = require('express');
const {
  fetchStockQuote,
  fetchHistoricalData,
  searchStocks,
  getMarketSummary,
} = require('../services/stockService');
const { apiLimiter } = require('../middleware/rateLimit');

const router = express.Router();

/**
 * GET /api/stocks/quote/:symbol
 * Get a real-time stock quote for the given symbol.
 * Uses caching (60s TTL) and falls back to mock data if API fails.
 */
router.get('/quote/:symbol', apiLimiter, async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol || symbol.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid stock symbol (max 10 characters).',
      });
    }

    const quote = await fetchStockQuote(symbol);

    res.status(200).json({
      success: true,
      data: quote,
    });
  } catch (error) {
    console.error(`[Stocks] Quote error for ${req.params.symbol}:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock quote. Please try again.',
    });
  }
});

/**
 * GET /api/stocks/historical/:symbol
 * Get historical stock data for the given symbol.
 * Accepts query params: interval (daily/weekly/monthly), outputsize (compact/full).
 */
router.get('/historical/:symbol', apiLimiter, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval = 'daily', outputsize = 'compact' } = req.query;

    if (!symbol || symbol.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid stock symbol (max 10 characters).',
      });
    }

    const validIntervals = ['daily', 'weekly', 'monthly'];
    if (!validIntervals.includes(interval)) {
      return res.status(400).json({
        success: false,
        message: `Invalid interval. Use one of: ${validIntervals.join(', ')}`,
      });
    }

    const validOutputSizes = ['compact', 'full'];
    if (!validOutputSizes.includes(outputsize)) {
      return res.status(400).json({
        success: false,
        message: `Invalid output size. Use one of: ${validOutputSizes.join(', ')}`,
      });
    }

    const days = outputsize === 'full' ? 365 : 100;
    const historicalData = await fetchHistoricalData(symbol, days);

    res.status(200).json({
      success: true,
      data: {
        symbol: symbol.toUpperCase(),
        interval,
        outputsize,
        totalRecords: historicalData.length,
        historicalData,
      },
    });
  } catch (error) {
    console.error(`[Stocks] Historical error for ${req.params.symbol}:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch historical data. Please try again.',
    });
  }
});

/**
 * GET /api/stocks/search/:query
 * Search for stocks by name or symbol.
 * Uses Alpha Vantage SYMBOL_SEARCH with fallback to hardcoded popular stocks.
 */
router.get('/search/:query', apiLimiter, async (req, res) => {
  try {
    const { query } = req.params;

    if (!query || query.length < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query.',
      });
    }

    if (query.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Search query is too long (max 50 characters).',
      });
    }

    const results = await searchStocks(query);

    res.status(200).json({
      success: true,
      data: {
        query,
        totalResults: results.length,
        results,
      },
    });
  } catch (error) {
    console.error(`[Stocks] Search error for "${req.params.query}":`, error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to search stocks. Please try again.',
    });
  }
});

/**
 * GET /api/stocks/market-summary
 * Get a summary of major market indices and top stocks.
 */
router.get('/market-summary', apiLimiter, async (req, res) => {
  try {
    const summary = await getMarketSummary();

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('[Stocks] Market summary error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market summary. Please try again.',
    });
  }
});

module.exports = router;
