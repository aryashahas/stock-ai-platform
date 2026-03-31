const express = require('express');
const OpenAI = require('openai');
const rateLimit = require('express-rate-limit');
const {
  fetchStockQuote,
  getMarketSummary,
} = require('../services/stockService');

const router = express.Router();

// Tighter rate limit for chat (costs money per call)
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many chat requests. Please try again in a few minutes.',
  },
  keyGenerator: (req) => req.ip,
});

// Initialize OpenAI client lazily (avoid crash if key is missing at import time)
let openai = null;
const getOpenAI = () => {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
};

// ======================== Platform Data Helpers ========================

// Top stocks to always pull data for when user asks general questions
const TOP_STOCKS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'NVDA', 'TSLA', 'META', 'NFLX', 'AMD', 'JPM'];

/**
 * Detect stock symbols mentioned in user message.
 */
const detectSymbols = (message) => {
  const upper = message.toUpperCase();
  const symbolPattern = /\b[A-Z]{1,5}\b/g;
  const matches = upper.match(symbolPattern) || [];

  // Also detect company names
  const nameMap = {
    apple: 'AAPL', google: 'GOOGL', alphabet: 'GOOGL', microsoft: 'MSFT',
    amazon: 'AMZN', tesla: 'TSLA', nvidia: 'NVDA', meta: 'META',
    facebook: 'META', netflix: 'NFLX', 'jp morgan': 'JPM', jpmorgan: 'JPM',
    disney: 'DIS', amd: 'AMD', intel: 'INTC', boeing: 'BA',
    visa: 'V', mastercard: 'MA', paypal: 'PYPL', coinbase: 'COIN',
    uber: 'UBER', airbnb: 'ABNB', palantir: 'PLTR', snowflake: 'SNOW',
    'eli lilly': 'LLY', pfizer: 'PFE', walmart: 'WMT', costco: 'COST',
    nike: 'NKE', starbucks: 'SBUX', coca: 'KO', pepsi: 'PEP',
    'bank of america': 'BAC', goldman: 'GS', wells: 'WFC',
  };

  const lower = message.toLowerCase();
  for (const [name, symbol] of Object.entries(nameMap)) {
    if (lower.includes(name)) matches.push(symbol);
  }

  // Filter to likely stock symbols (skip common English words)
  const skipWords = new Set([
    'I', 'A', 'THE', 'IS', 'IT', 'IN', 'ON', 'TO', 'DO', 'IF', 'AT', 'OR',
    'AN', 'BE', 'MY', 'OF', 'SO', 'UP', 'NO', 'BY', 'AS', 'WE', 'HE', 'GO',
    'AM', 'ME', 'US', 'AI', 'ALL', 'AND', 'ARE', 'BUT', 'CAN', 'FOR', 'GET',
    'HAD', 'HAS', 'HER', 'HIM', 'HIS', 'HOW', 'ITS', 'LET', 'MAY', 'NEW',
    'NOT', 'NOW', 'OLD', 'OUR', 'OUT', 'OWN', 'SAY', 'SHE', 'TOO', 'USE',
    'WAY', 'WHO', 'BOY', 'DID', 'GOT', 'HAS', 'HER', 'HOT', 'LOW', 'OIL',
    'PUT', 'RAN', 'RED', 'RUN', 'SET', 'TEN', 'TOP', 'TRY', 'TWO', 'WAR',
    'WAS', 'WON', 'YES', 'YET', 'YOU', 'WHAT', 'WHEN', 'WILL', 'WITH', 'HAVE',
    'THIS', 'THAT', 'FROM', 'THEY', 'BEEN', 'SAID', 'EACH', 'WHICH', 'THEIR',
    'BEST', 'GOOD', 'SOME', 'THEM', 'THAN', 'MOST', 'ALSO', 'MADE', 'OVER',
    'SUCH', 'LIKE', 'LONG', 'VERY', 'MUCH', 'SHOULD', 'WOULD', 'COULD',
    'STOCK', 'STOCKS', 'MARKET', 'BUY', 'SELL', 'PRICE', 'HIGH', 'THINK',
    'ABOUT', 'INVEST', 'MONEY', 'TELL', 'GIVE', 'HELP', 'NEED', 'WANT',
    'MAKE', 'TAKE', 'KNOW', 'FIND', 'LOOK', 'SHOW', 'WELL', 'WHY', 'ETF',
  ]);

  return [...new Set(matches.filter((s) => !skipWords.has(s) && s.length >= 1))];
};

