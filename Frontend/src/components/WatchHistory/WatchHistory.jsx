import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../utils/timeAgo";
import {
  clearHistory,
  fetchWatchHistory,
  removeHistory,
} from "../../user.store/userThunk";

function WatchHistory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const history = useSelector((state) => state.history.history);
  const [localHistory, setLocalHistory] = useState(history || []);

  const videoData = [
    {
      src: "https://i.pinimg.com/236x/44/c3/e2/44c3e202c972538399b153892236d11f.jpg",
      title: "10 Advanced YouTube SEO Tips for 2024",
      channel: "Tech Insights",
      views: "458K views • 1 week ago",
    },
    {
      src: "https://i.pinimg.com/236x/55/04/a4/5504a4ff6bfe89c2f1c189e750255a3a.jpg",
      title: "Video Editing MasterclassName: Pro Tips",
      channel: "Edit Pro",
      views: "125K views • 3 days ago",
    },
    {
      src: "https://i.pinimg.com/236x/42/34/a0/4234a09d822f38348ff5f98b793ced15.jpg",
      title: "Best Camera Gear for YouTube 2024",
      channel: "Tech Review Hub",
      views: "89K views • 5 days ago",
    },
    {
      src: "https://i.pinimg.com/236x/44/c3/e2/44c3e202c972538399b153892236d11f.jpg",
      title: "10 Advanced YouTube SEO Tips for 2024",
      channel: "Tech Insights",
      views: "458K views • 1 week ago",
    },
    {
      src: "https://i.pinimg.com/236x/55/04/a4/5504a4ff6bfe89c2f1c189e750255a3a.jpg",
      title: "Video Editing MasterclassName: Pro Tips",
      channel: "Edit Pro",
      views: "125K views • 3 days ago",
    },
    {
      src: "https://i.pinimg.com/236x/42/34/a0/4234a09d822f38348ff5f98b793ced15.jpg",
      title: "Best Camera Gear for YouTube 2024",
      channel: "Tech Review Hub",
      views: "89K views • 5 days ago",
    },
    {
      src: "https://i.pinimg.com/236x/44/c3/e2/44c3e202c972538399b153892236d11f.jpg",
      title: "10 Advanced YouTube SEO Tips for 2024",
      channel: "Tech Insights",
      views: "458K views • 1 week ago",
    },
    {
      src: "https://i.pinimg.com/236x/55/04/a4/5504a4ff6bfe89c2f1c189e750255a3a.jpg",
      title: "Video Editing MasterclassName: Pro Tips",
      channel: "Edit Pro",
      views: "125K views • 3 days ago",
    },
    {
      src: "https://i.pinimg.com/236x/42/34/a0/4234a09d822f38348ff5f98b793ced15.jpg",
      title: "Best Camera Gear for YouTube 2024",
      channel: "Tech Review Hub",
      views: "89K views • 5 days ago",
    },
  ];

  const handleRemoveHistory = (id) => {
    setLocalHistory((prev) =>
      prev.filter((state) => state._id.toString() !== id.toString())
    );
    dispatch(removeHistory(id));
  };

  useEffect(() => {
    dispatch(fetchWatchHistory());
    setLocalHistory(history || []);
  }, [dispatch]);

  const handleClearHistory = () => {
    setLocalHistory([]);

    dispatch(clearHistory());
  };

  return (
    <div className="min-h-screen bg-youDark">
      {localHistory?.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full h-screen space-y-3 text-white ">
          <FaHistory size={60} />
          <h2 className="text-2xl land:text-3xl">
            Keep track of what you watch
          </h2>
          <p className="text-sm">
            Watch history isn't viewable when signed out.{" "}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-3xl hover:bg-btnDark bg-btnPrimary"
          >
            Home
          </button>
        </div>
      )}

      <div className="relative pt-32 px-9 lap:px-44">
        <div className="flex flex-col space-y-6 text-white ">
          <h2 className="text-3xl">Watch History</h2>
          <h4 className="text-xl">Wednesday</h4>
        </div>

        <div className="relative flex flex-col w-full land:flex-row">
          <div className="order-2 w-3/4 pt-10 space-y-10 land:order-1 land:space-y-5 ">
            {localHistory.map((video, index) => (
              <div
                key={index}
                className="flex flex-col items-start w-4/5 p-5 space-y-3 transition-colors rounded-lg hover:bg-youLight land:space-x-4 land:flex-row"
              >
                <div className="flex-shrink-0 w-56 h-32 bg-gray-800 rounded-lg">
                  <img
                    src={video?.thumbnail}
                    alt="Video thumbnail"
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex flex-row justify-between land:w-[20rem] w-[15rem] ">
                    <h3 className="w-4/5 font-medium text-gray-100 truncate land:w-4/5 ">
                      {video?.title}
                    </h3>
                    <button
                      onClick={() => handleRemoveHistory(video?._id)}
                      className="px-1 py-1 rounded-full hover:bg-youBtn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="text-white size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-400">
                    {video.owner?.fullName}
                  </p>
                  <div className="flex flex-row items-center space-x-2">
                    <p className="text-sm text-gray-400">
                      {video.views?.length || "0"} Views •
                    </p>
                    <p className="text-sm text-gray-400">
                      {timeAgo(video?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="sticky flex flex-col order-1 py-10 space-y-6 bg-youDark top-16 land:order-2">
            <button className="sticky flex flex-row w-full p-2 space-x-2 text-gray-100 bg-transparent border-b border-gray-600 top-28 focus:outline-none focus:border-custom">
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
              <input
                type="text"
                placeholder="Search Watch History"
                className="w-full text-gray-100 bg-transparent focus:outline-none "
              />
            </button>
            <button
              onClick={handleClearHistory}
              className="sticky flex flex-row px-3 py-3 space-x-2 text-gray-100 top-44 rounded-3xl hover:bg-youBtn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>

              <span>Clear all watch history</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchHistory;
