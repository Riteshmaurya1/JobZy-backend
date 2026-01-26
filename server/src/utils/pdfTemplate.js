const generatePDFTemplate = (doc, jobs) => {
  // PDF Header
  doc
    .fontSize(26)
    .font("Helvetica-Bold")
    .fillColor("#667eea")
    .text("JobZy", { align: "center" })
    .fontSize(18)
    .fillColor("#000000")
    .text("Job Applications Report", { align: "center" })
    .moveDown(0.3);

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#666666")
    .text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, {
      align: "center",
    })
    .text(`Total Applications: ${jobs.length}`, { align: "center" })
    .moveDown(1.5);

  // Colored bar - FIX: use lineWidth() instead of strokeWidth()
  doc
    .moveTo(40, doc.y)
    .lineTo(570, doc.y)
    .lineWidth(3)
    .strokeColor("#667eea")
    .stroke();
  doc.moveDown(1);

  // Summary Statistics
  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === "applied").length,
    screening: jobs.filter((j) => j.status === "screening").length,
    "interview-scheduled": jobs.filter(
      (j) => j.status === "interview-scheduled"
    ).length,
    interviewed: jobs.filter((j) => j.status === "interviewed").length,
    offered: jobs.filter((j) => j.status === "offered").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
    accepted: jobs.filter((j) => j.status === "accepted").length,
  };

  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .fillColor("#667eea")
    .text("SUMMARY STATISTICS", { underline: true })
    .moveDown(0.5);

  doc.fontSize(10).font("Helvetica").fillColor("#000000");
  doc.text(`Total Applications: ${stats.total}`);
  doc.text(`Applied: ${stats.applied}`);
  doc.text(`Screening: ${stats.screening}`);
  doc.text(`Interview Scheduled: ${stats["interview-scheduled"]}`);
  doc.text(`Interviewed: ${stats.interviewed}`);
  doc.text(`Offered: ${stats.offered}`);
  doc.text(`Rejected: ${stats.rejected}`);
  doc.text(`Accepted: ${stats.accepted}`);

  doc.moveDown(1.5);

  // Horizontal Line - FIX: use lineWidth() instead of strokeWidth()
  doc
    .moveTo(40, doc.y)
    .lineTo(570, doc.y)
    .lineWidth(1)
    .strokeColor("#cccccc")
    .stroke();
  doc.moveDown(1);

  // Jobs Details
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .fillColor("#667eea")
    .text("APPLICATIONS DETAILS", { underline: true })
    .moveDown(0.8);

  jobs.forEach((job, index) => {
    // Check page space
    if (doc.y > 680) {
      doc.addPage();
      doc.moveDown(0.5);
    }

    // Safe data extraction
    const company = job.company || "N/A";
    const position = job.position || "N/A";
    const status = (job.status || "applied").toUpperCase();
    const appliedDate = job.appliedDate || new Date();
    const jobLink = job.jobLink || "";
    const location = job.location || "";
    const workMode = job.workMode || "";
    const jobType = job.jobType || "";
    const salary = job.salary || "";
    const platform = job.platform || "";
    const notes = job.notes || "";
    const resumeVersion = job.resumeVersion || "";
    const followUpDate = job.followUpDate || "";

    // Job Title & Company
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("#667eea")
      .text(`${index + 1}. ${company}`)
      .fontSize(11)
      .fillColor("#333333")
      .text(`Position: ${position}`);

    // Job Details
    doc.fontSize(10).font("Helvetica").fillColor("#000000");
    doc.text(`Status: ${status}`, { indent: 10 });
    doc.text(
      `Applied Date: ${new Date(appliedDate).toLocaleDateString("en-IN")}`,
      { indent: 10 }
    );

    if (location) {
      doc.text(`Location: ${location}`, { indent: 10 });
    }

    if (workMode) {
      doc.text(`Work Mode: ${workMode}`, { indent: 10 });
    }

    if (jobType) {
      doc.text(`Job Type: ${jobType}`, { indent: 10 });
    }

    if (salary) {
      doc.text(`Salary: ${salary}`, { indent: 10 });
    }

    if (platform) {
      doc.text(`Platform: ${platform}`, { indent: 10 });
    }

    if (jobLink) {
      doc.text(`Job Link: ${jobLink}`, { indent: 10 });
    }

    if (resumeVersion) {
      doc.text(`Resume Used: ${resumeVersion}`, { indent: 10 });
    }

    if (followUpDate) {
      doc.text(
        `Follow Up: ${new Date(followUpDate).toLocaleDateString("en-IN")}`,
        { indent: 10 }
      );
    }

    // Interviews
    if (
      job.interviews &&
      Array.isArray(job.interviews) &&
      job.interviews.length > 0
    ) {
      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .fillColor("#667eea")
        .text("Interviews:", { indent: 10 });

      job.interviews.forEach((interview, intIndex) => {
        const roundType = interview.roundType || "Interview";
        const scheduledDate = interview.scheduledDate || new Date();
        const time = interview.time || "TBD";

        doc
          .fontSize(9)
          .font("Helvetica")
          .fillColor("#000000")
          .text(
            `${intIndex + 1}. ${roundType} - ${new Date(
              scheduledDate
            ).toLocaleDateString("en-IN")} at ${time}`,
            { indent: 25 }
          );
      });
    }

    if (notes) {
      doc
        .fontSize(9)
        .font("Helvetica-Oblique")
        .fillColor("#666666")
        .text(`Notes: ${notes}`, { indent: 10 });
    }

    // Spacing between jobs - FIX: use lineWidth() instead of strokeWidth()
    doc.moveDown(0.5);
    doc
      .moveTo(50, doc.y)
      .lineTo(560, doc.y)
      .lineWidth(0.5)
      .strokeColor("#eeeeee")
      .stroke();
    doc.moveDown(0.5);
  });

  // Footer with page numbers
  const pages = doc.bufferedPageRange().count;
  for (let i = 0; i < pages; i++) {
    doc.switchToPage(i);
    doc
      .fontSize(8)
      .fillColor("#999999")
      .text(`Page ${i + 1} of ${pages}`, 50, doc.page.height - 30, {
        align: "center",
      });
  }

  doc
    .fontSize(8)
    .fillColor("#999999")
    .text(
      "JobZy - Job Tracker Application | Generated automatically",
      50,
      doc.page.height - 20,
      { align: "center" }
    );
};

