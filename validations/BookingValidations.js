import { check, validationResult } from "express-validator";
import { sq } from "../../config/db.js";

export const validateUserBooking = [
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

  check("provider_id")
    .isInt({ min: 1 })
    .withMessage("Invalid provider_id")
    .bail()
    .custom(async (value) => {
      const user = await sq.models.users.findOne({
        where: { user_id: value, role: "provider" },
      });

      if (!user) {
        throw new Error(
          "Provider with the provided provider_id does not exist"
        );
      }

      return true;
    }),

  check("price").isInt().withMessage("Invalid price"),

  check("status")
    .isIn(["blocked", "deleted", "active"])
    .withMessage("Invalid status"),

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
