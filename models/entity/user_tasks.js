// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import {
  primaryKey,
  foreignKey,
  stringNotNull,
  intNotNull,
  boolNotNull,
  dateNotNull,
  options,
  dateNow,
  datetimeNotNull,
} from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "tasks" table
export const UserTasks = sq.define(
  "user_tasks",
  {
    task_id: primaryKey(),
    consumer_id: foreignKey({ references: { model: "users", key: "user_id" } }),
    category_id: foreignKey({
      references: { model: "categories", key: "category_id" },
    }),
    title: stringNotNull(50),
    description: stringNotNull(300),
    radius: intNotNull(),
    address_id: foreignKey({
      references: { model: "consumer_addresses", key: "id" },
    }),
    start_time: DataTypes.TIME(),
    date: dateNotNull(),
    budget: intNotNull(),
    status: {
      type: DataTypes.ENUM("pending", "booked", "blocked", "expired"),
      defaultValue: "pending",
      allowNull: false,
    },
    is_posted: {
      type: DataTypes.ENUM("posted", "saved"),
      defaultValue: "saved",
      allowNull: false,
    },
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export const TaskImages = sq.define(
  "task_images",
  {
    id: primaryKey(),
    task_id: foreignKey({
      references: { model: "user_tasks", key: "task_id" },
    }),
    image: stringNotNull(),
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export const TaskResponses = sq.define(
  "task_responses",
  {
    response_id: primaryKey(),
    task_id: foreignKey({
      references: { model: "user_tasks", key: "task_id" },
    }),
    sender_id: foreignKey({ references: { model: "users", key: "user_id" } }),
    reciever_id: foreignKey({ references: { model: "users", key: "user_id" } }),
    expire_time: datetimeNotNull(),
    budget: intNotNull(),
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
      allowNull: true,
    },
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export const ReportTask = sq.define(
  "report_task",
  {
    id: primaryKey(),
    task_id: foreignKey({
      references: { model: "user_tasks", key: "task_id" },
    }),
    booking_id: foreignKey({
      references: { model: "user_bookings", key: "booking_id" },
    }),
    message: stringNotNull(200),
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);
