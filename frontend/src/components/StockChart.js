import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO, isValid } from 'date-fns';

const TIME_RANGES = ['1W', '1M', '3M', '6M', '1Y'];

const StockChart = ({ data = [], symbol = '', height = 400, onRangeChange }) => {
  const [activeRange, setActiveRange] = useState('1M');

  const handleRangeChange = (range) => {
    setActiveRange(range);
    if (onRangeChange) {
      onRangeChange(range);
    }
  };

  // Determine trend
  const trend = useMemo(() => {
    if (!data || data.length < 2) return 'neutral';
    const first = data[0]?.close || 0;
    const last = data[data.length - 1]?.close || 0;
    return last >= first ? 'up' : 'down';
  }, [data]);

  const isPositive = trend === 'up';
  const lineColor = isPositive ? '#4ADE80' : '#EF4444';
  const lineColorFaded = isPositive ? 'rgba(74, 222, 128, 0.08)' : 'rgba(239, 68, 68, 0.08)';

  // Format data for chart
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item) => {
      let dateLabel = item.date;
      try {
        const d = typeof item.date === 'string' ? parseISO(item.date) : new Date(item.date);
        if (isValid(d)) {
          dateLabel = format(d, 'MMM dd');
        }
      } catch (e) {
        // keep original
      }
      return {
        ...item,
        dateLabel,
        close: parseFloat(item.close) || 0,
        open: parseFloat(item.open) || 0,
        high: parseFloat(item.high) || 0,
        low: parseFloat(item.low) || 0,
        volume: parseInt(item.volume) || 0,
      };
    });
  }, [data]);

  // Y-axis domain with padding
  const [yMin, yMax] = useMemo(() => {
    if (chartData.length === 0) return [0, 100];
    const closes = chartData.map((d) => d.close).filter((c) => c > 0);
    if (closes.length === 0) return [0, 100];
    const min = Math.min(...closes);
    const max = Math.max(...closes);
    const padding = (max - min) * 0.1 || max * 0.05;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    const d = payload[0]?.payload;
    if (!d) return null;

    return (
      <div style={{
        background: 'var(--bg-card, #1F2937)',
        border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
        borderLeft: `3px solid ${lineColor}`,
        borderRadius: '10px',
        padding: '14px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        minWidth: '190px',
        backdropFilter: 'blur(12px)',
      }}>
        <p style={{
          color: 'var(--text-muted, #4B5E50)',
          fontSize: '0.75rem',
          marginBottom: '10px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {d.dateLabel || label}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
          {d.open > 0 && (
            <>
              <span style={{ color: 'var(--text-muted, #4B5E50)', fontSize: '0.8rem' }}>Open</span>
              <span style={{ color: 'var(--text-primary, #E8ECE9)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                ${d.open.toFixed(2)}
              </span>
            </>
          )}
          <span style={{ color: 'var(--text-muted, #4B5E50)', fontSize: '0.8rem' }}>Close</span>
          <span style={{ color: lineColor, fontSize: '0.8rem', fontFamily: 'var(--font-mono)', textAlign: 'right', fontWeight: 600 }}>
            ${d.close.toFixed(2)}
          </span>
          {d.high > 0 && (
            <>
              <span style={{ color: 'var(--text-muted, #4B5E50)', fontSize: '0.8rem' }}>High</span>
              <span style={{ color: '#4ADE80', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                ${d.high.toFixed(2)}
              </span>
            </>
          )}
          {d.low > 0 && (
            <>
              <span style={{ color: 'var(--text-muted, #4B5E50)', fontSize: '0.8rem' }}>Low</span>
              <span style={{ color: '#EF4444', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                ${d.low.toFixed(2)}
              </span>
            </>
          )}
          {d.volume > 0 && (
            <>
              <span style={{ color: 'var(--text-muted, #4B5E50)', fontSize: '0.8rem' }}>Volume</span>
              <span style={{ color: 'var(--text-primary, #E8ECE9)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                {(d.volume / 1e6).toFixed(2)}M
              </span>
            </>
          )}
        </div>
      </div>
    );
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div style={{
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        background: 'var(--bg-card)',
        borderRadius: '14px',
        border: '1px solid var(--border-color)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>No chart data available</p>
          <p style={{ fontSize: '0.85rem' }}>Try selecting a different time range</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Time Range Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        {symbol && (
          <h3 style={{
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            fontWeight: 600,
          }}>
            {symbol} Price Chart
          </h3>
        )}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'var(--bg-primary)',
          borderRadius: '10px',
          padding: '3px',
          border: '1px solid var(--border-color)',
        }}>
          {TIME_RANGES.map((range) => (
            <button
              key={range}
              onClick={() => handleRangeChange(range)}
              style={{
                padding: '7px 16px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-mono)',
                background: activeRange === range ? 'var(--accent)' : 'transparent',
                color: activeRange === range ? '#0B0F0C' : 'var(--text-muted)',
              }}
              onMouseEnter={(e) => {
                if (activeRange !== range) {
                  e.currentTarget.style.background = 'var(--accent-bg)';
                  e.currentTarget.style.color = 'var(--accent)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeRange !== range) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.2} />
              <stop offset="40%" stopColor={lineColor} stopOpacity={0.08} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border-color, rgba(255,255,255,0.04))"
            vertical={false}
          />
          <XAxis
            dataKey="dateLabel"
            tick={{ fill: 'var(--text-muted, #4B5E50)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
            axisLine={{ stroke: 'var(--border-color, rgba(255,255,255,0.05))' }}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={40}
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fill: 'var(--text-muted, #4B5E50)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `$${val}`}
            width={65}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="close"
            stroke={lineColor}
            strokeWidth={2.5}
            fill={`url(#gradient-${symbol})`}
            dot={false}
            activeDot={{
              r: 6,
              fill: lineColor,
              stroke: 'var(--bg-primary, #0B0F0C)',
              strokeWidth: 3,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
