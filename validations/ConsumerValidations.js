import { check, validationResult } from "express-validator";

export const validateConsumerAddress = [
  check("city_id")
    .isInt({ min: 1 })
    .withMessage("Invalid city_id")
    .bail()
    .custom(async (value) => {
      const task = await sq.models.cities.findOne({
        where: { city_id: value },
      });

      if (!task) {
        throw new Error("City with the city_id does not exist");
      }

      return true;
    }),

  //   check("consumer_id")
  //     .notEmpty()
  //     .withMessage("Consumer ID is required")
  //     .bail()
  //     .isInt()
  //     .withMessage("Invalid consumer_id"),

  check("address")
    .notEmpty()
    .withMessage("Address is required")
    .bail()

    .isString()
    .withMessage("Address must be a string")
    .bail()

    .isLength({ max: 100 })
    .withMessage("Address can have a maximum length of 100 characters"),

  check("landmark")
    .optional()
    .isString()
    .withMessage("Landmark must be a string")
    .bail()

    .isLength({ max: 50 })
    .withMessage("Landmark can have a maximum length of 50 characters"),

  check("address_label")
    .optional()
    .isIn(["office", "home"])
    .withMessage("Invalid address label"),

  check("default_address").isBoolean().withMessage("Invalid default_address"),

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
