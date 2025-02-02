import { promiseHandler } from "../utils/promiseHandler.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Playlist } from "../models/playlist.model.js";
import { Comment } from "../models/comment.model.js";
import { deleteComment } from "./comment.controller.js";
import { apiError } from "../utils/apiError.js";
import {
  deleteVideoFromCloudinary,
  deleteImageFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import mongoose, { mongo } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pipeline } from "stream";

const getQueryVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "asc",
    userId,
  } = req.query;

  // Convert `page` and `limit` to numbers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Build the `filter` object for MongoDB
  const filter = {};
  if (query) {
    filter.title = { $regex: query, $options: "i" }; // Case-insensitive title search
  }
  if (userId) {
    filter.userId = userId; // Filter videos by user ID
  }

  // Sorting logic
  const sort = {};
  if (sortBy) {
    sort[sortBy] = sortType === "asc" ? 1 : -1; // Ascending (1) or Descending (-1)
  }

  // Fetch videos from the database with pagination, filtering, and sorting
  const videos = await Video.find(filter)
    .sort(sort)
    .skip((pageNumber - 1) * limitNumber) // Skip videos for previous pages
    .limit(limitNumber); // Limit the number of videos per page

  // Get the total count of videos matching the filter
  const totalVideos = await Video.countDocuments(filter);

  // Send the response
  res
    .status(200)
    .json(
      new apiResponse(
        200,
        { videos, totalVideos, page: pageNumber, limit: limitNumber },
        "Videos fetched successfully"
      )
    );
});

const getAllVideos = asyncHandler(async (req, res) => {
  let videos = await Video.find();

  videos = await Video.aggregate([
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
              _id: 1,
              username: 1,
              avatar: 1,
              coverImage: 1,
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
              likedBy: 1,
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
        likes: { $size: { $ifNull: ["$likes", []] } }, // Returns a number
        // views: { $size: { $ifNull: ["$views", []] } }, // Returns a number
      },
    },
  ]);

  if (!videos || videos.length === 0) {
    throw new apiError(400, "No video is present now");
  }

  return res
    .status(201)
    .json(new apiResponse(200, videos, "All videos fetched Successfully"));
});

// const getUserVideos = asyncHandler(async (req, res) => {
//   const { userId } = req.params;

//   if (!userId) {
//     throw new apiError(400, "User id is necessary for fetching videos");
//   }

//   const userVideos = await Video.find({ owner: userId });

//   return res
//     .status(201)
//     .json(new apiResponse(200, userVideos, "User videos fetched successfully"));
// });

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if ([title, description].some((field) => field.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  // console.log("videoFileLocalPath: ", videoLocalPath);

  if (!videoLocalPath) {
    throw new apiError(400, "Uploading video file is missing");
  }

  if (!thumbnailLocalPath) {
    throw new apiError(400, "Uploading thumbnail is missing");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  // console.log("videoFile: ", videoFile);
  //   return res
  //     .status(201)
  //     .json(
  //       new apiResponse(200, "publishedVideo", "Video published Successfully")
  //     );

  if (!videoFile) {
    throw new apiError(500, "Err in uploading video file on cloudinary");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail) {
    throw new apiError(500, "Error in uploading thumbnail on cloudinary");
  }

  const video = await Video.create({
    title,
    description,
    thumbnail: thumbnail?.url || "",
    videoFile: videoFile?.url || "",
    owner: req.user._id,
    duration: videoFile.duration,
    views: [],
  });

  const publishedVideo = await Video.findById(video._id);

  if (!publishedVideo) {
    throw new apiError(500, "Error while publishing video");
  }

  return res
    .status(201)
    .json(new apiResponse(200, publishedVideo, "Video published Successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const thumbnail = req.file ? req.file.path : undefined;

  if (!title && !description && !thumbnail) {
    throw new apiError(400, "Provide at least one field to update the video");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new apiError(404, "Video not found");
  }

  if (title) {
    video.title = title;
  }

  if (description) {
    video.description = description;
  }

  if (thumbnail) {
    // Delete old thumbnail from Cloudinary
    const urlParts = video.thumbnail.split("/");
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = publicIdWithExtension.split(".")[0];
    await deleteImageFromCloudinary(publicId);

    // Upload new thumbnail
    const newThumbnail = await uploadOnCloudinary(thumbnail);
    video.thumbnail = newThumbnail.url;
  }

  // Save updated video
  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, video, "Video content updated successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new apiError(404, "Toggling publishing video id not found");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new apiError(404, "Video is not present for toggling publish");
  }

  video.togglePublishStatus = !video.togglePublishStatus;
  await video.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(
      new apiResponse(200, video, "Video publish status toggle Successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new apiError(404, "Invalid or missing video ID");
  }

  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner",
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
        from: "users", // The target collection (users)
        localField: "owner", // The field in the Video collection
        foreignField: "_id", // The matching field in the Users collection
        as: "owner", // The name of the array field to store the result
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
              coverImage: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes", // The target collection (users)
        localField: "_id", // The field in the Video collection
        foreignField: "video", // The matching field in the Users collection
        as: "likes", // The name of the array field to store the result
        pipeline: [
          {
            $project: {
              likedBy: 1,
            },
          },
        ],
      },
    },

    {
      $addFields: {
        owner: {
          $first: "$owner", // Fix: Add $ before "owner"
        },
        likes: {
          $size: "$likes",
        },
        subscribers: {
          $first: "$subscribers",
        },
      },
    },
  ]);

  if (!video || video.length === 0) {
    throw new apiError(404, "Video not found");
  }

  // await video.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(new apiResponse(200, video[0], "Video fetched Successfully"));
});

