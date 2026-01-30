// Login Alert Email
function loginAlertTemplate(name, device, location, loginTime) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    .body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; background-color: #f4f4f5; padding: 40px 20px; }
    .container { max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e4e4e7; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { padding: 32px 32px 0; text-align: center; }
    .content { padding: 32px; }
    .details { background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 20px; margin: 24px 0; }
    .detail-item { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
    .detail-item:last-child { margin-bottom: 0; }
    .label { color: #64748b; font-weight: 500; }
    .value { color: #0f172a; font-weight: 600; text-align: right; }
    .footer { padding: 24px; text-align: center; border-top: 1px solid #f4f4f5; background-color: #fafafa; border-radius: 0 0 12px 12px; }
    .text-sm { font-size: 12px; color: #71717a; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif;">
  <div style="padding: 40px 20px;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" 
      style="max-width: 600px; width: 100%; background-color: #ffffff;">
 
      <!-- Brand Header with Logo -->
      <tr>
        <td style="padding: 40px 20px 20px; text-align: center;">
          <img src="https://jobzy-logos.s3.ap-south-1.amazonaws.com/logo.jpg" alt="JobZy Logo" style="width: 60px; height: 60px; display: inline-block;" />
        </td>
      </tr>

      <!-- Main Content -->
      <tr>
        <td style="padding: 0 20px;">
          <h1 style="margin: 0 0 20px; font-size: 26px; font-weight: 700; color: #4a4a4a; text-align: center; letter-spacing: -0.5px;">
            New Login Detected
          </h1>
          <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a; text-align: center;">
            Hi <strong>${name}</strong>,<br>
            We just detected a new login to your <strong>JobZy</strong> account.
          </p>
          
          <!-- Details Box -->
          <div style="background-color: #ffffff; border-radius: 8px; border: 1px solid #e0e0e0; padding: 20px; margin: 0 0 30px;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom: 14px; font-size: 15px; color: #666666; font-weight: 500;">Device</td>
                <td style="padding-bottom: 14px; font-size: 15px; color: #4a4a4a; font-weight: 600; text-align: right;">${device}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 14px; font-size: 15px; color: #666666; font-weight: 500;">Location</td>
                <td style="padding-bottom: 14px; font-size: 15px; color: #4a4a4a; font-weight: 600; text-align: right;">${location}</td>
              </tr>
              <tr>
                <td style="font-size: 15px; color: #666666; font-weight: 500;">Time</td>
                <td style="font-size: 15px; color: #4a4a4a; font-weight: 600; text-align: right;">${loginTime}</td>
              </tr>
            </table>
          </div>

          <!-- Security Note -->
          <p style="margin: 0 0 40px; font-size: 15px; color: #666666; text-align: center; line-height: 1.6;">
            If this was you, you can safely ignore this email.<br>
            If not, please <a href="#" style="color: #0066cc; text-decoration: none; font-weight: 500;">secure your account</a> immediately.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0; font-size: 13px; color: #999999; line-height: 1.6;">
            © ${new Date().getFullYear()} JobZy Inc. • Security Alert<br>
            This login alert was sent to protect your account.
          </p>
        </td>
      </tr>

    </table>

  </div>
</body>
</html>
  `;
}

// Welcome Email
function welcomeTemplate(name) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    .body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif;">
  <div style="padding: 40px 20px;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" 
      style="max-width: 600px; width: 100%; background-color: #ffffff;">
      
      <!-- Brand Header with Logo -->
      <tr>
        <td style="padding: 40px 20px 20px; text-align: center;">
          <img src="https://jobzy-logos.s3.ap-south-1.amazonaws.com/logo.jpg" alt="JobZy Logo" style="width: 60px; height: 60px; display: inline-block;" />
        </td>
      </tr>

      <!-- Main Title -->
      <tr>
        <td style="padding: 0 20px;">
          <h1 style="margin: 0 0 20px; font-size: 26px; font-weight: 700; color: #4a4a4a; text-align: center; letter-spacing: -0.5px;">
            Welcome to JobZy 🎉
          </h1>
          <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a; text-align: center;">
            Hi <strong>${name}</strong>,<br><br>
            Welcome to <strong>JobZy</strong>! Your account has been successfully created 🎉<br>
            JobZy helps you organize, track, and improve your job search journey — all in one place.
          </p>
        </td>
      </tr>

      <!-- Features Section -->
      <tr>
        <td style="padding: 0 20px 30px;">
          <div style="background-color: #ffffff; border-radius: 8px; border: 1px solid #e0e0e0; padding: 20px;">
            <div style="font-weight: 600; margin-bottom: 14px; color: #4a4a4a; font-size: 16px;">
              What you can do with JobZy
            </div>
            <ul style="margin: 0; padding-left: 20px; line-height: 1.8; color: #666666; font-size: 15px;">
              <li style="margin-bottom: 8px;">Add and manage all your job applications in one dashboard</li>
              <li style="margin-bottom: 8px;">Track interview rounds, dates, and follow-ups</li>
              <li style="margin-bottom: 8px;">Get email reminders before interviews so you never miss one</li>
              <li style="margin-bottom: 8px;">Monitor your application success rate and insights</li>
              <li style="margin-bottom: 0;">Keep notes for each job and interview</li>
            </ul>
          </div>
        </td>
      </tr>

      <!-- Getting Started -->
      <tr>
        <td style="padding: 0 20px 40px;">
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 18px; border-left: 4px solid #5b21b6;">
            <p style="margin: 0; font-size: 15px; color: #4a4a4a; line-height: 1.6;">
              <strong style="color: #5b21b6;">Getting started:</strong><br>
              Start by adding your first job application. Once an interview is scheduled, JobZy will automatically remind you before the interview date.
            </p>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0; font-size: 13px; color: #999999; line-height: 1.6;">
            You are receiving this email because you signed up on JobZy.<br>
            © ${new Date().getFullYear()} JobZy. All rights reserved.
          </p>
        </td>
      </tr>

    </table>

  </div>
</body>
</html>
  `;
}

// New Job Created
function jobCreatedTemplate(
  name,
  company,
  position,
  location,
  workMode,
  appliedDate,
) {
  return `
  <!DOCTYPE html>
<html>
<head>
  <style>
    .body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif;">
  <div style="padding: 40px 20px;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" 
      style="max-width: 600px; width: 100%; background-color: #ffffff;">
      
      <!-- Brand Header with Logo -->
      <tr>
        <td style="padding: 40px 20px 20px; text-align: center;">
          <img src="https://jobzy-logos.s3.ap-south-1.amazonaws.com/logo.jpg" alt="JobZy Logo" style="width: 60px; height: 60px; display: inline-block;" />
        </td>
      </tr>

      <!-- Main Title -->
      <tr>
        <td style="padding: 0 20px;">
          <h1 style="margin: 0 0 20px; font-size: 26px; font-weight: 700; color: #4a4a4a; text-align: center; letter-spacing: -0.5px;">
            New Job Added
          </h1>
          <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a; text-align: center;">
            Hi <strong>${name}</strong>,<br><br>
            Your job application has been successfully added to JobZy!
          </p>
        </td>
      </tr>

      <!-- Job Details Box -->
      <tr>
        <td style="padding: 0 20px 30px;">
          <div style="background-color: #ffffff; border-radius: 8px; border: 1px solid #e0e0e0; padding: 20px;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom: 14px; font-size: 15px; color: #666666; font-weight: 500; width: 130px;">Company</td>
                <td style="padding-bottom: 14px; font-size: 15px; color: #4a4a4a; font-weight: 600;">${company}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 14px; font-size: 15px; color: #666666; font-weight: 500;">Position</td>
                <td style="padding-bottom: 14px; font-size: 15px; color: #4a4a4a; font-weight: 600;">${position}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 14px; font-size: 15px; color: #666666; font-weight: 500;">Location</td>
                <td style="padding-bottom: 14px; font-size: 15px; color: #4a4a4a; font-weight: 600;">${location}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 14px; font-size: 15px; color: #666666; font-weight: 500;">Work Mode</td>
                <td style="padding-bottom: 14px; font-size: 15px; color: #4a4a4a; font-weight: 600; text-transform: capitalize;">${workMode}</td>
              </tr>
              <tr>
                <td style="font-size: 15px; color: #666666; font-weight: 500;">Applied On</td>
                <td style="font-size: 15px; color: #4a4a4a; font-weight: 600;">${new Date(appliedDate).toLocaleDateString("en-IN")}</td>
              </tr>
            </table>
          </div>
        </td>
      </tr>

      <!-- Reminder Message -->
      <tr>
        <td style="padding: 0 20px 40px;">
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 18px; border: 1px solid #e0e0e0;">
            <p style="margin: 0; font-size: 15px; color: #4a4a4a; line-height: 1.6;">
              🎯 Keep tracking your progress on JobZy. We'll remind you before interviews!
            </p>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0; font-size: 13px; color: #999999; line-height: 1.6;">
            © ${new Date().getFullYear()} JobZy. Happy Job Hunting!
          </p>
        </td>
      </tr>

    </table>

  </div>
</body>
</html>`;
}

// Job Status Updated
function jobUpdatedTemplate(name, company, position, oldStatus, newStatus) {
  const statusIcons = {
    applied: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#3b82f6" opacity="0.2"/>
      <path d="M9 11L12 14L16 9" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 17H16" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    screening: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#f59e0b" opacity="0.2"/>
      <circle cx="10" cy="10" r="3" stroke="#f59e0b" stroke-width="2"/>
      <path d="M17 17L14 14" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    "interview-scheduled": `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#8b5cf6" opacity="0.2"/>
      <rect x="7" y="8" width="10" height="9" rx="1" stroke="#8b5cf6" stroke-width="2"/>
      <path d="M7 10H17" stroke="#8b5cf6" stroke-width="2"/>
      <path d="M9 6V8" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round"/>
      <path d="M15 6V8" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    interviewed: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#10b981" opacity="0.2"/>
      <path d="M8 12L11 15L16 9" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    offered: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#ec4899" opacity="0.2"/>
      <path d="M12 7L14 11H18L15 14L16 18L12 15L8 18L9 14L6 11H10L12 7Z" fill="#ec4899"/>
    </svg>`,
    rejected: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#ef4444" opacity="0.2"/>
      <path d="M9 9L15 15M15 9L9 15" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    accepted: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#059669" opacity="0.2"/>
      <path d="M7 12L10 15L17 8" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="12" r="10" stroke="#059669" stroke-width="2"/>
    </svg>`,
    withdrawn: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#64748b" opacity="0.2"/>
      <path d="M16 12H8M8 12L11 9M8 12L11 15" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    .body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif;">
  <div style="padding: 40px 20px;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" 
      style="max-width: 600px; width: 100%; background-color: #ffffff;">
      
      <!-- Brand Header with Logo -->
      <tr>
        <td style="padding: 40px 20px 20px; text-align: center;">
          <img src="https://jobzy-logos.s3.ap-south-1.amazonaws.com/logo.jpg" alt="JobZy Logo" style="width: 60px; height: 60px; display: inline-block;" />
        </td>
      </tr>

      <!-- Main Title -->
      <tr>
        <td style="padding: 0 20px;">
          <div style="text-align: center; margin-bottom: 10px;">
            ${statusIcons[newStatus] || statusIcons.applied}
          </div>
          <h1 style="margin: 0 0 20px; font-size: 26px; font-weight: 700; color: #4a4a4a; text-align: center; letter-spacing: -0.5px;">
            Job Status Updated
          </h1>
          <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a; text-align: center;">
            Hi <strong>${name}</strong>,<br><br>
            Your application status has been updated!
          </p>
        </td>
      </tr>

      <!-- Job Details Box -->
      <tr>
        <td style="padding: 0 20px 30px;">
          <div style="background-color: #ffffff; border-radius: 8px; border: 1px solid #e0e0e0; padding: 20px;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom: 14px; font-size: 15px; color: #666666; font-weight: 500; width: 130px;">Company</td>
                <td style="padding-bottom: 14px; font-size: 15px; color: #4a4a4a; font-weight: 600;">${company}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 14px; font-size: 15px; color: #666666; font-weight: 500;">Position</td>
                <td style="padding-bottom: 14px; font-size: 15px; color: #4a4a4a; font-weight: 600;">${position}</td>
              </tr>
              <tr>
                <td style="font-size: 15px; color: #666666; font-weight: 500;">Status</td>
                <td style="font-size: 15px; color: #4a4a4a; font-weight: 600;">
                  <span style="text-decoration: line-through; color: #999999; font-weight: 400;">${oldStatus}</span>
                  <span style="color: #4a4a4a; margin: 0 6px;">→</span>
                  <span style="color: #16a34a; font-weight: 700;">${newStatus}</span>
                </td>
              </tr>
            </table>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0; font-size: 13px; color: #999999; line-height: 1.6;">
            © ${new Date().getFullYear()} JobZy. Keep tracking your progress!
          </p>
        </td>
      </tr>

    </table>

  </div>
</body>
</html>
  `;
}

// Interview Scheduled
function interviewScheduledTemplate(
  name,
  company,
  position,
  round,
  date,
  time,
  meetingLink,
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
                  date,
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

// Interview Reminder (1 day before)
function interviewReminderTemplate(name, company, position, round, date, time) {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; background:#f4f4f5; padding:5px;">
      <table width="100%" cellspacing="0" cellpadding="0"
        style="max-width:560px; margin:auto; background:#ffffff; border-radius:12px; border:2px dashed #cfd1d4;">
        
        <!-- Header -->
        <tr>
          <td style="padding:18px 24px; font-size:18px; font-weight:600; color:#111; border-bottom:1px solid #f0f0f0; background:#fef3c7;">
            ⏰ Interview Reminder
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:24px 24px 8px; color:#333; font-size:15px; line-height:1.6;">
            Hi <strong>${name}</strong>,
            <br><br>
            Hope you're doing well! This is a friendly reminder that your interview with <strong>${company}</strong> is scheduled for <span style="background:#fef3c7; padding:2px 6px; border-radius:4px; font-weight:600;">tomorrow</span>.
            <br><br>
            We wanted to make sure you have all the details handy so you can prepare accordingly.
          </td>
        </tr>

        <!-- Interview Details -->
        <tr>
          <td style="padding:14px 24px 20px;">
            <table width="100%" style="font-size:14px; color:#444; border-collapse:collapse; background:#fafafa; border-radius:8px; overflow:hidden;">
              <tr>
                <td colspan="2" style="padding:12px; background:#f0f4ff; font-weight:600; color:#1e40af; font-size:13px; text-transform:uppercase; letter-spacing:0.5px;">
                  📋 Interview Details
                </td>
              </tr>
              <tr style="border-bottom:1px solid #efefef;">
                <td style="padding:12px; width:120px; opacity:0.7; font-weight:500;">Company</td>
                <td style="padding:12px;"><strong style="color:#111;">${company}</strong></td>
              </tr>
              <tr style="border-bottom:1px solid #efefef;">
                <td style="padding:12px; opacity:0.7; font-weight:500;">Position</td>
                <td style="padding:12px; color:#374151;">${position}</td>
              </tr>
              <tr style="border-bottom:1px solid #efefef;">
                <td style="padding:12px; opacity:0.7; font-weight:500;">Round</td>
                <td style="padding:12px;">
                  <span style="background:#e0e7ff; color:#3730a3; padding:4px 10px; border-radius:6px; font-weight:600; font-size:13px;">${round}</span>
                </td>
              </tr>
              <tr style="border-bottom:1px solid #efefef;">
                <td style="padding:12px; opacity:0.7; font-weight:500;">Date</td>
                <td style="padding:12px;">
                  <strong style="color:#dc2626;">${new Date(
                    date,
                  ).toLocaleDateString("en-IN", { dateStyle: "full" })}</strong>
                </td>
              </tr>
              ${
                time
                  ? `
              <tr>
                <td style="padding:12px; opacity:0.7; font-weight:500;">Time</td>
                <td style="padding:12px;">
                  <strong style="color:#0f172a; font-size:15px;">${time}</strong>
                </td>
              </tr>
              `
                  : ""
              }
            </table>
          </td>
        </tr>

        <!-- Preparation Tips -->
        <tr>
          <td style="padding:0 24px 20px;">
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:16px;">
              <div style="font-size:14px; font-weight:600; margin-bottom:10px; color:#166534;">
                ✅ Quick Preparation Checklist
              </div>
              <ul style="margin:8px 0 0 0; padding-left:20px; font-size:13px; color:#15803d; line-height:1.8;">
                <li>Test your internet connection and audio/video setup beforehand</li>
                <li>Review your resume and the job description thoroughly</li>
                <li>Research ${company} and prepare relevant questions</li>
                <li>Join the meeting 5 minutes early to avoid technical issues</li>
                <li>Keep a notepad handy for taking notes</li>
              </ul>
            </div>
          </td>
        </tr>

        <!-- Good Luck Message -->
        <tr>
          <td style="padding:0 24px 24px; font-size:14px; color:#374151; line-height:1.6;">
            We believe in you! Give it your best shot and remember — you've already impressed them enough to get this interview. 💪
            <br><br>
            <strong style="color:#111;">Best of luck!</strong>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#fbfbfb; padding:16px 24px; font-size:11px; color:#999; border-radius:0 0 12px 12px; text-align:center; border-top:1px solid #efefef; line-height:1.5;">
            This is an automated reminder from JobZy to help you stay organized.<br>
            Keep tracking your applications and never miss an opportunity!
            <br><br>
            © ${new Date().getFullYear()} JobZy. All rights reserved.
          </td>
        </tr>

      </table>
    </body>
  </html>`;
}

// Follow-up Reminder (for applications with no response)
function followUpReminderTemplate(
  name,
  company,
  position,
  status,
  appliedDate,
) {
  // Calculate days since application
  const daysSinceApplied = Math.floor(
    (new Date() - new Date(appliedDate)) / (1000 * 60 * 60 * 24),
  );

  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f4f4f5;">
  
  <table width="100%" cellspacing="0" cellpadding="0" style="padding: 20px 0;">
    <tr>
      <td align="center">
        
        <!-- Main Container -->
        <table width="600" cellspacing="0" cellpadding="0" 
          style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 2px dashed #d1d5db;">
          
          <!-- Header -->
         <tr>
          <td style="padding:18px 24px; font-size:18px; font-weight:600; color:#111; border-bottom:1px solid #f0f0f0; background:#e0f2fe;">
            📩 Follow-up Reminder
          </td>
        </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 32px 24px 20px;">
              <p style="margin: 0 0 16px; color: #374151; font-size: 15px; line-height: 1.6;">
                Hi <strong style="color: #111827;">${name}</strong>,
              </p>
              <p style="margin: 0 0 16px; color: #4b5563; font-size: 15px; line-height: 1.7;">
                You applied to <strong style="color: #111827;">${company}</strong> for the <strong>${position}</strong> position ${daysSinceApplied} days ago. 
                If you haven't heard back yet, now is a great time to send a polite follow-up! 🎯
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                A well-timed follow-up shows initiative and keeps your application top-of-mind with recruiters.
              </p>
            </td>
          </tr>

          <!-- Application Details Card (New Design) -->
          <tr>
            <td style="padding: 0 24px 24px;">
              <div style="background: #fef3c7; border-radius: 8px; padding: 20px; border: 2px dashed #d1d5db;">
                <div style="font-size: 15px; font-weight: 600; color: #92400e; margin-bottom: 12px;">
                  📋 Application Details
                </div>
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top; width: 24px;">
                      <span style="font-size: 16px;">🏢</span>
                    </td>
                    <td style="padding: 8px 0 8px 8px; font-size: 13px; color: #78350f; line-height: 1.6;">
                      <strong>Company:</strong> ${company}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top;">
                      <span style="font-size: 16px;">💼</span>
                    </td>
                    <td style="padding: 8px 0 8px 8px; font-size: 13px; color: #78350f; line-height: 1.6;">
                      <strong>Position:</strong> ${position}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top;">
                      <span style="font-size: 16px;">📊</span>
                    </td>
                    <td style="padding: 8px 0 8px 8px; font-size: 13px; color: #78350f; line-height: 1.6;">
                      <strong>Status:</strong> <span style="background: #ffffff; color: #92400e; padding: 3px 10px; border-radius: 12px; font-weight: 600; font-size: 12px; text-transform: capitalize;">${status}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top;">
                      <span style="font-size: 16px;">📅</span>
                    </td>
                    <td style="padding: 8px 0 8px 8px; font-size: 13px; color: #78350f; line-height: 1.6;">
                      <strong>Applied On:</strong> ${new Date(
                        appliedDate,
                      ).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top;">
                      <span style="font-size: 16px;">⏳</span>
                    </td>
                    <td style="padding: 8px 0 8px 8px; font-size: 13px; color: #78350f; line-height: 1.6;">
                      <strong>Days Since:</strong> <span style="background: #ffffff; color: #92400e; padding: 3px 10px; border-radius: 12px; font-weight: 700; font-size: 12px;">${daysSinceApplied} days</span>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Follow-up Best Practices -->
          <tr>
            <td style="padding: 0 24px 24px;">
              <div style="background: #fef3c7; border-radius: 8px; padding: 20px; border: 2px dashed #d1d5db;">
                <div style="font-size: 15px; font-weight: 600; color: #92400e; margin-bottom: 12px;">
                  ✨ Application Follow-up Best Practices
                </div>
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top; width: 24px;">
                      <span style="font-size: 16px;">⏰</span>
                    </td>
                    <td style="padding: 8px 0 8px 8px; font-size: 13px; color: #78350f; line-height: 1.6;">
                      Wait <strong>1-2 weeks</strong> after applying before following up
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top;">
                      <span style="font-size: 16px;">📝</span>
                    </td>
                    <td style="padding: 8px 0 8px 8px; font-size: 13px; color: #78350f; line-height: 1.6;">
                      Keep your message <strong>concise</strong> (under 100 words)
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top;">
                      <span style="font-size: 16px;">🎯</span>
                    </td>
                    <td style="padding: 8px 0 8px 8px; font-size: 13px; color: #78350f; line-height: 1.6;">
                      Express <strong>genuine interest</strong> in the role and company
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top;">
                      <span style="font-size: 16px;">📧</span>
                    </td>
                    <td style="padding: 8px 0 8px 8px; font-size: 13px; color: #78350f; line-height: 1.6;">
                      Email the <strong>recruiter or hiring manager</strong> directly if possible
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top;">
                      <span style="font-size: 16px;">✅</span>
                    </td>
                    <td style="padding: 8px 0 8px 8px; font-size: 13px; color: #78350f; line-height: 1.6;">
                      Offer to provide <strong>additional information</strong> if needed
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top;">
                      <span style="font-size: 16px;">🔄</span>
                    </td>
                    <td style="padding: 8px 0 8px 8px; font-size: 13px; color: #78350f; line-height: 1.6;">
                      If no response after 1 week, send <strong>one final</strong> polite follow-up
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Encouragement -->
          <tr>
            <td style="padding: 0 24px 32px; text-align: center;">
              <p style="margin: 0 0 12px; font-size: 15px; color: #4b5563; line-height: 1.7;">
                Following up shows you're proactive and genuinely interested.<br>
                <strong style="color: #111827;">Don't be afraid to reach out – it can make all the difference!</strong>
              </p>
              <p style="margin: 0; font-size: 16px;">
                <strong style="color: #16a34a;">Good luck! 🍀</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                This is an automated reminder from <strong style="color: #6b7280;">JobZy</strong> to help you stay on top of your applications.
              </p>
              <p style="margin: 0; font-size: 11px; color: #d1d5db;">
                © ${new Date().getFullYear()} JobZy. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

// Payment Success Email Templates Export
function paymentConfirmationTemplate(
  name,
  planName,
  amount,
  transactionId,
  paymentDate,
  validFrom,
  validUntil,
) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f4f4f5;">
  
  <table width="100%" cellspacing="0" cellpadding="0" style="padding: 20px 0;">
    <tr>
      <td align="center">
        
        <!-- Main Container -->
        <table width="600" cellspacing="0" cellpadding="0" 
          style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 2px dashed #d1d5db;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 18px 24px; text-align: center; border-bottom: 1px solid #f0f0f0; background: #e0f2fe;">
              <div style="font-size: 18px; font-weight: 600; color: #111;">
               Payment Successful!
              </div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 32px 24px 20px; color: #333; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px; color: #374151; font-size: 15px; line-height: 1.6;">
                Hi <strong style="color: #111827;">${name}</strong>,
              </p>
              <p style="margin: 0 0 16px; color: #4b5563; font-size: 15px; line-height: 1.7;">
                Thank you for upgrading to <strong style="color: #111827;">${planName}</strong>! 🎉 Your payment has been successfully processed and your account has been activated.
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                You can now access all premium features to help you manage your job applications more effectively.
              </p>
            </td>
          </tr>

          <!-- Transaction Info Card -->
          <tr>
            <td style="padding: 14px 24px 20px;">
              <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; border: 2px dashed #d1d5db;">
                <div style="font-size: 15px; font-weight: 600; color: #166534; margin-bottom: 12px;">
                  💰 Transaction Info
                </div>
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top; width: 24px;">
                      <span style="font-size: 16px;">💳</span>
                    </td>
                    <td style="padding: 8px 0 8px 8px; font-size: 13px; color: #166534; line-height: 1.6;">
                      <strong>Amount Paid:</strong> ₹${amount}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top;">
                      <span style="font-size: 16px;">🔖</span>
                    </td>
                    <td style="padding: 8px 0 8px 8px; font-size: 13px; color: #166534; line-height: 1.6;">
                      <strong>Transaction ID:</strong> <code style="background: #ffffff; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-family: monospace;">${transactionId}</code>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top;">
                      <span style="font-size: 16px;">📅</span>
                    </td>
                    <td style="padding: 8px 0 8px 8px; font-size: 13px; color: #166534; line-height: 1.6;">
                      <strong>Payment Date:</strong> ${new Date(
                        paymentDate,
                      ).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top;">
                      <span style="font-size: 16px;">⏰</span>
                    </td>
                    <td style="padding: 8px 0 8px 8px; font-size: 13px; color: #166534; line-height: 1.6;">
                      <strong>Valid From:</strong> ${new Date(
                        validFrom,
                      ).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top;">
                      <span style="font-size: 16px;">⏰</span>
                    </td>
                     <td style="padding: 8px 0 8px 8px; font-size: 13px; color: #166534; line-height: 1.6;">
                      <strong>Valid Until:</strong> ${new Date(
                        validUntil,
                      ).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- CTA Button -->
<tr>
  <td style="padding: 0 24px 32px; text-align: center;">
    <a href="https://jobzy.site/dashboard" 
      style="display: inline-block; background: #f8f9fa; 
      color: #1f2937; text-decoration: none; padding: 10px 24px; border-radius: 8px; 
      font-weight: 600; font-size: 13px; border: 2px solid #d1d5db;">
      Check out plan details
    </a>
  </td>
</tr>

          <!-- Support Note -->
          <tr>
            <td style="padding: 0 24px 24px; font-size: 13px; color: #6b7280; line-height: 1.6; text-align: center;">
              If you have any questions, feel free to contact us at <a href="mailto:support@jobzy.site" style="color: #667eea; text-decoration: none;">support@jobzy.site</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #fbfbfb; padding: 16px 24px; font-size: 11px; color: #999; border-radius: 0 0 12px 12px; text-align: center; border-top: 1px solid #efefef; line-height: 1.5;">
              This is an automated confirmation email from JobZy. Please do not reply to this email.<br>
              <br>
              © ${new Date().getFullYear()} JobZy. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

module.exports = {
  loginAlertTemplate,
  welcomeTemplate,
  jobCreatedTemplate,
  jobUpdatedTemplate,
  interviewScheduledTemplate,
  interviewReminderTemplate,
  followUpReminderTemplate,
  paymentConfirmationTemplate,
};