/**
 * Determine if the user is asking about specific stocks, market overview, or recommendations.
 */
const classifyIntent = (message) => {
  const lower = message.toLowerCase();

  if (/which.*(stock|invest|buy|recommend|suggest)|suggest.*(stock|invest)|best.*(stock|invest)|what.*(should|would).*(buy|invest)|top.*(stock|pick)|recommend/i.test(lower)) {
    return 'recommendation';
  }
  if (/market.*(overview|summary|doing|look|today|how)|how.*(market|index)|overall.*market/i.test(lower)) {
    return 'market_overview';
  }
  if (/compare|vs|versus|better.*than|or\b/i.test(lower) && detectSymbols(message).length >= 2) {
    return 'compare';
  }
  if (detectSymbols(message).length > 0) {
    return 'specific_stock';
  }
  return 'general';
};

/**
 * Fetch live platform data based on user intent.
 */
const fetchPlatformContext = async (message) => {
  const intent = classifyIntent(message);
  const detectedSymbols = detectSymbols(message);
  let context = '';

  try {
    if (intent === 'recommendation' || intent === 'market_overview') {
      // Fetch market summary + top stocks
      const [marketData, ...stockQuotes] = await Promise.all([
        getMarketSummary().catch(() => null),
        ...TOP_STOCKS.map((s) => fetchStockQuote(s).catch(() => null)),
      ]);

      if (marketData) {
        context += `\n📊 LIVE MARKET SUMMARY:\n`;
        if (marketData.indices) {
          for (const idx of marketData.indices) {
            context += `  ${idx.name}: ${idx.price} (${idx.changePercent >= 0 ? '+' : ''}${idx.changePercent}%)\n`;
          }
        }
      }

      context += `\n📈 TOP STOCKS (LIVE DATA):\n`;
      for (const q of stockQuotes) {
        if (q) {
          const dir = q.changePercent >= 0 ? '▲' : '▼';
          context += `  ${q.symbol} (${q.name}): $${q.price} ${dir} ${q.changePercent >= 0 ? '+' : ''}${q.changePercent}% | Vol: ${formatNum(q.volume)} | High: $${q.high} | Low: $${q.low}\n`;
        }
      }

      // Identify best and worst performers
      const valid = stockQuotes.filter(Boolean).sort((a, b) => b.changePercent - a.changePercent);
      if (valid.length > 0) {
        context += `\n🏆 TOP GAINER TODAY: ${valid[0].symbol} (${valid[0].name}) ${valid[0].changePercent >= 0 ? '+' : ''}${valid[0].changePercent}%`;
        context += `\n📉 BIGGEST LOSER TODAY: ${valid[valid.length - 1].symbol} (${valid[valid.length - 1].name}) ${valid[valid.length - 1].changePercent >= 0 ? '+' : ''}${valid[valid.length - 1].changePercent}%\n`;
      }
    }

    if (intent === 'specific_stock' || intent === 'compare') {
      const symbols = detectedSymbols.slice(0, 5);
      const quotes = await Promise.all(
        symbols.map((s) => fetchStockQuote(s).catch(() => null))
      );

      context += `\n📊 LIVE STOCK DATA:\n`;
      for (const q of quotes) {
        if (q) {
          const dir = q.changePercent >= 0 ? '▲' : '▼';
          context += `  ${q.symbol} (${q.name}):\n`;
          context += `    Price: $${q.price} ${dir} ${q.changePercent >= 0 ? '+' : ''}${q.changePercent}%\n`;
          context += `    Day Range: $${q.low} — $${q.high}\n`;
          context += `    Open: $${q.open} | Prev Close: $${q.previousClose}\n`;
          context += `    Volume: ${formatNum(q.volume)} | Market Cap: $${formatNum(q.marketCap)}\n`;
          if (q.pe) context += `    P/E Ratio: ${q.pe}\n`;
          if (q.week52High) context += `    52-Week Range: $${q.week52Low} — $${q.week52High}\n`;
          context += '\n';
        }
      }
    }
  } catch (err) {
    console.error('[Chat] Error fetching platform data:', err.message);
  }

  return { intent, context, detectedSymbols };
};

