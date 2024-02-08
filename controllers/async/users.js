// controllers/userController.js
import User from "../../models/entity/users.js";
import ProviderProfileProgress from "../../models/entity/provider_profile_progress.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ProviderProfile from "../../models/entity/provider_profiles.js";
import ProviderWorkingHours from "../../models/entity/provider_working_hours.js";
import ProviderCategory from "../../models/entity/provider_categories.js";
import ProviderCategoryLicence from "../../models/entity/provider_categories_liscense.js";
import City from "../../models/entity/cities.js";
import ProviderCity from "../../models/entity/provider_cities.js";
import ProviderWorkArea from "../../models/entity/provider_working_areas.js";
import { logActivity } from "./activity_log.js";
import { addCity } from "./frontend_assests.js";
import DrivingLicence from "../../models/entity/driving_liscense.js";

const createUser = (req, res) => {
  const role = req.body.role;

  User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    confirm_password: bcrypt.hashSync(req.body.confirm_password, 8),
    contact_number: req.body.contact_number,
    TC: req.body.TC,
    PP: req.body.PP,
    role: role,
  })

    .then((user) => {
      const token = jwt.sign({ userId: user.user_id }, "QuicTaskTokens", {
        // expiresIn: '1h',
      });

      logActivity(user.user_id, "users", user.user_id, "create", {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
        confirm_password: user.confirm_password,
        contact_number: user.contact_number,
        TC: user.TC,
        PP: user.PP,
        creation_date: user.creation_date,
        last_modified_date: user.last_modified_date,
      });
      addCity();
      return res.status(201).json({
        // user: req.session.userId,
        message: "User created successfully",
        token: token,
      });
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      res
        .status(500)
        .json({ error: "An error occurred when creating the user profile" });
    });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (req.userId) {
      return res.status(400).json({ message: "User is already logged in" });
    }

    // Proceed with regular login logic
    // const userData = await User.findOne({ email });
    const user = await User.findOne({
      where: {
        email: email, // Assuming 'email' is the variable containing the email value
      },
    });
    // return res.status(401).json({ user: userData });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = jwt.sign({ userId: user.user_id }, "QuicTaskTokens", {
        // expiresIn: '1h',
      });

      const provider = await ProviderProfile.findOne({
        where: { user_id: user.user_id },
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
            include: [
              {
                model: DrivingLicence,
                attributes: [
                  "id",
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
            attributes: ["id", "category_id"],
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

      const providerProfile = await ProviderProfile.findOne({
        where: {
          user_id: user.user_id, // Assuming 'email' is the variable containing the email value
        },
      });

      if (user.role != "provider") {
        return res.status(200).json({
          message: "Login successful",
          accessToken: token,
          userData: user,
        });
      }

      if (providerProfile) {
        const providerProfileProgress = await ProviderProfileProgress.findOne({
          where: {
            provider_id: providerProfile.provider_id, // Assuming 'email' is the variable containing the email value
          },
        });

        if (provider.status == "active") {
          return res.status(200).json({
            message: "Login successful",
            accessToken: token,
            userData: user,
            profileData: provider,
            status: "active",
          });
        }

        return res.status(200).json({
          message: "Login successful",
          accessToken: token,
          userData: user,
          profileData: provider,
          status: providerProfileProgress.status,
        });
      } else {
        return res.status(200).json({
          message: "Login successful",
          accessToken: token,
          userData: user,
          profileData: provider,
          status: "signUp",
        });
      }
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const findOneUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.first_name + " " + user.last_name,
      },
    });
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming you have middleware setting req.user

    // Add the user's token to the blacklist

    req.session.otp = undefined;
    req.session.isotp = undefined;
    req.session.providerId = undefined;
    req.session.userId = undefined;
    req.session.isSignup = "false";

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal Error" });
  }
};

export const createAdminUser = async (req, res) => {
  try {
    const adminUserData = {
      first_name: "Admin",
      last_name: "User",
      email: "admin@example.com",
      password: "adminpassword", // Replace with the actual password
      confirm_password: "adminpassword", // Replace with the actual password
      contact_number: "1234567890",
      TC: true,
      PP: true,
      role: "admin",
    };

    // Hash the password before storing it in the database
    const hashedPassword = bcrypt.hashSync(adminUserData.password, 10); // Use a salt value, e.g., 10

    // Replace the plain password with the hashed password in the user data
    adminUserData.password = hashedPassword;

    // Create the admin user in the database
    const adminUser = await User.create(adminUserData);

    return res.status(201).json({
      success: true,
      message: "Admin user created successfully.",
      user: adminUser.toJSON(),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to create admin user.",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;

    // Check if newPassword is defined
    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    // Check if the passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if the user exists
    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's password
    user.password = bcrypt.hashSync(newPassword, 8);
    await user.save();

    // You can log the activity or perform additional actions if needed

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { createUser, loginUser, logoutUser, findOneUser };
