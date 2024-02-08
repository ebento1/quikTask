// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import { primaryKey, foreignKey, options, dateNow } from "../dbProperty.js";
import { sq } from "../../config/db.js";

export const FavouriteProviders = sq.define(
  "favourite_providers",
  {
    id: primaryKey(),
    consumer_id: foreignKey({ references: { model: "users", key: "user_id" } }),
    provider_id: foreignKey({ references: { model: "users", key: "user_id" } }),
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);
