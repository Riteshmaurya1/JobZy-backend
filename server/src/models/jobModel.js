const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db-connection");

const Job = sequelize.define(
  "Job",
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
      onDelete: "CASCADE", // Delete jobs when user is deleted
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jobLink: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    workMode: {
      type: DataTypes.ENUM("remote", "onsite", "hybrid"),
      defaultValue: "onsite",
    },
    jobType: {
      type: DataTypes.ENUM("full-time", "part-time", "contract", "internship"),
      defaultValue: "full-time",
    },
    salary: {
      type: DataTypes.STRING, // "10-15 LPA" or "Not disclosed"
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "applied",
        "screening",
        "interview-scheduled",
        "interviewed",
        "offered",
        "rejected",
        "accepted",
        "withdrawn"
      ),
      defaultValue: "applied",
    },
    appliedDate: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    platform: {
      type: DataTypes.STRING, // "LinkedIn", "Naukri", "Company Site"
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    resumeVersion: {
      type: DataTypes.STRING, // "Backend_Resume_v2.pdf"
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
    tableName: "jobs",
    indexes: [
      { fields: ["userId"] }, // Fast user job lookup
      { fields: ["status"] }, // Filter by status
      { fields: ["appliedDate"] }, // Sort by date
      { fields: ["userId", "company"] }, // Duplicate check
    ],
  }
);

module.exports = Job;
