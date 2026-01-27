const {
  uploadResumeToS3,
  generateSignedDownloadUrl,
  deleteResumeFromS3,
} = require("../services/s3Service");
const { Document } = require("../models");
const { User } = require("../models");

/**
 * Upload resume for ATS checking
 * POST /api/v1/documents/upload
 */
exports.uploadResumeForATS = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if file exists
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
      uploadedAt: uploadResult.uploadedAt,
    });

    console.log(`✅ Document uploaded for ATS: ${document.id}`);

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully for ATS checking",
      data: {
        documentId: document.id,
        fileName: document.fileName,
        fileSize: document.fileSize,
        uploadedAt: document.uploadedAt,
        atsScore: document.atsScore,
      },
    });
  } catch (error) {
    console.error("❌ Upload Resume Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload resume",
    });
  }
};

/**
 * Get all documents uploaded by user
 * GET /api/v1/documents
 */
exports.getAllDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { uploadSource, sortBy = "uploadedAt", order = "DESC" } = req.query;

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
        "uploadedAt",
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
    console.error("❌ Get Documents Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch documents",
    });
  }
};

/**
 * Get single document details
 * GET /api/v1/documents/:documentId
 */
exports.getDocumentDetails = async (req, res) => {
  try {
    const userId = req.user.id;
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
        uploadedAt: document.uploadedAt,
      },
    });
  } catch (error) {
    console.error("❌ Get Document Details Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch document details",
    });
  }
};

/**
 * Get download URL for document
 * GET /api/v1/documents/:documentId/download-url
 */
exports.getDocumentDownloadUrl = async (req, res) => {
  try {
    const userId = req.user.id;
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
    console.error("❌ Get Download URL Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate download URL",
    });
  }
};

/**
 * Delete document
 * DELETE /api/v1/documents/:documentId
 */
exports.deleteDocument = async (req, res) => {
  try {
    const userId = req.user.id;
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

    console.log(`✅ Document deleted: ${documentId}`);

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Document Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete document",
    });
  }
};

/**
 * Update ATS score and analysis (Called after ATS checking)
 * PUT /api/v1/documents/:documentId/ats-score
 * Body: { atsScore: 85, atsAnalysis: {...}, keywords: [...] }
 */
exports.updateAtsScore = async (req, res) => {
  try {
    const userId = req.user.id;
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

    console.log(`✅ ATS score updated: ${documentId} - Score: ${atsScore}`);

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
    console.error("❌ Update ATS Score Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update ATS score",
    });
  }
};

/**
 * Get ATS statistics for all documents
 * GET /api/v1/documents/stats/ats
 */
exports.getAtsStatistics = async (req, res) => {
  try {
    const userId = req.user.id;

    const documents = await Document.findAll({
      where: { userId: userId },
      attributes: ["id", "fileName", "atsScore", "uploadedAt"],
    });

    // Calculate statistics
    const stats = {
      totalDocuments: documents.length,
      documentsWithScore: documents.filter((d) => d.atsScore !== null).length,
      averageScore:
        documents.length > 0
          ? (
              documents.reduce((sum, d) => sum + (d.atsScore || 0), 0) /
              documents.length
            ).toFixed(2)
          : 0,
      highestScore:
        documents.length > 0
          ? Math.max(...documents.map((d) => d.atsScore || 0))
          : 0,
      lowestScore:
        documents.length > 0
          ? Math.min(
              ...documents
                .filter((d) => d.atsScore !== null)
                .map((d) => d.atsScore)
            )
          : 0,
      recentUploads: documents.slice(0, 5),
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("❌ Get ATS Statistics Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch ATS statistics",
    });
  }
};
