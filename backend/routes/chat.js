const express = require('express');
const OpenAI = require('openai');
const rateLimit = require('express-rate-limit');

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

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a knowledgeable stock market and financial AI advisor embedded in StockAI, a comprehensive trading and finance platform. You answer questions related to:
- Stocks, equities, and stock exchanges
- Financial markets and market trends
- Personal finance — budgeting, saving, debt management, retirement planning
- Investment strategies, portfolio construction, and asset allocation
- Financial advice — when to buy/sell, how to evaluate opportunities, tax-efficient investing
- Company analysis and fundamentals (P/E ratio, EPS, market cap, revenue, etc.)
- Technical analysis concepts (moving averages, RSI, MACD, support/resistance, etc.)
- ETFs, mutual funds, bonds, options, and other financial instruments
- Economic indicators that affect markets (interest rates, inflation, GDP, Fed policy)
- Cryptocurrency and digital assets basics
- Real estate investment and REITs
- Insurance, estate planning, and wealth management basics
- Trading terminology, order types, and market mechanics

If the user asks about something completely unrelated to finance, stocks, or money (e.g., weather, sports scores, cooking recipes, coding), politely redirect them:
"I specialize in stocks and financial advice. Feel free to ask me anything about investing, personal finance, market analysis, or financial planning!"

