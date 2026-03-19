const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimit');

const router = express.Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * Generate mock prediction data when the ML service is unavailable.
 * @param {string} symbol - Stock ticker symbol.
 * @param {number} days - Number of days to predict.
 * @returns {object} Mock prediction results.
 */
const generateMockPrediction = (symbol, days = 30) => {
  const basePrices = {
    AAPL: 175,
    GOOGL: 140,
    MSFT: 375,
    AMZN: 150,
    TSLA: 240,
    META: 350,
    NFLX: 480,
    NVDA: 500,
  };

  const basePrice = basePrices[symbol.toUpperCase()] || 100;
  const predictions = [];
  let currentPrice = basePrice;
  const trend = (Math.random() - 0.45) * 0.003;

  for (let i = 1; i <= days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }

    const dailyChange = currentPrice * (trend + (Math.random() - 0.5) * 0.02);
    currentPrice = Math.max(1, currentPrice + dailyChange);

    const confidenceBase = 0.85 - (i / days) * 0.3;
    const confidence = Math.max(0.45, Math.min(0.95, confidenceBase + (Math.random() - 0.5) * 0.1));

    predictions.push({
      date: date.toISOString().split('T')[0],
      predictedPrice: parseFloat(currentPrice.toFixed(2)),
      confidence: parseFloat(confidence.toFixed(4)),
      upperBound: parseFloat((currentPrice * (1 + (1 - confidence) * 0.5)).toFixed(2)),
      lowerBound: parseFloat((currentPrice * (1 - (1 - confidence) * 0.5)).toFixed(2)),
    });
  }

  const finalPrice = predictions[predictions.length - 1]?.predictedPrice || basePrice;
  const overallChange = finalPrice - basePrice;
  const overallChangePercent = (overallChange / basePrice) * 100;

  return {
    symbol: symbol.toUpperCase(),
    currentPrice: basePrice,
    predictions,
    summary: {
      predictedEndPrice: finalPrice,
      overallChange: parseFloat(overallChange.toFixed(2)),
      overallChangePercent: parseFloat(overallChangePercent.toFixed(2)),
      direction: overallChange >= 0 ? 'bullish' : 'bearish',
      averageConfidence: parseFloat(
        (predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length).toFixed(4)
      ),
      daysAnalyzed: predictions.length,
    },
    model: 'LSTM-Attention',
    generatedAt: new Date().toISOString(),
    isMockData: true,
  };
};

/**
 * POST /api/predict/:symbol
 * Request AI prediction for a stock symbol.
 * Sends request to ML service and returns prediction results.
 */
router.post('/:symbol', apiLimiter, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { days = 30 } = req.body;

    if (!symbol || symbol.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid stock symbol (max 10 characters).',
      });
    }

    const predictionDays = Math.min(Math.max(1, parseInt(days, 10) || 30), 90);

    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/predict`,
        {
          symbol: symbol.toUpperCase(),
          days: predictionDays,
        },
        {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return res.status(200).json({
        success: true,
        data: response.data,
      });
    } catch (mlError) {
      console.warn(
        `[Prediction] ML service unavailable for ${symbol}: ${mlError.message}. Using mock data.`
      );

      const mockPrediction = generateMockPrediction(symbol, predictionDays);

      return res.status(200).json({
        success: true,
        data: mockPrediction,
        note: 'ML service unavailable. Showing simulated prediction data.',
      });
    }
  } catch (error) {
    console.error(`[Prediction] Error for ${req.params.symbol}:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate prediction. Please try again.',
    });
  }
});

/**
 * GET /api/predict/history/:symbol
 * Get historical prediction accuracy for a stock symbol.
 */
router.get('/history/:symbol', apiLimiter, async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol || symbol.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid stock symbol (max 10 characters).',
      });
    }

    try {
      const response = await axios.get(
        `${ML_SERVICE_URL}/predict/history/${symbol.toUpperCase()}`,
        {
          timeout: 15000,
        }
      );

      return res.status(200).json({
        success: true,
        data: response.data,
      });
    } catch (mlError) {
      console.warn(
        `[Prediction] ML history unavailable for ${symbol}: ${mlError.message}. Using mock data.`
      );

      const mockHistory = {
        symbol: symbol.toUpperCase(),
        predictions: [],
        accuracy: {
          overall: parseFloat((0.72 + Math.random() * 0.15).toFixed(4)),
          last7Days: parseFloat((0.75 + Math.random() * 0.15).toFixed(4)),
          last30Days: parseFloat((0.70 + Math.random() * 0.15).toFixed(4)),
        },
        totalPredictions: Math.floor(Math.random() * 50) + 20,
        generatedAt: new Date().toISOString(),
        isMockData: true,
      };

      return res.status(200).json({
        success: true,
        data: mockHistory,
        note: 'ML service unavailable. Showing simulated history data.',
      });
    }
  } catch (error) {
    console.error(`[Prediction] History error for ${req.params.symbol}:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prediction history. Please try again.',
    });
  }
});

module.exports = router;
