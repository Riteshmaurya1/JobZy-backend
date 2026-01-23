const {
  welcomeTemplate,
  loginAlertTemplate
} = require("../utils/emailTemplates");
const { sendEmail } = require("../services/emailService");
const {
  checkEmailQuota,
  incrementEmailCount,
} = require("../services/emailQuotaService");

const emailQueue = [];
let isProcessing = false;

function queueEmail(type, data) {
  emailQueue.push({ type, data, id: Date.now(), retries: 0 });
  processQueue();
}

async function processQueue() {
  if (isProcessing || emailQueue.length === 0) return;

  isProcessing = true;

  while (emailQueue.length > 0) {
    const job = emailQueue.shift();

    try {
      // ✅ CHECK EMAIL QUOTA BEFORE SENDING
      if (job.data.userId) {
        const quotaCheck = await checkEmailQuota(job.data.userId);

        if (!quotaCheck.allowed) {
          console.log(
            `[Email Worker] ⚠️ Quota exhausted for user ${job.data.userId}`
          );
          console.log(`[Email Worker] Quota:`, quotaCheck.quota);

          // ❌ SKIP SENDING - Quota exhausted
          // Optionally: Store failed email attempt in database
          continue;
        }
      }

      // ✅ SEND EMAIL (existing logic)
      let html;

      if (job.type === "welcome") {
        html = welcomeTemplate(job.data.name);
        await sendEmail(job.data.email, "Welcome to JobZy 🎉", html, true);
      } else if (job.type === "login-alert") {
        html = loginAlertTemplate(
          job.data.name,
          job.data.device,
          job.data.location,
          job.data.loginTime
        );
        await sendEmail(
          job.data.email,
          "JobZy – New login detected",
          html,
          true
        );
      } else if (job.type === "interview-reminder") {
        await sendEmail(job.data.email, job.data.subject, job.data.html, true);
      } else if (job.type === "follow-up-reminder") {
        await sendEmail(job.data.email, job.data.subject, job.data.html, true);
      } else if (job.type === "job-created") {
        await sendEmail(job.data.email, job.data.subject, job.data.html, true);
      }

      // ✅ INCREMENT EMAIL COUNTER AFTER SUCCESSFUL SEND
      if (job.data.userId) {
        await incrementEmailCount(job.data.userId);
      }

      console.log(`[Email Worker] ✅ Sent: ${job.type} to ${job.data.email}`);
    } catch (error) {
      console.error(`[Email Worker] Failed: ${job.type} to ${job.data.email}`);
      console.error(`[Email Worker] Error: ${error.message}`);

      // Retry logic
      if (job.retries < 3) {
        job.retries++;
        emailQueue.push(job);
        console.log(
          `[Email Worker] Retry ${job.retries}/3 queued for ${job.data.email}`
        );
      }
    }
  }

  isProcessing = false;
}

function startWorker() {
  setInterval(() => {
    if (!isProcessing && emailQueue.length > 0) {
      processQueue();
    }
  }, 5000);

  console.log("✅ Email worker started with quota checking");
}

module.exports = { queueEmail, startWorker };
