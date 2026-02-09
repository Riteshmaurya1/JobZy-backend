//  STANDALONE CRON WORKER (Batch Processing + Non-blocking)
require("dotenv").config();
const cron = require("node-cron");
const { Op } = require("sequelize");
const sequelize = require("../config/db-connection");
const Interview = require("../models/interviewModel");
const Job = require("../models/jobModel");
const User = require("../models/userModel");
const {
  interviewReminderTemplate,
  followUpReminderTemplate,
} = require("../utils/emailTemplates");
const { queueEmail } = require("../jobs/customEmailWorker");
const logger = require("../logger/logger");

logger.info("🚀 Email Reminder Cron Worker Started");

// ✅ BATCH PROCESSING - Process emails in chunks
const BATCH_SIZE = 10; // Process 10 emails at a time

async function processBatch(items, processFn, batchName) {
  let queuedCount = 0;
  const totalBatches = Math.ceil(items.length / BATCH_SIZE);

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

    logger.info(
      `[${batchName}] Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)`,
    );

    // ✅ Process batch in parallel (non-blocking)
    await Promise.all(
      batch.map(async (item) => {
        try {
          await processFn(item);
          queuedCount++;
        } catch (error) {
          logger.error(
            {
              err: error,
              batchName,
              item: item.id,
            },
            `Failed to process ${batchName}`,
          );
        }
      }),
    );

    // Small delay between batches to avoid overwhelming queue
    if (i + BATCH_SIZE < items.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return queuedCount;
}

// 🎯 CRON 1: INTERVIEW REMINDER (Runs at 5 AM daily)
const INTERVIEW_CRON_SCHEDULE = "0 5 * * *"; // ✅ Changed back to 5 AM

cron.schedule(INTERVIEW_CRON_SCHEDULE, async () => {
  logger.info("🔔 [Interview Cron] Starting interview reminder check...");
  const startTime = Date.now();

  try {
    // Get tomorrow's date range
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    logger.info(
      `[Interview Cron] Checking interviews for: ${tomorrow.toLocaleDateString()}`,
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
              attributes: ["id", "name", "email", "tier"],
            },
          ],
        },
      ],
    });

    logger.info(`[Interview Cron] Found ${interviews.length} interviews`);

    if (interviews.length === 0) {
      logger.info("[Interview Cron] ✅ No interviews to remind about.");
      return;
    }

    // ✅ Process in batches (non-blocking)
    const queuedCount = await processBatch(
      interviews,
      async (interview) => {
        const user = interview.job.user;
        const job = interview.job;

        const interviewDate = new Date(interview.interviewDate);
        const timeStr = interview.interviewTime || "Not specified";

        const html = interviewReminderTemplate(
          user.name,
          job.company,
          job.position,
          interview.round,
          interviewDate,
          timeStr,
        );

        // Queue email (adds to SQS queue - instant)
        queueEmail("interview-reminder", {
          userId: user.id,
          email: user.email,
          name: user.name,
          subject: `🎯 Interview Tomorrow - ${job.company}`,
          html: html,
        });

        logger.debug(
          `Queued interview reminder: ${user.email} - ${job.company} (${interview.round})`,
        );
      },
      "Interview Reminder",
    );

    const duration = Date.now() - startTime;
    logger.info(
      {
        queuedCount,
        totalInterviews: interviews.length,
        duration,
      },
      `[Interview Cron] Completed! Queued ${queuedCount}/${interviews.length} emails in ${duration}ms`,
    );
  } catch (error) {
    logger.error(
      {
        err: error,
        cronType: "interview-reminder",
      },
      "[Interview Cron] Error occurred",
    );
  }
});

logger.info(`✅ Interview reminder cron scheduled: ${INTERVIEW_CRON_SCHEDULE}`);

// 📧 CRON 2: FOLLOW-UP REMINDER (Runs at 5 AM daily)
// const FOLLOWUP_CRON_SCHEDULE = "0 5 * * *"; // ✅ Changed back to 5 AM
const FOLLOWUP_CRON_SCHEDULE = "* * * * *"; // ✅ Changed back to 5 AM

cron.schedule(FOLLOWUP_CRON_SCHEDULE, async () => {
  logger.info("📧 [Follow-up Cron] Starting follow-up reminder check...");
  const startTime = Date.now();

  try {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    logger.info(
      `[Follow-up Cron] Checking follow-ups for: ${today.toLocaleDateString()}`,
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
          ],
        },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "tier"],
        },
      ],
    });

    logger.info(`[Follow-up Cron] Found ${jobs.length} follow-ups`);

    if (jobs.length === 0) {
      logger.info("[Follow-up Cron] ✅ No follow-ups to remind about.");
      return;
    }

    // ✅ Process in batches (non-blocking)
    const queuedCount = await processBatch(
      jobs,
      async (job) => {
        const user = job.user;

        const html = followUpReminderTemplate(
          user.name,
          job.company,
          job.position,
          job.status,
          job.appliedDate,
        );

        // Queue email (adds to SQS queue - instant)
        queueEmail("follow-up-reminder", {
          userId: user.id,
          email: user.email,
          name: user.name,
          subject: `📌 Follow-up Reminder - ${job.company}`,
          html: html,
        });

        logger.debug(
          `Queued follow-up reminder: ${user.email} - ${job.company} (${job.position})`,
        );
      },
      "Follow-up Reminder",
    );

    const duration = Date.now() - startTime;
    logger.info(
      {
        queuedCount,
        totalJobs: jobs.length,
        duration,
      },
      `[Follow-up Cron] Completed! Queued ${queuedCount}/${jobs.length} emails in ${duration}ms`,
    );
  } catch (error) {
    logger.error(
      {
        err: error,
        cronType: "follow-up-reminder",
      },
      "[Follow-up Cron] Error occurred",
    );
  }
});

logger.info(`✅ Follow-up reminder cron scheduled: ${FOLLOWUP_CRON_SCHEDULE}`);

// ✅ Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("🛑 SIGTERM received. Closing cron worker...");
  try {
    await sequelize.close();
    logger.info("✅ Database connections closed.");
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, "Error closing database connections");
    process.exit(1);
  }
});

process.on("SIGINT", async () => {
  logger.info("🛑 SIGINT received. Closing cron worker...");
  try {
    await sequelize.close();
    logger.info("✅ Database connections closed.");
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, "Error closing database connections");
    process.exit(1);
  }
});

logger.info("🎯 Cron Worker ready. Waiting for scheduled tasks...");
