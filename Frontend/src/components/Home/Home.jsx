import React, { useEffect, useState } from "react";
import { IoMdShareAlt } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  addView,
  fetchComments,
  checkLike,
  toggleLike,
  addComment,
  toggleCommentLike,
  fetchVideo,
  toggleSubscribe,
} from "../../video.store/videoThunk";
import { timeAgo } from "../../utils/timeAgo";
import { numberFormat } from "../../utils/numberFormat";
import { addHistory } from "../../user.store/userThunk";

function Home() {
  const { video_id } = useParams();
  const dispatch = useDispatch();
  const video = useSelector((state) => state.video.video);
  const user = useSelector((state) => state.user.user);
  const comments = useSelector((state) => state?.comments?.comments);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [commentLiked, setCommentLiked] = useState(comments || []);
  const [views, setViews] = useState(video?.views?.length || 0);
  const [isSubscribed, setIsSubscribed] = useState(
    video?.subscribers?.subscriber?.includes(user?._id) ? true : false
  );
  const [subs, setSubs] = useState(video?.subscribers?.subscriber?.length || 0);

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  // Handle submit of the comment
  const handleSubmit = (e) => {
    if (comment.trim()) {
      setComment(""); // Clear the input field
      // setCommentLiked(...comments, { newComment });
      dispatch(addComment(comment, video_id, user, setCommentLiked));
      setCommentLiked(comments);
    }
  };

  useEffect(() => {
    if (!video_id || !user?._id) return;

    const handleViewUpdate = async () => {
      // dispatch(fetchComments(video_id));
      // dispatch(checkLike(video_id, user?._id, setLiked));
      dispatch(addHistory(video_id));
      // dispatch(fetchVideo(video_id));
    };

    handleViewUpdate();
  }, []); // Ensure it runs only when needed

  const handleLike = () => {
    if (!user) return; // Ensure the user is logged in
    setLiked((prev) => !prev); // Optimistically toggle the like state
    dispatch(toggleLike(video, video_id, user?._id, liked));
  };

  const handleCommentLike = (comment) => {
    if (!user) return;

    setCommentLiked((prevComments) =>
      prevComments.map((com) =>
        com._id === comment._id
          ? {
              ...com,
              likes: com.likes.some((like) => like.likedBy === user._id)
                ? com.likes.filter((like) => like.likedBy !== user._id) // Remove user ID if already liked
                : [...com.likes, { likedBy: user._id }], // Add user ID if not already liked
              totalLikes: com.likes.some((like) => like.likedBy === user._id)
                ? com.totalLikes - 1
                : com.totalLikes + 1,
            }
          : com
      )
    );

    dispatch(toggleCommentLike(comments, comment, video_id));
  };

  console.log("video: ", video);
  console.log("user: ", user);
  console.log("subs: ", subs);

  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubscribe = () => {
    if (!isSubscribed) {
      setSubs((prev) => prev + 1);
    } else {
      setSubs((prev) => prev - 1);
    }
    setIsSubscribed((prev) => !prev);
    dispatch(toggleSubscribe(video?._id, video?.owner?._id));
    // dispatch(fetchVideo(video_id));
  };

  return (
    <div className="static min-w-full text-white mt-14 tab:px-4 bg-youDark">
      <main className="px-4 py-6 mx-auto bg-youtube max-w-8xl ph:px-6 lap:px-8">
        <div className="flex flex-col gap-6 lap:flex-row">
          <div className="lap:w-8/12">
            <div className="overflow-hidden bg-black rounded-lg aspect-video">
              <div className="relative w-full h-full">
                <img
                  src={video?.thumbnail || ""}
                  alt="Video Thumbnail"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            <div className="mt-3">
              <h1 className="text-xl font-bold text-gray-100">
                {video?.title}
              </h1>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center bg-gray-700 rounded-full">
                    <img
                      className="w-10 h-10 bg-gray-300 rounded-full"
                      src={
                        video?.owner?.avatar ||
                        "https://i.pinimg.com/236x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"
                      }
                      alt=""
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-100 truncate w-28 tab:w-32">
                      {video?.owner?.fullName || "user"}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {numberFormat(subs)} subscribers
                    </p>
                  </div>
                  <button
                    onClick={handleSubscribe}
                    className={`!rounded-button border ${
                      isSubscribed ? "bg-youDark text-white" : "bg-white"
                    } rounded-3xl bg-custom text-black  px-4 font-semibold text-sm tab:px-6 py-2`}
                  >
                    {isSubscribed ? "Subscribed" : "Subscribe"}
                  </button>
                </div>

                <div className="flex flex-row items-center space-x-2">
                  <button className="flex flex-row ">
                    <button
                      onClick={handleLike}
                      className="flex items-center px-6 py-2 text-sm font-semibold rounded-3xl bg-youBtn"
                    >
                      <i className="mr-2 fas fa-thumbs-up">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill={liked ? "currentColor" : "none"}
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                          />
                        </svg>
                      </i>

                      {video.likes}
                    </button>
                  </button>
                  <button className="flex px-3 py-2 space-x-2 text-sm font-semibold bg-youBtn min-w-20 rounded-3xl">
                    <IoMdShareAlt size={22} className="mr-1" />
                    Share
                  </button>
                </div>
              </div>

              <div className="h-auto p-4 pb-4 mt-4 overflow-hidden rounded-lg bg-youBtn">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">
                    <span>{views} views</span>
                    <span className="mx-2">•</span>
                    <span>{timeAgo(video?.createdAt)}</span>
                  </div>
                  <button className="text-sm text-gray-400">
                    <i className="fas fa-chevron-down"></i>
                  </button>
                </div>

                <div className="flex flex-row items-end">
                  <p
                    className={`text-sm text-gray-300 ${
                      isExpanded ? "" : "line-clamp-4"
                    }`}
                  >
                    {video?.description}
                    {isExpanded && (
                      <button
                        onClick={handleToggle}
                        className="pl-2 mt-2 text-sm font-medium text-gray-50"
                      >
                        {isExpanded ? " Less" : " More"}
                      </button>
                    )}
                  </p>
                  {!isExpanded && (
                    <button
                      onClick={handleToggle}
                      className="mt-2 text-sm font-medium text-gray-50"
                    >
                      {isExpanded ? "Less" : "More"}
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-4 text-xl font-bold text-gray-100">
                  Comments • {comments?.length || "0"}
                </h3>
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full">
                    <img
                      className="bg-gray-300 rounded-full"
                      src="https://i.pinimg.com/474x/a8/8a/3b/a88a3b1bd69b7a5e46e55574e50da65a.jpg"
                      alt=""
                    />
                  </div>
                  <div className="flex flex-row flex-1">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={handleChange}
                      className="w-[85%] p-2 text-gray-100 bg-transparent border-b border-gray-600 focus:outline-none focus:border-custom"
                    />
                    <button
                      onClick={handleSubmit}
                      className="px-3 py-2 space-x-2 text-sm bg-btnPrimary rounded-3xl"
                    >
                      Comment
                    </button>
                  </div>
                </div>

                {commentLiked?.map((comment, index) => (
                  <div key={index} className="mt-6 space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center bg-gray-700 rounded-full">
                        <img
                          className="w-10 h-10 bg-gray-300 rounded-full"
                          src={
                            comment.owner?.avatar ||
                            "https://i.pinimg.com/474x/a8/8a/3b/a88a3b1bd69b7a5e46e55574e50da65a.jpg"
                          }
                          alt=""
                        />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-100">
                            {comment.owner?.fullName}
                          </h4>
                          <span className="mx-2 text-sm text-gray-400">
                            {timeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-300">{comment.content}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <button
                            onClick={() => handleCommentLike(comment)}
                            className="flex items-center space-x-1 text-gray-400"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill={
                                comment?.likes?.some(
                                  (like) => like.likedBy === user._id
                                )
                                  ? "currentColor"
                                  : "none"
                              }
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                              />
                            </svg>

                            <span className="text-sm">
                              {comment.totalLikes}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lap:w-4/12">
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-40 h-24 bg-gray-800 rounded-lg">
                  <img
                    src="https://i.pinimg.com/236x/44/c3/e2/44c3e202c972538399b153892236d11f.jpg"
                    alt="Video thumbnail"
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-100 line-clamp-2">
                    10 Advanced YouTube SEO Tips for 2024
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">Tech Insights</p>
                  <p className="text-sm text-gray-400">
                    458K views • 1 week ago
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-40 h-24 bg-gray-800 rounded-lg">
                  <img
                    src="https://i.pinimg.com/236x/55/04/a4/5504a4ff6bfe89c2f1c189e750255a3a.jpg"
                    alt="Video thumbnail"
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-100 line-clamp-2">
                    Video Editing MasterclassName: Pro Tips
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">Edit Pro</p>
                  <p className="text-sm text-gray-400">
                    125K views • 3 days ago
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-40 h-24 bg-gray-800 rounded-lg">
                  <img
                    src="https://i.pinimg.com/236x/42/34/a0/4234a09d822f38348ff5f98b793ced15.jpg"
                    alt="Video thumbnail"
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-100 line-clamp-2">
                    Best Camera Gear for YouTube 2024
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">Tech Review Hub</p>
                  <p className="text-sm text-gray-400">
                    89K views • 5 days ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
