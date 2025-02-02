import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { timeAgo } from "../../utils/timeAgo";
import {
  addView,
  fetchVideo,
  toggleSubscribe,
  toggleSubscribeChannel,
} from "../../video.store/videoThunk";
import { useNavigate, useParams } from "react-router-dom";

const channel = {
  name: "Tech Guru",
  subscribers: "1.2M",
  coverImage: "https://via.placeholder.com/1280x400",
  avatar: "https://via.placeholder.com/150",
  videos: [
    {
      id: 1,
      title: "How to Build a PC",
      views: "500K",
      uploadedAt: "2 weeks ago",
      thumbnail: "https://via.placeholder.com/300x200",
    },
    {
      id: 2,
      title: "JavaScript Tips & Tricks",
      views: "320K",
      uploadedAt: "1 month ago",
      thumbnail: "https://via.placeholder.com/300x200",
    },
  ],
  playlists: [
    {
      id: 1,
      title: "Web Development Series",
      videos: [{ thumbnail: "https://via.placeholder.com/300x200" }],
    },
    {
      id: 2,
      title: "Machine Learning Basics",
      videos: [{ thumbnail: "https://via.placeholder.com/300x200" }],
    },
  ],
};

const ChannelPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("videos");
  const user = useSelector((state) => state.user?.user);
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const [isSubscribed, setIsSubscribed] = useState(
    user && userDetails.subscribers.subscriber?.includes(user?._id)
  );
  const [subs, setSubs] = useState(
    userDetails?.subscribers?.subscriber?.length || 0
  );

  console.log("userDetails: ", userDetails);

  const handleSubscribe = async () => {
    if (!isSubscribed) {
      setSubs((prev) => prev + 1);
    } else {
      setSubs((prev) => prev - 1);
    }
    setIsSubscribed((prev) => !prev);
    await dispatch(toggleSubscribeChannel(userDetails?._id));
    // dispatch(fetchVideo(video_id));
  };

  const handleNavigate = async (vid) => {
    console.log("vid: ", vid);
    if (!vid?.views?.includes(user?._id))
      await dispatch(addView(vid?._id, user?._id));
    // await dispatch(fetchComments(vid._id));
    await dispatch(fetchVideo(vid._id));

    navigate(`/home/${vid?._id}`);
  };

  return (
    <div className="min-h-screen pt-2 mx-auto mt-16 overflow-hidden text-white max-w-screen bg-youDark">
      {/* Cover Image */}
      <div className="relative w-full h-60 md:h-72">
        <img
          src={userDetails.coverImage}
          alt="Cover"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Channel Info */}
      <div className="flex flex-row justify-start lap:space-x-20">
        <div className="flex items-center p-4 md:p-10">
          <img
            src={userDetails.avatar}
            alt="Avatar"
            className="object-cover w-24 h-24 border-4 rounded-full border-youLight md:w-32 md:h-32"
          />
          <div className="ml-4">
            <h1 className="text-2xl font-bold md:text-3xl">
              {userDetails.fullName}
            </h1>
            <p className="text-gray-400">{subs} subscribers</p>
          </div>
        </div>
        {userId !== user?._id && (
          <button
            onClick={handleSubscribe}
            className={`!rounded-button border ${
              isSubscribed ? "bg-youDark text-white" : "bg-white"
            } rounded-3xl bg-custom text-black max-h-10 mt-24 mr-3  px-4 font-semibold text-sm tab:px-6 py-2`}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex px-8 overflow-x-auto border-b border-gray-600">
        <button
          className={`p-3 text-lg font-medium transition-all duration-300 ${
            activeTab === "videos"
              ? "border-b-4 border-btnPrimary text-btnPrimary"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("videos")}
        >
          Videos
        </button>
        <button
          className={`p-3 text-lg font-medium transition-all duration-300 ${
            activeTab === "playlists"
              ? "border-b-4 border-btnPrimary text-btnPrimary"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("playlists")}
        >
          Playlists
        </button>
      </div>

      {/* Content Section with Simple Transition */}
      <div className="relative w-full h-full p-6 md:p-10">
        <div
          className={`transition-all duration-300 ${
            activeTab === "videos"
              ? "translate-x-0 opacity-100 visible"
              : "-translate-x-full opacity-0 invisible"
          }`}
        >
          <div className="grid gap-6 m-8 md:grid-cols-2 lg:grid-cols-3">
            {userDetails.videos.length > 0 ? (
              userDetails.videos.map((video) => (
                <div
                  onClick={() => handleNavigate(video)}
                  key={video._id}
                  className="overflow-hidden transition rounded-lg shadow-md cursor-pointer bg-youLight hover:scale-105"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="object-cover w-full h-40"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold truncate">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {video.views?.length} views • {timeAgo(video.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-lg text-center text-gray-400 col-span-full">
                No videos available
              </div>
            )}
          </div>
        </div>

        <div
          className={` transition-all duration-300 ${
            activeTab === "playlists"
              ? "translate-x-0 opacity-100 visible"
              : "translate-x-full opacity-0 invisible"
          }`}
        >
          <div className="grid gap-6 m-8 md:grid-cols-2 lg:grid-cols-3">
            {userDetails.playlists.length > 0 ? (
              userDetails.playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="relative transition rounded-lg shadow-md bg-youLight hover:scale-105"
                >
                  {playlist.videosLength > 0 && (
                    <div className="relative">
                      <img
                        src={playlist.videos.thumbnail}
                        alt={playlist.name}
                        className="object-cover w-full h-40"
                      />
                      <div className="absolute px-2 py-1 text-xs text-white rounded-md bottom-2 right-2 bg-black/70">
                        {playlist.videosLength} videos
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold truncate">
                      {playlist.name}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-lg text-center text-gray-400 col-span-full">
                No playlist available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;
