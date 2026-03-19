import React, { useState, useEffect, useCallback } from 'react';
import {
  FiX,
  FiMinus,
  FiPlus,
  FiDollarSign,
  FiShoppingCart,
  FiArrowUpRight,
  FiArrowDownRight,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { usePortfolio } from '../context/PortfolioContext';

const QUICK_QUANTITIES = [1, 5, 10, 25, 50, 100];

const tradeModalKeyframes = `
@keyframes tradeModalIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes tradeOverlayIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`;

export default function TradeModal({
  isOpen,
  onClose,
  stock,
  mode: initialMode = 'buy',
}) {
  const { balance, buyStock, sellStock, getPosition } = usePortfolio();

  const [activeMode, setActiveMode] = useState(initialMode);
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [error, setError] = useState('');

  // Sync with prop changes
  useEffect(() => {
    if (isOpen) {
      setActiveMode(initialMode);
      setQuantity('');
      setOrderType('market');
      setLimitPrice('');
      setError('');
    }
  }, [isOpen, initialMode]);

  // Clear error when mode or quantity changes
  useEffect(() => {
    setError('');
  }, [activeMode, quantity]);

  const isBuy = activeMode === 'buy';
  const accentColor = isBuy ? 'var(--positive, #22C55E)' : 'var(--negative, #EF4444)';
  const accentRaw = isBuy ? '#22C55E' : '#EF4444';

  const safePrice = parseFloat(stock?.price) || 0;
  const parsedQty = parseInt(quantity, 10) || 0;
  const effectivePrice =
    orderType === 'limit' && limitPrice !== ''
      ? parseFloat(limitPrice)
      : safePrice;
  const estimatedTotal = parsedQty * effectivePrice;

  // Portfolio position for current stock
  const position = stock ? getPosition(stock.symbol) : null;
  const ownedShares = position ? position.quantity : 0;

  // Validation
  const insufficientFunds = isBuy && parsedQty > 0 && estimatedTotal > balance;
  const notEnoughShares = !isBuy && parsedQty > 0 && parsedQty > ownedShares;
  const isDisabled = parsedQty <= 0 || insufficientFunds || notEnoughShares;

  const formatCurrency = useCallback((val) => {
    const num = typeof val === 'number' && !isNaN(val) ? val : 0;
    return num.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  }, []);

  const handleSubmit = () => {
    if (parsedQty <= 0 || !stock) return;

    let result;

    if (isBuy) {
      result = buyStock(stock.symbol, stock.name, parsedQty, effectivePrice);
    } else {
      result = sellStock(stock.symbol, parsedQty, effectivePrice);
    }

    if (!result.success) {
      setError(result.message);
      return;
    }

    toast.success(
      `${isBuy ? 'Bought' : 'Sold'} ${parsedQty} ${stock.symbol} at ${formatCurrency(effectivePrice)}`,
      {
        position: 'top-right',
        autoClose: 3500,
        theme: 'dark',
      }
    );

    onClose();
  };

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setQuantity('');
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0 && num <= 1000) {
      setQuantity(String(num));
    }
  };

  const adjustQuantity = (delta) => {
    const current = parsedQty;
    const next = Math.max(0, Math.min(1000, current + delta));
    setQuantity(String(next));
  };

  // Determine button label
  let buttonLabel = isBuy ? 'Buy' : 'Sell';
  if (insufficientFunds) {
    buttonLabel = 'Insufficient Balance';
  } else if (notEnoughShares) {
    buttonLabel = 'Not Enough Shares';
  }

  if (!isOpen || !stock) return null;

  return (
    <>
      <style>{tradeModalKeyframes}</style>

      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          animation: 'tradeOverlayIn 0.25s ease',
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '92vw',
            maxWidth: 440,
            background: 'var(--bg-card, #1E1E2E)',
            borderRadius: 16,
            boxShadow: 'var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.4))',
            border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
            animation: 'tradeModalIn 0.3s ease',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* ---- Header ---- */}
          <div
            style={{
              padding: '20px 20px 16px',
              borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.08))',
              position: 'relative',
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close trade modal"
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted, #888)',
                cursor: 'pointer',
                fontSize: 20,
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                transition: 'color 0.2s, background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary, #fff)';
                e.currentTarget.style.background = 'var(--bg-input, rgba(255,255,255,0.06))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted, #888)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <FiX />
            </button>

            {/* Balance display */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#22C55E',
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                }}
              >
                Available: {formatCurrency(balance)}
              </span>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: 'flex',
                gap: 4,
                background: 'var(--bg-input, rgba(255,255,255,0.06))',
                borderRadius: 10,
                padding: 3,
                marginBottom: 16,
                maxWidth: 220,
              }}
            >
              {['buy', 'sell'].map((m) => {
                const isActive = activeMode === m;
                const tabColor = m === 'buy' ? 'var(--positive, #22C55E)' : 'var(--negative, #EF4444)';
                return (
                  <button
                    key={m}
                    onClick={() => setActiveMode(m)}
                    style={{
                      flex: 1,
                      padding: '8px 0',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: isActive ? tabColor : 'transparent',
                      color: isActive ? '#fff' : 'var(--text-muted, #888)',
                    }}
                  >
                    {m === 'buy' ? 'Buy' : 'Sell'}
                  </button>
                );
              })}
            </div>

            {/* Position display for sell mode */}
            {!isBuy && (
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: ownedShares > 0 ? 'var(--text-secondary, #aaa)' : 'var(--negative, #EF4444)',
                  marginBottom: 12,
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                }}
              >
                You own: {ownedShares} share{ownedShares !== 1 ? 's' : ''}
              </div>
            )}

            {/* Stock info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `${accentRaw}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: accentColor,
                  fontSize: 18,
                }}
              >
                {isBuy ? <FiShoppingCart /> : <FiDollarSign />}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: 'var(--text-primary, #fff)',
                  }}
                >
                  {stock.symbol}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--text-secondary, #aaa)',
                    marginTop: 1,
                  }}
                >
                  {stock.name}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: 'var(--text-primary, #fff)',
                    fontFamily: "'SF Mono', 'Fira Code', monospace",
                  }}
                >
                  {formatCurrency(safePrice)}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text-muted, #666)',
                    marginTop: 2,
                  }}
                >
                  Current Price
                </div>
              </div>
            </div>
          </div>

          {/* ---- Body ---- */}
          <div style={{ padding: '20px', flex: 1 }}>
            {/* Quantity */}
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-secondary, #aaa)',
                marginBottom: 8,
              }}
            >
              Quantity
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 10,
              }}
            >
              <button
                onClick={() => adjustQuantity(-1)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                  background: 'var(--bg-input, rgba(255,255,255,0.06))',
                  color: 'var(--text-primary, #fff)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'var(--bg-card-hover, rgba(255,255,255,0.1))')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'var(--bg-input, rgba(255,255,255,0.06))')
                }
              >
                <FiMinus />
              </button>
              <input
                type="number"
                min="1"
                max="1000"
                value={quantity}
                onChange={handleQuantityChange}
                placeholder="0"
                style={{
                  flex: 1,
                  height: 36,
                  borderRadius: 8,
                  border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                  background: 'var(--bg-input, rgba(255,255,255,0.06))',
                  color: 'var(--text-primary, #fff)',
                  fontSize: 16,
                  fontWeight: 600,
                  textAlign: 'center',
                  outline: 'none',
                  padding: '0 12px',
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = accentRaw)}
                onBlur={(e) =>
                  (e.target.style.borderColor = 'var(--border-color, rgba(255,255,255,0.1))')
                }
              />
              <button
                onClick={() => adjustQuantity(1)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                  background: 'var(--bg-input, rgba(255,255,255,0.06))',
                  color: 'var(--text-primary, #fff)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'var(--bg-card-hover, rgba(255,255,255,0.1))')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'var(--bg-input, rgba(255,255,255,0.06))')
                }
              >
                <FiPlus />
              </button>
            </div>

            {/* Quick quantity pills */}
            <div
              style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
                marginBottom: 20,
              }}
            >
              {QUICK_QUANTITIES.map((q) => (
                <button
                  key={q}
                  onClick={() => setQuantity(String(q))}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 20,
                    border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                    background:
                      parsedQty === q
                        ? `${accentRaw}22`
                        : 'var(--bg-card, rgba(255,255,255,0.04))',
                    color:
                      parsedQty === q
                        ? accentColor
                        : 'var(--text-secondary, #aaa)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    borderColor:
                      parsedQty === q
                        ? accentColor
                        : 'var(--border-color, rgba(255,255,255,0.1))',
                  }}
                  onMouseEnter={(e) => {
                    if (parsedQty !== q) {
                      e.currentTarget.style.background = 'var(--bg-card-hover, rgba(255,255,255,0.08))';
                      e.currentTarget.style.color = accentColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (parsedQty !== q) {
                      e.currentTarget.style.background = 'var(--bg-card, rgba(255,255,255,0.04))';
                      e.currentTarget.style.color = 'var(--text-secondary, #aaa)';
                    }
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Order Type */}
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-secondary, #aaa)',
                marginBottom: 8,
              }}
            >
              Order Type
            </label>
            <div
              style={{
                display: 'flex',
                gap: 4,
                background: 'var(--bg-input, rgba(255,255,255,0.06))',
                borderRadius: 10,
                padding: 3,
                marginBottom: 16,
              }}
            >
              {[
                { key: 'market', label: 'Market Order' },
                { key: 'limit', label: 'Limit Order' },
              ].map((ot) => {
                const isActive = orderType === ot.key;
                return (
                  <button
                    key={ot.key}
                    onClick={() => setOrderType(ot.key)}
                    style={{
                      flex: 1,
                      padding: '8px 0',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: isActive ? accentColor : 'transparent',
                      color: isActive ? '#fff' : 'var(--text-muted, #888)',
                    }}
                  >
                    {ot.label}
                  </button>
                );
              })}
            </div>

            {/* Limit Price input */}
            {orderType === 'limit' && (
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--text-secondary, #aaa)',
                    marginBottom: 8,
                  }}
                >
                  Limit Price
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted, #666)',
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    placeholder={safePrice.toFixed(2)}
                    style={{
                      width: '100%',
                      height: 40,
                      borderRadius: 8,
                      border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                      background: 'var(--bg-input, rgba(255,255,255,0.06))',
                      color: 'var(--text-primary, #fff)',
                      fontSize: 15,
                      fontWeight: 600,
                      padding: '0 12px 0 26px',
                      outline: 'none',
                      fontFamily: "'SF Mono', 'Fira Code', monospace",
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = accentRaw)}
                    onBlur={(e) =>
                      (e.target.style.borderColor =
                        'var(--border-color, rgba(255,255,255,0.1))')
                    }
                  />
                </div>
              </div>
            )}

            {/* Estimated Cost / Revenue */}
            <div
              style={{
                background: `${accentRaw}0A`,
                border: `1px solid ${accentRaw}30`,
                borderRadius: 12,
                padding: '16px 20px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text-muted, #888)',
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                {isBuy ? (
                  <>
                    <FiArrowUpRight style={{ fontSize: 14 }} />
                    Estimated Cost
                  </>
                ) : (
                  <>
                    <FiArrowDownRight style={{ fontSize: 14 }} />
                    Estimated Revenue
                  </>
                )}
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: parsedQty > 0 ? accentColor : 'var(--text-muted, #666)',
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                  textShadow:
                    parsedQty > 0 ? `0 0 20px ${accentRaw}40` : 'none',
                  transition: 'color 0.2s, text-shadow 0.2s',
                }}
              >
                {formatCurrency(estimatedTotal)}
              </div>
              {parsedQty > 0 && (
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--text-muted, #666)',
                    marginTop: 4,
                  }}
                >
                  {parsedQty} share{parsedQty !== 1 ? 's' : ''} x{' '}
                  {formatCurrency(effectivePrice)}
                </div>
              )}
            </div>

            {/* Inline error message */}
            {(error || insufficientFunds || notEnoughShares) && (
              <div
                style={{
                  marginTop: 12,
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444',
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                {error || (insufficientFunds ? 'Insufficient balance for this trade' : 'You do not own enough shares')}
              </div>
            )}
          </div>

          {/* ---- Footer ---- */}
          <div
            style={{
              padding: '16px 20px 20px',
              borderTop: '1px solid var(--border-color, rgba(255,255,255,0.08))',
            }}
          >
            <button
              onClick={handleSubmit}
              disabled={isDisabled}
              style={{
                width: '100%',
                padding: '14px 0',
                border: isDisabled && (insufficientFunds || notEnoughShares)
                  ? '1px solid rgba(239, 68, 68, 0.4)'
                  : 'none',
                borderRadius: 10,
                background:
                  isDisabled ? 'var(--bg-input, rgba(255,255,255,0.08))' : accentColor,
                color: isDisabled
                  ? (insufficientFunds || notEnoughShares ? '#EF4444' : 'var(--text-muted, #666)')
                  : '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow:
                  !isDisabled ? `0 4px 16px ${accentRaw}40` : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.filter = 'brightness(0.9)';
                  e.currentTarget.style.boxShadow = `0 6px 24px ${accentRaw}55`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.filter = 'brightness(1)';
                  e.currentTarget.style.boxShadow = `0 4px 16px ${accentRaw}40`;
                }
              }}
            >
              {isBuy ? <FiShoppingCart /> : <FiDollarSign />}
              {insufficientFunds || notEnoughShares
                ? buttonLabel
                : `${buttonLabel} ${stock.symbol}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
