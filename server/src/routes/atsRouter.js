const express = require("express");
const atsRouter = express.Router();

const {
  checkATSScore,
  getATSUsage,
  upload,
  getKeywordSuggestionsController,
  quickKeywordMatch,
} = require("../controllers/atsController");

// Middleware
const isAuth = require("../middleware/verifyJwt");
const checkFeatureAccess = require("../middleware/checkFeatureAccess");
const checkResourceQuota = require("../middleware/checkResourceQuota");

// Routes

// POST: Check ATS Score (upload resume)
atsRouter.post(
  "/ats/check",
  isAuth,
  checkFeatureAccess("ATS_SCORE_CHECKER"),
  checkResourceQuota("atsChecks", true),
  upload.single("resume"), // File upload middleware
  checkATSScore
);

// GET: Get ATS usage statistics
atsRouter.get(
  "/ats/usage",
  isAuth,
  checkFeatureAccess("ATS_CHECKER"),
  getATSUsage
);

// ✅ NEW ROUTES - PRO ONLY

// POST: Get AI Keyword Suggestions (Pro Only)
atsRouter.post(
  "/ats/keywords/suggestions",
  isAuth,
  checkFeatureAccess("ATS_KEYWORD_SUGGESTIONS"), // ✅ Pro only
  upload.single("resume"),
  getKeywordSuggestionsController
);

// POST: Quick Keyword Match (Pro Only)
atsRouter.post(
  "/ats/keywords/match",
  isAuth,
  checkFeatureAccess("ATS_KEYWORD_SUGGESTIONS"), // ✅ Pro only
  quickKeywordMatch
);

module.exports = atsRouter;
