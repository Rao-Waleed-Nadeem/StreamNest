import { useSelector } from "react-redux";
import api from "../utils/api.js";
import {
  setVideos,
  setLoading,
  setError,
  setVideo,
  setComments,
  setPlaylist,
  setPlaylists,
  setUserVideos,
} from "./videoSlice.js";
import { getUserDetails } from "../user.store/userThunk.js";

// Define an async thunk for fetching videos
const fetchVideos = () => async (dispatch) => {
  try {
    await dispatch(setLoading(true)); // Set loading state to true before fetching

    const response = await api.get("/videos/all-videos");

    // console.log("response.data: ", response.data.data);

    await dispatch(setVideos(response.data.data)); // Set videos in the store
  } catch (error) {
    dispatch(setError(error.message)); // Set error in case of failure
  } finally {
    await dispatch(setLoading(false)); // Set loading state to false after fetch
  }
};

const fetchVideo = (videoId) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));

    const response = await api.get(`/videos/${videoId}`);
    dispatch(setVideo(response.data.data));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    await dispatch(setLoading(false));
  }
};

const addView = (videoId, userId) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));
    console.log("Adding view");
    const response = await api.patch(`/videos/${videoId}/${userId}`);
    console.log("After adding view: ", response.data.data);
    dispatch(setVideo(response.data.data));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    await dispatch(setLoading(false));
  }
};

const fetchComments = (videoId) => async (dispatch) => {
  console.log("2");
  try {
    await dispatch(setLoading(true));

    const response = await api.get(`/comments/${videoId}`);
    console.log("comments in thunk: ", response.data.data);
    dispatch(setComments(response.data.data));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    await dispatch(setLoading(false));
  }
};

const checkLike = (videoId, userId, setLiked) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));
    const response = await api.get(`/likes/${videoId}/${userId}`);
    // console.log("checkLike: ", response.data.data);
    setLiked(response.data.data);
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    await dispatch(setLoading(false));
  }
};

const toggleLike = (video, videoId, userId, liked) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));

    // Optimistically update the like state
    dispatch(
      setVideo({
        ...video,
        likes: liked ? video.likes - 1 : video.likes + 1,
      })
    );

    // Send the API request to toggle the like
    await api.post(`/likes/toggle/v/${videoId}`);

    // Optional: Refetch the updated like status from the server (to ensure consistency)
    const response = await api.get(`/videos/${videoId}`);
    await dispatch(setVideo(response.data.data));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    await dispatch(setLoading(false));
  }
};

const toggleCommentLike = (comments, comment, videoId) => async (dispatch) => {
  if (!comment) return;

  try {
    await dispatch(setLoading(true));

    // Call API to update backend
    await api.post(`/likes/toggle/c/${comment._id}`);
    console.log("1");
    // Re-fetch comments from backend (optional, for data consistency)
    await dispatch(fetchComments(videoId));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    await dispatch(setLoading(false));
  }
};

const addComment =
  (comment, videoId, user, setCommentLiked) => async (dispatch, getState) => {
    try {
      await dispatch(setLoading(true));
      const currentComments = getState().video.comments;

      // Optimistically update comments in the Redux store

      const response = await api.post(`/comments/${videoId}`, {
        content: comment,
      });

      console.log("comment new: ", response.data.data);
      setCommentLiked((prev) => [response.data.data, ...(prev || [])]);
      await dispatch(fetchComments(videoId));
      // const newComment = {
      //   _id: response.data.data._id, // Temporary ID until server responds
      //   content: comment,
      //   owner: {
      //     _id: user._id,
      //     avatar: user?.avatar,
      //     fullName: user?.fullName,
      //   }, // Add user info
      //   createdAt: response.data.data.createdAt,
      //   likes: [],
      //   totalLikes: 0,
      // };

      // console.log("new Comment: ", newComment);

      // dispatch(setComments([newComment, ...currentComments]));
      // dispatch(setComments(response.data.data));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      await dispatch(setLoading(false));
    }
  };

const getTotalVideosSize = (userId, setTotalVideos) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));
    const response = await api.get(`/videos/total-videos/${userId}`);
    console.log("total videos: ", response.data.data);
    setTotalVideos(response.data.data);
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    await dispatch(setLoading(false));
  }
};

