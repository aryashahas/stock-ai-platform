const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

/**
 * Mock stock data with realistic base prices and company information.
 */
const MOCK_STOCKS = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    basePrice: 175.0,
    marketCap: 2750000000000,
    sector: 'Technology',
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    basePrice: 140.0,
    marketCap: 1750000000000,
    sector: 'Technology',
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    basePrice: 375.0,
    marketCap: 2800000000000,
    sector: 'Technology',
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    basePrice: 150.0,
    marketCap: 1550000000000,
    sector: 'Consumer Cyclical',
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    basePrice: 240.0,
    marketCap: 760000000000,
    sector: 'Automotive',
  },
  META: {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    basePrice: 350.0,
    marketCap: 900000000000,
    sector: 'Technology',
  },
  NFLX: {
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    basePrice: 480.0,
    marketCap: 210000000000,
    sector: 'Communication Services',
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    basePrice: 500.0,
    marketCap: 1230000000000,
    sector: 'Technology',
  },
};

/**
 * Generate a realistic mock quote for a given symbol.
 * @param {string} symbol - Stock ticker symbol.
 * @returns {object} Mock stock quote data.
 */
const generateMockQuote = (symbol) => {
  const upperSymbol = symbol.toUpperCase();
  const stockInfo = MOCK_STOCKS[upperSymbol];

  if (!stockInfo) {
    const randomBase = 50 + Math.random() * 200;
    return generateQuoteFromBase(upperSymbol, `${upperSymbol} Corp.`, randomBase, 10000000000);
  }

  return generateQuoteFromBase(
    stockInfo.symbol,
    stockInfo.name,
    stockInfo.basePrice,
    stockInfo.marketCap
  );
};

/**
 * Generate a quote from a base price with realistic fluctuations.
 */
const generateQuoteFromBase = (symbol, name, basePrice, marketCap) => {
  const fluctuation = (Math.random() - 0.5) * 0.04;
  const price = parseFloat((basePrice * (1 + fluctuation)).toFixed(2));
  const change = parseFloat((price - basePrice).toFixed(2));
  const changePercent = parseFloat(((change / basePrice) * 100).toFixed(4));
  const dayRange = basePrice * 0.02;
  const open = parseFloat((basePrice + (Math.random() - 0.5) * dayRange).toFixed(2));
  const high = parseFloat((Math.max(price, open) + Math.random() * dayRange * 0.5).toFixed(2));
  const low = parseFloat((Math.min(price, open) - Math.random() * dayRange * 0.5).toFixed(2));
  const previousClose = parseFloat((basePrice + (Math.random() - 0.3) * dayRange * 0.5).toFixed(2));
  const volume = Math.floor(Math.random() * 50000000) + 5000000;

  return {
    symbol,
    name,
    price,
    change,
    changePercent,
    volume,
    high,
    low,
    open,
    previousClose,
    marketCap,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Fetch a stock quote from Alpha Vantage with fallback to mock data.
 * @param {string} symbol - Stock ticker symbol.
 * @returns {Promise<object>} Stock quote data.
 */
const fetchStockQuote = async (symbol) => {
  const upperSymbol = symbol.toUpperCase();
  const cacheKey = `quote_${upperSymbol}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    if (apiKey && apiKey !== 'demo') {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: upperSymbol,
          apikey: apiKey,
        },
        timeout: 10000,
      });

      const globalQuote = response.data['Global Quote'];

      if (globalQuote && globalQuote['01. symbol']) {
        const quote = {
          symbol: globalQuote['01. symbol'],
          name: MOCK_STOCKS[upperSymbol]?.name || `${upperSymbol}`,
          price: parseFloat(globalQuote['05. price']),
          change: parseFloat(globalQuote['09. change']),
          changePercent: parseFloat(globalQuote['10. change percent']?.replace('%', '')),
          volume: parseInt(globalQuote['06. volume'], 10),
          high: parseFloat(globalQuote['03. high']),
          low: parseFloat(globalQuote['04. low']),
          open: parseFloat(globalQuote['02. open']),
          previousClose: parseFloat(globalQuote['08. previous close']),
          marketCap: MOCK_STOCKS[upperSymbol]?.marketCap || null,
          lastUpdated: globalQuote['07. latest trading day'],
        };

        cache.set(cacheKey, quote);
        return quote;
      }
    }
  } catch (error) {
    console.warn(`[StockService] Alpha Vantage API error for ${upperSymbol}: ${error.message}`);
  }

  const mockQuote = generateMockQuote(upperSymbol);
  cache.set(cacheKey, mockQuote);
  return mockQuote;
};

/**
 * Generate realistic mock historical data for a given symbol.
 * @param {string} symbol - Stock ticker symbol.
 * @param {number} days - Number of days of historical data.
 * @returns {Array<object>} Array of historical data points.
 */
const generateMockHistorical = (symbol, days = 365) => {
  const upperSymbol = symbol.toUpperCase();
  const stockInfo = MOCK_STOCKS[upperSymbol];
  const basePrice = stockInfo ? stockInfo.basePrice : 100 + Math.random() * 200;

  const historicalData = [];
  let currentPrice = basePrice * 0.7;
  const trend = (basePrice - currentPrice) / days;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }

    const dailyVolatility = 0.02;
    const randomChange = (Math.random() - 0.48) * dailyVolatility * currentPrice;
    currentPrice = Math.max(1, currentPrice + trend + randomChange);

    const dayRange = currentPrice * 0.025;
    const open = parseFloat((currentPrice + (Math.random() - 0.5) * dayRange).toFixed(2));
    const close = parseFloat(currentPrice.toFixed(2));
    const high = parseFloat((Math.max(open, close) + Math.random() * dayRange * 0.6).toFixed(2));
    const low = parseFloat((Math.min(open, close) - Math.random() * dayRange * 0.6).toFixed(2));
    const volume = Math.floor(Math.random() * 40000000) + 10000000;

    historicalData.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume,
    });
  }

  return historicalData;
};

/**
 * Fetch historical data from Alpha Vantage with fallback to mock data.
 * @param {string} symbol - Stock ticker symbol.
 * @param {number} days - Number of days of data.
 * @returns {Promise<Array>} Historical data array.
 */
const fetchHistoricalData = async (symbol, days = 365) => {
  const upperSymbol = symbol.toUpperCase();
  const cacheKey = `historical_${upperSymbol}_${days}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    if (apiKey && apiKey !== 'demo') {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: upperSymbol,
          outputsize: days > 100 ? 'full' : 'compact',
          apikey: apiKey,
        },
        timeout: 15000,
      });

      const timeSeries = response.data['Time Series (Daily)'];

      if (timeSeries) {
        const historicalData = Object.entries(timeSeries)
          .slice(0, days)
          .map(([date, values]) => ({
            date,
            open: parseFloat(values['1. open']),
            high: parseFloat(values['2. high']),
            low: parseFloat(values['3. low']),
            close: parseFloat(values['4. close']),
            volume: parseInt(values['5. volume'], 10),
          }))
          .reverse();

        cache.set(cacheKey, historicalData, 300);
        return historicalData;
      }
    }
  } catch (error) {
    console.warn(`[StockService] Historical data API error for ${upperSymbol}: ${error.message}`);
  }

  const mockData = generateMockHistorical(upperSymbol, days);
  cache.set(cacheKey, mockData, 300);
  return mockData;
};

