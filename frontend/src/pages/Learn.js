import React, { useState, useMemo } from 'react';
import {
  FiBookOpen,
  FiBarChart2,
  FiTrendingUp,
  FiCpu,
  FiStar,
  FiShoppingCart,
  FiZap,
  FiSun,
  FiTarget,
  FiCheckCircle,
  FiPercent,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiBook,
  FiLayout,
  FiSliders,
  FiInfo,
} from 'react-icons/fi';

/* ─── keyframes ─── */
const learnKeyframes = `
@keyframes learnFadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes learnPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.25); }
  50%      { box-shadow: 0 0 0 8px rgba(74,222,128,0); }
}
`;

/* ─── data ─── */
const platformGuides = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: FiBarChart2,
    tagline: 'Your command center for the stock market',
    bullets: [
      "The Dashboard is the first thing you see when you open StockAI. Think of it as your stock market control room.",
      "At the top, you'll see Market Index Cards showing how the overall market is doing \u2014 S&P 500, NASDAQ, and DOW JONES. Green means the market is up, red means it's down.",
      "Below that, you'll see a Quick Access panel on the left with popular stocks and their current prices, a main chart showing price movements, and Top Gainers/Losers on the right.",
      "The stock table at the bottom shows all available stocks with their prices, changes, and volume.",
    ],
  },
  {
    id: 'stock-detail',
    title: 'Stock Detail Page',
    icon: FiTrendingUp,
    tagline: 'Deep dive into any stock',
    bullets: [
      "Click on any stock name to see its detailed page. Here you'll find everything about that specific stock.",
      "The interactive chart shows how the stock price has moved over time. Use the time buttons (1W, 1M, 3M, 6M, 1Y) to see different periods.",
      "The stats grid shows key numbers: Open (today's starting price), High (highest price today), Low (lowest today), Volume (how many shares were traded), and Market Cap (total company value).",
    ],
  },
  {
    id: 'ai-predictions',
    title: 'AI Predictions',
    icon: FiCpu,
    tagline: 'Let AI forecast stock prices',
    bullets: [
      "Our AI Prediction feature uses a technology called LSTM (Long Short-Term Memory) \u2014 a type of artificial intelligence that learns patterns from past stock prices to predict future movements.",
      "To use it: Go to the Predictions page, type a stock symbol (like AAPL for Apple), and click 'Generate Prediction'. The AI will analyze historical data and show you a 30-day price forecast.",
      "The chart shows two lines: the green line is actual past prices, and the gold/yellow line is the AI's prediction. Where they overlap, you can see how accurate the model is.",
      "Important: AI predictions are NOT financial advice. They're educational tools to understand market trends.",
    ],
  },
  {
    id: 'watchlist',
    title: 'Watchlist',
    icon: FiStar,
    tagline: 'Track your favorite stocks',
    bullets: [
      "Your Watchlist is like a favorites list for stocks. Instead of searching for the same stocks every day, add them to your watchlist for quick access.",
      "To add a stock: Click the \u2606 Watch button on the Dashboard or Stock Detail page. To remove: Click the trash icon on the Watchlist page.",
      "Stock prices in your watchlist update in real-time, so you always know what's happening.",
    ],
  },
  {
    id: 'buy-sell',
    title: 'Buy & Sell (Paper Trading)',
    icon: FiShoppingCart,
    tagline: 'Practice trading without real money',
    bullets: [
      "StockAI gives you $10,000 in virtual money to practice trading \u2014 this is called Paper Trading. You can buy and sell stocks without risking real money!",
      "To Buy: Click the green 'Buy' button on any stock page, choose how many shares you want, and confirm. The cost will be deducted from your virtual balance.",
      "To Sell: Click the red 'Sell' button. You can only sell shares you already own. The proceeds get added back to your balance.",
      "Track all your trades in the History page. Your portfolio value changes as stock prices move \u2014 just like real trading!",
    ],
  },
  {
    id: 'discover',
    title: 'Discover / Recommendations',
    icon: FiZap,
    tagline: 'Find new investment opportunities',
    bullets: [
      "The Discover page shows you stock recommendations based on market performance.",
      "Stocks are categorized as Top Gainers (stocks going up the most), Top Losers (stocks going down), Most Active (highest trading volume), and Best Value (stable, reliable stocks).",
      "Each stock card shows an AI recommendation (Strong Buy, Buy, Hold, or Sell) with a confidence score.",
    ],
  },
  {
    id: 'dark-light',
    title: 'Dark/Light Mode',
    icon: FiSun,
    tagline: 'Customize your viewing experience',
    bullets: [
      "Click the sun/moon icon in the top-right corner of the navigation bar to switch between Dark Mode and Light Mode.",
      "Dark Mode is easier on the eyes, especially at night. Light Mode is better for daytime use.",
      "Your preference is saved automatically \u2014 the app will remember your choice next time you visit.",
    ],
  },
];

