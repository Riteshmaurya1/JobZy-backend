const {
  welcomeTemplate,
  loginAlertTemplate,
} = require("../utils/emailTemplates");

const emailQueue = [];
let isProcessing = false;

function queueEmail(type, data) {
  emailQueue.push({ type, data, id: Date.now(), retries: 0 });
  processQueue();
}

async function processQueue() {
  if (isProcessing || emailQueue.length === 0) return;

  isProcessing = true;

  // ✅ Import inside function (lazy load - fixes circular dependency)
  const { sendEmail } = require("../services/emailService");

  while (emailQueue.length > 0) {
    const job = emailQueue.shift();

    try {
      if (job.type === "welcome") {
        const html = welcomeTemplate(job.data.name);
        await sendEmail(job.data.email, "Welcome to JobZy 🎉", html, true);
      } else if (job.type === "login-alert") {
        const html = loginAlertTemplate(
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
      }
      // Job created email
      else if (job.type === "job-created") {
        await sendEmail(job.data.email, job.data.subject, job.data.html, true);
      }
      // Job updated email
      else if (job.type === "job-updated") {
        await sendEmail(job.data.email, job.data.subject, job.data.html, true);
      }
      // Interview scheduled email
      else if (job.type === "interview-scheduled") {
        await sendEmail(job.data.email, job.data.subject, job.data.html, true);
      }
      // Interview reminder email
      else if (job.type === "interview-reminder") {
        await sendEmail(job.data.email, job.data.subject, job.data.html, true);
      }
      // Follow-up reminder email
      else if (job.type === "follow-up-reminder") {
        await sendEmail(job.data.email, job.data.subject, job.data.html, true);
      }
    } catch (error) {
      console.error(`[Email Worker] Failed: ${job.type} to ${job.data.email}`);
      console.error(`[Email Worker] Error: ${error.message}`);

      if (job.retries < 3) {
        job.retries++;
        emailQueue.push(job);
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

function startWorker() {
  setInterval(() => {
    if (!isProcessing && emailQueue.length > 0) {
      processQueue();
    }
  }, 5000);

  console.log("✅ Email worker started");
}

module.exports = { queueEmail, startWorker };