const publishVideo =
  (videoFile, thumbnail, title, description) => async (dispatch) => {
    try {
      await dispatch(setLoading(true));
      const response = await api.post(
        "/videos",
        {
          title,
          description,
          videoFile,
          thumbnail,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type
          },
          withCredentials: true, // If using cookies for authentication
        }
      );

      console.log("Published Video: ", response.data.data);
      await dispatch(fetchVideos());
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      await dispatch(setLoading(false));
    }
  };

const toggleSubscribe = (videoId, channelId) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));
    const response = await api.post(`/subscriptions/c/${channelId}`);
    console.log("subscribe: ", response.data.data);
    await dispatch(fetchVideo(videoId));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    await dispatch(setLoading(false));
  }
};

const toggleSubscribeChannel = (channelId) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));
    const response = await api.post(`/subscriptions/c/${channelId}`);
    console.log("subscribe: ", response.data.data);
    await dispatch(getUserDetails(channelId));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    await dispatch(setLoading(false));
  }
};

const createPlaylist =
  (name, description, selectedVideos) => async (dispatch, getState) => {
    try {
      await dispatch(setLoading(true)); // Corrected: Use Redux action instead of setLoading()

      console.log("Videos: ", selectedVideos);

      // Create the playlist
      const response = await api.post("/playlists", { name, description });
      const newPlaylist = response.data.data;

      console.log("New Playlist: ", newPlaylist);

      if (!newPlaylist || !newPlaylist._id) {
        throw new Error("Failed to create playlist.");
      }

      // Add videos to the created playlist
      await Promise.all(
        selectedVideos.map((video) =>
          dispatch(addVideoToPlaylist(newPlaylist._id, video._id))
        )
      );

      return newPlaylist;
    } catch (err) {
      dispatch(setError(err.message));
      return null;
    } finally {
      await dispatch(setLoading(false)); // Corrected: Use Redux action instead of setLoading()
    }
  };

const addVideoToPlaylist = (playlistId, videoId) => async (dispatch) => {
  try {
    await dispatch(setLoading(true)); // Corrected: Use Redux action instead of setLoading()

    const response = await api.patch(`/playlists/add/${videoId}/${playlistId}`);

    console.log("Added video to playlist: ", response.data.data);

    await dispatch(setPlaylist(response.data.data));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    await dispatch(setLoading(false)); // Corrected: Use Redux action instead of setLoading()
  }
};

const getUserPlaylists = (userId) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));

    const response = await api.get(`/playlists/user/${userId}`);

    console.log("All playlists: ", response.data.data);

    await dispatch(setPlaylists(response.data.data));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    await dispatch(setLoading(false));
  }
};

const deletePlaylist = (playlistId) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));
    // console.log("playlist id: ", playlistId);
    const response = await api.delete(`/playlists/${playlistId}`);
    // console.log("Delete Playlist: ", response.data.data);
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    await dispatch(setLoading(false));
  }
};

const getPlaylistById = (playlistId) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));
    // console.log("playlisId: ", playlistId);
    const response = await api.get(`/playlists/${playlistId}`);

    // console.log("playlist by id: ", response.data.data);

    dispatch(setPlaylist(response.data.data));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    await dispatch(setLoading(false));
  }
};

const deleteVideoPlaylist =
  (videoId, playlistId, userId) => async (dispatch) => {
    try {
      await dispatch(setLoading(true));

      const response = await api.patch(
        `/playlists/remove/${videoId}/${playlistId}`
      );

      console.log("response: ", response.data.data);

      if (response.data.data.videos?.length === 0) {
        await dispatch(deletePlaylist(playlistId));
        await dispatch(getUserPlaylists(userId));
        window.location.href = "/playlists";
      } else await dispatch(setPlaylist(response.data.data));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      await dispatch(setLoading(false));
    }
  };

const getUserVideos = (userId) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));

    const response = await api.get(`/videos/${userId}`);

    console.log("user videos: ", response.data.data);

    await dispatch(setUserVideos(response.data.data));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    await dispatch(setLoading(false));
  }
};

export {
  fetchVideos,
  fetchVideo,
  addView,
  fetchComments,
  checkLike,
  toggleLike,
  addComment,
  toggleCommentLike,
  getTotalVideosSize,
  publishVideo,
  toggleSubscribe,
  createPlaylist,
  addVideoToPlaylist,
  getUserPlaylists,
  deletePlaylist,
  getPlaylistById,
  deleteVideoPlaylist,
  getUserVideos,
  toggleSubscribeChannel,
};
