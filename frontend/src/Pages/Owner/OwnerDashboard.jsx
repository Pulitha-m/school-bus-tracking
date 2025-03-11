import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./Dashboard";
import FinanceManagement from "./FinanceManagement";
import VehicleManagement from "./VehicleManagement";
import CareerRequests from "./CareerRequests";
import Messages from "./Messages";
import Feedback from "./Feeback";
import VehicleLocation from "./VehicleLocation";
import MobileHeader from "./components/MobileHeader";

const OwnerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1">
        <div className="md:hidden">
          <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
        </div>
        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 flex w-[280px] max-w-[80vw]">
              <div className="relative flex w-full flex-col bg-[#FFF8E7]">
                <div className="absolute top-0 right-0 -mr-12 pt-4">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full focus:outline-none"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <Sidebar
                  mobile={true}
                  onLinkClick={() => setSidebarOpen(false)}
                />
              </div>
            </div>
          </div>
        )}
        {/* Main Content */}
        <div className="h-[calc(100vh-64px)] md:h-screen overflow-y-auto">
          <div className="container mx-auto px-4 py-4 md:px-6 md:py-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/finance" element={<FinanceManagement />} />
              <Route path="/vehicles" element={<VehicleManagement />} />
              <Route path="/career-requests" element={<CareerRequests />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/vehicle-location" element={<VehicleLocation />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
