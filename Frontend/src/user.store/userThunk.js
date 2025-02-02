import axios from "axios";
import { setUser, setHistory, setUserDetails } from "./userSlice.js";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import { setAccessToken } from "../utils/tokenSlice.js";

// Define an async thunk for user registration
const registerUser = (formData) => async (dispatch) => {
  const data = {
    fullName: formData.fullName || formData.name,
    username: formData.username,
    email: formData.email,
    password: formData.password,
    avatar: formData?.avatar || formData?.image || "",
    coverImage: formData?.coverImage || "",
    googleUser: false,
  };

  console.log("data: ", data);

  try {
    const response = await axios.post(
      "http://localhost:8000/api/v1/users/register",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    localStorage.setItem("accessToken", response.data.data.accessToken);
    dispatch(setAccessToken(response.data.data.accessToken));
    console.log("user in thunk: ", response.data.data.user);
    console.log("accessToken in thunk: ", response.data.data.accessToken);

    // Dispatch the setUser action with the response data
    await dispatch(setUser(response.data.data.user));
  } catch (error) {
    console.error(
      "Error registering user:",
      error.response ? error.response.data : error.message
    );
  }
};

const currentUser = () => async (dispatch) => {
  try {
    const response = await api.get("/users/current-user");
    await dispatch(setUser(response.data.data));
  } catch (err) {
    dispatch(setUser(null));
    console.log(
      "Error fetching user: ",
      err.response ? err.response.data : err.message
    );
  }
};

const resetUser = () => async (dispatch) => {
  dispatch(setUser(null));
};

const loginUser = (formData) => async (dispatch) => {
  let data = {
    username: formData.username,
    password: formData.password,
    googleUser: false,
  };

  console.log("data: ", formData);

  try {
    const response = await api.post("/users/login", formData);
    localStorage.setItem("accessToken", response.data.data.accessToken);
    localStorage.setItem("refreshToken", response.data.data.refreshToken);
    dispatch(setAccessToken(response.data.data.accessToken));
    // dispatch(setRefreshToken(response.data.data.refreshToken));
    console.log("userData: ", response.data.data);
    await dispatch(setUser(response.data.data.user));
  } catch (err) {
    console.log(
      "Error in login user: ",
      err.response ? err.response.data : err.message
    );
  }
};

const logoutUser = (navigate, user) => async (dispatch) => {
  try {
    // const token = localStorage.getItem("accessToken");
    // if (!token) {
    //   console.log("No token found, user might not be logged in");
    //   return;
    // }

    console.log("user: ", user);

    const response = await api.post(
      "/users/logout",
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
        },
      }
    );
    console.log("logout response: ", response.data.data);
    await dispatch(setUser(null));
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/home");
  } catch (err) {
    console.log(
      "Error in logging out user: ",
      err.response ? err.response.data : err.message
    );
  }
};

const googleLogin = (formData) => async (dispatch) => {
  const data = new FormData();
  data.append("fullName", formData.name);
  data.append("username", formData.name);
  data.append("email", formData.email);
  data.append("avatar", formData.image);

  try {
    const response = await api.post("/users/google-login", data);

    // Dispatch the setUser action with the response data
    await dispatch(setUser(response.data.data));
    console.log("response.data", response.data.user);
  } catch (error) {
    console.error(
      "Error registering user:",
      error.response ? error.response.data : error.message
    );
  }
};

const getUserDetails = (userId) => async (dispatch) => {
  try {
    const response = await api.get(`/users/get-user-details/${userId}`);
    // console.log("userDetails: ", response.data.data);
    await dispatch(setUserDetails(response.data.data));
  } catch (err) {
    console.log("Error: ", err);
  }
};

const updateAvatarImage = (profileImage) => async (dispatch) => {
  try {
    // console.log("profile image: ", profileImage);
    const formData = new FormData();
    formData.append("avatar", profileImage);
    const response = await api.patch("/users/update-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("response of avatar: ", response.data.data);
  } catch (err) {
    console.log("Error: ", err);
  }
};

const updateCoverImage = (coverImage) => async (dispatch) => {
  try {
    // console.log("cover image: ", coverImage);
    const formData = new FormData();
    formData.append("coverImage", coverImage);
    const response = await api.patch("/users/update-cover-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("response of coverImage: ", response.data.data);
  } catch (err) {
    console.log("Error: ", err);
  }
};

const updateFullName = (fullName) => async (dispatch) => {
  try {
    console.log("fullName: ", fullName);
    const response = await api.patch(
      "/users/update-account",
      { fullName },
      {
        headers: {
          "Content-Type": "application/json", // Set the content type
        },
        withCredentials: true, // If using cookies for authentication
      }
    );
    console.log("account updated: ", response.data.data);
  } catch (err) {
    console.log("Error: ", err);
  }
};

const deleteUserVideo = (videoId) => async (dispatch) => {
  try {
    console.log("video Id: ", videoId);
    const response = await api.delete(`/videos/${videoId}`);

    console.log("Deleted Video: ", response.data.data);
  } catch (err) {
    console.log("Error: ", err);
  }
};

const addHistory = (videoId) => async (dispatch) => {
  try {
    const response = await api.patch(`/users/add-history/${videoId}`);

    console.log("Added watch history: ", response.data.data);
    dispatch(fetchWatchHistory());
  } catch (err) {
    console.log("Error: ", err);
  }
};

const removeHistory = (videoId) => async (dispatch) => {
  try {
    const response = await api.patch(`/users/remove-history/${videoId}`);

    console.log("Remove history: ", response.data.data);

    dispatch(fetchWatchHistory());
  } catch (err) {
    console.log("Error: ", err);
  }
};

const clearHistory = () => async (dispatch) => {
  try {
    const response = await api.patch("/users/clear-history");

    console.log("Clear history: ", response.data.data);

    dispatch(fetchWatchHistory());
  } catch (err) {
    console.log("Error: ", err);
  }
};

const fetchWatchHistory = () => async (dispatch) => {
  try {
    const response = await api.get("/users/history");
    // console.log("All history: ", response.data.data);
    await dispatch(setHistory(response.data.data));
  } catch (err) {
    console.log("Error: ", err);
  }
};

export {
  loginUser,
  registerUser,
  resetUser,
  currentUser,
  logoutUser,
  googleLogin,
  getUserDetails,
  updateFullName,
  deleteUserVideo,
  updateAvatarImage,
  updateCoverImage,
  addHistory,
  removeHistory,
  clearHistory,
  fetchWatchHistory,
};
