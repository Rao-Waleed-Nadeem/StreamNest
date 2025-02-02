import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchVideos,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
} from "../../video.store/videoThunk";

function Playlists() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const playlists = useSelector((state) => state.playlists.playlists);
  const [localPlaylists, setLocalPlaylists] = useState(playlists || []);

  // console.log("All playlists: ", playlists);

  const handleCreatePlaylist = async () => {
    await dispatch(fetchVideos());
    navigate("/create-playlist");
  };

  const handleDeletePlaylist = async (id) => {
    setLocalPlaylists(localPlaylists.filter((playlist) => playlist._id !== id));
    // console.log("Playlist id: ", id);
    await dispatch(deletePlaylist(id));
    await dispatch(getUserPlaylists(user?._id));
  };

  return (
    <div className="min-h-screen p-6 text-white mt-14 bg-youDark md:p-12">
      <h1 className="mb-6 text-3xl font-bold text-center">All Playlists</h1>

      <div className="mt-10">
        <h2 className="mb-4 text-2xl font-bold">Your Playlists</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Create New Playlist Card */}
          <div
            onClick={handleCreatePlaylist}
            className="flex flex-col items-center justify-center transition-all rounded-lg shadow-md cursor-pointer h-60 bg-youLight hover:scale-105"
          >
            <div className="flex items-center self-center justify-center w-16 h-16 text-3xl font-bold text-white rounded-full place-self-center bg-btnPrimary">
              +
            </div>
            <p className="mt-4 text-lg font-semibold">Create New Playlist</p>
          </div>

          {/* ✅ Corrected Conditional Rendering of Playlists */}
          {localPlaylists.length > 0 &&
            localPlaylists.map((playlist) => (
              <div className="relative overflow-hidden transition-all rounded-lg shadow-md cursor-pointer bg-youLight hover:scale-105">
                <button
                  onClick={async () => {
                    await dispatch(getPlaylistById(playlist?._id));
                    navigate(`/playlist/${playlist._id}`);
                  }}
                  key={playlist.id}
                  className="w-full h-full"
                >
                  {/* Playlist Thumbnail (First Video's Thumbnail) */}
                  {playlist.videos.length > 0 && (
                    <div className="relative">
                      <img
                        src={playlist?.videos[0]?.thumbnail || ""}
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
                </button>
                <button
                  onClick={() => handleDeletePlaylist(playlist._id)}
                  className="absolute px-5 transition-colors bg-red-600 rounded-md top-3 right-3 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Playlists;
