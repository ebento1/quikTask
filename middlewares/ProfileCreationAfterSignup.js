import ProviderProfileProgress from "../models/entity/provider_profile_progress.js";

export function checkAfterSignup(req, res, next) {
  if (req.isSignup !== "true") {
    return res.status(401).json({
      isSignup: false,
      message: "Access denied. Please log in to continue.",
    });
  }

  if (req.userId !== undefined) {
    // res.status(200).json({ message: "Signup successful. Welcome!" });
    next();
  } else {
    res
      .status(401)
      .json({ message: "Error accessing information. Please log in." });
  }
}

export function checkAfterCategory(req, res, next) {
  const providerId = req.providerId;

  if (providerId !== undefined) {
    ProviderProfileProgress.findOne({
      where: { provider_id: providerId },
    }).then((providerProfile) => {
      if (providerProfile && providerProfile.status === "profile") {
        next();
      } else if (providerProfile && providerProfile.status === "services") {
        return res.status(401).json({
          status: providerProfile.status,
          message: "Services details are completed .",
        });
      } else {
        return res.status(401).json({
          status: providerProfile.status,
          data: providerId,
          message: "Please complete the profile section details first.",
        });
      }
    });
  } else {
    return res.status(401).json({
      providerId: req.providerId,
      message: "Error accessing information. Please log in.",
    });
  }
}

export function checkAfterCategoryLicense(req, res, next) {
  const providerId = req.providerId;

  if (providerId !== undefined) {
    ProviderProfileProgress.findOne({
      where: { provider_id: providerId },
    }).then((providerProfile) => {
      if (
        providerProfile &&
        (providerProfile.status === "documents" ||
          providerProfile.status === "services")
      ) {
        // res.status(200).json({ message: "Services section completed." });
        next();
      } else {
        return res.status(401).json({
          status: providerProfile.status,
          message: "Please complete the services section details first.",
        });
      }
    });
  } else {
    res
      .status(401)
      .json({ message: "Error accessing information. Please log in." });
  }
}

export function checkAfterWorkingHours(req, res, next) {
  const providerId = req.providerId;

  if (providerId !== undefined) {
    ProviderProfileProgress.findOne({
      where: { provider_id: providerId },
    }).then((providerProfile) => {
      if (providerProfile && providerProfile.status === "documents") {
        // res.status(200).json({ message: "License details completed." });
        next();
      } else if (providerProfile && providerProfile.status === "completed") {
        return res.status(401).json({
          status: providerProfile.status,
          message: "Profile is completed",
        });
      } else {
        return res.status(401).json({
          status: providerProfile.status,
          message: "Please complete the License Details section details first.",
        });
      }
    });
  } else {
    res
      .status(401)
      .json({ message: "Error accessing information. Please log in." });
  }
}
