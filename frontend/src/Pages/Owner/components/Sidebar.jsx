import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  BanknoteIcon,
  TruckIcon,
  BriefcaseIcon,
  MessageSquareIcon,
  MessageCircleIcon,
  MapIcon,
  LogOutIcon,
} from "lucide-react";

const Sidebar = ({ mobile = false, onLinkClick = () => {} }) => {
  const location = useLocation();
  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: <HomeIcon size={20} />,
    },
    {
      path: "/finance",
      label: "Finance Management",
      icon: <BanknoteIcon size={20} />,
    },
    {
      path: "/vehicles",
      label: "Vehicle Management",
      icon: <TruckIcon size={20} />,
    },
    {
      path: "/career-requests",
      label: "Career Requests",
      icon: <BriefcaseIcon size={20} />,
    },
    {
      path: "/messages",
      label: "Admin Messages",
      icon: <MessageSquareIcon size={20} />,
    },
    {
      path: "/feedback",
      label: "Feedback",
      icon: <MessageCircleIcon size={20} />,
    },
    {
      path: "/vehicle-location",
      label: "Vehicle Location",
      icon: <MapIcon size={20} />,
    },
  ];
  const isActive = (path) => location.pathname === path;
  return (
    <div
      className={`bg-[#FFF8E7] h-full w-64 flex flex-col ${
        mobile ? "pt-16" : ""
      }`}
    >
      <div className="flex items-center p-4 mb-4">
        <div className="p-2 bg-amber-500 rounded-md">
          <TruckIcon className="text-white" size={24} />
        </div>
        <h1 className="ml-3 text-xl font-bold text-gray-800">SchoolBus</h1>
      </div>
      <div className="px-4 mb-2 text-sm font-medium text-gray-500 uppercase">
        Navigation
      </div>
      <nav className="flex-1">
        <ul className="px-2">
          {menuItems.map((item) => (
            <li key={item.path} className="mb-1">
              <Link
                to={item.path}
                onClick={onLinkClick}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-amber-500 text-white"
                    : "text-gray-700 hover:bg-amber-100"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
                {item.label === "Admin Messages" && (
                  <span className="flex items-center justify-center w-5 h-5 ml-auto text-xs font-medium text-white bg-red-500 rounded-full">
                    3
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 mt-auto">
        <button className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-amber-100">
          <LogOutIcon size={20} className="mr-3" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
