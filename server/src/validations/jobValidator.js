const { body, param, query } = require("express-validator");

/**
 * Validation rules for Job Routes
 * Used in: POST /jobs/create, GET /jobs, PUT /jobs/:jobId, DELETE /jobs/:jobId
 */

// POST: /jobs/create
const validateCreateJob = [
  body("company")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),

  body("position")
    .trim()
    .notEmpty()
    .withMessage("Position is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Position must be between 2 and 100 characters"),

  body("jobLink")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Invalid job link URL"),

  body("location")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location must not exceed 100 characters"),

  body("workMode")
    .notEmpty()
    .withMessage("Work mode is required")
    .trim()
    .isIn(["remote", "onsite", "hybrid"])
    .withMessage("Work mode must be one of: remote, onsite, hybrid"),

  body("jobType")
    .notEmpty()
    .withMessage("Job type is required")
    .trim()
    .isIn(["full-time", "part-time", "contract", "internship"])
    .withMessage(
      "Job type must be one of: full-time, part-time, contract, internship",
    ),

  body("salary")
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage("Salary must be a positive number"),

  body("platform")
    .notEmpty()
    .withMessage("Platform is required")
    .trim()
    .isLength({ max: 50 })
    .withMessage("Platform must not exceed 50 characters"),

  body("appliedDate")
    .notEmpty()
    .withMessage("Applied date is required")
    .isISO8601()
    .toDate()
    .withMessage("Applied date must be in ISO 8601 format (YYYY-MM-DD)"),

  body("status")
    .notEmpty().withMessage('Status is required')
    .trim()
    .isIn([
      "applied",
      "screening",
      "interview-scheduled",
      "interviewed",
      "offered",
      "rejected",
      "accepted",
    ])
    .withMessage(
      "Status must be one of: applied, screening, interview-scheduled, interviewed, offered, rejected, accepted",
    ),

  body("notes")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must not exceed 500 characters"),

  body("resumeVersion")
    .notEmpty().withMessage('Resume version is required')
    .trim()
    .isLength({ max: 50 })
    .withMessage("Resume version must not exceed 50 characters"),

  body("followUpDate")
    .notEmpty()
    .withMessage("Follow-up date is required")
    .isISO8601()
    .toDate()
    .withMessage("Follow-up date must be in ISO 8601 format (YYYY-MM-DD)"),
];

// GET: /jobs (List with filters)
const validateGetAllJobs = [
  query("status")
    .optional({ checkFalsy: true })
    .trim()
    .isIn([
      "applied",
      "screening",
      "interview-scheduled",
      "interviewed",
      "offered",
      "rejected",
      "accepted",
    ])
    .withMessage("Invalid status filter"),

  query("company")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Company filter must not exceed 100 characters"),

  query("position")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Position filter must not exceed 100 characters"),

  query("workMode")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["remote", "onsite", "hybrid"])
    .withMessage("Invalid work mode filter"),

  query("sortBy")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["appliedDate", "company", "position", "status"])
    .withMessage(
      "Sort field must be one of: appliedDate, company, position, status",
    ),

  query("order")
    .optional({ checkFalsy: true })
    .toUpperCase()
    .isIn(["ASC", "DESC"])
    .withMessage("Order must be ASC or DESC"),

  query("limit")
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("offset")
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage("Offset must be a non-negative number"),
];

// GET: /jobs/:jobId
const validateGetJobById = [
  param("jobId").trim().notEmpty().withMessage("Job ID is required"),
];

// PUT: /jobs/:jobId (Update job)
const validateUpdateJob = [
  param("jobId").trim().notEmpty().withMessage("Job ID is required"),

  body("company")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),

  body("position")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Position must be between 2 and 100 characters"),

  body("location")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location must not exceed 100 characters"),

  body("workMode")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["remote", "onsite", "hybrid"])
    .withMessage("Work mode must be one of: remote, onsite, hybrid"),

  body("jobType")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["fulltime", "parttime", "contract", "internship"])
    .withMessage(
      "Job type must be one of: fulltime, parttime, contract, internship",
    ),

  body("salary")
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage("Salary must be a positive number"),

  body("status")
    .optional({ checkFalsy: true })
    .trim()
    .isIn([
      "applied",
      "screening",
      "interview-scheduled",
      "interviewed",
      "offered",
      "rejected",
      "accepted",
    ])
    .withMessage(
      "Status must be one of: applied, screening, interview-scheduled, interviewed, offered, rejected, accepted",
    ),

  body("jobLink")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Invalid job link URL"),

  body("notes")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must not exceed 500 characters"),

  body("platform")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage("Platform must not exceed 50 characters"),

  body("appliedDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage("Applied date must be in ISO 8601 format"),

  body("followUpDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage("Follow-up date must be in ISO 8601 format"),
];

// DELETE: /jobs/:jobId
const validateDeleteJob = [
  param("jobId").trim().notEmpty().withMessage("Job ID is required"),
];

// POST: /jobs/search (Basic search)
const validateBasicSearch = [
  body("query")
    .trim()
    .notEmpty()
    .withMessage("Search query is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Search query must be between 2 and 100 characters"),
];

// POST: /jobs/search/advanced (Advanced search - Premium only)
const validateAdvancedSearch = [
  body("company")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Company filter must not exceed 100 characters"),

  body("position")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Position filter must not exceed 100 characters"),

  body("status")
    .optional({ checkFalsy: true })
    .trim()
    .isIn([
      "applied",
      "screening",
      "interview-scheduled",
      "interviewed",
      "offered",
      "rejected",
      "accepted",
    ])
    .withMessage("Invalid status filter"),

  body("location")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location filter must not exceed 100 characters"),

  body("workMode")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["remote", "onsite", "hybrid"])
    .withMessage("Invalid work mode filter"),

  body("jobType")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["fulltime", "parttime", "contract", "internship"])
    .withMessage("Invalid job type filter"),

  body("salaryMin")
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage("Minimum salary must be a positive number"),

  body("salaryMax")
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage("Maximum salary must be a positive number"),

  body("platform")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage("Platform must not exceed 50 characters"),

  body("dateFrom")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage("Date from must be in ISO 8601 format"),

  body("dateTo")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage("Date to must be in ISO 8601 format"),

  body("hasInterview")
    .optional({ checkFalsy: true })
    .isBoolean()
    .withMessage("hasInterview must be a boolean value"),
];

module.exports = {
  validateCreateJob,
  validateGetAllJobs,
  validateGetJobById,
  validateUpdateJob,
  validateDeleteJob,
  validateBasicSearch,
  validateAdvancedSearch,
};
