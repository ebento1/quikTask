// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import {
  primaryKey,
  foreignKey,
  stringNotNull,
  stringNull,
  options,
  dateNow,
  boolNotNull,
} from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "consumer_addresses" table
const ConsumerAddresses = sq.define(
  "consumer_addresses",
  {
    id: primaryKey(),
    city_id: foreignKey({ references: { model: "cities", key: "city_id" } }),
    consumer_id: foreignKey({ references: { model: "users", key: "user_id" } }),
    address: stringNotNull(500),
    landmark: stringNull(500),
    address_label: {
      type: DataTypes.ENUM("office", "home"),
      allowNull: true,
    },
    default_address: boolNotNull(),
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export default ConsumerAddresses;
