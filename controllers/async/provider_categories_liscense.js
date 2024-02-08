import ProviderProfileProgress from "../../models/entity/provider_profile_progress.js";
import ProviderCategoryLicence from "../../models/entity/provider_categories_liscense.js";
import { logActivity } from "./activity_log.js";
import ProviderProfiles from "../../models/entity/provider_profiles.js";
import DrivingLicence from "../../models/entity/driving_liscense.js";

// Controller to handle license details addition
export const addLicenseDetails = async (req, res) => {
  try {
    const {
      category_id,
      liscense_number,
      address,
      first_name,
      last_name,
      issued_date,
      expiry_date,
      d_of_birth,
    } = req.body;

    // Assuming 'licence_img_front' and 'licence_img_back' are file fields in your form
    const licence_img_front = "http://178.128.207.34/images/" + req.imgsrcFront;
    const licence_img_back = "http://178.128.207.34/images/" + req.imgsrcBack;

    // Create a new record in the ProviderCategoryLicence table
    const newLicenseDetails = await ProviderCategoryLicence.create({
      category_id,
      liscense_number,
      address,
      first_name,
      last_name,
      licence_img_front,
      licence_img_back,
      issued_date,
      expiry_date,
      d_of_birth,
    });

    // Update the status in ProviderProfileProgress to "documents"
    await ProviderProfileProgress.update(
      { status: "documents" },
      { where: { provider_id: req.providerId } }
    );

    await ProviderProfiles.update(
      { status: "waiting" },
      {
        where: { provider_id: req.providerId },
      }
    );

    logActivity(
      req.userId,
      "provider_categories_liscense",
      newLicenseDetails.licence_id,
      "create",
      {
        category_id: newLicenseDetails.category_id,
        liscense_number: newLicenseDetails.liscense_number,
        address: newLicenseDetails.address,
        first_name: newLicenseDetails.first_name,
        last_name: newLicenseDetails.last_name,
        licence_img_front: newLicenseDetails.licence_img_front,
        licence_img_back: newLicenseDetails.licence_img_back,
        issued_date: newLicenseDetails.issued_date,
        expiry_date: newLicenseDetails.expiry_date,
        d_of_birth: newLicenseDetails.d_of_birth,
        creation_date: newLicenseDetails.creation_date,
        last_modified_date: newLicenseDetails.last_modified_date,
      }
    );

    // Respond with success message
    return res.status(201).json({
      status: "documents",
      success: true,
      message: "License details added successfully",
      data: newLicenseDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to add license details.",
    });
  }
};

export const addDrivingLicenseDetails = async (req, res) => {
  try {
    const user_id = req.userId;
    const {
      liscense_number,
      address,
      first_name,
      last_name,
      issued_date,
      expiry_date,
      d_of_birth,
    } = req.body;

    // Assuming 'licence_img_front' and 'licence_img_back' are file fields in your form
    const licence_img_front = "http://178.128.207.34/images/" + req.imgsrcFront;
    const licence_img_back = "http://178.128.207.34/images/" + req.imgsrcBack;

    // Create a new record in the ProviderCategoryLicence table
    const drivingLicenseDetails = await DrivingLicence.create({
      user_id,
      liscense_number,
      address,
      first_name,
      last_name,
      licence_img_front,
      licence_img_back,
      issued_date,
      expiry_date,
      d_of_birth,
    });

    // Update the status in ProviderProfileProgress to "documents"
    await ProviderProfileProgress.update(
      { status: "documents" },
      { where: { provider_id: req.providerId } }
    );

    await ProviderProfiles.update(
      { status: "waiting" },
      {
        where: { provider_id: req.providerId },
      }
    );

    logActivity(
      req.userId,
      "provider_categories_liscense",
      drivingLicenseDetails.id,
      "create",
      {
        user_id: drivingLicenseDetails.user_id,
        liscense_number: drivingLicenseDetails.liscense_number,
        address: drivingLicenseDetails.address,
        first_name: drivingLicenseDetails.first_name,
        last_name: drivingLicenseDetails.last_name,
        licence_img_front: drivingLicenseDetails.licence_img_front,
        licence_img_back: drivingLicenseDetails.licence_img_back,
        issued_date: drivingLicenseDetails.issued_date,
        expiry_date: drivingLicenseDetails.expiry_date,
        d_of_birth: drivingLicenseDetails.d_of_birth,
        creation_date: drivingLicenseDetails.creation_date,
        last_modified_date: drivingLicenseDetails.last_modified_date,
      }
    );

    // Respond with success message
    return res.status(201).json({
      status: "documents",
      success: true,
      message: "Driving license details added successfully",
      data: drivingLicenseDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to add driving license details.",
    });
  }
};

// Controller to handle license details update
export const updateLicenseDetails = async (req, res) => {
  try {
    const {
      licence_id,
      category_id,
      liscense_number,
      address,
      first_name,
      last_name,
      issued_date,
      expiry_date,
      d_of_birth,
    } = req.body;

    // Assuming 'licence_img_front' and 'licence_img_back' are file fields in your form
    const licence_img_front =
      "http://178.128.207.34/public/images/" + req.imgsrcFront;
    const licence_img_back =
      "http://178.128.207.34/public/images/" + req.imgsrcBack;

    // Find the existing license details
    const existingLicenseDetails = await ProviderCategoryLicence.findByPk(
      licence_id
    );

    if (!existingLicenseDetails) {
      return res.status(404).json({
        success: false,
        error: "License details not found.",
      });
    }

    // Update the license details
    await existingLicenseDetails.update({
      category_id,
      liscense_number,
      address,
      first_name,
      last_name,
      licence_img_front,
      licence_img_back,
      issued_date,
      expiry_date,
      d_of_birth,
    });

    logActivity(
      req.userId,
      "provider_categories_liscense",
      existingLicenseDetails.licence_id,
      "update",
      {
        category_id,
        liscense_number,
        address,
        first_name,
        last_name,
        licence_img_front,
        licence_img_back,
        issued_date,
        expiry_date,
        d_of_birth,
        last_modified_date: existingLicenseDetails.last_modified_date,
      }
    );

    // Respond with success message
    return res.status(200).json({
      success: true,
      message: "License details updated successfully",
      data: existingLicenseDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to update license details.",
    });
  }
};

export default ProviderCategoryLicence;
