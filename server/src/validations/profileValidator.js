const { body } = require('express-validator');
const validateUpdateProfile = [
  body('name')
    .optional({ checkFalsy: true })
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]*$/).withMessage('Name can only contain letters and spaces'),

  body('phoneNumber')
    .optional({ checkFalsy: true })
    .trim()
    .notEmpty().withMessage('Phone number cannot be empty')
    .matches(/^[6-9]\d{9}$/).withMessage('Phone number must be a valid Indian number (10 digits starting with 6-9)')
    .custom((value) => {
      if (value && value.length !== 10) {
        throw new Error('Phone number must be exactly 10 digits');
      }
      return true;
    })
];

// PATCH: /user/profile/password (Change password)
const validateChangePassword = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8, max: 100 }).withMessage('New password must be between 8 and 100 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    })
];

// DELETE: /user/profile (Delete account)
const validateDeleteAccount = [
  body('password')
    .notEmpty().withMessage('Password is required for account deletion')
    .isLength({ min: 8 }).withMessage('Invalid password format')
];

module.exports = {
  validateUpdateProfile,
  validateChangePassword,
  validateDeleteAccount
};
