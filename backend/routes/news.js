const express = require('express');
const axios = require('axios');
const { apiLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// ======================== Curated Mock News Data ========================

const generateMockNews = () => {
  const now = new Date();

  const articles = [
    {
      id: 'news-001',
      title: 'Apple Reports Record Q1 Revenue Driven by iPhone 16 Sales',
      summary:
        'Apple Inc. posted quarterly revenue of $124.3 billion, surpassing Wall Street expectations as iPhone 16 demand remained robust across all markets. CEO Tim Cook highlighted strong growth in Services, which reached an all-time high of $23.1 billion.',
      source: 'Reuters',
      publishedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=400&fit=crop',
      url: 'https://reuters.com',
      category: 'stocks',
      relatedSymbols: ['AAPL'],
    },
    {
      id: 'news-002',
      title: 'Federal Reserve Signals Potential Rate Cut in June Meeting',
      summary:
        'Fed Chair Jerome Powell indicated that the central bank is closely monitoring inflation data and could begin easing monetary policy as early as June. Markets rallied on the dovish tone, with Treasury yields falling across the curve.',
      source: 'Bloomberg',
      publishedAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop',
      url: 'https://bloomberg.com',
      category: 'economy',
      relatedSymbols: [],
    },
    {
      id: 'news-003',
      title: 'Bitcoin Surges Past $95,000 as Institutional Adoption Grows',
      summary:
        'Bitcoin reached a new all-time high above $95,000 after BlackRock and Fidelity reported record inflows into their spot Bitcoin ETFs. Analysts predict the cryptocurrency could test $100,000 by end of Q2 as institutional demand accelerates.',
      source: 'CoinDesk',
      publishedAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600&h=400&fit=crop',
      url: 'https://coindesk.com',
      category: 'crypto',
      relatedSymbols: ['BTC'],
    },
    {
      id: 'news-004',
      title: 'NVIDIA Stock Hits All-Time High on AI Chip Demand',
      summary:
        'NVIDIA shares surged 8% to a record closing price after the company announced its next-generation Blackwell Ultra GPU architecture. Data center revenue grew 290% year-over-year, driven by insatiable demand for AI training infrastructure.',
      source: 'CNBC',
      publishedAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600&h=400&fit=crop',
      url: 'https://cnbc.com',
      category: 'stocks',
      relatedSymbols: ['NVDA'],
    },
    {
      id: 'news-005',
      title: 'Tesla Unveils New Affordable Model, Shares Jump 12%',
      summary:
        'Tesla announced its long-awaited $25,000 electric vehicle, dubbed the Model Q, set for production in early 2027. The stock soared on the news as analysts project the lower price point could dramatically expand Tesla\'s addressable market.',
      source: 'Wall Street Journal',
      publishedAt: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=400&fit=crop',
      url: 'https://wsj.com',
      category: 'stocks',
      relatedSymbols: ['TSLA'],
    },
    {
      id: 'news-006',
      title: 'Ethereum Completes Major Network Upgrade, Gas Fees Drop 40%',
      summary:
        'The Ethereum network successfully implemented the Pectra upgrade, significantly reducing transaction costs and improving throughput. The upgrade positions Ethereum to better compete with faster Layer 1 blockchains for DeFi and NFT applications.',
      source: 'The Block',
      publishedAt: new Date(now - 8 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600&h=400&fit=crop',
      url: 'https://theblock.co',
      category: 'crypto',
      relatedSymbols: ['ETH'],
    },
    {
      id: 'news-007',
      title: 'US GDP Growth Exceeds Expectations at 3.2% in Q4',
      summary:
        'The U.S. economy grew at an annualized rate of 3.2% in the fourth quarter, beating economist forecasts of 2.8%. Consumer spending remained the primary driver, while business investment showed surprising strength in technology sectors.',
      source: 'Financial Times',
      publishedAt: new Date(now - 10 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop',
      url: 'https://ft.com',
      category: 'economy',
      relatedSymbols: [],
    },
    {
      id: 'news-008',
      title: 'Microsoft Azure Revenue Grows 35%, Cloud Wars Intensify',
      summary:
        'Microsoft reported Azure cloud revenue growth of 35% year-over-year, powered by strong demand for AI services built on OpenAI technology. The company now controls 24% of the global cloud infrastructure market.',
      source: 'Bloomberg',
      publishedAt: new Date(now - 12 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=600&h=400&fit=crop',
      url: 'https://bloomberg.com',
      category: 'stocks',
      relatedSymbols: ['MSFT'],
    },
    {
      id: 'news-009',
      title: 'Amazon Expands Same-Day Delivery to 50 New Cities',
      summary:
        'Amazon announced a massive logistics expansion, bringing same-day delivery capabilities to 50 additional U.S. metropolitan areas. The $8 billion investment includes 25 new fulfillment centers and a fleet of 10,000 electric delivery vans.',
      source: 'Reuters',
      publishedAt: new Date(now - 14 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=600&h=400&fit=crop',
      url: 'https://reuters.com',
      category: 'stocks',
      relatedSymbols: ['AMZN'],
    },
    {
      id: 'news-010',
      title: 'Oil Prices Spike After OPEC+ Announces Production Cuts',
      summary:
        'Crude oil prices jumped 5% after OPEC+ members agreed to extend production cuts through the end of 2026. Brent crude rose to $87 per barrel, raising concerns about inflationary pressures on the global economy.',
      source: 'CNBC',
      publishedAt: new Date(now - 16 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop',
      url: 'https://cnbc.com',
      category: 'economy',
      relatedSymbols: ['XOM', 'CVX'],
    },
    {
      id: 'news-011',
      title: 'Solana TVL Surpasses $20 Billion as DeFi Activity Surges',
      summary:
        'Solana\'s total value locked in decentralized finance protocols exceeded $20 billion for the first time, driven by growth in liquid staking and DEX trading volumes. The SOL token rallied 15% on the milestone.',
      source: 'CoinDesk',
      publishedAt: new Date(now - 18 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=600&h=400&fit=crop',
      url: 'https://coindesk.com',
      category: 'crypto',
      relatedSymbols: ['SOL'],
    },
    {
      id: 'news-012',
      title: 'Meta Platforms Revenue Beats Estimates on Strong Ad Demand',
      summary:
        'Meta Platforms reported quarterly revenue of $42.3 billion, beating estimates by $1.8 billion. CEO Mark Zuckerberg credited AI-powered ad targeting improvements and strong Reels monetization for the outperformance.',
      source: 'Wall Street Journal',
      publishedAt: new Date(now - 20 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop',
      url: 'https://wsj.com',
      category: 'stocks',
      relatedSymbols: ['META'],
    },
    {
      id: 'news-013',
      title: 'Global Inflation Cools to 3.1%, Central Banks Eye Policy Shift',
      summary:
        'Worldwide inflation fell to 3.1% in the latest readings, the lowest level since early 2021. Central banks across Europe and Asia are now signaling a coordinated shift toward looser monetary policy to support growth.',
      source: 'Financial Times',
      publishedAt: new Date(now - 22 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=600&h=400&fit=crop',
      url: 'https://ft.com',
      category: 'economy',
      relatedSymbols: [],
    },
    {
      id: 'news-014',
      title: 'Google DeepMind Breakthrough Sends Alphabet Shares Higher',
      summary:
        'Alphabet shares gained 6% after Google DeepMind unveiled a new AI model capable of scientific reasoning at PhD level. The breakthrough positions Google ahead in the enterprise AI race and boosted investor confidence in the company\'s AI strategy.',
      source: 'Reuters',
      publishedAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&h=400&fit=crop',
      url: 'https://reuters.com',
      category: 'stocks',
      relatedSymbols: ['GOOGL'],
    },
    {
      id: 'news-015',
      title: 'JPMorgan Reports Record Trading Revenue Amid Market Volatility',
      summary:
        'JPMorgan Chase reported record quarterly trading revenue of $9.7 billion, benefiting from heightened market volatility and strong client activity. CEO Jamie Dimon warned of potential economic headwinds while maintaining an optimistic outlook.',
      source: 'Bloomberg',
      publishedAt: new Date(now - 26 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=600&h=400&fit=crop',
      url: 'https://bloomberg.com',
      category: 'stocks',
      relatedSymbols: ['JPM'],
    },
    {
      id: 'news-016',
      title: 'Cardano Launches Smart Contract Upgrade, ADA Gains 20%',
      summary:
        'Cardano completed its highly anticipated Voltaire upgrade, introducing on-chain governance and enhanced smart contract capabilities. The ADA token surged 20% as developers signaled plans to migrate DeFi protocols to the network.',
      source: 'The Block',
      publishedAt: new Date(now - 28 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=600&h=400&fit=crop',
      url: 'https://theblock.co',
      category: 'crypto',
      relatedSymbols: ['ADA'],
    },
    {
      id: 'news-017',
      title: 'US Unemployment Falls to 3.4%, Labor Market Remains Tight',
      summary:
        'The U.S. economy added 315,000 jobs in the latest month, pushing the unemployment rate down to 3.4%. Wage growth moderated to 3.8% annually, easing some inflationary concerns while signaling continued labor market strength.',
      source: 'CNBC',
      publishedAt: new Date(now - 30 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
      url: 'https://cnbc.com',
      category: 'economy',
      relatedSymbols: [],
    },
    {
      id: 'news-018',
      title: 'Netflix Subscriber Growth Surges on Live Sports Strategy',
      summary:
        'Netflix added 18.9 million subscribers in Q4, its best quarter ever, driven by the launch of NFL Christmas Day games and a new WWE partnership. The streaming giant raised its 2026 revenue guidance to $44 billion.',
      source: 'Wall Street Journal',
      publishedAt: new Date(now - 32 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8d7e28?w=600&h=400&fit=crop',
      url: 'https://wsj.com',
      category: 'stocks',
      relatedSymbols: ['NFLX'],
    },
    {
      id: 'news-019',
      title: 'Ripple XRP Settles SEC Case, Token Surges 25%',
      summary:
        'Ripple Labs reached a final settlement with the SEC, ending a multi-year legal battle over whether XRP constitutes a security. The resolution removed regulatory uncertainty and triggered a massive rally in the token.',
      source: 'CoinDesk',
      publishedAt: new Date(now - 34 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=600&h=400&fit=crop',
      url: 'https://coindesk.com',
      category: 'crypto',
      relatedSymbols: ['XRP'],
    },
    {
      id: 'news-020',
      title: 'Visa Reports Strong Cross-Border Transaction Growth',
      summary:
        'Visa Inc. posted earnings above expectations as cross-border transaction volumes grew 18% year-over-year. International travel recovery and e-commerce expansion were cited as primary growth drivers for the payments giant.',
      source: 'Reuters',
      publishedAt: new Date(now - 36 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      url: 'https://reuters.com',
      category: 'stocks',
      relatedSymbols: ['V'],
    },
    {
      id: 'news-021',
      title: 'China Cuts Interest Rates to Boost Slowing Economy',
      summary:
        'The People\'s Bank of China cut its benchmark lending rate by 25 basis points in a move to stimulate the world\'s second-largest economy. Asian markets rallied on the news, though analysts questioned whether the cut would be sufficient.',
      source: 'Financial Times',
      publishedAt: new Date(now - 38 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600&h=400&fit=crop',
      url: 'https://ft.com',
      category: 'economy',
      relatedSymbols: [],
    },
    {
      id: 'news-022',
      title: 'AMD Gains Ground in Data Center Market, Shares Rise 9%',
      summary:
        'Advanced Micro Devices reported that its MI300X AI accelerator captured 12% of the data center GPU market in Q4, eating into NVIDIA\'s dominance. AMD raised its 2026 AI chip revenue forecast to $8 billion.',
      source: 'Bloomberg',
      publishedAt: new Date(now - 40 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1591799265444-d66432b91588?w=600&h=400&fit=crop',
      url: 'https://bloomberg.com',
      category: 'stocks',
      relatedSymbols: ['AMD'],
    },
    {
      id: 'news-023',
      title: 'Polkadot Parachain Ecosystem Reaches 100 Active Chains',
      summary:
        'The Polkadot ecosystem achieved a milestone with 100 active parachains, solidifying its position as a leading multi-chain platform. Developer activity on the network has doubled over the past six months.',
      source: 'The Block',
      publishedAt: new Date(now - 42 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
      url: 'https://theblock.co',
      category: 'crypto',
      relatedSymbols: ['DOT'],
    },
    {
      id: 'news-024',
      title: 'S&P 500 Hits Record High as Tech Rally Broadens',
      summary:
        'The S&P 500 index closed at a new all-time high of 5,892, marking its 30th record close of 2026. The rally broadened beyond mega-cap tech with industrials and financials contributing to gains across all 11 sectors.',
      source: 'CNBC',
      publishedAt: new Date(now - 44 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop',
      url: 'https://cnbc.com',
      category: 'economy',
      relatedSymbols: ['SPY'],
    },
    {
      id: 'news-025',
      title: 'Disney+ Turns Profitable for First Time, Stock Rallies',
      summary:
        'Walt Disney Company announced that its Disney+ streaming service achieved profitability ahead of schedule, posting operating income of $321 million. The milestone sent Disney shares up 7% in after-hours trading.',
      source: 'Wall Street Journal',
      publishedAt: new Date(now - 46 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&h=400&fit=crop',
      url: 'https://wsj.com',
      category: 'stocks',
      relatedSymbols: ['DIS'],
    },
    {
      id: 'news-026',
      title: 'European Central Bank Holds Rates Steady, Signals Spring Cut',
      summary:
        'The ECB kept interest rates unchanged at 3.75% but signaled a likely cut in April as eurozone inflation continues to decline. The euro weakened against the dollar on the dovish forward guidance.',
      source: 'Financial Times',
      publishedAt: new Date(now - 48 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=600&h=400&fit=crop',
      url: 'https://ft.com',
      category: 'economy',
      relatedSymbols: [],
    },
    {
      id: 'news-027',
      title: 'Coinbase Revenue Doubles as Crypto Trading Volumes Surge',
      summary:
        'Coinbase Global reported revenue of $2.1 billion, more than doubling year-over-year as crypto trading volumes hit multi-year highs. The exchange also saw strong growth in its institutional custody and staking services.',
      source: 'Bloomberg',
      publishedAt: new Date(now - 50 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=600&h=400&fit=crop',
      url: 'https://bloomberg.com',
      category: 'crypto',
      relatedSymbols: ['COIN'],
    },
    {
      id: 'news-028',
      title: 'Broadcom Raises Dividend After Strong Infrastructure Chip Sales',
      summary:
        'Broadcom Inc. raised its quarterly dividend by 14% following better-than-expected earnings driven by demand for networking and custom AI accelerator chips. The stock hit a 52-week high on the announcement.',
      source: 'Reuters',
      publishedAt: new Date(now - 52 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
      url: 'https://reuters.com',
      category: 'stocks',
      relatedSymbols: ['AVGO'],
    },
  ];

  return articles;
};

// ======================== Finnhub API Fetch ========================

const fetchFinnhubNews = async (category) => {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return null;

  try {
    const finnhubCategory = category === 'crypto' ? 'crypto' : 'general';
    const response = await axios.get('https://finnhub.io/api/v1/news', {
      params: {
        category: finnhubCategory,
        token: apiKey,
      },
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
 * Get financial news articles.
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

    // Try Finnhub first, fall back to mock data
    let articles = await fetchFinnhubNews(category === 'all' ? 'general' : category);

    if (!articles || articles.length === 0) {
      articles = generateMockNews();
    }

    // Filter by category
    if (category !== 'all') {
      articles = articles.filter((a) => a.category === category);
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
