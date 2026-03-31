const express = require('express');
const axios = require('axios');
const RSSParser = require('rss-parser');
const { apiLimiter } = require('../middleware/rateLimit');

const router = express.Router();
const rssParser = new RSSParser();

// ======================== RSS Feed Sources ========================

const RSS_FEEDS = {
  stocks: [
    'https://news.google.com/rss/search?q=stock+market+Wall+Street+shares+-crypto+-bitcoin+when:1d&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=NYSE+NASDAQ+earnings+revenue+shares+-cryptocurrency+when:1d&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=AAPL+OR+NVDA+OR+TSLA+OR+MSFT+OR+AMZN+stock+when:1d&hl=en-US&gl=US&ceid=US:en',
  ],
  crypto: [
    'https://news.google.com/rss/search?q=cryptocurrency+bitcoin+when:1d&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=ethereum+solana+crypto+token+when:1d&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=blockchain+DeFi+NFT+web3+when:1d&hl=en-US&gl=US&ceid=US:en',
  ],
  economy: [
    'https://news.google.com/rss/search?q=federal+reserve+interest+rate+inflation+when:1d&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=GDP+unemployment+jobs+report+economic+growth+when:1d&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=trade+tariff+treasury+bond+yield+recession+when:1d&hl=en-US&gl=US&ceid=US:en',
  ],
};

// Keywords to validate an article belongs to its category (post-filter)
const CATEGORY_KEYWORDS = {
  stocks: [
    'stock', 'shares', 'share', 'equity', 'earnings', 'revenue', 'ipo',
    'nyse', 'nasdaq', 'dividend', 'market cap', 'wall street', 'analyst',
    'upgrade', 'downgrade', 'buy', 'sell', 'rating', 'quarterly',
    'aapl', 'nvda', 'tsla', 'msft', 'amzn', 'googl', 'meta', 'nflx',
    'amd', 'intc', 'ba', 'dis', 'jpm', 'v', 'avgo', 'uber', 'pltr',
    's&p 500', 'dow jones', 'profit', 'loss', 'guidance', 'outlook',
  ],
  crypto: [
    'crypto', 'bitcoin', 'btc', 'ethereum', 'eth', 'blockchain', 'token',
    'defi', 'nft', 'web3', 'solana', 'sol', 'ripple', 'xrp', 'cardano',
    'ada', 'dogecoin', 'doge', 'binance', 'coinbase', 'altcoin', 'stablecoin',
    'mining', 'wallet', 'exchange', 'decentralized', 'ledger', 'satoshi',
    'memecoin', 'airdrop', 'halving', 'layer 2', 'polygon', 'avalanche',
  ],
  economy: [
    'economy', 'inflation', 'federal reserve', 'fed', 'interest rate',
    'gdp', 'unemployment', 'jobs report', 'recession', 'monetary policy',
    'fiscal', 'treasury', 'bond', 'yield', 'cpi', 'ppi', 'consumer',
    'trade', 'tariff', 'deficit', 'surplus', 'central bank', 'rate cut',
    'rate hike', 'housing', 'mortgage', 'labor market', 'economic growth',
    'ecb', 'imf', 'world bank', 'stimulus', 'debt ceiling',
  ],
};

// Well-known stock symbols to detect in headlines
const SYMBOL_MAP = {
  apple: 'AAPL', aapl: 'AAPL',
  google: 'GOOGL', alphabet: 'GOOGL', googl: 'GOOGL',
  microsoft: 'MSFT', msft: 'MSFT',
  amazon: 'AMZN', amzn: 'AMZN',
  tesla: 'TSLA', tsla: 'TSLA',
  nvidia: 'NVDA', nvda: 'NVDA',
  meta: 'META', facebook: 'META',
  netflix: 'NFLX', nflx: 'NFLX',
  'jp morgan': 'JPM', jpmorgan: 'JPM',
  disney: 'DIS',
  amd: 'AMD',
  intel: 'INTC',
  boeing: 'BA',
  bitcoin: 'BTC', btc: 'BTC',
  ethereum: 'ETH', eth: 'ETH',
  solana: 'SOL', sol: 'SOL',
  ripple: 'XRP', xrp: 'XRP',
  cardano: 'ADA', ada: 'ADA',
  dogecoin: 'DOGE', doge: 'DOGE',
  coinbase: 'COIN',
  's&p': 'SPY', 'sp 500': 'SPY', 's&p 500': 'SPY',
  dow: 'DIA', nasdaq: 'QQQ',
  visa: 'V', mastercard: 'MA',
  broadcom: 'AVGO',
  uber: 'UBER', airbnb: 'ABNB',
  palantir: 'PLTR', snowflake: 'SNOW',
};

// Category images (gradient fallbacks by category)
const CATEGORY_IMAGES = {
  stocks: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1468254095679-bbcba94a7066?w=600&h=400&fit=crop',
  ],
  crypto: [
    'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=600&h=400&fit=crop',
  ],
  economy: [
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=600&h=400&fit=crop',
  ],
};

// ======================== Helpers ========================

/**
 * Check if an article's text matches its assigned category keywords.
 */
const matchesCategory = (text, category) => {
  const keywords = CATEGORY_KEYWORDS[category];
  if (!keywords) return true;
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
};

