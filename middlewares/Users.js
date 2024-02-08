// users middleware

import ProviderProfileProgress from "../models/entity/provider_profile_progress.js";
import ProviderProfiles from "../models/entity/provider_profiles.js";
import User from "../models/entity/users.js";

export function checkIsOTPTrue(req, res, next) {
  try {
    if (req.session.isotp !== "true") {
      return res.status(400).json({
        success: false,
        message: "Please confirm the OTP request first.",
      });
    }

    next();
  } catch (error) {
    console.error("Error in checkIsOTPTrue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function checkIsProfileCompleted(req, res, next) {
  try {
    const { userId } = req;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Error accessing information. Please log in.",
      });
    }

    const user = await User.findOne({
      where: { user_id: userId },
      include: [
        {
          model: ProviderProfiles,
          required: false,
          include: [
            {
              model: ProviderProfileProgress,
              required: false,
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Error occurred while accessing information. Login again.",
      });
    }

    const providerProfile = user.provider_profile;

    if (!providerProfile || !providerProfile.provider_id) {
      return res.status(401).json({
        success: false,
        message: "Please complete details in the profile section first.",
        status: "UserInfo",
      });
    }

    const providerProfileProgress = providerProfile.provider_profile_progress;

    if (
      !providerProfileProgress ||
      providerProfileProgress.status !== "complete"
    ) {
      return res.status(401).json({
        success: false,
        message: "Please complete the profile section first.",
        status: providerProfileProgress?.status || "Unknown",
      });
    }

    // return res.status(200).json({
    //   success: true,
    //   message: "Profile completion check successful.",
    // });
    next();
  } catch (error) {
    console.error("Error in checkIsProfileCompleted:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
