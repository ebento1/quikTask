import { check, validationResult } from "express-validator";
import { sq } from "../config/db.js"; // Import your Sequelize instance

const validateCityExists = async (cityId) => {
  const city = await sq.models.cities.findOne({
    where: { city_id: cityId },
  });

  return city !== null;
};

export const validateBusinessProfile = [
  // check("user_id").isInt().withMessage("Invalid user_id"),

  check("buisness_name")
    .notEmpty()
    .withMessage("Business name is required")
    .bail()

    .isString()
    .withMessage("Business name must be a string")
    .bail()

    .isLength({ max: 50 })
    .withMessage("Business name can have a maximum length of 50 characters"),

  check("sleep_mode").isBoolean().withMessage("Invalid Data"),

  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .bail()
    .isString()
    .withMessage("Description must be a string")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Description can have a maximum length of 200 characters"),

  check("cities")
    .isArray({ min: 1 })
    .withMessage("At least one city must be provided")
    .bail()
    .custom(async (cities) => {
      for (const city of cities) {
        if (
          !city.city_id ||
          !(await validateCityExists(city.city_id)) ||
          !city.area_of_work ||
          !Array.isArray(city.area_of_work)
        ) {
          throw new Error("Invalid city format or city_id does not exist");
        }
      }
      return true;
    }),

  check("addresses")
    .isArray({ min: 1 })
    .withMessage("At least one address must be provided")
    .bail()
    .custom((addresses) => {
      for (const address of addresses) {
        if (!address.address) {
          throw new Error("Invalid address format");
        }
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
        errors: errorResponse,
      });
    }

    next();
  },
];

export const validateWorkingHours = [
  //   check("provider_id").isInt().withMessage("Invalid provider_id"),

  check("working_hours")
    .isArray({ min: 1 })
    .withMessage("At least one working hour must be provided")
    .bail()
    .custom((workingHours) => {
      for (const hour of workingHours) {
        const { day, opening_hours, closing_hours } = hour;

        if (!day || !opening_hours || !closing_hours) {
          throw new Error("Invalid working hour format");
        }

        // Additional validation for date format (if needed)
        if (
          !isValidDateFormat(opening_hours) ||
          !isValidDateFormat(closing_hours)
        ) {
          throw new Error("Invalid date format in working hour");
        }
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
        errors: errorResponse,
      });
    }

    // res.status(200).json({ success: true, message: "Validation successful" });
    next();
  },
];

// Helper function to check if the date format is valid
function isValidDateFormat(timeString) {
  const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(timeString);
}

const validateCategoryExists = async (categoryId) => {
  const category = await sq.models.categories.findOne({
    where: { category_id: categoryId },
  });

  return category !== null;
};

export const validateProviderCategories = [
  check("category_ids")
    .isArray({ min: 1 })
    .withMessage("At least one category ID must be provided")
    .bail()
    .custom(async (categoryIds) => {
      for (const categoryId of categoryIds) {
        if (
          !Number.isInteger(categoryId) ||
          categoryId <= 0 ||
          !(await validateCategoryExists(categoryId))
        ) {
          throw new Error(
            "Invalid category ID format or category does not exist"
          );
        }
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
        errors: errorResponse,
      });
    }

    next();
  },
];

export const validateProviderCategoryLicence = [
  // check("category_id")
  //   .isInt({ min: 1 })
  //   .withMessage("Category ID must be a positive integer"),
  check("category_id")
    .isInt({ min: 1 })
    .withMessage("Invalid category_id")
    .bail()
    .custom(async (value, { req }) => {
      const category = await sq.models.provider_categories.findOne({
        where: { id: value },
      });

      if (!category) {
        throw new Error(
          "Category with the provided category_id does not exist"
        );
      }

      return true;
    }),

  check("liscense_number").notEmpty().withMessage("License number is required"),

  check("address").notEmpty().withMessage("Address is required"),

  check("first_name")
    .notEmpty()
    .withMessage("First name is required")
    .bail()
    .isLength({ max: 50 })
    .withMessage("First name must not exceed 50 characters"),

  check("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Last name must not exceed 50 characters"),

  check("licence_img_front").custom((value, { req }) => {
    if (!req.imgsrcFront) {
      throw new Error("Front image of the license is required");
    }
    return true;
  }),

  check("licence_img_back").custom((value, { req }) => {
    if (!req.imgsrcBack) {
      throw new Error("Back image of the license is required");
    }
    return true;
  }),

  check("issued_date").isISO8601().withMessage("Invalid issued date format"),

  check("expiry_date").isISO8601().withMessage("Invalid expiry date format"),

  check("d_of_birth").isISO8601().withMessage("Invalid date of birth format"),

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
        errors: errorResponse,
      });
    }

    next();
  },
];

export const validateProviderDrivingLicence = [
  check("liscense_number").notEmpty().withMessage("License number is required"),

  check("address").notEmpty().withMessage("Address is required"),

  check("first_name")
    .notEmpty()
    .withMessage("First name is required")
    .bail()
    .isLength({ max: 50 })
    .withMessage("First name must not exceed 50 characters"),

  check("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Last name must not exceed 50 characters"),

  check("licence_img_front").custom((value, { req }) => {
    if (!req.imgsrcFront) {
      throw new Error("Front image of the license is required");
    }
    return true;
  }),

  check("licence_img_back").custom((value, { req }) => {
    if (!req.imgsrcBack) {
      throw new Error("Back image of the license is required");
    }
    return true;
  }),

  check("issued_date").isISO8601().withMessage("Invalid issued date format"),

  check("expiry_date").isISO8601().withMessage("Invalid expiry date format"),

  check("d_of_birth").isISO8601().withMessage("Invalid date of birth format"),

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
        errors: errorResponse,
      });
    }

    next();
  },
];
