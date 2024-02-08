// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import {
  primaryKey,
  stringNotNull,
  intNotNull,
  boolNotNull,
  options,
  dateNow,
} from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "users" table
const User = sq.define(
  "users",
  {
    user_id: primaryKey(),
    first_name: stringNotNull(50),
    last_name: stringNotNull(50),
    email: { ...stringNotNull(50), unique: true },
    password: stringNotNull(),
    confirm_password: stringNotNull(),
    contact_number: stringNotNull(),
    TC: boolNotNull(),
    PP: boolNotNull(),

    role: {
      type: DataTypes.ENUM("provider", "consumer", "admin"),
      defaultValue: "provider",
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("active", "blocked", "deleted"),
      defaultValue: "active",
      allowNull: false,
    },

    dark_mode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

// export const ReportUser = sq.define(
//   "report_user",
//   {
//     id: primaryKey(),
//     consumer_id: foreignKey({ references: { model: "users", key: "user_id" } }),
//     provider_id: foreignKey({ references: { model: "users", key: "user_id" } }),
//     message: stringNotNull(200),
//     creation_date: dateNow(),
//     last_modified_date: dateNow(),
//   },
//   options()
// );

export const createAdminUser = async (req, res) => {
  try {
    const adminUserData = {
      first_name: "Admin",
      last_name: "User",
      email: "arshia@gmail.com",
      password: "arshia24",
      confirm_password: "arshia24",
      contact_number: "1234567890",
      TC: true,
      PP: true,
      role: "admin",
    };

    // Create the admin user in the database
    const adminUser = await User.create(adminUserData);

    // Return success response
    res.status(201).json({
      success: true,
      message: "Admin user created successfully.",
      user: adminUser.toJSON(),
    });
  } catch (error) {
    console.error(error);

    // Return error response
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to create admin user.",
    });
  }
};

export default User;
