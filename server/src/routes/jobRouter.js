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
  basicSearch,
} = require("../controllers/jobController");

const {
  validateCreateJob,
  validateGetAllJobs,
  validateGetJobById,
  validateUpdateJob,
  validateDeleteJob,
  validateBasicSearch,
  validateAdvancedSearch,
} = require("../validations/jobValidator");
const validationErrorHandler = require("../middleware/validationErrorHandler");

const isAuth = require("../middleware/verifyJwt");
const checkFeatureAccess = require("../middleware/checkFeatureAccess");
const checkResourceQuota = require("../middleware/checkResourceQuota");

jobRouter.use(isAuth);

// ************* QUOTA & STATS ROUTES ************
jobRouter.get("/jobs/quota", checkResourceQuota("jobs", false), getQuotaInfo);

// ************ Job statistics (Basic for all, Advanced for Premium+) ******************
jobRouter.get("/jobs/stats", checkResourceQuota("jobs", false), getJobStats);

// ************ EXPORT ROUTES (Premium+ only) ******************
jobRouter.get(
  "/jobs/export/pdf",
  checkFeatureAccess("PDF_EXPORT"),
  exportJobsPDF,
);

// GET: Export jobs as CSV (Premium+ only)
jobRouter.get(
  "/jobs/export/csv",
  checkFeatureAccess("CSV_EXPORT"),
  exportJobsCSV,
);

// ************** SEARCH ROUTES ****************
// POST: Advanced search with filters (Premium+ only)
jobRouter.post(
  "/jobs/search/advanced",
  checkFeatureAccess("JOB_ADVANCED_FILTERS"),
  validateAdvancedSearch,
  validationErrorHandler,
  advancedSearch,
);

jobRouter.get(
  "/jobs",
  checkResourceQuota("jobs", false),
  validateGetAllJobs,
  validationErrorHandler,
  getAllJobs,
);

// ****************JOB CRUD ROUTES ****************
jobRouter.post(
  "/jobs/create",
  validateCreateJob,
  validationErrorHandler,
  checkResourceQuota("jobs", true),
  createJob,
);

jobRouter.post(
  "/jobs/search",
  validateBasicSearch,
  validationErrorHandler,
  basicSearch,
);

jobRouter.get(
  "/jobs/:jobId",
  validateGetJobById,
  validationErrorHandler,
  getJobById,
);

jobRouter.put(
  "/jobs/:jobId",
  validateUpdateJob,
  validationErrorHandler,
  updateJob,
);

jobRouter.delete(
  "/jobs/:jobId",
  validateDeleteJob,
  validationErrorHandler,
  deleteJob,
);

module.exports = jobRouter;
