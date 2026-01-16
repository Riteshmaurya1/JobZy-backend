const { Job, Interview, User } = require("../models");
const { Op } = require("sequelize");
const { queueEmail } = require("../jobs/customEmailWorker");
const {
  jobCreatedTemplate,
  jobUpdatedTemplate,
} = require("../utils/emailTemplates");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { generatePDFTemplate, generateHTMLResponse } = require("../utils/pdfTemplate");

// POST: Create new job application
const createJob = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const {
      company,
      position,
      jobLink,
      location,
      workMode,
      jobType,
      salary,
      platform,
      notes,
      resumeVersion,
      followUpDate,
      appliedDate,
      status,
    } = req.body;

    // Validation
    if (!company || !position) {
      return res.status(400).json({
        success: false,
        message: "Company and position are required",
      });
    }

    // Create job
    const job = await Job.create({
      userId,
      company,
      position,
      jobLink,
      location,
      workMode,
      jobType,
      salary,
      platform,
      notes,
      resumeVersion,
      followUpDate,
      appliedDate: appliedDate || new Date(),
      status: status || "applied",
    });

    // ✅ INCREMENT USAGE COUNTER
    await req.user.increment("monthlyJobsUsed");

    // ✅ Send job created email
    try {
      const user = await User.findByPk(userId); // Fetch user
      const html = jobCreatedTemplate(
        user.name,
        job.company,
        job.position,
        job.appliedDate
      );
      queueEmail("job-created", {
        userId: user.id, // ✅ Add userId for quota check
        email: user.email,
        name: user.name,
        subject: `✅ Job Application Tracked: ${company}`,
        html,
      });
    } catch (emailError) {
      console.error("[Create Job] Email queue failed:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Job application created successfully",
      job: {
        id: job.id,
        company: job.company,
        position: job.position,
        status: job.status,
        appliedDate: job.appliedDate,
      },
      quota: req.quota, // ✅ Changed from req.userQuota
    });
  } catch (error) {
    next(error);
  }
};

// GET: Fetch all jobs for current user
const getAllJobs = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const {
      status,
      company,
      position,
      workMode,
      sortBy = "appliedDate",
      order = "DESC",
      limit,
      offset,
    } = req.query;

    // Build where clause
    const whereClause = { userId };

    if (status) {
      whereClause.status = status;
    }

    if (company) {
      whereClause.company = { [Op.iLike]: `%${company}%` };
    }

    if (position) {
      whereClause.position = { [Op.iLike]: `%${position}%` };
    }

    if (workMode) {
      whereClause.workMode = workMode;
    }

    // Query options
    const queryOptions = {
      where: whereClause,
      include: [
        {
          model: Interview,
          as: "interviews",
          attributes: [
            "id",
            "round",
            "interviewDate",
            "interviewTime",
            "status",
          ],
        },
      ],
      order: [[sortBy, order]],
    };

    if (limit) {
      queryOptions.limit = parseInt(limit);
      queryOptions.offset = offset ? parseInt(offset) : 0;
    }

    const jobs = await Job.findAll(queryOptions);
    const totalCount = await Job.count({ where: whereClause });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      totalCount,
      jobs,
      quota: req.quota, // ✅ Include quota info
    });
  } catch (error) {
    next(error);
  }
};

