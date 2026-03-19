import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import {
  FiRss,
  FiExternalLink,
  FiClock,
  FiRefreshCw,
  FiSearch,
  FiTrendingUp,
  FiDollarSign,
  FiGlobe,
} from 'react-icons/fi';

// ======================== Keyframes ========================

const newsKeyframes = `
@keyframes newsFadeIn {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes newsShimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

// ======================== Helpers ========================

const getRelativeTime = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
};

const CATEGORIES = [
  { key: 'all', label: 'All', icon: FiRss },
  { key: 'stocks', label: 'Stocks', icon: FiTrendingUp },
  { key: 'crypto', label: 'Crypto', icon: FiDollarSign },
  { key: 'economy', label: 'Economy', icon: FiGlobe },
];

const categoryColors = {
  stocks: { bg: 'rgba(74, 222, 128, 0.15)', text: '#4ADE80' },
  crypto: { bg: 'rgba(168, 85, 247, 0.15)', text: '#A855F7' },
  economy: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6' },
};

const categoryGradients = {
  stocks: 'linear-gradient(135deg, rgba(74,222,128,0.3), rgba(34,197,94,0.1))',
  crypto: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(139,92,246,0.1))',
  economy: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(37,99,235,0.1))',
};

// ======================== Component ========================

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [symbolFilter, setSymbolFilter] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = { limit: 20 };
      if (activeCategory !== 'all') params.category = activeCategory;
      if (symbolFilter.trim()) params.symbol = symbolFilter.trim().toUpperCase();

      const response = await API.get('/news', { params });
      const data = response.data?.data || response.data?.articles || response.data || [];
      setArticles(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setArticles([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeCategory, symbolFilter]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => fetchNews(true), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  // ======================== Render Helpers ========================

  const renderSkeletons = () => (
    <div style={styles.grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={styles.skeletonCard}>
          <div style={styles.skeletonImage} />
          <div style={{ padding: '16px' }}>
            <div style={{ ...styles.skeletonLine, width: '80%', height: 16, marginBottom: 10 }} />
            <div style={{ ...styles.skeletonLine, width: '100%', height: 12, marginBottom: 6 }} />
            <div style={{ ...styles.skeletonLine, width: '90%', height: 12, marginBottom: 6 }} />
            <div style={{ ...styles.skeletonLine, width: '60%', height: 12, marginBottom: 16 }} />
            <div style={{ ...styles.skeletonLine, width: '40%', height: 10 }} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmpty = () => (
    <div style={styles.emptyState}>
      <FiRss style={{ fontSize: 48, color: 'var(--text-muted)', marginBottom: 16 }} />
      <h3 style={{ color: 'var(--text-primary)', margin: '0 0 8px', fontSize: 18 }}>
        No news found
      </h3>
      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>
        {symbolFilter
          ? `No articles found for "${symbolFilter.toUpperCase()}". Try a different symbol or clear the filter.`
          : 'Try selecting a different category or check back later.'}
      </p>
    </div>
  );

  const renderCategoryBadge = (category) => {
    const colors = categoryColors[category] || { bg: 'rgba(255,255,255,0.1)', text: 'var(--text-secondary)' };
    return (
      <span
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          padding: '3px 10px',
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          background: colors.bg,
          color: colors.text,
          backdropFilter: 'blur(8px)',
          zIndex: 2,
        }}
      >
        {category}
      </span>
    );
  };

  const renderImagePlaceholder = (category) => {
    const Icon =
      category === 'stocks' ? FiTrendingUp : category === 'crypto' ? FiDollarSign : FiGlobe;
    return (
      <div
        style={{
          width: '100%',
          height: 180,
          background: categoryGradients[category] || categoryGradients.stocks,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Icon style={{ fontSize: 40, color: 'rgba(255,255,255,0.3)' }} />
        {renderCategoryBadge(category)}
      </div>
    );
  };

  const renderCard = (article, index) => {
    const hasImage = article.imageUrl && article.imageUrl.startsWith('http');

    return (
      <a
        key={article.id || index}
        href={article.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          ...styles.card,
          animationDelay: `${index * 60}ms`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
          {hasImage ? (
            <div style={{ position: 'relative' }}>
              <img
                src={article.imageUrl}
                alt=""
                style={styles.cardImage}
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div
                style={{
                  display: 'none',
                  width: '100%',
                  height: 180,
                  background: categoryGradients[article.category] || categoryGradients.stocks,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FiRss style={{ fontSize: 40, color: 'rgba(255,255,255,0.3)' }} />
              </div>
              {renderCategoryBadge(article.category)}
            </div>
          ) : (
            renderImagePlaceholder(article.category)
          )}
        </div>

        {/* Content */}
        <div style={styles.cardContent}>
          <h3 style={styles.cardTitle}>{article.title}</h3>
          <p style={styles.cardSummary}>{article.summary}</p>

          {/* Bottom row */}
          <div style={styles.cardFooter}>
            <div style={styles.cardMeta}>
              <span style={styles.sourceName}>{article.source}</span>
              <span style={styles.metaDot}></span>
              <FiClock style={{ fontSize: 11, color: 'var(--text-muted)' }} />
              <span style={styles.timeAgo}>{getRelativeTime(article.publishedAt)}</span>
            </div>
            <div style={styles.symbolRow}>
              {article.relatedSymbols &&
                article.relatedSymbols.slice(0, 3).map((sym) => (
                  <span key={sym} style={styles.symbolPill}>
                    {sym}
                  </span>
                ))}
              <FiExternalLink
                style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto', flexShrink: 0 }}
              />
            </div>
          </div>
        </div>
      </a>
    );
  };

  // ======================== Main Render ========================

  return (
    <div style={styles.container}>
      <style>{newsKeyframes}</style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.titleRow}>
            <FiRss style={{ fontSize: 28, color: 'var(--accent)' }} />
            <h1 style={styles.title}>Market News</h1>
          </div>
          <p style={styles.subtitle}>Latest financial news and market updates</p>
        </div>
        <div style={styles.headerRight}>
          {lastUpdated && (
            <span style={styles.lastUpdated}>
              Updated {getRelativeTime(lastUpdated.toISOString())}
            </span>
          )}
          <button
            onClick={() => fetchNews(true)}
            disabled={refreshing}
            style={{
              ...styles.refreshBtn,
              opacity: refreshing ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!refreshing) e.currentTarget.style.background = 'var(--bg-card-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-card)';
            }}
          >
            <FiRefreshCw
              style={{
                fontSize: 16,
                animation: refreshing ? 'spin 1s linear infinite' : 'none',
              }}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.categoryPills}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  ...styles.pill,
                  background: isActive ? 'var(--accent)' : 'var(--bg-card)',
                  color: isActive ? '#000' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                  fontWeight: isActive ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                    e.currentTarget.style.borderColor = 'var(--accent)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }
                }}
              >
                <Icon style={{ fontSize: 14 }} />
                {cat.label}
              </button>
            );
          })}
        </div>

        <div style={styles.searchBox}>
          <FiSearch style={{ fontSize: 16, color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Filter by symbol (e.g., AAPL)"
            value={symbolFilter}
            onChange={(e) => setSymbolFilter(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') fetchNews();
            }}
            style={styles.searchInput}
          />
          {symbolFilter && (
            <button
              onClick={() => setSymbolFilter('')}
              style={styles.clearBtn}
            >
              x
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        renderSkeletons()
      ) : articles.length === 0 ? (
        renderEmpty()
      ) : (
        <div style={styles.grid}>
          {articles.map((article, i) => renderCard(article, i))}
        </div>
      )}
    </div>
  );
};

// ======================== Styles ========================

const styles = {
  container: {
    padding: '24px',
    maxWidth: 1280,
    margin: '0 auto',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 16,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: 'var(--text-muted)',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  lastUpdated: {
    fontSize: 12,
    color: 'var(--text-muted)',
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    background: 'var(--bg-card)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryPills: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  pill: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: 24,
    cursor: 'pointer',
    fontSize: 13,
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: 8,
    minWidth: 220,
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: 13,
    width: '100%',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: 14,
    padding: '0 4px',
    lineHeight: 1,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340, 1fr))',
    gap: 20,
  },
  card: {
    background: 'var(--bg-card)',
    borderRadius: 12,
    border: '1px solid var(--border-color)',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    boxShadow: 'var(--shadow-md)',
    animation: 'newsFadeIn 0.4s ease forwards',
    opacity: 0,
    cursor: 'pointer',
  },
  cardImage: {
    width: '100%',
    height: 180,
    objectFit: 'cover',
    display: 'block',
  },
  cardContent: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: '0 0 8px',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  cardSummary: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    margin: '0 0 14px',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    flex: 1,
  },
  cardFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    borderTop: '1px solid var(--border-color)',
    paddingTop: 12,
    marginTop: 'auto',
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
  },
  sourceName: {
    color: 'var(--accent)',
    fontWeight: 500,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: '50%',
    background: 'var(--text-muted)',
  },
  timeAgo: {
    color: 'var(--text-muted)',
  },
  symbolRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  symbolPill: {
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    background: 'rgba(74, 222, 128, 0.1)',
    color: 'var(--accent)',
    letterSpacing: '0.3px',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
  },
  skeletonCard: {
    background: 'var(--bg-card)',
    borderRadius: 12,
    border: '1px solid var(--border-color)',
    overflow: 'hidden',
  },
  skeletonImage: {
    width: '100%',
    height: 180,
    background: 'linear-gradient(90deg, var(--bg-card) 25%, var(--bg-card-hover) 50%, var(--bg-card) 75%)',
    backgroundSize: '200% 100%',
    animation: 'newsShimmer 1.5s ease-in-out infinite',
  },
  skeletonLine: {
    borderRadius: 4,
    background: 'linear-gradient(90deg, var(--bg-card) 25%, var(--bg-card-hover) 50%, var(--bg-card) 75%)',
    backgroundSize: '200% 100%',
    animation: 'newsShimmer 1.5s ease-in-out infinite',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    textAlign: 'center',
  },
};

// Fix grid template (can't use 'px' suffix missing above — correct it)
styles.grid = {
  ...styles.grid,
  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
};

export default News;
