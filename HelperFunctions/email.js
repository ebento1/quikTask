import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "naseerarshia393@gmail.com", //email ID
    pass: "kbkx wefb ofww bpdh", //Password
  },
});

// export function GenerateOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }
export function GenerateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function SendMail(email, otp) {
  const mailOptions = {
    from: "naseerarshia393@gmail.com",
    to: email,
    subject: "Your OTP",
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, function (error, data) {
    if (error) console.log(error);
    else console.log(data);
  });
}

// var email = "arshia.oxmite@gmail.com";
// var otp = "123456";
// sendMail(email, otp);