/**
 * Extract related stock/crypto symbols from a headline.
 */
const extractSymbols = (text) => {
  const lower = text.toLowerCase();
  const found = new Set();
  for (const [keyword, symbol] of Object.entries(SYMBOL_MAP)) {
    if (lower.includes(keyword)) found.add(symbol);
  }
  return [...found];
};

/**
 * Extract the source name from Google News title (articles end with " - Source Name").
 */
const extractSource = (title) => {
  const dashIndex = title.lastIndexOf(' - ');
  if (dashIndex !== -1) {
    return {
      cleanTitle: title.substring(0, dashIndex).trim(),
      source: title.substring(dashIndex + 3).trim(),
    };
  }
  return { cleanTitle: title, source: 'Google News' };
};

// Simple in-memory cache (5-minute TTL)
const cache = {};
const CACHE_TTL = 5 * 60 * 1000;

// ======================== Fetch Live News ========================

const fetchRSSNews = async (category) => {
  const cacheKey = category;
  const cached = cache[cacheKey];
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data;
  }

  const feeds = RSS_FEEDS[category];
  if (!feeds) return [];

  const allArticles = [];

  await Promise.allSettled(
    feeds.map(async (feedUrl) => {
      try {
        const feed = await rssParser.parseURL(feedUrl);
        const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.stocks;

        for (const item of feed.items || []) {
          const { cleanTitle, source } = extractSource(item.title || '');
          const symbols = extractSymbols(cleanTitle + ' ' + (item.contentSnippet || ''));

          allArticles.push({
            id: `rss-${Buffer.from(item.link || item.guid || cleanTitle).toString('base64').slice(0, 20)}`,
            title: cleanTitle,
            summary: item.contentSnippet || item.content || '',
            source,
            publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
            imageUrl: images[Math.floor(Math.random() * images.length)],
            url: item.link || '#',
            category,
            relatedSymbols: symbols,
          });
        }
      } catch (err) {
        console.error(`[News] RSS fetch error for ${feedUrl}:`, err.message);
      }
    })
  );

  // Post-filter: only keep articles that match their category keywords
  const relevant = allArticles.filter((a) =>
    matchesCategory(a.title + ' ' + a.summary, category)
  );

  // Deduplicate by title similarity
  const seen = new Set();
  const unique = (relevant.length > 0 ? relevant : allArticles).filter((a) => {
    const key = a.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by publish date (newest first)
  unique.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  cache[cacheKey] = { data: unique, time: Date.now() };
  return unique;
};

// ======================== Finnhub (Optional Enhancement) ========================

const fetchFinnhubNews = async (category) => {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return null;

  try {
    const finnhubCategory = category === 'crypto' ? 'crypto' : 'general';
    const response = await axios.get('https://finnhub.io/api/v1/news', {
      params: { category: finnhubCategory, token: apiKey },
      timeout: 5000,
    });

    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      return null;
    }

    return response.data.map((item, index) => ({
      id: `finnhub-${item.id || index}`,
      title: item.headline || 'Untitled',
      summary: item.summary || '',
      source: item.source || 'Unknown',
      publishedAt: item.datetime
        ? new Date(item.datetime * 1000).toISOString()
        : new Date().toISOString(),
      imageUrl: item.image || null,
      url: item.url || '#',
      category: category || 'stocks',
      relatedSymbols: item.related ? item.related.split(',').map((s) => s.trim()) : [],
    }));
  } catch (error) {
    console.error('[News] Finnhub API error:', error.message);
    return null;
  }
};

// ======================== Routes ========================

/**
 * GET /api/news
 * Get live financial news articles from RSS feeds.
 * Query params: category (all/stocks/crypto/economy), symbol, limit (default 20)
 */
router.get('/', apiLimiter, async (req, res) => {
  try {
    const { category = 'all', symbol, limit = 20 } = req.query;
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);

    const validCategories = ['all', 'stocks', 'crypto', 'economy'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Use one of: ${validCategories.join(', ')}`,
      });
    }

    let articles = [];

    if (category === 'all') {
      // Fetch all categories in parallel
      const [stocks, crypto, economy] = await Promise.all([
        fetchRSSNews('stocks'),
        fetchRSSNews('crypto'),
        fetchRSSNews('economy'),
      ]);
      articles = [...stocks, ...crypto, ...economy];
      // Re-sort combined results by date
      articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else {
      // Try Finnhub first if configured, fall back to RSS
      articles = await fetchFinnhubNews(category);
      if (!articles || articles.length === 0) {
        articles = await fetchRSSNews(category);
      }
    }

    // Filter by symbol
    if (symbol) {
      const upperSymbol = symbol.toUpperCase().trim();
      articles = articles.filter(
        (a) =>
          a.relatedSymbols &&
          a.relatedSymbols.some((s) => s.toUpperCase() === upperSymbol)
      );
    }

    // Apply limit
    articles = articles.slice(0, parsedLimit);

    res.status(200).json({
      success: true,
      data: articles,
      meta: {
        total: articles.length,
        category,
        symbol: symbol || null,
        limit: parsedLimit,
        live: true,
      },
    });
  } catch (error) {
    console.error('[News] Error fetching news:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news. Please try again.',
    });
  }
});

module.exports = router;
