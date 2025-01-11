import { promiseHandler } from "../utils/promiseHandler.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new apiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const registerUser = promiseHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, password, username } = req.body;
  console.log("email: ", email);

  if (
    [fullName, email, password, username].some((field) => field.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new apiError(409, "User with this email or username already exists");
  }

  console.log("req.files: ", req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url || "",
    email,
    password,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Error while registering user");
  }

  res
    .status(201)
    .json(new apiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = promiseHandler(async (req, res) => {
  const { username, password } = req.body;

  console.log("username: ", username, " password: ", password);

  if (!username) {
    throw new apiError(404, "Username & Password are required for login");
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new apiError(401, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(404, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = promiseHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "Logged out successfully"));
});

const refreshAccessToken = promiseHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new apiError(401, "unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new apiError(400, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new apiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = generateAccessAndRefreshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (err) {
    throw new apiError(401, err?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = promiseHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);

  const isCorrectPassword = await user.isPasswordCorrect(oldPassword);
  if (!isCorrectPassword) {
    throw new apiError(404, "Wrong password");
  }
  user.password = password;
  ServiceWorker.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = promiseHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = promiseHandler(async (req, res) => {
  const { email, fullName } = req.body;
  if (!email || !fullName) {
    throw new apiError(404, "Missing credentials");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        email,
        fullName,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(
      new apiResponse(200, user, "Account credentials updated successfully")
    );
});

const updateUserAvatar = promiseHandler(async (req, res) => {
  const avatarLocalPathTemp = req.file?.path;

  if (!avatarLocalPathTemp) {
    throw new apiError(404, "Avatar file missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPathTemp);

  if (!avatar.url) {
    throw new apiError(400, "Error while uploading avatar");
  }

  // fs.unlinkSync(avatarLocalPathTemp);

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new apiResponse(200, user, "Avatar uploaded successfully"));
});

const updateUserCoverImage = promiseHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new apiError(400, "Cover Image missing");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage.url) {
    throw new apiError(400, "Error while uploading cover image");
  }

  fs.unlinkSync(coverImageLocalPath);

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new apiResponse(200, user, "Cover image uploaded successfully"));
});

const getUserChannelProfile = promiseHandler(async (req, res) => {
  const { username } = req.body;

  console.log("username:", username);

  if (!username?.trim()) {
    throw new apiError(404, "Missing username");
  }

  const channel =
    await User.aggregate[
      ({
        $match: {
          username: username?.toLowerCase,
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $addFields: {
          subscribersCount: {
            $size: "$subscribers",
          },
          subscribedToCount: {
            $size: "$subscribedTo",
          },
          isSubscribed: {
            $cond: {
              if: { $in: [req.user?._id, "$subscribers.subscriber"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          fullName: 1,
          username: 1,
          email: 1,
          avatar: 1,
          coverImage: 1,
          isSubscribed: 1,
          subscribersCount: 1,
          subscribedToCount: 1,
        },
      })
    ];

  if (!channel?.length) {
    throw new apiError(404, "Channel doesn't exist");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, channel[0], "User channel fetched successfully")
    );
});

const getWatchHistory = promiseHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        user[0].watchHistory,
        "Watch history fetched successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
