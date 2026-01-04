const User = require("./userModel");
const Job = require("./jobModel");
const Interview = require("./interviewModel");

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

module.exports = {
  User,
  Job,
  Interview,
};
