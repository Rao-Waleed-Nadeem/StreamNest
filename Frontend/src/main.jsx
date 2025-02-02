import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Home from "./components/Home/Home.jsx";
import ErrorPage from "./components/Error-Page/Error-Page.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Main from "./components/Main/Main.jsx";
import Signup from "./components/Register/Signup.jsx";
import Signin from "./components/Register/Signin.jsx";
import WatchHistory from "./components/WatchHistory/WatchHistory.jsx";
import Analytics from "./components/Analytics/Analytics.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./utils/store.js";
import { PersistGate } from "redux-persist/integration/react";
import Logout from "./components/Register/Logout.jsx";
import ChannelSettings from "./components/ChannelSettings/ChannelSettings.jsx";
import UploadVideo from "./components/UploadVideo/UploadVideo.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import Playlists from "./components/Playlists/Playlists.jsx";
import PlaylistPage from "./components/Playlists/PlaylistPage.jsx";
import CreatePlaylist from "./components/Playlists/CreatePlaylist.jsx";
import ChannelPage from "./components/ChannelPage/ChannelPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Main /> },
      { path: "/signup", element: <Signup /> },
      { path: "/signin", element: <Signin /> },
      { path: "/logout", element: <Logout /> },
      { path: "/analytics", element: <Analytics /> },
      { path: "/upload-video", element: <UploadVideo /> },

      // Protected Routes
      {
        element: <ProtectedRoute />, // Wrap all protected routes
        children: [
          { path: "/home/:video_id", element: <Home /> },
          { path: "/home", element: <Home /> },
          { path: "/history", element: <WatchHistory /> },
          { path: "/settings", element: <ChannelSettings /> },
          { path: "/playlists", element: <Playlists /> },
          { path: "/channel-page/:userId", element: <ChannelPage /> },
          { path: "/create-playlist", element: <CreatePlaylist /> },
          { path: "/playlist/:playlistId", element: <PlaylistPage /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <GoogleOAuthProvider clientId="861548536977-uic07d2lpvj1cgb52q4ckkgupk91tf4h.apps.googleusercontent.com">
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </PersistGate>
  </Provider>
);
