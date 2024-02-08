// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import {
  primaryKey,
  stringNotNull,
  intNotNull,
  options,
  dateNow,
} from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "profile_response" table
const ProfileResponse = sq.define(
  "profile_response",
  {
    id: primaryKey(),
    user_id: intNotNull({
      references: { model: "users", key: "user_id" },
      allowNull: false,
    }),
    provider_id: intNotNull({
      references: { model: "provider_profiles", key: "provider_id" },
      allowNull: false,
    }),
    category_id: intNotNull({
      references: { model: "provider_categories", key: "category_id" },
      allowNull: false,
    }),
    reason: stringNotNull(),
    category_details: sq.Sequelize.TEXT,
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export default ProfileResponse;
