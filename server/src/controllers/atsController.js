const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const { parseResume } = require("../utils/resumeParser");
const {
  analyzeResumeWithAI,
  getJobRoleKeywords,
  getKeywordSuggestions,
  compareWithJobDescription,
} = require("../services/atsService");

const { User, Document } = require("../models");
const { uploadResumeToS3 } = require("../services/s3Service");

// Configure multer for file upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.",
      ),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const checkATSScore = async (req, res, next) => {
  let filePath = null;

  try {
    const userId = req.payload.id;
    const { jobRole } = req.body;
    console.log(jobRole);

    // Validation
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume file",
      });
    }

    if (!jobRole) {
      return res.status(400).json({
        success: false,
        message: "Please specify job role (frontend/backend/fullstack/devops)",
      });
    }

    // Save buffer to temp file (parseResume needs file path)
    const uploadDir = path.join(__dirname, "../uploads/resumes");
    await fs.mkdir(uploadDir, { recursive: true });
    filePath = path.join(uploadDir, `${Date.now()}-${req.file.originalname}`);
    await fs.writeFile(filePath, req.file.buffer);

    // Parse resume
    const resumeText = await parseResume(filePath, req.file.mimetype);

    if (!resumeText || resumeText.length < 100) {
      return res.status(400).json({
        success: false,
        message: "Resume text is too short or could not be extracted",
      });
    }

    // Analyze with AI
    const analysis = await analyzeResumeWithAI(resumeText, jobRole);

    // Get expected keywords for job role
    const expectedKeywords = getJobRoleKeywords(jobRole);

    // Upload resume to S3
    const uploadResult = await uploadResumeToS3(req.file, userId);

    // Create Document record with ATS info
    const document = await Document.create({
      userId,
      fileName: uploadResult.fileName,
      s3Key: uploadResult.s3Key,
      fileSize: uploadResult.fileSize,
      fileType: req.file.mimetype,
      uploadSource: "ats_checker",
      atsScore: analysis.atsScore,
      atsAnalysis: analysis,
      keywords: expectedKeywords,
    });

    // Increment user's ATS check counter
    await User.increment("monthlyATSChecks", { where: { id: userId } });

    // Delete uploaded file after processing
    await fs.unlink(filePath);

    res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: {
        ...analysis,
        jobRole,
        expectedKeywords,
        quota: req.userQuota,
        documentId: document.id,
      },
    });
  } catch (error) {
    // Clean up file if error occurs
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error("[ATS] File cleanup error:", unlinkError.message);
      }
    }
    next(error);
  }
};

/**
 * GET: Get ATS usage info
 */
const getATSUsage = async (req, res, next) => {
  try {
    const userId = req.payload.id;

    const user = await User.findByPk(userId, {
      attributes: ["tier", "monthlyATSChecks"],
    });

    res.status(200).json({
      success: true,
      data: {
        tier: user.tier,
        atsChecksUsed: user.monthlyATSChecks,
        quota: req.userQuota,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST: Get Keyword Suggestions (Pro Feature)
 * Advanced keyword analysis with AI
 */
const getKeywordSuggestionsController = async (req, res, next) => {
  let filePath = null;

  try {
    const userId = req.payload.id;
    const { jobRole, jobDescription } = req.body;

    // Validation
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume file",
      });
    }

    if (!jobRole) {
      return res.status(400).json({
        success: false,
        message: "Please specify job role (frontend/backend/fullstack/devops)",
      });
    }

    filePath = req.file.path;

    // Parse resume
    const resumeText = await parseResume(filePath, req.file.mimetype);

    if (!resumeText || resumeText.length < 100) {
      return res.status(400).json({
        success: false,
        message: "Resume text is too short or could not be extracted",
      });
    }

    // Get AI-powered keyword suggestions
    const suggestions = await getKeywordSuggestions(
      resumeText,
      jobRole,
      jobDescription,
    );

    // If job description provided, compare keywords
    let comparison = null;
    if (jobDescription && jobDescription.trim().length > 50) {
      comparison = compareWithJobDescription(resumeText, jobDescription);
    }

    // Increment usage counter (optional - can track separately)
    // await User.increment("keywordSuggestionsUsed", { where: { id: userId } });

    // Delete uploaded file after processing
    await fs.unlink(filePath);

    res.status(200).json({
      success: true,
      message: "Keyword suggestions generated successfully",
      data: {
        jobRole,
        suggestions,
        comparison,
        note: "Pro Feature: Advanced AI-powered keyword analysis",
      },
    });
  } catch (error) {
    // Clean up file if error occurs
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error("[ATS] File cleanup error:", unlinkError.message);
      }
    }
    next(error);
  }
};

/**
 * POST: Quick keyword match (without file upload)
 * Check resume text against job description
 * Pro Feature
 */
const quickKeywordMatch = async (req, res, next) => {
  try {
    console.log("🔍 [Quick Match] Starting keyword comparison...");

    const { resumeText, jobDescription } = req.body;

    // Validation
    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({
        success: false,
        message: "Please provide resume text (minimum 100 characters)",
      });
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: "Please provide job description (minimum 50 characters)",
      });
    }

    console.log("📥 Resume text length:", resumeText.length);
    console.log("📥 Job description length:", jobDescription.length);

    // Compare keywords
    const comparison = compareWithJobDescription(resumeText, jobDescription);

    console.log("✅ Match percentage:", comparison.matchPercentage);

    // Generate recommendation based on match percentage
    let recommendation = "";
    let status = "";

    if (comparison.matchPercentage >= 70) {
      recommendation =
        "Excellent match! Your resume aligns very well with the job description. You have most of the required keywords.";
      status = "excellent";
    } else if (comparison.matchPercentage >= 50) {
      recommendation =
        "Good match. Your resume has many relevant keywords, but consider adding some missing keywords to strengthen your application.";
      status = "good";
    } else if (comparison.matchPercentage >= 30) {
      recommendation =
        "Moderate match. Consider optimizing your resume by incorporating more keywords from the job description.";
      status = "moderate";
    } else {
      recommendation =
        "Low match. Strongly recommend tailoring your resume to include more relevant keywords from the job description.";
      status = "low";
    }

    res.status(200).json({
      success: true,
      message: "Keyword comparison completed",
      data: {
        matchPercentage: comparison.matchPercentage,
        matchingKeywords: comparison.matchingKeywords,
        missingKeywords: comparison.missingKeywords,
        totalMatchingKeywords: comparison.matchingKeywords.length,
        totalMissingKeywords: comparison.missingKeywords.length,
        status,
        recommendation,
        note: "Pro Feature: Quick keyword matching without file upload",
      },
    });
  } catch (error) {
    console.error("[Quick Match] Error:", error.message);
    next(error);
  }
};

module.exports = {
  checkATSScore,
  getATSUsage,
  getKeywordSuggestionsController,
  quickKeywordMatch,
  upload, // Export multer middleware
};
