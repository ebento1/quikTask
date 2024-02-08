import ProviderCategory from "../../models/entity/provider_categories.js";
import ProviderProfileProgress from "../../models/entity/provider_profile_progress.js";
import { sq } from "../../config/db.js";
import ActivityLog from "../../models/entity/activity_log.js";
import ProviderCategoryLicence from "./provider_categories_liscense.js";
import ProviderProfiles from "../../models/entity/provider_profiles.js";
import User from "../../models/entity/users.js";

// const createProviderCategories = async (req, res) => {
//   const t = await sq.transaction(); // Start a transaction

//   try {
//     const provider_id = req.providerId;
//     const { category_ids } = req.body;
//     // Send a professional success response with a success message
//     res.status(201).json({
//       success: provider_id,
//       message: category_ids,
//     });

//     const existingProfile = await ProviderCategory.findOne({
//       where: { provider_id: provider_id },
//     });

//     if (existingProfile) {
//       // If a profile already exists, return an appropriate response
//       return res.status(400).json({
//         message: "Categories Details already exists for this user.",
//       });
//     }

//     // Create an array of objects with provider_id and each category_id
//     const providerCategoriesData = category_ids.map((category_id) => ({
//       provider_id,
//       category_id,
//     }));

//     // Create multiple ProviderCategory records
//     const newProviderCategories = await ProviderCategory.bulkCreate(
//       providerCategoriesData,
//       { transaction: t }
//     );

//     // Create entry in ProviderProfileProgress table with status "services"
//     await ProviderProfileProgress.update(
//       { status: "services" },
//       { where: { provider_id: provider_id }, transaction: t }
//     );

//     await ActivityLog.create({
//       user_id: req.userId, // Assuming user_id is stored in req.userId
//       table_name: "provider_categories",
//       row_changed_table: provider_id,
//       action: "create",
//       content: JSON.stringify({
//         provider_id,
//         category_ids,
//       }),
//     });

//     // Commit the transaction
//     await t.commit();

//     // Send a professional success response with a success message
//     res.status(201).json({
//       status: "services",
//       success: true,
//       message: "Provider categories added successfully.",
//     });
//   } catch (error) {
//     // Rollback the transaction in case of an error
//     // await t.rollback();

//     console.error(error);

//     // Send a professional error response with an error message
//     res.status(500).json({
//       success: false,
//       error: "Internal Server Error. Unable to add provider categories.",
//     });
//   }
// };

const createProviderCategories = async (req, res) => {
  const t = await sq.transaction(); // Start a transaction

  try {
    const provider_id = req.providerId;
    const { category_ids } = req.body;

    const existingProfile = await ProviderCategory.findOne({
      where: { provider_id: provider_id },
    });

    if (existingProfile) {
      // If a profile already exists, return an appropriate response
      return res.status(400).json({
        message: "Categories Details already exists for this user.",
      });
    }

    // Create an array of objects with provider_id and each category_id
    const providerCategoriesData = category_ids.map((category_id) => ({
      provider_id,
      category_id,
    }));

    // Create multiple ProviderCategory records
    const newProviderCategories = await ProviderCategory.bulkCreate(
      providerCategoriesData,
      { transaction: t }
    );

    // Create entry in ProviderProfileProgress table with status "services"
    await ProviderProfileProgress.update(
      { status: "services" },
      { where: { provider_id: provider_id }, transaction: t }
    );

    await ActivityLog.create({
      user_id: req.userId, // Assuming user_id is stored in req.userId
      table_name: "provider_categories",
      row_changed_table: provider_id,
      action: "create",
      content: JSON.stringify({
        provider_id,
        category_ids,
      }),
    });

    // Commit the transaction
    await t.commit();

    // Send a professional success response with a success message
    return res.status(201).json({
      status: "services",
      success: true,
      message: "Provider categories added successfully.",
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    // await t.rollback();

    console.error(error);

    // Send a professional error response with an error message
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to add provider categories.",
    });
  }
};

export const getCategoryData = async (req, res) => {
  try {
    const result = await ProviderCategory.findOne({
      where: {
        provider_id: req.providerId,
      },
      include: [
        {
          model: ProviderCategoryLicence,
          where: {
            category_id: category_id,
          },
        },
      ],
    });
    if (result) {
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

export const categoryWiseProvider = async (req, res) => {
  try {
    const categoryId = req.params.category_id; // Assuming the category ID is provided in the request parameters

    const providers = await ProviderProfiles.findAll({
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
          model: ProviderCategory,
          where: { category_id: categoryId, status: "active" }, // Filter by category and active status
          attributes: ["status"],
        },
      ],
    });

    res.status(200).json({ success: true, providers });
  } catch (error) {
    console.error("Error in categoryWiseProvider:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export { createProviderCategories };
