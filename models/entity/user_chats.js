// Import necessary modules from Sequelize
import { DataTypes } from "sequelize";

// Import utility functions for data types
import {
  primaryKey,
  foreignKey,
  stringNull,
  options,
  dateNow,
} from "../dbProperty.js";

// Import the Sequelize instance
import { sq } from "../../config/db.js";

// Define the "chats" table
const UserChat = sq.define(
  "user_chats",
  {
    chat_id: primaryKey(),
    sender_id: foreignKey({ references: { model: "users", key: "user_id" } }),
    reciever_id: foreignKey({ references: { model: "users", key: "user_id" } }),
    message: stringNull(255),
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

// Define the "chat_images" table
const ChatImage = sq.define(
  "chat_images",
  {
    id: primaryKey(),
    chat_id: foreignKey({
      references: { model: "user_chats", key: "chat_id" },
    }),
    image: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    creation_date: dateNow(),
    last_modified_date: dateNow(),
  },
  options()
);

export { UserChat, ChatImage };
