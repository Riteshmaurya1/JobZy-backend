module.exports = {
  free: {
    // Core Resources (free/Monthly)
    jobs: 20,
    interviews: 30,
    notes: 50,
    aiResumeGenerations: 0,
    atsChecks: 1,
    emailsPerMonth: 30,
    reminderEmailsPerJob: 1,
    apiCallsPerHour: 60,
    maxFileSizeMB: 5,
  },

  premium: {
    // Target: ₹99/ month (India individual plan)
    jobs: 150,
    interviews: 500,
    notes: 200,
    aiResumeGenerations: 15,
    atsChecks: 20,
    emailsPerMonth: 600,
    reminderEmailsPerJob: 5,
    apiCallsPerHour: 1000,
    maxFileSizeMB: 10,
  },

  pro: {
    // Target: 199/ month (power users / coaches)
    jobs: 500,
    interviews: 2000,
    notes: 1000,
    aiResumeGenerations: 50,
    atsChecks: 75,
    emailsPerMonth: 3000,
    reminderEmailsPerJob: 15,
    apiCallsPerHour: 5000,
    maxFileSizeMB: 20,
    prioritySupport: true,
    documents: 100,
  },
};
