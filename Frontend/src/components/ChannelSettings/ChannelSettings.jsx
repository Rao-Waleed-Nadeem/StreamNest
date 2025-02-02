import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateFullName,
  deleteUserVideo,
  updateAvatarImage,
  // getUserVideos,
  updateCoverImage,
  fetchWatchHistory,
} from "../../user.store/userThunk"; // Example actions
import { timeAgo } from "../../utils/timeAgo";
import { numberFormat } from "../../utils/numberFormat";
import { fetchVideos, getUserPlaylists } from "../../video.store/videoThunk";
import { useNavigate } from "react-router-dom";

const ChannelSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const videos = useSelector((state) => state.videos.videos);
  const [userVideos, setUserVideos] = useState(
    videos?.filter((video) => video?.owner?._id === user?._id)
  );

  console.log("User in settings: ", user);
  console.log("Videos in settings: ", videos);

  // let userVideos = videos?.filter((video) => video?.owner?._id === user?._id);

  console.log("userVideos: ", userVideos);

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    // dispatch(getUserVideos(user?._id));
  }, []);

  // Handlers for updating profile
  const handleUpdateCoverImage = () => {
    if (coverImage) {
      dispatch(updateCoverImage(coverImage)); // Replace with your action
      alert("Cover image updated!");
    }
  };

  const handleUpdateProfileImage = () => {
    if (profileImage) {
      dispatch(updateAvatarImage(profileImage)); // Replace with your action
      alert("Profile image updated!");
    }
  };

  const handleSaveFullName = () => {
    if (fullName.trim()) {
      dispatch(updateFullName(fullName)); // Replace with your action
      alert("Full name updated!");
    } else {
      alert("Full name cannot be empty.");
    }
  };

  const handleDeleteVideo = (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      // Optimistically remove the video from the UI
      // const updatedVideos = userVideos.filter((video) => video._id !== videoId);
      // userVideos = updatedVideos; // Update the local state immediately

      setUserVideos(userVideos.filter((video) => video._id !== videoId));

      // Dispatch the action to delete the video from the server
      dispatch(deleteUserVideo(videoId))
        .then(() => {
          dispatch(fetchVideos());
        })
        .catch((error) => {
          // If an error occurs, restore the video to the UI and alert the user
          setUserVideos([...updatedVideos, videoId]); // Restore the video if deletion fails
          alert("Error deleting video. Please try again.");
        });
    }
  };

  const handleWatchHistory = async () => {
    await dispatch(fetchWatchHistory());

    navigate("/history");
  };

  const handleAllPlaylists = async () => {
    await dispatch(getUserPlaylists(user?._id));

    navigate("/playlists");
  };

  return (
    <div className="min-h-screen p-4 text-gray-200 bg-youDark mt-14 md:p-8">
      {/* Header Section */}
      <div className="relative overflow-hidden shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
        <div className="absolute flex flex-col justify-end p-6 text-white bg-opacity-50 ">
          <h1 className="text-2xl font-bold md:text-4xl">
            Your Channel Settings
          </h1>
        </div>
        <img
          src={user?.coverImage || ""}
          alt="Cover"
          className="object-cover w-full h-40 md:h-64"
        />
        <form
          className="absolute bottom-4 right-4"
          encType="multipart/form-data"
        >
          <input
            type="file"
            accept="image/*"
            className="px-4 py-2 text-gray-200 rounded-md shadow cursor-pointer bg-violet-800 hover:bg-violet-900"
            id="coverImage"
            name="coverImage"
            onChange={(e) => setCoverImage(e.target.files[0])}
          />
          <button
            onClick={handleUpdateCoverImage}
            className="px-4 py-2 text-gray-200 rounded-md shadow cursor-pointer bg-violet-800 hover:bg-violet-900"
          >
            Update Cover Image
          </button>
        </form>
      </div>

      {/* Profile Section */}
      <div className="relative max-w-4xl p-6 mx-auto mt-8 shadow-lg bg-youLight rounded-2xl">
        <div className="absolute w-24 h-24 overflow-hidden border-4 border-white rounded-full shadow-lg -top-12 left-4 md:left-6 md:w-32 md:h-32">
          <img
            src={user?.avatar}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </div>
        <form className="ml-32 md:ml-40" encType="multipart/form-data">
          <input
            type="file"
            accept="image/*"
            className="px-4 py-2 mt-2 text-gray-200 rounded-md shadow cursor-pointer bg-btnPrimary hover:bg-btnDark"
            id="avatar"
            name="avatar"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
          <label
            htmlFor="profileImageInput"
            onClick={handleUpdateProfileImage}
            className="px-4 py-2 mt-2 text-gray-200 rounded-md shadow cursor-pointer bg-btnPrimary hover:bg-btnDark"
          >
            Update Profile Picture
          </label>
        </form>
        <div className="mt-12 md:mt-16">
          <h2 className="text-lg font-semibold">Full Name</h2>
          <input
            type="text"
            value={fullName}
            name="fullName"
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your Full Name"
            className="w-full px-3 py-2 mt-2 rounded-md bg-youMoreLight focus:outline-none focus:ring focus:ring-indigo-300"
          />
          <button
            onClick={handleSaveFullName}
            className="px-6 py-2 mt-4 text-gray-200 rounded-md shadow bg-btnPrimary hover:bg-btnDark"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Videos Section */}
      <div className="max-w-4xl p-6 mx-auto mt-10 shadow-lg bg-youLight rounded-2xl">
        <h3 className="mb-4 text-xl font-bold">Your Videos</h3>
        <div className="space-y-6">
          {userVideos?.map((video) => (
            <div
              key={video.id}
              className="flex items-center p-4 transition-all duration-300 rounded-lg shadow-md bg-youLight hover:bg-youMoreLight"
            >
              {/* Video Thumbnail */}
              <div className="flex-shrink-0 w-20 h-20 mr-4">
                <img
                  src={video.thumbnail}
                  alt="Video Thumbnail"
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>

              {/* Video Details */}
              <div className="flex-1">
                <h4 className="font-semibold truncate text-md">
                  {video.title}
                </h4>
                <div className="text-sm text-gray-500">
                  <div className="flex flex-row space-x-2">
                    <p>Views: {numberFormat(video.views.length)}</p>
                    <p>Likes: {numberFormat(video.likes)}</p>
                  </div>
                  <p>{timeAgo(video.createdAt)}</p>
                </div>
              </div>

              {/* Delete Button */}
              <div className="flex-shrink-0 ml-4">
                <button
                  onClick={() => handleDeleteVideo(video._id)}
                  className="px-4 py-2 text-gray-200 bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Settings */}
      <div className="max-w-4xl p-6 mx-auto mt-10 shadow-lg bg-youLight rounded-2xl">
        <h3 className="mb-4 text-xl font-bold">Additional Settings</h3>
        <div className="flex flex-row justify-between ">
          <ul className="space-y-4">
            <li>
              <button className="px-5 py-2 text-gray-200 rounded-md shadow w-44 bg-btnPrimary hover:bg-btnDark">
                Change Password
              </button>
            </li>
            <li>
              <button className="px-6 py-2 text-white bg-red-600 rounded-md shadow w-44 hover:bg-red-700">
                Delete Account
              </button>
            </li>
          </ul>
          <ul className="flex flex-col space-y-4">
            <li>
              <button
                onClick={handleWatchHistory}
                className="px-5 py-2 text-gray-200 rounded-md shadow w-36 bg-btnPrimary hover:bg-btnDark"
              >
                Watch History
              </button>
            </li>
            <li>
              <button
                onClick={handleAllPlaylists}
                className="px-6 py-2 text-gray-200 rounded-md shadow w-36 bg-btnPrimary hover:bg-btnDark"
              >
                All Playlist
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChannelSettings;
