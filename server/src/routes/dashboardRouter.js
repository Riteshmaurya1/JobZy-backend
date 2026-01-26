// server/src/routes/dashboardRouter.js
const express = require("express");
const isAuth = require("../middleware/verifyJwt");
const { getDashboard } = require("../controllers/dashboardController");

const router = express.Router();

// POST /api/dashboard
router.get("/dashboard", isAuth, getDashboard);

module.exports = router;
