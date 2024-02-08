import { sq } from "../config/db.js";
import { DataTypes } from "sequelize";
import ProviderProfiles from "./entity/provider_profiles.js";
import User from "./entity/users.js";
import ProviderProfileProgress from "./entity/provider_profile_progress.js";
import City from "./entity/cities.js";
import ProviderCity from "./entity/provider_cities.js";
import ProviderWorkArea from "./entity/provider_working_areas.js";
import ProviderCategory from "./entity/provider_categories.js";
import Category from "./entity/categories.js";
import ProviderCategoryLicence from "./entity/provider_categories_liscense.js";
import ProviderWorkingHours from "./entity/provider_working_hours.js";
import Address from "./entity/user_addresses.js";
import ActivityLog from "./entity/activity_log.js";
import ProfileResponse from "./entity/profile_responses.js";
import DrivingLicence from "./entity/driving_liscense.js";
import ConsumerAddresses from "./entity/consumer_addresses.js";
import { FavouriteProviders } from "./entity/favourite_providers.js";
import {
  ReportTask,
  TaskImages,
  TaskResponses,
  UserTasks,
} from "./entity/user_tasks.js";
import {
  BookedTaskStatus,
  RequestBookings,
  UserBooking,
} from "./entity/user_bookings.js";
import { ChatImage, UserChat } from "./entity/user_chats.js";
import UserInquiries from "./entity/user_inquiries.js";
import UserReviews from "./entity/user_reviews.js";
import UserAlert from "./entity/users_alerts.js";
import UserDeletedAccounts from "./entity/users_deleted_accounts.js";

User.hasOne(ProviderProfiles, { foreignKey: "user_id" });
ProviderProfiles.belongsTo(User, { foreignKey: "user_id" });

User.hasOne(DrivingLicence, { foreignKey: "user_id" });
DrivingLicence.belongsTo(User, { foreignKey: "user_id" });

User.hasOne(ActivityLog, { foreignKey: "user_id" });
ActivityLog.belongsTo(User, { foreignKey: "user_id" });

ProviderProfiles.hasOne(ProviderProfileProgress, { foreignKey: "provider_id" });
ProviderProfileProgress.belongsTo(ProviderProfiles, {
  foreignKey: "provider_id",
});

ProviderProfiles.hasOne(ProfileResponse, { foreignKey: "provider_id" });
ProfileResponse.belongsTo(ProviderProfiles, {
  foreignKey: "provider_id",
});

ProviderCategory.hasMany(ProfileResponse, {
  foreignKey: "category_id",
});
ProfileResponse.belongsTo(ProviderCategory, {
  foreignKey: "category_id",
});

City.hasMany(ProviderCity, { foreignKey: "city_id" });
ProviderCity.belongsTo(City, { foreignKey: "city_id" });

// Update ProviderCity model
ProviderProfiles.hasMany(ProviderCity, { foreignKey: "provider_id" });
ProviderCity.belongsTo(ProviderProfiles, { foreignKey: "provider_id" });

ProviderCity.hasMany(ProviderWorkArea, { foreignKey: "city_id" });
ProviderWorkArea.belongsTo(ProviderCity, { foreignKey: "provider_city_id" });
// ProviderProfiles.hasMany(ProviderWorkArea, { foreignKey: 'provider_id' });
// ProviderWorkArea.belongsTo(ProviderProfiles, { foreignKey: 'provider_id' });

ProviderProfiles.hasMany(ProviderCategory, { foreignKey: "provider_id" });
ProviderCategory.belongsTo(ProviderProfiles, { foreignKey: "provider_id" });
Category.hasMany(ProviderCategory, { foreignKey: "category_id" });
ProviderCategory.belongsTo(Category, { foreignKey: "category_id" });

ProviderCategory.hasMany(ProviderCategoryLicence, {
  foreignKey: "category_id",
});
ProviderCategoryLicence.belongsTo(ProviderCategory, {
  foreignKey: "category_id",
});

ProviderProfiles.hasMany(ProviderWorkingHours, { foreignKey: "provider_id" });
ProviderWorkingHours.belongsTo(ProviderProfiles, { foreignKey: "provider_id" });

ProviderProfiles.hasMany(Address, { foreignKey: "provider_id" });
Address.belongsTo(ProviderProfiles, { foreignKey: "provider_id" });

User.hasMany(ConsumerAddresses, { foreignKey: "consumer_id" });
ConsumerAddresses.belongsTo(User, { foreignKey: "user_id" });

City.hasMany(ConsumerAddresses, { foreignKey: "city_id" });
ConsumerAddresses.belongsTo(City, { foreignKey: "user_id" });

User.hasMany(FavouriteProviders, { foreignKey: "consumer_id" });
FavouriteProviders.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(FavouriteProviders, { foreignKey: "provider_id" });
FavouriteProviders.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(UserTasks, { foreignKey: "consumer_id" });
UserTasks.belongsTo(User, { foreignKey: "user_id" });
Category.hasMany(UserTasks, { foreignKey: "category_id" });
UserTasks.belongsTo(Category, { foreignKey: "category_id" });

