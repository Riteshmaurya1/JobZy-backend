const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");
const logger = require("../logger/logger");

// Initialize SESv2 Client
const sesv2Client = new SESv2Client({
  region: process.env.SES_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Send email via AWS SES (Direct API)
 */
async function sendEmail(email, subject, content, isHtml = false) {
  const fromAddress = process.env.MAIL_FROM || "no-reply@jobzy.site";

  const params = {
    FromEmailAddress: fromAddress,
    Destination: {
      ToAddresses: [email],
    },
    Content: {
      Simple: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: isHtml
          ? {
              Html: {
                Data: content,
                Charset: "UTF-8",
              },
            }
          : {
              Text: {
                Data: content,
                Charset: "UTF-8",
              },
            },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const result = await sesv2Client.send(command);

    logger.info(`✅ [SES] Email sent to ${email}`);
    logger.info(`   Message ID: ${result.MessageId}`);

    return result;
  } catch (error) {
    logger.error(`❌ [SES] Failed to send to ${email}:`, error.message);
    throw error;
  }
}

module.exports = { sendEmail };
