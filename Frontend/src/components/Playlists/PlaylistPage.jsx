import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { timeAgo } from "../../utils/timeAgo";
import { numberFormat } from "../../utils/numberFormat";
import {
  addVideoToPlaylist,
  addView,
  deleteVideoPlaylist,
  fetchVideo,
  fetchVideos,
  getPlaylistById,
} from "../../video.store/videoThunk";
import { currentUser } from "../../user.store/userThunk";

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const videos = useSelector((state) => state.videos.videos);
  const user = useSelector((state) => state.user.user);
  const playlist = useSelector((state) => state.playlist.playlist);
  const [isAdding, setIsAdding] = useState(false);
  const [localPlaylist, setLocalPlaylist] = useState(playlist);
  const [selectedVideos, setSelectedVideos] = useState([]);

  useEffect(() => {
    dispatch(getPlaylistById(playlist?._id));
    dispatch(fetchVideos());
    dispatch(currentUser());
    setLocalPlaylist(playlist);
  }, []);

  if (!playlist)
    return <p className="text-center text-red-500">Playlist not found!</p>;

  // Get videos not in the current playlist
  let newVideos = videos.filter(
    (video) => !playlist.videos.some((v) => v._id === video._id)
  );

  newVideos = newVideos.filter((vid) => vid?.owner?._id === user?._id);

  const handleVideoSelection = (video) => {
    setSelectedVideos((prev) =>
      prev.some((v) => v._id === video._id)
        ? prev.filter((v) => v._id !== video._id)
        : [...prev, video]
    );
  };

  const handleConfirmAddVideos = () => {
    // console.log("Adding videos:", selectedVideos);
    setLocalPlaylist((prevPlaylist) => ({
      ...prevPlaylist,
      videos: [
        ...selectedVideos.map((vid) => videos.find((v) => v._id === vid._id)),
        ...prevPlaylist.videos,
      ],
    }));
    // Dispatch actions to add videos to the playlist
    selectedVideos?.map(async (vid) => {
      await dispatch(addVideoToPlaylist(playlist?._id, vid?._id));
    });

    // Update the localPlaylist by adding the new videos to the correct videos array

    // Clear selected videos and close the adding state
    setSelectedVideos([]);
    setIsAdding(false);
  };

  const handleDeletePlaylist = async (videoId) => {
    setLocalPlaylist((prevPlaylist) => ({
      ...prevPlaylist, // Keep all other properties unchanged
      videos: prevPlaylist.videos.filter((video) => video._id !== videoId), // Remove the specific video
    }));

    await dispatch(deleteVideoPlaylist(videoId, playlist._id, user._id));
  };

  return (
    <div className="min-h-screen p-6 mt-14 bg-youDark">
      {/* Playlist Info */}
      <div className="max-w-4xl p-6 mx-auto text-center rounded-lg shadow-lg bg-youLight">
        <h2 className="text-3xl font-bold text-white">{playlist.title}</h2>
        <p className="mt-2 text-gray-400">{playlist.description}</p>
        <button
          onClick={() => setIsAdding(true)}
          className="px-5 py-2 mt-4 text-white transition-all rounded-md bg-btnPrimary hover:bg-opacity-80"
        >
          + Add New Video
        </button>
      </div>

      {/* Playlist Videos */}
      <div className="grid gap-6 mt-8 md:grid-cols-3 sm:grid-cols-2">
        {localPlaylist.videos.map((video) => (
          <div
            className="relative"
            // className="relative p-3 transition rounded-lg shadow-md bg-youMoreLight hover:scale-105"
          >
            <button
              onClick={() => handleDeletePlaylist(video._id)}
              className="absolute z-10 px-4 py-1 text-sm font-semibold text-white transition bg-red-600 rounded-md shadow-md top-4 right-4 hover:bg-red-700"
            >
              Delete
            </button>
            <div
              onClick={async () => {
                await dispatch(addView(video?._id, user?._id));
                await dispatch(fetchVideo(video._id));
                navigate(`/home/${video._id}`);
              }}
              key={video._id}
              className="p-3 transition rounded-lg shadow-md bg-youMoreLight hover:scale-105"
            >
              {/* Delete Button at Top Right */}

              <img
                src={video.thumbnail}
                alt={video.title}
                className="object-cover w-full h-40 rounded-md"
              />
              <div className="flex flex-row mt-3 space-x-3">
                <button className="p-[.1rem] rounded-full bg-btnPrimary">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={video.owner?.avatar}
                    alt=""
                  />
                </button>
                <h3 className="mt-2 font-semibold text-white text-start">
                  {video.title}
                </h3>
              </div>
              <div className="flex space-x-3 text-xs text-gray-400">
                <span className="ml-12">{video.views?.length} views</span>
                <span>{timeAgo(video.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Videos Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="w-11/12 max-w-2xl p-6 rounded-lg shadow-xl bg-youLight">
            <h3 className="mb-4 text-xl font-semibold text-center text-white">
              Select Videos to Add
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {newVideos.length > 0 ? (
                newVideos.map((video) => (
                  <div
                    key={video._id}
                    onClick={() => handleVideoSelection(video)}
                    className={`cursor-pointer p-2 rounded-md transition-all ${
                      selectedVideos.some((v) => v._id === video._id)
                        ? "bg-btnPrimary text-white"
                        : "bg-youMoreLight text-gray-300"
                    }`}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="object-cover w-full h-20 rounded-md"
                    />
                    <p className="mt-2 text-xs text-center">{video.title}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No new videos available
                </p>
              )}
            </div>

            {/* Confirm & Cancel Buttons */}
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddVideos}
                className="px-4 py-2 text-white rounded-md bg-btnPrimary hover:bg-opacity-80"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;
