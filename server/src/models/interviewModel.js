const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db-connection");

const Interview = sequelize.define(
  "Interview",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    jobId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "jobs",
        key: "id",
      },
      onDelete: "CASCADE", // Delete interview when job is deleted
    },
    round: {
      type: DataTypes.STRING, // "HR Round", "Technical Round 1", "Final Round"
      allowNull: false,
    },
    interviewDate: {
      type: DataTypes.DATEONLY, // "2026-01-10"
      allowNull: false,
    },
    interviewTime: {
      type: DataTypes.TIME, // "10:30:00"
      allowNull: true,
    },
    interviewMode: {
      type: DataTypes.ENUM("video-call", "phone", "in-person"),
      defaultValue: "video-call",
    },
    meetingLink: {
      type: DataTypes.TEXT, // Zoom/Google Meet link
      allowNull: true,
    },
    interviewerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    interviewerEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "scheduled",
        "completed",
        "cancelled",
        "rescheduled"
      ),
      defaultValue: "scheduled",
    },
    reminderSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    reminderSentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    followUpDate: {
      type: DataTypes.DATE, // When to send follow-up email
      allowNull: true,
    },
    followUpSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    followUpSentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
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
    tableName: "interviews",
    indexes: [
      { fields: ["jobId"] }, // Fast job interview lookup
      { fields: ["interviewDate"] }, // Date queries
      { fields: ["reminderSent"] }, // Pending reminders
      { fields: ["followUpSent"] }, // Pending follow-ups
      { fields: ["status"] }, // Filter by status
    ],
  }
);

module.exports = Interview;
