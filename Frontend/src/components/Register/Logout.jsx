import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, resetUser } from "../../user.store/userThunk";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const handleLogout = () => {
    dispatch(logoutUser(navigate, user))
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log("Error: ", err);
        navigate("/logout");
      });
    // dispatch(resetUser());
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-96">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-btnPrimary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-8 h-8 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
              />
            </svg>
          </div>
        </div>
        <h2 className="mb-4 text-2xl font-bold text-center text-gray-200">
          Are you sure you want to logout?
        </h2>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-bold text-white transition rounded bg-btnPrimary hover:bg-btnDark"
          >
            Logout
          </button>
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 font-bold text-white transition bg-gray-700 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
