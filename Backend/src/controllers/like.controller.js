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

  let likes = await Like.findOne({ likedBy: req.user?._id });

  if (!likes || likes.length === 0) {
    // Create a new like entry
    const newLike = await Like.create({
      video: videoId,
      likedBy: req.user?._id,
    });

    return res
      .status(201)
      .json(new apiResponse(200, newLike, "Video liked successfully"));
  }

  if (likes.video.includes(videoId)) {
    // Video ID exists, remove it
    likes.video = likes.video.filter((id) => id.toString() !== videoId); // Remove video ID
    // Remove the object if both video and comment are empty
  } else {
    // Video ID does not exist, add a new object with the video ID
    likes.video.push(videoId);
  }

  if (!likes) {
    return res.status(201).json(new apiResponse(200, {}, "Null liked"));
  }

  await likes.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, likes, "Video like toggled successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  console.log("hello");
  if (!commentId) {
    throw new apiError(400, "Comment ID is required");
  }

  let comments = await Like.findOne({ likedBy: req.user?._id });

  if (!comments || comments.length === 0) {
    // Create a new like entry
    const newComment = await Like.create({
      comment: commentId,
      likedBy: req.user?._id,
    });

    return res
      .status(201)
      .json(new apiResponse(200, newComment, "Comment liked successfully"));
  }

  if (comments.comment.includes(commentId)) {
    // Video ID exists, remove it
    comments.comment = comments.comment.filter(
      (id) => id.toString() !== commentId
    ); // Remove video ID
    // Remove the object if both video and comment are empty
  } else {
    // Video ID does not exist, add a new object with the video ID
    comments.comment.push(commentId);
  }

  await comments.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, comments, "Comment like toggled successfully"));
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

  // console.log("videos: ", videos);

  return res
    .status(200)
    .json(new apiResponse(200, videos, "Like videos fetched successfully"));
});

const checkLike = asyncHandler(async (req, res) => {
  const { videoId, userId } = req.params;

  if (!userId) {
    throw new apiError(400, "User id is required to check video like");
  }

  if (!videoId) {
    throw new apiError(400, "Video id is required to check like on video");
  }

  const like = await Like.findOne({ video: videoId, likedBy: userId });

  return res
    .status(201)
    .json(
      new apiResponse(
        200,
        like ? true : false,
        "Checked user like successfully"
      )
    );
});

export { toggleCommentLike, toggleVideoLike, getLikedVideos, checkLike };
