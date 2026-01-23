require("dotenv").config();
const PORT = process.env.PORT || 4000;

const express = require("express");
const app = express();
const cors = require("cors");

const globalErrorHandler = require("./src/middleware/globalErrorHandler");
const logger = require("./src/utils/logger");

// sirf import – yahan db ka config run ho jayega
const db = require("./src/config/db-connection");

const { startWorker } = require("./src/jobs/customEmailWorker");

// Routes
const authRouter = require("./src/routes/authRouter");
const profileRouter = require("./src/routes/profileRouter");
const interviewRouter = require("./src/routes/interviewRouter");
const jobRouter = require("./src/routes/jobRouter");
const atsRouter = require("./src/routes/atsRouter");
const dashboardRouter = require("./src/routes/dashboardRouter");
const loggerMiddleware = require("./src/middleware/loggermiddleware");

// CORS (prod)
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("Server is running!.");
});

// Logger middleware
app.use(loggerMiddleware);

// Routes
app.use("/api/v1", authRouter);
app.use("/api/v1", profileRouter);
app.use("/api/v1", jobRouter);
app.use("/api/v1", interviewRouter);
app.use("/api/v1", atsRouter);
app.use("/api/v1", dashboardRouter);

// Worker & cron
startWorker();
require("./src/cron/emailReminders");

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
    await db.authenticate({alter: true});
    app.listen(PORT, () => {
      logger.info(`🌎 Server is connected on ${PORT}.`);
    });
  } catch (error) {
    logger.error(error, "Server start failed");
    process.exit(1);
  }
})();