const aiMetrics = [
  {
    id: 'rmse',
    title: 'RMSE \u2014 Root Mean Square Error',
    icon: FiTarget,
    color: '#4ADE80',
    tagline: 'How far off are predictions on average?',
    explanation:
      "Imagine you're trying to predict tomorrow's temperature. If you predict 72\u00b0F and the actual temperature is 75\u00b0F, you're off by 3\u00b0F. RMSE calculates this kind of error across ALL predictions and gives you one number.",
    example:
      "If RMSE = 2.5 for a stock priced at $150, it means the AI's predictions are typically off by about $2.50. Lower RMSE = More Accurate.",
    scale: 'Great: < 2  |  Good: 2\u20135  |  Fair: 5\u201310  |  Needs Improvement: > 10',
  },
  {
    id: 'mae',
    title: 'MAE \u2014 Mean Absolute Error',
    icon: FiSliders,
    color: '#FBBF24',
    tagline: 'The simple average mistake',
    explanation:
      "MAE is the simplest error metric. It just takes all the prediction mistakes, ignores whether they're too high or too low, and averages them out. Unlike RMSE, it doesn't punish big mistakes more than small ones.",
    example:
      "If the AI predicted $100, $105, $98 and actual prices were $102, $103, $100 \u2192 Errors: $2, $2, $2 \u2192 MAE = $2.00. The predictions are off by $2 on average.",
    extra:
      'MAE vs RMSE: If MAE \u2248 RMSE, predictions are consistently close. If RMSE >> MAE, there are some big misses mixed with good predictions.',
  },
  {
    id: 'r2',
    title: 'R\u00b2 Score \u2014 R-Squared',
    icon: FiCheckCircle,
    color: '#22C55E',
    tagline: 'How much of the price movement does the AI understand?',
    explanation:
      "R\u00b2 Score is like a grade for the AI model, from 0 to 1 (or 0% to 100%). An R\u00b2 of 0.90 means the AI understands 90% of why the stock price moves the way it does.",
    example:
      "R\u00b2 = 0.92 means the AI captures 92% of price patterns. Think of it like a weather forecast that's right 92% of the time \u2014 pretty reliable!",
    scale: 'Excellent: > 0.90  |  Good: 0.80\u20130.90  |  Fair: 0.70\u20130.80  |  Poor: < 0.70',
  },
  {
    id: 'mape',
    title: 'MAPE \u2014 Mean Absolute Percentage Error',
    icon: FiPercent,
    color: '#8B5CF6',
    tagline: 'How far off in percentage terms?',
    explanation:
      "MAPE converts errors into percentages, which makes it easy to understand regardless of stock price. A 5% MAPE means predictions are typically 5% away from the actual price.",
    example:
      "A stock trades at $200. MAPE = 3% means predictions are usually within $6 of the real price (3% of $200 = $6). This works the same whether the stock is $50 or $500.",
    scale: 'Excellent: < 2%  |  Good: 2\u20135%  |  Fair: 5\u201310%  |  Poor: > 10%',
  },
];

