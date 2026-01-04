// Authentication like login and sign up.
function loginAlertTemplate(name, device, location, loginTime) {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; background:#f4f4f5; padding:0px;">

      <table width="100%" cellspacing="0" cellpadding="0"
        style="
          max-width:560px;
          margin:auto;
          background:#ffffff;
          border-radius:12px;
          border:2px dashed #cfd1d4;
          padding:0;
        ">

        <!-- Header -->
        <tr>
          <td style="
            padding:18px 24px;
            font-size:18px;
            font-weight:600;
            color:#111;
            border-bottom:1px solid #f0f0f0;
          ">
            New Login Detected
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:24px 24px 8px; color:#333; font-size:15px;">
            Hi ${name},
            <br><br>
            We noticed a new login to your JobZy account.  
            If this was you, no action is needed.
          </td>
        </tr>

        <!-- Details -->
        <tr>
          <td style="padding:14px 24px;">
            <table width="100%" style="font-size:14px; color:#444; border-collapse:collapse;">
              <tr>
                <td style="padding:6px 0; width:120px; opacity:0.7;">Device</td>
                <td style="padding:6px 0;"><strong>${device}</strong></td>
              </tr>
              <tr>
                <td style="padding:6px 0; opacity:0.7;">Location</td>
                <td style="padding:6px 0;">${location}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; opacity:0.7;">Time</td>
                <td style="padding:6px 0;">${loginTime}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Security Note -->
        <tr>
          <td style="padding:10px 24px 20px;">
            <div style="
              margin-top:8px;
              padding:16px;
              background:#fafafa;
              border-radius:8px;
              border:1px solid #efefef;
            ">
              <div style="font-size:14px; font-weight:600; margin-bottom:8px; color:#222;">
                Security Notice
              </div>

              <div style="font-size:14px; line-height:1.6; color:#555;">
                If you do not recognize this login, please change your password
                immediately and review your account activity.
              </div>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="
            background:#fbfbfb;
            padding:14px 24px;
            font-size:11px;
            color:#999;
            border-radius:0 0 12px 12px;
            text-align:center;
            border-top:1px solid #efefef;
          ">
            This security email was sent to protect your JobZy account.<br>
            © ${new Date().getFullYear()} JobZy.
          </td>
        </tr>

      </table>
    </body>
  </html>`;
}

function welcomeTemplate(name) {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; background:#f4f4f5; padding:28px;">

      <table width="100%" cellspacing="0" cellpadding="0"
        style="
          max-width:560px;
          margin:auto;
          background:#ffffff;
          border-radius:12px;
          border:2px dashed #cfd1d4;
        ">

        <!-- Header -->
        <tr>
          <td style="
            padding:18px 24px;
            font-size:18px;
            font-weight:600;
            color:#111;
            border-bottom:1px solid #f0f0f0;
          ">
            Welcome to JobZy 🎉
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:24px; color:#333; font-size:15px;">
            Hi ${name},
            <br><br>
            Welcome to <strong>JobZy</strong>!  
            Your account has been successfully created 🎉  
            JobZy helps you organize, track, and improve your job search journey — all in one place.
          </td>
        </tr>

        <!-- Features -->
        <tr>
          <td style="padding:0 24px 20px;">
            <div style="
              background:#fafafa;
              border:1px solid #efefef;
              border-radius:8px;
              padding:16px;
            ">
              <div style="font-weight:600; margin-bottom:10px; color:#222;">
                What you can do with JobZy
              </div>

              <ul style="margin:0; padding-left:18px; line-height:1.7; color:#555; font-size:14px;">
                <li>Add and manage all your job applications in one dashboard</li>
                <li>Track interview rounds, dates, and follow-ups</li>
                <li>Get email reminders before interviews so you never miss one</li>
                <li>Monitor your application success rate and insights</li>
                <li>Keep notes for each job and interview</li>
              </ul>
            </div>
          </td>
        </tr>

        <!-- Getting Started -->
        <tr>
          <td style="padding:0 24px 20px; font-size:14px; color:#444;">
            <strong>Getting started:</strong><br>
            Start by adding your first job application.  
            Once an interview is scheduled, JobZy will automatically remind you before the interview date.
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="
            background:#fbfbfb;
            padding:14px 24px;
            font-size:11px;
            color:#999;
            border-radius:0 0 12px 12px;
            text-align:center;
            border-top:1px solid #efefef;
          ">
            You are receiving this email because you signed up on JobZy.<br>
            © ${new Date().getFullYear()} JobZy. All rights reserved.
          </td>
        </tr>

      </table>
    </body>
  </html>`;
}

