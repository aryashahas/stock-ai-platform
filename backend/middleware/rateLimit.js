const rateLimit = require('express-rate-limit');

/**
 * General rate limiter for all routes.
 * 1000 requests per 15 minutes per IP.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  keyGenerator: (req) => req.ip,
});

/**
 * Auth rate limiter for login/register endpoints.
 * 100 requests per 15 minutes per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
  keyGenerator: (req) => req.ip,
});

/**
 * API rate limiter for stock API endpoints.
 * 500 requests per 15 minutes per IP.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many API requests. Please try again after 15 minutes.',
  },
  keyGenerator: (req) => req.ip,
});

module.exports = {
  generalLimiter,
  authLimiter,
  apiLimiter,
};
