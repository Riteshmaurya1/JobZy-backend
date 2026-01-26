const express = require("express");
const atsRouter = express.Router();

const {
  checkATSScore,
  getATSUsage,
  upload,
  getKeywordSuggestionsController,
  quickKeywordMatch,
} = require("../controllers/atsController");

const {
  validateATSCheck,
  validateKeywordSuggestions,
  validateQuickKeywordMatch,
} = require("../validations/atsValidator");

// Middleware
const isAuth = require("../middleware/verifyJwt");
const checkFeatureAccess = require("../middleware/checkFeatureAccess");
const checkResourceQuota = require("../middleware/checkResourceQuota");
const validationErrorHandler = require("../middleware/validationErrorHandler");

// Routes

// POST: Check ATS Score (upload resume)
atsRouter.post(
  "/ats/check",
  isAuth,
  checkFeatureAccess("ATS_SCORE_CHECKER"),
  checkResourceQuota("atsChecks", true),
  upload.single("resume"),
  validateATSCheck,
  validationErrorHandler,
  checkATSScore,
);

// GET: Get ATS usage statistics
atsRouter.get(
  "/ats/usage",
  isAuth,
  checkFeatureAccess("ATS_CHECKER"),
  getATSUsage,
);

// POST: Get AI Keyword Suggestions (Pro Only)
atsRouter.post(
  "/ats/keywords/suggestions",
  isAuth,
  checkFeatureAccess("ATS_KEYWORD_SUGGESTIONS"),
  upload.single("resume"),
  validateKeywordSuggestions,
  validationErrorHandler,
  getKeywordSuggestionsController,
);

// POST: Quick Keyword Match (Pro Only)
atsRouter.post(
  "/ats/keywords/match",
  isAuth,
  checkFeatureAccess("ATS_KEYWORD_SUGGESTIONS"),
  validateQuickKeywordMatch,
  validationErrorHandler,
  quickKeywordMatch,
);

module.exports = atsRouter;
