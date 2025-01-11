import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // console.log("verify jwt");
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new apiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("token: ", decodedToken);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new apiError(401, "Invalid access token");
    }

    req.user = user;
    // console.log("user: ", req.user);
    next();
  } catch (err) {
    throw new apiError(401, "Invalid Access token");
  }
});
