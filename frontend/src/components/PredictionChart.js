import React, { useMemo } from 'react';
import {
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { format, parseISO, isValid } from 'date-fns';
import { FiActivity } from 'react-icons/fi';

const PredictionChart = ({
  actual = [],
  predicted = [],
  symbol = '',
  metrics = null,
  height = 400,
}) => {
  // Merge actual and predicted into one dataset
  const chartData = useMemo(() => {
    const dataMap = new Map();

    actual.forEach((item) => {
      const key = item.date || item.x;
      let dateLabel = key;
      try {
        const d = typeof key === 'string' ? parseISO(key) : new Date(key);
        if (isValid(d)) dateLabel = format(d, 'MMM dd');
      } catch (e) {}
      dataMap.set(key, {
        date: key,
        dateLabel,
        actual: parseFloat(item.close || item.y || item.price) || 0,
      });
    });

    predicted.forEach((item) => {
      const key = item.date || item.x;
      let dateLabel = key;
      try {
        const d = typeof key === 'string' ? parseISO(key) : new Date(key);
        if (isValid(d)) dateLabel = format(d, 'MMM dd');
      } catch (e) {}
      const existing = dataMap.get(key) || { date: key, dateLabel };
      const predValue = parseFloat(item.close || item.y || item.price || item.predicted) || 0;
      existing.predicted = predValue;
      const confidence = item.confidence || 0.03;
      existing.upperBand = predValue * (1 + confidence);
      existing.lowerBand = predValue * (1 - confidence);
      dataMap.set(key, existing);
    });

    return Array.from(dataMap.values()).sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    });
  }, [actual, predicted]);

  const r2Score = metrics?.r2 ? parseFloat(metrics.r2) : 0;
  const confidencePercent = Math.min(Math.round(r2Score * 100), 100);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    const data = payload[0]?.payload;
    return (
      <div style={{
        background: 'var(--bg-card, #1F2937)',
        border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
        borderLeft: '3px solid #4ADE80',
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
          {data?.dateLabel || label}
        </p>
        {data?.actual !== undefined && (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', marginBottom: '6px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
              <span style={{ width: '8px', height: '3px', background: '#4ADE80', borderRadius: '2px', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-muted, #4B5E50)' }}>Actual</span>
            </span>
            <span style={{ color: '#4ADE80', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              ${data.actual.toFixed(2)}
            </span>
          </div>
        )}
        {data?.predicted !== undefined && (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', marginBottom: '6px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
              <span style={{ width: '8px', height: '3px', background: '#FBBF24', borderRadius: '2px', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-muted, #4B5E50)' }}>Predicted</span>
            </span>
            <span style={{ color: '#FBBF24', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              ${data.predicted.toFixed(2)}
            </span>
          </div>
        )}
        {data?.actual !== undefined && data?.predicted !== undefined && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '24px',
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-color, rgba(255,255,255,0.06))',
          }}>
            <span style={{ color: 'var(--text-muted, #4B5E50)', fontSize: '0.75rem' }}>Difference</span>
            <span style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: data.predicted >= data.actual ? '#4ADE80' : '#EF4444',
            }}>
              {((data.predicted - data.actual) / data.actual * 100).toFixed(2)}%
            </span>
          </div>
        )}
      </div>
    );
  };

  if (chartData.length === 0) {
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
        <p>No prediction data available</p>
      </div>
    );
  }

  return (
    <div>
      {/* Chart Header */}
      {symbol && (
        <div style={{
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600 }}>
            {symbol} - Actual vs AI Prediction
          </h3>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 14, height: 3, background: '#4ADE80', borderRadius: 2 }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Actual</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 14, height: 3, background: '#FBBF24', borderRadius: 2, borderTop: '1px dashed #FBBF24' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Predicted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: 14,
                height: 10,
                background: 'rgba(74, 222, 128, 0.1)',
                borderRadius: 2,
                border: '1px solid rgba(74, 222, 128, 0.2)',
              }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Confidence</span>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ADE80" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#4ADE80" stopOpacity={0.02} />
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
            tick={{ fill: 'var(--text-muted, #4B5E50)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `$${val}`}
            width={65}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* Confidence Band */}
          <Area
            type="monotone"
            dataKey="upperBand"
            stroke="none"
            fill="url(#confidenceGradient)"
            fillOpacity={1}
            connectNulls={false}
          />
          <Area
            type="monotone"
            dataKey="lowerBand"
            stroke="none"
            fill="var(--bg-card, #1F2937)"
            fillOpacity={1}
            connectNulls={false}
          />
          {/* Actual Line */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#4ADE80"
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 6,
              fill: '#4ADE80',
              stroke: 'var(--bg-primary, #0B0F0C)',
              strokeWidth: 3,
            }}
            connectNulls={false}
          />
          {/* Predicted Line */}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#FBBF24"
            strokeWidth={2.5}
            strokeDasharray="6 3"
            dot={false}
            activeDot={{
              r: 6,
              fill: '#FBBF24',
              stroke: 'var(--bg-primary, #0B0F0C)',
              strokeWidth: 3,
            }}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Model Metrics + AI Confidence Bar */}
      {metrics && (
        <div style={{ marginTop: '24px' }}>
          {/* Metrics Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginBottom: '16px',
          }}>
            {[
              { label: 'RMSE', value: parseFloat(metrics.rmse).toFixed(4), color: '#4ADE80' },
              { label: 'MAE', value: parseFloat(metrics.mae).toFixed(4), color: '#FBBF24' },
              { label: 'R2 Score', value: parseFloat(metrics.r2).toFixed(4), color: '#22C55E' },
              { label: 'MAPE', value: `${parseFloat(metrics.mape).toFixed(2)}%`, color: 'var(--accent-purple, #bb86fc)' },
            ].map((metric, i) => (
              <div key={i} style={{
                padding: '16px',
                background: 'var(--bg-primary)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
              }}>
                <p style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '6px',
                  fontWeight: 600,
                }}>
                  {metric.label}
                </p>
                <p style={{
                  fontSize: '1.15rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: metric.color,
                }}>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          {/* AI Confidence Horizontal Bar */}
          <div style={{
            padding: '18px 20px',
            background: 'var(--bg-primary)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiActivity size={14} color="var(--accent, #4ADE80)" />
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}>
                  AI Confidence
                </span>
              </div>
              <span style={{
                fontSize: '0.92rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: confidencePercent >= 90 ? '#4ADE80' : confidencePercent >= 75 ? '#FBBF24' : '#EF4444',
              }}>
                {confidencePercent}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '10px',
              borderRadius: '5px',
              background: 'var(--bg-card, #1F2937)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${confidencePercent}%`,
                borderRadius: '5px',
                background: confidencePercent >= 90
                  ? 'linear-gradient(90deg, #22C55E, #4ADE80)'
                  : confidencePercent >= 75
                    ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                    : 'linear-gradient(90deg, #DC2626, #EF4444)',
                transition: 'width 1s ease-out',
                boxShadow: confidencePercent >= 90
                  ? '0 0 10px rgba(74, 222, 128, 0.3)'
                  : confidencePercent >= 75
                    ? '0 0 10px rgba(251, 191, 36, 0.3)'
                    : '0 0 10px rgba(239, 68, 68, 0.3)',
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionChart;
