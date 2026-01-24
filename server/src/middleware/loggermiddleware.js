const logger = require("../logger/logger");

const loggerMiddleware = (req, res, next) => {
  logger.info(
    {
      method: req.method,
      url: req.url,
      userId: req.user?.id,
    },
    "Incoming request"
  );
  next();
};

module.exports = loggerMiddleware;
