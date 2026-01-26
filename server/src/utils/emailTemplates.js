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
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="padding: 40px 20px;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" 
      style="max-width: 520px; width: 100%; background-color: #ffffff; border-radius: 16px; border: 1px solid #e4e4e7; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden;">
      
      <!-- Brand Header -->
      <tr>
        <td style="padding: 32px 32px 0; text-align: center;">
          <div style="display: inline-block; padding: 12px; background-color: #F3E8FF; border-radius: 12px; border: 1px solid #E9D5FF;">
            <div style="font-size: 24px; line-height: 1;">🛡️</div>
          </div>
        </td>
      </tr>

      <!-- Main Content -->
      <tr>
        <td style="padding: 24px 40px;">
          <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: #18181b; text-align: center; letter-spacing: -0.5px;">
            New Login Detected
          </h1>
          <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #52525b; text-align: center;">
            Hi <strong>${name}</strong>,<br>
            We just detected a new login to your <strong>JobZy</strong> account.
          </p>
          
          <!-- Details Box -->
          <div style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom: 12px; font-size: 13px; color: #64748b; font-weight: 500;">Device</td>
                <td style="padding-bottom: 12px; font-size: 13px; color: #0f172a; font-weight: 600; text-align: right;">${device}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 12px; font-size: 13px; color: #64748b; font-weight: 500;">Location</td>
                <td style="padding-bottom: 12px; font-size: 13px; color: #0f172a; font-weight: 600; text-align: right;">${location}</td>
              </tr>
              <tr>
                <td style="font-size: 13px; color: #64748b; font-weight: 500;">Time</td>
                <td style="font-size: 13px; color: #0f172a; font-weight: 600; text-align: right;">${loginTime}</td>
              </tr>
            </table>
          </div>

          <!-- Security Note -->
          <p style="margin: 24px 0 0; font-size: 13px; color: #71717a; text-align: center; line-height: 1.5;">
            If this was you, you can safely ignore this email.<br>
            If not, please <a href="#" style="color: #4f46e5; text-decoration: underline; font-weight: 500;">secure your account</a> immediately.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding: 24px; background-color: #fafafa; border-top: 1px solid #f4f4f5; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #a1a1aa; line-height: 1.5;">
            © ${new Date().getFullYear()} JobZy Inc. • Security Alert<br>
            This login alert was sent to protect your account.
          </p>
        </td>
      </tr>

    </table>
    
    <div style="text-align: center; margin-top: 24px;">
       <p style="font-size: 12px; color: #d4d4d8; font-weight: 500;">
         JOBZY PLATFORM
       </p>
    </div>

  </div>
</body>
</html>
  `;
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
    <body style="font-family: Arial, sans-serif; background:#f4f4f5; padding:5px;">
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
    <body style="font-family: Arial, sans-serif; background:#f4f4f5; padding:5px;">
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
              ${time
      ? `<tr>
                <td style="padding:6px 0; opacity:0.7;">Time</td>
                <td style="padding:6px 0;">${time}</td>
              </tr>`
      : ""
    }
              ${meetingLink
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
    date
  ).toLocaleDateString("en-IN", { dateStyle: "full" })}</strong>
                </td>
              </tr>
              ${time
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

// ✅ NEW: Follow-up Reminder (after interview)
// function followUpReminderTemplate(
//   name,
//   company,
//   position,
//   round,
//   interviewDate
// ) {
//   return `
//   <html>
//     <body style="font-family: Arial, sans-serif; background:#f4f4f5; padding:28px;">
//       <table width="100%" cellspacing="0" cellpadding="0"
//         style="max-width:560px; margin:auto; background:#ffffff; border-radius:12px; border:2px dashed #cfd1d4;">

//         <tr>
//           <td style="padding:18px 24px; font-size:18px; font-weight:600; color:#111; border-bottom:1px solid #f0f0f0;">
//             📩 Follow-up Reminder
//           </td>
//         </tr>

//         <tr>
//           <td style="padding:24px; color:#333; font-size:15px;">
//             Hi ${name},
//             <br><br>
//             It's been a few days since your interview at <strong>${company}</strong>. Consider sending a follow-up email!
//           </td>
//         </tr>

//         <tr>
//           <td style="padding:0 24px 20px;">
//             <table width="100%" style="font-size:14px; color:#444;">
//               <tr>
//                 <td style="padding:6px 0; opacity:0.7;">Company</td>
//                 <td style="padding:6px 0;"><strong>${company}</strong></td>
//               </tr>
//               <tr>
//                 <td style="padding:6px 0; opacity:0.7;">Position</td>
//                 <td style="padding:6px 0;">${position}</td>
//               </tr>
//               <tr>
//                 <td style="padding:6px 0; opacity:0.7;">Interview</td>
//                 <td style="padding:6px 0;">${round} on ${new Date(
//     interviewDate
//   ).toLocaleDateString("en-IN")}</td>
//               </tr>
//             </table>
//           </td>
//         </tr>

