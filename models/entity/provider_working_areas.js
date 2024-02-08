// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import {
  primaryKey,
  intNotNull,
  stringNotNull,
  foreignKey,
  options,
  dateNow,
} from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "area_of_work" table
const ProviderWorkArea = sq.define(
  "provider_working_areas",
  {
    id: primaryKey({ allowNull: false }),
    city_id: foreignKey({
      allowNull: false,
      references: { model: "provider_cities", key: "provider_city_id" },
    }),
    long_value: stringNotNull(255),
    lat_value: stringNotNull(255),
    radius: stringNotNull(255),

    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export default ProviderWorkArea;
