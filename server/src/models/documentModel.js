const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db-connection");

const Document = sequelize.define(
  "Document",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: "User who owns the document",
    },

    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Original file name (resume.pdf)",
    },

    s3Key: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "S3 object key (resumes/userId/uuid.pdf)",
    },

    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "File size in bytes",
    },

    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "MIME type (application/pdf)",
    },

    uploadSource: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ats_checker",
      comment: "Source of document upload",
    },

    // ===== ATS RELATED =====
    atsScore: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "ATS score (0-100)",
    },

    atsAnalysis: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Full ATS analysis payload",
    },

    keywords: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Extracted keywords",
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
      comment: "Logical document state",
    },
  },
  {
    tableName: "documents",
    timestamps: true,
    indexes: [
      { fields: ["userId"] },
      { fields: ["atsScore"] },
      { fields: ["uploadSource"] },
      { fields: ["status"] },
      { fields: ["s3Key"] },
    ],
  },
);

module.exports = Document;
