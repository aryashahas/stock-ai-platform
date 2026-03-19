import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiUser,
  FiMail,
  FiLock,
  FiTrendingUp,
  FiEye,
  FiEyeOff,
  FiCheck,
} from 'react-icons/fi';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return { level: 0, text: '', color: 'var(--border-color)' };
    if (password.length < 6) return { level: 1, text: 'Weak', color: 'var(--negative)' };
    if (password.length < 8) return { level: 2, text: 'Fair', color: '#EAB308' };
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (score >= 2 && password.length >= 8) return { level: 4, text: 'Strong', color: 'var(--accent)' };
    if (score >= 1) return { level: 3, text: 'Good', color: '#4ADE80' };
    return { level: 2, text: 'Fair', color: '#EAB308' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
      top: '-10%',
      left: '-8%',
      width: '500px',
      height: '500px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(74, 222, 128, 0.12) 0%, transparent 70%)',
      pointerEvents: 'none',
      filter: 'blur(40px)',
    },
    blobSecond: {
      position: 'absolute',
      bottom: '-15%',
      right: '-5%',
      width: '450px',
      height: '450px',
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
      marginBottom: '18px',
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
    strengthWrap: {
      marginBottom: '18px',
    },
    strengthBars: {
      display: 'flex',
      gap: '4px',
      marginBottom: '4px',
    },
    strengthLabel: {
      fontSize: '0.75rem',
      textAlign: 'right',
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
          <h1 style={styles.heading}>Create Account</h1>
          <p style={styles.subtitle}>Start your investment journey</p>
        </div>

        {/* Card */}
        <div style={styles.card}>
          <form onSubmit={handleSubmit}>
            {/* Error Display */}
            {error && (
              <div style={styles.errorBox}>{error}</div>
            )}

            {/* Full Name */}
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrap}>
                <FiUser style={styles.inputIcon} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>

            {/* Email */}
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrap}>
                <FiMail style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '8px' }}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrap}>
                <FiLock style={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
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

            {/* Password Strength Indicator */}
            {formData.password && (
              <div style={styles.strengthWrap}>
                <div style={styles.strengthBars}>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: '3px',
                        borderRadius: '2px',
                        background: i <= strength.level ? strength.color : 'var(--border-color)',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                </div>
                <p style={{ ...styles.strengthLabel, color: strength.color }}>
                  {strength.text}
                </p>
              </div>
            )}

            {/* Confirm Password */}
            <div style={{ marginBottom: '28px' }}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.inputWrap}>
                <FiLock style={styles.inputIcon} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                  className="input-field"
                  style={{ paddingLeft: '42px', paddingRight: '42px' }}
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword ? (
                  <span
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <FiCheck />
                  </span>
                ) : (
                  <button
                    type="button"
                    style={styles.togglePassword}
                    onClick={() => setShowConfirm(!showConfirm)}
                    tabIndex={-1}
                  >
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                )}
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
                <span>Create Account</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.footerLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
