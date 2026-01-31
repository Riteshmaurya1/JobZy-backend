const { Sequelize } = require("sequelize");
const logger = require("../logger/logger");

const isRDS = process.env.HOST_NAME?.includes("rds.amazonaws.com");

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER_NAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.HOST_NAME,
    port: process.env.DATABASE_PORT,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
    // dialectOptions: {
    //   ssl:
    //     process.env.NODE_ENV === "production"
    //       ? {
    //           require: true,
    //           rejectUnauthorized: false,
    //         }
    //       : false,
    // },
    dialectOptions: {
      ssl: isRDS
        ? {
            require: true,
            rejectUnauthorized: false, // OK for now
          }
        : false,
    },
  },
);

(async () => {
  try {
    await sequelize.authenticate();
    logger.info("📙 Database connected successfully.");

    // Test a simple query
    await sequelize.query("SELECT 1+1 AS result");
    logger.info("✅ Database query test passed.");
  } catch (error) {
    logger.error("❌ Database connection failed:", error.message);
    logger.error("Stack:", error.stack);
    console.error(error);

    // ✅ Exit process if database fails in production
    if (process.env.NODE_ENV === "production") {
      logger.error("🛑 Exiting process due to database connection failure");
      console.error(error);
      process.exit(1);
    } else {
      logger.warn("⚠️ Development mode - continuing without database");
    }
  }
})();

// ✅ Handle unexpected disconnections during runtime (proper way)
sequelize.addHook("beforeConnect", async (config) => {
  logger.debug("Attempting database connection...");
});

sequelize.addHook("afterConnect", async (connection, config) => {
  logger.debug("Database connection established.");
});

// ✅ Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("🛑 SIGTERM received. Closing database connections...");
  try {
    await sequelize.close();
    logger.info("✅ Database connections closed.");
    process.exit(0);
  } catch (error) {
    logger.error("❌ Error closing database connections:", error);
    process.exit(1);
  }
});

process.on("SIGINT", async () => {
  logger.info("🛑 SIGINT received. Closing database connections...");
  try {
    await sequelize.close();
    logger.info("✅ Database connections closed.");
    process.exit(0);
  } catch (error) {
    logger.error("❌ Error closing database connections:", error);
    process.exit(1);
  }
});

module.exports = sequelize;
