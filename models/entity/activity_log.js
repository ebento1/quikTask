// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import {
  primaryKey,
  intNotNull,
  stringNotNull,
  options,
  dateNow,
} from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "activity_log" table
const ActivityLog = sq.define(
  "activity_log",
  {
    id: primaryKey(),
    user_id: intNotNull({ references: { model: "users", key: "user_id" } }),
    table_name: stringNotNull(),
    row_changed_table: stringNotNull(),
    action: stringNotNull(),
    content: sq.Sequelize.TEXT,
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export default ActivityLog;