// GET: Fetch single job by ID
const getJobById = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const { jobId } = req.params;

    const job = await Job.findOne({
      where: { id: jobId, userId },
      include: [
        {
          model: Interview,
          as: "interviews",
          order: [["interviewDate", "ASC"]],
        },
      ],
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

// PUT: Update job application
const updateJob = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const { jobId } = req.params;
    const updates = req.body;

    const job = await Job.findOne({ where: { id: jobId, userId } });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const oldStatus = job.status;

    // Allowed fields to update
    const allowedFields = [
      "company",
      "position",
      "jobLink",
      "location",
      "workMode",
      "jobType",
      "salary",
      "status",
      "platform",
      "notes",
      "resumeVersion",
      "followUpDate",
    ];

    // Filter only allowed fields
    const filteredUpdates = {};
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    await job.update(filteredUpdates);

    // ✅ Send status update email (only if status changed)
    if (updates.status && updates.status !== oldStatus) {
      try {
        const user = await User.findByPk(userId);
        const html = jobUpdatedTemplate(
          user.name,
          job.company,
          job.position,
          oldStatus,
          job.status
        );
        queueEmail("job-updated", {
          userId: user.id, // ✅ Add userId for quota check
          email: user.email,
          name: user.name,
          subject: `📊 Job Status Updated: ${job.company}`,
          html,
        });
      } catch (emailError) {
        console.error("[Update Job] Email queue failed:", emailError.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE: Delete job application
const deleteJob = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const { jobId } = req.params;

    const job = await Job.findOne({ where: { id: jobId, userId } });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await job.destroy();

    // ✅ Optional: Decrement usage counter
    const user = await User.findByPk(userId);
    if (user && user.monthlyJobsUsed > 0) {
      await user.decrement("monthlyJobsUsed");
    }

    return res.status(200).json({
      success: true,
      message: "Job application deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET: Job statistics
const getJobStats = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const userTier = req.payload.tier || "free";

    // ✅ Basic stats (available for all)
    const [total, applied, screening, interviewed, offered, rejected] =
      await Promise.all([
        Job.count({ where: { userId } }),
        Job.count({ where: { userId, status: "applied" } }),
        Job.count({ where: { userId, status: "screening" } }),
        Job.count({ where: { userId, status: "interviewed" } }),
        Job.count({ where: { userId, status: "offered" } }),
        Job.count({ where: { userId, status: "rejected" } }),
      ]);

    const upcomingInterviews = await Interview.count({
      include: [
        {
          model: Job,
          as: "job",
          where: { userId },
        },
      ],
      where: {
        status: "scheduled",
        interviewDate: {
          [Op.gte]: new Date(),
        },
      },
    });

    const successRate = total > 0 ? ((offered / total) * 100).toFixed(1) : 0;

    // ✅ Advanced stats (Premium+ only)
    let advancedStats = null;

    if (userTier !== "free") {
      // Last 30 days activity
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentJobs = await Job.count({
        where: {
          userId,
          appliedDate: { [Op.gte]: thirtyDaysAgo },
        },
      });

      // Interview conversion rate
      const interviewRate =
        total > 0 ? ((interviewed / total) * 100).toFixed(1) : 0;

      // Offer conversion rate
      const offerRate =
        interviewed > 0 ? ((offered / interviewed) * 100).toFixed(1) : 0;

      // Top companies (most applications)
      const topCompanies = await Job.findAll({
        where: { userId },
        attributes: [
          "company",
          [require("sequelize").fn("COUNT", "company"), "count"],
        ],
        group: ["company"],
        order: [[require("sequelize").literal("count"), "DESC"]],
        limit: 5,
        raw: true,
      });

      // Average response time (mock - calculate from actual data)
      const avgResponseDays = 5;

      advancedStats = {
        last30Days: recentJobs,
        interviewConversionRate: parseFloat(interviewRate),
        offerConversionRate: parseFloat(offerRate),
        avgResponseTime: `${avgResponseDays} days`,
        topCompanies: topCompanies.map((c) => ({
          name: c.company,
          applications: parseInt(c.count),
        })),
        monthlyTrend: {
          // You can calculate actual monthly trends
          current: recentJobs,
          previous: recentJobs - 2, // Mock data
        },
      };
    }

    return res.status(200).json({
      success: true,
      stats: {
        basic: {
          totalApplications: total,
          applied,
          screening,
          interviewed,
          offered,
          rejected,
          upcomingInterviews,
          successRate: parseFloat(successRate),
        },
        advanced: advancedStats,
      },
      quota: req.quota,
    });
  } catch (error) {
    next(error);
  }
};

// GET: Get quota info only
const getQuotaInfo = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      quota: req.quota, // ✅ Changed from req.userQuota
    });
  } catch (error) {
    next(error);
  }
};

// GET: Export jobs as PDF (Premium+)
const exportJobsPDF = async (req, res, next) => {
  try {
    const userId = req.payload.id;

    const jobs = await Job.findAll({
      where: { userId },
      include: [
        {
          model: Interview,
          as: "interviews",
        },
      ],
      order: [["appliedDate", "DESC"]],
      raw: false,
    });

    if (!jobs || jobs.length === 0) {
      const htmlResponse = generateHTMLResponse(null, null, null, true);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(htmlResponse);
    }

    // Create exports directory
    const exportsDir = path.join(__dirname, "../exports");
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Create PDF
    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
      bufferPages: true,
    });

    const fileName = `jobs-${userId}-${Date.now()}.pdf`;
    const filePath = path.join(exportsDir, fileName);
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Generate PDF content using template
    generatePDFTemplate(doc, jobs);

    doc.end();

    // Handle stream events
    stream.on("finish", () => {
      // Calculate stats
      const stats = {
        total: jobs.length,
        applied: jobs.filter((j) => j.status === "applied").length,
        screening: jobs.filter((j) => j.status === "screening").length,
        "interview-scheduled": jobs.filter(
          (j) => j.status === "interview-scheduled"
        ).length,
        interviewed: jobs.filter((j) => j.status === "interviewed").length,
        offered: jobs.filter((j) => j.status === "offered").length,
        rejected: jobs.filter((j) => j.status === "rejected").length,
        accepted: jobs.filter((j) => j.status === "accepted").length,
      };

      const htmlResponse = generateHTMLResponse(jobs, stats, fileName);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.status(200).send(htmlResponse);
    });

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      fs.unlink(filePath, () => {});
      res.status(500).json({
        success: false,
        message: "PDF generation failed",
        error: err.message,
      });
    });
  } catch (error) {
    console.error("Export error:", error);
    next(error);
  }
};

