import { promiseHandler } from "../utils/promiseHandler.js";
import { Video } from "../models/video.model.js";
import { apiError } from "../utils/apiError.js";
import {
  deleteVideoFromCloudinary,
  deleteImageFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
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

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if ([title, description].some((field) => field.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  console.log("videoFileLocalPath: ", videoLocalPath);

  if (!videoLocalPath) {
    throw new apiError(400, "Uploading video file is missing");
  }

  if (!thumbnailLocalPath) {
    throw new apiError(400, "Uploading thumbnail is missing");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  console.log("videoFile: ", videoFile);
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

  //   const video = await Video.findByIdAndUpdate(
  //     videoId,
  //     {
  //         togglePublishStatus:
  //     },
  //     {
  //       new: true,
  //     }
  //   );

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

  if (!videoId) {
    throw new apiError(404, "Required video id not found");
  }

  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
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
      $addFields: {
        owner: {
          $first: "$owner", // Fix: Add $ before "owner"
        },
      },
    },
  ]);

  if (!video) {
    throw new apiError(404, "Required video not found");
  }

  return res
    .status(201)
    .json(new apiResponse(200, video, "Video fetched Successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new apiError(404, "Deleting video id not found");
  }

  const video = await Video.findById(videoId);

  console.log("video: ", video);

  {
    const urlParts = video.videoFile.split("/");
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = publicIdWithExtension.split(".")[0];

    console.log("video id: ", publicId);

    const result = await deleteVideoFromCloudinary(
      publicId,
      function (err, result) {
        if (err) {
          throw new apiError(404, "Error deleting thumbnail");
        }
        console.log("Deleted thumbnail successfully from cloudinary", result);
      }
    );
    console.log("delete video: ", result);
  }
  {
    {
      const urlParts = video.thumbnail.split("/");
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtension.split(".")[0];

      const result = await deleteImageFromCloudinary(
        publicId,
        function (err, result) {
          if (err) {
            throw new apiError(404, "Error deleting thumbnail");
          }
          console.log("Deleted thumbnail successfully from cloudinary", result);
        }
      );
      console.log("delete thumbnail: ", result);
    }
  }

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  return res
    .status(201)
    .json(new apiResponse(200, { deletedVideo }, "Video Deleted Successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  deleteVideo,
  updateVideo,
  togglePublishStatus,
  getVideoById,
};
