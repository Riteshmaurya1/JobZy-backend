const logger = require("../utils/logger");

const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === "production";

  // 🔴 LOG ERROR (important)
  logger.error(
    {
      err: {
        message: err.message,
        stack: err.stack,
      },
      method: req.method,
      path: req.originalUrl,
      userId: req.user?.id || null,
      statusCode,
    },
    "Unhandled API Error"
  );

  // 🔵 SEND SAFE RESPONSE
  res.status(statusCode).json({
    success: false,
    message: isProd ? "Something went wrong" : err.message,
  });
};

module.exports = globalErrorHandler;