// GET: Export jobs as CSV (Premium+)
const exportJobsCSV = async (req, res, next) => {
  try {
    const userId = req.payload.id;

    const jobs = await Job.findAll({
      where: { userId },
      order: [["appliedDate", "DESC"]],
      raw: true,
    });

    // ✅ Generate CSV content
    const csvHeader = [
      "Company",
      "Position",
      "Status",
      "Applied Date",
      "Location",
      "Work Mode",
      "Job Type",
      "Salary",
      "Platform",
    ].join(",");

    const csvRows = jobs.map((job) =>
      [
        job.company,
        job.position,
        job.status,
        job.appliedDate,
        job.location || "N/A",
        job.workMode || "N/A",
        job.jobType || "N/A",
        job.salary || "N/A",
        job.platform || "N/A",
      ].join(",")
    );

    const csv = [csvHeader, ...csvRows].join("\n");

    // ✅ Set CSV headers
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=jobs-${new Date().toISOString().split("T")[0]}.csv`
    );

    return res.send(csv);
  } catch (error) {
    next(error);
  }
};

// ************ Advanced search (Premium+) **********
const advancedSearch = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const {
      company,
      position,
      status,
      location,
      workMode,
      jobType,
      salaryMin,
      salaryMax,
      platform,
      dateFrom,
      dateTo,
      hasInterview,
    } = req.body;

    // ✅ Build complex where clause
    const where = { userId };

    if (company) {
      where.company = { [Op.iLike]: `%${company}%` };
    }

    if (position) {
      where.position = { [Op.iLike]: `%${position}%` };
    }

    if (status) {
      where.status = status;
    }

    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    if (workMode) {
      where.workMode = workMode;
    }

    if (jobType) {
      where.jobType = jobType;
    }

    if (platform) {
      where.platform = platform;
    }

    // Salary range filter (assuming salary is stored as string like "10-15 LPA")
    if (salaryMin || salaryMax) {
      // You might need to adjust this based on your salary format
      where.salary = { [Op.ne]: null };
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.appliedDate = {};
      if (dateFrom) where.appliedDate[Op.gte] = dateFrom;
      if (dateTo) where.appliedDate[Op.lte] = dateTo;
    }

    // ✅ Include interviews if requested
    const includeOptions = [];

    if (hasInterview) {
      includeOptions.push({
        model: Interview,
        as: "interviews",
        required: true, // INNER JOIN - only jobs with interviews
      });
    } else {
      includeOptions.push({
        model: Interview,
        as: "interviews",
        required: false, // LEFT JOIN - all jobs
      });
    }

    // ✅ Execute query
    const jobs = await Job.findAll({
      where,
      include: includeOptions,
      order: [["appliedDate", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Advanced search completed",
      count: jobs.length,
      jobs,
      filters: req.body,
    });
  } catch (error) {
    next(error);
  }
};

const basicSearch = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }
    const jobs = await Job.findAll({
      where: {
        userId,
        [Op.or]: [
          { company: { [Op.iLike]: `%${query}%` } },
          { position: { [Op.iLike]: `%${query}%` } },
          { location: { [Op.iLike]: `%${query}%` } },
        ],
      },
      order: [["appliedDate", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Basic search completed",
      count: jobs.length,
      jobs,
      query,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
