import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { usePortfolio } from '../context/PortfolioContext';
import {
  FiClock,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowUpRight,
  FiArrowDownRight,
  FiShoppingCart,
  FiDollarSign,
  FiRefreshCw,
  FiAlertTriangle,
} from 'react-icons/fi';

const historyKeyframes = `
@keyframes histFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes histPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
`;

const History = () => {
  const navigate = useNavigate();
  const { transactions, resetPortfolio } = usePortfolio();
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Computed summaries
  const summary = useMemo(() => {
    const totalTrades = transactions.length;
    const totalBought = transactions
      .filter((t) => t.type === 'buy')
      .reduce((sum, t) => sum + (t.total || 0), 0);
    const totalSold = transactions
      .filter((t) => t.type === 'sell')
      .reduce((sum, t) => sum + (t.total || 0), 0);
    const netPL = totalSold - totalBought;
    return { totalTrades, totalBought, totalSold, netPL };
  }, [transactions]);

  // Filtered + sorted transactions
  const displayTransactions = useMemo(() => {
    let list = [...transactions];
    if (filterType === 'buy') list = list.filter((t) => t.type === 'buy');
    if (filterType === 'sell') list = list.filter((t) => t.type === 'sell');
    list.sort((a, b) => {
      const da = new Date(a.timestamp).getTime();
      const db = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? db - da : da - db;
    });
    return list;
  }, [transactions, filterType, sortOrder]);

  const formatCurrency = (val) => {
    const num = typeof val === 'number' && !isNaN(val) ? val : 0;
    return num.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  };

  const formatDateTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '--';
    }
  };

  const handleReset = () => {
    resetPortfolio();
    setShowResetConfirm(false);
    toast.success('Portfolio reset to $10,000. All trades cleared.', {
      position: 'top-right',
      autoClose: 3500,
      theme: 'dark',
    });
  };

  // Styles
  const mono = "'SF Mono', 'Fira Code', 'Cascadia Code', monospace";

  const summaryCards = [
    {
      label: 'Total Trades',
      value: summary.totalTrades,
      isCurrency: false,
      color: 'var(--accent)',
      bgTint: 'rgba(74, 222, 128, 0.08)',
      borderTint: 'rgba(74, 222, 128, 0.15)',
      icon: <FiClock size={18} />,
    },
    {
      label: 'Total Bought',
      value: summary.totalBought,
      isCurrency: true,
      color: 'var(--positive, #22C55E)',
      bgTint: 'rgba(34, 197, 94, 0.08)',
      borderTint: 'rgba(34, 197, 94, 0.15)',
      icon: <FiShoppingCart size={18} />,
    },
    {
      label: 'Total Sold',
      value: summary.totalSold,
      isCurrency: true,
      color: 'var(--negative, #EF4444)',
      bgTint: 'rgba(239, 68, 68, 0.08)',
      borderTint: 'rgba(239, 68, 68, 0.15)',
      icon: <FiDollarSign size={18} />,
    },
    {
      label: 'Net P&L',
      value: summary.netPL,
      isCurrency: true,
      color: summary.netPL >= 0 ? 'var(--positive, #22C55E)' : 'var(--negative, #EF4444)',
      bgTint:
        summary.netPL >= 0 ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
      borderTint:
        summary.netPL >= 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
      icon:
        summary.netPL >= 0 ? (
          <FiTrendingUp size={18} />
        ) : (
          <FiTrendingDown size={18} />
        ),
    },
  ];

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'buy', label: 'Buy' },
    { key: 'sell', label: 'Sell' },
  ];

  const sortOptions = [
    { key: 'newest', label: 'Newest First' },
    { key: 'oldest', label: 'Oldest First' },
  ];

  return (
    <>
      <style>{historyKeyframes}</style>

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
            animation: 'histFadeIn 0.4s ease',
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
                <FiClock size={20} color="var(--accent)" />
              </div>
              Transaction History
            </h1>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.88rem',
                marginLeft: '50px',
              }}
            >
              {summary.totalTrades} total trade{summary.totalTrades !== 1 ? 's' : ''} recorded
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          {summaryCards.map((card, idx) => (
            <div
              key={card.label}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${card.borderTint}`,
                borderRadius: '14px',
                padding: '20px',
                animation: `histFadeIn 0.4s ease ${idx * 0.08}s both`,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.15)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {card.label}
                </span>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: card.bgTint,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color,
                  }}
                >
                  {card.icon}
                </div>
              </div>
              <div
                style={{
                  fontSize: card.isCurrency ? '1.4rem' : '1.6rem',
                  fontWeight: 700,
                  color: card.color,
                  fontFamily: mono,
                }}
              >
                {card.isCurrency
                  ? formatCurrency(card.value)
                  : card.value}
              </div>
            </div>
          ))}
        </div>

        {/* Filters Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px',
            animation: 'histFadeIn 0.4s ease 0.2s both',
          }}
        >
          {/* Type filter pills */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              background: 'var(--bg-input, rgba(255,255,255,0.06))',
              borderRadius: '10px',
              padding: '3px',
            }}
          >
            {filterOptions.map((opt) => {
              const isActive = filterType === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setFilterType(opt.key)}
                  style={{
                    padding: '8px 18px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: isActive ? 'var(--accent)' : 'transparent',
                    color: isActive ? '#0B0F0C' : 'var(--text-muted)',
                    fontFamily: 'inherit',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Sort pills */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              background: 'var(--bg-input, rgba(255,255,255,0.06))',
              borderRadius: '10px',
              padding: '3px',
            }}
          >
            {sortOptions.map((opt) => {
              const isActive = sortOrder === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setSortOrder(opt.key)}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: isActive ? 'var(--accent)' : 'transparent',
                    color: isActive ? '#0B0F0C' : 'var(--text-muted)',
                    fontFamily: 'inherit',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Transactions Table */}
        {displayTransactions.length > 0 ? (
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: '14px',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              animation: 'histFadeIn 0.4s ease 0.25s both',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: '720px',
                }}
              >
                <thead>
                  <tr>
                    {['Date / Time', 'Type', 'Symbol', 'Quantity', 'Price', 'Total', 'Balance After'].map(
                      (header) => (
                        <th
                          key={header}
                          style={{
                            padding: '14px 16px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            textAlign: header === 'Date / Time' || header === 'Type' || header === 'Symbol' ? 'left' : 'right',
                            borderBottom: '1px solid var(--border-color)',
                            background: 'var(--bg-card)',
                            position: 'sticky',
                            top: 0,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {displayTransactions.map((txn, idx) => {
                    const isBuy = txn.type === 'buy';
                    const rowBg =
                      idx % 2 === 0
                        ? 'transparent'
                        : 'var(--bg-input, rgba(255,255,255,0.02))';

                    return (
                      <tr
                        key={txn.id || idx}
                        style={{
                          background: rowBg,
                          transition: 'background 0.15s ease',
                          animation: `histFadeIn 0.3s ease ${idx * 0.03}s both`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--bg-card-hover, rgba(255,255,255,0.04))';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = rowBg;
                        }}
                      >
                        {/* Date/Time */}
                        <td
                          style={{
                            padding: '14px 16px',
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)',
                            borderBottom: '1px solid var(--border-color)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatDateTime(txn.timestamp)}
                        </td>

                        {/* Type Badge */}
                        <td
                          style={{
                            padding: '14px 16px',
                            borderBottom: '1px solid var(--border-color)',
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              background: isBuy
                                ? 'rgba(34, 197, 94, 0.12)'
                                : 'rgba(239, 68, 68, 0.12)',
                              color: isBuy
                                ? 'var(--positive, #22C55E)'
                                : 'var(--negative, #EF4444)',
                              border: `1px solid ${isBuy ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                            }}
                          >
                            {isBuy ? (
                              <FiArrowUpRight size={11} />
                            ) : (
                              <FiArrowDownRight size={11} />
                            )}
                            {txn.type}
                          </span>
                        </td>

                        {/* Symbol */}
                        <td
                          style={{
                            padding: '14px 16px',
                            borderBottom: '1px solid var(--border-color)',
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              color: 'var(--accent)',
                              fontFamily: mono,
                              cursor: 'pointer',
                            }}
                            onClick={() => navigate(`/stock/${txn.symbol}`)}
                          >
                            {txn.symbol}
                          </span>
                        </td>

                        {/* Quantity */}
                        <td
                          style={{
                            padding: '14px 16px',
                            textAlign: 'right',
                            fontSize: '0.88rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            fontFamily: mono,
                            borderBottom: '1px solid var(--border-color)',
                          }}
                        >
                          {txn.quantity}
                        </td>

                        {/* Price */}
                        <td
                          style={{
                            padding: '14px 16px',
                            textAlign: 'right',
                            fontSize: '0.88rem',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            fontFamily: mono,
                            borderBottom: '1px solid var(--border-color)',
                          }}
                        >
                          {formatCurrency(txn.price)}
                        </td>

                        {/* Total */}
                        <td
                          style={{
                            padding: '14px 16px',
                            textAlign: 'right',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            color: isBuy
                              ? 'var(--positive, #22C55E)'
                              : 'var(--negative, #EF4444)',
                            fontFamily: mono,
                            borderBottom: '1px solid var(--border-color)',
                          }}
                        >
                          {isBuy ? '-' : '+'}{formatCurrency(txn.total)}
                        </td>

                        {/* Balance After */}
                        <td
                          style={{
                            padding: '14px 16px',
                            textAlign: 'right',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            fontFamily: mono,
                            borderBottom: '1px solid var(--border-color)',
                          }}
                        >
                          {formatCurrency(txn.balanceAfter)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 20px',
              textAlign: 'center',
              animation: 'histFadeIn 0.4s ease',
            }}
          >
            <div
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                background: 'rgba(74, 222, 128, 0.06)',
                border: '1px solid rgba(74, 222, 128, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
              }}
            >
              <FiClock size={36} color="var(--accent)" style={{ opacity: 0.5 }} />
            </div>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                marginBottom: '8px',
                color: 'var(--text-secondary)',
              }}
            >
              No transactions yet
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                maxWidth: '400px',
                marginBottom: '28px',
                lineHeight: 1.6,
              }}
            >
              Start trading from the Dashboard! Your buy and sell trades will appear here.
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
                fontFamily: 'inherit',
                fontSize: '0.92rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
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
              <FiShoppingCart size={16} />
              Go to Dashboard
            </button>
          </div>
        )}

        {/* Reset Portfolio Button */}
        {transactions.length > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '40px',
              paddingBottom: '20px',
              animation: 'histFadeIn 0.4s ease 0.3s both',
            }}
          >
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  borderRadius: '10px',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  background: 'rgba(239, 68, 68, 0.08)',
                  color: 'var(--negative, #EF4444)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                }}
              >
                <FiRefreshCw size={14} />
                Reset Portfolio
              </button>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '24px 32px',
                  borderRadius: '14px',
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  maxWidth: '440px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'var(--negative, #EF4444)',
                  }}
                >
                  <FiAlertTriangle size={20} />
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '1rem',
                    }}
                  >
                    Reset Portfolio?
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  This will reset your balance to $10,000 and clear all transactions and holdings. This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    style={{
                      padding: '10px 22px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--text-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    style={{
                      padding: '10px 22px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'var(--negative, #EF4444)',
                      color: '#fff',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = 'brightness(0.9)';
                      e.currentTarget.style.boxShadow = '0 6px 24px rgba(239, 68, 68, 0.45)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'brightness(1)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.3)';
                    }}
                  >
                    Yes, Reset Everything
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

export default History;
