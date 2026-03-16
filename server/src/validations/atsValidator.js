const { body } = require("express-validator");

/**
 * Validation rules for ATS Routes
 * Used in: POST /ats/check, POST /ats/keywords/suggestions, POST /ats/keywords/match
 */

// POST: /ats/check (Check ATS Score with file upload)
const validateATSCheck = [
  body("jobRole")
    .trim()
    .notEmpty()
    .withMessage("Job role is required")
    .isIn(["Frontend Developer", "Backend Developer", "Fullstack Developer", "DevOps Engineer"])
    .withMessage(
      "Job role must be one of: Frontend Developer, Backend Developer, Fullstack Developer, DevOps Engineer",
    ),

  // File validation is done in multer fileFilter
  // Resume file is required (checked in controller)
];

// POST: /ats/keywords/suggestions (Get keyword suggestions with file)
const validateKeywordSuggestions = [
  body("jobRole")
    .trim()
    .notEmpty()
    .withMessage("Job role is required")
    .isIn(["frontend", "backend", "fullstack", "devops"])
    .withMessage(
      "Job role must be one of: frontend, backend, fullstack, devops",
    ),

  body("jobDescription")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage("Job description must be between 50 and 5000 characters"),
];

// POST: /ats/keywords/match (Quick keyword match without file)
const validateQuickKeywordMatch = [
  body("resumeText")
    .trim()
    .notEmpty()
    .withMessage("Resume text is required")
    .isLength({ min: 100, max: 10000 })
    .withMessage("Resume text must be between 100 and 10000 characters"),

  body("jobDescription")
    .trim()
    .notEmpty()
    .withMessage("Job description is required")
    .isLength({ min: 50, max: 5000 })
    .withMessage("Job description must be between 50 and 5000 characters"),
];

module.exports = {
  validateATSCheck,
  validateKeywordSuggestions,
  validateQuickKeywordMatch,
};
