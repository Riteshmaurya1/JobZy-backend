const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db-connection");

const Payment = sequelize.define(
  "Payment",
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
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "INR",
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "successful",
        "pending",
        "authorized",
        "created",
        "failed",
        "refunded"
      ),
      defaultValue: "created",
      allowNull: false,
    },
    planType: {
      type: DataTypes.ENUM("premium", "pro"),
      allowNull: false,
    },
    planDuration: {
      type: DataTypes.ENUM("monthly", "yearly"),
      defaultValue: "monthly",
      allowNull: false,
    },
    razorpaySignature: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    receipt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    errorCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    errorDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    refundId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refundAmount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    refundReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: "payments",
    indexes: [
      {
        fields: ["userId"],
      },
      {
        unique: true,
        fields: ["orderId"],
      },
      {
        unique: true,
        fields: ["paymentId"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["planType"],
      },
    ],
  }
);

module.exports = Payment;
