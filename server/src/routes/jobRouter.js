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
  exportJobsPDF,
  exportJobsCSV,
  advancedSearch,
} = require("../controllers/jobController");

// ✅ NEW MIDDLEWARE
const isAuth = require("../middleware/verifyJwt");
const checkFeatureAccess = require("../middleware/checkFeatureAccess");
const checkResourceQuota = require("../middleware/checkResourceQuota");

// All routes require authentication
jobRouter.use(isAuth);

// ************* QUOTA & STATS ROUTES ************
jobRouter.get(
  "/jobs/quota",
  checkResourceQuota("jobs", false), // false = don't block, just attach quota
  getQuotaInfo
);
// GET: Job statistics (Basic for all, Advanced for Premium+)
jobRouter.get(
  "/jobs/stats",
  checkResourceQuota("jobs", false), // Attach quota info
  getJobStats
);

// ************ EXPORT ROUTES (Premium+ only) ******************

// GET: Export jobs as PDF (Premium+ only)
jobRouter.get(
  "/jobs/export/pdf",
  checkFeatureAccess("PDF_EXPORT"), // Check if user has PDF export
  exportJobsPDF
);

// GET: Export jobs as CSV (Premium+ only)
jobRouter.get(
  "/jobs/export/csv",
  checkFeatureAccess("CSV_EXPORT"), // Check if user has CSV export
  exportJobsCSV
);

// ************** SEARCH ROUTES ****************
// POST: Advanced search with filters (Premium+ only)
jobRouter.post(
  "/jobs/search/advanced",
  checkFeatureAccess("JOB_ADVANCED_FILTERS"), // Premium+ only
  advancedSearch
);
jobRouter.get(
  "/jobs",
  checkResourceQuota("jobs", false), // Don't block, just attach quota
  getAllJobs
);

// ****************JOB CRUD ROUTES ****************
jobRouter.post(
  "/jobs/create",
  checkResourceQuota("jobs", true), // true = block if quota exceeded
  createJob
);

jobRouter.get("/jobs/:jobId", getJobById);
jobRouter.put("/jobs/:jobId", updateJob);
jobRouter.delete("/jobs/:jobId", deleteJob);

module.exports = jobRouter;
