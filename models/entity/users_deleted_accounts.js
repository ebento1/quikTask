// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import {
  primaryKey,
  foreignKey,
  stringNotNull,
  options,
  dateNow,
} from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "user_reviews" table
const UserDeletedAccounts = sq.define(
  "user_deleted_accounts",
  {
    id: primaryKey(),
    user_id: foreignKey({ references: { model: "users", key: "user_id" } }),
    reason: stringNotNull(500),
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export default UserDeletedAccounts;
