import User from "../models/entity/users.js";

export const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { user_id: req.userId },
    });

    if (!user) {
      res
        .status(401)
        .json({ message: "Authentication failed, user not found." });
    }

    if (user.role == "admin") {
      next();
    } else {
      res
        .status(401)
        .json({ message: "Authentication failed, user not allowed." });
    }
  } catch (error) {
    console.error("Error in checking role for admin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const checkProvider = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { user_id: req.userId },
    });

    if (!user) {
      res
        .status(401)
        .json({ message: "Authentication failed, user not found." });
    }

    if (user.role == "provider") {
      next();
    } else {
      res
        .status(401)
        .json({ message: "Authentication failed, user not allowed." });
    }
  } catch (error) {
    console.error("Error in checking role for user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const checkConsumer = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { user_id: req.userId },
    });

    if (!user) {
      res
        .status(401)
        .json({ message: "Authentication failed, user not found." });
    }

    if (user.role == "consumer") {
      next();
    } else {
      res
        .status(401)
        .json({ message: "Authentication failed, user not allowed." });
    }
  } catch (error) {
    console.error("Error in checking role for consumer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