const generateHTMLResponse = (jobs, stats, fileName, isEmpty = false) => {
  if (isEmpty) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
          .container { background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); padding: 40px; max-width: 600px; text-align: center; }
          h1 { color: #333; margin: 20px 0; font-size: 28px; }
          p { color: #666; font-size: 16px; line-height: 1.6; }
          .btn { display: inline-block; margin-top: 20px; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>No Applications Found</h1>
          <p>You haven't added any job applications yet.</p>
          <a href="/" class="btn">Go to Dashboard</a>
        </div>
      </body>
      </html>
    `;
  }

  const statusColorMap = {
    applied: "#FFB84D",
    screening: "#4DA6FF",
    "interview-scheduled": "#FF9999",
    interviewed: "#9966FF",
    offered: "#66CC99",
    rejected: "#FF6666",
    accepted: "#00CC66",
    withdrawn: "#CCCCCC",
  };

  const jobsHTML = jobs
    .map(
      (job) => `
    <div class="job-card">
      <div class="job-header">
        <div>
          <h3>${job.company}</h3>
          <p class="position">${job.position}</p>
        </div>
        <span class="status-badge" style="background-color: ${
          statusColorMap[job.status] || "#999"
        }">
          ${(job.status || "applied").replace("-", " ").toUpperCase()}
        </span>
      </div>
      <div class="job-details">
        <div class="detail-row">
          <span class="label">Applied:</span>
          <span>${new Date(job.appliedDate).toLocaleDateString("en-IN")}</span>
        </div>
        ${
          job.location
            ? `<div class="detail-row"><span class="label">Location:</span><span>${job.location}</span></div>`
            : ""
        }
        ${
          job.workMode
            ? `<div class="detail-row"><span class="label">Mode:</span><span>${job.workMode}</span></div>`
            : ""
        }
        ${
          job.salary
            ? `<div class="detail-row"><span class="label">Salary:</span><span>${job.salary}</span></div>`
            : ""
        }
      </div>
    </div>
  `
    )
    .join("");
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>JobZy - Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; padding: 20px; color: #333; }
        .container { max-width: 900px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3); }
        .header h1 { font-size: 32px; margin-bottom: 10px; font-weight: 700; }
        .header p { font-size: 14px; opacity: 0.95; margin-bottom: 5px; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); border-left: 4px solid #667eea; }
        .stat-card h3 { font-size: 28px; color: #667eea; margin-bottom: 5px; font-weight: 700; }
        .stat-card p { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .jobs-section h2 { font-size: 22px; margin-bottom: 20px; color: #333; padding-bottom: 10px; border-bottom: 2px solid #667eea; }
        
        .job-card { background: white; padding: 20px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); transition: all 0.3s ease; }
        .job-card:hover { box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1); transform: translateY(-2px); }
        
        .job-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
        .job-header h3 { font-size: 18px; color: #667eea; margin-bottom: 5px; font-weight: 700; }
        .position { font-size: 14px; color: #666; font-weight: 500; }
        
        .status-badge { padding: 6px 16px; border-radius: 20px; color: white; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
        
        .job-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
        
        .detail-row { display: flex; justify-content: space-between; font-size: 13px; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
        .detail-row:last-child { border-bottom: none; }
        
        .label { font-weight: 600; color: #667eea; min-width: 100px; }
        .detail-row span:last-child { color: #666; word-break: break-word; }
        .detail-row a { color: #667eea; text-decoration: none; transition: color 0.3s; }
        .detail-row a:hover { color: #764ba2; text-decoration: underline; }
        
        .interviews { grid-column: 1 / -1; margin-top: 10px; padding: 10px; background: #f9f9f9; border-radius: 6px; }
        .interviews strong { display: block; color: #667eea; margin-bottom: 8px; font-size: 13px; }
        .interview { font-size: 12px; color: #555; padding: 5px 0; padding-left: 15px; border-left: 2px solid #667eea; }
        
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #999; font-size: 12px; }
        
        .download-btn { display: inline-block; margin-top: 20px; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s; border: none; cursor: pointer; }
        .download-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3); }
        
        .action-buttons { display: flex; gap: 10px; justify-content: center; margin-top: 30px; flex-wrap: wrap; }
        .btn { padding: 12px 20px; border-radius: 6px; font-weight: 600; text-decoration: none; transition: all 0.3s; border: none; cursor: pointer; font-size: 14px; }
        .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3); }
        .btn-secondary { background: white; color: #667eea; border: 2px solid #667eea; }
        .btn-secondary:hover { background: #f5f7fa; }
        
        @media (max-width: 768px) {
          .container { padding: 10px; }
          .header { padding: 20px; }
          .header h1 { font-size: 24px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .job-details { grid-template-columns: 1fr; }
          .job-header { flex-direction: column; }
          .status-badge { margin-top: 10px; }
        }
        
        @print {
          body { background: white; }
          .action-buttons { display: none; }
          .job-card { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 JobZy - Job Applications Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString("en-IN")}</p>
          <p>Total Applications: <strong>${jobs.length}</strong></p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <h3>${stats.total}</h3>
            <p>Total Apps</p>
          </div>
          <div class="stat-card">
            <h3>${stats.applied}</h3>
            <p>Applied</p>
          </div>
          <div class="stat-card">
            <h3>${stats.screening}</h3>
            <p>Screening</p>
          </div>
          <div class="stat-card">
            <h3>${stats["interview-scheduled"]}</h3>
            <p>Interviews</p>
          </div>
          <div class="stat-card">
            <h3>${stats.offered}</h3>
            <p>Offers</p>
          </div>
          <div class="stat-card">
            <h3>${stats.rejected}</h3>
            <p>Rejected</p>
          </div>
          <div class="stat-card">
            <h3>${stats.accepted}</h3>
            <p>Accepted</p>
          </div>
        </div>

        <div class="jobs-section">
          <h2>📋 Applications Details</h2>
          ${jobsHTML}
        </div>

        <div class="action-buttons">
          <a href="/exports/${fileName}" class="btn btn-primary" download>⬇️ Download PDF Report</a>
          <button class="btn btn-secondary" onclick="window.print()">🖨️ Print Report</button>
          <a href="/" class="btn btn-secondary">← Back to Dashboard</a>
        </div>

        <div class="footer">
          <p>JobZy - Job Tracker Application | Generated automatically on ${new Date().toLocaleString(
            "en-IN"
          )}</p>
          <p style="margin-top: 10px; font-size: 11px;">Track your job applications efficiently with JobZy 🚀</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = { generatePDFTemplate, generateHTMLResponse };
