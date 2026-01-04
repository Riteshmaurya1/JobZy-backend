const express = require("express");
const jobRouter = express.Router();

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobStats,
  getQuotaInfo,
} = require("../controllers/jobController");

const isAuth = require("../middleware/verifyJwt");
const checkJobQuota = require("../middleware/checkJobQuota");
const getJobQuota = require("../middleware/getJobQuota");

// All routes require authentication
jobRouter.use(isAuth);

// GET: Fetch quota info
jobRouter.get("/jobs/quota", getJobQuota, getQuotaInfo);

// GET: Job statistics
jobRouter.get("/jobs/stats", getJobQuota, getJobStats);

// GET: All jobs (with optional quota info)
jobRouter.get("/jobs", getJobQuota, getAllJobs);

// POST: Create job (check quota first)
jobRouter.post("/jobs", checkJobQuota, createJob);

// GET: Single job
jobRouter.get("/jobs/:jobId", getJobById);

// PUT: Update job
jobRouter.put("/jobs/:jobId", updateJob);

// DELETE: Delete job
jobRouter.delete("/jobs/:jobId", deleteJob);

module.exports = jobRouter;
