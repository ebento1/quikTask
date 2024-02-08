import { check, validationResult } from "express-validator";
import User from "../models/entity/users.js";

export const validateUser = [
  check("first_name").notEmpty().withMessage("First name is required"),
  check("last_name").notEmpty().withMessage("Last name is required"),
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .bail()
    .custom(async (value) => {
      // Check if the email is already in use
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        throw new Error("Email is already in use");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .bail()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .withMessage("Password must contain at least one letter and one number"),

  check("confirm_password")
    .notEmpty()
    .withMessage("Confirm password is required")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  check("contact_number").notEmpty().withMessage("Contact number is required"),
  check("TC")
    .isBoolean()
    .withMessage("Terms & Condition must be a boolean value")
    .bail()
    .custom((value) => {
      if (value !== "true") {
        throw new Error("Terms & Condition must be true");
      }
      return true;
    }),
  check("PP")
    .isBoolean()
    .withMessage("Privacy & Policy must be a boolean value")
    .bail()
    .custom((value) => {
      if (value !== "true") {
        throw new Error("Privacy & Policy must be true");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorResponse = {
        success: false,
        message: "Validation failed",
        errors: errors.array().map((error) => ({
          [error.path]: error.msg,
        })),
      };

      return res.status(400).json(errorResponse);
    }

    const successResponse = {
      success: true,
      message: "Validation successful",
    };
    // res.status(200).json(successResponse);
    next();
  },
];

export const validateUserConsumer = [
  check("first_name").notEmpty().withMessage("First name is required"),
  check("last_name").notEmpty().withMessage("Last name is required"),
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .bail()
    .custom(async (value) => {
      // Check if the email is already in use
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        throw new Error("Email is already in use");
      }
      return true;
    }),
  check("role")
    .notEmpty()
    .withMessage("Role is required")
    .bail()
    .custom((value) => {
      if (value !== "consumer") {
        throw new Error("Role must be a consumer");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .bail()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .withMessage("Password must contain at least one letter and one number"),

  check("confirm_password")
    .notEmpty()
    .withMessage("Confirm password is required")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  check("contact_number").notEmpty().withMessage("Contact number is required"),
  check("TC")
    .isBoolean()
    .withMessage("Terms & Condition must be a boolean value")
    .bail()
    .custom((value) => {
      if (value !== "true") {
        throw new Error("Terms & Condition must be true");
      }
      return true;
    }),
  check("PP")
    .isBoolean()
    .withMessage("Privacy & Policy must be a boolean value")
    .bail()
    .custom((value) => {
      if (value !== "true") {
        throw new Error("Privacy & Policy must be true");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorResponse = {
        success: false,
        message: "Validation failed",
        errors: errors.array().map((error) => ({
          [error.path]: error.msg,
        })),
      };

      return res.status(400).json(errorResponse);
    }

    const successResponse = {
      success: true,
      message: "Validation successful",
    };
    // res.status(200).json(successResponse);
    next();
  },
];

export const LoginValidations = [
  check("email").isEmail().withMessage("Invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorResponse = {
        success: false,
        message: "Validation failed",
        errors: errors.array().map((error) => ({
          [error.path]: error.msg,
        })),
        // errors: errors,
      };

      return res.status(400).json(errorResponse);
    }

    const successResponse = {
      success: true,
      message: "Validation successful",
    };
    // res.status(200).json(successResponse);
    next();
  },
];
