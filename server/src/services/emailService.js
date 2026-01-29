// // server/src/services/emailService.js
// const nodemailer = require("nodemailer");
// const { SESv2Client } = require("@aws-sdk/client-sesv2");

// // Initialize SESv2 Client
// const sesv2Client = new SESv2Client({
//   region: process.env.SES_REGION || "ap-south-1",
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// // ⚠️ KEY CHANGE: Use "ses" not "SES"
// const transporter = nodemailer.createTransport({
//   ses: sesv2Client, // ← Change this line
// });

// /**
//  * Send email via AWS SES
//  */
// async function sendEmail(email, subject, content, isHtml = false) {
//   const fromAddress = process.env.MAIL_FROM || "no-reply@jobzy.site";

//   const mailOptions = {
//     from: `JobZy <${fromAddress}>`,
//     to: email,
//     subject: subject,
//     ...(isHtml ? { html: content } : { text: content }),
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log(
//       `✅ [SES] Email sent to ${email}:`,
//       info.messageId || info.response,
//     );
//     return info;
//   } catch (error) {
//     console.error(`❌ [SES] Failed to send to ${email}:`, error.message);
//     throw error;
//   }
// }

// module.exports = { sendEmail };

// server/src/services/emailService.js
// AWS SES Email Service (Direct API - No SMTP)
const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");

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

    console.log(`✅ [SES] Email sent to ${email}`);
    console.log(`   Message ID: ${result.MessageId}`);

    return result;
  } catch (error) {
    console.error(`❌ [SES] Failed to send to ${email}:`, error.message);
    throw error;
  }
}

module.exports = { sendEmail };