const addView = asyncHandler(async (req, res) => {
  const { videoId, userId } = req.params;

  if (!userId) {
    throw new apiError(400, "User id is missing in adding view to video");
  }

  if (!videoId) {
    throw new apiError(400, "Video id is missing to add view to video");
  }

  let video = await Video.findById(videoId);

  if (!video) {
    throw new apiError(400, "This video is not present for adding view");
  }

  if (video.views.length === 0) {
    video.views = [userId];
  } else {
    // Ensure unique userId using Set
    // video.views = [...new Set([...video.views, userId])];
    if (video.views.includes(userId)) {
    } else video.views.push(userId);
  }

  await video.save({ validateBeforeSave: false });

  video = await Video.aggregate([
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
              coverImage: 1,
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
              likedBy: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
        likes: { $size: "$likes" },
        totalViews: { $size: "$views" },
      },
    },
  ]);

  // console.log("video in backend: ", video);

  return res
    .status(201)
    .json(new apiResponse(200, video[0], "View added to video successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  console.log("video id: ", videoId);

  // Step 1: Validate if videoId is provided
  if (!videoId) {
    throw new apiError(400, "Video ID is required");
  }

  // Step 2: Delete likes associated with the video
  const likes = await Like.find({ video: videoId });

  if (likes.length > 0) {
    await Like.deleteMany({ video: videoId }); // Delete likes related to the video
    console.log(`Deleted ${likes.length} likes for video ${videoId}`);
  }

  // Step 3: Delete comments associated with the video
  const comments = await Comment.find({ video: videoId });

  if (comments.length > 0) {
    await Comment.deleteMany({ video: videoId }); // Delete comments related to the video
    console.log(`Deleted ${comments.length} comments for video ${videoId}`);
  }

  // Step 4: Delete video from playlists if it's part of any playlists
  const playlists = await Playlist.find({ owner: req.user?._id });

  for (let playlist of playlists) {
    if (playlist.videos?.includes(videoId)) {
      playlist.videos = playlist.videos.filter(
        (id) => id.toString() !== videoId
      );
      await playlist.save({ validateBeforeSave: false });
      console.log(`Removed video ${videoId} from playlist ${playlist._id}`);
    }
  }

  // Step 5: Find the video to delete and delete its assets from Cloudinary
  const video = await Video.findById(videoId);

  if (!video) {
    throw new apiError(404, "Video not found");
  }

  // Delete the video file from Cloudinary (use the video file URL)
  const urlParts = video.videoFile.split("/");
  const publicIdWithExtension = urlParts[urlParts.length - 1];
  const publicId = publicIdWithExtension.split(".")[0];

  try {
    const result = await deleteVideoFromCloudinary(publicId);
    console.log("Deleted video successfully from Cloudinary", result);
  } catch (err) {
    throw new apiError(404, "Error deleting video from Cloudinary");
  }

  // Delete the thumbnail image from Cloudinary
  const thumbnailParts = video.thumbnail.split("/");
  const thumbnailPublicIdWithExtension =
    thumbnailParts[thumbnailParts.length - 1];
  const thumbnailPublicId = thumbnailPublicIdWithExtension.split(".")[0];

  try {
    const result = await deleteImageFromCloudinary(thumbnailPublicId);
    console.log("Deleted thumbnail successfully from Cloudinary", result);
  } catch (err) {
    throw new apiError(404, "Error deleting thumbnail from Cloudinary");
  }

  // Step 6: Delete the video document from the database
  const deletedVideo = await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new apiResponse(200, { deletedVideo }, "Video Deleted Successfully"));
});

const advancedSearch = asyncHandler(async (req, res) => {
  const { query } = req.body;

  let videos = await Video.find();

  // console.log("videos: ", videos);

  if (!videos) {
    throw new Error(
      "Invalid input: videos must be an array and query must be a string."
    );
  }

  const tokenize = (text) => text.toLowerCase().split(/\s+/);
  const queryTokens = tokenize(query);

  // Assign scores to videos based on relevance
  const scoredVideos = videos.map((video) => {
    const titleTokens = tokenize(video.title);
    const descriptionTokens = tokenize(video.description);

    let score = 0;

    // Match tokens in title (higher weight)
    queryTokens.forEach((token) => {
      if (titleTokens.includes(token)) score += 3; // Higher weight for title matches
      if (descriptionTokens.includes(token)) score += 1; // Lower weight for description matches
    });

    // Fuzzy matching for partial matches
    queryTokens.forEach((token) => {
      titleTokens.forEach((word) => {
        if (word.startsWith(token)) score += 2; // Partial matches in title
      });
      descriptionTokens.forEach((word) => {
        if (word.startsWith(token)) score += 1; // Partial matches in description
      });
    });

    return { ...video, score };
  });

  return res.status(200).json(
    new apiResponse(
      200,
      scoredVideos
        .filter((video) => video.score > 0) // Remove videos with no matches
        .sort((a, b) => b.score - a.score),
      "Fetched videos successfully"
    )
  );
});

const getTotalVideosSize = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const videos = await Video.find({ owner: userId });
  return res
    .status(201)
    .json(
      new apiResponse(
        200,
        videos ? videos.length : 0,
        "Total size of videos fetched successfully"
      )
    );
});

const getUserVideos = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new apiError(400, "User id is required for fetching videos");
  }

  const videos = await Video.aggregate([
    {
      owner: new mongoose.Types.ObjectId(userId),
    },
  ]);

  return res.status(201).json(200, videos, "User videos fetched successfully");
});

export {
  getQueryVideos,
  publishAVideo,
  deleteVideo,
  getAllVideos,
  updateVideo,
  togglePublishStatus,
  getVideoById,
  advancedSearch,
  addView,
  getTotalVideosSize,
  getUserVideos,
  // getUserVideos,
};
