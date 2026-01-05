const { Job, Interview, User } = require("../models");
const { queueEmail } = require("../jobs/customEmailWorker");
const {
  jobCreatedTemplate,
  jobUpdatedTemplate,
} = require("../utils/emailTemplates");

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

    if (!company || !position) {
      const error = new Error("Company and position are required");
      error.statusCode = 400;
      throw error;
    }

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
      appliedDate,
      status,
    });

    const user = await User.findByPk(userId);
    await user.increment("monthlyJobsUsed");

    // ✅ Send job created email
    try {
      const html = jobCreatedTemplate(
        user.name,
        job.company,
        job.position,
        job.appliedDate
      );
      queueEmail("job-created", {
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
      }
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
      sortBy = "appliedDate",
      order = "DESC",
      limit,
      offset,
    } = req.query;

    const whereClause = { userId };
    if (status) whereClause.status = status;

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
      const error = new Error("Job not found");
      error.statusCode = 404;
      throw error;
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
      const error = new Error("Job not found");
      error.statusCode = 404;
      throw error;
    }

    const oldStatus = job.status;

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
      const error = new Error("Job not found");
      error.statusCode = 404;
      throw error;
    }

    await job.destroy();

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
          [require("sequelize").Op.gte]: new Date(),
        },
      },
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalApplications: total,
        applied,
        screening,
        interviewed,
        offered,
        rejected,
        upcomingInterviews,
        successRate: total > 0 ? ((offered / total) * 100).toFixed(1) : 0,
      },
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
      quota: req.userQuota,
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
};
