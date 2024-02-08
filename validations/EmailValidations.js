// middlewares/validateUser.js
import { check, validationResult } from "express-validator";
import User from "../models/entity/users.js";

export const validateEmail = [
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

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorResponse = {
        errors: errors.array().map((error) => ({
          [error.path]: error.msg,
        })),
      };

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errorResponse.errors,
      });
    }

    // res.status(200).json({
    //   success: true,
    //   message: "Email validation successful",
    // });
    next();
  },
];
