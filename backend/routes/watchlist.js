const express = require('express');
const auth = require('../middleware/auth');
const Watchlist = require('../models/Watchlist');
const { fetchStockQuote } = require('../services/stockService');

const router = express.Router();

/**
 * GET /api/watchlist
 * Get the authenticated user's watchlist with current stock prices.
 */
router.get('/', auth, async (req, res) => {
  try {
    let watchlist = await Watchlist.findOne({ user: req.user._id });

    if (!watchlist) {
      watchlist = await Watchlist.create({
        user: req.user._id,
        stocks: [],
      });
    }

    const stocksWithPrices = await Promise.all(
      watchlist.stocks.map(async (item) => {
        try {
          const quote = await fetchStockQuote(item.symbol);
          return {
            symbol: item.symbol,
            addedAt: item.addedAt,
            ...quote,
          };
        } catch (error) {
          console.warn(`[Watchlist] Failed to fetch quote for ${item.symbol}: ${error.message}`);
          return {
            symbol: item.symbol,
            addedAt: item.addedAt,
            price: null,
            error: 'Unable to fetch current price',
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      data: {
        id: watchlist._id,
        stocks: stocksWithPrices,
        totalStocks: watchlist.stocks.length,
      },
    });
  } catch (error) {
    console.error('[Watchlist] Get error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch watchlist. Please try again.',
    });
  }
});

/**
 * POST /api/watchlist/add
 * Add a stock symbol to the user's watchlist.
 */
router.post('/add', auth, async (req, res) => {
  try {
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Stock symbol is required.',
      });
    }

    const upperSymbol = symbol.toUpperCase().trim();

    if (upperSymbol.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stock symbol (max 10 characters).',
      });
    }

    let watchlist = await Watchlist.findOne({ user: req.user._id });

    if (!watchlist) {
      watchlist = new Watchlist({
        user: req.user._id,
        stocks: [],
      });
    }

    const alreadyExists = watchlist.stocks.some((item) => item.symbol === upperSymbol);
    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: `${upperSymbol} is already in your watchlist.`,
      });
    }

    if (watchlist.stocks.length >= 50) {
      return res.status(400).json({
        success: false,
        message: 'Watchlist limit reached (maximum 50 stocks).',
      });
    }

    watchlist.stocks.push({
      symbol: upperSymbol,
      addedAt: new Date(),
    });

    await watchlist.save();

    let quote;
    try {
      quote = await fetchStockQuote(upperSymbol);
    } catch (err) {
      quote = { symbol: upperSymbol, price: null };
    }

    res.status(200).json({
      success: true,
      message: `${upperSymbol} added to your watchlist.`,
      data: {
        id: watchlist._id,
        addedStock: {
          symbol: upperSymbol,
          ...quote,
        },
        totalStocks: watchlist.stocks.length,
      },
    });
  } catch (error) {
    console.error('[Watchlist] Add error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add stock to watchlist. Please try again.',
    });
  }
});

/**
 * DELETE /api/watchlist/remove/:symbol
 * Remove a stock symbol from the user's watchlist.
 */
router.delete('/remove/:symbol', auth, async (req, res) => {
  try {
    const { symbol } = req.params;
    const upperSymbol = symbol.toUpperCase().trim();

    const watchlist = await Watchlist.findOne({ user: req.user._id });

    if (!watchlist) {
      return res.status(404).json({
        success: false,
        message: 'Watchlist not found.',
      });
    }

    const stockIndex = watchlist.stocks.findIndex((item) => item.symbol === upperSymbol);

    if (stockIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `${upperSymbol} is not in your watchlist.`,
      });
    }

    watchlist.stocks.splice(stockIndex, 1);
    await watchlist.save();

    res.status(200).json({
      success: true,
      message: `${upperSymbol} removed from your watchlist.`,
      data: {
        id: watchlist._id,
        totalStocks: watchlist.stocks.length,
      },
    });
  } catch (error) {
    console.error('[Watchlist] Remove error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to remove stock from watchlist. Please try again.',
    });
  }
});

module.exports = router;
