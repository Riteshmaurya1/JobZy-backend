const { Job, Interview, User } = require("../models");
const { queueEmail } = require("../jobs/customEmailWorker");

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

    // Validate required fields
    if (!round || !interviewDate) {
      const error = new Error("Round and interview date are required");
      error.statusCode = 400;
      throw error;
    }

    // Check if job exists and belongs to user
    const job = await Job.findOne({ where: { id: jobId, userId } });
    if (!job) {
      const error = new Error("Job not found");
      error.statusCode = 404;
      throw error;
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

    // Update job status
    await job.update({ status: "interview-scheduled" });

    // Queue reminder email (optional - implement later with scheduling)
    try {
      const user = await User.findByPk(userId);
      console.log(
        `📅 Interview scheduled for ${user.email} on ${interviewDate}`
      );
      // Future: Schedule reminder email 1 day before
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
    const {
      round,
      interviewDate,
      interviewTime,
      interviewMode,
      meetingLink,
      interviewerName,
      interviewerEmail,
      status,
      followUpDate,
      notes,
    } = req.body;

    // Find interview and verify ownership through job
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

    // Build updates object
    const updates = {};
    if (round !== undefined) updates.round = round;
    if (interviewDate !== undefined) updates.interviewDate = interviewDate;
    if (interviewTime !== undefined) updates.interviewTime = interviewTime;
    if (interviewMode !== undefined) updates.interviewMode = interviewMode;
    if (meetingLink !== undefined) updates.meetingLink = meetingLink;
    if (interviewerName !== undefined)
      updates.interviewerName = interviewerName;
    if (interviewerEmail !== undefined)
      updates.interviewerEmail = interviewerEmail;
    if (status !== undefined) updates.status = status;
    if (followUpDate !== undefined) updates.followUpDate = followUpDate;
    if (notes !== undefined) updates.notes = notes;

    await interview.update(updates);

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