const formatNum = (n) => {
  if (!n) return 'N/A';
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
};

// ======================== System Prompt ========================

const buildSystemPrompt = (platformContext) => {
  return `You are the AI financial advisor for StockAI, an AI-powered stock analysis platform. You have LIVE ACCESS to real-time market data from the platform.

IMPORTANT RULES:
- You MUST use the live platform data provided below to answer questions. Do NOT make up prices or data.
- When suggesting stocks, base your suggestions on the actual live performance data shown below.
- Cite specific numbers (price, % change, volume) from the data when answering.
- If the user asks "which stock should I buy" or "what do you recommend", analyze the live data and give a data-driven answer with reasoning.
- For comparisons, use actual numbers side by side.
- Keep responses concise (2-4 paragraphs max) with bullet points.
- Include a brief disclaimer that this is educational and not professional financial advice.
- Be confident and give clear opinions backed by the data, not wishy-washy non-answers.
- If a user asks about a stock not in the data, tell them to search for it on the platform's Discover page.

${platformContext || '(No live data available for this query — give general advice.)'}

You also know about the StockAI platform features:
- Dashboard: Real-time market overview with live stock prices
- Predictions: AI-powered stock price predictions using LSTM neural networks
- Discover: Search and explore 100+ stocks across all sectors
- News: Live financial news from multiple sources
- Watchlist: Track favorite stocks
- AI Chat: This conversation (data-driven financial advice)

If the user asks something completely unrelated to finance, politely redirect them.`;
};

// ======================== Fallback (no OpenAI) ========================

/**
 * Generate a data-driven fallback response using platform data.
 */
const generateDataDrivenFallback = async (message) => {
  const { intent, context, detectedSymbols } = await fetchPlatformContext(message);

  if (intent === 'recommendation') {
    // Parse the context to find top gainers
    return `Based on **live data** from the StockAI platform, here's my analysis:\n\n${context}\n\n**My Take:**\nLook at the top gainers — stocks showing strong upward momentum today could indicate positive sentiment. However, always consider:\n\n• **Diversification** — Don't put all your money in one stock\n• **Your risk tolerance** — High-growth tech stocks (NVDA, TSLA) are more volatile\n• **Long-term outlook** — One day's performance doesn't make a trend\n\nFor a beginner, broad index ETFs like SPY or QQQ give you exposure to all these top stocks at once.\n\n💡 Use the **Predictions** page on StockAI to see AI-powered 30-day forecasts for any stock!\n\n⚠️ This is educational analysis based on platform data, not professional financial advice.`;
  }

  if (intent === 'market_overview') {
    return `Here's the **live market snapshot** from StockAI:\n\n${context}\n\n**Summary:** Review the data above to understand today's market direction. Green (▲) indicates stocks trending up, red (▼) means they're down.\n\nUse StockAI's **Dashboard** for real-time updates or the **Predictions** page for AI forecasts.\n\n⚠️ This is educational analysis, not professional financial advice.`;
  }

  if (intent === 'specific_stock' && context) {
    return `Here's the **live data** from StockAI for the stock(s) you asked about:\n\n${context}\n**Analysis:**\n• Check the price relative to the 52-week range to understand if it's near highs or lows\n• Compare volume to average — high volume confirms price moves\n• Use StockAI's **Predictions** page to get an AI-powered 30-day price forecast\n\n⚠️ This is educational analysis, not professional financial advice.`;
  }

  if (intent === 'compare' && context) {
    return `Here's a **side-by-side comparison** using live StockAI data:\n\n${context}\n**How to decide:**\n• Compare % change to see which has more momentum today\n• Check market cap for company size (larger = more stable, smaller = more growth potential)\n• Look at P/E ratios — lower can mean better value\n• Use StockAI's **Predictions** page to compare AI forecasts\n\n⚠️ This is educational analysis, not professional financial advice.`;
  }

  // General finance fallback
  return getGeneralFallback(message);
};

