const pino =   require('pino');

const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  base: {
    app: "jobzy-backend",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

module.exports = logger;
