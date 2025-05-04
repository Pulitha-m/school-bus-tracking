import React from "react";
import {
  UserIcon,
  MapPinIcon,
  ShareIcon,
  CreditCardIcon,
  BellIcon,
  TruckIcon,
  LogOutIcon,
  UsersIcon,
  CalendarIcon,
  BarChart3Icon,
  BusIcon,
  BriefcaseIcon,
  MessageSquareIcon,
  HelpCircleIcon,
  MapIcon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "dashboard", name: "Dashboard", icon: <BarChart3Icon size={20} /> },
    {
      id: "driver-shifts",
      name: "Driver shifts",
      icon: <UserIcon size={20} />,
    },
    {
      id: "students",
      name: "Student Management",
      icon: <UsersIcon size={20} />,
    },
    { id: "drivers", name: "Driver Management", icon: <UserIcon size={20} /> },
    {
      id: "location",
      name: "Location Tracking",
      icon: <MapPinIcon size={20} />,
    },
    {
      id: "attendance",
      name: "Attendance Logs",
      icon: <CalendarIcon size={20} />,
    },
    { id: "vehicles", name: "Vehicle Info", icon: <TruckIcon size={20} /> },
    {
      id: "finance",
      name: "Finance Management",
      icon: <CreditCardIcon size={20} />,
    },
    {
      id: "careers",
      name: "Career Requests",
      icon: <BriefcaseIcon size={20} />,
    },
    { id: "feedback", name: "Feedback", icon: <MessageSquareIcon size={20} /> },
    { id: "inquiries", name: "Inquiries", icon: <HelpCircleIcon size={20} /> },
    {
      id: "routes",
      name: "Route Management",
      icon: <MapIcon size={20} />,
    },
    {
      id: "notifications",
      name: "Notification",
      icon: <BellIcon size={20} />,
    },
    {
      id: "expectedStd",
      name: "Expected Students",
      icon: <UsersIcon size={20} />,
    },
  ];

  const sidebarClasses = `
    bg-amber-50 fixed md:static inset-y-0 left-0 transform 
    ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
    md:translate-x-0 transition duration-200 ease-in-out
    z-30 w-72 overflow-y-auto flex flex-col
  `;

  return (
    <>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      <aside className={sidebarClasses}>
        {/* Header */}
        <div className="p-4 border-b border-amber-100 flex items-center">
          <BusIcon className="h-6 w-6 text-amber-500" />
          <span className="ml-2 font-bold text-xl">SchoolBus</span>
        </div>

        {/* Navigation */}
        <div className="p-2 text-xs text-gray-500 uppercase">Navigation</div>
        <nav className="flex-1">
          <ul>
            {navItems.map((item) => {
              const isActive = location.pathname.includes(item.id);
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      navigate(`/admin/${item.id}`);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full py-3 px-4 hover:bg-amber-100 transition-colors 
                      ${
                        isActive ? "bg-amber-400 text-white" : "text-gray-700"
                      }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-amber-100">
          <button
            className="flex items-center text-gray-700 hover:text-gray-900"
            onClick={() => {
              console.log("Logout clicked");
              // Add your logout logic here
            }}
          >
            <LogOutIcon size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
