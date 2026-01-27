const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Document = sequelize.define(
    "Document",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "User who uploaded the document",
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Original file name (resume.pdf)",
      },
      s3Key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: "S3 path (resumes/user123/uuid.pdf)",
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
      atsScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: "ATS score (0-100) after parsing",
      },
      atsAnalysis: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Detailed ATS analysis results",
      },
      keywords: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Extracted keywords from resume",
      },
      uploadSource: {
        type: DataTypes.ENUM("ats_checker", "profile", "job_application"),
        allowNull: false,
        defaultValue: "ats_checker",
        comment: "Where was the resume uploaded from",
      },
      uploadedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: "When the resume was uploaded",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true,
      tableName: "Documents",
    }
  );

  return Document;
};
