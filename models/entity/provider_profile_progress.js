// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import {
  primaryKey,
  intNotNull,
  enumNotNull,
  foreignKey,
  options,
  dateNow,
} from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "provider_profile_progress" table
const ProviderProfileProgress = sq.define(
  "provider_profile_progress",
  {
    id: primaryKey(),
    provider_id: foreignKey({
      references: { model: "provider_profiles", key: "provider_id" },
    }),

    status: {
      type: DataTypes.ENUM(
        "profile",
        "services",
        "documents",
        "workingHrs",
        "completed"
      ),
      defaultValue: "profile",
      allowNull: false,
    },

    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export default ProviderProfileProgress;
