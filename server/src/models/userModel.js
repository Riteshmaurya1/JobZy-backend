const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db-connection");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    primaryRole: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentGoal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tier: {
      type: DataTypes.ENUM("free", "premium", "pro"),
      defaultValue: "free",
    },

    monthlyJobsUsed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    totalInterviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    totalNotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    monthlyAIResumes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    monthlyATSChecks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    monthlyEmailsSent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    lastReset: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
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
    tableName: "users",
    indexes: [
      {
        unique: true,
        fields: ["email"], // Index for faster email lookups
      },
    ],
  }
);

module.exports = User;
