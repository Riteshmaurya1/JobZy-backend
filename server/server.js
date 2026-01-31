require("dotenv").config();
const PORT = process.env.PORT || 4000;

const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const logger = require("./src/logger/logger");

const db = require("./src/config/db-connection");
const globalErrorHandler = require("./src/middleware/globalErrorHandler");
const loggerMiddleware = require("./src/middleware/loggermiddleware");
const { apiLimiter } = require("./src/middleware/api-limiter");

// Workers and Jobs
const { startWorker } = require("./src/jobs/customEmailWorker");

// Routes
const authRouter = require("./src/routes/authRouter");
const profileRouter = require("./src/routes/profileRouter");
const interviewRouter = require("./src/routes/interviewRouter");
const jobRouter = require("./src/routes/jobRouter");
const atsRouter = require("./src/routes/atsRouter");
const dashboardRouter = require("./src/routes/dashboardRouter");
const paymentRouter = require("./src/routes/paymentRouter");
const documentRouter = require("./src/routes/documentRouter");

// CORS
const isDevelopment =
  process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = {
  development: ["http://localhost:5500", "http://127.0.0.1:5500"],
  production: ["https://jobzy.site", "https://www.jobzy.site"],
};

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    const allowedList = isDevelopment
      ? allowedOrigins.development
      : allowedOrigins.production;

    // In development, allow all localhost origins and file:// protocol
    if (isDevelopment) {
      if (
        origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.0.0.1") ||
        origin === "file://"
      ) {
        return callback(null, true);
      }
    }

    // In production, only allow specific origins
    if (allowedList.includes(origin)) {
      return callback(null, true);
    }

    // Log unauthorized CORS attempts in production only
    if (isProduction) {
      console.warn(`CORS blocked request from origin: ${origin}`);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default route
app.get("/", (req, res) => {
  res.send("Server is running!.");
});

// Health check route
app.get("/health", async (req, res) => {
  try {
    // Check database connection
    await db.authenticate();

    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: "Database connection failed",
    });
  }
});

// Logger middleware
app.use(loggerMiddleware);

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  }),
);

// Routes
app.use("/api/v1", authRouter);

app.use(apiLimiter);

app.use("/api/v1", profileRouter);
app.use("/api/v1", jobRouter);
app.use("/api/v1", interviewRouter);
app.use("/api/v1", atsRouter);
app.use("/api/v1", dashboardRouter);
app.use("/api/v1", paymentRouter);
app.use("/api/v1", documentRouter);

// Worker
startWorker();

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use(globalErrorHandler);

(async () => {
  try {
    await db.sync({ alter: true });
    app.listen(PORT, () => {
      logger.info(`🌎 Server is connected on ${PORT}.`);
    });
  } catch (error) {
    logger.error(error, "Server start failed");
    process.exit(1);
  }
})();