const stockBasics = [
  {
    id: 'what-is-stock',
    title: 'What is a Stock?',
    body: "A stock is a small piece of ownership in a company. When you buy Apple stock, you own a tiny part of Apple!",
  },
  {
    id: 'stock-exchange',
    title: 'What is a Stock Exchange?',
    body: "It's like a marketplace where stocks are bought and sold. The two biggest in the US are NYSE and NASDAQ.",
  },
  {
    id: 'price-movement',
    title: 'What Makes Stock Prices Move?',
    body: "Supply and demand! If more people want to buy a stock than sell it, the price goes up. Company news, earnings, and economic events also affect prices.",
  },
  {
    id: 'market-cap',
    title: 'What is Market Cap?',
    body: "Market Cap = Stock Price \u00d7 Total Shares. It tells you the total value of a company. Apple's market cap is ~$3 trillion!",
  },
  {
    id: 'bull-bear',
    title: 'Bull vs Bear Market',
    body: "Bull Market = prices are rising, investors are optimistic \ud83d\udcc8. Bear Market = prices are falling, investors are cautious \ud83d\udcc9.",
  },
  {
    id: 'volume',
    title: 'What is Volume?',
    body: "Volume is how many shares of a stock were traded in a day. High volume = lots of activity. Low volume = quiet day.",
  },
];

/* ─── helper: checks if search query matches item text ─── */
const matchesSearch = (query, ...texts) => {
  if (!query) return true;
  const q = query.toLowerCase();
  return texts.some((t) => t && t.toLowerCase().includes(q));
};

