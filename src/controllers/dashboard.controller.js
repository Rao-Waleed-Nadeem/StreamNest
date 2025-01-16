import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const channelDetails = await User.aggregate([
    {
      $match: { _id: req.user?._id }, // Ensure the match filter is correct
    },
    {
      $lookup: {
        from: "videos", // Collection name for videos
        localField: "_id", // User's ID
        foreignField: "owner", // Assuming `userId` in videos refers to the uploader
        as: "videos", // Name of the resulting array
      },
    },
    {
      $addFields: {
        totalViews: {
          $sum: "$videos.views", // Sum up all `views` in the videos array
        },
        totalVideos: {
          $size: "$videos",
        },
        videos: {
          $map: "$videos",
        },
      },
    },
    {
      $project: {
        fullName: 1,
        avatar: 1,
        username: 1,
        _id: 1,
        totalViews: 1, // Include the calculated totalViews field
        videos: {
          $map: {
            input: "$videos", // Iterate over each video
            as: "video",
            in: {
              duration: "$$video.duration",
              views: "$$video.views",
              thumbnail: "$$video.thumbnail",
              videoFile: "$$video.videoFile",
              description: "$$video.description",
              title: "$$video.title",
            },
          },
        },
      },
    },
  ]);

  const likes = channelDetails.videos;

  likes.map(async (like) => {
    likes = await Like.aggregate([
      {
        $match: {
          video: new mongoose.Types.ObjectId(like._id),
        },
      },
      {
        $lookup: {
          from: "likes",
        },
      },
    ]);
  });

  return res
    .status(200)
    .json(
      new apiResponse(200, channelDetails, "Channel stats fetched successfully")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  let videos = await Video.find({ _id: req.user?._id });

  if (!videos) {
    throw new apiError(400, "This channel has not any video");
  }

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
              avatar: 1,
              username: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        duration: 1,
        views: 1,
        videoFile: 1,
        thumbnail: 1,
        description: 1,
        title: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        videos,
        "Videos fetched for this channel successfully"
      )
    );
});

export { getChannelStats, getChannelVideos };
