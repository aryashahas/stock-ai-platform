import React, { useState, useEffect } from 'react';
import {
  FiHelpCircle,
  FiX,
  FiBarChart2,
  FiTrendingUp,
  FiCpu,
  FiStar,
  FiDollarSign,
  FiSun,
} from 'react-icons/fi';

const STORAGE_KEY = 'stockai_help_seen';

const steps = [
  {
    icon: FiBarChart2,
    title: 'Dashboard',
    description:
      'View real-time stock prices, market indices, and top movers. Click any stock to see details.',
    color: '#4ADE80',
  },
  {
    icon: FiTrendingUp,
    title: 'Stock Details',
    description:
      'Click on any stock to see interactive charts, price history, and detailed statistics.',
    color: '#38BDF8',
  },
  {
    icon: FiCpu,
    title: 'AI Predictions',
    description:
      'Get LSTM neural network predictions for any stock. See 30-day price forecasts with confidence scores.',
    color: '#A78BFA',
  },
  {
    icon: FiStar,
    title: 'Watchlist',
    description:
      'Save your favorite stocks to track them easily. Add stocks from the dashboard or stock detail pages.',
    color: '#FBBF24',
  },
  {
    icon: FiDollarSign,
    title: 'Buy & Sell',
    description:
      'Practice trading with our simulated buy/sell feature. Track your virtual portfolio performance.',
    color: '#4ADE80',
  },
  {
    icon: FiSun,
    title: 'Dark/Light Mode',
    description:
      'Toggle between dark and light themes using the sun/moon icon in the navigation bar.',
    color: '#FB923C',
  },
];

const pulseKeyframes = `
@keyframes helpPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.5);
  }
  70% {
    box-shadow: 0 0 0 14px rgba(74, 222, 128, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(74, 222, 128, 0);
  }
}
@keyframes helpModalIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes helpOverlayIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`;

export default function HelpGuide() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  return (
    <>
      {/* Inject keyframes */}
      <style>{pulseKeyframes}</style>

      {/* ---- Floating Button ---- */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open help guide"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 9999,
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--accent, #4ADE80)',
          color: '#fff',
          fontSize: 28,
          boxShadow: 'var(--shadow-lg, 0 4px 24px rgba(0,0,0,0.25))',
          animation: 'helpPulse 2s infinite',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <FiHelpCircle />
      </button>

      {/* ---- Modal ---- */}
      {isOpen && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            animation: 'helpOverlayIn 0.25s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '92vw',
              maxWidth: 520,
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--bg-card, #1E1E2E)',
              borderRadius: 16,
              boxShadow: 'var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.4))',
              border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
              animation: 'helpModalIn 0.3s ease',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '24px 24px 16px',
                borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.08))',
                position: 'relative',
              }}
            >
              <button
                onClick={handleClose}
                aria-label="Close help guide"
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
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
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 700,
                  color: 'var(--text-primary, #fff)',
                }}
              >
                Welcome to StockAI
              </h2>
              <p
                style={{
                  margin: '6px 0 0',
                  fontSize: 14,
                  color: 'var(--text-secondary, #aaa)',
                }}
              >
                Your AI-powered stock analysis companion
              </p>
            </div>

            {/* Scrollable content */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '8px 24px',
              }}
            >
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 16,
                      padding: '16px 0',
                      borderBottom:
                        idx < steps.length - 1
                          ? '1px solid var(--border-color, rgba(255,255,255,0.06))'
                          : 'none',
                    }}
                  >
                    {/* Number + Icon circle */}
                    <div
                      style={{
                        flexShrink: 0,
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: `${step.color}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: step.color,
                        fontSize: 20,
                        position: 'relative',
                      }}
                    >
                      <Icon />
                      <span
                        style={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: step.color,
                          color: '#fff',
                          fontSize: 10,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: 1,
                        }}
                      >
                        {idx + 1}
                      </span>
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 15,
                          color: 'var(--text-primary, #fff)',
                          marginBottom: 4,
                        }}
                      >
                        {step.title}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          lineHeight: 1.5,
                          color: 'var(--text-secondary, #aaa)',
                        }}
                      >
                        {step.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '16px 24px 20px',
                borderTop: '1px solid var(--border-color, rgba(255,255,255,0.08))',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <button
                onClick={handleClose}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  border: 'none',
                  borderRadius: 10,
                  background: 'var(--accent, #4ADE80)',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s, box-shadow 0.2s',
                  boxShadow: '0 0 16px rgba(74, 222, 128, 0.25)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(74, 222, 128, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(74, 222, 128, 0.25)';
                }}
              >
                Got it!
              </button>
              <span
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted, #666)',
                }}
              >
                You can access this guide anytime from the help button
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
