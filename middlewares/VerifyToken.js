import User from "../models/entity/users.js";
import ProviderProfile from "../models/entity/provider_profiles.js";
import jwt from "jsonwebtoken";

const authenticateUser = async (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, "QuicTaskTokens", function (err, decode) {
      if (err) {
        handleAuthenticationError(req, res);
      } else {
        findUserById(decode.userId, req, res, next);
      }
    });
  } else {
    handleAuthenticationError(req, res);
  }
};

const handleAuthenticationError = (req, res) => {
  req.user = undefined;
  return res
    .status(401)
    .json({ message: "Authentication failed, please sign in again." });
};

const findUserById = async (userId, req, res, next) => {
  try {
    const user = await User.findOne({
      where: { user_id: userId },
    });

    if (user.status == "blocked") {
      res.status(401).json({ message: "Your account has beed" });
    }

    if (!user) {
      res
        .status(401)
        .json({ message: "Authentication failed, user not found." });
    } else {
      req.user = user;
      req.userId = user.user_id; // Update with the correct field from your model

      const existingProfile = await ProviderProfile.findOne({
        where: { user_id: req.userId },
      });
      let id = existingProfile;
      if (existingProfile) {
        console.log("when come after profile");
        req.providerId = id.provider_id;
        next();
      } else {
        console.log("when come after signup");
        next();
      }
      // sendAuthenticationSuccess(req, res);
    }
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendAuthenticationSuccess = (req, res) => {
  return res.status(200).json({
    userData: req.user,
    ID: req.session.userId,
    USERiD: req.userId,
    message: "Authentication successful.",
  });
};

export { authenticateUser };
