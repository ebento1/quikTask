// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import { primaryKey, stringNotNull, options } from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "promotions" table
export const Promotion = sq.define(
  "promotions",
  {
    id: primaryKey(),
    title: stringNotNull(50),
    image: stringNotNull(50),
    description: DataTypes.TEXT,
    link: stringNotNull(),
    valid_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

// Define the "partner_rewards" table
export const PartnerReward = sq.define(
  "partner_rewards",
  {
    id: primaryKey(),
    title: stringNotNull(50),
    image: stringNotNull(50),
    description: DataTypes.TEXT,
    link: stringNotNull(),
    valid_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

// Define the "offers" table
export const Offer = sq.define(
  "offers",
  {
    id: primaryKey(),
    title: stringNotNull(50),
    image: stringNotNull(50),
    description: DataTypes.TEXT,
    link: stringNotNull(),
    valid_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

// Define the "app_info" table
export const AppInfo = sq.define(
  "app_info",
  {
    id: primaryKey(),
    privacy_policy: DataTypes.TEXT,
    about_quicktask: DataTypes.TEXT,
    terms_condition: DataTypes.TEXT,
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);
