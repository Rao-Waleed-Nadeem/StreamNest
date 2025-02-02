import React from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import {
  FaHome,
  FaCog,
  FaUserCircle,
  FaChartBar,
  FaHistory,
  FaList,
  FaPlus,
  FaUpload,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function SideDrawer({ isOpen, toggleDrawer }) {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const menuItems = [
    { id: "", label: "Home", icon: <FaHome /> },
    {
      id: `channel-page/${user?._id}`,
      label: "My Channel",
      icon: <FaUserCircle />,
    },
    { id: "analytics", label: "Analytics", icon: <FaChartBar /> },
    { id: "history", label: "Watch History", icon: <FaHistory /> },
    { id: "playlists", label: "Playlists", icon: <FaList /> },
    { id: "create-playlist", label: "Create Playlist", icon: <FaPlus /> },
    { id: "upload-video", label: "Upload Video", icon: <FaUpload /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
    { id: "logout", label: "Logout", icon: <FaSignOutAlt /> },
  ];

  const handleClick = (id) => {
    toggleDrawer();
    navigate(`/${id}`);
    console.log(`Navigating to ${id}`); // Replace with actual navigation logic
  };

  return (
    <Drawer
      open={isOpen}
      onClose={toggleDrawer}
      direction="left"
      enableOverlay={true}
      size={280}
      lockBackgroundScroll={true}
      className="w-full"
    >
      <div className="bg-gradient-to-br h-full py-6 from-gray-950 via-[#0f1724] to-gray-950">
        <div className="flex flex-col items-start pt-10 pl-8 pr-3 space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className="flex items-center w-full gap-3 px-4 py-2 text-xl text-left text-white transition-all duration-300 rounded-lg hover:bg-gray-800"
            >
              {item.icon}
              <button>{item.label}</button>
            </button>
          ))}
        </div>
      </div>
    </Drawer>
  );
}

export default SideDrawer;
