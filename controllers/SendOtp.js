import User from "../models/entity/users.js";
import { GenerateOTP, SendMail } from "../HelperFunctions/email.js";
import session from "express-session";

const sendOtp = async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res
        .status(400)
        .json({ error: "Invalid or missing email parameter" });
    }

    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const otp = GenerateOTP();
    req.session.otp = otp;
    SendMail(email, otp);

    return res.status(200).json({ message: "OTP sent successfully" });

    setTimeout(() => {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
        } else {
          console.log("Session destroyed after a minute");
        }
      });
    }, 60000);
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkOtp = async (req, res) => {
  try {
    let isotp = false;

    const otp = req.body.otp;
    console.log("Received OTP:", otp);
    console.log("Stored OTP:", req.session.otp);

    if (req.session.otp === "" || req.session === undefined) {
      return res.status(400).json({ message: "OTP Expired" });
    } else if (otp === req.session.otp) {
      isotp = "true";
      req.session.isotp = isotp;
      return res.status(200).json({ message: "Verification Complete" });
    } else {
      return res.status(400).json({ message: "Verification Failed" });
    }
  } catch (error) {
    console.error("Error checking OTP:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { sendOtp, checkOtp };