ConsumerAddresses.hasMany(UserTasks, { foreignKey: "address_id" });
UserTasks.belongsTo(ConsumerAddresses, { foreignKey: "id" });

UserTasks.hasMany(TaskImages, { foreignKey: "task_id" });
TaskImages.belongsTo(UserTasks, { foreignKey: "task_id" });

UserTasks.hasMany(TaskResponses, { foreignKey: "task_id" });
TaskResponses.belongsTo(UserTasks, { foreignKey: "task_id" });
User.hasMany(TaskResponses, { foreignKey: "sender_id" });
TaskResponses.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(TaskResponses, { foreignKey: "reciever_id" });
TaskResponses.belongsTo(User, { foreignKey: "user_id" });

UserTasks.hasMany(ReportTask, { foreignKey: "task_id" });
ReportTask.belongsTo(UserTasks, { foreignKey: "task_id" });
UserBooking.hasMany(ReportTask, { foreignKey: "booking_id" });
ReportTask.belongsTo(UserBooking, { foreignKey: "booking_id" });

UserTasks.hasMany(UserBooking, { foreignKey: "booking_id" });
UserBooking.belongsTo(UserTasks, { foreignKey: "task_id" });

User.hasMany(UserBooking, { foreignKey: "provider_id" });
UserBooking.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(BookedTaskStatus, { foreignKey: "user_id" });
BookedTaskStatus.belongsTo(User, { foreignKey: "user_id" });

UserBooking.hasMany(BookedTaskStatus, { foreignKey: "booking_id" });
BookedTaskStatus.belongsTo(UserBooking, { foreignKey: "booking_id" });

UserBooking.hasMany(RequestBookings, { foreignKey: "booking_id" });
RequestBookings.belongsTo(UserBooking, { foreignKey: "booking_id" });
User.hasMany(RequestBookings, { foreignKey: "requested_id" });
RequestBookings.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(RequestBookings, { foreignKey: "accepted_id" });
RequestBookings.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(UserChat, { foreignKey: "sender_id" });
UserChat.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(UserChat, { foreignKey: "reciever_id" });
UserChat.belongsTo(User, { foreignKey: "user_id" });

UserChat.hasMany(ChatImage, { foreignKey: "chat_id" });
ChatImage.belongsTo(UserChat, { foreignKey: "chat_id" });

UserTasks.hasMany(UserInquiries, { foreignKey: "task_id" });
UserInquiries.belongsTo(UserTasks, { foreignKey: "task_id" });
User.hasMany(UserInquiries, { foreignKey: "provider_id" });
UserInquiries.belongsTo(User, { foreignKey: "user_id" });

UserTasks.hasMany(UserReviews, { foreignKey: "task_id" });
UserReviews.belongsTo(UserTasks, { foreignKey: "task_id" });
User.hasMany(UserReviews, { foreignKey: "sender_id" });
UserReviews.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(UserReviews, { foreignKey: "reciever_id" });
UserReviews.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(UserAlert, { foreignKey: "user_id" });
UserAlert.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(UserDeletedAccounts, { foreignKey: "user_id" });
UserDeletedAccounts.belongsTo(User, { foreignKey: "user_id" });

async function creerTable() {
  // sq.sync({ alter: true })

  sq.sync()
    .then(() => {
      console.log("Tables created");
    })
    .catch((err) => {
      console.error(err);
    });
  // synchronizeTables();
}

// export async function synchronizeTables() {
//   try {
//     // Use force: true for all models except 'cities'
//     const modelsToSync = [User, ProviderProfiles ];

//     for (const model of modelsToSync) {
//       await model.sync({ force: true });
//     }

//     // Use force: false for the 'cities' model
//     await City.sync({ force: false });

//     console.log('Tables synchronized successfully');
//   } catch (error) {
//     console.error('Error synchronizing tables:', error);
//   }
// }

// Call the function to synchronize tables

// async function creerTable() {
//   try {
//     // Define the new column
//     const newColumnDefinition = {
//       role: {
//         type: DataTypes.ENUM("provider", "consumer", "admin"),
//         defaultValue: "provider",
//         allowNull: false,
//       },
//     };

//     // Get the Sequelize Query Interface
//     const queryInterface = sq.getQueryInterface();

//     // Execute a CHANGE query to add the new column to the 'users' table
//     await queryInterface.sequelize.query(`
//       ALTER TABLE users
//       ADD COLUMN IF NOT EXISTS role ENUM('provider', 'consumer', 'admin') DEFAULT 'provider' NOT NULL;
//     `);

//     console.log("Tables created/updated successfully");
//   } catch (err) {
//     console.error("Error creating/updating tables:", err);
//   }
// }

export default creerTable;
