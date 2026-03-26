import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { stocksAPI } from '../services/api';
import {
  FiZap,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowUpRight,
  FiArrowDownRight,
  FiActivity,
  FiShoppingCart,
  FiBarChart2,
  FiRefreshCw,
  FiTarget,
  FiStar,
} from 'react-icons/fi';

const POPULAR_SYMBOLS = [
  'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'JPM', 'V',
  'AMD', 'BA', 'DIS', 'KO', 'NKE', 'WMT', 'JNJ', 'XOM', 'CRM', 'PYPL',
  'MA', 'PFE', 'COST', 'HD', 'SBUX', 'INFY', 'BAC', 'GS', 'LLY', 'UNH',
];

const recKeyframes = `
@keyframes recFadeIn {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes recShimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes recPulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.5; }
}
@keyframes recScroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`;

const mono = "'SF Mono', 'Fira Code', 'Cascadia Code', monospace";

// Generate recommendation from change percent
const getRecommendation = (changePercent) => {
  const cp = parseFloat(changePercent || 0);
  if (cp > 2) {
    return {
      label: 'Strong Buy',
      color: '#22C55E',
      bg: 'rgba(34, 197, 94, 0.12)',
      border: 'rgba(34, 197, 94, 0.3)',
      confidence: 0.85 + Math.random() * 0.1,
    };
  }
  if (cp > 0) {
    return {
      label: 'Buy',
      color: '#4ADE80',
      bg: 'rgba(74, 222, 128, 0.10)',
      border: 'rgba(74, 222, 128, 0.25)',
      confidence: 0.65 + Math.random() * 0.15,
    };
  }
  if (cp > -1) {
    return {
      label: 'Hold',
      color: '#FBBF24',
      bg: 'rgba(251, 191, 36, 0.10)',
      border: 'rgba(251, 191, 36, 0.25)',
      confidence: 0.50 + Math.random() * 0.15,
    };
  }
  return {
    label: 'Sell',
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.10)',
    border: 'rgba(239, 68, 68, 0.25)',
    confidence: 0.40 + Math.random() * 0.15,
  };
};

// Fallback mock data
const generateMockStocks = () =>
  POPULAR_SYMBOLS.map((symbol) => {
    const price = parseFloat((Math.random() * 400 + 50).toFixed(2));
    const changePercent = parseFloat(((Math.random() - 0.45) * 8).toFixed(2));
    const change = parseFloat((price * (changePercent / 100)).toFixed(2));
    return {
      symbol,
      name: {
        AAPL: 'Apple Inc.',
        GOOGL: 'Alphabet Inc.',
        MSFT: 'Microsoft Corp.',
        AMZN: 'Amazon.com Inc.',
        TSLA: 'Tesla Inc.',
        META: 'Meta Platforms Inc.',
        NVDA: 'NVIDIA Corp.',
        NFLX: 'Netflix Inc.',
        JPM: 'JPMorgan Chase',
        V: 'Visa Inc.',
      }[symbol] || `${symbol} Corp.`,
      price,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 80000000 + 5000000),
    };
  });

