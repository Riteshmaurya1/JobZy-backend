const os = require("os");

const getDeviceInfo = (req) => {
  const userAgent = req.headers["user-agent"] || "Unknown device";

  const platform =
    os.platform() === "win32"
      ? "Windows"
      : os.platform() === "darwin"
      ? "macOS"
      : os.platform() === "linux"
      ? "Linux"
      : "Unknown OS";

  return `${platform} · ${userAgent}`;
};

const getLocationFromIP = async (ip) => {
  if (!ip || ip.includes("127.0.0.1") || ip.includes("::1")) {
    return "Localhost / Unknown location";
  }

  // No DB, no API — safe fallback
  return `IP: ${ip}`;
};

module.exports = {
  getDeviceInfo,
  getLocationFromIP,
};
