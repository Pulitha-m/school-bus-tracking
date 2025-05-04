import React from "react";
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
  Clock10Icon,
  QrCodeIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  const navItems = [
    {
      id: "profile",
      label: "Driver Profile",
      icon: <UserIcon size={20} />,
      path: "driver/profile",
    },
    {
      id: "students",
      label: "Student Management",
      icon: <UsersIcon size={20} />,
      path: "driver/students",
    },
    {
      id: "location",
      label: "Location Tracking",
      icon: <MapPinIcon size={20} />,
      path: "driver/location",
    },
    {
      id: "sharelocation",
      label: "Share Location",
      icon: <ShareIcon size={20} />,
      path: "driver/sharelocation",
    },
    {
      id: "payments",
      label: "Payments",
      icon: <BanknoteIcon size={20} />,
      path: "payments",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <BellIcon size={20} />,
      path: "driver/notifications",
    },
    {
      id: "vehicle",
      label: "Vehicle Info",
      icon: <TruckIcon size={20} />,
      path: "vehicle",
    },
    {
      id: "shift",
      label: "Driver Shift",
      icon: <Clock10Icon size={20} />,
      path: "driver/shift",
    },
    {
      id: "QR",
      label: "QR Scanner",
      icon: <QrCodeIcon size={20} />,
      path: "driver/qrcode",
    },
    {
      id: "exstudent",
      label: "Expected Students",
      icon: <UsersIcon size={20} />,
      path: "driver/exstudent",
    },
  ];

  const handleLogout = () => {
    console.log("Logging out...");
    // Add actual logout logic
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-amber-500 text-white rounded-lg"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:sticky top-0 h-full w-64 bg-amber-50 border-r border-amber-100 flex flex-col transition-transform duration-300 ease-in-out z-50`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-amber-100">
          <BusIcon className="text-amber-500" size={24} />
          <h1 className="text-xl font-bold text-gray-800">SchoolBus</h1>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-2 mt-4">
          <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
            Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center w-full px-3 py-2.5 rounded-lg text-left transition-colors ${
                  isActive(item.path)
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
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout */}
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