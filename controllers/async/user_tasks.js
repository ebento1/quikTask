import { UserBooking } from "../../models/entity/user_bookings.js";
import UserReviews from "../../models/entity/user_reviews.js";
import { ReportTask, TaskImages, UserTasks } from "../../models/entity/user_tasks.js";
import User from "../../models/entity/users.js";

export async function createTask(req, res) {
  try {
    const consumer_id = req.userId;

    // Extract task data from request body
    const {
      category_id,
      title,
      description,
      radius,
      address_id,
      start_time,
      date,
      budget,
      is_posted,
    } = req.body;

    // Access the image URLs from req.imageUrls
    const imageUrls = req.imageUrls;

    console.log("Image filenames:", imageUrls);

    // Create the task
    const createdTask = await UserTasks.create({
      consumer_id,
      category_id,
      title,
      description,
      radius,
      address_id,
      start_time,
      date,
      budget,
      is_posted,
      // ... (other task properties)
    });

    // If images are provided, associate them with the task
    if (imageUrls) {
      const imagePromises = imageUrls.map(async (img) => {
        await TaskImages.create({
          task_id: createdTask.task_id,
          image: img,
        });
      });
      await Promise.all(imagePromises);
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: createdTask.toJSON(),
    });
  } catch (error) {
    console.error(error);

    // Return error response
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to create task.",
    });
  }
}

export async function editTask(req, res) {
  try {
    const { task_id } = req.params;

    // Find the task by task_id
    const task = await UserTasks.findByPk(task_id, {
      include: [TaskImages], // Include associated images
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found.",
      });
    }

    // Return the task data for editing
    res.status(200).json({
      success: true,
      task: task.toJSON(),
    });
  } catch (error) {
    console.error(error);

    // Return error response
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to fetch task data for editing.",
    });
  }
}

export async function updateTask(req, res) {
  try {
    const { task_id } = req.params;

    // Find the task by task_id
    const existingTask = await UserTasks.findByPk(task_id, {
      include: [TaskImages], // Include associated images
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: "Task not found.",
      });
    }

    // Extract updated task data from request body
    const {
      category_id,
      title,
      description,
      radius,
      address_id,
      start_time,
      date,
      budget,
      is_posted,
    } = req.body;

    // Update task properties
    await existingTask.update({
      category_id,
      title,
      description,
      radius,
      address_id,
      start_time,
      date,
      budget,
      is_posted,
      // ... (other task properties)
    });

    // Update task images if images are provided in the request
    if (req.imageUrls) {
      // Remove existing images associated with the task
      await TaskImages.destroy({
        where: { task_id },
      });

      // Create new image records
      const imagePromises = req.imageUrls.map(async (img) => {
        await TaskImages.create({
          task_id,
          image: img,
        });
      });

      await Promise.all(imagePromises);
    }

    // Fetch the updated task data with associated images
    const updatedTask = await UserTasks.findByPk(task_id, {
      include: [TaskImages],
    });

    // Return success response with updated task data
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask.toJSON(),
    });
  } catch (error) {
    console.error(error);

    // Return error response
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to update task.",
    });
  }
}


export async function reportTask(req, res) {
  try {
    const consumer_id = req.userId;

    // Extract task data from request body
    const {
      task_id,
      booking_id,
      message,
    } = req.body;


    // Create the task
    const reportedTask = await ReportTask.create({
      task_id,
      booking_id,
      message,
    });


    // Return success response
    res.status(201).json({
      success: true,
      message: "Task reported successfully",
      task: reportedTask.toJSON(),
    });
  } catch (error) {
    console.error(error);

    // Return error response
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to report task.",
    });
  }
}

export async function editReportedTask(req, res) {
  try {
    const { id } = req.params;

    // Find the task by task_id
    const reporteTask = await ReportTask.findByPk(id, {
      include: [UserTasks],
      include: [UserBooking],
    });

    if (!reporteTask) {
      return res.status(404).json({
        success: false,
        error: "Reported task not found.",
      });
    }

    // Return the reporteTask data for editing
    res.status(200).json({
      success: true,
      reporteTask: reporteTask.toJSON(),
    });
  } catch (error) {
    console.error(error);

    // Return error response
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to fetch reporteTask data for editing.",
    });
  }
}

export async function updateTask(req, res) {
  try {
    const { id } = req.params;

    // Find the task by id
    const existingReportedTask = await ReportTask.findByPk(id, {
      include: [UserTasks], 
      include: [UserBooking], 
    });

    if (!existingReportedTask) {
      return res.status(404).json({
        success: false,
        error: "Reported task not found.",
      });
    }

    // Extract updated task data from request body
    const {
      task_id,
      booking_id,
      message,
    } = req.body;

    // Update task properties
    const updatedReportTask = await existingReportedTask.update({
      task_id,
      booking_id,
      message,
    });


    // Return success response with updated task data
    res.status(200).json({
      success: true,
      message: "Task report updated successfully",
      task: updatedReportTask.toJSON(),
    });
  } catch (error) {
    console.error(error);

    // Return error response
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to update the task report.",
    });
  }
}


export async function addUserReview(req, res) {
  try {
    const sender_id = req.userId;

    // Extract review data from request body
    const {
      task_id,
      receiver_id,
      rating,
      review_content,
    } = req.body;

    // Create the review
    const createdReview = await UserReviews.create({
      task_id,
      receiver_id,
      rating,
      review_content,
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: createdReview.toJSON(),
    });
  } catch (error) {
    console.error(error);
    // Return error response
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to add review.",
    });
  }
}

export async function editUserReview(req, res) {
  try {
    const { id } = req.params;

    // Find the review by id
    const userReview = await UserReviews.findByPk(id);

    if (!userReview) {
      return res.status(404).json({
        success: false,
        error: "User review not found.",
      });
    }

    // Return the user review data for editing
    res.status(200).json({
      success: true,
      userReview: userReview.toJSON(),
    });
  } catch (error) {
    console.error(error);
    // Return error response
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to fetch user review data for editing.",
    });
  }
}

export async function updateUserReview(req, res) {
  try {
    const { id } = req.params;

    // Find the review by id
    const existingUserReview = await UserReviews.findByPk(id);

    if (!existingUserReview) {
      return res.status(404).json({
        success: false,
        error: "User review not found.",
      });
    }

    // Extract updated user review data from request body
    const { rating, review_content } = req.body;

    // Update user review properties
    const updatedUserReview = await existingUserReview.update({
      rating,
      review_content,
    });

    // Return success response with updated review data
    res.status(200).json({
      success: true,
      message: "User review updated successfully",
      review: updatedUserReview.toJSON(),
    });
  } catch (error) {
    console.error(error);
    // Return error response
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to update the user review.",
    });
  }
}
