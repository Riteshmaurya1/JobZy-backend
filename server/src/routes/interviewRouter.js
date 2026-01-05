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

// ✅ NEW MIDDLEWARE
const isAuth = require("../middleware/verifyJwt");
const checkFeatureAccess = require("../middleware/checkFeatureAccess");
const checkResourceQuota = require("../middleware/checkResourceQuota");

// All routes require authentication
interviewRouter.use(isAuth);

// INTERVIEW ROUTES

// GET: All upcoming interviews (across all jobs)
interviewRouter.get(
  "/interviews/upcoming",
  checkResourceQuota("interviews", false), // Don't block, just attach quota
  getUpcomingInterviews
);

// GET: All interviews (with quota info)
interviewRouter.get(
  "/interviews",
  checkResourceQuota("interviews", false), // Don't block, just attach quota
  getAllInterviews
);

// POST: Schedule interview for a job (check quota)
interviewRouter.post(
  "/jobs/:jobId/interviews",
  checkFeatureAccess("INTERVIEW_SCHEDULING"), // Check if user can schedule
  checkResourceQuota("interviews", true), // Block if quota exceeded
  scheduleInterview
);

// GET: All interviews for specific job
interviewRouter.get("/jobs/:jobId/interviews", getInterviewsByJob);

// GET: Single interview
interviewRouter.get("/interviews/:interviewId", getInterviewById);

// PUT: Update interview
interviewRouter.put("/interviews/:interviewId", updateInterview);

// DELETE: Delete interview
interviewRouter.delete("/interviews/:interviewId", deleteInterview);

module.exports = interviewRouter;
