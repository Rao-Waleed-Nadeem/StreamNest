import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new apiError(400, "Video ID is required");
  }

  const like = await Like.findOne({ likedBy: req.user?._id });

  if (!like) {
    // Create a new like entry
    const newLike = await Like.create({
      video: [videoId],
      likedBy: req.user?._id,
    });

    return res
      .status(201)
      .json(new apiResponse(200, newLike, "Video liked successfully"));
  }

  // Toggle like on existing entry
  if (like.video?.includes(videoId)) {
    // Unlike the video
    like.video = like.video.filter((id) => id !== videoId);
  } else {
    // Like the video
    like.video = videoId;
  }

  await like.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, like, "Video like toggled successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new apiError(400, "Comment ID is required");
  }

  const like = await Like.findOne({
    likedBy: req.user?._id,
  });

  if (!like) {
    // Create a new like entry
    const newLike = await Like.create({
      comment: [commentId],
      likedBy: req.user?._id,
    });

    return res
      .status(201)
      .json(new apiResponse(200, newLike, "Comment liked successfully"));
  }

  // Toggle like on existing entry
  if (like.comment?.includes(commentId)) {
    // Unlike the video
    like.comment = like.comment.filter((id) => id !== commentId);
  } else {
    // Like the video
    like.comment = commentId;
  }

  await like.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, like, "Comment like toggled successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const likeVideos = await Like.findOne({ likedBy: req.user?._id });
  if (!likeVideos) {
    return res
      .status(200)
      .json(new apiResponse(200, likeVideos, "Not liked any video yet"));
  }

  const videos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideos",
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
                    avatar: 1,
                    username: 1,
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
          {
            $project: {
              videoFile: 1,
              thumbnail: 1,
              views: 1,
              title: 1,
              description: 1,
              duration: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        likedVideos: {
          $first: "$likedVideos",
        },
      },
    },
  ]);

  console.log("videos: ", videos);

  return res
    .status(200)
    .json(new apiResponse(200, videos, "Like videos fetched successfully"));
});

export { toggleCommentLike, toggleVideoLike, getLikedVideos };
