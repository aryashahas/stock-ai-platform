import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';

const WatchlistCard = ({ stock, onRemove }) => {
  const navigate = useNavigate();

  const {
    symbol = '',
    name = '',
    price = 0,
    change = 0,
    changePercent = 0,
  } = stock || {};

  const isPositive = parseFloat(change) >= 0;

  const handleClick = () => {
    navigate(`/stock/${symbol}`);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) onRemove(symbol);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color-hover)';
        e.currentTarget.style.background = 'var(--bg-card-hover)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = isPositive
          ? '0 8px 32px rgba(74, 222, 128, 0.08), 0 0 20px rgba(74, 222, 128, 0.05)'
          : '0 8px 32px rgba(239, 68, 68, 0.08), 0 0 20px rgba(239, 68, 68, 0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.background = 'var(--bg-card)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top accent gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: isPositive
          ? 'linear-gradient(90deg, transparent, #4ADE80, transparent)'
          : 'linear-gradient(90deg, transparent, #EF4444, transparent)',
      }} />

      {/* Header: Symbol + Remove */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
      }}>
        <div>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--accent)',
            fontFamily: 'var(--font-mono)',
            marginBottom: '3px',
            letterSpacing: '-0.01em',
          }}>
            {symbol}
          </h3>
          <p style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            maxWidth: '180px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {name}
          </p>
        </div>
        <button
          onClick={handleRemove}
          title="Remove from watchlist"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#EF4444';
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.background = 'none';
          }}
        >
          <FiTrash2 size={15} />
        </button>
      </div>

      {/* Price + Change */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}>
        <p style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-primary)',
          lineHeight: 1,
          letterSpacing: '-0.01em',
        }}>
          ${parseFloat(price).toFixed(2)}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 12px',
          borderRadius: '20px',
          background: isPositive ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        }}>
          {isPositive
            ? <FiArrowUpRight size={14} color="#4ADE80" />
            : <FiArrowDownRight size={14} color="#EF4444" />
          }
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: isPositive ? '#4ADE80' : '#EF4444',
          }}>
            {isPositive ? '+' : ''}{parseFloat(changePercent).toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default WatchlistCard;
