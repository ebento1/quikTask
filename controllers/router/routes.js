import express from "express";
import multer from "multer";
import path from "path";

//controllers
import {
  createUser,
  loginUser,
  findOneUser,
  logoutUser,
  createAdminUser,
  resetPassword,
} from "../async/users.js";
import {
  categoryWiseProvider,
  createProviderCategories,
  getCategoryData,
} from "../async/provider_categories.js";
import { createWorkingHours } from "../async/provider_working_hours.js";
import {
  getAllCities,
  getAllCategories,
  addCategory,
  addCity,
} from "../async/frontend_assests.js";
import {
  createProfile,
  getAllProviderProfiles,
  getProviderProfileByUserId,
  hasLicenseCategory,
} from "../async/provider_profiles.js";
import {
  addDrivingLicenseDetails,
  addLicenseDetails,
  updateLicenseDetails,
} from "../async/provider_categories_liscense.js";

//middlewares
import { checkIsOTPTrue } from "../../middlewares/Users.js";
import {
  checkAfterSignup,
  checkAfterCategory,
  checkAfterWorkingHours,
  checkAfterCategoryLicense,
} from "../../middlewares/ProfileCreationAfterSignup.js";
import { sendOtp, checkOtp } from "../SendOtp.js";

//validations
import {
  validateUser,
  LoginValidations,
  validateUserConsumer,
} from "../../validations/users.js";
import { validateEmail } from "../../validations/EmailValidations.js";
import {
  validateBusinessProfile,
  validateWorkingHours,
  validateProviderCategories,
  validateProviderCategoryLicence,
  validateProviderDrivingLicence,
} from "../../validations/ProfileValidation.js";

import { authenticateUser } from "../../middlewares/VerifyToken.js";
import { checkAdmin, checkProvider } from "../../middlewares/ForAdmin.js";
import {
  acceptResponse,
  rejectResponse,
} from "../async/Admin/profile_response.js";
import { log } from "console";
import { getTopRatedProviders } from "../async/top_rated_providers.js";
import { validateUserTask } from "../../validations/TaskValidations.js";
import { createTask, editTask, updateTask } from "../async/user_tasks.js";
import { getAllConsumer } from "../async/Admin/consumer.js";

const route_sync = express.Router();

// send otp
route_sync.post("/sendOtp", validateEmail, sendOtp);
route_sync.post("/checkOtp", checkOtp);

// provider signup
route_sync.post("/provider/signup", validateUser, createUser);
// route_sync.post("/provider/signup", checkIsOTPTrue, validateUser, createUser);

// provider login
// route_sync.post("/provider/login", checkIsOTPTrue, loginUser);
route_sync.post("/provider/login", LoginValidations, loginUser);
route_sync.post("/logout", authenticateUser, logoutUser);

route_sync.get("/provider/profile", authenticateUser, findOneUser);

// profile
route_sync.post(
  "/provider/profile",
  // checkAfterSignup,
  authenticateUser,
  checkProvider,
  validateBusinessProfile,
  createProfile
);

route_sync.post(
  "/provider/category",
  authenticateUser,
  checkProvider,
  checkAfterCategory,
  validateProviderCategories,
  createProviderCategories
);

