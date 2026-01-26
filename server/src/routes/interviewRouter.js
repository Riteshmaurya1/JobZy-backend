const express = require("express");
const interviewRouter = express.Router();

const {
  scheduleInterview,
  getInterviewsByJob,
  getInterviewById,
  updateInterview,
  deleteInterview,
  getUpcomingInterviews,
  getAllInterviews,
} = require("../controllers/interviewController");

const {
  validateScheduleInterview,
  validateGetAllInterviews,
  validateGetInterviewById,
  validateUpdateInterview,
  validateDeleteInterview,
} = require("../validations/interviewValidator");
const validationErrorHandler = require("../middleware/validationErrorHandler");

const isAuth = require("../middleware/verifyJwt");
const checkFeatureAccess = require("../middleware/checkFeatureAccess");
const checkResourceQuota = require("../middleware/checkResourceQuota");

// All routes require authentication
interviewRouter.use(isAuth);

// INTERVIEW ROUTES

// GET: All upcoming interviews (across all jobs)
interviewRouter.get(
  "/interviews/upcoming",
  checkResourceQuota("interviews", false),
  getUpcomingInterviews,
);

// GET: All interviews (with quota info)
interviewRouter.get(
  "/interviews",
  checkResourceQuota("interviews", false),
  validateGetAllInterviews,
  validationErrorHandler,
  getAllInterviews,
);

// POST: Schedule interview for a job (check quota)
interviewRouter.post(
  "/jobs/:jobId/interviews",
  checkFeatureAccess("INTERVIEW_SCHEDULING"),
  checkResourceQuota("interviews", true),
  validateScheduleInterview,
  validationErrorHandler,
  scheduleInterview,
);

// GET: All interviews for specific job
interviewRouter.get("/jobs/:jobId/interviews", getInterviewsByJob);

// GET: Single interview
interviewRouter.get(
  "/interviews/:interviewId",
  validateGetInterviewById,
  validationErrorHandler,
  getInterviewById,
);

// PUT: Update interview
interviewRouter.put(
  "/interviews/:interviewId",
  validateUpdateInterview,
  validationErrorHandler,
  updateInterview,
);

// DELETE: Delete interview
interviewRouter.delete(
  "/interviews/:interviewId",
  validateDeleteInterview,
  validationErrorHandler,
  deleteInterview,
);

module.exports = interviewRouter;
