import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiTrendingUp,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden',
    },
    blob: {
      position: 'absolute',
      top: '10%',
      right: '-5%',
      width: '500px',
      height: '500px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(74, 222, 128, 0.12) 0%, transparent 70%)',
      pointerEvents: 'none',
      filter: 'blur(40px)',
    },
    blobSecond: {
      position: 'absolute',
      bottom: '-10%',
      left: '-8%',
      width: '400px',
      height: '400px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(74, 222, 128, 0.08) 0%, transparent 70%)',
      pointerEvents: 'none',
      filter: 'blur(60px)',
    },
    wrapper: {
      width: '100%',
      maxWidth: '440px',
      animation: 'fadeInUp 0.5s ease',
      position: 'relative',
      zIndex: 1,
    },
    header: {
      textAlign: 'center',
      marginBottom: '36px',
    },
    logoWrap: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '24px',
    },
    logoIcon: {
      filter: 'drop-shadow(0 0 8px rgba(74, 222, 128, 0.3))',
    },
    logoText: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: 'var(--accent)',
    },
    heading: {
      fontSize: '1.6rem',
      fontWeight: 700,
      color: 'var(--text-primary)',
      marginBottom: '8px',
    },
    subtitle: {
      color: 'var(--text-muted)',
      fontSize: '0.9rem',
    },
    card: {
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: 'var(--shadow-lg)',
    },
    fieldWrap: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '0.85rem',
      fontWeight: 500,
      color: 'var(--text-secondary)',
      marginBottom: '8px',
    },
    inputWrap: {
      position: 'relative',
    },
    inputIcon: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--text-muted)',
      fontSize: '1rem',
      pointerEvents: 'none',
    },
    togglePassword: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: 'var(--text-muted)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      padding: '4px',
      fontSize: '1rem',
    },
    errorBox: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '20px',
      color: 'var(--negative)',
      fontSize: '0.85rem',
    },
    submitBtn: {
      width: '100%',
      padding: '14px',
      fontSize: '0.95rem',
      fontWeight: 600,
      borderRadius: '12px',
      background: 'var(--accent)',
      color: '#FFFFFF',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
      transition: 'all 0.2s ease',
    },
    submitBtnDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    footer: {
      textAlign: 'center',
      marginTop: '24px',
      color: 'var(--text-muted)',
      fontSize: '0.9rem',
    },
    footerLink: {
      color: 'var(--accent)',
      fontWeight: 500,
      textDecoration: 'none',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.blob} />
      <div style={styles.blobSecond} />

      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoWrap}>
            <FiTrendingUp size={28} color="var(--accent)" style={styles.logoIcon} />
            <span style={styles.logoText}>StockAI</span>
          </div>
          <h1 style={styles.heading}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div style={styles.card}>
          <form onSubmit={handleLogin}>
            {/* Error Display */}
            {error && (
              <div style={styles.errorBox}>{error}</div>
            )}

            {/* Email */}
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrap}>
                <FiMail style={styles.inputIcon} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ ...styles.fieldWrap, marginBottom: '28px' }}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrap}>
                <FiLock style={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="input-field"
                  style={{ paddingLeft: '42px', paddingRight: '42px' }}
                />
                <button
                  type="button"
                  style={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                ...(loading ? styles.submitBtnDisabled : {}),
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'var(--accent-hover)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--accent)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {loading ? (
                <div className="spinner spinner-sm" style={{ borderTopColor: '#fff' }} />
              ) : (
                <>
                  <span>Continue</span>
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.footerLink}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
