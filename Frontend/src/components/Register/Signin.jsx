import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../../api.js";
import { loginUser, registerUser } from "../../user.store/userThunk.js";
import { useDispatch } from "react-redux";
import api from "../../utils/api.js";
import { useNavigate } from "react-router-dom";

function Signin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [googleForm, setGoogleForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser(formData))
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log("Error:", err);
        navigate("/signin");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGoogleInputChange = (e) => {
    const { name, value } = e.target;
    setGoogleForm({ ...googleForm, [name]: value });
  };

  const handleLoginError = (error) => {
    console.error("Google login error:", error);
    alert("An error occurred during Google login. Please try again.");
  };

  // Handles login success
  const handleLoginSuccess = async (authResult) => {
    try {
      if (authResult.code) {
        console.log("Authorization code:", authResult.code);

        // Exchange authorization code for user data
        const response = await googleAuth(authResult.code);
        const userData = response.data.data.user;
        console.log("userData: ", userData);

        // Set the user data in the parent component or Zustand store
        setUser({
          fullName: response.data.data.user.name,
          email: response.data.data.user.email,
          avatar: response.data.data.user.image,
        });

        return userData; // Return user data on successful login
      } else {
        console.error("Unexpected authResult:", authResult);
        throw new Error("Invalid response from Google login.");
      }
    } catch (error) {
      console.error("Error during Google login process:", error);
      alert("Failed to log in. Please try again.");
    }
  };

  const handleGoogle = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
    flow: "auth-code", // Using authorization code flow
  });

  const handleGoogleUsernamePassword = (e) => {
    e.preventDefault();
    const { username, password } = googleForm;

    const userData = {
      ...user, // Spread the existing user data
      username, // Add or update the username from the googleForm
      password, // Add or update the password from the googleForm
      googleUser: true, // Mark this user as a Google user
    };

    // Pass the combined object to dispatch
    dispatch(registerUser(userData))
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log("Error: ", err);
        navigate("/signin");
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen mt-10 bg-youDark">
      {/* Card Container */}
      {user ? (
        <div className="w-full max-w-md p-8 text-gray-200 rounded-lg shadow-lg bg-youLight">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12 text-btnPrimary"
            >
              <path
                fillRule="evenodd"
                d="M10.857 2.073C11.5 1.858 12.5 1.858 13.143 2.073 15.14 2.733 21 5 21 12s-5.86 9.267-7.857 9.927c-.643.215-1.643.215-2.286 0C8.86 21.267 3 19 3 12s5.86-9.267 7.857-9.927zM9.75 9.75a.75.75 0 01.75.75v3.5a.75.75 0 01-1.125.645l-2.75-1.75a.75.75 0 010-1.29l2.75-1.75a.75.75 0 01.375-.105zm4.5 0a.75.75 0 01.75.75v3.5a.75.75 0 01-1.125.645l-2.75-1.75a.75.75 0 010-1.29l2.75-1.75a.75.75 0 01.375-.105z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {/* Heading */}
          <h2 className="mb-4 text-2xl font-bold text-center text-gray-200">
            Your Username & Password For Login
          </h2>

          {/* Login Form */}
          <form
            onSubmit={handleGoogleUsernamePassword}
            encType="multipart/form-data"
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-200"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={googleForm.username}
                onChange={handleGoogleInputChange}
                required
                className="w-full px-4 py-2 mt-1 text-sm text-gray-200 rounded-lg bg-youMoreLight focus:ring-2 focus:ring-btnLight focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={googleForm.password}
                onChange={handleGoogleInputChange}
                required
                className="w-full px-4 py-2 mt-1 text-sm rounded-lg bg-youMoreLight focus:ring-2 focus:ring-btnLight focus:outline-none"
              />
            </div>
            <button
              type="submit"
              // onClick={handleGoogleUsernamePassword}
              className="w-full py-2 text-gray-200 rounded-lg bg-btnPrimary hover:bg-btnDark focus:outline-none focus:ring-4 focus:to-btnLight"
            >
              Log In
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-md p-8 text-gray-200 rounded-lg shadow-lg bg-youLight">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12 text-btnPrimary"
            >
              <path
                fillRule="evenodd"
                d="M10.857 2.073C11.5 1.858 12.5 1.858 13.143 2.073 15.14 2.733 21 5 21 12s-5.86 9.267-7.857 9.927c-.643.215-1.643.215-2.286 0C8.86 21.267 3 19 3 12s5.86-9.267 7.857-9.927zM9.75 9.75a.75.75 0 01.75.75v3.5a.75.75 0 01-1.125.645l-2.75-1.75a.75.75 0 010-1.29l2.75-1.75a.75.75 0 01.375-.105zm4.5 0a.75.75 0 01.75.75v3.5a.75.75 0 01-1.125.645l-2.75-1.75a.75.75 0 010-1.29l2.75-1.75a.75.75 0 01.375-.105z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {/* Heading */}
          <h2 className="mb-4 text-2xl font-bold text-center text-gray-200">
            Log in to Your Account
          </h2>
          <p className="mb-6 text-sm text-center text-gray-400">
            One account for all your favorite services.
          </p>
          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-200"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 mt-1 text-sm rounded-lg bg-youMoreLight focus:ring-2 focus:ring-btnLight focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 mt-1 text-sm rounded-lg bg-youMoreLight focus:ring-2 focus:ring-btnLight focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleGoogle}
              className="flex flex-row items-center justify-center w-full py-2 space-x-4 text-gray-200 rounded-lg bg-btnPrimary hover:bg-btnDark focus:outline-none focus:ring-4 focus:to-btnLight"
            >
              <FcGoogle size={25} />
              <span>Continue with Google</span>
            </button>
            <button
              type="submit"
              className="w-full py-2 text-gray-200 rounded-lg bg-btnPrimary hover:bg-btnDark focus:outline-none focus:ring-4 focus:to-btnLight"
            >
              Log In
            </button>
          </form>
          {/* Sign-up Link */}
          <p className="mt-4 text-sm text-center text-gray-400">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-btnDark hover:underline hover:text-btnDark"
            >
              Sign up
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default Signin;
