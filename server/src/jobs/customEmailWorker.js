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

// Queue email job
async function queueEmail(type, data) {
  try {
    await queueEmailToSQS(type, data);
    console.log(`✅ [Worker] Queued to SQS: ${type}`);
  } catch (error) {
    console.error(`❌ [Worker] Failed to queue:`, error.message);
  }
}

// Process email queue
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

        // Check email quota if userId is present
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

        // Send email based on condition
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
        } else if (job.type === "payment-confirmation"){
           await sendEmail(
            job.data.email,
            job.data.subject,
            job.data.html,
            true,
          );
        }
         else if (job.type === "interview-reminder") {
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
        } else if (job.type === "job-updated") {
          await sendEmail(
            job.data.email,
            job.data.subject,
            job.data.html,
            true,
          );
        }

        // Increment email count for quota tracking
        if (job.data.userId) {
          await incrementEmailCount(job.data.userId);
        }

        // Delete email from SQS
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

// Start Worker - Poll SQS at intervals
// function startWorker() {
//   const pollInterval = setInterval(() => {
//     if (!isProcessing) {
//       processQueue();
//     }
//   }, 10000);

//   console.log("✅ [Worker] Email worker started (polling SQS queue)");
//   console.log("[Worker] Interval: 10 seconds");
//   console.log("[Worker] Max messages per poll: 5");

//   process.on("SIGTERM", () => {
//     console.log("🛑 [Worker] SIGTERM received, stopping email worker...");
//     clearInterval(pollInterval);
//   });
// }

// ✅ FIXED VERSION
let pollInterval = null;
let isShuttingDown = false;

async function gracefulShutdown() {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log("🛑 [Worker] Graceful shutdown initiated...");

    // Stop accepting new jobs
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }

    // Wait for current job to finish (max 30 seconds)
    const maxWaitTime = 30000;
    const startTime = Date.now();

    while (isProcessing && Date.now() - startTime < maxWaitTime) {
        console.log("[Worker] Waiting for current job to finish...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (isProcessing) {
        console.warn("⚠️ [Worker] Force shutting down with job in progress");
    } else {
        console.log("✅ [Worker] All jobs completed. Shutting down cleanly.");
    }

    process.exit(0);
}

function startWorker() {
    if (pollInterval) {
        console.warn("⚠️ [Worker] Worker already running");
        return;
    }

    pollInterval = setInterval(() => {
        if (!isProcessing && !isShuttingDown) {
            processQueue();
        }
    }, 10000);

    console.log("✅ [Worker] Email worker started (polling SQS queue)");
    console.log("[Worker] Interval: 10 seconds");
    console.log("[Worker] Max messages per poll: 5");

    // Handle shutdown signals
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
}

module.exports = { queueEmail, startWorker };
