// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import {
  primaryKey,
  foreignKey,
  stringNotNull,
  options,
  dateNow,
} from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "provider_categories_licences" table
const DrivingLicence = sq.define(
  "provider_driving_licences",
  {
    id: primaryKey(),
    user_id: foreignKey({
      references: { model: "users", key: "user_id" },
      allowNull: false,
    }),
    liscense_number: stringNotNull(),
    address: stringNotNull(),
    first_name: stringNotNull(50),
    last_name: stringNotNull(50),
    licence_img_front: stringNotNull(),
    licence_img_back: stringNotNull(),
    issued_date: DataTypes.DATE,
    expiry_date: DataTypes.DATE,
    d_of_birth: dateNow(),
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export default DrivingLicence;
