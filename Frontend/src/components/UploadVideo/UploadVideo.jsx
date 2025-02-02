import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos, publishVideo } from "../../video.store/videoThunk";
import { useNavigate } from "react-router-dom";

const UploadVideo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleVideoUpload = (e) => {
    if (e.target.files.length > 0) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleThumbnailUpload = (e) => {
    if (e.target.files.length > 0) {
      setThumbnail(e.target.files[0]);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile || !thumbnail || !title.trim() || !description.trim()) {
      alert("Please fill all fields and upload files.");
      return;
    }

    try {
      // Simulate form submission
      console.log({
        videoFile: videoFile.name,
        thumbnail: thumbnail.name,
        title,
        description,
      });

      // Publish the video
      await dispatch(publishVideo(videoFile, thumbnail, title, description));

      // Fetch videos after successful publish
      // await dispatch(fetchVideos());

      // Navigate to home on success
      navigate("/");

      // Reset form
      setVideoFile(null);
      setThumbnail(null);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error:", err);

      // Handle errors by redirecting
      navigate("/upload-video");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 text-gray-200 bg-gray-900 mt-14">
      <div className="w-full max-w-3xl p-6 bg-gray-800 shadow-lg rounded-xl">
        <h2 className="mb-6 text-2xl font-bold text-center">Publish Video</h2>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          {/* Video Upload */}
          <div>
            <label className="block mb-2 text-sm font-semibold">
              Upload Video
            </label>
            <input
              type="file"
              accept="video/*"
              required
              name="videoFile"
              onChange={handleVideoUpload}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {videoFile && (
              <p className="mt-1 text-sm text-green-400">
                Selected: {videoFile.name}
              </p>
            )}
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block mb-2 text-sm font-semibold">
              Upload Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              required
              name="thumbnail"
              onChange={handleThumbnailUpload}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {thumbnail && (
              <p className="mt-1 text-sm text-green-400">
                Selected: {thumbnail.name}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-semibold">Title</label>
            <input
              type="text"
              value={title}
              required
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-semibold">
              Description
            </label>
            <textarea
              value={description}
              required
              name="description"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              className="w-full h-24 p-2 bg-gray-700 border border-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white transition duration-300 bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Publish Video
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;
