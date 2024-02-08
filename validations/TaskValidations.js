import { check, validationResult } from "express-validator";
import { sq } from "../config/db.js";

export const validateUserTask = [
  // check("consumer_id").isInt().withMessage("Invalid consumer_id"),

  check("category_id")
    .isInt({ min: 1 })
    .withMessage("Invalid category_id")
    .bail()
    .custom(async (value) => {
      const task = await sq.models.categories.findOne({
        where: { category_id: value },
      });

      if (!task) {
        throw new Error("Task with the provided category_id does not exist");
      }

      return true;
    }),
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isString()
    .withMessage("Title must be a string")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Title can have a maximum length of 50 characters"),

  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .bail()
    .isString()
    .withMessage("Description must be a string")
    .bail()
    .isLength({ max: 500 })
    .withMessage("Description can have a maximum length of 500 characters"),

  check("radius")
    .notEmpty()
    .withMessage("radius is required")
    .bail()
    .isInt()
    .withMessage("Invalid radius"),

  check("address_id")
    .notEmpty()
    .withMessage("address_id is required")
    .bail()
    .isInt()
    .withMessage("Invalid address_id"),
  check("address_id")
    .isInt({ min: 1 })
    .withMessage("Invalid address_id")
    .bail()
    .custom(async (value) => {
      const task = await sq.models.consumer_addresses.findOne({
        where: { id: value },
      });

      if (!task) {
        throw new Error("Task with the provided address_id does not exist");
      }

      return true;
    }),
  check("start_time").isISO8601().withMessage("Invalid start_time"),

  check("date").isISO8601().withMessage("Invalid date"),
  // Valid ISO 8601 date: 2024-01-26
  // Valid ISO 8601 datetime: 2024-01-26T15:30:00
  check("budget").isInt().withMessage("Invalid budget"),
  check("image")
    .optional()
    .notEmpty()
    .withMessage("Image is required")
    .bail()
    .isString()
    .withMessage("Image must be a string")
    .bail(),

  check("is_posted").isIn(["posted", "saved"]).withMessage("Invalid is_posted"),

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

export const validateTaskResponse = [
  check("task_id")
    .isInt({ min: 1 })
    .withMessage("Invalid task_id")
    .bail()
    .custom(async (value) => {
      const task = await sq.models.user_tasks.findOne({
        where: { task_id: value },
      });

      if (!task) {
        throw new Error("Task with the provided task_id does not exist");
      }

      return true;
    }),

  check("reciever_id")
    .isInt({ min: 1 })
    .withMessage("Invalid reciever_id")
    .bail()
    .custom(async (value) => {
      const consumer = await sq.models.users.findOne({
        where: { user_id: value },
      });

      if (!consumer) {
        throw new Error("Consumer with the  reciever_id does not exist");
      }

      return true;
    }),

  check("expire_time").isISO8601().withMessage("Invalid expire_time"),

  check("budget").isInt().withMessage("Invalid budget"),

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

export const validateReportTask = [
  check("task_id")
    .isInt({ min: 1 })
    .withMessage("Invalid task_id")
    .bail()
    .custom(async (value) => {
      const task = await sq.models.user_tasks.findOne({
        where: { task_id: value },
      });

      if (!task) {
        throw new Error("Task with the provided task_id does not exist");
      }

      return true;
    }),

  check("booking_id").isInt().withMessage("Invalid booking_id"),
  check("booking_id")
    .isInt({ min: 1 })
    .withMessage("Invalid booking_id")
    .bail()
    .custom(async (value) => {
      const task = await sq.models.user_bookings.findOne({
        where: { booking_id: value },
      });

      if (!task) {
        throw new Error("Task with the provided booking_id does not exist");
      }

      return true;
    }),
  check("message")
    .notEmpty()
    .withMessage("Message is required")
    .bail()
    .isString()
    .withMessage("Message must be a string")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Message can have a maximum length of 200 characters"),

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

export const validateUserReview = [
  check("task_id")
    .isInt({ min: 1 })
    .withMessage("Invalid task_id")
    .bail()
    .custom(async (value) => {
      const task = await sq.models.user_tasks.findOne({
        where: { task_id: value },
      });

      if (!task) {
        throw new Error("Task with the provided task_id does not exist");
      }

      return true;
    }),

  // check("sender_id")
  //   .isInt({ min: 1 })
  //   .withMessage("Invalid sender_id")
  //   .bail()
  //   .custom(async (value) => {
  //     const reviewer = await sq.models.users.findOne({
  //       where: { user_id: value },
  //     });

  //     if (!reviewer) {
  //       throw new Error("User with the provided sender_id does not exist");
  //     }

  //     return true;
  //   }),

  check("reciever_id")
    .isInt({ min: 1 })
    .withMessage("Invalid reciever_id")
    .bail()
    .custom(async (value) => {
      const reviewedUser = await sq.models.users.findOne({
        where: { user_id: value },
      });

      if (!reviewedUser) {
        throw new Error("User with the provided reciever_id does not exist");
      }

      return true;
    }),

  check("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),

  check("review_content")
    .notEmpty()
    .withMessage("Review content is required")
    .bail()
    .isString()
    .withMessage("Review content must be a string")
    .bail()
    .isLength({ max: 500 })
    .withMessage("Review content can have a maximum length of 500 characters"),

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

export const validateUserInquiry = [
  check("task_id")
    .isInt({ min: 1 })
    .withMessage("Invalid task_id")
    .bail()
    .custom(async (value) => {
      const task = await sq.models.user_tasks.findOne({
        where: { task_id: value },
      });

      if (!task) {
        throw new Error("User task with the provided task_id does not exist");
      }

      return true;
    }),

  check("provider_id")
    .isInt({ min: 1 })
    .withMessage("Invalid provider_id")
    .bail()
    .custom(async (value) => {
      const provider = await sq.models.users.findOne({
        where: { user_id: value, role: "provider" },
      });

      if (!provider) {
        throw new Error(
          "Provider with the provided provider_id does not exist"
        );
      }

      return true;
    }),

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