route_sync.post(
  "/provider/workingHours",
  authenticateUser,
  checkProvider,
  checkAfterWorkingHours,
  validateWorkingHours,
  createWorkingHours
);

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./public/images/"); // './public/images/' directory name where save the file
  },
  filename: (req, file, callBack) => {
    callBack(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({
  storage: storage,
});

route_sync.post("/post", upload.single("licence_img_front"), (req, res) => {
  if (!req.file) {
    console.log("No file upload");
  } else {
    console.log(req.file.filename);
    var imgsrc = "http://127.0.0.1:3000/images/" + req.file.filename;
    res.status(401).json({
      Image: imgsrc,
      message: "Error accessing information. Please log in.",
    });
  }
});
const frontAndBackUpload = upload.fields([
  { name: "licence_img_front", maxCount: 1 },
  { name: "licence_img_back", maxCount: 1 },
]);

route_sync.post(
  "/provider/liscenseImage",
  frontAndBackUpload,
  (req, res, next) => {
    console.log(req.body);
    const frontImage = req.files["licence_img_front"]
      ? req.files["licence_img_front"][0].filename
      : null;
    const backImage = req.files["licence_img_back"]
      ? req.files["licence_img_back"][0].filename
      : null;
    console.log(frontImage);
    console.log(backImage);
    if (!frontImage) {
      console.log("Front image not uploaded");
      return res.status(400).json({
        success: false,
        message: "Front image of the license is required",
      });
    }
    if (!backImage) {
      console.log("Back image not uploaded");
      return res.status(400).json({
        success: false,
        message: "Back image of the license is required",
      });
    }
    console.log("Front image filename:", frontImage);
    console.log("Back image filename:", backImage);

    req.imgsrcBack = backImage;
    req.imgsrcFront = frontImage;
    next();
  },
  authenticateUser,
  checkProvider,
  checkAfterCategoryLicense,
  validateProviderCategoryLicence,
  addLicenseDetails
);

route_sync.post(
  "/provider/liscenseImage/update",
  frontAndBackUpload,
  (req, res, next) => {
    const frontImage = req.files["licence_img_front"]
      ? req.files["licence_img_front"][0].filename
      : null;
    const backImage = req.files["licence_img_back"]
      ? req.files["licence_img_back"][0].filename
      : null;

    if (!frontImage) {
      console.log("Front image not uploaded");
      return res.status(400).json({
        success: false,
        message: "Front image of the license is required",
      });
    }

    console.log("Front image filename:", frontImage);

    if (backImage) {
      console.log("Back image filename:", backImage);
      req.imgsrcBack = "http://localhost:3003/images/" + backImage;
    }

    req.imgsrcFront = "http://localhost:3003/images/" + frontImage;
    next();
  },
  authenticateUser,
  checkProvider,
  checkAfterCategoryLicense,
  validateProviderCategoryLicence,
  updateLicenseDetails
);

route_sync.post(
  "/provider/drivingLiscense",
  frontAndBackUpload,
  (req, res, next) => {
    const frontImage = req.files["licence_img_front"]
      ? req.files["licence_img_front"][0].filename
      : null;
    const backImage = req.files["licence_img_back"]
      ? req.files["licence_img_back"][0].filename
      : null;

    if (!frontImage) {
      console.log("Front image not uploaded");
      return res.status(400).json({
        success: false,
        message: "Front image of the license is required",
      });
    }

    console.log("Front image filename:", frontImage);

    if (backImage) {
      console.log("Back image filename:", backImage);
      req.imgsrcBack = "http://localhost:3003/images/" + backImage;
    }

    req.imgsrcFront = "http://localhost:3003/images/" + frontImage;
    next();
  },
  authenticateUser,
  checkProvider,
  checkAfterCategoryLicense,
  validateProviderDrivingLicence,
  addDrivingLicenseDetails
);

const imageUpload = upload.fields([{ name: "image", maxCount: 5 }]);
route_sync.post(
  "/provider/addTask",
  imageUpload,
  (req, res, next) => {
    const images = req.files["image"];

    if (!images || images.length === 0) {
      next();
      return;
    }

    // Process each image
    const imageUrls = images.map(
      (file) => "http://localhost:3003/images/" + file.filename
    );

    console.log("Image filenames:", imageUrls);

    // Assuming you want to append all image URLs to the request
    req.imageUrls = imageUrls;

    next();
  },
  validateUserTask,
  createTask
);
route_sync.get("/tasks/edit/:task_id", editTask);
route_sync.put(
  "/tasks/:task_id",
  imageUpload,
  (req, res, next) => {
    const images = req.files["image"];

    if (!images || images.length === 0) {
      next();
      return;
    }

    // Process each image
    const imageUrls = images.map(
      (file) => "http://localhost:3003/images/" + file.filename
    );

    console.log("Image filenames:", imageUrls);

    // Assuming you want to append all image URLs to the request
    req.imageUrls = imageUrls;

    next();
  },
  validateUserTask,
  updateTask
);

route_sync.post(
  "/provider/workingHours",
  authenticateUser,
  checkProvider,
  checkAfterWorkingHours,
  validateWorkingHours,
  createWorkingHours
);
//- --------------------Assets-----------------------------------

route_sync.get("/assets/getAllCities", getAllCities);
route_sync.get("/assets/getAllCategories", getAllCategories);
route_sync.get("/assets/getProviderCategoryData", getCategoryData);
route_sync.post("/assets/addCategory", addCategory);
route_sync.get("/assets/addCity", addCity);
route_sync.get("/categoryWiseProvider/:category_id", categoryWiseProvider);
route_sync.get("/providerProfile/:userId", getProviderProfileByUserId);
route_sync.get("/all-consumer", getAllConsumer);
/// -------------- for Admin -----------///

route_sync.get("/admin/userCreate", createAdminUser);
route_sync.get("/top-rated-providers", getTopRatedProviders);
// provider profile
route_sync.get(
  "/provider/providerCategoryLiscense",
  authenticateUser,
  hasLicenseCategory
);

route_sync.get(
  "/provider/allProfile",
  authenticateUser,
  checkAdmin,
  getAllProviderProfiles
);
route_sync.get(
  "/provider/oneProfile/:userId",
  authenticateUser,
  checkAdmin,
  getProviderProfileByUserId
);
route_sync.get("/admin/createuser", createAdminUser);
route_sync.post(
  "/provider/categoryAccept",
  authenticateUser,
  checkAdmin,
  acceptResponse
);
route_sync.post(
  "/provider/categoryReject",
  authenticateUser,
  checkAdmin,
  rejectResponse
);

// -------------------CONSUMER----------------------
route_sync.post("/consumer/signup", validateUserConsumer, createUser);
route_sync.post("/user/reset", checkIsOTPTrue, resetPassword);
export default route_sync;
