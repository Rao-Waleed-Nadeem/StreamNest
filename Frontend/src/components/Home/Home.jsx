import React from "react";

function Home() {
  return (
    <div className="static min-w-full px-4 text-white bg-gray-800">
      <header className="sticky top-0 py-3 bg-gray-800 shadow-sm ">
        <nav className="px-4 mx-auto max-w-8xl ph:px-6 lap:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img
                src="https://plus.unsplash.com/premium_photo-1736458633965-b19df4cced58?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D"
                alt="VideoShare"
                className="h-8"
              />
              <span className="ml-2 text-xl font-bold">VideoShare</span>
            </div>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search videos..."
                  className="w-full py-2 pl-10 pr-4 text-gray-100 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-custom"
                />
                <i className="absolute text-gray-400 left-2 top-[0.6rem]">
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
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </i>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="!rounded-button bg-custom text-white px-4 py-2 flex items-center">
                <i className="mr-2 fas fa-video">
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
                      d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                    />
                  </svg>
                </i>
                Upload
              </button>
              <button className="p-2 rounded-full hover:bg-gray-700">
                <i className="text-gray-300 fas fa-bell">
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
                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                    />
                  </svg>
                </i>
              </button>
              <div className="relative">
                <button className="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full">
                  <i className="text-gray-300 fas fa-user">
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
                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </i>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <main className="px-4 py-6 mx-auto bg-gray-800 max-w-8xl ph:px-6 lap:px-8">
        <div className="flex flex-col gap-6 lap:flex-row">
          <div className="lap:w-8/12">
            <div className="overflow-hidden bg-black rounded-lg aspect-video">
              <div>
                <img
                  src="https://i.pinimg.com/236x/2b/da/b0/2bdab0f6dfcc57b5842d2e42b2a1ed95.jpg"
                  alt=""
                />
              </div>
            </div>

            <div className="mt-4">
              <h1 className="text-xl font-bold text-gray-100">
                How to Build a Successful YouTube Channel in 2024
              </h1>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full">
                    <img
                      className="bg-gray-300 rounded-full"
                      src="https://i.pinimg.com/474x/a8/8a/3b/a88a3b1bd69b7a5e46e55574e50da65a.jpg"
                      alt=""
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-100">
                      Creator Academy
                    </h3>
                    <p className="text-sm text-gray-400">1.2M subscribers</p>
                  </div>
                  <button className="!rounded-button bg-custom text-white px-6 py-2">
                    Subscribe
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="!rounded-button rounded-lg bg-gray-700 px-4 py-2 flex items-center">
                    <i className="mr-2 fas fa-thumbs-up">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
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
                    125K
                  </button>
                  <button className="!rounded-button rounded-lg bg-gray-700 px-4 py-2">
                    <i className="fas fa-thumbs-down">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z" />
                      </svg>
                    </i>
                  </button>
                  <button className="!rounded-button bg-gray-700 px-2 min-w-20 flex space-x-2 rounded-lg py-2">
                    <i className="mr-2 fas fa-share">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                        />
                      </svg>
                    </i>
                    Share
                  </button>
                </div>
              </div>

              <div className="p-4 mt-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">
                    <span>892,458 views</span>
                    <span className="mx-2">•</span>
                    <span>Feb 15, 2024</span>
                  </div>
                  <button className="text-sm text-gray-400">
                    <i className="fas fa-chevron-down"></i>
                  </button>
                </div>
                <p className="text-sm text-gray-300">
                  Learn the essential strategies and tips to grow your YouTube
                  channel in 2024. We'll cover everything from content planning
                  to audience engagement, monetization strategies, and the
                  latest platform features.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="mb-4 text-xl font-bold text-gray-100">
                  Comments • 1,245
                </h3>
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full">
                    <img
                      className="bg-gray-300 rounded-full"
                      src="https://i.pinimg.com/474x/a8/8a/3b/a88a3b1bd69b7a5e46e55574e50da65a.jpg"
                      alt=""
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="w-full p-2 text-gray-100 bg-transparent border-b border-gray-600 focus:outline-none focus:border-custom"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full">
                      <img
                        className="bg-gray-300 rounded-full"
                        src="https://i.pinimg.com/474x/a8/8a/3b/a88a3b1bd69b7a5e46e55574e50da65a.jpg"
                        alt=""
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-100">
                          John Smith
                        </h4>
                        <span className="mx-2 text-sm text-gray-400">
                          2 days ago
                        </span>
                      </div>
                      <p className="mt-1 text-gray-300">
                        Great video! These tips are really helpful for new
                        content creators.
                      </p>
                      <div className="flex items-center mt-2 space-x-4">
                        <button className="flex items-center space-x-1 text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
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

                          <span className="text-sm">245</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                            />
                          </svg>
                          <button className="text-sm font-medium text-gray-400">
                            Reply
                          </button>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
