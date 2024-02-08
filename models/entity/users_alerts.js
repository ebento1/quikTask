// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import {
  primaryKey,
  foreignKey,
  stringNotNull,
  options,
  datetimeNotNull,
  dateNow,
} from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "alerts" table
const UserAlert = sq.define(
  "user_alerts",
  {
    id: primaryKey(),
    user_id: foreignKey({ references: { model: "users", key: "user_id" } }),
    title: stringNotNull(50),
    message: stringNotNull(50),
    date_time: datetimeNotNull(),
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export default UserAlert;
