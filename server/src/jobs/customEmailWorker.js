const { sendEmail } = require("../services/emailService");
const {
  welcomeTemplate,
  loginAlertTemplate,
} = require("../utils/emailTemplates");

// In-memory queue
const emailQueue = [];
let isProcessing = false;

// Queue email (non-blocking)
function queueEmail(type, data) {
  emailQueue.push({ type, data, id: Date.now(), retries: 0 });
  processQueue(); // Trigger immediate processing
}

// Process queue
async function processQueue() {
  if (isProcessing || emailQueue.length === 0) return;

  isProcessing = true;

  while (emailQueue.length > 0) {
    const job = emailQueue.shift();

    try {
      if (job.type === "welcome") {
        const html = welcomeTemplate(job.data.name);
        await sendEmail(job.data.email, "Welcome to Jobzy 🎉", html, true);
      } else if (job.type === "login-alert") {
        const html = loginAlertTemplate(
          job.data.name,
          job.data.device,
          job.data.location,
          job.data.loginTime
        );
        await sendEmail(
          job.data.email,
          "Jobzy – New login detected",
          html,
          true
        );
      }
    } catch (error) {
      console.error(`[Email Worker] Failed: ${job.type} to ${job.data.email}`);
      console.error(`[Email Worker] Error: ${error.message}`);

      // Retry logic (max 3 attempts)
      if (job.retries < 3) {
        job.retries++;
        emailQueue.push(job); // Re-queue
        console.log(
          `[Email Worker] Retry ${job.retries}/3 queued for ${job.data.email}`
        );
      } else {
        console.error(
          `[Email Worker] Max retries reached for ${job.data.email}`
        );
      }
    }
  }

  isProcessing = false;
}

// Background interval for retry/fallback
function startWorker() {
  setInterval(() => {
    if (!isProcessing && emailQueue.length > 0) {
      processQueue();
    }
  }, 5000); // Check every 5 seconds

  console.log("✅ Email worker started");
}

module.exports = { queueEmail, startWorker };
