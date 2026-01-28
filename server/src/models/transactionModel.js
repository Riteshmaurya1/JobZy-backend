const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db-connection");

const Transaction = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transactionType: {
      type: DataTypes.ENUM(
        "payment_initiated",
        "payment_success",
        "payment_failed",
        "payment_refund",
        "subscription_renewal",
        "subscription_expiry",
        "subscription_downgrade",
        "subscription_upgrade"
      ),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Amount in paise for INR",
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "INR",
      allowNull: false,
    },
    planType: {
      type: DataTypes.ENUM("premium", "pro", "free"),
      allowNull: false,
    },
    planDuration: {
      type: DataTypes.ENUM("monthly", "yearly"),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: "Additional transaction details",
    },
    emailSentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    emailTemplate: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Template name used for email",
    },
    emailStatus: {
      type: DataTypes.ENUM("pending", "sent", "failed", "queued"),
      defaultValue: "pending",
      allowNull: false,
    },
    emailError: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    retryCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    lastRetryAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "success",
        "failed",
        "cancelled",
        "processing"
      ),
      defaultValue: "pending",
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    timestamps: true,
    tableName: "transactions",
    indexes: [
      {
        fields: ["userId"],
      },
      {
        unique: true,
        fields: ["orderId"],
      },
      {
        fields: ["transactionType"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["emailStatus"],
      },
      {
        fields: ["createdAt"],
      },
    ],
  }
);

module.exports = Transaction;
