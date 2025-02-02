import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addView,
  checkLike,
  fetchComments,
  fetchVideo,
  fetchVideos,
  getUserVideos,
} from "../../video.store/videoThunk.js";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../utils/timeAgo.js";
import { getUserDetails } from "../../user.store/userThunk.js";

function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const videos = useSelector((state) => state.videos.videos);
  // const video = Array.from({ length: 12 }); // Simulate an array of 12 videos
  const video = useSelector((state) => state.video.video);
  const comments = useSelector((state) => state.comments.comments);

  const [localVideos, setLocalVideos] = useState(videos);

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

  // console.log("videos: ", videos);
  // console.log("user: ", user);

  const handleNavigate = async (vid) => {
    console.log("vid: ", vid);
    if (!vid?.views?.includes(user?._id))
      await dispatch(addView(vid?._id, user?._id));
    // await dispatch(fetchComments(vid._id));
    await dispatch(fetchVideo(vid._id));

    navigate(`/home/${vid?._id}`);
  };

  const handleChannel = async (vid) => {
    await dispatch(getUserDetails(vid?.owner?._id));
    navigate(`/channel-page/${vid?.owner?._id}`);
  };

  return (
    <div className="mt-16 bg-youDark tab:p-16 ph:p-12">
      <div className="grid gap-10 lap:grid-cols-3 tab:grid-cols-2 ph:grid-cols-1">
        {localVideos?.map((vid, index) => (
          <div
            key={index}
            onClick={() => handleNavigate(vid)}
            className="overflow-hidden rounded-lg shadow-md bg-youLight"
          >
            {/* Thumbnail */}
            <button className="w-full aspect-video">
              <img
                src={vid?.thumbnail}
                alt="Video Thumbnail"
                className="object-cover w-full h-full"
              />
            </button>

            {/* Video Details */}
            <div className="flex p-4">
              {/* Channel Avatar - Stop Propagation Here */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent handleNavigate from firing
                  handleChannel(vid);
                }}
                className="flex-shrink-0"
              >
                <img
                  src={vid?.owner?.avatar}
                  alt="Channel Avatar"
                  className="w-10 h-10 rounded-full"
                />
              </button>

              {/* Video Info */}
              <div className="ml-4">
                <h3 className="pb-1 text-base font-semibold text-gray-200 truncate">
                  {vid?.title}
                </h3>
                <p className="text-xs text-gray-400">{vid?.owner?.fullName}</p>
                <p className="text-xs text-gray-400">
                  {vid?.views?.length || "0"} views · {timeAgo(vid?.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;