//         <tr>
//           <td style="padding:10px 24px 20px;">
//             <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; padding:16px;">
//               <div style="font-size:14px; font-weight:600; margin-bottom:8px; color:#075985;">
//                 💌 Sample Follow-up
//               </div>
//               <div style="font-size:13px; color:#0c4a6e; line-height:1.6; font-style:italic;">
//                 "Thank you for the opportunity to interview for the ${position} role. I remain very interested in this position and would appreciate any updates on the hiring process."
//               </div>
//             </div>
//           </td>
//         </tr>

//         <tr>
//           <td style="background:#fbfbfb; padding:14px 24px; font-size:11px; color:#999; border-radius:0 0 12px 12px; text-align:center; border-top:1px solid #efefef;">
//             © ${new Date().getFullYear()} JobZy.
//           </td>
//         </tr>
//       </table>
//     </body>
//   </html>`;
// }

function followUpReminderTemplate(
  name,
  company,
  position,
  round,
  interviewDate
) {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; background:#f4f4f5; padding:5px;">
      <table width="100%" cellspacing="0" cellpadding="0"
        style="max-width:560px; margin:auto; background:#ffffff; border-radius:12px; border:2px dashed #cfd1d4;">
        
        <!-- Header -->
        <tr>
          <td style="padding:18px 24px; font-size:18px; font-weight:600; color:#111; border-bottom:1px solid #f0f0f0; background:#e0f2fe;">
            📩 Follow-up Reminder
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:24px 24px 8px; color:#333; font-size:15px; line-height:1.6;">
            Hi <strong>${name}</strong>,
            <br><br>
            Hope you're doing well! It's been a few days since your interview with <strong>${company}</strong>, and we wanted to remind you that following up is a great way to show continued interest.
            <br><br>
            A polite follow-up email can help keep you top-of-mind with the hiring team and demonstrate your enthusiasm for the role.
          </td>
        </tr>

        <!-- Interview Details -->
        <tr>
          <td style="padding:14px 24px 20px;">
            <table width="100%" style="font-size:14px; color:#444; border-collapse:collapse; background:#fafafa; border-radius:8px; overflow:hidden;">
              <tr>
                <td colspan="2" style="padding:12px; background:#fef3c7; font-weight:600; color:#92400e; font-size:13px; text-transform:uppercase; letter-spacing:0.5px;">
                  📋 Interview Summary
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
                  <span style="background:#fef3c7; color:#92400e; padding:4px 10px; border-radius:6px; font-weight:600; font-size:13px;">${round}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:12px; opacity:0.7; font-weight:500;">Interview Date</td>
                <td style="padding:12px;">
                  <strong style="color:#0f172a;">${new Date(
    interviewDate
  ).toLocaleDateString("en-IN", { dateStyle: "full" })}</strong>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Sample Email Template -->
        <tr>
          <td style="padding:0 24px 20px;">
            <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; padding:16px;">
              <div style="font-size:14px; font-weight:600; margin-bottom:10px; color:#075985;">
                💌 Sample Follow-up Email
              </div>
              <div style="font-size:13px; color:#0c4a6e; line-height:1.7; font-style:italic; background:#ffffff; padding:12px; border-radius:6px; border-left:3px solid #0ea5e9;">
                Subject: Following up on ${position} Interview
                <br><br>
                Dear Hiring Team,
                <br><br>
                Thank you for the opportunity to interview for the <strong>${position}</strong> position at <strong>${company}</strong>. I truly enjoyed our conversation and learning more about the team and role.
                <br><br>
                I remain very interested in this opportunity and would appreciate any updates on the hiring process. Please feel free to reach out if you need any additional information from my end.
                <br><br>
                Looking forward to hearing from you.
                <br><br>
                Best regards,<br>
                ${name}
              </div>
            </div>
          </td>
        </tr>

        <!-- Follow-up Tips -->
        <tr>
          <td style="padding:0 24px 20px;">
            <div style="background:#fef3c7; border:1px solid #fde047; border-radius:8px; padding:16px;">
              <div style="font-size:14px; font-weight:600; margin-bottom:10px; color:#92400e;">
                💡 Follow-up Best Practices
              </div>
              <ul style="margin:8px 0 0 0; padding-left:20px; font-size:13px; color:#854d0e; line-height:1.8;">
                <li>Send the email <strong>3-5 business days</strong> after your interview</li>
                <li>Keep it <strong>brief and professional</strong> (under 150 words)</li>
                <li>Express genuine interest without sounding desperate</li>
                <li>Mention something specific from your conversation</li>
                <li>If no response after 1 week, you can send one more polite follow-up</li>
              </ul>
            </div>
          </td>
        </tr>

        <!-- Encouragement -->
        <tr>
          <td style="padding:0 24px 24px; font-size:14px; color:#374151; line-height:1.6;">
            Remember, following up shows professionalism and genuine interest. Even if you don't get this role, staying on good terms can lead to future opportunities!
            <br><br>
            <strong style="color:#111;">Wishing you the best! 🍀</strong>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#fbfbfb; padding:16px 24px; font-size:11px; color:#999; border-radius:0 0 12px 12px; text-align:center; border-top:1px solid #efefef; line-height:1.5;">
            This is an automated reminder from JobZy to help you follow up at the right time.<br>
            Stay proactive and keep building connections!
            <br><br>
            © ${new Date().getFullYear()} JobZy. All rights reserved.
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
