import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div class="bg-gray-900 font-sans text-gray-100">
        <header class="fixed top-0 left-0 right-0 bg-gray-800 shadow-sm z-50">
          <nav class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
              <div class="flex items-center">
                <img
                  src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
                  alt="VideoShare"
                  class="h-8"
                />
                <span class="ml-2 text-xl font-bold">VideoShare</span>
              </div>

              <div class="flex-1 max-w-2xl mx-8">
                <div class="relative">
                  <input
                    type="text"
                    placeholder="Search videos..."
                    class="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:border-custom"
                  />
                  <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <button class="!rounded-button bg-custom text-white px-4 py-2 flex items-center">
                  <i class="fas fa-video mr-2"></i>
                  Upload
                </button>
                <button class="p-2 hover:bg-gray-700 rounded-full">
                  <i class="fas fa-bell text-gray-300"></i>
                </button>
                <div class="relative">
                  <button class="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <i class="fas fa-user text-gray-300"></i>
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <main class="mt-16 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex flex-col lg:flex-row gap-6">
            <div class="lg:w-8/12">
              <div class="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                <div
                  id="player"
                  data-plyr-provider="youtube"
                  data-plyr-embed-id="bTqVqk7FSmY"
                ></div>
              </div>

              <div class="mt-4">
                <h1 class="text-xl font-bold text-gray-100">
                  How to Build a Successful YouTube Channel in 2024
                </h1>

                <div class="flex items-center justify-between mt-4">
                  <div class="flex items-center space-x-4">
                    <div class="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                      <i class="fas fa-user text-gray-300"></i>
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-100">Creator Academy</h3>
                      <p class="text-sm text-gray-400">1.2M subscribers</p>
                    </div>
                    <button class="!rounded-button bg-custom text-white px-6 py-2">
                      Subscribe
                    </button>
                  </div>

                  <div class="flex items-center space-x-2">
                    <button class="!rounded-button bg-gray-700 px-4 py-2 flex items-center">
                      <i class="fas fa-thumbs-up mr-2"></i>
                      125K
                    </button>
                    <button class="!rounded-button bg-gray-700 px-4 py-2">
                      <i class="fas fa-thumbs-down"></i>
                    </button>
                    <button class="!rounded-button bg-gray-700 px-4 py-2">
                      <i class="fas fa-share mr-2"></i>
                      Share
                    </button>
                  </div>
                </div>

                <div class="mt-4 bg-gray-800 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <div class="text-sm text-gray-400">
                      <span>892,458 views</span>
                      <span class="mx-2">•</span>
                      <span>Feb 15, 2024</span>
                    </div>
                    <button class="text-sm text-gray-400">
                      <i class="fas fa-chevron-down"></i>
                    </button>
                  </div>
                  <p class="text-sm text-gray-300">
                    Learn the essential strategies and tips to grow your YouTube
                    channel in 2024. We'll cover everything from content
                    planning to audience engagement, monetization strategies,
                    and the latest platform features.
                  </p>
                </div>

                <div class="mt-6">
                  <h3 class="text-xl font-bold mb-4 text-gray-100">
                    Comments • 1,245
                  </h3>
                  <div class="flex items-start space-x-4">
                    <div class="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                      <i class="fas fa-user text-gray-300"></i>
                    </div>
                    <div class="flex-1">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        class="w-full p-2 border-b border-gray-600 bg-transparent text-gray-100 focus:outline-none focus:border-custom"
                      />
                    </div>
                  </div>

                  <div class="mt-6 space-y-4">
                    <div class="flex items-start space-x-4">
                      <div class="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <i class="fas fa-user text-gray-300"></i>
                      </div>
                      <div>
                        <div class="flex items-center">
                          <h4 class="font-medium text-gray-100">John Smith</h4>
                          <span class="mx-2 text-sm text-gray-400">
                            2 days ago
                          </span>
                        </div>
                        <p class="mt-1 text-gray-300">
                          Great video! These tips are really helpful for new
                          content creators.
                        </p>
                        <div class="flex items-center space-x-4 mt-2">
                          <button class="flex items-center space-x-1 text-gray-400">
                            <i class="fas fa-thumbs-up text-sm"></i>
                            <span class="text-sm">245</span>
                          </button>
                          <button class="flex items-center space-x-1 text-gray-400">
                            <i class="fas fa-thumbs-down text-sm"></i>
                          </button>
                          <button class="text-sm font-medium text-gray-400">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="lg:w-4/12">
              <div class="space-y-4">
                <div class="flex items-start space-x-2">
                  <div class="w-40 h-24 bg-gray-800 rounded-lg flex-shrink-0">
                    <img
                      src="https://creatie.ai/ai/api/search-image?query=A professional looking person talking to camera in a well-lit studio setup with clean minimal background, high quality video thumbnail for YouTube&width=160&height=96&orientation=landscape&flag=b4970413-641c-40c2-b3b6-f036bc1815b9&flag=ab4b153c-d487-4a12-ba25-682b3f68c2fc"
                      alt="Video thumbnail"
                      class="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 class="font-medium line-clamp-2 text-gray-100">
                      10 Advanced YouTube SEO Tips for 2024
                    </h3>
                    <p class="text-sm text-gray-400 mt-1">Tech Insights</p>
                    <p class="text-sm text-gray-400">458K views • 1 week ago</p>
                  </div>
                </div>

                <div class="flex items-start space-x-2">
                  <div class="w-40 h-24 bg-gray-800 rounded-lg flex-shrink-0">
                    <img
                      src="https://creatie.ai/ai/api/search-image?query=A person editing video on computer with professional setup and clean minimal background, high quality video thumbnail for YouTube&width=160&height=96&orientation=landscape&flag=3b1dca36-767a-4b61-a5a9-2c5ebbefc93c&flag=5f8d1c32-79ac-4590-88ad-1d3dae3cff68"
                      alt="Video thumbnail"
                      class="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 class="font-medium line-clamp-2 text-gray-100">
                      Video Editing Masterclass: Pro Tips
                    </h3>
                    <p class="text-sm text-gray-400 mt-1">Edit Pro</p>
                    <p class="text-sm text-gray-400">125K views • 3 days ago</p>
                  </div>
                </div>

                <div class="flex items-start space-x-2">
                  <div class="w-40 h-24 bg-gray-800 rounded-lg flex-shrink-0">
                    <img
                      src="https://creatie.ai/ai/api/search-image?query=A collection of camera gear and lighting equipment arranged professionally with clean minimal background, high quality video thumbnail for YouTube&width=160&height=96&orientation=landscape&flag=d2fb238d-6757-43c4-9e3f-2ebae3154677&flag=b7d9b6eb-bc68-4175-b20f-9073584e44d9"
                      alt="Video thumbnail"
                      class="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 class="font-medium line-clamp-2 text-gray-100">
                      Best Camera Gear for YouTube 2024
                    </h3>
                    <p class="text-sm text-gray-400 mt-1">Tech Review Hub</p>
                    <p class="text-sm text-gray-400">89K views • 5 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* <script>
      document.addEventListener("DOMContentLoaded", () => {
        const player = new Plyr("#player", {
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "settings",
            "fullscreen",
          ],
        });
      });
    </script> */}
      </div>
    </>
  );
}

export default App;
