// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import {
  primaryKey,
  foreignKey,
  stringNotNull,
  intNotNull,
  boolNotNull,
  options,
  dateNow,
} from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "buisness_profiles" table
const ProviderProfiles = sq.define(
  "provider_profiles",
  {
    provider_id: primaryKey(),
    user_id: foreignKey({ references: { model: "users", key: "user_id" } }),
    buisness_name: stringNotNull(50),
    sleep_mode: boolNotNull({ defaultValue: false }),
    description: stringNotNull(200),
    status: {
      type: DataTypes.ENUM("active", "blocked", "waiting"),
      defaultValue: "waiting",
      allowNull: false,
    },
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export default ProviderProfiles;
