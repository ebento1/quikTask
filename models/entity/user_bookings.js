// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import {
  primaryKey,
  foreignKey,
  intNotNull,
  options,
  dateNow,
  stringNull,
} from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "user_bookings" table
const UserBooking = sq.define(
  "user_bookings",
  {
    booking_id: primaryKey(),
    task_id: foreignKey({ references: { model: "tasks", key: "task_id" } }),
    provider_id: foreignKey({ references: { model: "users", key: "user_id" } }),
    price: intNotNull(),
    status: {
      type: DataTypes.ENUM("blocked", "deleted", "active"),
      defaultValue: "active",
      allowNull: false,
    },

    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

const BookedTaskStatus = sq.define(
  "booked_task_status",
  {
    id: primaryKey(),
    booking_id: foreignKey({
      references: { model: "user_bookings", key: "booking_id" },
    }),
    user_id: foreignKey({
      references: { model: "users", key: "user_id" },
    }),
    status: {
      type: DataTypes.ENUM(
        "pending",
        "start",
        "cancel_request",
        "complete",
        "cancel",
        "rescedule_request",
        "rescedule"
      ),
      allowNull: false,
    },
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

// Define the "cancel_booking" table
const RequestBookings = sq.define(
  "request_booking",
  {
    id: primaryKey(),
    requested_id: foreignKey({
      references: { model: "users", key: "user_id" },
    }),
    accepted_id: foreignKey({ references: { model: "users", key: "user_id" } }),
    booking_id: foreignKey({
      references: { model: "user_bookings", key: "booking_id" },
    }),
    reason: stringNull(255),
    action: {
      type: DataTypes.ENUM("cancel", "rescedule"),
      allowNull: false,
    },
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

// Define the "cancel_booking_time" table
const CancelBookingTime = sq.define(
  "cancel_booking_time",
  {
    id: primaryKey(),
    provider_cancel_time: DataTypes.TIME,
    consumer_cancel_time: DataTypes.TIME,
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export { BookedTaskStatus, RequestBookings, CancelBookingTime, UserBooking };