/* ─── component ─── */
const Learn = () => {
  const [search, setSearch] = useState('');
  const [expandedIds, setExpandedIds] = useState({});

  const toggle = (id) =>
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));

  /* filtered data */
  const filteredGuides = useMemo(
    () =>
      platformGuides.filter((g) =>
        matchesSearch(search, g.title, g.tagline, ...g.bullets)
      ),
    [search]
  );
  const filteredMetrics = useMemo(
    () =>
      aiMetrics.filter((m) =>
        matchesSearch(
          search,
          m.title,
          m.tagline,
          m.explanation,
          m.example,
          m.extra || '',
          m.scale || ''
        )
      ),
    [search]
  );
  const filteredBasics = useMemo(
    () =>
      stockBasics.filter((b) => matchesSearch(search, b.title, b.body)),
    [search]
  );

  /* ─── styles ─── */
  const s = {
    page: {
      minHeight: '100vh',
      padding: '32px 24px 64px',
      maxWidth: 960,
      margin: '0 auto',
      animation: 'learnFadeIn .5s ease',
    },
    headerWrap: {
      textAlign: 'center',
      marginBottom: 36,
    },
    headerIcon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 56,
      height: 56,
      borderRadius: 16,
      background: 'rgba(74,222,128,0.12)',
      color: 'var(--accent, #4ADE80)',
      fontSize: 28,
      marginBottom: 14,
    },
    h1: {
      fontSize: 32,
      fontWeight: 800,
      color: 'var(--text-primary)',
      margin: '0 0 6px',
      letterSpacing: '-0.5px',
    },
    subtitle: {
      fontSize: 15,
      color: 'var(--text-muted)',
      margin: 0,
      lineHeight: 1.5,
    },
    searchWrap: {
      position: 'relative',
      maxWidth: 520,
      margin: '24px auto 0',
    },
    searchIcon: {
      position: 'absolute',
      left: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--text-muted)',
      fontSize: 18,
      pointerEvents: 'none',
    },
    searchInput: {
      width: '100%',
      padding: '13px 18px 13px 46px',
      borderRadius: 14,
      border: '1px solid var(--border-color)',
      background: 'var(--bg-input)',
      color: 'var(--text-primary)',
      fontSize: 15,
      outline: 'none',
      transition: 'border-color .2s, box-shadow .2s',
      boxSizing: 'border-box',
    },

    /* section */
    sectionWrap: {
      marginBottom: 48,
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 8,
    },
    sectionIcon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 38,
      height: 38,
      borderRadius: 10,
      background: 'rgba(74,222,128,0.10)',
      color: 'var(--accent, #4ADE80)',
      fontSize: 18,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 700,
      color: 'var(--text-primary)',
      margin: 0,
    },
    sectionCount: {
      fontSize: 13,
      color: 'var(--text-muted)',
      background: 'var(--bg-input)',
      borderRadius: 20,
      padding: '3px 12px',
      marginLeft: 4,
      fontWeight: 600,
    },
    sectionIntro: {
      fontSize: 14,
      color: 'var(--text-secondary)',
      margin: '6px 0 20px',
      lineHeight: 1.6,
    },

    /* accordion card */
    accordionCard: {
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 14,
      marginBottom: 10,
      overflow: 'hidden',
      transition: 'border-color .25s, box-shadow .25s',
    },
    accordionCardHover: {
      borderColor: 'rgba(74,222,128,0.35)',
      boxShadow: 'var(--shadow-glow, 0 0 20px rgba(74,222,128,0.08))',
    },
    accordionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '16px 20px',
      cursor: 'pointer',
      userSelect: 'none',
      background: 'transparent',
      border: 'none',
      width: '100%',
      textAlign: 'left',
      color: 'inherit',
      fontSize: 'inherit',
    },
    accordionIconWrap: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
      borderRadius: 10,
      background: 'rgba(74,222,128,0.10)',
      color: 'var(--accent, #4ADE80)',
      fontSize: 19,
      flexShrink: 0,
    },
    accordionTitle: {
      fontSize: 16,
      fontWeight: 650,
      color: 'var(--text-primary)',
      margin: 0,
    },
    accordionTagline: {
      fontSize: 13,
      color: 'var(--text-muted)',
      margin: '2px 0 0',
    },
    accordionChevron: {
      marginLeft: 'auto',
      color: 'var(--text-muted)',
      fontSize: 20,
      flexShrink: 0,
      transition: 'transform .3s ease',
    },
    accordionBody: (open) => ({
      maxHeight: open ? 600 : 0,
      opacity: open ? 1 : 0,
      overflow: 'hidden',
      transition: 'max-height .4s ease, opacity .35s ease, padding .35s ease',
      padding: open ? '0 20px 18px 74px' : '0 20px 0 74px',
    }),
    bullet: {
      position: 'relative',
      paddingLeft: 18,
      fontSize: 14,
      color: 'var(--text-secondary)',
      lineHeight: 1.7,
      margin: '0 0 8px',
    },
    bulletDot: {
      position: 'absolute',
      left: 0,
      top: 9,
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--accent, #4ADE80)',
      opacity: 0.7,
    },

    /* metric cards */
    metricCard: (color) => ({
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderLeft: `4px solid ${color}`,
      borderRadius: 14,
      padding: '24px 24px 20px',
      marginBottom: 16,
      transition: 'border-color .25s, box-shadow .25s, transform .2s',
    }),
    metricCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow-glow, 0 0 20px rgba(74,222,128,0.08))',
    },
    metricHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginBottom: 6,
    },
    metricIconWrap: (color) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 42,
      height: 42,
      borderRadius: 11,
      background: `${color}18`,
      color: color,
      fontSize: 20,
      flexShrink: 0,
    }),
    metricTitle: {
      fontSize: 17,
      fontWeight: 700,
      color: 'var(--text-primary)',
      margin: 0,
    },
    metricTagline: {
      fontSize: 13,
      color: 'var(--text-muted)',
      fontStyle: 'italic',
      margin: '0 0 12px',
      paddingLeft: 56,
    },
    metricExplanation: {
      fontSize: 14,
      color: 'var(--text-secondary)',
      lineHeight: 1.7,
      margin: '0 0 14px',
    },
    metricExampleBox: (color) => ({
      background: `${color}12`,
      border: `1px solid ${color}30`,
      borderRadius: 10,
      padding: '14px 16px',
      fontSize: 13,
      color: 'var(--text-primary)',
      lineHeight: 1.65,
      marginBottom: 12,
    }),
    metricExampleLabel: (color) => ({
      fontSize: 11,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.6px',
      color: color,
      marginBottom: 4,
    }),
    metricScale: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      fontSize: 12,
      color: 'var(--text-muted)',
      padding: '10px 14px',
      background: 'var(--bg-input)',
      borderRadius: 8,
      fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
    },
    metricExtra: {
      fontSize: 13,
      color: 'var(--text-muted)',
      fontStyle: 'italic',
      margin: '0 0 4px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
    },

    /* basics grid */
    basicsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 16,
    },
    basicCard: {
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 14,
      padding: '22px 22px 20px',
      transition: 'border-color .25s, box-shadow .25s, transform .2s',
    },
    basicCardHover: {
      borderColor: 'rgba(74,222,128,0.35)',
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow-glow, 0 0 20px rgba(74,222,128,0.08))',
    },
    basicTitle: {
      fontSize: 15,
      fontWeight: 700,
      color: 'var(--text-primary)',
      margin: '0 0 8px',
    },
    basicBody: {
      fontSize: 14,
      color: 'var(--text-secondary)',
      lineHeight: 1.65,
      margin: 0,
    },

    /* empty state */
    emptyState: {
      textAlign: 'center',
      padding: '48px 20px',
      color: 'var(--text-muted)',
    },
    emptyIcon: {
      fontSize: 40,
      marginBottom: 12,
      opacity: 0.5,
    },
  };

  /* track hover states */
  const [hoveredCard, setHoveredCard] = useState(null);

  const noResults =
    search &&
    filteredGuides.length === 0 &&
    filteredMetrics.length === 0 &&
    filteredBasics.length === 0;

  return (
    <>
      <style>{learnKeyframes}</style>
      <div style={s.page}>
        {/* ─── header ─── */}
        <div style={s.headerWrap}>
          <div style={s.headerIcon}>
            <FiBookOpen />
          </div>
          <h1 style={s.h1}>Learning Center</h1>
          <p style={s.subtitle}>
            Everything you need to know about StockAI and stock market basics
          </p>

          {/* search */}
          <div style={s.searchWrap}>
            <FiSearch style={s.searchIcon} />
            <input
              type="text"
              placeholder="Search topics... (e.g. watchlist, RMSE, volume)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={s.searchInput}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent, #4ADE80)';
                e.target.style.boxShadow = '0 0 0 3px rgba(74,222,128,0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* ─── empty state ─── */}
        {noResults && (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>
              <FiSearch />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 4px' }}>
              No results for "{search}"
            </p>
            <p style={{ fontSize: 14, margin: 0 }}>
              Try different keywords or clear your search
            </p>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            SECTION 1: Platform Guide
        ═══════════════════════════════════════════════ */}
        {filteredGuides.length > 0 && (
          <div style={s.sectionWrap}>
            <div style={s.sectionHeader}>
              <div style={s.sectionIcon}>
                <FiLayout />
              </div>
              <h2 style={s.sectionTitle}>How to Use StockAI</h2>
              <span style={s.sectionCount}>{filteredGuides.length}</span>
            </div>
            <p style={s.sectionIntro}>
              Step-by-step guides for every feature in the platform. Click any
              card to expand it.
            </p>

            {filteredGuides.map((guide) => {
              const Icon = guide.icon;
              const open = !!expandedIds[guide.id];
              const hovered = hoveredCard === guide.id;
              return (
                <div
                  key={guide.id}
                  style={{
                    ...s.accordionCard,
                    ...(hovered ? s.accordionCardHover : {}),
                  }}
                  onMouseEnter={() => setHoveredCard(guide.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <button
                    style={s.accordionHeader}
                    onClick={() => toggle(guide.id)}
                    aria-expanded={open}
                  >
                    <div style={s.accordionIconWrap}>
                      <Icon />
                    </div>
                    <div>
                      <p style={s.accordionTitle}>{guide.title}</p>
                      <p style={s.accordionTagline}>{guide.tagline}</p>
                    </div>
                    <span
                      style={{
                        ...s.accordionChevron,
                        transform: open ? 'rotate(180deg)' : 'rotate(0)',
                      }}
                    >
                      <FiChevronDown />
                    </span>
                  </button>

                  <div style={s.accordionBody(open)}>
                    {guide.bullets.map((b, i) => (
                      <p key={i} style={s.bullet}>
                        <span style={s.bulletDot} />
                        {b}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            SECTION 2: AI Metrics
        ═══════════════════════════════════════════════ */}
        {filteredMetrics.length > 0 && (
          <div style={s.sectionWrap}>
            <div style={s.sectionHeader}>
              <div style={s.sectionIcon}>
                <FiTarget />
              </div>
              <h2 style={s.sectionTitle}>What Do These Numbers Mean?</h2>
              <span style={s.sectionCount}>{filteredMetrics.length}</span>
            </div>
            <p style={s.sectionIntro}>
              When you generate an AI prediction, you'll see some metrics that
              measure how accurate the model is. Here's what each one means in
              plain English:
            </p>

            {filteredMetrics.map((metric) => {
              const Icon = metric.icon;
              const hovered = hoveredCard === `metric-${metric.id}`;
              return (
                <div
                  key={metric.id}
                  style={{
                    ...s.metricCard(metric.color),
                    ...(hovered ? s.metricCardHover : {}),
                  }}
                  onMouseEnter={() => setHoveredCard(`metric-${metric.id}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={s.metricHeader}>
                    <div style={s.metricIconWrap(metric.color)}>
                      <Icon />
                    </div>
                    <h3 style={s.metricTitle}>{metric.title}</h3>
                  </div>

                  <p style={s.metricTagline}>{metric.tagline}</p>

                  <p style={s.metricExplanation}>{metric.explanation}</p>

                  {/* example box */}
                  <div style={s.metricExampleBox(metric.color)}>
                    <p style={s.metricExampleLabel(metric.color)}>
                      Example
                    </p>
                    {metric.example}
                  </div>

                  {/* extra note (MAE only) */}
                  {metric.extra && (
                    <p style={s.metricExtra}>
                      <FiInfo
                        style={{
                          fontSize: 15,
                          color: metric.color,
                          marginTop: 2,
                          flexShrink: 0,
                        }}
                      />
                      {metric.extra}
                    </p>
                  )}

                  {/* scale */}
                  {metric.scale && (
                    <div style={s.metricScale}>{metric.scale}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            SECTION 3: Stock Market Basics
        ═══════════════════════════════════════════════ */}
        {filteredBasics.length > 0 && (
          <div style={s.sectionWrap}>
            <div style={s.sectionHeader}>
              <div style={s.sectionIcon}>
                <FiBook />
              </div>
              <h2 style={s.sectionTitle}>Stock Market 101</h2>
              <span style={s.sectionCount}>{filteredBasics.length}</span>
            </div>
            <p style={s.sectionIntro}>
              New to the stock market? These quick explanations will get you up
              to speed in minutes.
            </p>

            <div style={s.basicsGrid}>
              {filteredBasics.map((item) => {
                const hovered = hoveredCard === `basic-${item.id}`;
                return (
                  <div
                    key={item.id}
                    style={{
                      ...s.basicCard,
                      ...(hovered ? s.basicCardHover : {}),
                    }}
                    onMouseEnter={() => setHoveredCard(`basic-${item.id}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <h4 style={s.basicTitle}>{item.title}</h4>
                    <p style={s.basicBody}>{item.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* footer note */}
        <div
          style={{
            textAlign: 'center',
            padding: '20px 0 0',
            borderTop: '1px solid var(--border-color)',
            marginTop: 16,
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            StockAI is an educational platform using simulated data.
            <br />
            Nothing on this platform constitutes financial advice.
          </p>
        </div>
      </div>
    </>
  );
};

export default Learn;
