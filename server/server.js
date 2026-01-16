require("dotenv").config();
const PORT = process.env.PORT || 4000;
const express = require("express");
const app = express();
const cors = require("cors");
const globalErrorHandler = require("./src/middleware/globalErrorHandler");

const db = require("./src/config/db-connection");
const { startWorker } = require("./src/jobs/customEmailWorker");
const logger = require("./src/utils/logger");

// Import Routes
const authRouter = require("./src/routes/authRouter");
const profileRouter = require("./src/routes/profileRouter");
const interviewRouter = require("./src/routes/interviewRouter");
const jobRouter = require("./src/routes/jobRouter");
const atsRouter = require("./src/routes/atsRouter");
const dashboardRouter = require("./src/routes/dashboardRouter");

// Use In production.
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400
};
app.use(cors(corsOptions));

// Main Middlewares.
app.use(express.json());

// Default checking route.
app.get("/", (req, res) => {
  res.send("Server is running!.");
});

// Custom Routes.
app.use("/api/v1", authRouter);
app.use("/api/v1", profileRouter);
app.use("/api/v1", jobRouter);
app.use("/api/v1", interviewRouter);
app.use("/api/v1", atsRouter);
app.use("/api/v1", dashboardRouter);

// Start email queue worker
startWorker();

// Start Cron for email reminders
require("./src/cron/emailReminders");

// Global error handler.
app.use(globalErrorHandler);

// Logger middleware
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    userId: req.user?.id,
  }, "Incoming request");

  next();
});

(async () => {
  try {
    await db.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`🌎 Server is connected on ${PORT}.`);
    });
  } catch (error) {
    console.log(error);
  }
})();
