const express = require("express");
const interviewRouter = express.Router();

const {
  scheduleInterview,
  getInterviewsByJob,
  getInterviewById,
  updateInterview,
  deleteInterview,
  getUpcomingInterviews,
} = require("../controllers/interviewController");

const isAuth = require("../middleware/verifyJwt");

// All routes require authentication
interviewRouter.use(isAuth);

// GET: All upcoming interviews (across all jobs)
interviewRouter.get("/interviews/upcoming", getUpcomingInterviews);

// POST: Schedule interview for a job
interviewRouter.post("/jobs/:jobId/interviews", scheduleInterview);

// GET: All interviews for specific job
interviewRouter.get("/jobs/:jobId/interviews", getInterviewsByJob);

// GET: Single interview
interviewRouter.get("/interviews/:interviewId", getInterviewById);

// PUT: Update interview
interviewRouter.put("/interviews/:interviewId", updateInterview);

// DELETE: Delete interview
interviewRouter.delete("/interviews/:interviewId", deleteInterview);

module.exports = interviewRouter;
