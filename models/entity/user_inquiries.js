// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import {
  primaryKey,
  foreignKey,
  stringNotNull,
  intNotNull,
  options,
  dateNow,
} from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "user_inquiries" table
const UserInquiries = sq.define(
  "user_inquiries",
  {
    inquirie_id: primaryKey(),
    task_id: foreignKey({
      references: { model: "user_tasks", key: "task_id" },
    }),
    provider_id: foreignKey({ references: { model: "users", key: "user_id" } }),
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export default UserInquiries;
