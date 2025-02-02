import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new apiError(400, "Fields are required to create a playlist");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user?._id,
  });

  if (!playlist) {
    throw new apiError(500, "Error while creating playlist");
  }

  return res
    .status(200)
    .json(new apiResponse(200, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new apiError(
      400,
      "User id is essential for retrieving all playlists of user"
    );
  }

  let userPlaylists = await Playlist.find({ owner: userId });

  if (!userPlaylists) {
    throw new apiError(400, "This user has not created any playlist");
  }

  userPlaylists = await Playlist.aggregate([
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $project: {
              duration: 1,
              thumbnail: 1,
              videoFile: 1,
              title: 1,
              description: 1,
              views: 1,
              id: 1,
            },
          },
        ],
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
  ]);

  return res
    .status(200)
    .json(
      new apiResponse(200, userPlaylists, "User playlists fetched successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  console.log("playlistId: ", playlistId);

  if (!playlistId) {
    throw new apiError(400, "Playlist id is necessary for getting playlist");
  }

  const playlist = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
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

  if (!playlist) {
    throw new apiError(400, "Not found such playlist");
  }

  return res
    .status(200)
    .json(new apiResponse(200, playlist[0], "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !videoId) {
    throw new apiError(
      400,
      "playlist id and video id are essential for adding video to playlist"
    );
  }

  const playlist = await Playlist.findById(playlistId);

  // console.log("playlist: ", playlistId);

  // if (!playlist.videos || playlist.videos.length === 0) {
  //   playlist.videos = [videoId];
  // } else {
  if (!playlist.videos.includes(videoId)) {
    playlist.videos.push(videoId);
  }
  // }
  await playlist.save({ saveBeforeValidation: false });

  return res
    .status(200)
    .json(
      new apiResponse(200, playlist, "Video added to playlist successfully")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !videoId) {
    throw new apiError(
      400,
      "playlist id and video id are essential for removing video from playlist"
    );
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new apiError(404, "Playlist not found");
  }

  if (!playlist.videos || playlist.videos.length === 0) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "No videos in playlist to remove"));
  }

  if (playlist.videos.includes(videoId)) {
    playlist.videos = playlist.videos.filter(
      (id) => id.toString() !== videoId.toString()
    );
  }

  await playlist.save({ validateBeforeSave: false }); // Removed the 'saveBeforeValidation' flag unless it's specifically required

  return res
    .status(200)
    .json(
      new apiResponse(200, playlist, "Video removed from playlist successfully")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new apiError(400, "Playlist id is essential for removing playlist");
  }

  const playlist = await Playlist.findByIdAndDelete(playlistId);

  if (!playlist) {
    throw new apiError(500, "Error while deleting playlist");
  }

  return res
    .status(200)
    .json(new apiResponse(200, playlist, "Playlist removed successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!playlistId) {
    throw new apiError(400, "Playlist id is necessary for updating playlist");
  }

  if (!name && !description) {
    throw new apiError(
      400,
      "Name or description is necessary for updating playlist"
    );
  }

  const playlist = await Playlist.findById(playlistId);

  if (name) {
    playlist.name = name;
  }

  if (description) {
    playlist.description = description;
  }

  await playlist.save({ saveBeforeValidation: false });

  return res
    .status(200)
    .json(new apiResponse(200, playlist, "Playlist updated successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
