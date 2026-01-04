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

module.exports = {
  loginAlertTemplate,
  welcomeTemplate,
};
