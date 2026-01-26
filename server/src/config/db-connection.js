const { Sequelize } = require("sequelize");
const logger = require("../logger/logger");

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER_NAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.HOST_NAME,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl:
        process.env.NODE_ENV === "production"
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : false,
    },
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    logger.info("📙 Database connected.");
  } catch (error) {
     logger.error(error, "Unable to connect to the database");
  }
})();

module.exports = sequelize;
