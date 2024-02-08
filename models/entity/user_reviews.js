// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import {
  primaryKey,
  foreignKey,
  stringNotNull,
  intNotNull,
  options,
  dateNow,
} from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "user_reviews" table
const UserReviews = sq.define(
  "user_reviews",
  {
    id: primaryKey(),
    task_id: foreignKey({ references: { model: "tasks", key: "task_id" } }),
    sender_id: foreignKey({ references: { model: "users", key: "user_id" } }),
    reciever_id: foreignKey({ references: { model: "users", key: "user_id" } }),
    rating: intNotNull(),
    review_content: stringNotNull(500),
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export default UserReviews;
