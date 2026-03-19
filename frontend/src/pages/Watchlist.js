import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { watchlistAPI, stocksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { subscribeToStock, unsubscribeFromStock } from '../services/socket';
import WatchlistCard from '../components/WatchlistCard';
import {
  FiStar,
  FiSearch,
  FiRefreshCw,
} from 'react-icons/fi';

const WATCHLIST_STORAGE_KEY = 'stockai_watchlist';

// Helper to read symbols from localStorage
const getLocalWatchlist = () => {
  try {
    const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper to save symbols to localStorage
const saveLocalWatchlist = (symbols) => {
  localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(symbols));
};

const Watchlist = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWatchlist = useCallback(async () => {
    if (isAuthenticated) {
      // Authenticated: use the API
      try {
        const response = await watchlistAPI.getWatchlist();
        const raw = response.data?.data || response.data || {};
        const stocks = raw.stocks || raw.watchlist || (Array.isArray(raw) ? raw : []);

        const enriched = await Promise.all(
          stocks.map(async (item) => {
            const sym = item.symbol || item;
            try {
              const quoteRes = await stocksAPI.getQuote(sym);
              const q = quoteRes.data?.data || quoteRes.data?.quote || quoteRes.data;
              return {
                symbol: sym,
                name: q.name || item.name || sym,
                price: q.price || item.price || 0,
                change: q.change || item.change || 0,
                changePercent: q.changePercent || item.changePercent || 0,
              };
            } catch {
              return {
                symbol: sym,
                name: item.name || sym,
                price: item.price || (Math.random() * 300 + 50).toFixed(2),
                change: item.change || ((Math.random() - 0.5) * 10).toFixed(2),
                changePercent: item.changePercent || ((Math.random() - 0.5) * 4).toFixed(2),
              };
            }
          })
        );

        setWatchlist(enriched);
      } catch (error) {
        toast.error('Failed to load watchlist');
        setWatchlist([]);
      }
    } else {
      // Not authenticated: use localStorage
      const symbols = getLocalWatchlist();
      if (symbols.length === 0) {
        setWatchlist([]);
        return;
      }

      const enriched = await Promise.all(
        symbols.map(async (sym) => {
          try {
            const quoteRes = await stocksAPI.getQuote(sym);
            const q = quoteRes.data?.data || quoteRes.data?.quote || quoteRes.data;
            return {
              symbol: sym,
              name: q.name || sym,
              price: q.price || 0,
              change: q.change || 0,
              changePercent: q.changePercent || 0,
            };
          } catch {
            return {
              symbol: sym,
              name: sym,
              price: (Math.random() * 300 + 50).toFixed(2),
              change: ((Math.random() - 0.5) * 10).toFixed(2),
              changePercent: ((Math.random() - 0.5) * 4).toFixed(2),
            };
          }
        })
      );

      setWatchlist(enriched);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchWatchlist();
      setLoading(false);
    };
    load();
  }, [fetchWatchlist]);

  // Subscribe to real-time updates
  useEffect(() => {
    const symbols = watchlist.map((s) => s.symbol);
    symbols.forEach((sym) => {
      subscribeToStock(sym, (data) => {
        setWatchlist((prev) =>
          prev.map((s) =>
            s.symbol === data.symbol
              ? { ...s, price: data.price, change: data.change, changePercent: data.changePercent }
              : s
          )
        );
      });
    });

    return () => {
      symbols.forEach((sym) => unsubscribeFromStock(sym));
    };
  }, [watchlist.length]);

  const handleRemove = async (symbol) => {
    if (isAuthenticated) {
      try {
        await watchlistAPI.removeFromWatchlist(symbol);
        setWatchlist((prev) => prev.filter((s) => s.symbol !== symbol));
        toast.success(`${symbol} removed from watchlist`);
      } catch (error) {
        toast.error(error.message || 'Failed to remove from watchlist');
      }
    } else {
      // Remove from localStorage
      const symbols = getLocalWatchlist().filter((s) => s !== symbol);
      saveLocalWatchlist(symbols);
      setWatchlist((prev) => prev.filter((s) => s.symbol !== symbol));
      toast.success(`${symbol} removed from watchlist`);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWatchlist();
    setRefreshing(false);
    toast.success('Watchlist refreshed');
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div className="skeleton" style={{ height: '32px', width: '220px', marginBottom: '10px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '16px', width: '140px', borderRadius: '6px' }} />
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton" style={{ height: '152px', borderRadius: '16px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: '32px',
      }}>
        <div>
          <h1 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '1.6rem',
            fontWeight: 700,
            marginBottom: '6px',
            color: 'var(--text-primary)',
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(251, 191, 36, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FiStar size={20} color="#FBBF24" />
            </div>
            My Watchlist
          </h1>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.88rem',
            marginLeft: '50px',
          }}>
            Tracking {watchlist.length} stock{watchlist.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.82rem',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            opacity: refreshing ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!refreshing) {
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
          Refresh
        </button>
      </div>

      {/* Watchlist Grid */}
      {watchlist.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          {watchlist.map((stock, idx) => (
            <div
              key={stock.symbol}
              style={{
                animation: `fadeInUp 0.4s ease ${idx * 0.06}s both`,
              }}
            >
              <WatchlistCard stock={stock} onRemove={handleRemove} />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 20px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            background: 'rgba(251, 191, 36, 0.06)',
            border: '1px solid rgba(251, 191, 36, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}>
            <FiStar size={36} color="#FBBF24" style={{ opacity: 0.5 }} />
          </div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            marginBottom: '8px',
            color: 'var(--text-secondary)',
          }}>
            No stocks in your watchlist
          </h3>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            maxWidth: '400px',
            marginBottom: '28px',
            lineHeight: 1.6,
          }}>
            Start by adding stocks from the dashboard or stock detail pages to track their performance.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              borderRadius: '12px',
              border: 'none',
              background: 'var(--accent)',
              color: '#0B0F0C',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.92rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-hover)';
              e.currentTarget.style.boxShadow = 'var(--shadow-glow-green)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FiSearch size={16} />
            Browse Stocks
          </button>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