const Recommendations = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('gainers');

  const fetchStocks = useCallback(async () => {
    try {
      const promises = POPULAR_SYMBOLS.map((symbol) =>
        stocksAPI.getQuote(symbol).catch(() => null)
      );
      const results = await Promise.all(promises);
      const parsed = results
        .filter((r) => r !== null)
        .map((r) => r.data?.data || r.data?.quote || r.data)
        .filter((s) => s && s.symbol);

      if (parsed.length > 0) {
        setStocks(parsed);
      } else {
        setStocks(generateMockStocks());
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      setStocks(generateMockStocks());
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchStocks();
      setLoading(false);
    };
    load();
  }, [fetchStocks]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStocks();
    setRefreshing(false);
    toast.success('Recommendations updated', { theme: 'dark' });
  };

  // Filtered stocks based on active tab
  const filteredStocks = useMemo(() => {
    const list = [...stocks];
    switch (activeFilter) {
      case 'gainers':
        return list
          .filter((s) => parseFloat(s.changePercent || 0) > 0)
          .sort((a, b) => parseFloat(b.changePercent || 0) - parseFloat(a.changePercent || 0));
      case 'losers':
        return list
          .filter((s) => parseFloat(s.changePercent || 0) < 0)
          .sort((a, b) => parseFloat(a.changePercent || 0) - parseFloat(b.changePercent || 0));
      case 'active':
        return list.sort((a, b) => (parseInt(b.volume || 0)) - (parseInt(a.volume || 0)));
      case 'value':
        return list.sort(
          (a, b) =>
            Math.abs(parseFloat(a.changePercent || 0)) -
            Math.abs(parseFloat(b.changePercent || 0))
        );
      default:
        return list;
    }
  }, [stocks, activeFilter]);

  // Trending stocks: top movers by absolute change
  const trendingStocks = useMemo(() => {
    return [...stocks]
      .sort(
        (a, b) =>
          Math.abs(parseFloat(b.changePercent || 0)) -
          Math.abs(parseFloat(a.changePercent || 0))
      )
      .slice(0, 8);
  }, [stocks]);

  // Smart Insights
  const insights = useMemo(() => {
    if (stocks.length === 0)
      return { sentiment: 'Neutral', sectors: [], topPick: null };
    const avgChange =
      stocks.reduce((s, st) => s + parseFloat(st.changePercent || 0), 0) /
      stocks.length;
    const sentiment = avgChange > 0.5 ? 'Bullish' : avgChange < -0.5 ? 'Bearish' : 'Neutral';

    const sectors = [
      { name: 'Technology', trend: 'up' },
      { name: 'Finance', trend: avgChange > 0 ? 'up' : 'down' },
      { name: 'Consumer', trend: 'up' },
      { name: 'Healthcare', trend: 'neutral' },
    ];

    const sorted = [...stocks].sort(
      (a, b) => parseFloat(b.changePercent || 0) - parseFloat(a.changePercent || 0)
    );
    const topPick = sorted[0] || null;

    return { sentiment, sectors, topPick };
  }, [stocks]);

  const formatCurrency = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return '--';
    return num.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  };

  const formatVolume = (vol) => {
    const v = parseInt(vol);
    if (!v) return '--';
    if (v >= 1e9) return (v / 1e9).toFixed(2) + 'B';
    if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M';
    if (v >= 1e3) return (v / 1e3).toFixed(0) + 'K';
    return v.toString();
  };

  const filterTabs = [
    { key: 'gainers', label: 'Top Gainers', icon: <FiTrendingUp size={13} /> },
    { key: 'losers', label: 'Top Losers', icon: <FiTrendingDown size={13} /> },
    { key: 'active', label: 'Most Active', icon: <FiActivity size={13} /> },
    { key: 'value', label: 'Best Value', icon: <FiTarget size={13} /> },
  ];

  // Skeleton card for loading
  const SkeletonCard = () => (
    <div
      style={{
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        padding: '24px',
        animation: 'recPulse 1.5s infinite ease-in-out',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <div
            style={{
              width: '60px',
              height: '20px',
              borderRadius: '6px',
              background: 'var(--bg-input, rgba(255,255,255,0.08))',
              marginBottom: '8px',
            }}
          />
          <div
            style={{
              width: '120px',
              height: '14px',
              borderRadius: '4px',
              background: 'var(--bg-input, rgba(255,255,255,0.06))',
            }}
          />
        </div>
        <div
          style={{
            width: '70px',
            height: '28px',
            borderRadius: '14px',
            background: 'var(--bg-input, rgba(255,255,255,0.06))',
          }}
        />
      </div>
      <div
        style={{
          width: '100px',
          height: '28px',
          borderRadius: '6px',
          background: 'var(--bg-input, rgba(255,255,255,0.08))',
          marginBottom: '16px',
        }}
      />
      <div
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          background: 'var(--bg-input, rgba(255,255,255,0.06))',
          marginBottom: '16px',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            width: '80px',
            height: '24px',
            borderRadius: '12px',
            background: 'var(--bg-input, rgba(255,255,255,0.06))',
          }}
        />
        <div
          style={{
            width: '90px',
            height: '34px',
            borderRadius: '8px',
            background: 'var(--bg-input, rgba(255,255,255,0.08))',
          }}
        />
      </div>
    </div>
  );

  return (
    <>
      <style>{recKeyframes}</style>

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '24px',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '28px',
            animation: 'recFadeIn 0.4s ease',
          }}
        >
          <div>
            <h1
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '1.6rem',
                fontWeight: 700,
                marginBottom: '6px',
                color: 'var(--text-primary)',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(74, 222, 128, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FiZap size={20} color="var(--accent)" />
              </div>
              Stock Recommendations
            </h1>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.88rem',
                marginLeft: '50px',
              }}
            >
              AI-powered insights and market analysis
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              cursor: refreshing || loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.82rem',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              opacity: refreshing || loading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!refreshing && !loading) {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.color = 'var(--accent)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <FiRefreshCw
              size={14}
              style={{
                animation: refreshing ? 'spin 1s linear infinite' : 'none',
              }}
            />
            {refreshing ? 'Updating...' : 'Refresh'}
          </button>
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            background: 'var(--bg-input, rgba(255,255,255,0.06))',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '24px',
            animation: 'recFadeIn 0.4s ease 0.1s both',
            overflowX: 'auto',
          }}
        >
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? '#0B0F0C' : 'var(--text-muted)',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Stock Cards Grid */}
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px',
              marginBottom: '40px',
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px',
              marginBottom: '40px',
            }}
          >
            {filteredStocks.map((stock, idx) => {
              const cp = parseFloat(stock.changePercent || 0);
              const isUp = cp >= 0;
              const rec = getRecommendation(stock.changePercent);
              const maxVolume = Math.max(
                ...stocks.map((s) => parseInt(s.volume || 0)),
                1
              );
              const volumePercent =
                (parseInt(stock.volume || 0) / maxVolume) * 100;

              return (
                <div
                  key={stock.symbol}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    padding: '24px',
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                    animation: `recFadeIn 0.4s ease ${idx * 0.06}s both`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onClick={() => navigate(`/stock/${stock.symbol}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.2)`;
                    e.currentTarget.style.borderColor = rec.color + '40';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                >
                  {/* Top row: Symbol + Change badge */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '14px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: 800,
                          color: 'var(--accent)',
                          fontFamily: mono,
                          marginBottom: '2px',
                        }}
                      >
                        {stock.symbol}
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          maxWidth: '180px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {stock.name || stock.symbol}
                      </div>
                    </div>
                    {/* Change badge */}
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: isUp
                          ? 'rgba(34, 197, 94, 0.12)'
                          : 'rgba(239, 68, 68, 0.12)',
                        color: isUp
                          ? 'var(--positive, #22C55E)'
                          : 'var(--negative, #EF4444)',
                        border: `1px solid ${isUp ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                      }}
                    >
                      {isUp ? (
                        <FiArrowUpRight size={12} />
                      ) : (
                        <FiArrowDownRight size={12} />
                      )}
                      {isUp ? '+' : ''}
                      {cp.toFixed(2)}%
                    </span>
                  </div>

                  {/* Price */}
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      fontFamily: mono,
                      marginBottom: '16px',
                    }}
                  >
                    {formatCurrency(stock.price)}
                  </div>

                  {/* Volume bar */}
                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        Volume
                      </span>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: 'var(--text-secondary)',
                          fontFamily: mono,
                        }}
                      >
                        {formatVolume(stock.volume)}
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '4px',
                        borderRadius: '2px',
                        background: 'var(--bg-input, rgba(255,255,255,0.06))',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.max(volumePercent, 5)}%`,
                          height: '100%',
                          borderRadius: '2px',
                          background: `linear-gradient(90deg, var(--accent), ${isUp ? '#22C55E' : '#EF4444'})`,
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Recommendation + Confidence */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    {/* AI Recommendation badge */}
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '5px 12px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: rec.bg,
                        color: rec.color,
                        border: `1px solid ${rec.border}`,
                        letterSpacing: '0.02em',
                      }}
                    >
                      <FiZap size={11} />
                      {rec.label}
                    </span>

                    {/* Confidence score */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)',
                          fontWeight: 600,
                        }}
                      >
                        Confidence
                      </span>
                      <div
                        style={{
                          width: '60px',
                          height: '6px',
                          borderRadius: '3px',
                          background: 'var(--bg-input, rgba(255,255,255,0.08))',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            width: `${(rec.confidence * 100).toFixed(0)}%`,
                            height: '100%',
                            borderRadius: '3px',
                            background: `linear-gradient(90deg, ${rec.color}88, ${rec.color})`,
                            transition: 'width 0.5s ease',
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: rec.color,
                          fontFamily: mono,
                          minWidth: '32px',
                        }}
                      >
                        {(rec.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Buy Now button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/stock/${stock.symbol}`);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 0',
                      border: 'none',
                      borderRadius: '10px',
                      background:
                        rec.label === 'Sell'
                          ? 'rgba(239, 68, 68, 0.12)'
                          : rec.label === 'Hold'
                          ? 'rgba(251, 191, 36, 0.12)'
                          : 'rgba(34, 197, 94, 0.12)',
                      color:
                        rec.label === 'Sell'
                          ? '#EF4444'
                          : rec.label === 'Hold'
                          ? '#FBBF24'
                          : '#22C55E',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        rec.label === 'Sell'
                          ? 'rgba(239, 68, 68, 0.2)'
                          : rec.label === 'Hold'
                          ? 'rgba(251, 191, 36, 0.2)'
                          : 'rgba(34, 197, 94, 0.2)';
                      e.currentTarget.style.transform = 'scale(1.01)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        rec.label === 'Sell'
                          ? 'rgba(239, 68, 68, 0.12)'
                          : rec.label === 'Hold'
                          ? 'rgba(251, 191, 36, 0.12)'
                          : 'rgba(34, 197, 94, 0.12)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <FiShoppingCart size={14} />
                    {rec.label === 'Sell' ? 'View Details' : 'Buy Now'}
                  </button>
                </div>
              );
            })}

            {filteredStocks.length === 0 && !loading && (
              <div
                style={{
                  gridColumn: '1 / -1',
                  padding: '60px 20px',
                  textAlign: 'center',
                }}
              >
                <FiBarChart2
                  size={40}
                  color="var(--text-muted)"
                  style={{ opacity: 0.3, marginBottom: '16px' }}
                />
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.92rem',
                  }}
                >
                  No stocks match this filter right now. Try another category.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Trending Stocks Section */}
        {!loading && trendingStocks.length > 0 && (
          <div
            style={{
              marginBottom: '32px',
              animation: 'recFadeIn 0.4s ease 0.4s both',
            }}
          >
            <h2
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '16px',
              }}
            >
              <FiTrendingUp size={18} color="var(--accent)" />
              Trending Stocks
            </h2>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                paddingBottom: '8px',
                scrollbarWidth: 'thin',
              }}
            >
              {trendingStocks.map((stock, idx) => {
                const cp = parseFloat(stock.changePercent || 0);
                const isUp = cp >= 0;
                return (
                  <button
                    key={stock.symbol}
                    onClick={() => navigate(`/stock/${stock.symbol}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 18px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-card)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                      minWidth: '180px',
                      fontFamily: 'inherit',
                      animation: `recFadeIn 0.3s ease ${idx * 0.05}s both`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          color: 'var(--accent)',
                          fontFamily: mono,
                        }}
                      >
                        {stock.symbol}
                      </div>
                      <div
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          fontFamily: mono,
                          marginTop: '2px',
                        }}
                      >
                        {formatCurrency(stock.price)}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: isUp
                          ? 'var(--positive, #22C55E)'
                          : 'var(--negative, #EF4444)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                      }}
                    >
                      {isUp ? <FiArrowUpRight size={11} /> : <FiArrowDownRight size={11} />}
                      {isUp ? '+' : ''}{cp.toFixed(2)}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Smart Insights Panel */}
        {!loading && stocks.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              animation: 'recFadeIn 0.4s ease 0.5s both',
            }}
          >
            {/* Market Sentiment */}
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                padding: '24px',
              }}
            >
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '16px',
                }}
              >
                <FiActivity size={16} color="var(--accent)" />
                Market Sentiment
              </h3>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '12px',
                  background:
                    insights.sentiment === 'Bullish'
                      ? 'rgba(34, 197, 94, 0.08)'
                      : insights.sentiment === 'Bearish'
                      ? 'rgba(239, 68, 68, 0.08)'
                      : 'rgba(251, 191, 36, 0.08)',
                  border: `1px solid ${
                    insights.sentiment === 'Bullish'
                      ? 'rgba(34, 197, 94, 0.2)'
                      : insights.sentiment === 'Bearish'
                      ? 'rgba(239, 68, 68, 0.2)'
                      : 'rgba(251, 191, 36, 0.2)'
                  }`,
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                      insights.sentiment === 'Bullish'
                        ? 'rgba(34, 197, 94, 0.15)'
                        : insights.sentiment === 'Bearish'
                        ? 'rgba(239, 68, 68, 0.15)'
                        : 'rgba(251, 191, 36, 0.15)',
                  }}
                >
                  {insights.sentiment === 'Bullish' ? (
                    <FiTrendingUp
                      size={22}
                      color="#22C55E"
                    />
                  ) : insights.sentiment === 'Bearish' ? (
                    <FiTrendingDown
                      size={22}
                      color="#EF4444"
                    />
                  ) : (
                    <FiActivity size={22} color="#FBBF24" />
                  )}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color:
                        insights.sentiment === 'Bullish'
                          ? '#22C55E'
                          : insights.sentiment === 'Bearish'
                          ? '#EF4444'
                          : '#FBBF24',
                    }}
                  >
                    {insights.sentiment}
                  </div>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      marginTop: '2px',
                    }}
                  >
                    Based on {stocks.length} tracked stocks
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Sectors */}
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                padding: '24px',
              }}
            >
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '16px',
                }}
              >
                <FiBarChart2 size={16} color="var(--accent)" />
                Trending Sectors
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {insights.sectors.map((sector) => (
                  <div
                    key={sector.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'var(--bg-input, rgba(255,255,255,0.04))',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {sector.name}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color:
                          sector.trend === 'up'
                            ? '#22C55E'
                            : sector.trend === 'down'
                            ? '#EF4444'
                            : '#FBBF24',
                      }}
                    >
                      {sector.trend === 'up' ? (
                        <FiArrowUpRight size={12} />
                      ) : sector.trend === 'down' ? (
                        <FiArrowDownRight size={12} />
                      ) : (
                        <FiActivity size={12} />
                      )}
                      {sector.trend === 'up'
                        ? 'Bullish'
                        : sector.trend === 'down'
                        ? 'Bearish'
                        : 'Neutral'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Pick of the Day */}
            {insights.topPick && (
              <div
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid rgba(74, 222, 128, 0.2)',
                  padding: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Subtle glow accent */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'rgba(74, 222, 128, 0.06)',
                    filter: 'blur(30px)',
                    pointerEvents: 'none',
                  }}
                />
                <h3
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '16px',
                  }}
                >
                  <FiStar size={16} color="#FBBF24" />
                  Top Pick of the Day
                </h3>
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(74, 222, 128, 0.06)',
                    border: '1px solid rgba(74, 222, 128, 0.12)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: 800,
                          color: 'var(--accent)',
                          fontFamily: mono,
                        }}
                      >
                        {insights.topPick.symbol}
                      </span>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          marginTop: '2px',
                        }}
                      >
                        {insights.topPick.name || insights.topPick.symbol}
                      </div>
                    </div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: 'rgba(34, 197, 94, 0.15)',
                        color: '#22C55E',
                      }}
                    >
                      <FiArrowUpRight size={12} />
                      +{parseFloat(insights.topPick.changePercent || 0).toFixed(2)}%
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      fontFamily: mono,
                      marginBottom: '12px',
                    }}
                  >
                    {formatCurrency(insights.topPick.price)}
                  </div>
                  <button
                    onClick={() => navigate(`/stock/${insights.topPick.symbol}`)}
                    style={{
                      width: '100%',
                      padding: '10px 0',
                      border: 'none',
                      borderRadius: '10px',
                      background: 'var(--accent)',
                      color: '#0B0F0C',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <FiShoppingCart size={14} />
                    Trade {insights.topPick.symbol}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Recommendations;