/**
 * General fallback for non-data questions.
 */
const getGeneralFallback = (message) => {
  const msg = message.toLowerCase().trim();

  const rules = [
    { keywords: ['what is a stock', 'what are stocks', 'explain stock'], response: "A **stock** represents partial ownership in a company. When you buy shares of Apple (AAPL), you own a tiny piece of Apple Inc. Stocks are traded on exchanges like NYSE and NASDAQ.\n\n**How to explore stocks on StockAI:**\n• Go to **Discover** to search 100+ stocks\n• Check **Dashboard** for live market data\n• Use **Predictions** for AI-powered price forecasts\n\n⚠️ Educational information, not financial advice." },
    { keywords: ['start investing', 'begin investing', 'how to invest', 'new to investing'], response: "Here's a beginner roadmap:\n\n1. **Build an emergency fund** (3-6 months expenses)\n2. **Start with index funds** — SPY or VTI give instant diversification\n3. **Invest regularly** — Even $50/month builds wealth via compound growth\n4. **Use StockAI** to research stocks before buying:\n   • **Discover** page → search and explore stocks\n   • **Predictions** → AI-powered 30-day forecasts\n   • **News** → stay updated on market events\n\nThe best time to start is now — compound interest rewards early investors!\n\n⚠️ Educational information, not financial advice." },
    { keywords: ['p/e ratio', 'pe ratio', 'price to earnings'], response: "**P/E Ratio** = Stock Price ÷ Earnings Per Share\n\nIt tells you how much investors pay for $1 of earnings:\n• **Low P/E (< 15):** Potentially undervalued or slow growth\n• **Average P/E (15-25):** Typical for established companies\n• **High P/E (> 25):** Investors expect high future growth\n\nAlways compare within the same industry. Check any stock's P/E on StockAI's **Discover** page!\n\n⚠️ Educational information, not financial advice." },
    { keywords: ['prediction', 'ai predict', 'lstm', 'forecast'], response: "StockAI uses **LSTM (Long Short-Term Memory) neural networks** to predict stock prices:\n\n1. Fetches 2 years of historical price data\n2. The AI learns patterns (trends, momentum, seasonality)\n3. Generates a **30-day price forecast** with confidence metrics\n\n**Metrics explained:**\n• **RMSE** — Prediction error in dollars (lower = better)\n• **R² Score** — Model accuracy (closer to 1.0 = better)\n• **MAPE** — Error as percentage (lower = better)\n\nTry it: Go to **Predictions** and enter any stock symbol!\n\n⚠️ AI predictions are educational — markets are inherently unpredictable." },
    { keywords: ['crypto', 'bitcoin', 'ethereum', 'blockchain'], response: "Crypto is a digital asset class with high volatility:\n\n• **Bitcoin (BTC)** — Digital gold, limited to 21M coins\n• **Ethereum (ETH)** — Smart contract platform for DeFi/NFTs\n• **Bitcoin ETFs** — IBIT, FBTC let you invest via stock exchanges\n\n**Tips:**\n• Limit crypto to 5-10% of your portfolio\n• Dollar-cost average rather than lump-sum\n• Check StockAI's **News** page (Crypto tab) for latest updates\n\n⚠️ Crypto is speculative — only invest what you can afford to lose." },
    { keywords: ['should i invest', 'ready to invest', 'when to invest'], response: "Before investing, make sure you have:\n\n1. ✅ **Emergency fund** (3-6 months expenses)\n2. ✅ **High-interest debt paid off** (credit cards first)\n3. ✅ **Stable income** you won't need for 3-5 years\n\n**When you're ready:**\n• Start with **index funds** (SPY, VTI) for diversification\n• Use StockAI's **Predictions** page to analyze individual stocks\n• Check **Dashboard** daily for market trends\n• Start small — $50/month builds wealth over time\n\nThe best time to invest was yesterday. The second best is today!\n\n⚠️ Individual circumstances vary — consider professional advice for major decisions." },
    { keywords: ['retirement', '401k', 'ira', 'roth'], response: "**Retirement Planning Essentials:**\n\n• **401(k)** — Get your employer match (free money!)\n• **Roth IRA** — Tax-free withdrawals in retirement\n• **Target:** Save 15-20% of income, aim for 25x annual expenses\n\n**Age-based allocation:**\n• 20s-30s: 80-90% stocks (aggressive growth)\n• 40s-50s: 60-70% stocks (balanced)\n• 60s+: 40-50% stocks (conservative)\n\nUse StockAI to research which stocks/ETFs to hold in your retirement accounts!\n\n⚠️ Consider consulting a financial planner for personalized strategy." },
    { keywords: ['budget', 'save money', 'spending'], response: "**The 50/30/20 Rule:**\n• 50% **Needs** — Rent, food, utilities\n• 30% **Wants** — Entertainment, dining out\n• 20% **Savings & Investing** — Emergency fund → 401k match → Roth IRA → Brokerage\n\nAutomate your savings on payday and invest consistently. Even small amounts compound powerfully over decades.\n\n⚠️ Educational information, not financial advice." },
    { keywords: ['when to buy', 'when to sell', 'buy or sell', 'should i buy', 'should i sell'], response: "**When to BUY:**\n• Company has strong fundamentals (growing revenue, solid earnings)\n• Stock is reasonably valued vs. industry P/E average\n• You have a long-term thesis for why it will grow\n• Use StockAI **Predictions** for AI-powered analysis\n\n**When to SELL:**\n• Your investment thesis changed (fundamentals deteriorated)\n• Stock is significantly overvalued\n• You need to rebalance your portfolio\n\n**Never sell** just because the price dropped temporarily — that's how you lock in losses.\n\n⚠️ For major decisions, consult a professional advisor." },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((kw) => msg.includes(kw))) {
      return rule.response;
    }
  }

  return "I'm your **StockAI financial advisor** with access to live market data! I can help with:\n\n📊 **Stock Analysis** — Ask about any stock (e.g., \"How is AAPL doing?\")\n💡 **Recommendations** — \"Which stocks should I invest in?\"\n📈 **Market Overview** — \"How is the market today?\"\n🔄 **Comparisons** — \"Compare AAPL vs MSFT\"\n💰 **Financial Advice** — Investing, budgeting, retirement, crypto\n\n**Try asking:**\n- \"Which stock do you recommend right now?\"\n- \"How is Tesla doing today?\"\n- \"Compare NVDA and AMD\"\n- \"Should I invest in index funds?\"\n\nAll my recommendations are backed by **real-time data** from the StockAI platform!";
};

