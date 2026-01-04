const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(email, subject, content, isHtml = false) {
  const mailOptions = {
    from: `"JobZy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    ...(isHtml ? { html: content } : { text: content }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[Email Service] Failed to send to ${email}:`, error.message);
    throw error;
  }
}

// ✅ IMPORTANT: Must export like this
module.exports = { sendEmail };
