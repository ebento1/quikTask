// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import {
  primaryKey,
  stringNotNull,
  boolNotNull,
  options,
  dateNow,
} from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "categories" table
const Category = sq.define(
  "categories",
  {
    category_id: primaryKey(),
    category_name: stringNotNull(50),
    is_license: boolNotNull(),
    is_certificate: boolNotNull(),

    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export default Category;
