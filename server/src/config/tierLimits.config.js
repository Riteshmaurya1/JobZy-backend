/**
 * Resource-based quota limits for each tier
 * Tracks usage of countable resources
 */
module.exports = {
  free: {
    // Core Resources (Monthly)
    jobs: 10,
    interviews: 10,
    notes: 10,

    // AI Features (Monthly)
    aiResumeGenerations: 0, // ❌ Not allowed
    atsChecks: 0, // ❌ Not allowed

    // Email Limits (Monthly)
    emailsPerMonth: 20, // 20 emails/month
    reminderEmailsPerJob: 2, // 1 reminder per job

    // API Rate Limits (Per Hour)
    apiCallsPerHour: 100,

    // Storage
    maxFileSizeMB: 5, // 5MB file uploads
  },

  premium: {
    // Core Resources (Monthly)
    jobs: 100,
    interviews: 400,
    notes: 100,

    // AI Features (Monthly)
    aiResumeGenerations: 5, // ✅ 5 per month
    atsChecks: 10, // ✅ 10 per month

    // Email Limits (Monthly)
    emailsPerMonth: 500, // 100 emails/month
    reminderEmailsPerJob: 5, // 3 reminders per job

    // API Rate Limits (Per Hour)
    apiCallsPerHour: 500,

    // Storage
    maxFileSizeMB: 7, // 7MB file uploads
  },

  pro: {
    // Core Resources (Monthly)
    jobs: Infinity,
    interviews: Infinity,
    notes: Infinity,

    // AI Features (Monthly)
    aiResumeGenerations: Infinity, // ✅ Unlimited
    atsChecks: Infinity, // ✅ Unlimited

    // Email Limits (Monthly)
    emailsPerMonth: Infinity, // Unlimited emails
    reminderEmailsPerJob: Infinity, // Unlimited reminders

    // API Rate Limits (Per Hour)
    apiCallsPerHour: 5000,

    // Storage
    maxFileSizeMB: 10, // 10MB file uploads
  },
};
