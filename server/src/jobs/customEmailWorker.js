// Email Worker with SQS Polling

const {
  welcomeTemplate,
  loginAlertTemplate,
} = require("../utils/emailTemplates");
const { sendEmail } = require("../services/emailService");
const {
  checkEmailQuota,
  incrementEmailCount,
} = require("../services/emailQuotaService");

// Import SQS queue service
const {
  queueEmailToSQS,
  receiveEmailsFromSQS,
  deleteEmailFromSQS,
} = require("../services/sqsQueueService");

let isProcessing = false;

/**
 * Queue an email job to SQS
 */
async function queueEmail(type, data) {
  try {
    await queueEmailToSQS(type, data);
    console.log(`✅ [Worker] Queued to SQS: ${type}`);
  } catch (error) {
    console.error(`❌ [Worker] Failed to queue:`, error.message);
  }
}

/**
 * Process Queue - Poll SQS and send emails
 */
async function processQueue() {
  if (isProcessing) return;

  isProcessing = true;

  try {
    // Receive from SQS
    const messages = await receiveEmailsFromSQS(5);

    // Process each message
    for (const message of messages) {
      try {
        const job = JSON.parse(message.Body);

        console.log(`📧 [Worker] Processing: ${job.type} → ${job.data.email}`);

        // ============================================
        // STEP 1: Check Email Quota
        // ============================================
        if (job.data.userId) {
          const quotaCheck = await checkEmailQuota(job.data.userId);

          if (!quotaCheck.allowed) {
            console.log(
              `⚠️ [Worker] Quota exhausted for user ${job.data.userId}`,
            );
            console.log(`[Worker] Quota:`, quotaCheck.quota);
            console.log(`[Worker] Message will retry after visibility timeout`);
            continue;
          }
        }

        // ============================================
        // STEP 2: Send Email
        // ============================================
        let html;

        if (job.type === "welcome") {
          html = welcomeTemplate(job.data.name);
          await sendEmail(job.data.email, "Welcome to JobZy 🎉", html, true);
        } else if (job.type === "login-alert") {
          html = loginAlertTemplate(
            job.data.name,
            job.data.device,
            job.data.location,
            job.data.loginTime,
          );
          await sendEmail(
            job.data.email,
            "JobZy – New login detected",
            html,
            true,
          );
        } else if (job.type === "interview-reminder") {
          await sendEmail(
            job.data.email,
            job.data.subject,
            job.data.html,
            true,
          );
        } else if (job.type === "follow-up-reminder") {
          await sendEmail(
            job.data.email,
            job.data.subject,
            job.data.html,
            true,
          );
        } else if (job.type === "job-created") {
          await sendEmail(
            job.data.email,
            job.data.subject,
            job.data.html,
            true,
          );
        }

        // ============================================
        // STEP 3: Update Email Counter
        // ============================================
        if (job.data.userId) {
          await incrementEmailCount(job.data.userId);
        }

        // ============================================
        // STEP 4: Delete from SQS
        // ============================================
        await deleteEmailFromSQS(message.ReceiptHandle);

        console.log(
          `✅ [Worker] SUCCESS: ${job.type} sent to ${job.data.email}`,
        );
      } catch (error) {
        console.error(`❌ [Worker] FAILED to process message:`, error.message);

        console.log(
          `[Worker] Message will reappear in queue after visibility timeout`,
        );
      }
    }
  } catch (error) {
    console.error(`❌ [Worker] Queue processing error:`, error.message);
  } finally {
    isProcessing = false;
  }
}

/**
 * Start the email worker
 */
function startWorker() {
  const pollInterval = setInterval(() => {
    if (!isProcessing) {
      processQueue();
    }
  }, 10000);

  console.log("✅ [Worker] Email worker started (polling SQS queue)");
  console.log("[Worker] Interval: 10 seconds");
  console.log("[Worker] Max messages per poll: 5");

  process.on("SIGTERM", () => {
    console.log("🛑 [Worker] SIGTERM received, stopping email worker...");
    clearInterval(pollInterval);
  });
}

module.exports = { queueEmail, startWorker };
