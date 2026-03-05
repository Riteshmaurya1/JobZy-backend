const rateLimit = require("express-rate-limit");

// Define API rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 500,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Define authentication rate limiting middleware
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 500,
  message: {
    success: false,
    message: "Too many authentication attempts. Try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "development",
});

// Define upload rate limiting middleware
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: {
    success: false,
    message: "Upload limit reached. Please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Define payment rate limiting middleware
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: {
    success: false,
    message: "Too many payment requests. Please contact support",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
  paymentLimiter,
};
