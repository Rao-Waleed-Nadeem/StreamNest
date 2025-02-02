import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    let token =
      req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];

    console.log("Access token:", token);

    if (!token) {
      throw new apiError(401, "Unauthorized request");
    }

    try {
      // Verify access token
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Fetch user and attach to request
      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new apiError(403, "Invalid access token");
      }

      req.user = user;
      return next(); // Proceed if access token is valid
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        console.warn("Access token expired. Attempting refresh...");

        // Get refresh token from cookies
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
          throw new apiError(401, "Session expired. Please log in again.");
        }

        try {
          // Verify refresh token
          const decodedRefresh = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
          );

          const user = await User.findById(decodedRefresh?._id);
          if (!user) {
            throw new apiError(403, "Invalid refresh token");
          }

          // Generate new access token
          const newAccessToken = user.generateAccessToken();

          console.log("New Access Token Generated:", newAccessToken);

          // Send new token in response headers
          res.setHeader("Authorization", `Bearer ${newAccessToken}`);
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            // sameSite: "Strict",
          });

          req.user = user;
          return next();
        } catch (refreshError) {
          console.error("Refresh token verification failed:", refreshError);
          throw new apiError(401, "Session expired. Please log in again.");
        }
      }

      throw new apiError(401, "Invalid access token");
    }
  } catch (err) {
    next(err);
  }
});
