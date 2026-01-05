const { Job, Interview, User } = require("../models");
const { Op } = require("sequelize");
const { queueEmail } = require("../jobs/customEmailWorker");
const {
  interviewScheduledTemplate,
  followUpReminderTemplate,
} = require("../utils/emailTemplates");

// POST: Schedule interview for a job
const scheduleInterview = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const { jobId } = req.params;
    console.log("userId from token:", req.payload.id);
    console.log("jobId from params:", jobId);
    const {
      round,
      interviewDate,
      interviewTime,
      interviewMode,
      meetingLink,
      interviewerName,
      interviewerEmail,
      followUpDate,
      notes,
    } = req.body;

    // Validation
    if (!round || !interviewDate) {
      return res.status(400).json({
        success: false,
        message: "Round and interview date are required",
      });
    }

    // Verify job belongs to user
    const job = await Job.findOne({ where: { id: jobId, userId } });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Create interview
    const interview = await Interview.create({
      jobId,
      round,
      interviewDate,
      interviewTime,
      interviewMode: interviewMode || "video-call",
      meetingLink,
      interviewerName,
      interviewerEmail,
      followUpDate,
      notes,
      status: "scheduled",
    });

    // ✅ UPDATE JOB STATUS
    await job.update({ status: "interview-scheduled" });

    // ✅ INCREMENT INTERVIEW COUNTER
    await req.user.increment("totalInterviews");

    // ✅ Send interview scheduled email
    try {
      const user = await User.findByPk(userId);
      const html = interviewScheduledTemplate(
        user.name,
        job.company,
        job.position,
        interview.round,
        interview.interviewDate,
        interview.interviewTime,
        interview.meetingLink
      );
      queueEmail("interview-scheduled", {
        userId: user.id, // ✅ Add userId for quota check
        email: user.email,
        name: user.name,
        subject: `📅 Interview Scheduled: ${job.company} - ${round}`,
        html,
      });
    } catch (emailError) {
      console.error(
        "[Schedule Interview] Email queue failed:",
        emailError.message
      );
    }

    return res.status(201).json({
      success: true,
      message: "Interview scheduled successfully",
      interview: {
        id: interview.id,
        jobId: interview.jobId,
        round: interview.round,
        interviewDate: interview.interviewDate,
        interviewTime: interview.interviewTime,
        interviewMode: interview.interviewMode,
        meetingLink: interview.meetingLink,
        status: interview.status,
      },
      quota: req.quota, // ✅ Show remaining quota
    });
  } catch (error) {
    next(error);
  }
};

// GET: All interviews for a job
const getInterviewsByJob = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const { jobId } = req.params;

    // Verify job belongs to user
    const job = await Job.findOne({ where: { id: jobId, userId } });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const interviews = await Interview.findAll({
      where: { jobId },
      order: [["interviewDate", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      count: interviews.length,
      job: {
        id: job.id,
        company: job.company,
        position: job.position,
        status: job.status,
      },
      interviews,
    });
  } catch (error) {
    next(error);
  }
};

// GET: Single interview by ID
const getInterviewById = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const { interviewId } = req.params;

    const interview = await Interview.findByPk(interviewId, {
      include: [
        {
          model: Job,
          as: "job",
          where: { userId },
          attributes: ["id", "company", "position", "status"],
        },
      ],
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    next(error);
  }
};

// PUT: Update interview
const updateInterview = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const { interviewId } = req.params;
    const updates = req.body;

    const interview = await Interview.findByPk(interviewId, {
      include: [
        {
          model: Job,
          as: "job",
          where: { userId },
        },
      ],
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const oldStatus = interview.status;

    // Filter allowed updates
    const allowedUpdates = {};
    const allowedFields = [
      "round",
      "interviewDate",
      "interviewTime",
      "interviewMode",
      "meetingLink",
      "interviewerName",
      "interviewerEmail",
      "status",
      "followUpDate",
      "notes",
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        allowedUpdates[field] = updates[field];
      }
    });

    await interview.update(allowedUpdates);

    // ✅ Send follow-up reminder email (if status changed to completed)
    if (updates.status === "completed" && oldStatus !== "completed") {
      try {
        const user = await User.findByPk(userId);
        const followUpDate =
          interview.followUpDate ||
          new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days later

        const html = followUpReminderTemplate(
          user.name,
          interview.job.company,
          interview.job.position,
          interview.round,
          interview.interviewDate
        );

        queueEmail("follow-up-reminder", {
          userId: user.id, // ✅ Add userId for quota check
          email: user.email,
          name: user.name,
          subject: `📩 Follow-up Reminder: ${interview.job.company}`,
          html,
        });
      } catch (emailError) {
        console.error(
          "[Update Interview] Email queue failed:",
          emailError.message
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      interview,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE: Delete interview
const deleteInterview = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const { interviewId } = req.params;

    // Find interview and verify ownership
    const interview = await Interview.findByPk(interviewId, {
      include: [
        {
          model: Job,
          as: "job",
          where: { userId },
        },
      ],
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    await interview.destroy();

    // ✅ Optional: Decrement counter
    const user = await User.findByPk(userId);
    if (user && user.totalInterviews > 0) {
      await user.decrement("totalInterviews");
    }

    return res.status(200).json({
      success: true,
      message: "Interview deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET: Upcoming interviews (all jobs)
const getUpcomingInterviews = async (req, res, next) => {
  try {
    const userId = req.payload.id;

    const interviews = await Interview.findAll({
      include: [
        {
          model: Job,
          as: "job",
          where: { userId },
          attributes: ["id", "company", "position", "status"],
        },
      ],
      where: {
        status: "scheduled",
        interviewDate: {
          [Op.gte]: new Date().toISOString().split("T")[0], // Today onwards
        },
      },
      order: [
        ["interviewDate", "ASC"],
        ["interviewTime", "ASC"],
      ],
    });

    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
      quota: req.quota, // ✅ Include quota info
    });
  } catch (error) {
    next(error);
  }
};

// GET: All interviews (with filters)
const getAllInterviews = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const {
      status,
      dateFrom,
      dateTo,
      sortBy = "interviewDate",
      order = "ASC",
    } = req.query;

    // Build where clause
    const where = {};

    if (status) {
      where.status = status;
    }

    if (dateFrom || dateTo) {
      where.interviewDate = {};
      if (dateFrom) where.interviewDate[Op.gte] = dateFrom;
      if (dateTo) where.interviewDate[Op.lte] = dateTo;
    }

    // Fetch interviews
    const interviews = await Interview.findAll({
      where,
      include: [
        {
          model: Job,
          as: "job",
          where: { userId },
          attributes: ["id", "company", "position", "status"],
        },
      ],
      order: [[sortBy, order]],
    });

    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
      quota: req.quota, // ✅ Include quota info
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  scheduleInterview,
  getInterviewsByJob,
  getInterviewById,
  updateInterview,
  deleteInterview,
  getUpcomingInterviews,
  getAllInterviews,
};
