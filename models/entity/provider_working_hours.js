// Import necessary modules from Sequelize
import { DataTypes, TIME } from "sequelize";

// Import utility functions for data types
import {
  primaryKey,
  foreignKey,
  stringNotNull,
  datetimeNotNull,
  options,
  dateNow,
} from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "provider_working_hours" table
const ProviderWorkingHours = sq.define(
  "provider_working_hours",
  {
    id: primaryKey(),
    provider_id: foreignKey({
      references: { model: "provider_profiles", key: "provider_id" },
      allowNull: false,
    }),
    day: stringNotNull(),
    opening_hours: DataTypes.TIME,
    closing_hours: DataTypes.TIME,

    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export default ProviderWorkingHours;
