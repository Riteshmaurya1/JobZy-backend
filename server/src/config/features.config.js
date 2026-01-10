/**
 * Feature-based access control configuration
 * Define which features are available for each tier
 */
module.exports = {
  // Job Management Features
  JOB_CREATION: {
    free: true,
    premium: true,
    pro: true,
  },
  JOB_EXPORT: {
    free: false,
    premium: true,
    pro: true,
  },
  JOB_ADVANCED_FILTERS: {
    free: false, // ❌ Blocked
    premium: true, // ✅ Allowed
    pro: true, // ✅ Allowed
  },

  // Interview Features
  INTERVIEW_SCHEDULING: {
    free: true,
    premium: true,
    pro: true,
  },

  // Email Features
  EMAIL_REMINDERS: {
    free: true, // ✅ Basic reminders only
    premium: true,
    pro: true,
  },

  // AI Features (NEW)
  AI_RESUME_BUILDER: {
    free: false, // ❌ Blocked
    premium: true, // ✅ Limited usage
    pro: true, // ✅ Unlimited
  },

  AI_RESUME_OPTIMIZATION: {
    free: false, // ❌ Blocked
    premium: true, // ✅ Allowed
    pro: true, // ✅ Allowed
  },

  // ATS Features (NEW)
  ATS_SCORE_CHECKER: {
    free: false, // ❌ Blocked
    premium: true, // ✅ Limited checks
    pro: true, // ✅ Unlimited
  },

  ATS_CHECKER: {
    free: false, // ❌ Blocked
    premium: true, // ✅ Limited checks
    pro: true, // ✅ Unlimited
  },

  ATS_KEYWORD_SUGGESTIONS: {
    free: false, // ❌ Blocked
    premium: false, // ❌ Blocked
    pro: true, // ✅ Only Pro
  },

  // Analytics Features
  BASIC_ANALYTICS: {
    free: true, // ✅ Basic only
    premium: true,
    pro: true,
  },

  ADVANCED_ANALYTICS: {
    free: false, // ❌ Blocked
    premium: true, // ✅ Allowed
    pro: true, // ✅ Allowed
  },

  // Export Features
  PDF_EXPORT: {
    free: false, // ❌ Blocked
    premium: true, // ✅ Allowed
    pro: true, // ✅ Allowed
  },

  CSV_EXPORT: {
    free: false, // ❌ Blocked
    premium: true, // ✅ Allowed
    pro: true, // ✅ Allowed
  },

  // Support Features
  PRIORITY_SUPPORT: {
    free: false, // ❌ Community only
    premium: false, // ❌ Email support
    pro: true, // ✅ Priority 24/7
  },
};
