import axios from "axios";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import oauth2Client from "../utils/oauth2client.js";
// import catchAsync from "../utils/catchAsync.js";
// import AppError from "../utils/appError.js";
import { GoogleUser } from "../models/googleUser.model.js";
import { promiseHandler } from "../utils/promiseHandler.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TIMEOUT,
  });
};

// Create and send Cookie ->
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  console.log(process.env.JWT_COOKIE_EXPIRES_IN);
  const cookieOptions = {
    expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN),
    httpOnly: true,
    path: "/",
    secure: false,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
    cookieOptions.sameSite = "none";
  }

  user.password = undefined;

  res.cookie("jwt", token, cookieOptions);

  console.log(user);

  res.status(statusCode).json({
    message: "success",
    token,
    data: {
      user,
    },
  });
};

// Google Authentication API
const googleAuth = promiseHandler(async (req, res, next) => {
  const code = req.query.code;
  console.log("USER CREDENTIAL -> ", code);

  const googleRes = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(googleRes.tokens);

  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
  );

  let user = await GoogleUser.findOne({ email: userRes.data.email });

  if (!user) {
    console.log("New User found");
    user = await GoogleUser.create({
      name: userRes.data.name,
      email: userRes.data.email,
      image: userRes.data.picture,
    });
  }

  createSendToken(user, 201, res);
});

// Export as default
export { googleAuth };
