const rateLimit = require("express-rate-limit");

// Define API rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: {
    success: false,
    message: "Too many authentication attempts. Try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "development",
});

module.exports = {apiLimiter,authLimiter};
