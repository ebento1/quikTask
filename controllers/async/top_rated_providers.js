import UserReviews from "../../models/entity/user_reviews.js"; // Adjust the path based on your project structure
import { sq } from "../../config/db.js"; // Adjust the path based on your project structure
import User from "../../models/entity/users.js";

// Function to get the top-rated providers
export const getTopRatedProviders = async (req, res) => {
  try {
    // const topRatedUsers = await User.findAll({
    //   attributes: ["user_id", "first_name", "last_name", "email"],
    //   include: [
    //     {
    //       model: UserReviews,
    //       as: "user_reviews",
    //       attributes: [[sq.fn("AVG", sq.col("rating")), "average_rating"]],
    //     },
    //   ],
    //   group: ["users.user_id"],
    //   order: [[sq.literal("average_rating"), "DESC"]],
    //   limit: 5,
    // });

    // // Extract only the necessary user information and average rating
    // const formattedTopRatedUsers = topRatedUsers.map((user) => ({
    //   user_id: user.user_id,
    //   first_name: user.first_name,
    //   last_name: user.last_name,
    //   email: user.email,
    //   average_rating:
    //     user.user_reviews.length > 0
    //       ? user.user_reviews[0].dataValues.average_rating
    //       : null,
    // }));

    const userId = 1; // Replace with the desired user_id

    const userAverageRating = await UserReviews.findOne({
      attributes: [[sq.fn("AVG", sq.col("rating")), "average_rating"]],
      where: {
        reciever_id: userId,
      },
    });

    console.log(userAverageRating.average_rating);

    // // Return the formatted data
    // return res
    //   .status(200)
    //   .json({ success: true, data: formattedTopRatedUsers });
  } catch (error) {
    console.error("Error in getTopRatedUsers:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
