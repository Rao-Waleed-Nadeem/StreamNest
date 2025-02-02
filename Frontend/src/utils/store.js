import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import videoReducer from "../video.store/videoSlice.js";
import userReducer from "../user.store/userSlice.js";
import tokenReducer from "./tokenSlice.js";
// Combine the reducers
const rootReducer = combineReducers({
  user: userReducer, // User slice
  videos: videoReducer, // Videos slice
  video: videoReducer,
  comments: videoReducer,
  userDetails: userReducer,
  history: userReducer,
  playlist: videoReducer,
  playlists: videoReducer,
  accessToken: tokenReducer,
  userVideos: videoReducer,
});

// Configure persistence
const persistConfig = {
  key: "root", // Root key for persistence
  storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);
