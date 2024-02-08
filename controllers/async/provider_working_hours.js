// Import the ProviderWorkingHours model
import ProviderWorkingHours from "../../models/entity/provider_working_hours.js";
import ProviderProfileProgress from "../../models/entity/provider_profile_progress.js";
import { sq } from "../../config/db.js";
import ActivityLog from "../../models/entity/activity_log.js";

const createWorkingHours = async (req, res) => {
  const t = await sq.transaction(); // Start a transaction

  try {
    const provider_id = req.providerId;
    const { working_hours } = req.body;
    console.log(req.body);
    const existingProfile = await ProviderWorkingHours.findOne({
      where: { provider_id: provider_id },
    });

    if (existingProfile) {
      // If a profile already exists, return an appropriate response
      return res.status(400).json({
        message: "Working Hours Details already exists for this user.",
      });
    }

    // Create an array to store the results of the working hour creation
    const createdWorkingHours = [];

    // Iterate through each working hour and create it
    for (const hourData of working_hours) {
      const createdHour = await ProviderWorkingHours.create(
        { provider_id, ...hourData },
        { transaction: t }
      );
      createdWorkingHours.push(createdHour);
    }

    await ProviderProfileProgress.update(
      { status: "completed" }, // Specify the fields to update
      { where: { provider_id: provider_id } } // Specify the condition for the update
    );

    await ActivityLog.create({
      user_id: req.userId, // Assuming user_id is stored in req.userId
      table_name: "provider_working_hours",
      row_changed_table: req.providerId,
      action: "create",
      content: JSON.stringify({
        working_hours: createdWorkingHours.map((hour) => hour.toJSON()),
      }),
    });

    // Commit the transaction
    await t.commit();

    // Return a success response
    return res.status(201).json({
      status: "completed",
      message: "Working hours created successfully",
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    await t.rollback();

    console.error(error);
    // Return an error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { createWorkingHours };
