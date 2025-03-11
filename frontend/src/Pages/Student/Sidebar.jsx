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
} from "lucide-react";

export function Sidebar({ activeSection, setActiveSection }) {
  const navItems = [
    {
      id: "profile",
      label: "Student Profile",
      icon: <UserIcon size={20} />,
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: <CalendarIcon size={20} />,
    },
    {
      id: "location",
      label: "Bus Location",
      icon: <MapPinIcon size={20} />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <BellIcon size={20} />,
      badge: 3,
    },
    {
      id: "payments",
      label: "Payments",
      icon: <CreditCardIcon size={20} />,
    },
    {
      id: "feedback",
      label: "Feedback",
      icon: <MessageSquareIcon size={20} />,
    },
    {
      id: "notes",
      label: "Driver Notes",
      icon: <FileTextIcon size={20} />,
    },
  ];

  return (
    <div className="w-64 h-full bg-amber-100 border-r border-amber-200 flex flex-col">
      <div className="p-4 flex items-center space-x-3 border-b border-amber-200">
        <BusIcon className="h-8 w-8 text-amber-500" />
        <h1 className="text-xl font-bold text-gray-800">SchoolBus</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Navigation
        </h2>
        <nav className="mt-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? "bg-amber-500 text-white"
                  : "text-gray-700 hover:bg-amber-200"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-amber-200">
        <button className="flex items-center px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-700 hover:bg-amber-200 transition-colors">
          <LogOutIcon size={20} className="mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