/**
 * Search stocks by name or symbol.
 * @param {string} query - Search query.
 * @returns {Promise<Array>} Matching stocks.
 */
const searchStocks = async (query) => {
  const upperQuery = query.toUpperCase();
  const cacheKey = `search_${upperQuery}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    if (apiKey && apiKey !== 'demo') {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: query,
          apikey: apiKey,
        },
        timeout: 10000,
      });

      const matches = response.data.bestMatches;

      if (matches && matches.length > 0) {
        const results = matches.map((match) => ({
          symbol: match['1. symbol'],
          name: match['2. name'],
          type: match['3. type'],
          region: match['4. region'],
          currency: match['8. currency'],
        }));

        cache.set(cacheKey, results, 600);
        return results;
      }
    }
  } catch (error) {
    console.warn(`[StockService] Search API error: ${error.message}`);
  }

  const results = Object.values(MOCK_STOCKS)
    .filter(
      (stock) =>
        stock.symbol.includes(upperQuery) ||
        stock.name.toUpperCase().includes(upperQuery)
    )
    .map((stock) => ({
      symbol: stock.symbol,
      name: stock.name,
      type: 'Equity',
      region: 'United States',
      currency: 'USD',
    }));

  cache.set(cacheKey, results, 600);
  return results;
};

/**
 * Get a market summary with major indices and top stocks.
 * @returns {Promise<object>} Market summary data.
 */
const getMarketSummary = async () => {
  const cacheKey = 'market_summary';

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const topSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NFLX', 'NVDA'];

  const quotes = await Promise.all(topSymbols.map((symbol) => fetchStockQuote(symbol)));

  const gainers = [...quotes].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  const losers = [...quotes].sort((a, b) => a.changePercent - b.changePercent).slice(0, 3);

  const indices = [
    {
      symbol: '^DJI',
      name: 'Dow Jones Industrial Average',
      price: parseFloat((35000 + (Math.random() - 0.5) * 400).toFixed(2)),
      change: parseFloat(((Math.random() - 0.5) * 300).toFixed(2)),
      changePercent: parseFloat(((Math.random() - 0.5) * 1.5).toFixed(2)),
    },
    {
      symbol: '^GSPC',
      name: 'S&P 500',
      price: parseFloat((4500 + (Math.random() - 0.5) * 50).toFixed(2)),
      change: parseFloat(((Math.random() - 0.5) * 40).toFixed(2)),
      changePercent: parseFloat(((Math.random() - 0.5) * 1.2).toFixed(2)),
    },
    {
      symbol: '^IXIC',
      name: 'NASDAQ Composite',
      price: parseFloat((14000 + (Math.random() - 0.5) * 150).toFixed(2)),
      change: parseFloat(((Math.random() - 0.5) * 120).toFixed(2)),
      changePercent: parseFloat(((Math.random() - 0.5) * 1.8).toFixed(2)),
    },
  ];

  const summary = {
    indices,
    topStocks: quotes,
    gainers,
    losers,
    lastUpdated: new Date().toISOString(),
  };

  cache.set(cacheKey, summary, 30);
  return summary;
};

module.exports = {
  fetchStockQuote,
  fetchHistoricalData,
  generateMockQuote,
  generateMockHistorical,
  searchStocks,
  getMarketSummary,
  MOCK_STOCKS,
};
