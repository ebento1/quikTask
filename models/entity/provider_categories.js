// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import { primaryKey, foreignKey, options, dateNow } from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "provider_categories" table
const ProviderCategory = sq.define(
  "provider_categories",
  {
    id: primaryKey(),
    category_id: foreignKey({
      references: { model: "categories", key: "category_id" },
      allowNull: false,
    }),
    provider_id: foreignKey({
      references: { model: "provider_profiles", key: "provider_id" },
      allowNull: false,
    }),
    status: {
      type: DataTypes.ENUM("active", "blocked", "waiting", "rejected"),
      defaultValue: "waiting",
      allowNull: false,
    },
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export default ProviderCategory;