Guidelines for responses:
- Provide actionable financial guidance and specific advice when asked
- Keep explanations clear and accessible for all experience levels
- Use real-world examples when possible (e.g., "Apple (AAPL)", "S&P 500")
- Keep responses concise — aim for 2-4 paragraphs max
- When giving specific investment advice, include a brief note that individual circumstances vary and professional consultation is recommended for major financial decisions
- Use bullet points or numbered lists for clarity when appropriate
- Be confident, helpful, and informative in tone
- Answer questions about specific stocks, sectors, or strategies directly without excessive hedging`;

// ─── Built-in fallback knowledge base ───
// Used when OpenAI API is unavailable (quota exceeded, key issues, etc.)
const FALLBACK_RESPONSES = {
  // Stock basics
  'what is a stock': "A stock (also called a share or equity) represents a small piece of ownership in a company. When you buy a stock, you become a partial owner of that company.\n\nFor example, if you buy shares of Apple (AAPL), you own a tiny fraction of Apple Inc. As the company grows and becomes more profitable, your shares typically become more valuable.\n\nCompanies sell stocks to raise money for growth, research, and operations. Investors buy stocks hoping the price will go up over time, allowing them to sell at a profit.\n\n⚠️ This is educational information, not financial advice.",

  'how to start investing': "Here's a beginner-friendly roadmap to start investing:\n\n1. **Learn the basics** — Understand what stocks, bonds, and ETFs are before putting money in.\n\n2. **Set a budget** — Only invest money you won't need in the short term. Start small — even $50-100/month is a great beginning.\n\n3. **Open a brokerage account** — Popular options include Fidelity, Charles Schwab, or Robinhood. Look for low fees and a user-friendly interface.\n\n4. **Start with index funds or ETFs** — Funds like the S&P 500 ETF (SPY) give you instant diversification across hundreds of companies.\n\n5. **Invest regularly** — Dollar-cost averaging (investing a fixed amount regularly) reduces the impact of market volatility.\n\n6. **Think long-term** — The stock market has historically returned ~10% annually over long periods, but short-term swings are normal.\n\n⚠️ This is educational information, not financial advice.",

  'p/e ratio': "The P/E (Price-to-Earnings) ratio is one of the most popular metrics for evaluating stocks. It tells you how much investors are willing to pay for each dollar of a company's earnings.\n\n**Formula:** P/E Ratio = Stock Price ÷ Earnings Per Share (EPS)\n\n**Example:** If Apple's stock price is $175 and its EPS is $7, the P/E ratio is 25. This means investors are paying $25 for every $1 of Apple's earnings.\n\n**How to interpret it:**\n• **Low P/E (below 15)** — Could mean the stock is undervalued, or the company has slow growth\n• **Average P/E (15-25)** — Typical for established companies\n• **High P/E (above 25)** — Investors expect high future growth (common in tech stocks)\n\nAlways compare P/E ratios within the same industry — a tech company's P/E will naturally be higher than a utility company's.\n\n⚠️ This is educational information, not financial advice.",

  'etf': "An ETF (Exchange-Traded Fund) is like a basket that holds many different investments (stocks, bonds, etc.) bundled together into a single product you can buy and sell like a regular stock.\n\n**How ETFs work:**\n• Instead of buying individual stocks one by one, you buy one ETF that contains dozens or hundreds of stocks\n• ETFs trade on stock exchanges just like regular stocks\n• They typically have very low fees compared to mutual funds\n\n**Popular ETFs:**\n• **SPY** — Tracks the S&P 500 (500 largest US companies)\n• **QQQ** — Tracks the NASDAQ-100 (top tech companies)\n• **VTI** — Tracks the total US stock market\n• **VOO** — Another S&P 500 tracker from Vanguard\n\n**Why ETFs are great for beginners:**\nThey give you instant diversification. Instead of risking everything on one company, you spread your investment across many companies automatically.\n\n⚠️ This is educational information, not financial advice.",

  'bull bear market': "**Bull Market** 📈 — A period when stock prices are rising or expected to rise. The market is optimistic, investors are confident, and the economy is generally strong.\n• Example: The US stock market from 2009-2020 was one of the longest bull markets in history.\n\n**Bear Market** 📉 — A period when stock prices fall 20% or more from recent highs. Investors are pessimistic, and there's often economic slowdown.\n• Example: The COVID crash in March 2020, when the S&P 500 dropped about 34% in a month.\n\n**Key differences:**\n• Bull = prices going UP, optimism, economic growth\n• Bear = prices going DOWN, pessimism, economic contraction\n\n**What should you do?**\n• In a bull market: Stay invested, but don't get overconfident\n• In a bear market: Don't panic sell! Historically, markets always recover. Bear markets can actually be good buying opportunities.\n\n⚠️ This is educational information, not financial advice.",

  'market cap': "Market capitalization (market cap) tells you the total value of a company in the stock market.\n\n**Formula:** Market Cap = Stock Price × Total Number of Shares\n\n**Example:** If Apple's stock price is $175 and there are 15.7 billion shares, Apple's market cap is about $2.75 trillion.\n\n**Company size categories:**\n• **Mega-cap:** Over $200 billion (Apple, Microsoft, Google)\n• **Large-cap:** $10B - $200B (most well-known companies)\n• **Mid-cap:** $2B - $10B (growing companies)\n• **Small-cap:** $300M - $2B (smaller, potentially higher growth)\n• **Micro-cap:** Under $300M (very small, higher risk)\n\n**Why it matters:** Market cap helps you understand a company's size and stability. Larger companies are generally more stable but grow slower, while smaller companies are riskier but can grow faster.\n\n⚠️ This is educational information, not financial advice.",

  'what affects stock prices': "Stock prices move based on supply and demand — if more people want to buy than sell, the price goes up, and vice versa. Here are the main factors:\n\n**Company-specific factors:**\n• **Earnings reports** — Better-than-expected earnings push prices up\n• **Revenue growth** — Increasing sales signal a healthy company\n• **New products/services** — Innovation can boost investor confidence\n• **Management changes** — New CEO can affect stock positively or negatively\n\n**Market-wide factors:**\n• **Interest rates** — When rates rise, stocks often fall (borrowing becomes expensive)\n• **Inflation** — High inflation erodes purchasing power and can hurt stocks\n• **Economic data** — GDP growth, unemployment rates, consumer spending\n• **Global events** — Wars, pandemics, trade policies\n\n**Investor sentiment:**\n• **News and media** — Headlines can cause quick price swings\n• **Fear and greed** — Emotions drive short-term market movements\n• **Analyst ratings** — Upgrades/downgrades from Wall Street analysts\n\n⚠️ This is educational information, not financial advice.",

  'technical analysis': "Technical analysis is a method of predicting future stock price movements by studying past price charts and trading patterns.\n\n**Key concepts:**\n\n• **Moving Averages (MA)** — Smooths out price data to identify trends. The 50-day and 200-day MAs are most popular. When the 50-day crosses above the 200-day (\"golden cross\"), it's considered bullish.\n\n• **Support and Resistance** — Support is a price level where a stock tends to stop falling. Resistance is where it tends to stop rising. Think of them as a floor and ceiling.\n\n• **RSI (Relative Strength Index)** — Measures if a stock is overbought (RSI > 70) or oversold (RSI < 30). Ranges from 0 to 100.\n\n• **Volume** — The number of shares traded. High volume confirms a price move; low volume suggests the move may not last.\n\n• **Candlestick patterns** — Visual patterns on charts (like \"doji,\" \"hammer,\" \"engulfing\") that can signal price reversals.\n\n**Important note:** Technical analysis is just one tool — it works best when combined with fundamental analysis (studying the company's financials).\n\n⚠️ This is educational information, not financial advice.",

  'diversification': "Diversification means spreading your investments across different assets to reduce risk. It's often called the \"don't put all your eggs in one basket\" strategy.\n\n**How to diversify:**\n\n1. **Across stocks** — Don't just buy one company. Own shares in 15-30 different companies, or use ETFs for instant diversification.\n\n2. **Across sectors** — Invest in different industries: technology, healthcare, finance, energy, consumer goods, etc. If one sector struggles, others may do well.\n\n3. **Across asset types** — Mix stocks, bonds, and other investments. Bonds are typically more stable when stocks are volatile.\n\n4. **Across geographies** — Include both US and international stocks. International ETFs like VXUS can help.\n\n**Why it matters:**\nIf you only own tech stocks and the tech sector crashes, you lose a lot. But if you also own healthcare, energy, and bond funds, those might hold steady or even go up, cushioning your losses.\n\n**Simple diversified portfolio example:**\n• 60% US stocks (VTI)\n• 20% International stocks (VXUS)\n• 20% Bonds (BND)\n\n⚠️ This is educational information, not financial advice.",

  'dividend': "A dividend is a payment that companies make to their shareholders from their profits. Think of it as a \"thank you\" payment for being a shareholder.\n\n**How dividends work:**\n• Companies pay dividends quarterly (every 3 months) or annually\n• The amount is usually expressed as a per-share amount (e.g., $0.82 per share per quarter)\n• **Dividend yield** = Annual dividend ÷ Stock price (e.g., $3.28 annual dividend ÷ $175 stock price = 1.87% yield)\n\n**Examples of dividend-paying companies:**\n• Apple (AAPL) — ~0.5% yield\n• Coca-Cola (KO) — ~3% yield\n• Johnson & Johnson (JNJ) — ~2.7% yield\n• Procter & Gamble (PG) — ~2.5% yield\n\n**Why dividends matter:**\n• Provide regular income while you hold the stock\n• Can be reinvested to buy more shares (compound growth)\n• Companies with long dividend histories (\"Dividend Aristocrats\") are often stable and reliable\n\n**Not all stocks pay dividends.** Many growth companies (like Tesla or Amazon) reinvest all profits back into the business instead.\n\n⚠️ This is educational information, not financial advice.",

  'stock exchange': "A stock exchange is a marketplace where stocks (shares of companies) are bought and sold. Think of it like a big, organized marketplace — but for investments instead of physical goods.\n\n**Major US Stock Exchanges:**\n• **NYSE (New York Stock Exchange)** — The largest in the world by market cap. Located on Wall Street. Trades stocks like Coca-Cola, Disney, and Berkshire Hathaway.\n• **NASDAQ** — Known for technology companies. Home to Apple, Microsoft, Google, Amazon, and Tesla.\n\n**Major International Exchanges:**\n• **LSE (London Stock Exchange)** — Largest in Europe\n• **TSE (Tokyo Stock Exchange)** — Largest in Asia\n• **BSE/NSE (Mumbai)** — Major Indian exchanges\n\n**How they work:**\n1. Companies \"list\" on an exchange through an IPO (Initial Public Offering)\n2. Investors place buy/sell orders through brokers\n3. The exchange matches buyers with sellers\n4. Trades happen electronically in milliseconds\n\n**Trading hours (US):** Monday-Friday, 9:30 AM - 4:00 PM Eastern Time. Markets are closed on weekends and holidays.\n\n⚠️ This is educational information, not financial advice.",

  'volume': "Volume refers to the total number of shares traded during a specific time period (usually one day).\n\n**Why volume matters:**\n\n• **High volume** — Lots of trading activity. It confirms that a price move is significant. If a stock jumps 5% on high volume, the move is more likely to be sustained.\n\n• **Low volume** — Little trading activity. Price moves on low volume are less reliable and could reverse easily.\n\n**How to use volume:**\n• **Breakouts** — When a stock breaks above resistance with high volume, it's a strong bullish signal\n• **Volume spikes** — Sudden increases in volume often happen around earnings reports, news events, or major announcements\n• **Average volume** — Compare today's volume to the stock's average. Significantly above average = noteworthy event\n\n**Example:** If Apple normally trades 50 million shares daily but suddenly trades 150 million, something big is happening — check the news!\n\n⚠️ This is educational information, not financial advice.",

  'portfolio': "A portfolio is the collection of all your investments — stocks, bonds, ETFs, mutual funds, etc.\n\n**Building a good portfolio:**\n\n1. **Define your goals** — Are you saving for retirement (long-term), a house (medium-term), or quick gains (short-term)?\n\n2. **Assess your risk tolerance:**\n   • Conservative: More bonds, fewer stocks (less risk, lower returns)\n   • Moderate: Balanced mix of stocks and bonds\n   • Aggressive: Mostly stocks (higher risk, potentially higher returns)\n\n3. **Common portfolio allocations:**\n   • **Conservative (age 60+):** 30% stocks, 60% bonds, 10% cash\n   • **Balanced (age 35-59):** 60% stocks, 30% bonds, 10% other\n   • **Aggressive (age 18-34):** 80-90% stocks, 10-20% bonds\n\n4. **Rebalance regularly** — Check your portfolio every 6-12 months and adjust if one asset class has grown too large or too small.\n\n**A simple rule of thumb:** Subtract your age from 110 — that's roughly the percentage you should have in stocks. A 25-year-old might hold 85% stocks.\n\n⚠️ This is educational information, not financial advice.",

  'prediction': "StockAI uses an LSTM (Long Short-Term Memory) neural network to predict stock prices. Here's how it works:\n\n**The AI Process:**\n1. It fetches 2 years of historical price data for the stock\n2. The LSTM model learns patterns from this data (trends, seasonality, momentum)\n3. It generates a 30-day price forecast with confidence scores\n\n**Understanding the metrics:**\n• **RMSE** — How far off predictions are in dollar terms (lower = better)\n• **MAE** — Average prediction error (lower = better)\n• **R² Score** — How well the model explains price movement (closer to 1.0 = better)\n• **MAPE** — Prediction error as a percentage (lower = better)\n\n**Important limitations:**\n• AI predictions are based on historical patterns — they can't predict unexpected events (earnings surprises, breaking news, etc.)\n• The stock market is inherently unpredictable\n• These predictions are for educational purposes ONLY\n\nTo try it: Go to a stock's detail page and click \"Get AI Prediction\"!\n\n⚠️ This is educational information, not financial advice.",

  'risk management': "Risk management is the process of protecting your investments from major losses. It's one of the most important skills for any investor.\n\n**Key strategies:**\n\n1. **Diversification** — Spread investments across different stocks, sectors, and asset types. Never put more than 5-10% of your portfolio in a single stock.\n\n2. **Position sizing** — Decide how much money to put into each investment. A common rule: never risk more than 1-2% of your total portfolio on a single trade.\n\n3. **Stop-loss orders** — Set automatic sell orders to limit losses. Example: If you buy a stock at $100, set a stop-loss at $90 to limit your loss to 10%.\n\n4. **Dollar-cost averaging** — Invest a fixed amount regularly regardless of price. This prevents you from putting all your money in at the worst time.\n\n5. **Emergency fund first** — Before investing, keep 3-6 months of expenses in savings. Never invest money you might need soon.\n\n6. **Don't invest emotionally** — Fear and greed are your biggest enemies. Stick to your strategy even when the market is volatile.\n\n⚠️ This is educational information, not financial advice.",

  'ipo': "An IPO (Initial Public Offering) is when a private company sells shares to the public for the first time. It's how a company \"goes public.\"\n\n**How an IPO works:**\n1. A private company decides it wants to raise money by selling shares\n2. It hires investment banks (like Goldman Sachs or Morgan Stanley) to help\n3. They determine the IPO price based on the company's value\n4. Shares are sold to institutional investors first, then the general public\n5. The stock begins trading on an exchange (NYSE or NASDAQ)\n\n**Famous IPOs:**\n• Facebook (now Meta) — IPO'd at $38/share in 2012\n• Google (now Alphabet) — IPO'd at $85/share in 2004\n• Amazon — IPO'd at $18/share in 1997\n\n**Should you invest in IPOs?**\n• IPOs can be exciting but also risky\n• Prices are often volatile in the first few weeks/months\n• Many experts recommend waiting 3-6 months after an IPO before buying\n• The \"IPO pop\" (first-day price increase) doesn't guarantee long-term success\n\n⚠️ This is educational information, not financial advice.",

  'index': "A stock market index tracks the performance of a group of stocks to represent a section of the market.\n\n**Major US Indices:**\n\n• **S&P 500** — Tracks 500 of the largest US companies. Considered the best indicator of overall US market health. Average annual return: ~10%.\n\n• **Dow Jones Industrial Average (DJIA)** — Tracks 30 large, well-known companies like Apple, Microsoft, and Goldman Sachs. The oldest major US index.\n\n• **NASDAQ Composite** — Tracks all ~3,000 stocks listed on the NASDAQ exchange. Heavily weighted toward technology companies.\n\n• **Russell 2000** — Tracks 2,000 smaller US companies. A good indicator of how smaller businesses are performing.\n\n**How to invest in an index:**\nYou can't buy an index directly, but you can buy index funds or ETFs that track them:\n• SPY or VOO → tracks the S&P 500\n• QQQ → tracks the NASDAQ-100\n• IWM → tracks the Russell 2000\n\nIndex investing is one of the most popular and effective long-term strategies.\n\n⚠️ This is educational information, not financial advice.",

  'short selling': "Short selling is a strategy where you profit when a stock's price GOES DOWN. It's the opposite of normal buying.\n\n**How it works:**\n1. You borrow shares from your broker\n2. You sell those borrowed shares at the current price\n3. You wait for the price to drop\n4. You buy the shares back at the lower price\n5. You return the shares to your broker and keep the difference\n\n**Example:**\n• You short sell 100 shares of XYZ at $50 = you receive $5,000\n• Price drops to $40, you buy back 100 shares = you pay $4,000\n• Your profit = $1,000 (minus fees)\n\n**Risks of short selling:**\n• **Unlimited loss potential** — If the stock goes UP instead of down, your losses are theoretically infinite\n• **Short squeeze** — If many people are shorting and the price rises, shorts rush to buy back, pushing the price even higher (what happened with GameStop in 2021)\n• Not recommended for beginners\n\n💡 Consider your risk tolerance carefully before short selling. Consult a financial advisor for major decisions.",

  // ─── Financial Advice Topics ───

  'should i invest': "Great question! Here's how to think about whether you're ready to invest:\n\n**Before investing, make sure you have:**\n1. **An emergency fund** — 3-6 months of living expenses saved in a high-yield savings account\n2. **High-interest debt paid off** — Credit card debt (15-25% APR) should be eliminated first\n3. **Stable income** — You should only invest money you won't need for at least 3-5 years\n\n**When you're ready:**\n• Start with tax-advantaged accounts (401k, IRA) to maximize returns\n• If your employer matches 401k contributions, contribute at least enough to get the full match — it's free money\n• Begin with broad index funds (like VOO or VTI) for instant diversification\n• Start small — even $50/month builds wealth over time through compound growth\n\n**The best time to start investing is as early as possible.** Thanks to compound interest, $200/month starting at age 25 can grow to over $500,000 by age 65 (assuming ~8% average returns).\n\n💡 Individual circumstances vary — consider consulting a financial advisor for personalized guidance.",

  'retirement': "Planning for retirement is one of the most important financial decisions you'll make. Here's a practical guide:\n\n**Key retirement accounts:**\n• **401(k)** — Employer-sponsored, often with matching contributions. 2024 limit: $23,000 ($30,500 if 50+)\n• **Traditional IRA** — Tax-deductible contributions, taxed on withdrawal. Limit: $7,000/year ($8,000 if 50+)\n• **Roth IRA** — Contributions taxed now, but withdrawals in retirement are TAX-FREE. Same limits as Traditional IRA\n\n**How much do you need?**\n• A common rule: aim for 25x your annual expenses (the \"4% rule\")\n• If you spend $50,000/year, target $1.25 million\n• Start with saving 15-20% of your income if possible\n\n**Age-based strategy:**\n• **20s-30s:** Aggressive growth (80-90% stocks). Time is your biggest asset\n• **40s-50s:** Gradually shift to balanced (60-70% stocks, 30-40% bonds)\n• **60s+:** Conservative (40-50% stocks, 50-60% bonds/fixed income)\n\n**Key tip:** Start as early as possible. Compound growth means even small contributions in your 20s can outgrow larger contributions made in your 40s.\n\n💡 Consider consulting a financial planner for a personalized retirement strategy.",

  'budget': "Budgeting is the foundation of financial health. Here's a proven approach:\n\n**The 50/30/20 Rule:**\n• **50% Needs** — Rent/mortgage, utilities, groceries, insurance, minimum debt payments\n• **30% Wants** — Dining out, entertainment, subscriptions, shopping\n• **20% Savings & Investing** — Emergency fund, retirement accounts, brokerage accounts, extra debt payments\n\n**Steps to get started:**\n1. Track all income and expenses for one month\n2. Categorize spending into needs, wants, and savings\n3. Identify areas to cut back (subscriptions you don't use, dining out frequency)\n4. Automate savings — set up automatic transfers on payday\n5. Review and adjust monthly\n\n**Priority order for your 20%:**\n1. Emergency fund (3-6 months expenses)\n2. 401k match (if available — it's free money)\n3. Pay off high-interest debt (credit cards)\n4. Max out Roth IRA\n5. Additional investing in brokerage account\n\n💡 The best budget is one you can stick to. Start simple and adjust over time.",

  'tax investing': "Understanding tax-efficient investing can significantly boost your returns over time.\n\n**Tax-advantaged accounts (use these first):**\n• **401(k)/403(b)** — Pre-tax contributions reduce your taxable income today\n• **Roth IRA** — Pay taxes now, withdrawals are tax-free in retirement\n• **HSA (Health Savings Account)** — Triple tax advantage: tax-deductible, grows tax-free, tax-free withdrawals for medical expenses\n\n**Tax-efficient strategies:**\n• **Hold investments long-term** — Long-term capital gains (held 1+ year) are taxed at 0%, 15%, or 20% vs. short-term gains taxed as ordinary income\n• **Tax-loss harvesting** — Sell losing investments to offset gains and reduce your tax bill\n• **Asset location** — Put tax-inefficient investments (bonds, REITs) in tax-advantaged accounts; keep tax-efficient investments (index funds) in taxable accounts\n• **Qualified dividends** — Most US stock dividends are taxed at the lower capital gains rate\n\n**Common mistake:** Don't let taxes drive every investment decision. A good investment that's tax-inefficient is still better than a bad investment that's tax-efficient.\n\n💡 Tax situations vary widely — consider consulting a tax professional or financial advisor.",

  'emergency fund': "An emergency fund is your financial safety net — money set aside for unexpected expenses. It's the #1 financial priority before investing.\n\n**How much to save:**\n• **Minimum:** 3 months of essential expenses\n• **Recommended:** 6 months of essential expenses\n• **If self-employed/variable income:** 9-12 months\n\n**Where to keep it:**\n• **High-yield savings account (HYSA)** — Currently offering 4-5% APY at online banks\n• NOT in stocks — you need this money to be accessible and stable\n• NOT under your mattress — earn interest while it sits there\n\n**How to build it:**\n1. Calculate monthly essential expenses (rent, food, utilities, insurance)\n2. Set a target (e.g., 6 × $3,000 = $18,000)\n3. Automate transfers — even $100/paycheck adds up\n4. Use windfalls (tax refunds, bonuses) to accelerate\n\n**When to use it:**\n• Job loss or income reduction\n• Medical emergencies\n• Essential car/home repairs\n• NOT for vacations, shopping, or \"deals\"\n\n💡 Once your emergency fund is complete, redirect those savings into investments.",

  'debt': "Managing debt strategically is key to building wealth. Here's a practical approach:\n\n**Good debt vs. bad debt:**\n• **Good debt:** Low-interest debt that builds wealth (mortgage, student loans, business loans)\n• **Bad debt:** High-interest debt that drains wealth (credit cards, payday loans)\n\n**Two popular payoff strategies:**\n\n1. **Avalanche Method** (mathematically optimal)\n   • Pay minimums on all debts\n   • Put extra money toward the highest-interest debt first\n   • Saves the most money in interest\n\n2. **Snowball Method** (psychologically motivating)\n   • Pay minimums on all debts\n   • Put extra money toward the smallest balance first\n   • Quick wins keep you motivated\n\n**Should you invest or pay off debt?**\n• If debt interest rate > 7%: Pay it off first\n• If debt interest rate < 5%: Invest (likely to earn more)\n• In between: Do both — split extra money 50/50\n• ALWAYS get your 401k match regardless of debt\n\n💡 Debt management is personal — choose the strategy you'll stick with consistently.",

  'when to buy sell': "Knowing when to buy and sell stocks is one of the most important investing skills.\n\n**When to BUY:**\n• The company has strong fundamentals (growing revenue, solid earnings, competitive advantage)\n• The stock is reasonably valued (compare P/E to industry average)\n• You have a long-term thesis — you understand WHY this company will grow\n• During market dips — historically, buying during fear has rewarded patient investors\n• When you have money to invest regularly (dollar-cost averaging)\n\n**When to SELL:**\n• Your original investment thesis has changed (company fundamentals deteriorated)\n• The stock is significantly overvalued relative to earnings\n• You need to rebalance your portfolio (one position grew too large)\n• You need the money for a planned expense\n• For tax-loss harvesting (offsetting gains with losses)\n\n**When NOT to sell:**\n• Just because the market dropped — temporary dips are normal\n• Based on fear or panic from news headlines\n• To chase a \"hot\" stock or trend\n\n**A simple rule:** Buy businesses you understand, hold for the long term, and sell only when the story changes — not when the price changes.\n\n💡 For major portfolio decisions, consider discussing with a financial advisor.",

  'crypto': "Cryptocurrency is a digital asset class that has become part of the broader investment landscape.\n\n**Key cryptocurrencies:**\n• **Bitcoin (BTC)** — The original cryptocurrency, often called \"digital gold.\" Limited supply of 21 million coins\n• **Ethereum (ETH)** — A programmable blockchain used for smart contracts and decentralized apps\n• **Stablecoins (USDC, USDT)** — Pegged to the US dollar, used for trading and earning yield\n\n**How to invest in crypto:**\n• **Direct purchase** — Buy on exchanges like Coinbase, Kraken, or Binance\n• **Bitcoin ETFs** — IBIT, FBTC, and others now trade on regular stock exchanges\n• **Crypto-related stocks** — Coinbase (COIN), MicroStrategy (MSTR), mining companies\n\n**Risk considerations:**\n• Extremely volatile — 50-80% drops have happened multiple times\n• Regulatory uncertainty in many countries\n• No intrinsic earnings (unlike stocks)\n• Consider limiting crypto to 5-10% of your total portfolio\n\n**Best practices:**\n• Only invest what you can afford to lose completely\n• Use dollar-cost averaging rather than lump-sum buying\n• Store long-term holdings in a hardware wallet\n• Understand the tax implications — crypto gains are taxable\n\n💡 Crypto is speculative. Ensure your core financial foundation (emergency fund, retirement accounts) is solid before allocating to crypto.",
};

/**
 * Match a user message to a fallback response using keyword matching.
 * Returns the best matching response or a default message.
 */
const getFallbackResponse = (message) => {
  const msg = message.toLowerCase().trim();

  // Check if the question is completely unrelated to finance
  const nonFinanceKeywords = [
    'weather forecast', 'recipe', 'cook dinner', 'football score', 'soccer match',
    'basketball game', 'movie review', 'song lyrics', 'travel itinerary',
    'poem', 'bedtime story', 'coding tutorial', 'programming language',
    'homework help', 'relationship advice', 'dating tips',
  ];

  if (nonFinanceKeywords.some((kw) => msg.includes(kw))) {
    return 'I specialize in stocks and financial advice. Feel free to ask me anything about investing, personal finance, market analysis, or financial planning!';
  }

  // Keyword matching for stock topics
  const matchRules = [
    { keywords: ['what is a stock', 'what are stocks', 'explain stock', 'define stock'], key: 'what is a stock' },
    { keywords: ['start investing', 'begin investing', 'how to invest', 'new to investing', 'beginner invest'], key: 'how to start investing' },
    { keywords: ['p/e ratio', 'pe ratio', 'price to earnings', 'price-to-earnings', 'p/e'], key: 'p/e ratio' },
    { keywords: ['etf', 'exchange traded fund', 'exchange-traded fund', 'what is etf', 'how do etf'], key: 'etf' },
    { keywords: ['bull market', 'bear market', 'bull vs bear', 'bull and bear', 'bullish', 'bearish'], key: 'bull bear market' },
    { keywords: ['market cap', 'market capitalization', 'company value', 'company worth'], key: 'market cap' },
    { keywords: ['what affects', 'what moves', 'why do stock', 'price movement', 'stock price change', 'why stock go'], key: 'what affects stock prices' },
    { keywords: ['technical analysis', 'chart analysis', 'moving average', 'rsi', 'support resistance', 'candlestick'], key: 'technical analysis' },
    { keywords: ['diversif', 'diversify', 'spread investment', 'asset allocation', 'don\'t put all'], key: 'diversification' },
    { keywords: ['dividend', 'dividend yield', 'dividend pay'], key: 'dividend' },
    { keywords: ['stock exchange', 'nyse', 'nasdaq', 'what is exchange', 'where are stocks traded'], key: 'stock exchange' },
    { keywords: ['volume', 'trading volume', 'shares traded'], key: 'volume' },
    { keywords: ['portfolio', 'my investments', 'build portfolio', 'portfolio allocation'], key: 'portfolio' },
    { keywords: ['prediction', 'ai predict', 'lstm', 'forecast', 'stock prediction', 'price prediction'], key: 'prediction' },
    { keywords: ['risk', 'risk management', 'stop loss', 'protect investment', 'limit losses'], key: 'risk management' },
    { keywords: ['ipo', 'initial public offering', 'go public', 'going public', 'new listing'], key: 'ipo' },
    { keywords: ['index', 'indices', 's&p 500', 'sp500', 'dow jones', 'djia', 'nasdaq composite', 'russell'], key: 'index' },
    { keywords: ['short sell', 'shorting', 'short squeeze', 'gamestop'], key: 'short selling' },
    // Financial advice topics
    { keywords: ['should i invest', 'ready to invest', 'when to invest', 'is it good time to invest', 'start investing money'], key: 'should i invest' },
    { keywords: ['retirement', 'retire', '401k', '401(k)', 'ira', 'roth', 'pension', 'retirement plan'], key: 'retirement' },
    { keywords: ['budget', 'budgeting', 'save money', 'saving money', '50/30/20', 'monthly expenses', 'spending plan'], key: 'budget' },
    { keywords: ['tax', 'capital gains tax', 'tax-loss', 'tax efficient', 'tax advantage', 'hsa'], key: 'tax investing' },
    { keywords: ['emergency fund', 'rainy day', 'savings account', 'financial safety'], key: 'emergency fund' },
    { keywords: ['debt', 'credit card', 'loan', 'pay off', 'avalanche', 'snowball', 'interest rate debt'], key: 'debt' },
    { keywords: ['when to buy', 'when to sell', 'buy or sell', 'time to buy', 'time to sell', 'should i buy', 'should i sell'], key: 'when to buy sell' },
    { keywords: ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'cryptocurrency', 'digital currency'], key: 'crypto' },
  ];

  for (const rule of matchRules) {
    if (rule.keywords.some((kw) => msg.includes(kw))) {
      return FALLBACK_RESPONSES[rule.key];
    }
  }

  // Generic default
  return "Great question! Here are the topics I can help you with:\n\n**Stock Market:**\n• Stock basics, exchanges, what affects prices\n• Key metrics — P/E ratio, market cap, volume, dividends\n• Technical analysis, chart patterns, indicators\n• AI price predictions using our LSTM model\n\n**Financial Advice:**\n• When to buy or sell stocks\n• Portfolio building and asset allocation\n• Retirement planning (401k, IRA, Roth)\n• Budgeting and saving strategies\n• Debt management and payoff strategies\n• Tax-efficient investing\n• Cryptocurrency basics\n\nTry asking something like:\n- \"Should I invest in index funds?\"\n- \"How do I plan for retirement?\"\n- \"When should I buy or sell a stock?\"\n- \"How should I budget my income?\"\n- \"What is a P/E ratio?\"\n\n💡 I provide personalized financial guidance — for major decisions, also consider consulting a professional advisor.";
};

/**
 * POST /api/chat
 * Send a message to the stock market AI assistant.
 * Uses OpenAI when available, falls back to built-in knowledge base.
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

    // Try OpenAI first
    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.slice(-10),
        { role: 'user', content: message.trim() },
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0].message.content;

      return res.status(200).json({
        success: true,
        response: aiResponse,
      });
    } catch (aiError) {
      console.warn('[Chat] OpenAI unavailable, using fallback:', aiError.message);
      // Fall through to fallback
    }

    // Fallback: use built-in knowledge base
    const fallbackResponse = getFallbackResponse(message.trim());

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
