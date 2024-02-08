// Import the ProfileResponse model
import ActivityLog from "../../../models/entity/activity_log.js";
import ProfileResponse from "../../../models/entity/profile_responses.js";

// Import the ProviderCategory model
import ProviderCategory from "../../../models/entity/provider_categories.js";
import ProviderCategoryLicence from "../../../models/entity/provider_categories_liscense.js";
import ProviderProfiles from "../../../models/entity/provider_profiles.js";

export const rejectResponse = async (req, res) => {
  try {
    const { provider_id, category_id, reason } = req.body;
    const user_id = req.userId;

    const category_details = await ProviderCategory.findOne({
      where: {
        provider_id: provider_id,
        category_id: category_id,
      },
      include: [
        {
          model: ProviderCategoryLicence,
          attributes: ["category_id"], // Add other attributes as needed
        },
      ],
    });
    const response = await ProfileResponse.create({
      user_id,
      provider_id,
      category_id,
      reason,
      category_details,
    });

    // Search for the provider_id in ProviderCategory table and update the status to "rejected"
    await ProviderCategory.update(
      { status: "rejected" },
      {
        where: {
          provider_id: provider_id,
          category_id: category_id,
        },
      }
    );

    const updatedCategoryDetails = await ProviderCategory.findOne({
      where: {
        provider_id: provider_id,
        category_id: category_id,
      },
      include: [
        {
          model: ProviderCategoryLicence,
          attributes: ["category_id"], // Add other attributes as needed
        },
      ],
    });

    await ActivityLog.create({
      user_id: req.userId,
      table_name: "profile_responses",
      row_changed_table: response.id,
      action: "create",
      content: {
        provider_id,
        category_id,
        Response_details: response.toJSON(), // Add other attributes as needed
        category_details: updatedCategoryDetails.toJSON(), // Add other attributes as needed
      },
    });
    // Send a success response
    res.status(201).json({
      success: true,
      message: "Response added successfully.",
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to add response.",
    });
  }
};

export const acceptResponse = async (req, res) => {
  try {
    const { provider_id, category_id } = req.body;
    const user_id = req.userId;

    // Search for the provider_id in ProviderCategory table and update the status to "rejected"
    await ProviderCategory.update(
      { status: "active" },
      {
        where: {
          provider_id: provider_id,
          category_id: category_id,
        },
      }
    );

    const categoryDetails = await ProviderCategory.findOne({
      where: {
        provider_id: provider_id,
        category_id: category_id,
      },
      include: [
        {
          model: ProviderCategoryLicence,
          attributes: ["category_id"], // Add other attributes as needed
        },
      ],
    });

    const providerCategories = await ProviderCategory.findAll({
      where: {
        provider_id: provider_id,
      },
    });

    // Check if all provider categories have status "active"
    const allCategoriesActive = providerCategories.every(
      (category) => category.status === "active"
    );
    let prviderProfie;
    // If all categories are active, update the provider profile status to "active"
    if (allCategoriesActive) {
      prviderProfie = await ProviderProfiles.update(
        { status: "active" },
        {
          where: { provider_id: provider_id },
        }
      );
    }

    await ActivityLog.create({
      user_id: req.userId,
      table_name: "provider_categories",
      row_changed_table: category_id,
      action: "create",
      content: {
        provider_id,
        category_id,
        category_details: categoryDetails.toJSON(),
        profile_details: prviderProfie.toJSON(),
        // Add other attributes as needed
      },
    });
    // Send a success response
    res.status(201).json({
      success: true,
      message: "Response added successfully.",
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to add response.",
    });
  }
};
