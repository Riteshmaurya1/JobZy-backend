const {
  uploadResumeToS3,
  generateSignedDownloadUrl,
  deleteResumeFromS3,
} = require("../services/s3Service");
const db = require("../models");
const logger = require("../logger/logger");
const { Document } = db;

// POST /api/v1/documents/upload
const uploadResumeForATS = async (req, res) => {
  try {
    const userId = req.payload.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Upload to S3
    const uploadResult = await uploadResumeToS3(req.file, userId);

    // Save document metadata to database
    const document = await Document.create({
      userId: userId,
      fileName: uploadResult.fileName,
      s3Key: uploadResult.s3Key,
      fileSize: uploadResult.fileSize,
      fileType: req.file.mimetype,
      uploadSource: "ats_checker",
    });

    logger.info(` Document uploaded for ATS: ${document.id}`);

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully for ATS checking",
      data: {
        documentId: document.id,
        fileName: document.fileName,
        fileSize: document.fileSize,
        atsScore: document.atsScore,
      },
    });
  } catch (error) {
    logger.error("❌ Upload Resume Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload resume",
    });
  }
};

// GET /api/v1/documents
const getAllDocuments = async (req, res) => {
  try {
    const userId = req.payload.id;
    const { uploadSource, sortBy = "createdAt", order = "DESC" } = req.query;

    // Build filter
    const where = { userId };
    if (uploadSource) {
      where.uploadSource = uploadSource;
    }

    // Get all documents
    const documents = await Document.findAll({
      where: where,
      order: [[sortBy, order]],
      attributes: [
        "id",
        "fileName",
        "fileSize",
        "atsScore",
        "uploadSource",
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        totalDocuments: documents.length,
        documents: documents,
      },
    });
  } catch (error) {
    logger.error("❌ Get Documents Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch documents",
    });
  }
};

// GET /api/v1/documents/:documentId
const getDocumentDetails = async (req, res) => {
  try {
    const userId = req.payload.id;
    const { documentId } = req.params;

    const document = await Document.findOne({
      where: { id: documentId, userId: userId },
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: document.id,
        fileName: document.fileName,
        fileSize: document.fileSize,
        fileType: document.fileType,
        atsScore: document.atsScore,
        atsAnalysis: document.atsAnalysis,
        keywords: document.keywords,
        uploadSource: document.uploadSource,
      },
    });
  } catch (error) {
    logger.error("❌ Get Document Details Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch document details",
    });
  }
};

// GET /api/v1/documents/:documentId/download-url
const getDocumentDownloadUrl = async (req, res) => {
  try {
    const userId = req.payload.id;
    const { documentId } = req.params;

    const document = await Document.findOne({
      where: { id: documentId, userId: userId },
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Generate signed URL (valid for 1 hour)
    const signedUrl = await generateSignedDownloadUrl(document.s3Key, 3600);

    res.status(200).json({
      success: true,
      data: {
        downloadUrl: signedUrl,
        fileName: document.fileName,
        expiresIn: 3600,
      },
    });
  } catch (error) {
    logger.error("❌ Get Download URL Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate download URL",
    });
  }
};

//  DELETE /api/v1/documents/:documentId
const deleteDocument = async (req, res) => {
  try {
    const userId = req.payload.id;
    const { documentId } = req.params;

    const document = await Document.findOne({
      where: { id: documentId, userId: userId },
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Delete from S3
    await deleteResumeFromS3(document.s3Key);

    // Delete from database
    await document.destroy();

    logger.info(`Document deleted: ${documentId}`);

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    logger.error("❌ Delete Document Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete document",
    });
  }
};

// PUT /api/v1/documents/:documentId/ats-score
const updateAtsScore = async (req, res) => {
  try {
    const userId = req.payload.id;
    const { documentId } = req.params;
    const { atsScore, atsAnalysis, keywords } = req.body;

    if (atsScore === undefined) {
      return res.status(400).json({
        success: false,
        message: "atsScore is required",
      });
    }

    const document = await Document.findOne({
      where: { id: documentId, userId: userId },
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Update ATS data
    document.atsScore = atsScore;
    if (atsAnalysis) document.atsAnalysis = atsAnalysis;
    if (keywords) document.keywords = keywords;
    await document.save();

    logger.info(` ATS score updated: ${documentId} - Score: ${atsScore}`);

    res.status(200).json({
      success: true,
      message: "ATS score updated successfully",
      data: {
        documentId: document.id,
        atsScore: document.atsScore,
        atsAnalysis: document.atsAnalysis,
        keywords: document.keywords,
      },
    });
  } catch (error) {
    logger.error("❌ Update ATS Score Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update ATS score",
    });
  }
};

//  GET /api/v1/documents/stats/ats
const getAtsStatistics = async (req, res) => {
  try {
    const userId = req.payload.id;

    const documents = await Document.findAll({
      where: { userId: userId },
      attributes: ["id", "fileName", "atsScore", "createdAt"],
    });

    // Calculate statistics
    const docsWithScore = documents.filter((d) => d.atsScore !== null);
    const scores = docsWithScore.map((d) => d.atsScore);

    const stats = {
      totalDocuments: documents.length,
      documentsWithScore: docsWithScore.length,
      averageScore:
        scores.length > 0
          ? (
              scores.reduce((sum, score) => sum + score, 0) / scores.length
            ).toFixed(2)
          : 0,
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
      lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
      recentUploads: documents.slice(0, 5),
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error("❌ Get ATS Statistics Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch ATS statistics",
    });
  }
};

module.exports = {
  uploadResumeForATS,
  getAtsStatistics,
  updateAtsScore,
  getAllDocuments,
  getDocumentDetails,
  getDocumentDownloadUrl,
  deleteDocument,
};
