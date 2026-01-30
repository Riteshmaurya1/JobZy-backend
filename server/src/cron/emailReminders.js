const cron = require("node-cron");
const { Op } = require("sequelize");
const Interview = require("../models/interviewModel");
const Job = require("../models/jobModel");
const User = require("../models/userModel");
const {
  interviewReminderTemplate,
  followUpReminderTemplate,
} = require("../utils/emailTemplates");
const { queueEmail } = require("../jobs/customEmailWorker");

// 🎯 CRON 1: INTERVIEW REMINDER
const INTERVIEW_CRON_SCHEDULE = "0 5 * * *";

cron.schedule(INTERVIEW_CRON_SCHEDULE, async () => {
  console.log("\n🔔 [Interview Cron] Starting interview reminder check...");
  const startTime = Date.now();

  try {
    // Get tomorrow's date range
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    console.log(
      `[Interview Cron] Checking interviews for: ${tomorrow.toLocaleDateString()}`
    );

    // Find interviews scheduled for tomorrow
    const interviews = await Interview.findAll({
      where: {
        interviewDate: {
          [Op.gte]: tomorrow,
          [Op.lt]: dayAfterTomorrow,
        },
        status: "scheduled",
      },
      include: [
        {
          model: Job,
          as: "job",
          include: [
            {
              model: User,
              as: "user",
            },
          ],
        },
      ],
    });

    console.log(`[Interview Cron] Found ${interviews.length} interviews`);

    // Queue email for each interview
    let queuedCount = 0;
    for (const interview of interviews) {
      const user = interview.job.user;
      const job = interview.job;

      // ✅ Convert to Date object first
      const interviewDate = new Date(interview.interviewDate);

      // Format date nicely
      const dateStr = interviewDate.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const timeStr = interviewDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Generate email HTML
      const html = interviewReminderTemplate(
        user.name,
        job.company,
        job.position,
        interview.round,
        interviewDate,
        timeStr
      );

      // Add to email queue
      queueEmail("interview-reminder", {
        email: user.email,
        subject: `🎯 Interview Tomorrow - ${job.company}`,
        html: html,
      });

      queuedCount++;
      console.log(`  ✅ Queued: ${user.email} - ${job.company} (${job.role})`);
    }

    const duration = Date.now() - startTime;
    console.log(
      `[Interview Cron] ✅ Completed! Queued ${queuedCount} emails in ${duration}ms\n`
    );
  } catch (error) {
    console.error("❌ [Interview Cron] Error:", error.message);
    console.error(error.stack);
  }
});

console.log(` Interview reminder cron scheduled: ${INTERVIEW_CRON_SCHEDULE}`);

// 📧 CRON 2: FOLLOW-UP REMINDER
const FOLLOWUP_CRON_SCHEDULE = "0 5 * * *";

cron.schedule(FOLLOWUP_CRON_SCHEDULE, async () => {
  console.log("\n📧 [Follow-up Cron] Starting follow-up reminder check...");
  const startTime = Date.now();

  try {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log(
      `[Follow-up Cron] Checking follow-ups for: ${today.toLocaleDateString()}`
    );

    // Find jobs with follow-up date = today
    const jobs = await Job.findAll({
      where: {
        followUpDate: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
        status: {
          [Op.in]: [
            "applied",
            "screening",
            "interview-scheduled",
            "interviewed",
            "offered",
            "rejected",
            "accepted",
            "withdrawn",
          ],
        },
      },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    console.log(`[Follow-up Cron] Found ${jobs.length} follow-ups`);

    // Queue email for each follow-up
    let queuedCount = 0;
    for (const job of jobs) {
      const user = job.user;

      // Generate email HTML
      const html = followUpReminderTemplate(
        user.name,
        job.company,
        job.position,
        job.status,
        job.appliedDate,
      );

      // Add to email queue
      queueEmail("follow-up-reminder", {
        email: user.email,
        subject: `📌 Follow-up Reminder - ${job.company}`,
        html: html,
      });

      queuedCount++;
      console.log(`  ✅ Queued: ${user.email} - ${job.company} (${job.role})`);
    }

    const duration = Date.now() - startTime;
    console.log(
      `[Follow-up Cron] ✅ Completed! Queued ${queuedCount} emails in ${duration}ms\n`
    );
  } catch (error) {
    console.error("❌ [Follow-up Cron] Error:", error.message);
    console.error(error.stack);
  }
});

console.log(` Follow-up reminder cron scheduled: ${FOLLOWUP_CRON_SCHEDULE}`);
