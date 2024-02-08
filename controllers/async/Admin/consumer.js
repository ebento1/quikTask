import ConsumerAddresses from "../../../models/entity/consumer_addresses";
import UserReviews from "../../../models/entity/user_reviews";
import { ReportTask, UserTasks } from "../../../models/entity/user_tasks";
import User from "../../../models/entity/users";

export const getAllConsumer = async (req, res) => {
  try {
    // Fetch all users with the role of "consumer"
    const consumers = await User.findAll({
      where: { role: "consumer" },
      include: [
        {
          model: UserTasks,
          as: "tasks", // Alias for UserTasks association
          attributes: ["task_id", "title", "description", "status", "budget"], // Include specific task attributes
        },
        {
          model: ConsumerAddresses,
          as: "locations", // Alias for UserLocations association
          attributes: ["location_id", "latitude", "longitude", "address"], // Include specific location attributes
        },
        {
          model: ReportTask,
          as: "reportedIssues", // Alias for ReportTask association
          attributes: ["id", "message", "creation_date"], // Include specific reported issue attributes
        },
        {
          model: UserReviews,
          as: "reviews", // Alias for UserReviews association
          attributes: ["id", "rating", "review_content", "creation_date"], // Include specific review attributes
        },
      ],
    });

    // Return success response with the retrieved data
    res.status(200).json({
      success: true,
      message: "All consumer data retrieved successfully",
      consumers,
    });
  } catch (error) {
    console.error(error);
    // Return error response
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to fetch consumer data.",
    });
  }
};
