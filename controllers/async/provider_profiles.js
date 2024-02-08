import ProviderProfile from "../../models/entity/provider_profiles.js";
import ProviderCity from "../../models/entity/provider_cities.js";
import Address from "../../models/entity/user_addresses.js";
import ProviderWorkArea from "../../models/entity/provider_working_areas.js";
import ProviderProfileProgress from "../../models/entity/provider_profile_progress.js";
import { sq } from "../../config/db.js";
import ProviderWorkingHours from "../../models/entity/provider_working_hours.js";
import ProviderCategory from "../../models/entity/provider_categories.js";
import ProviderCategoryLicence from "../../models/entity/provider_categories_liscense.js";
import User from "../../models/entity/users.js";
import City from "../../models/entity/cities.js";
import Category from "../../models/entity/categories.js";
import ActivityLog from "../../models/entity/activity_log.js";
// import ProfileResponse from "../../models/entity/profile_response.js";

export async function createProfile(req, res) {
  const t = await sq.transaction(); // Start a transaction

  try {
    const { buisness_name, sleep_mode, description, cities, addresses } =
      req.body;

    const existingProfile = await ProviderProfile.findOne({
      where: { user_id: req.userId },
    });

    if (existingProfile) {
      // If a profile already exists, return an appropriate response
      return res.status(400).json({
        message: "Profile already exists for this user.",
      });
    }

    const providerProfile = await ProviderProfile.create(
      { user_id: req.userId, buisness_name, sleep_mode, description },
      { transaction: t }
    );

    const providerId = providerProfile.provider_id;

    // Create addresses and associate with the profile
    const addressPromises = addresses.map(async (addressData) => {
      const createdAddress = await Address.create(
        { provider_id: providerProfile.provider_id, ...addressData },
        { transaction: t }
      );
      return createdAddress;
    });

    const createdAddresses = await Promise.all(addressPromises);

    // Create cities, areas of work, and associate with the profile
    const cityPromises = cities.map(async (cityData) => {
      const providerCity = await ProviderCity.create(
        {
          provider_id: providerProfile.provider_id,
          city_id: cityData.city_id,
        },
        { transaction: t }
      );

      // Create and associate multiple areas of work for each city
      const areaOfWorkPromises = cityData.area_of_work.map(
        async (areaOfWorkData) => {
          const createdAreaOfWork = await ProviderWorkArea.create(
            {
              city_id: providerCity.provider_city_id,
              ...areaOfWorkData,
            },
            { transaction: t }
          );
          return createdAreaOfWork;
        }
      );

      const createdAreaOfWorks = await Promise.all(areaOfWorkPromises);

      return { providerCity, area_of_works: createdAreaOfWorks };
    });

    // Wait for all city-related operations to complete
    const cityResults = await Promise.all(cityPromises);

    // Create entry in ProviderProfileProgress table with status "services"
    await ProviderProfileProgress.create(
      { provider_id: providerProfile.provider_id, status: "profile" },
      { transaction: t }
    );

    await ActivityLog.create({
      user_id: req.userId, // Assuming user_id is stored in req.userId
      table_name: "provider_profiles",
      row_changed_table: providerProfile.provider_id,
      action: "create",
      content: JSON.stringify({
        provider_profile: providerProfile.toJSON(),
        addresses: createdAddresses.map((addr) => addr.toJSON()),
        cities: cityResults.map((result) => ({
          provider_city: result.providerCity.toJSON(),
          area_of_works: result.area_of_works.map((area) => area.toJSON()),
        })),
        status: "profile",
      }),
    });

    // Commit the transaction
    await t.commit();

    // Return success response
    return res.status(201).json({
      status: "profile",
      message: "Profile created successfully",
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    // await t.rollback();

    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getAllProviderProfiles(req, res) {
  try {
    const providers = await ProviderProfile.findAll({
      include: [
        {
          model: User,
          attributes: [
            "user_id",
            "first_name",
            "last_name",
            "email",
            "contact_number",
          ],
        },
        {
          model: ProviderCity,
          attributes: ["city_id"],
          include: [
            {
              model: City,
              attributes: ["city"],
            },
            {
              model: ProviderWorkArea,
              attributes: ["long_value", "lat_value", "radius"],
            },
          ],
        },
        {
          model: ProviderWorkingHours,
          attributes: ["day", "opening_hours", "closing_hours"],
        },
        {
          model: ProviderCategory,
          attributes: ["category_id"],
          include: [
            {
              model: ProviderCategoryLicence,
              attributes: [
                "licence_id",
                "category_id",
                "liscense_number",
                "address",
                "first_name",
                "last_name",
                "licence_img_front",
                "licence_img_back",
                "issued_date",
                "expiry_date",
              ],
            },
          ],
        },
        {
          model: ProviderProfileProgress,
          attributes: ["status"],
        },
      ],
    });

    // Return success response
    return res.status(200).json({
      message: "Providers retrieved successfully",
      providers,
    });
  } catch (error) {
    console.error("Error in getAllProviderProfiles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getProviderProfileByUserId(req, res) {
  try {
    const userId = req.params.userId; // Assuming the user_id is passed as a parameter

    const provider = await ProviderProfile.findOne({
      where: { user_id: userId },
      include: [
        {
          model: User,
          attributes: [
            "user_id",
            "first_name",
            "last_name",
            "email",
            "contact_number",
          ],
        },
        {
          model: ProviderCity,
          attributes: ["city_id"],
          include: [
            {
              model: City,
              attributes: ["city"],
            },
            {
              model: ProviderWorkArea,
              attributes: ["long_value", "lat_value", "radius"],
            },
          ],
        },
        {
          model: ProviderWorkingHours,
          attributes: ["day", "opening_hours", "closing_hours"],
        },
        {
          model: ProviderCategory,
          attributes: ["category_id"],
          include: [
            {
              model: ProviderCategoryLicence,
              attributes: [
                "licence_id",
                "category_id",
                "liscense_number",
                "address",
                "first_name",
                "last_name",
                "licence_img_front",
                "licence_img_back",
                "issued_date",
                "expiry_date",
              ],
            },
          ],
        },
        {
          model: ProviderProfileProgress,
          attributes: ["status"],
        },
      ],
    });

    // Return success response
    if (provider) {
      return res.status(200).json({
        message: "Provider profile retrieved successfully",
        provider,
      });
    } else {
      return res.status(404).json({ message: "Provider not found" });
    }
  } catch (error) {
    console.error("Error in getProviderProfileByUserId:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const hasLicenseCategory = async (req, res) => {
  try {
    const result = await ProviderCategory.findAll({
      where: {
        provider_id: req.providerId,
      },
      include: [
        {
          model: Category,
          where: {
            is_license: true,
          },
        },
        {
          model: ProviderCategoryLicence,
          attributes: ["licence_id", "category_id", "liscense_number"],
        },
      ],
    });
    if (result) {
      //
      return res.status(201).json({
        data: result,
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const addResponse = async (req, res) => {
//   try {
//     // Authenticate the user and obtain user_id from the token
//     authenticateUser(req, res, async () => {
//       const userId = req.session.userId; // Assuming the user_id is stored in the session

//       // Extract provider_id and reason from request body
//       const { provider_id, liscense_id, reason } = req.body;

//       // Get information about the provider using the provided provider_id
//       const provider = await ProviderProfile.findOne({
//         where: { user_id: userId },
//         include: [
//           {
//             model: User,
//             attributes: [
//               "user_id",
//               "first_name",
//               "last_name",
//               "email",
//               "contact_number",
//             ],
//           },
//           {
//             model: ProviderCity,
//             attributes: ["city_id"],
//             include: [
//               {
//                 model: City,
//                 attributes: ["city"],
//               },
//               {
//                 model: ProviderWorkArea,
//                 attributes: ["long_value", "lat_value", "radius"],
//               },
//             ],
//           },
//           {
//             model: ProviderWorkingHours,
//             attributes: ["day", "opening_hours", "closing_hours"],
//           },
//           {
//             model: ProviderCategory,
//             attributes: ["category_id"],
//             include: [
//               {
//                 model: ProviderCategoryLicence,
//                 attributes: [
//                   "licence_id",
//                   "category_id",
//                   "liscense_number",
//                   "address",
//                   "first_name",
//                   "last_name",
//                   "licence_img_front",
//                   "licence_img_back",
//                   "issued_date",
//                   "expiry_date",
//                 ],
//               },
//             ],
//           },
//           {
//             model: ProviderProfileProgress,
//             attributes: ["status"],
//           },
//         ],
//       });

//       if (!provider) {
//         return res.status(404).json({ error: "Provider not found" });
//       }

//       // Create content object with provider information
//       const content = {
//         provider: {
//           user_id: provider.user_id,
//           first_name: provider.User.first_name,
//           last_name: provider.User.last_name,
//           email: provider.User.email,
//           contact_number: provider.User.contact_number,
//           // Add other provider information as needed
//         },
//       };

//       // Save the response to the "profile_response" table
//       await ProfileResponse.create({
//         user_id: userId,
//         provider_id: provider_id,
//         reason: reason,
//         content: JSON.stringify(content), // Convert content to JSON string
//       });

//       res.status(201).json({ message: "Response added successfully" });
//     });
//   } catch (error) {
//     console.error("Error adding response:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
