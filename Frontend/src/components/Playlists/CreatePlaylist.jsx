import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addVideoToPlaylist,
  createPlaylist,
  getUserPlaylists,
} from "../../video.store/videoThunk";
// import { Trash2 } from "lucide-react";

export default function CreatePlaylist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const videos = useSelector((state) => state.videos.videos);
  const [userVideos, setUserVideos] = useState(
    videos.filter((vid) => vid?.owner?._id === user?._id)
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [playlistLocal, setPlaylistLocal] = useState(null);

  const handleCreatePlaylist = async () => {
    if (!name.trim() || !description.trim() || selectedVideos.length === 0) {
      alert("Please fill all fields and select at least one video.");
      return;
    }

    // Create Playlist and wait for it to complete
    await dispatch(createPlaylist(name, description, selectedVideos));

    // Reset Form
    setName("");
    setDescription("");
    setSelectedVideos([]);
    await dispatch(getUserPlaylists(user?._id));
    navigate("/playlists");
  };

  const handleDeletePlaylist = (id) => {
    setPlaylists(playlists.filter((playlist) => playlist.id !== id));
  };

  return (
    <div className="min-h-screen p-6 text-white mt-14 bg-youDark md:p-12">
      <h1 className="mb-6 text-3xl font-bold text-center">Create a Playlist</h1>

      {/* Playlist Form */}
      <div className="max-w-3xl p-6 mx-auto rounded-lg shadow-md bg-youLight">
        <input
          type="text"
          placeholder="Playlist Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 text-white rounded-md bg-youMoreLight focus:ring-2 focus:ring-btnPrimary"
        />
        <textarea
          placeholder="Playlist Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-24 p-3 mb-4 text-white rounded-md bg-youMoreLight focus:ring-2 focus:ring-btnPrimary"
        />

        {/* Video Selection */}
        <h3 className="mb-2 text-lg font-semibold">Select Videos:</h3>
        <div className="grid grid-cols-3 gap-3">
          {userVideos.map((video) => (
            <div
              key={video._id}
              onClick={() =>
                setSelectedVideos((prev) =>
                  prev.find((v) => v._id === video._id)
                    ? prev.filter((v) => v._id !== video._id)
                    : [...prev, video]
                )
              }
              className={`cursor-pointer p-2 rounded-md transition-all ${
                selectedVideos.find((v) => v._id === video._id)
                  ? "bg-btnPrimary"
                  : "bg-youMoreLight"
              }`}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="object-cover w-full h-20 rounded-md"
              />
              <p className="mt-2 text-xs text-center">{video.title}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleCreatePlaylist}
          className="w-full p-3 mt-6 font-semibold text-white transition-all rounded-md bg-btnPrimary hover:bg-btnDark"
        >
          Create Playlist
        </button>
      </div>

      {/* Display Created Playlists */}
      {playlists.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-bold">Your Playlists</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="relative overflow-hidden transition-all rounded-lg shadow-md cursor-pointer bg-youLight hover:scale-105"
              >
                {/* Playlist Thumbnail (First Video's Thumbnail) */}
                {playlist.videos.length > 0 && (
                  <div className="relative">
                    <img
                      src={playlist.videos[0].thumbnail}
                      alt={playlist.title}
                      className="object-cover w-full h-44"
                    />
                    {/* Playlist Length Badge */}
                    <div className="absolute px-2 py-1 text-xs text-white rounded-md bottom-2 right-2 bg-black/70">
                      {playlist.videos.length} videos
                    </div>
                  </div>
                )}

                {/* Playlist Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">
                    {playlist.title}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    {playlist.description}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeletePlaylist(playlist.id)}
                  className="absolute px-5 transition-colors bg-red-600 rounded-md top-3 right-3 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
