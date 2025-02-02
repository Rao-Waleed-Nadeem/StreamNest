import { createSlice } from "@reduxjs/toolkit";

// Initial state for videos
const initialState = {
  videos: [],
  video: null,
  comments: [],
  loading: false,
  error: null,
  playlist: null,
  playlists: [],
  userVideos: [],
};

// Create the slice
export const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    // Action to set videos
    setVideos: (state, action) => {
      // console.log("videos in slice: ", action.payload);
      state.videos = action.payload; // Set the videos array
    },
    setVideo: (state, action) => {
      state.video = action.payload;
    },
    pushVideo: (state, action) => {
      state.videos.push(action.payload);
    },
    setComments: (state, action) => {
      state.comments = action.payload;
    },
    setPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
    setPlaylists: (state, action) => {
      state.playlists = action.payload;
    },
    // Action to set loading state
    setLoading: (state, action) => {
      state.loading = action.payload; // Set loading state
    },
    // Action to set error
    setError: (state, action) => {
      state.error = action.payload; // Set error state
    },
    setUserVideos: (state, action) => {
      state.userVideos = action.payload;
    },
  },
});

// Export actions
export const {
  setVideos,
  setLoading,
  setError,
  pushVideo,
  setVideo,
  setComments,
  setPlaylist,
  setPlaylists,
  setUserVideos,
} = videoSlice.actions;

// Export the reducer
export default videoSlice.reducer;
