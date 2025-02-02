import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideo, getTotalVideosSize } from "../../video.store/videoThunk";
import { getUserDetails } from "../../user.store/userThunk";
import { timeAgo } from "../../utils/timeAgo";

const Analytics = () => {
  const channelStats = {
    totalSubscribers: 12000,
    totalViews: 450000,
    totalLikes: 15000,
    totalComments: 3500,
    totalVideos: 80,
    mostPopularVideo: {
      title: "Advanced Coding Techniques",
      views: 120000,
      likes: 8000,
      comments: 1500,
      uploadDate: "2023-12-15",
    },
    videos: [
      {
        title: "React Tutorial for Beginners",
        views: 45000,
        likes: 1500,
        comments: 300,
        uploadDate: "2023-10-01",
      },
      {
        title: "Mastering JavaScript",
        views: 75000,
        likes: 2500,
        comments: 500,
        uploadDate: "2023-09-20",
      },
    ],
  };

  const user = useSelector((state) => state.user.user);
  const video = useSelector((state) => state.video.video);
  // const [userDetails, setUserDetails] = useState(null);
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const [totalViews, setTotalViews] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalSubscribers, setTotalSubscribers] = useState(
    userDetails.subscribers.subscriber?.length || 0
  );
  const [mostPopularVideo, setMostPopularVideo] = useState(null);
  const [totalComments, setTotalComments] = useState(0);
  const [totalVideos, setTotalVideos] = useState(
    userDetails.videos?.length || 0
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (user?._id) {
        await dispatch(getTotalVideosSize(user._id, setTotalVideos)); // Fetch total videos
        console.log("userId: ", user?._id);
        await dispatch(getUserDetails(user._id)); // Fetch user details
      }
    };

    fetchData();

    return () => {}; // ✅ Cleanup function (though not needed here)
  }, [user?._id]); // ✅ Include `user?._id` as a dependency

  useEffect(() => {
    const settingFunction = async () => {
      if (userDetails?.videos?.length > 0) {
        // Calculate totals
        setTotalComments(
          userDetails.videos.reduce(
            (sum, video) => sum + (video?.comments?.length || 0),
            0
          )
        );

        setTotalLikes(
          userDetails.videos.reduce(
            (sum, video) => sum + (video?.likes?.length || 0),
            0
          )
        );

        setTotalViews(
          userDetails.videos.reduce(
            (sum, video) => sum + (video?.views?.length || 0),
            0
          )
        );

        const popularVideo = userDetails.videos.reduce((max, video) =>
          video?.views > max?.views ? video : max
        );

        await dispatch(fetchVideo(popularVideo._id));

        setMostPopularVideo(video);

        console.log("Most Popular Video:", popularVideo);
      }
    };

    settingFunction();
  }, [userDetails]); // ✅ `useEffect` only runs when `userDetails` changes

  console.log("userDetails: ", userDetails);
  console.log("most popular: ", mostPopularVideo);

  return (
    <div className="h-screen p-6 mt-16 space-y-6 text-gray-100 bg-youDark">
      {/* Channel Overview */}
      <div className="p-6 bg-gray-800 rounded-lg">
        <h2 className="mb-4 text-2xl font-semibold">Channel Overview</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div>
            <p className="text-xl font-bold">{totalSubscribers}</p>
            <p>Subscribers</p>
          </div>
          <div>
            <p className="text-xl font-bold">{totalViews}</p>
            <p>Total Views</p>
          </div>
          <div>
            <p className="text-xl font-bold">{totalLikes}</p>
            <p>Total Likes</p>
          </div>
          <div>
            <p className="text-xl font-bold">{totalComments}</p>
            <p>Total Comments</p>
          </div>
          <div>
            <p className="text-xl font-bold">{totalVideos}</p>
            <p>Total Videos</p>
          </div>
        </div>
      </div>

      {/* Popular Video Insights */}
      {mostPopularVideo?.views?.length > 0 && (
        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="mb-4 text-2xl font-semibold">Most Popular Video</h2>
          <div className="flex items-start space-x-4">
            <div className="w-40 h-24 bg-gray-700 rounded-lg">
              <img
                className="object-cover w-40 h-24 bg-gray-700 rounded-lg"
                src={mostPopularVideo.thumbnail}
                alt=""
              />
            </div>
            <div>
              <h3 className="pb-1 text-lg font-medium">
                {mostPopularVideo.title}
              </h3>
              <p className="text-sm text-gray-400">
                Views: {mostPopularVideo.views?.length || 0} • Likes:{" "}
                {mostPopularVideo.likes?.length || 0} • Comments:{" "}
                {mostPopularVideo.comments?.length || 0}
              </p>
              <p className="text-sm text-gray-400">
                Uploaded {timeAgo(mostPopularVideo.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Video Performance */}
      {/* <div className="p-6 bg-gray-800 rounded-lg">
        <h2 className="mb-4 text-2xl font-semibold">Video Performance</h2>
        <div className="space-y-4">
          {channelStats.videos.map((video, index) => (
            <div
              key={index}
              className="flex items-start p-4 space-x-4 bg-gray-700 rounded-lg"
            >
              <div className="w-40 h-24 bg-gray-600 rounded-lg"></div>
              <div>
                <h3 className="font-medium">{video.title}</h3>
                <p className="text-sm text-gray-400">
                  Views: {video.views} • Likes: {video.likes} • Comments:{" "}
                  {video.comments}
                </p>
                <p className="text-sm text-gray-400">
                  Uploaded on {video.uploadDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Subscriber Growth (Placeholder for Chart/Graph) */}
      {/* <div className="p-6 bg-gray-800 rounded-lg">
        <h2 className="mb-4 text-2xl font-semibold">Subscriber Growth</h2>
        <div className="flex items-center justify-center h-32 bg-gray-700 rounded-lg">
          <p className="text-gray-400">Chart/Graph Placeholder</p>
        </div>
      </div> */}
    </div>
  );
};

export default Analytics;
