import React, { useState } from "react";
import {
  UserIcon,
  UsersIcon,
  BellIcon,
  BanknoteIcon,
  TruckIcon,
  BusIcon,
  MapPinIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  ShareIcon,
} from "lucide-react";

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [
    {
      id: "profile",
      label: "Driver Profile",
      icon: <UserIcon size={20} />,
    },
    {
      id: "students",
      label: "Student Management",
      icon: <UsersIcon size={20} />,
    },
    {
      id: "location",
      label: "Location Tracking",
      icon: <MapPinIcon size={20} />,
    },
    {
      id: "sharelocation",
      label: "Share Location",
      icon: <ShareIcon size={20} />,
    },
    {
      id: "payments",
      label: "Payments",
      icon: <BanknoteIcon size={20} />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <BellIcon size={20} />,
    },
    {
      id: "vehicle",
      label: "Vehicle Info",
      icon: <TruckIcon size={20} />,
    },
  ];

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-amber-500 text-white rounded-lg"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
      </button>
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:sticky top-0 h-full w-64 bg-amber-50 border-r border-amber-100 flex flex-col transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 flex items-center gap-3 border-b border-amber-100">
          <BusIcon className="text-amber-500" size={24} />
          <h1 className="text-xl font-bold text-gray-800">SchoolBus</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-2 mt-4">
          <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
            Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2.5 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? "bg-amber-400 text-white font-medium"
                    : "text-gray-700 hover:bg-amber-100"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
                {item.id === "notifications" && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    3
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-amber-100 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 rounded-lg text-left text-gray-700 hover:bg-amber-100 transition-colors"
          >
            <LogOutIcon size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};
