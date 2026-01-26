const { validationResult } = require("express-validator");

const validationErrorHandler = (req, res, next) => {
  // Get validation errors from express-validator
  const errors = validationResult(req);

  // If no errors, proceed to next middleware/controller
  if (errors.isEmpty()) {
    return next();
  }

  // Format error response
  const formattedErrors = errors.array().map((err) => ({
    field: err.param,
    message: err.msg,
    value: err.value !== undefined ? err.value : null,
    location: err.location,
  }));

  // Return 400 Bad Request with errors
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: formattedErrors,
    errorCount: formattedErrors.length,
  });
};

module.exports = validationErrorHandler;
