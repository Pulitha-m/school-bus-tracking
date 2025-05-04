import React from "react";
import {
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  FileTextIcon,
  BusIcon,
  LogOutIcon,
  BellIcon,
  CreditCardIcon,
  MessageSquareIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const navigate = useNavigate();

  const navItems = [
    {
      id: "profile",
      label: "Student Profile",
      icon: <UserIcon size={20} />,
      path: "profile",
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: <CalendarIcon size={20} />,
      path: "attendance",
    },
    {
      id: "location",
      label: "Bus Location",
      icon: <MapPinIcon size={20} />,
      path: "buslocation",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <BellIcon size={20} />,
      path: "notifications",
      badge: 3,
    },
    {
      id: "payments",
      label: "Payments",
      icon: <CreditCardIcon size={20} />,
      path: "payments",
    },
    {
      id: "feedback",
      label: "Feedback",
      icon: <MessageSquareIcon size={20} />,
      path: "feedback",
    },
    {
      id: "MarkAttendance",
      label: "MarkAttendance",
      icon: <FileTextIcon size={20} />,
      path: "MarkAttendance",
    },
  ];

  const handleSignOut = () => {
    navigate("/auth");
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
        } md:translate-x-0 fixed md:sticky top-0 h-full w-64 bg-amber-100 border-r border-amber-200 flex flex-col transition-transform duration-300 ease-in-out z-50`}
      >
        {/* Header */}
        <div className="p-4 flex items-center space-x-3 border-b border-amber-200">
          <BusIcon className="h-8 w-8 text-amber-500" />
          <h1 className="text-xl font-bold text-gray-800">SchoolBus</h1>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Navigation
          </h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-amber-500 text-white"
                      : "text-gray-700 hover:bg-amber-200 hover:text-gray-900"
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sign Out */}
        <div className="p-4 border-t border-amber-200">
          <button
            onClick={handleSignOut}
            className="flex items-center px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-700 hover:bg-amber-200 transition-colors"
          >
            <LogOutIcon size={20} className="mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
