//// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import { primaryKey, stringNotNull, options, dateNow } from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "cities" table
const City = sq.define(
  "cities",
  {
    city_id: primaryKey(),
    city: stringNotNull(),

    // creation_date: dateNow(),
    // last_modified_date: dateNow(),
  },

  options()
);

export default City;
