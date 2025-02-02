import axios from "axios";
import { store } from "../utils/store"; // Redux/Zustand store
import { resetUser, logoutUser, currentUser } from "../user.store/userThunk";
import { setAccessToken } from "./tokenSlice";

const api = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:8000/api/v1",
});

// ✅ Request Interceptor: Attach access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["Content-Type"] = "application/json"; // Ensure JSON request
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor: Handle 401 errors & refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refreshToken");

    if (
      error.response?.status === 401 &&
      error.response.data?.message?.includes("Unauthorized") &&
      !originalRequest._retry
    ) {
      console.warn("Token expired. Attempting refresh...");

      originalRequest._retry = true; // Prevent infinite loop

      if (!refreshToken) {
        console.error("No refresh token available. Logging out...");
        store.dispatch(logoutUser());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/signin";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          "http://localhost:8000/api/v1/users/refresh-token",
          { refreshToken }, // Send refresh token in body
          {
            withCredentials: true,
          }
        );

        const newAccessToken = res.data?.accessToken;
        if (!newAccessToken) {
          throw new Error("Token refresh failed");
        }

        console.log("New Access Token:", newAccessToken);
        localStorage.setItem("accessToken", newAccessToken);
        store.dispatch(setAccessToken(newAccessToken));
        store.dispatch(currentUser());

        // Retry original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token request failed:", refreshError);
        store.dispatch(logoutUser());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/signin";
      }
    }

    if (error.response?.status === 403 || error.response?.status === 400) {
      console.error("Forbidden/Bad Request. Logging out...");
      store.dispatch(logoutUser());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/signin";
    }

    return Promise.reject(error);
  }
);

export default api;
