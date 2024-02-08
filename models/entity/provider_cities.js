// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

import {
  primaryKey,
  stringNotNull,
  foreignKey,
  options,
  dateNow,
} from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "provider_cities" table
const ProviderCity = sq.define(
  "provider_cities",
  {
    provider_city_id: primaryKey(),
    provider_id: foreignKey({
      references: { model: "provider_profiles", key: "provider_id" },
    }),

    city_id: foreignKey({
      allowNull: false,
      references: { model: "cities", key: "city_id" },
    }),
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export default ProviderCity;
