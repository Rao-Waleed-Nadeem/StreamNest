import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  let videoComments = await Comment.find({ video: videoId });

  if (!videoComments || videoComments.length === 0) {
    return res
      .status(200)
      .json(new apiResponse(200, videoComments, "Not a comment on the video"));
  }

  videoComments = await Comment.aggregate([
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
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
  ]);

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

  console.log(content);

  if (!content) {
    throw new apiError(400, "Content is missing to add comment");
  }

  const comment = await Comment.create({
    content,
    owner: req.user?._id,
    video: videoId,
  });

  if (!comment) {
    throw new apiError(500, "Error while adding comment");
  }

  return res
    .status(200)
    .json(new apiResponse(200, comment, "Comment added successfully"));
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
