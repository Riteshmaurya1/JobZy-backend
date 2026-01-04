const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken } = require("../auth/jwt");
const jwt = require("jsonwebtoken");
// const {
//   loginAlertTemplate,
//   welcomeTemplate,
// } = require("../utils/emailTemplates");
// const { sendEmail } = require("../services/emailService");
// const { getDeviceInfo, getLocationFromIP } = require("../utils/deviceUtils");

const SignUp = async (req, res, next) => {
  try {
    // Step1: get data from body
    const { name, email, phoneNumber, password } = req.body;

    // Step2: validate inputs
    if (!name || !email || !phoneNumber || !password) {
      const error = new Error("Invalid credentials!.");
      error.statusCode = 400;
      throw error;
    }

    // Step3: DB checking exiting user
    const checkExitingUser = await User.findOne({ where: { email } });
    if (checkExitingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // Step4: hash the password.
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Step5: Create user.
    const user = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    // Step6: Generate Token and making payload.
    const userPayload = {
      id: user.id,
      user: user.name,
    };
    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    // Step7: Save refreshToken to the DB
    user.refreshToken = refreshToken;
    await user.save();

    // Step8: Welcome email send
    const html = welcomeTemplate(user.name);
    await sendEmail(user.email, "Welcome to Jobzy 🎉", html, true);

    // Step8: return response
    return res.status(201).json({
      message: "User created",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    // logger
    next(err);
    return;
  }
};

const SignIn = async (req, res, next) => {
  try {
    // Step1: req data from body
    const { email, password } = req.body;

    // Step2: Validate Inputs
    if (!email || !password) {
      const error = new Error("Email & password required");
      error.statusCode = 400;
      next(error);
    }

    // Step3: DB Call for user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("Please Sign up first.");
      error.statusCode = 401;
      next(error);
    }

    // Step4: User found then Validate Password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      next(error);
    }

    // Step5: Generate Token and making payload.
    const userPayload = {
      id: user.id,
      user: user.name,
    };
    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    // Step6: Save refreshToken to the DB
    user.refreshToken = refreshToken;
    await user.save();

    // Step7: Send login alert mail (LIVE INFO)
    const device = getDeviceInfo(req);

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    const location = await getLocationFromIP(ip);

    const loginTime = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const html = loginAlertTemplate(user.name, device, location, loginTime);

    await sendEmail(user.email, "Jobzy – New login detected", html, true);

    // Step8: return response
    return res.status(201).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
    return;
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    // Step1: Check the refresh token
    const { refreshToken } = req.body;
    if (!refreshToken) {
      const error = new Error("Refresh token required");
      error.statusCode = 401;
      throw error;
    }

    // Step2: Verify refresh token & it's expiry
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      console.log(decoded);
    } catch (err) {
      const error = new Error("Invalid or expired refresh token");
      error.statusCode = 403;
      return next(error);
    }

    //Step3: Check that this token matches DB Refresh token
    const user = await User.findByPk(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      const error = new Error("Refresh token not found");
      error.statusCode = 403;
      throw error;
    }

    // Step4: Generate new access token || rotate refresh token
    const payload = {
      id: user.id,
      user: user.name,
    };
    const newAccessToken = generateAccessToken(payload);

    // Step5: make a new refresh token
    const newRefreshToken = generateRefreshToken(payload);
    user.refreshToken = newRefreshToken;
    await user.save();

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken, // if rotating
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  SignUp,
  SignIn,
  refreshAccessToken,
};
