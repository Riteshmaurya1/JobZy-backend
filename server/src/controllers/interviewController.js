const { Job, Interview, User } = require("../models");
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

    if (!round || !interviewDate) {
      const error = new Error("Round and interview date are required");
      error.statusCode = 400;
      throw error;
    }

    const job = await Job.findOne({ where: { id: jobId, userId } });
    if (!job) {
      const error = new Error("Job not found");
      error.statusCode = 404;
      throw error;
    }

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

    await job.update({ status: "interview-scheduled" });

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
        status: interview.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET: Get all interviews for a job
const getInterviewsByJob = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const { jobId } = req.params;

    // Verify job belongs to user
    const job = await Job.findOne({ where: { id: jobId, userId } });
    if (!job) {
      const error = new Error("Job not found");
      error.statusCode = 404;
      throw error;
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
      },
      interviews,
    });
  } catch (error) {
    next(error);
  }
};

// GET: Get single interview by ID
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
      const error = new Error("Interview not found");
      error.statusCode = 404;
      throw error;
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
      const error = new Error("Interview not found");
      error.statusCode = 404;
      throw error;
    }

    const oldStatus = interview.status;

    const allowedUpdates = {};
    if (updates.round !== undefined) allowedUpdates.round = updates.round;
    if (updates.interviewDate !== undefined)
      allowedUpdates.interviewDate = updates.interviewDate;
    if (updates.interviewTime !== undefined)
      allowedUpdates.interviewTime = updates.interviewTime;
    if (updates.interviewMode !== undefined)
      allowedUpdates.interviewMode = updates.interviewMode;
    if (updates.meetingLink !== undefined)
      allowedUpdates.meetingLink = updates.meetingLink;
    if (updates.interviewerName !== undefined)
      allowedUpdates.interviewerName = updates.interviewerName;
    if (updates.interviewerEmail !== undefined)
      allowedUpdates.interviewerEmail = updates.interviewerEmail;
    if (updates.status !== undefined) allowedUpdates.status = updates.status;
    if (updates.followUpDate !== undefined)
      allowedUpdates.followUpDate = updates.followUpDate;
    if (updates.notes !== undefined) allowedUpdates.notes = updates.notes;

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
      const error = new Error("Interview not found");
      error.statusCode = 404;
      throw error;
    }

    await interview.destroy();

    return res.status(200).json({
      success: true,
      message: "Interview deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET: Get upcoming interviews (all jobs)
const getUpcomingInterviews = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const { Op } = require("sequelize");

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
};
