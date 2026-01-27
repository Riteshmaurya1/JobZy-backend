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
    free: false,
    premium: true,
    pro: true,
  },

  // Interview Features
  INTERVIEW_SCHEDULING: {
    free: true,
    premium: true,
    pro: true,
  },

  // Email Features
  EMAIL_REMINDERS: {
    free: true, 
    premium: true,
    pro: true,
  },

  // AI Features (NEW)
  AI_RESUME_BUILDER: {
    free: false,
    premium: true,
    pro: true,
  },

  AI_RESUME_OPTIMIZATION: {
    free: false,
    premium: true, 
    pro: true,
  },

  // ATS Features (NEW)
  ATS_SCORE_CHECKER: {
    free: false, 
    premium: true, 
    pro: true,
  },

  ATS_CHECKER: {
    free: false, 
    premium: true, 
    pro: true, 
  },

  ATS_KEYWORD_SUGGESTIONS: {
    free: false,
    premium: false, 
    pro: true,
  },

  // Analytics Features
  BASIC_ANALYTICS: {
    free: true,
    premium: true,
    pro: true,
  },

  ADVANCED_ANALYTICS: {
    free: false,
    premium: true,
    pro: true,
  },

  // Export Features
  PDF_EXPORT: {
    free: false,
    premium: true, 
    pro: true,
  },

  CSV_EXPORT: {
    free: false,
    premium: true,
    pro: true,
  },

  // Support Features
  PRIORITY_SUPPORT: {
    free: false,
    premium: false,
    pro: true,
  },

  // Documents Features
  DOCUMENT_STORAGE: {
    free: false,
    premium: false,
    pro: true,
  },
};
