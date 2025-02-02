import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { currentUser } from "../../user.store/userThunk";
import SideDrawer from "../SideDrawer/SideDrawer";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(currentUser());
  }, [currentUser]);

  // console.log("user in header: ", user);

  // console.log("user: ", user.accessToken);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Logic for handling the search (e.g., making an API call) can go here
    console.log("Search submitted!");
    setIsSearchOpen(false); // Close the search bar after submission
  };

  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <SideDrawer isOpen={isOpen} toggleDrawer={toggleDrawer} />
      <header className="fixed top-0 z-10 w-full py-1 text-white shadow-sm bg-youDark">
        <nav className="px-4 mx-auto max-w-8xl ph:px-6 lap:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex flex-row space-x-4">
              <button onClick={toggleDrawer}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-9"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {/* Logo */}
              <button
                onClick={() => navigate("/")}
                className="flex items-center "
              >
                <img
                  src="https://plus.unsplash.com/premium_photo-1736458633965-b19df4cced58?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D"
                  alt="VideoShare"
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden ml-2 text-xl font-bold land:block">
                  StreamNest
                </span>
              </button>
            </div>
            {/* Search Section */}
            <div className="flex-1 max-w-2xl mx-6 tab:hidden tab:mx-8">
              {!isSearchOpen ? (
                <button
                  className="p-2 rounded-full hover:bg-gray-700"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </button>
              ) : (
                <form
                  className="relative flex items-center transition-all duration-500"
                  onSubmit={handleSearchSubmit}
                >
                  <input
                    type="text"
                    placeholder="Search videos..."
                    className={`py-2 pl-10 pr-4 text-gray-100 bg-youBtn border border-gray-600 rounded-lg focus:outline-none focus:border-custom transition-all duration-500 ${
                      isSearchOpen ? "w-full" : "w-0"
                    }`}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute text-gray-400 left-2 top-[0.6rem]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                  </button>
                </form>
              )}
            </div>

            <form className="relative hidden w-1/3 tab:block">
              <input
                type="text"
                placeholder="Search videos..."
                className="w-full py-2 pl-10 text-gray-100 border border-gray-600 rounded-3xl pr-44 bg-youMoreLight focus:outline-none focus:border-custom"
              />
              <button
                type="submit"
                className="absolute text-gray-400 left-2 top-[0.6rem]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </form>

            {/* Other Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/upload-video")}
                className="!rounded-button bg-custom text-white tab:px-4 py-2 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                  />
                </svg>
                <span className="hidden tab:block">Upload</span>
              </button>

              {/* <button className="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button> */}
              {user ? (
                <button
                  onClick={() => navigate("/logout")}
                  className="flex flex-row px-1 py-1 space-x-2 text-sm rounded-full bg-btnPrimary"
                >
                  <img
                    src={
                      user?.avatar ||
                      "https://i.pinimg.com/236x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"
                    }
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                </button>
              ) : (
                <button
                  onClick={() => navigate("/signin")}
                  className="flex flex-row px-3 py-2 space-x-2 text-sm bg-btnPrimary rounded-3xl"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
