import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) {
    throw new apiError(400, "Video id is missing to get comments of video");
  }

  let videoComments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId), // Match by videoId
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
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
        totalLikes: {
          $size: "$likes",
        },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  if (!videoComments || videoComments.length === 0) {
    return res
      .status(200)
      .json(new apiResponse(200, videoComments, "Not a comment on the video"));
  }

  // console.log("videoComments: ", videoComments);

  return res
    .status(200)
    .json(
      new apiResponse(200, videoComments, "Video comments fetched successfully")
    );
});

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { videoId } = req.params;

  if (!videoId) {
    throw new apiError(400, "Video id is missing to add comment");
  }

  // console.log(content);

  if (!content) {
    throw new apiError(400, "Content is missing to add comment");
  }

  const comment = await Comment.create({
    content,
    owner: req.user?._id,
    video: videoId,
  });

  // let newComment = await Comment.findById(comment?._id);
  const newComment = await Comment.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(comment?._id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
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
        totalLikes: {
          $size: "$likes",
        },
      },
    },
    {
      $sort: { createdAt: -1 }, // Sort by newest first
    },
  ]);

  if (!newComment) {
    throw new apiError(500, "Error while adding comment");
  }

  return res
    .status(200)
    .json(new apiResponse(200, newComment[0], "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new apiError(400, "Comment doesn't exist");
  }

  comment.content = content;
  const updatedComment = await comment.save();

  return res
    .status(200)
    .json(new apiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new apiError(400, "Comment ID is missing to delete the comment");
  }

  const likes = await Like.findOne({ likedBy: req.user?._id });

  if (likes?.comment?.includes(commentId)) {
    likes.comment = likes.comment.filter((id) => id.toString() !== commentId);
  }

  if (likes) await likes.save({ validateBeforeSave: false });

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    return res
      .status(200)
      .json(
        new apiResponse(200, deletedComment, "Comment deleted successfully")
      );
  } catch (error) {
    throw new apiError(400, "Error in deleting comment"); // Pass the error to the `asyncHandler` middleware for proper handling
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
