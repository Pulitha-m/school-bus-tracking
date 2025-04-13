import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";

const DriverDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Outlet /> {/* This renders the nested page like DriverProfile */}
      </main>
    </div>
  );
};

export default DriverDashboard;
