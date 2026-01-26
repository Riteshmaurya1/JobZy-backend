const { body, param, query } = require("express-validator");

/**
 * Validation rules for Interview Routes
 * Used in: POST /jobs/:jobId/interviews, GET /interviews, PUT /interviews/:interviewId
 */

// POST: /jobs/:jobId/interviews (Schedule interview)
const validateScheduleInterview = [
  param("jobId").trim().notEmpty().withMessage("Job ID is required"),

  body("round")
    .trim()
    .notEmpty()
    .withMessage("Interview round is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Round must be between 1 and 50 characters"),

  body("interviewDate")
    .notEmpty()
    .withMessage("Interview date is required")
    .isISO8601()
    .toDate()
    .withMessage("Interview date must be in ISO 8601 format (YYYY-MM-DD)")
    .custom((value) => {
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (inputDate < today) {
        throw new Error("Interview date cannot be in the past");
      }
      return true;
    }),

  body("interviewTime")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Interview time must be in HH:MM format (24-hour)"),

  body("interviewMode")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["video-call", "phone-call", "in-person", "online-test"])
    .withMessage(
      "Interview mode must be one of: video-call, phone-call, in-person, online-test",
    ),

  body("meetingLink")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Invalid meeting link URL"),

  body("interviewerName")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Interviewer name must be between 2 and 100 characters"),

  body("interviewerEmail")
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage("Invalid interviewer email format")
    .normalizeEmail(),

  body("followUpDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage("Follow-up date must be in ISO 8601 format (YYYY-MM-DD)"),

  body("notes")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must not exceed 500 characters"),
];

// GET: /interviews (Get all interviews with filters)
const validateGetAllInterviews = [
  query("status")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["scheduled", "completed", "cancelled"])
    .withMessage("Invalid interview status"),

  query("dateFrom")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage("Date from must be in ISO 8601 format"),

  query("dateTo")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage("Date to must be in ISO 8601 format"),

  query("sortBy")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["interviewDate", "interviewTime", "round", "status"])
    .withMessage(
      "Sort field must be one of: interviewDate, interviewTime, round, status",
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

// GET: /interviews/:interviewId (Get single interview)
const validateGetInterviewById = [
  param("interviewId")
    .trim()
    .notEmpty()
    .withMessage("Interview ID is required"),
];

// PUT: /interviews/:interviewId (Update interview)
const validateUpdateInterview = [
  param("interviewId")
    .trim()
    .notEmpty()
    .withMessage("Interview ID is required"),

  body("round")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Round must be between 1 and 50 characters"),

  body("interviewDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage("Interview date must be in ISO 8601 format (YYYY-MM-DD)")
    .custom((value) => {
      if (value) {
        const inputDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (inputDate < today) {
          throw new Error("Interview date cannot be in the past");
        }
      }
      return true;
    }),

  body("interviewTime")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Interview time must be in HH:MM format (24-hour)"),

  body("interviewMode")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["video-call", "phone-call", "in-person", "online-test"])
    .withMessage(
      "Interview mode must be one of: video-call, phone-call, in-person, online-test",
    ),

  body("meetingLink")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Invalid meeting link URL"),

  body("interviewerName")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Interviewer name must be between 2 and 100 characters"),

  body("interviewerEmail")
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage("Invalid interviewer email format")
    .normalizeEmail(),

  body("status")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["scheduled", "completed", "cancelled"])
    .withMessage(
      "Interview status must be one of: scheduled, completed, cancelled",
    ),

  body("followUpDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage("Follow-up date must be in ISO 8601 format (YYYY-MM-DD)"),

  body("notes")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must not exceed 500 characters"),
];

// DELETE: /interviews/:interviewId
const validateDeleteInterview = [
  param("interviewId")
    .trim()
    .notEmpty()
    .withMessage("Interview ID is required"),
];

module.exports = {
  validateScheduleInterview,
  validateGetAllInterviews,
  validateGetInterviewById,
  validateUpdateInterview,
  validateDeleteInterview,
};
