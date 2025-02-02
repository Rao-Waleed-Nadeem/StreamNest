import { promiseHandler } from "../utils/promiseHandler.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import {
  deleteImageFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import mongoose, { Mongoose } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pipeline } from "stream";

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
  const { fullName, email, password, username, googleUser, avatar } = req.body;
  console.log("email: ", email);
  console.log("fullName: ", fullName);
  console.log("password: ", password);
  console.log("username: ", username);

  // Check if all fields are provided
  if (
    [fullName, email, password, username].some((field) => field.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  // Check if the user already exists with the same email or username
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    // If the user exists and is a Google user, log them in instead of throwing error
    if (googleUser) {
      console.log("User already exists as Google user, logging in...");

      const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(existedUser._id);

      const loggedInUser = await User.findById(existedUser._id).select(
        "-password -refreshToken"
      );

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
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
    } else
      throw new apiError(
        409,
        "User with this email or username already exists"
      );
  }

  let avatarLocalPath;
  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files?.coverImage[0]?.path;
  }

  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files?.avatar[0]?.path;
  }

  const Avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log("avatar after uploaded on cloudinary: ", Avatar);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  const user = await User.create({
    fullName,
    avatar: Avatar?.url || avatar || "",
    email,
    password,
    googleUser,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  console.log("Access token: ", accessToken);
  console.log("Refresh token: ", refreshToken);

  let createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Error while registering user");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  createdUser.refreshToken = refreshToken;
  await createdUser.save({ validateBeforeSave: false });
  req.user = createdUser;

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: createdUser,
          accessToken,
          refreshToken,
        },
        "User registered successfully"
      )
    );
});

const loginUser = promiseHandler(async (req, res) => {
  const { username, password, googleUser } = req.body;

  // console.log("username: ", username, " password: ", password);

  if (!username) {
    throw new apiError(404, "Username & Password are required for login");
  }

  const user = await User.findOne({ username, googleUser });

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

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

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

  console.log("Incoming token: ", incomingRefreshToken);

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    let user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new apiError(403, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new apiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    // const { accessToken, refreshToken } = generateAccessAndRefreshTokens(
    //   user._id
    // );

    const accessToken = user.generateAccessToken();

    // user.refreshToken = refreshToken;
    // await user.save({ validateBeforeSave: false });

    return (
      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        // .cookie("refreshToken", refreshToken, options)
        .json(
          new apiResponse(
            200,
            { accessToken },
            "Access token refreshed successfully"
          )
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
  user.password = newPassword;
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
  const { fullName } = req.body;
  if (!fullName) {
    throw new apiError(404, "Missing credentials");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken"); //Mene khud ye refreshToken dala h

  return res
    .status(200)
    .json(
      new apiResponse(200, user, "Account credentials updated successfully")
    );
});

const updateUserAvatar = promiseHandler(async (req, res) => {
  const avatarLocalPathTemp = req.file?.path;

  // console.log("req: ", req);

  if (!avatarLocalPathTemp) {
    throw new apiError(404, "Avatar file missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPathTemp);

  if (!avatar.url) {
    throw new apiError(400, "Error while uploading avatar");
  }

  console.log("url of deleting image ", req.user.avatar);

  if (req.user.avatar && req.user.avatar.includes("res.cloudinary.com")) {
    const urlParts = req.user.avatar.split("/");
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = publicIdWithExtension.split(".")[0];

    const result = await deleteImageFromCloudinary(
      publicId,
      function (err, result) {
        if (err) {
          throw new apiError(404, "Error deleting image");
        }
        console.log("Deleted image successfully", result);
      }
    );

    console.log("result of deletion of avatar ", result);
  }

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

  // const tempUser = await User.findById(req.user?._id);

  // console.log("url of deleting image (cover image):", tempUser.coverImage);

  if (
    req.user.coverImage &&
    req.user.coverImage.includes("res.cloudinary.com")
  ) {
    const urlParts = tempUser.coverImage.split("/");
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = publicIdWithExtension.split(".")[0];

    const result = await deleteImageFromCloudinary(
      publicId,
      function (err, result) {
        if (err) {
          throw new apiError(404, "Error deleting image");
        }
        console.log("Deleted image successfully", result);
      }
    );

    console.log("result of deletion of avatar ", result);
  }

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
                $first: "$owner",
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

const getUserDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new apiError(400, "User id is necessary for getting user details");
  }

  const userDetails = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "videos",
        pipeline: [
          {
            $project: {
              _id: 1,
              videoFile: 1,
              thumbnail: 1,
              duration: 1,
              views: 1,
              isPublished: 1,
              createdAt: 1,
            },
          },
          {
            $lookup: {
              from: "comments",
              localField: "_id",
              foreignField: "video",
              as: "comments",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    content: 1,
                    owner: 1,
                  },
                },
                {
                  $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "comment",
                    as: "likes",
                    pipeline: [
                      {
                        $project: {
                          _id: 1,
                          likedBy: 1,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "video",
              as: "likes",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    likedBy: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
        pipeline: [
          {
            $project: {
              subscriber: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "playlists",
        localField: "_id",
        foreignField: "owner",
        as: "playlists",
        pipeline: [
          {
            $lookup: {
              from: "videos",
              localField: "videos",
              foreignField: "_id",
              as: "videos",
            },
          },
          {
            $addFields: {
              videosLength: {
                $size: "$videos",
              },
              videos: {
                $first: "$videos",
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        subscribers: {
          $first: "$subscribers",
        },
      },
    },
  ]);

  if (!userDetails) {
    throw new apiError(400, "No such user exist");
  }

  return res
    .status(201)
    .json(
      new apiResponse(200, userDetails[0], "User details fetched successfully")
    );
});

const addWatchHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new apiError(400, "Video id is required for adding watch history");
  }

  let user = await User.findById(req.user?._id);

  if (!user) {
    throw new apiError(400, "User not found");
  }

  if (!user.watchHistory?.includes(videoId)) {
    user.watchHistory.push(videoId);
    await user.save({ validateBeforeSave: false });
  }

  console.log("After added watch history: ", user);

  return res
    .status(201)
    .json(new apiResponse(200, user, "Video added to watch history"));
});

const removeVideoHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new apiError(
      400,
      "Video id is required for remove video from watch history"
    );
  }

  let user = await User.findById(req.user?._id);

  if (!user) {
    throw new apiError(400, "User not found");
  }

  if (user.watchHistory?.includes(videoId)) {
    user.watchHistory = user.watchHistory.filter(
      (watch) => watch.toString() !== videoId.toString()
    );
    await user.save({ validateBeforeSave: false });
  }

  return res
    .status(200)
    .json(new apiResponse(201, user, "Removed video from history"));
});

const clearWatchHistory = asyncHandler(async (req, res) => {
  let user = await User.findById(req.user?._id);

  if (!user) {
    throw new apiError(400, "User not found");
  }

  user.watchHistory = [];
  await user.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(new apiResponse(200, user, "Clear watch history"));
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
  getUserDetails,
  addWatchHistory,
  removeVideoHistory,
  clearWatchHistory,
};
