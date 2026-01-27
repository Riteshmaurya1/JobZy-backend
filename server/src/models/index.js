const User = require("./userModel");
const Job = require("./jobModel");
const Interview = require("./interviewModel");
const Payment = require("./paymentModel");
const Document = require("./documentModel");

// User -> Job (One-to-Many)
User.hasMany(Job, {
  foreignKey: "userId",
  as: "jobs",
  onDelete: "CASCADE",
});
Job.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Job -> Interview (One-to-One or One-to-Many)
Job.hasMany(Interview, {
  foreignKey: "jobId",
  as: "interviews",
  onDelete: "CASCADE",
});
Interview.belongsTo(Job, {
  foreignKey: "jobId",
  as: "job",
});

// Payment associations
User.hasMany(Payment, { foreignKey: "userId", as: "payments" });
Payment.belongsTo(User, { foreignKey: "userId", as: "user" });


// Define associations (if any)
User.hasMany(Document, { foreignKey: "userId" });
Document.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  User,
  Job,
  Interview,
  Payment,
  Document,
};
