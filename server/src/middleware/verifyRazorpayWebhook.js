// Create middleware: src/middleware/verifyRazorpayWebhook.js
const verifyRazorpayWebhook = (req, res, next) => {
  // Add IP whitelist check for Razorpay IPs
  const razorpayIPs = ["1.200.70.254", "1.200.70.255"]; // Razorpay IPs
  const clientIP = req.ip;

  if (!razorpayIPs.includes(clientIP)) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }
  next();
};

module.exports = verifyRazorpayWebhook;