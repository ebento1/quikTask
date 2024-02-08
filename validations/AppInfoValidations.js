import { check, validationResult } from "express-validator";

// Validation for Date format
const isValidDateFormat = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
  return regex.test(dateString);
};

export const validatePromotion = [
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isString()
    .withMessage("Title must be a string")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Title can have a maximum length of 50 characters"),

  check("image")
    .notEmpty()
    .withMessage("Image is required")
    .bail()
    .isString()
    .withMessage("Image must be a string")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Image can have a maximum length of 50 characters"),

  check("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  check("link")
    .notEmpty()
    .withMessage("Link is required")
    .bail()
    .isString()
    .withMessage("Link must be a string"),

  check("valid_date")
    .notEmpty()
    .withMessage("Valid date is required")
    .bail()
    .custom((value) => isValidDateFormat(value))
    .withMessage("Invalid date format"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorResponse = {
        errors: errors.array().map((error) => ({
          [error.param]: error.msg,
        })),
      };

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errorResponse,
      });
    }

    next();
  },
];

export const validatePartnerReward = [
  // Similar validations for PartnerReward
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isString()
    .withMessage("Title must be a string")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Title can have a maximum length of 50 characters"),

  check("image")
    .notEmpty()
    .withMessage("Image is required")
    .bail()
    .isString()
    .withMessage("Image must be a string")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Image can have a maximum length of 50 characters"),

  check("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  check("link")
    .notEmpty()
    .withMessage("Link is required")
    .bail()
    .isString()
    .withMessage("Link must be a string"),

  check("valid_date")
    .notEmpty()
    .withMessage("Valid date is required")
    .bail()
    .custom((value) => isValidDateFormat(value))
    .withMessage("Invalid date format"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorResponse = {
        errors: errors.array().map((error) => ({
          [error.param]: error.msg,
        })),
      };

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errorResponse,
      });
    }

    next();
  },
];

export const validateOffer = [
  // Similar validations for Offer
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isString()
    .withMessage("Title must be a string")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Title can have a maximum length of 50 characters"),

  check("image")
    .notEmpty()
    .withMessage("Image is required")
    .bail()
    .isString()
    .withMessage("Image must be a string")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Image can have a maximum length of 50 characters"),

  check("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  check("link")
    .notEmpty()
    .withMessage("Link is required")
    .bail()
    .isString()
    .withMessage("Link must be a string"),

  check("valid_date")
    .notEmpty()
    .withMessage("Valid date is required")
    .bail()
    .custom((value) => isValidDateFormat(value))
    .withMessage("Invalid date format"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorResponse = {
        errors: errors.array().map((error) => ({
          [error.param]: error.msg,
        })),
      };

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errorResponse,
      });
    }

    next();
  },
];

export const validateAppInfo = [
  // Similar validations for AppInfo
  check("privacy_policy")
    .optional()
    .isString()
    .withMessage("Privacy Policy must be a string"),

  check("about_quicktask")
    .optional()
    .isString()
    .withMessage("About QuickTask must be a string"),

  check("terms_condition")
    .optional()
    .isString()
    .withMessage("Terms and Conditions must be a string"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorResponse = {
        errors: errors.array().map((error) => ({
          [error.param]: error.msg,
        })),
      };

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errorResponse,
      });
    }

    next();
  },
];
