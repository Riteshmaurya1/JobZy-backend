// server/src/controllers/dashboardController.js
const { Job, Interview } = require("../models");

const getDashboard = async (req, res, next) => {
  try {
    const userId = req.payload.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // 1. Get all jobs for this user
    const allJobs = await Job.findAll({
      where: { userId },
      attributes: [
        "id",
        "company",
        "position",
        "status",
        "workMode",
        "jobType",
        "appliedDate",
        "salary",
        "location",
      ],
      raw: true,
    });

    // 2. Total jobs count
    const totalJobs = allJobs.length;

    // 3. Unique companies applied to
    const uniqueCompanies = new Set(allJobs.map((job) => job.company));
    const totalCompaniesApplied = uniqueCompanies.size;

    // 4. Jobs by status
    const jobsByStatus = {};
    allJobs.forEach((job) => {
      jobsByStatus[job.status] = (jobsByStatus[job.status] || 0) + 1;
    });

    // 5. Jobs by work mode
    const jobsByWorkMode = {};
    allJobs.forEach((job) => {
      jobsByWorkMode[job.workMode] = (jobsByWorkMode[job.workMode] || 0) + 1;
    });

    // 6. Jobs by type
    const jobsByType = {};
    allJobs.forEach((job) => {
      jobsByType[job.jobType] = (jobsByType[job.jobType] || 0) + 1;
    });

    // 7. Get all interviews for user (through Job relationship)
    const allInterviews = await Interview.findAll({
      include: [
        {
          model: Job,
          as: "job", // Use the alias from your associations
          where: { userId },
          attributes: ["company", "position"],
        },
      ],
      attributes: [
        "id",
        "round",
        "interviewDate",
        "interviewTime",
        "interviewMode",
        "status",
        "interviewerName",
      ],
      raw: true,
    });

    const totalInterviews = allInterviews.length;

    // 8. Interviews by status
    const interviewsByStatus = {};
    allInterviews.forEach((interview) => {
      interviewsByStatus[interview.status] =
        (interviewsByStatus[interview.status] || 0) + 1;
    });

    // 9. Interviews by mode
    const interviewsByMode = {};
    allInterviews.forEach((interview) => {
      interviewsByMode[interview.interviewMode] =
        (interviewsByMode[interview.interviewMode] || 0) + 1;
    });

    // 10. Upcoming interviews (future date, not completed/cancelled)
    const now = new Date();
    const upcomingInterviews = allInterviews.filter(
      (int) =>
        int.interviewDate &&
        new Date(int.interviewDate) > now &&
        int.status !== "completed" &&
        int.status !== "cancelled"
    );

    // 11. Key stats
    const appliedCount = jobsByStatus["applied"] || 0;
    const screeningCount = jobsByStatus["screening"] || 0;
    const interviewScheduledCount = jobsByStatus["interview-scheduled"] || 0;
    const interviewedCount = jobsByStatus["interviewed"] || 0;
    const offersReceived = jobsByStatus["offered"] || 0;
    const rejectedCount = jobsByStatus["rejected"] || 0;
    const acceptedCount = jobsByStatus["accepted"] || 0;

    // Active jobs = applied + screening + interview-scheduled + interviewed
    const activeJobs =
      appliedCount +
      screeningCount +
      interviewScheduledCount +
      interviewedCount;

    // 12. Applications per month (for charts)
    const monthlyData = {};
    allJobs.forEach((job) => {
      if (!job.appliedDate) return;
      const d = new Date(job.appliedDate);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    const monthlySeries = Object.entries(monthlyData)
      .sort((a, b) => new Date(a[0] + "-01") - new Date(b[0] + "-01"))
      .map(([month, count]) => ({ month, applications: count }));

    // 13. Top companies (most applications to same company)
    const companyCount = {};
    allJobs.forEach((job) => {
      companyCount[job.company] = (companyCount[job.company] || 0) + 1;
    });
    const topCompanies = Object.entries(companyCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([company, count]) => ({ company, applications: count }));

    return res.status(200).json({
      success: true,
      data: {
        kpis: {
          totalJobs,
          totalCompaniesApplied,
          totalInterviews,
          activeJobs,
          offersReceived,
          rejectedCount,
          acceptedCount,
          upcomingInterviewsCount: upcomingInterviews.length,
        },
        jobsBreakdown: {
          byStatus: jobsByStatus,
          byWorkMode: jobsByWorkMode,
          byType: jobsByType,
        },
        interviewsBreakdown: {
          byStatus: interviewsByStatus,
          byMode: interviewsByMode,
        },
        jobsPipeline: {
          applied: appliedCount,
          screening: screeningCount,
          interviewScheduled: interviewScheduledCount,
          interviewed: interviewedCount,
          offered: offersReceived,
          rejected: rejectedCount,
          accepted: acceptedCount,
        },
        upcomingInterviews: upcomingInterviews.slice(0, 5),
        monthlySeries,
        topCompanies,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboard,
};