// ======================== Route ========================

/**
 * POST /api/chat
 * Send a message to the AI advisor. Fetches live platform data before responding.
 */
router.post('/', chatLimiter, async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid message.',
      });
    }

    if (message.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Message is too long. Please keep it under 1000 characters.',
      });
    }

    // Step 1: Fetch live platform data relevant to the user's question
    const { context: platformContext } = await fetchPlatformContext(message.trim());

    // Step 2: Try OpenAI with live data injected
    const client = getOpenAI();
    if (client) {
      try {
        const systemPrompt = buildSystemPrompt(platformContext);

        const messages = [
          { role: 'system', content: systemPrompt },
          ...history.slice(-10),
          { role: 'user', content: message.trim() },
        ];

        const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 700,
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0].message.content;

      return res.status(200).json({
        success: true,
        response: aiResponse,
      });
      } catch (aiError) {
        console.warn('[Chat] OpenAI unavailable, using data-driven fallback:', aiError.message);
      }
    }

    // Step 3: Fallback — generate response using live platform data
    const fallbackResponse = await generateDataDrivenFallback(message.trim());

    res.status(200).json({
      success: true,
      response: fallbackResponse,
    });
  } catch (error) {
    console.error('[Chat] Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI response. Please try again.',
    });
  }
});

module.exports = router;
