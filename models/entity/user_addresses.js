// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";
import {
  primaryKey,
  stringNotNull,
  foreignKey,
  options,
  dateNow,
} from "../dbProperty.js";

// Address model definition
const Address = sq.define(
  "addresses",
  {
    id: primaryKey({ allowNull: false }),
    provider_id: foreignKey({
      allowNull: false,
      references: { model: "provider_profiles", key: "provider_id" },
    }),
    address: stringNotNull(), // Make sure the attribute name is correct

    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export default Address;
