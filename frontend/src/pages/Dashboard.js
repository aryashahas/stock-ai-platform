import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { stocksAPI, watchlistAPI } from '../services/api';
import { subscribeToStock, unsubscribeFromStock } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import StockChart from '../components/StockChart';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiStar,
  FiPlus,
  FiArrowUpRight,
  FiArrowDownRight,
  FiActivity,
  FiBarChart2,
  FiRefreshCw,
  FiClock,
  FiZap,
} from 'react-icons/fi';
import HelpGuide from '../components/HelpGuide';
import './Dashboard.css';

// Default popular stocks to display
const DEFAULT_STOCKS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'V', 'NFLX'];

const MARKET_INDICES = [
  { symbol: '^GSPC', name: 'S&P 500', display: 'S&P 500' },
  { symbol: '^IXIC', name: 'NASDAQ', display: 'NASDAQ' },
  { symbol: '^DJI', name: 'Dow Jones', display: 'DOW JONES' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [marketData, setMarketData] = useState([]);
  const [stocksData, setStocksData] = useState([]);
  const [featuredStock, setFeaturedStock] = useState(null);
  const [featuredChartData, setFeaturedChartData] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const subscribedStocks = useRef([]);

  // Fetch market summary
  const fetchMarketSummary = useCallback(async () => {
    try {
      const response = await stocksAPI.getMarketSummary();
      const raw = response.data?.data || response.data || {};
      const data = raw.indices || raw || [];
      setMarketData(data);
    } catch (error) {
      // Use fallback data
      setMarketData(MARKET_INDICES.map((idx) => ({
        symbol: idx.symbol,
        name: idx.display,
        price: (Math.random() * 5000 + 3000).toFixed(2),
        change: ((Math.random() - 0.5) * 100).toFixed(2),
        changePercent: ((Math.random() - 0.5) * 4).toFixed(2),
      })));
    }
  }, []);

  // Fetch stock quotes
  const fetchStocks = useCallback(async () => {
    try {
      const promises = DEFAULT_STOCKS.map((symbol) =>
        stocksAPI.getQuote(symbol).catch(() => null)
      );
      const results = await Promise.all(promises);
      const stocks = results
        .filter((r) => r !== null)
        .map((r) => r.data?.data || r.data?.quote || r.data)
        .filter((s) => s && s.symbol);

      if (stocks.length > 0) {
        setStocksData(stocks);

        // Sort for gainers and losers
        const sorted = [...stocks].sort((a, b) =>
          parseFloat(b.changePercent || 0) - parseFloat(a.changePercent || 0)
        );
        setTopGainers(sorted.filter((s) => parseFloat(s.changePercent || 0) > 0).slice(0, 5));
        setTopLosers(sorted.filter((s) => parseFloat(s.changePercent || 0) < 0).slice(-5).reverse());

        // Set featured stock
        if (!featuredStock) {
          setFeaturedStock(stocks[0]);
          fetchChartData(stocks[0].symbol);
        }
      } else {
        // Fallback demo data
        const demoStocks = DEFAULT_STOCKS.map((symbol) => ({
          symbol,
          name: symbol + ' Inc.',
          price: (Math.random() * 400 + 50).toFixed(2),
          change: ((Math.random() - 0.5) * 20).toFixed(2),
          changePercent: ((Math.random() - 0.5) * 6).toFixed(2),
          volume: Math.floor(Math.random() * 50000000),
          marketCap: (Math.random() * 2000 + 100).toFixed(0) + 'B',
        }));
        setStocksData(demoStocks);
        const sorted = [...demoStocks].sort((a, b) =>
          parseFloat(b.changePercent) - parseFloat(a.changePercent)
        );
        setTopGainers(sorted.slice(0, 5));
        setTopLosers(sorted.slice(-5).reverse());
        if (!featuredStock) {
          setFeaturedStock(demoStocks[0]);
          fetchChartData(demoStocks[0].symbol);
        }
      }
    } catch (error) {
      console.error('Failed to fetch stocks:', error);
    }
  }, [featuredStock]);

  // Fetch chart data for featured stock
  const fetchChartData = async (symbol, range = '1M') => {
    setChartLoading(true);
    try {
      const response = await stocksAPI.getHistorical(symbol, range);
      const raw = response.data?.data || response.data || {};
      const data = raw.historicalData || raw.historical || raw.prices || (Array.isArray(raw) ? raw : []);
      setFeaturedChartData(Array.isArray(data) ? data : []);
    } catch (error) {
      // Generate demo chart data
      const days = range === '1W' ? 7 : range === '1M' ? 30 : range === '3M' ? 90 : range === '6M' ? 180 : 365;
      const demo = [];
      let price = parseFloat(featuredStock?.price || 150);
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        price += (Math.random() - 0.48) * 3;
        demo.push({
          date: date.toISOString().split('T')[0],
          close: Math.max(price, 10).toFixed(2),
          open: (price + (Math.random() - 0.5) * 2).toFixed(2),
          high: (price + Math.random() * 3).toFixed(2),
          low: (price - Math.random() * 3).toFixed(2),
          volume: Math.floor(Math.random() * 50000000),
        });
      }
      setFeaturedChartData(demo);
    } finally {
      setChartLoading(false);
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    const stockSymbols = stocksData.map((s) => s.symbol);
    stockSymbols.forEach((symbol) => {
      subscribeToStock(symbol, (data) => {
        setStocksData((prev) =>
          prev.map((s) =>
            s.symbol === data.symbol
              ? { ...s, price: data.price, change: data.change, changePercent: data.changePercent }
              : s
          )
        );
      });
    });
    subscribedStocks.current = stockSymbols;

    return () => {
      subscribedStocks.current.forEach((symbol) => {
        unsubscribeFromStock(symbol);
      });
    };
  }, [stocksData.length]);

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMarketSummary(), fetchStocks()]);
      setLoading(false);
    };
    loadData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchMarketSummary();
      fetchStocks();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchMarketSummary(), fetchStocks()]);
    setRefreshing(false);
    toast.success('Data refreshed');
  };

  const handleFeaturedSelect = (stock) => {
    setFeaturedStock(stock);
    fetchChartData(stock.symbol);
  };

  const handleAddToWatchlist = async (symbol) => {
    if (isAuthenticated) {
      try {
        await watchlistAPI.addToWatchlist(symbol);
        toast.success(`${symbol} added to watchlist`);
      } catch (error) {
        toast.error(error.message || 'Failed to add to watchlist');
      }
    } else {
      // Save to localStorage when not authenticated
      try {
        const stored = localStorage.getItem('stockai_watchlist');
        const symbols = stored ? JSON.parse(stored) : [];
        if (!symbols.includes(symbol)) {
          symbols.push(symbol);
          localStorage.setItem('stockai_watchlist', JSON.stringify(symbols));
          toast.success(`${symbol} added to watchlist`);
        } else {
          toast.info(`${symbol} is already in your watchlist`);
        }
      } catch {
        toast.error('Failed to add to watchlist');
      }
    }
  };

  const formatVolume = (vol) => {
    const v = parseInt(vol);
    if (!v) return '--';
    if (v >= 1e9) return (v / 1e9).toFixed(2) + 'B';
    if (v >= 1e6) return (v / 1e6).toFixed(2) + 'M';
    if (v >= 1e3) return (v / 1e3).toFixed(1) + 'K';
    return v.toString();
  };

  const formatPrice = (p) => {
    const price = parseFloat(p);
    if (isNaN(price)) return '--';
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const now = new Date();
  const timestamp = now.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Loading state
  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          {/* Header skeleton */}
          <div className="dashboard-header">
            <div className="header-left">
              <div className="skeleton skeleton-text" style={{ width: '220px', height: '28px' }} />
              <div className="skeleton skeleton-text-sm" style={{ width: '180px', marginTop: '8px' }} />
            </div>
          </div>
          {/* Market Summary Skeletons */}
          <div className="market-summary">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-text" style={{ width: '60%' }} />
                <div className="skeleton skeleton-text" style={{ width: '40%', height: '28px', marginTop: '12px' }} />
                <div className="skeleton skeleton-text-sm" style={{ width: '50%', marginTop: '8px' }} />
              </div>
            ))}
          </div>
          {/* Main Grid Skeleton */}
          <div className="dashboard-grid">
            <div className="sidebar-left">
              <div className="skeleton-card" style={{ padding: '16px' }}>
                <div className="skeleton skeleton-text" style={{ width: '80%', marginBottom: '16px' }} />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="skeleton" style={{ height: '48px', marginBottom: '8px', borderRadius: '10px' }} />
                ))}
              </div>
            </div>
            <div className="main-chart">
              <div className="skeleton-card" style={{ padding: '24px' }}>
                <div className="skeleton skeleton-text" style={{ width: '30%', height: '24px' }} />
                <div className="skeleton skeleton-text" style={{ width: '20%', height: '32px', marginTop: '8px' }} />
                <div className="skeleton skeleton-chart" style={{ marginTop: '20px' }} />
              </div>
            </div>
            <div className="sidebar-right">
              {[1, 2].map((i) => (
                <div key={i} className="skeleton-card" style={{ padding: '16px', marginBottom: '16px' }}>
                  <div className="skeleton skeleton-text" style={{ width: '70%', marginBottom: '16px' }} />
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="skeleton" style={{ height: '40px', marginBottom: '8px', borderRadius: '8px' }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">
              <FiActivity className="title-icon" />
              Market Overview
            </h1>
            <p className="dashboard-subtitle">
              <FiClock size={14} />
              Real-time market data and analysis
              <span className="dashboard-timestamp">{timestamp}</span>
            </p>
          </div>
          <button
            className="btn btn-outline btn-sm refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <FiRefreshCw className={refreshing ? 'spin-animation' : ''} size={14} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Market Index Cards */}
        <div className="market-summary">
          {(marketData.length > 0 ? marketData : MARKET_INDICES).map((index, i) => {
            const change = parseFloat(index.change || 0);
            const changePercent = parseFloat(index.changePercent || 0);
            const isUp = change >= 0;
            return (
              <div
                key={i}
                className={`market-card ${isUp ? 'market-card-up' : 'market-card-down'} animate-fade-in`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="market-card-header">
                  <span className="market-card-name">{index.name || index.display}</span>
                  <div className={`market-card-badge ${isUp ? 'badge-green' : 'badge-red'}`}>
                    {isUp ? <FiArrowUpRight size={12} /> : <FiArrowDownRight size={12} />}
                    {Math.abs(changePercent).toFixed(2)}%
                  </div>
                </div>
                <p className="market-card-price">
                  {formatPrice(index.price || 0)}
                </p>
                <p className={`market-card-change ${isUp ? 'price-up' : 'price-down'}`}>
                  {isUp ? '+' : ''}{change.toFixed(2)} ({isUp ? '+' : ''}{changePercent.toFixed(2)}%)
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left Sidebar - Quick Access */}
          <div className="sidebar-left">
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <h3><FiZap size={14} /> Quick Access</h3>
              </div>
              <div className="quick-list">
                {stocksData.slice(0, 8).map((stock) => {
                  const isUp = parseFloat(stock.changePercent || 0) >= 0;
                  const isActive = featuredStock?.symbol === stock.symbol;
                  return (
                    <button
                      key={stock.symbol}
                      className={`quick-item ${isActive ? 'quick-item-active' : ''}`}
                      onClick={() => handleFeaturedSelect(stock)}
                    >
                      <div className="quick-item-left">
                        <span className="quick-symbol">{stock.symbol}</span>
                        <span className="quick-price">${formatPrice(stock.price)}</span>
                      </div>
                      <span className={`quick-change ${isUp ? 'badge-green' : 'badge-red'}`}>
                        {isUp ? '+' : ''}{parseFloat(stock.changePercent || 0).toFixed(2)}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Center - Featured Chart */}
          <div className="main-chart">
            <div className="chart-card">
              {/* Chart Header */}
              {featuredStock && (
                <div className="chart-header">
                  <div className="chart-header-left">
                    <div className="chart-stock-info">
                      <h2 className="chart-symbol">{featuredStock.symbol}</h2>
                      <span className="chart-name">{featuredStock.name}</span>
                    </div>
                    <div className="chart-price-info">
                      <span className="chart-price">${formatPrice(featuredStock.price)}</span>
                      <span className={`chart-change-badge ${parseFloat(featuredStock.changePercent || 0) >= 0 ? 'badge-green' : 'badge-red'}`}>
                        {parseFloat(featuredStock.changePercent || 0) >= 0 ? <FiArrowUpRight size={13} /> : <FiArrowDownRight size={13} />}
                        {parseFloat(featuredStock.changePercent || 0) >= 0 ? '+' : ''}
                        {parseFloat(featuredStock.change || 0).toFixed(2)} ({parseFloat(featuredStock.changePercent || 0) >= 0 ? '+' : ''}{parseFloat(featuredStock.changePercent || 0).toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  <div className="chart-header-actions">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleAddToWatchlist(featuredStock.symbol)}
                      title="Add to Watchlist"
                    >
                      <FiStar size={14} />
                      Watch
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/stock/${featuredStock.symbol}`)}
                    >
                      Details
                      <FiArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Chart */}
              <div className="chart-container">
                {chartLoading ? (
                  <div className="loading-container" style={{ height: '350px' }}>
                    <div className="spinner" />
                    <p>Loading chart data...</p>
                  </div>
                ) : (
                  <StockChart
                    data={featuredChartData}
                    symbol={featuredStock?.symbol || ''}
                    height={350}
                    onRangeChange={(range) => {
                      if (featuredStock) fetchChartData(featuredStock.symbol, range);
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Top Movers */}
          <div className="sidebar-right">
            {/* Top Gainers */}
            <div className="sidebar-card movers-card">
              <div className="sidebar-card-header">
                <h3><FiTrendingUp size={14} className="icon-green" /> Top Gainers</h3>
              </div>
              <div className="movers-list">
                {topGainers.length > 0 ? topGainers.map((stock) => (
                  <button
                    key={stock.symbol}
                    className="mover-item"
                    onClick={() => navigate(`/stock/${stock.symbol}`)}
                  >
                    <span className="mover-symbol">{stock.symbol}</span>
                    <span className="mover-price">${formatPrice(stock.price)}</span>
                    <span className="mover-change badge-green">
                      +{parseFloat(stock.changePercent || 0).toFixed(2)}%
                    </span>
                  </button>
                )) : (
                  <p className="no-data">No gainers data</p>
                )}
              </div>
            </div>

            {/* Top Losers */}
            <div className="sidebar-card movers-card">
              <div className="sidebar-card-header">
                <h3><FiTrendingDown size={14} className="icon-red" /> Top Losers</h3>
              </div>
              <div className="movers-list">
                {topLosers.length > 0 ? topLosers.map((stock) => (
                  <button
                    key={stock.symbol}
                    className="mover-item"
                    onClick={() => navigate(`/stock/${stock.symbol}`)}
                  >
                    <span className="mover-symbol">{stock.symbol}</span>
                    <span className="mover-price">${formatPrice(stock.price)}</span>
                    <span className="mover-change badge-red">
                      {parseFloat(stock.changePercent || 0).toFixed(2)}%
                    </span>
                  </button>
                )) : (
                  <p className="no-data">No losers data</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* All Stocks Table */}
        <div className="stocks-table-section">
          <div className="section-header">
            <h2><FiBarChart2 size={18} /> All Stocks</h2>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th style={{ textAlign: 'right' }}>Price</th>
                  <th style={{ textAlign: 'right' }}>Change</th>
                  <th style={{ textAlign: 'right' }}>Change %</th>
                  <th style={{ textAlign: 'right' }}>Volume</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {stocksData.map((stock, idx) => {
                  const changeVal = parseFloat(stock.change || 0);
                  const changePctVal = parseFloat(stock.changePercent || 0);
                  const isUp = changeVal >= 0;
                  return (
                    <tr
                      key={stock.symbol}
                      onClick={() => navigate(`/stock/${stock.symbol}`)}
                      className="animate-fade-in"
                      style={{ animationDelay: `${idx * 0.04}s` }}
                    >
                      <td>
                        <span className="table-symbol">{stock.symbol}</span>
                      </td>
                      <td>
                        <span className="table-name">{stock.name || stock.symbol}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="table-price">${formatPrice(stock.price)}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`table-change ${isUp ? 'price-up' : 'price-down'}`}>
                          {isUp ? '+' : ''}{changeVal.toFixed(2)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`table-badge ${isUp ? 'badge-green' : 'badge-red'}`}>
                          {isUp ? <FiArrowUpRight size={11} /> : <FiArrowDownRight size={11} />}
                          {Math.abs(changePctVal).toFixed(2)}%
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="table-volume">
                          {formatVolume(stock.volume)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="table-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToWatchlist(stock.symbol);
                          }}
                          title="Add to Watchlist"
                        >
                          <FiPlus size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <HelpGuide />
    </div>
  );
};

export default Dashboard;