// ✅ NEW: Job Application Created
function jobCreatedTemplate(name, company, position, appliedDate) {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; background:#f4f4f5; padding:28px;">
      <table width="100%" cellspacing="0" cellpadding="0"
        style="max-width:560px; margin:auto; background:#ffffff; border-radius:12px; border:2px dashed #cfd1d4;">
        
        <tr>
          <td style="padding:18px 24px; font-size:18px; font-weight:600; color:#111; border-bottom:1px solid #f0f0f0;">
            ✅ Job Application Tracked
          </td>
        </tr>

        <tr>
          <td style="padding:24px; color:#333; font-size:15px;">
            Hi ${name},
            <br><br>
            Your job application has been successfully added to JobZy!
          </td>
        </tr>

        <tr>
          <td style="padding:0 24px 20px;">
            <table width="100%" style="font-size:14px; color:#444; border-collapse:collapse;">
              <tr>
                <td style="padding:6px 0; width:120px; opacity:0.7;">Company</td>
                <td style="padding:6px 0;"><strong>${company}</strong></td>
              </tr>
              <tr>
                <td style="padding:6px 0; opacity:0.7;">Position</td>
                <td style="padding:6px 0;">${position}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; opacity:0.7;">Applied On</td>
                <td style="padding:6px 0;">${new Date(
                  appliedDate
                ).toLocaleDateString("en-IN")}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:10px 24px 20px; font-size:14px; color:#555;">
            🎯 Keep tracking your progress on JobZy. We'll remind you before interviews!
          </td>
        </tr>

        <tr>
          <td style="background:#fbfbfb; padding:14px 24px; font-size:11px; color:#999; border-radius:0 0 12px 12px; text-align:center; border-top:1px solid #efefef;">
            © ${new Date().getFullYear()} JobZy. Happy Job Hunting!
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

// ✅ NEW: Job Status Updated
function jobUpdatedTemplate(name, company, position, oldStatus, newStatus) {
  const statusEmojis = {
    applied: "📝",
    screening: "🔍",
    "interview-scheduled": "📅",
    interviewed: "✅",
    offered: "🎉",
    rejected: "❌",
    accepted: "🚀",
    withdrawn: "🔙",
  };

  return `
  <html>
    <body style="font-family: Arial, sans-serif; background:#f4f4f5; padding:28px;">
      <table width="100%" cellspacing="0" cellpadding="0"
        style="max-width:560px; margin:auto; background:#ffffff; border-radius:12px; border:2px dashed #cfd1d4;">
        
        <tr>
          <td style="padding:18px 24px; font-size:18px; font-weight:600; color:#111; border-bottom:1px solid #f0f0f0;">
            ${statusEmojis[newStatus] || "📊"} Job Status Updated
          </td>
        </tr>

        <tr>
          <td style="padding:24px; color:#333; font-size:15px;">
            Hi ${name},
            <br><br>
            Your application status has been updated!
          </td>
        </tr>

        <tr>
          <td style="padding:0 24px 20px;">
            <table width="100%" style="font-size:14px; color:#444;">
              <tr>
                <td style="padding:6px 0; opacity:0.7;">Company</td>
                <td style="padding:6px 0;"><strong>${company}</strong></td>
              </tr>
              <tr>
                <td style="padding:6px 0; opacity:0.7;">Position</td>
                <td style="padding:6px 0;">${position}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; opacity:0.7;">Status</td>
                <td style="padding:6px 0;">
                  <span style="text-decoration:line-through; opacity:0.5;">${oldStatus}</span>
                  → <strong style="color:#16a34a;">${newStatus}</strong>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#fbfbfb; padding:14px 24px; font-size:11px; color:#999; border-radius:0 0 12px 12px; text-align:center; border-top:1px solid #efefef;">
            © ${new Date().getFullYear()} JobZy.
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

// ✅ NEW: Interview Scheduled
function interviewScheduledTemplate(
  name,
  company,
  position,
  round,
  date,
  time,
  meetingLink
) {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; background:#f4f4f5; padding:28px;">
      <table width="100%" cellspacing="0" cellpadding="0"
        style="max-width:560px; margin:auto; background:#ffffff; border-radius:12px; border:2px dashed #cfd1d4;">
        
        <tr>
          <td style="padding:18px 24px; font-size:18px; font-weight:600; color:#111; border-bottom:1px solid #f0f0f0;">
            📅 Interview Scheduled!
          </td>
        </tr>

        <tr>
          <td style="padding:24px; color:#333; font-size:15px;">
            Hi ${name},
            <br><br>
            Great news! Your interview has been scheduled.
          </td>
        </tr>

        <tr>
          <td style="padding:0 24px 20px;">
            <table width="100%" style="font-size:14px; color:#444;">
              <tr>
                <td style="padding:6px 0; width:120px; opacity:0.7;">Company</td>
                <td style="padding:6px 0;"><strong>${company}</strong></td>
              </tr>
              <tr>
                <td style="padding:6px 0; opacity:0.7;">Position</td>
                <td style="padding:6px 0;">${position}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; opacity:0.7;">Round</td>
                <td style="padding:6px 0;">${round}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; opacity:0.7;">Date</td>
                <td style="padding:6px 0;"><strong>${new Date(
                  date
                ).toLocaleDateString("en-IN", {
                  dateStyle: "full",
                })}</strong></td>
              </tr>
              ${
                time
                  ? `<tr>
                <td style="padding:6px 0; opacity:0.7;">Time</td>
                <td style="padding:6px 0;">${time}</td>
              </tr>`
                  : ""
              }
              ${
                meetingLink
                  ? `<tr>
                <td style="padding:6px 0; opacity:0.7;">Meeting Link</td>
                <td style="padding:6px 0;"><a href="${meetingLink}" style="color:#2563eb;">Join Meeting</a></td>
              </tr>`
                  : ""
              }
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:10px 24px 20px;">
            <div style="background:#fef3c7; border:1px solid #fde047; border-radius:8px; padding:16px;">
              <div style="font-size:14px; font-weight:600; margin-bottom:8px; color:#222;">
                💡 Preparation Tip
              </div>
              <div style="font-size:14px; color:#555;">
                We'll send you a reminder 1 day before the interview. Good luck! 🚀
              </div>
            </div>
          </td>
        </tr>

        <tr>
          <td style="background:#fbfbfb; padding:14px 24px; font-size:11px; color:#999; border-radius:0 0 12px 12px; text-align:center; border-top:1px solid #efefef;">
            © ${new Date().getFullYear()} JobZy.
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

// ✅ NEW: Interview Reminder (1 day before)
function interviewReminderTemplate(
  name,
  company,
  position,
  round,
  date,
  time,
  meetingLink
) {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; background:#f4f4f5; padding:28px;">
      <table width="100%" cellspacing="0" cellpadding="0"
        style="max-width:560px; margin:auto; background:#ffffff; border-radius:12px; border:2px solid #f59e0b;">
        
        <tr>
          <td style="padding:18px 24px; font-size:18px; font-weight:600; color:#111; border-bottom:1px solid #f0f0f0; background:#fef3c7;">
            ⏰ Interview Tomorrow!
          </td>
        </tr>

        <tr>
          <td style="padding:24px; color:#333; font-size:15px;">
            Hi ${name},
            <br><br>
            This is a friendly reminder about your <strong>interview tomorrow</strong>!
          </td>
        </tr>

        <tr>
          <td style="padding:0 24px 20px;">
            <table width="100%" style="font-size:14px; color:#444;">
              <tr>
                <td style="padding:6px 0; width:120px; opacity:0.7;">Company</td>
                <td style="padding:6px 0;"><strong>${company}</strong></td>
              </tr>
              <tr>
                <td style="padding:6px 0; opacity:0.7;">Position</td>
                <td style="padding:6px 0;">${position}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; opacity:0.7;">Round</td>
                <td style="padding:6px 0;">${round}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; opacity:0.7;">Date</td>
                <td style="padding:6px 0;"><strong style="color:#dc2626;">${new Date(
                  date
                ).toLocaleDateString("en-IN", {
                  dateStyle: "full",
                })}</strong></td>
              </tr>
              ${
                time
                  ? `<tr>
                <td style="padding:6px 0; opacity:0.7;">Time</td>
                <td style="padding:6px 0;"><strong>${time}</strong></td>
              </tr>`
                  : ""
              }
              ${
                meetingLink
                  ? `<tr>
                <td style="padding:6px 0; opacity:0.7;">Meeting Link</td>
                <td style="padding:6px 0;"><a href="${meetingLink}" style="color:#2563eb; font-weight:600;">Join Meeting →</a></td>
              </tr>`
                  : ""
              }
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:10px 24px 20px;">
            <div style="background:#dcfce7; border:1px solid #86efac; border-radius:8px; padding:16px;">
              <div style="font-size:14px; font-weight:600; margin-bottom:8px; color:#166534;">
                ✅ Quick Checklist
              </div>
              <ul style="margin:8px 0; padding-left:20px; font-size:13px; color:#15803d; line-height:1.7;">
                <li>Test your internet & audio/video setup</li>
                <li>Review your resume and job description</li>
                <li>Prepare questions for the interviewer</li>
                <li>Arrive 5 minutes early (virtual/in-person)</li>
              </ul>
            </div>
          </td>
        </tr>

        <tr>
          <td style="background:#fbfbfb; padding:14px 24px; font-size:11px; color:#999; border-radius:0 0 12px 12px; text-align:center; border-top:1px solid #efefef;">
            You got this! 💪 © ${new Date().getFullYear()} JobZy.
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

// ✅ NEW: Follow-up Reminder (after interview)
function followUpReminderTemplate(
  name,
  company,
  position,
  round,
  interviewDate
) {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; background:#f4f4f5; padding:28px;">
      <table width="100%" cellspacing="0" cellpadding="0"
        style="max-width:560px; margin:auto; background:#ffffff; border-radius:12px; border:2px dashed #cfd1d4;">
        
        <tr>
          <td style="padding:18px 24px; font-size:18px; font-weight:600; color:#111; border-bottom:1px solid #f0f0f0;">
            📩 Follow-up Reminder
          </td>
        </tr>

        <tr>
          <td style="padding:24px; color:#333; font-size:15px;">
            Hi ${name},
            <br><br>
            It's been a few days since your interview at <strong>${company}</strong>. Consider sending a follow-up email!
          </td>
        </tr>

        <tr>
          <td style="padding:0 24px 20px;">
            <table width="100%" style="font-size:14px; color:#444;">
              <tr>
                <td style="padding:6px 0; opacity:0.7;">Company</td>
                <td style="padding:6px 0;"><strong>${company}</strong></td>
              </tr>
              <tr>
                <td style="padding:6px 0; opacity:0.7;">Position</td>
                <td style="padding:6px 0;">${position}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; opacity:0.7;">Interview</td>
                <td style="padding:6px 0;">${round} on ${new Date(
    interviewDate
  ).toLocaleDateString("en-IN")}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:10px 24px 20px;">
            <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; padding:16px;">
              <div style="font-size:14px; font-weight:600; margin-bottom:8px; color:#075985;">
                💌 Sample Follow-up
              </div>
              <div style="font-size:13px; color:#0c4a6e; line-height:1.6; font-style:italic;">
                "Thank you for the opportunity to interview for the ${position} role. I remain very interested in this position and would appreciate any updates on the hiring process."
              </div>
            </div>
          </td>
        </tr>

        <tr>
          <td style="background:#fbfbfb; padding:14px 24px; font-size:11px; color:#999; border-radius:0 0 12px 12px; text-align:center; border-top:1px solid #efefef;">
            © ${new Date().getFullYear()} JobZy.
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

module.exports = {
  loginAlertTemplate,
  welcomeTemplate,
  jobCreatedTemplate,
  jobUpdatedTemplate,
  interviewScheduledTemplate,
  interviewReminderTemplate,
  followUpReminderTemplate,
};
