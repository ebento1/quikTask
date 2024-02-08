import { check, validationResult } from "express-validator";
import { sq } from "../../config/db.js";

export const validateUserChat = [
  //   check("sender_id")
  //     .isInt({ min: 1 })
  //     .withMessage("Invalid sender_id")
  //     .bail()
  //     .custom(async (value) => {
  //       const provider = await sq.models.users.findOne({
  //         where: { user_id: value, role: "provider" },
  //       });

  //       if (!provider) {
  //         throw new Error("Provider with the provided sender_id does not exist");
  //       }

  //       return true;
  //     }),

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
  check("image")
    .optional()
    .isString()
    .withMessage("Image must be a string")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Image path can have a maximum length of 100 characters"),
  check("message")
    .optional()
    .isString()
    .withMessage("Message must be a string")
    .bail()
    .isLength({ max: 255 })
    .withMessage("Message can have a maximum length of 255 characters"),

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
